import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { MissionApi } from '../state/useMission'
import { PlayShell } from './ui/PlayShell'
import { ChunkyButton } from './ui/ChunkyButton'
import { NumericInputPad } from './ui/NumericInputPad'
import { sfx } from '../logic/sfx'
import { scoreDotProduct } from '../logic/scoreDotProduct'
import { DOT_PRODUCT_TASKS } from '../content/dotProductTasks'
import type { PerStepStars, ScoreSnap } from '../types/game'

type CheckState = 'idle' | 'correct' | 'wrong'

const STARS_PATTERN: Array<{ filled: boolean; delay: number }> = [
  { filled: false, delay: 0 },
  { filled: false, delay: 0.12 },
]

export function DotProductScreen({ mission }: { mission: MissionApi }) {
  const task = DOT_PRODUCT_TASKS[0]
  const [answer, setAnswer] = useState<string>('')
  const [checked, setChecked] = useState<CheckState>('idle')
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [starAnim, setStarAnim] = useState(0)
  const hiddenInputRef = useRef<HTMLInputElement>(null)

  const pairs = useMemo(() => {
    return task.vectorA.map((a, i) => {
      const b = task.vectorB[i]!
      return { a, b, product: a * b, labelA: task.labelsA[i]!, labelB: task.labelsB[i]! }
    })
  }, [task])

  const total = useMemo(() => pairs.reduce((s, p) => s + p.product, 0), [pairs])

  const handleSpeak = () => {
    mission.speak(task.contextText)
  }

  const handleCheck = () => {
    const numeric = answer === '' ? null : Number(answer)
    const { correct, stars } = scoreDotProduct(task, numeric)
    setShowBreakdown(true)
    if (correct) {
      sfx.tada()
      setChecked('correct')
      mission.setCoach('cheer', `Boom! A · B = ${total}. That's exactly how a neuron computes its weighted sum. Stage 1 complete!`)
      setStarAnim(Date.now())
      const prevSnap = mission.scoreSnap
      const perStep: PerStepStars = {
        dotProduct: stars,
        matrixFill: prevSnap?.perStep?.matrixFill ?? 0,
        forwardPass: prevSnap?.perStep?.forwardPass ?? 0,
        lossCalc: prevSnap?.perStep?.lossCalc ?? 0,
        chainRule: prevSnap?.perStep?.chainRule ?? 0,
        xorTraining: prevSnap?.perStep?.xorTraining ?? 0,
      }
      const stageAccuracy = {
        dotProduct: { correct: 1, total: 1 },
        matrixFill: prevSnap?.stageAccuracy?.matrixFill ?? { correct: 0, total: 0 },
        forwardPass: prevSnap?.stageAccuracy?.forwardPass ?? { correct: 0, total: 0 },
        lossCalc: prevSnap?.stageAccuracy?.lossCalc ?? { correct: 0, total: 0 },
        chainRule: prevSnap?.stageAccuracy?.chainRule ?? { correct: 0, total: 0 },
        xorTraining: prevSnap?.stageAccuracy?.xorTraining ?? { correct: 0, total: 0 },
      }
      const totalStars = Object.values(perStep).reduce((s, v) => s + v, 0)
      const snap: ScoreSnap = {
        correct: (prevSnap?.correct ?? 0) + 1,
        possible: (prevSnap?.possible ?? 0) + 1,
        stars: totalStars,
        perStep,
        overallStars: Math.min(5, Math.ceil(totalStars / 2)) as ScoreSnap['overallStars'],
        stageAccuracy,
      }
      mission.setScoreSnap(snap)
    } else {
      sfx.error()
      setChecked('wrong')
      setWrongAttempts((n) => n + 1)
      const attempts = wrongAttempts + 1
      let hint = 'Not quite. Remember: multiply each matching pair, then add all results together.'
      if (attempts >= 2) {
        hint = `Hint: Start with ${task.vectorA[0]} × ${task.vectorB[0]} = ${task.vectorA[0]! * task.vectorB[0]!}, then do the other two pairs, then sum!`
      }
      if (attempts >= 3) {
        hint = `Breakdown: ${pairs.map(p => `${p.a}×${p.b}=${p.product}`).join(' + ')} = ?`
      }
      mission.setCoach('oops', hint)
    }
  }

  const handleAdvance = () => {
    sfx.whoosh()
    mission.advanceStage('matrixFill')
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (checked === 'correct') return
      if (e.key === 'Enter') {
        e.preventDefault()
        if (answer !== '') handleCheck()
        return
      }
      if (e.key === 'Backspace') {
        e.preventDefault()
        setAnswer((a) => a.slice(0, -1))
        if (checked !== 'idle') setChecked('idle')
        return
      }
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault()
        setAnswer((a) => a + e.key)
        if (checked !== 'idle') setChecked('idle')
        return
      }
      if (e.key === '.' && !answer.includes('.')) {
        e.preventDefault()
        setAnswer((a) => (a === '' ? '0.' : a + '.'))
        if (checked !== 'idle') setChecked('idle')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [answer, checked])

  const starLayout = checked === 'correct'
    ? STARS_PATTERN.map((s, i) => ({ ...s, filled: i < 2 }))
    : STARS_PATTERN

  return (
    <PlayShell
      stageLabel="STAGE 1 · Vectors as Data"
      stageNumber={1}
      totalStages={6}
      progress="1 / 6"
      coachMood={mission.coachMood}
      coachLine={mission.coachLine}
      muted={mission.muted}
      onToggleMute={mission.toggleMute}
      onSpeak={handleSpeak}
      footer={
        checked === 'correct' && (
          <div className="flex justify-end">
            <ChunkyButton variant="cyan" size="xl" onClick={handleAdvance}>
              Next Stage →
            </ChunkyButton>
          </div>
        )
      }
    >
      <div className="flex flex-col gap-4 pb-2 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          className="rounded-2xl bg-glass-bg p-4 ring-2 ring-glass-ring backdrop-blur-md shadow-panel sm:p-5"
        >
          <h2 className="mb-2 font-display text-lg font-extrabold text-neon-cyan sm:text-xl">
            {task.title}
          </h2>
          <p className="text-sm leading-relaxed text-ink-2 sm:text-base">{task.contextText}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: [0.2, 0.8, 0.2, 1] }}
          className="rounded-2xl bg-glass-bg p-4 ring-2 ring-glass-ring backdrop-blur-md shadow-panel sm:p-6"
        >
          <div className="mb-6">
            <p className="mb-2 font-display text-sm font-bold tracking-wider text-neon-fuchsia">
              VECTOR A
            </p>
            <div className="grid gap-2 sm:gap-3" style={{ gridTemplateColumns: `repeat(${pairs.length}, minmax(0,1fr))` }}>
              {pairs.map((p, i) => (
                <motion.div
                  key={`va-${i}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, delay: 0.12 + i * 0.06 }}
                  className="relative flex flex-col items-center rounded-xl p-2 ring-2 backdrop-blur sm:p-3"
                  style={{
                    background: 'linear-gradient(135deg, rgba(168,85,247,0.28) 0%, rgba(124,58,237,0.18) 100%)',
                    boxShadow: '0 0 20px rgba(168,85,247,0.25)',
                    borderColor: 'rgba(168,85,247,0.55)',
                  }}
                >
                  <span className="mb-1 font-display text-[10px] font-bold uppercase tracking-wider text-white/70 sm:text-xs">
                    {p.labelA}
                  </span>
                  <span className="font-display text-2xl font-extrabold text-white sm:text-3xl">
                    {p.a}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="mb-2 font-display text-sm font-bold tracking-wider text-neon-cyan">
              VECTOR B
            </p>
            <div className="grid gap-2 sm:gap-3" style={{ gridTemplateColumns: `repeat(${pairs.length}, minmax(0,1fr))` }}>
              {pairs.map((p, i) => (
                <motion.div
                  key={`vb-${i}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, delay: 0.22 + i * 0.06 }}
                  className="relative flex flex-col items-center rounded-xl p-2 ring-2 backdrop-blur sm:p-3"
                  style={{
                    background: 'linear-gradient(135deg, rgba(34,211,238,0.22) 0%, rgba(124,58,237,0.16) 100%)',
                    boxShadow: '0 0 20px rgba(34,211,238,0.2)',
                    borderColor: 'rgba(34,211,238,0.55)',
                  }}
                >
                  <span className="mb-1 font-display text-[10px] font-bold uppercase tracking-wider text-white/70 sm:text-xs">
                    {p.labelB}
                  </span>
                  <span className="font-display text-2xl font-extrabold text-white sm:text-3xl">
                    {p.b}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mb-5 rounded-xl border border-glass-ring bg-paper-2/40 p-3 sm:p-4">
            <p className="mb-3 font-display text-sm font-bold tracking-wider text-neon-amber sm:text-base">
              MULTIPLY PAIRS &amp; SUM
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {pairs.map((p, i) => (
                <motion.div
                  key={`pair-${i}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={showBreakdown ? { opacity: 1, y: 0 } : { opacity: 0.55, y: 0 }}
                  transition={{ duration: 0.3, delay: showBreakdown ? i * 0.18 : 0.05 + i * 0.06 }}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 sm:gap-2.5 sm:px-3 sm:py-2"
                  style={{
                    background: showBreakdown
                      ? 'linear-gradient(135deg, rgba(163,230,53,0.22), rgba(34,211,238,0.18))'
                      : 'rgba(255,255,255,0.04)',
                    border: showBreakdown ? '2px solid rgba(163,230,53,0.55)' : '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <span className="font-display text-sm font-bold text-neon-fuchsia sm:text-base">
                    {p.a}
                  </span>
                  <motion.span
                    animate={showBreakdown ? { scale: [1, 1.25, 1], color: '#A3E635' } : {}}
                    transition={{ duration: 0.35, delay: showBreakdown ? i * 0.18 + 0.08 : 0 }}
                    className="font-display text-sm font-bold text-white/70 sm:text-base"
                  >
                    ×
                  </motion.span>
                  <span className="font-display text-sm font-bold text-neon-cyan sm:text-base">
                    {p.b}
                  </span>
                  <AnimatePresence>
                    {showBreakdown && (
                      <motion.span
                        key={`eq-${i}-${starAnim}`}
                        initial={{ opacity: 0, x: -4, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.18 + 0.16 }}
                        className="flex items-center gap-1"
                      >
                        <span className="font-display text-sm font-bold text-white/70 sm:text-base">
                          =
                        </span>
                        <span className="font-display text-sm font-extrabold text-neon-lime sm:text-base" style={{ textShadow: '0 0 10px rgba(163,230,53,0.6)' }}>
                          {p.product}
                        </span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {i < pairs.length - 1 && (
                    <span className="ml-1 font-display text-base font-bold text-white/60 sm:text-xl">
                      +
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
            <AnimatePresence>
              {showBreakdown && (
                <motion.div
                  key={`total-${starAnim}`}
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: pairs.length * 0.18 + 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                  className="mt-4 flex items-center justify-center gap-3"
                >
                  <span className="font-display text-2xl font-extrabold text-white/80 sm:text-3xl">
                    =
                  </span>
                  <span
                    className="rounded-xl px-5 py-2 font-display text-3xl font-extrabold text-paper sm:text-4xl"
                    style={{
                      background: 'linear-gradient(135deg, #A3E635 0%, #22D3EE 100%)',
                      boxShadow: '0 0 28px rgba(163,230,53,0.6), 0 0 2px rgba(34,211,238,0.9)',
                    }}
                  >
                    {total}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mb-4">
            <label
              htmlFor="dot-answer-hidden"
              className="mb-2 block font-display text-sm font-bold tracking-wider text-white/80 sm:text-base"
            >
              YOUR ANSWER
            </label>
            <div
              className="relative cursor-text rounded-xl bg-paper-2/70 p-3 ring-2 transition sm:p-4"
              style={{
                borderColor: checked === 'correct' ? 'rgba(163,230,53,0.7)' : checked === 'wrong' ? 'rgba(244,114,182,0.7)' : 'rgba(124,58,237,0.45)',
                boxShadow: checked === 'correct'
                  ? '0 0 22px rgba(163,230,53,0.4)'
                  : checked === 'wrong'
                    ? '0 0 22px rgba(244,114,182,0.35)'
                    : '0 0 14px rgba(124,58,237,0.2)',
                // ring: same values
              }}
              onClick={() => hiddenInputRef.current?.focus()}
            >
              <div className="min-h-[44px] text-right font-display text-3xl font-extrabold tracking-wide text-white sm:min-h-[52px] sm:text-4xl" style={{ minHeight: 44 }}>
                {answer || <span className="text-white/25">0</span>}
              </div>
              <input
                id="dot-answer-hidden"
                ref={hiddenInputRef}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                aria-label="Dot product answer"
                className="absolute inset-0 h-full w-full cursor-text opacity-0"
                value={answer}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9.]/g, '')
                  const parts = v.split('.')
                  const cleaned = parts[0] + (parts.length > 1 ? '.' + parts.slice(1).join('') : '')
                  setAnswer(cleaned)
                  if (checked !== 'idle') setChecked('idle')
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    if (answer !== '' && checked !== 'correct') handleCheck()
                  }
                }}
              />
            </div>
          </div>

          <div className="mb-2 sm:mb-4">
            <NumericInputPad
              variant="cyan"
              value={answer}
              onChange={(v) => {
                setAnswer(v)
                if (checked !== 'idle') setChecked('idle')
              }}
              onSubmit={answer !== '' && checked !== 'correct' ? handleCheck : undefined}
              allowDecimal={true}
              allowNegative={false}
              disabled={checked === 'correct'}
            />
          </div>

          {checked !== 'correct' && (
            <div className="mt-2 flex justify-center">
              <ChunkyButton
                variant="fuchsia"
                size="lg"
                onClick={handleCheck}
                disabled={answer === ''}
              >
                ✓ Check Answer
              </ChunkyButton>
            </div>
          )}

          <AnimatePresence>
            {checked === 'correct' && (
              <motion.div
                key="stars-success"
                initial={{ opacity: 0, y: 16, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                className="mt-5 rounded-xl p-4 ring-2"
                style={{
                  background: 'linear-gradient(135deg, rgba(163,230,53,0.18), rgba(34,211,238,0.14))',
                  borderColor: 'rgba(163,230,53,0.55)',
                  boxShadow: '0 0 22px rgba(163,230,53,0.3)',
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <p className="font-display text-lg font-extrabold text-neon-lime sm:text-xl">
                    ✨ CORRECT! Stage 1 Cleared ✨
                  </p>
                  <div className="flex items-center gap-2 sm:gap-3">
                    {starLayout.map((s, idx) => (
                      <motion.span
                        key={`star-${idx}-${starAnim}`}
                        initial={{ scale: 0, rotate: -40 }}
                        animate={s.filled ? { scale: 1, rotate: 0 } : { scale: 0.6, rotate: 0, opacity: 0.3 }}
                        transition={{
                          duration: 0.5,
                          delay: 0.2 + s.delay,
                          ease: [0.2, 0.8, 0.2, 1],
                          type: s.filled ? 'spring' : undefined,
                          stiffness: s.filled ? 260 : undefined,
                        }}
                        className="text-4xl sm:text-5xl"
                        style={{
                          color: s.filled ? '#FBBF24' : '#6B7280',
                          filter: s.filled ? 'drop-shadow(0 0 12px rgba(251,191,36,0.85))' : 'none',
                        }}
                      >
                        ★
                      </motion.span>
                    ))}
                  </div>
                  <p className="text-sm text-ink-2">
                    Earned <span className="font-bold text-neon-lime">2 / 2</span> stars for Stage 1
                  </p>
                </div>
              </motion.div>
            )}
            {checked === 'wrong' && (
              <motion.div
                key="wrong-hint"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-5 rounded-xl p-4 ring-2"
                style={{
                  background: 'rgba(244,114,182,0.12)',
                  borderColor: 'rgba(244,114,182,0.55)',
                }}
              >
                <p className="text-center font-display font-bold text-bad sm:text-lg">
                  Not quite — keep going!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </PlayShell>
  )
}
