import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { MissionApi } from '../state/useMission'
import { PlayShell } from './ui/PlayShell'
import { ChunkyButton } from './ui/ChunkyButton'
import { NumericInputPad } from './ui/NumericInputPad'
import { sfx } from '../logic/sfx'
import { scoreLoss } from '../logic/scoreLoss'
import { LOSS_TASKS } from '../content/lossTasks'
import type { PerStepStars, ScoreSnap } from '../types/game'

type CheckState = 'idle' | 'correct' | 'wrong'

const STARS_PATTERN: Array<{ filled: boolean; delay: number }> = [
  { filled: false, delay: 0 },
  { filled: false, delay: 0.12 },
]

export function LossScreen({ mission }: { mission: MissionApi }) {
  const task = LOSS_TASKS[0]
  const [answer, setAnswer] = useState<string>('')
  const [checked, setChecked] = useState<CheckState>('idle')
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [showSteps, setShowSteps] = useState(false)
  const [starAnim, setStarAnim] = useState(0)
  const hiddenInputRef = useRef<HTMLInputElement>(null)

  const handleSpeak = () => {
    mission.speak(task.contextText)
  }

  const handleCheck = () => {
    const numeric = answer === '' ? null : Number(answer)
    const { correct, stars } = scoreLoss(task, numeric)
    setShowSteps(true)
    if (correct) {
      sfx.tada()
      setChecked('correct')
      mission.setCoach(
        'cheer',
        `Spot on! ℒ = −log(0.8) ≈ ${task.correctAnswer.toFixed(3)}. Cross-entropy tells us how confidently wrong the network was. Stage 4 complete!`,
      )
      setStarAnim(Date.now())
      const prevSnap = mission.scoreSnap
      const perStep: PerStepStars = {
        dotProduct: prevSnap?.perStep?.dotProduct ?? 0,
        matrixFill: prevSnap?.perStep?.matrixFill ?? 0,
        forwardPass: prevSnap?.perStep?.forwardPass ?? 0,
        lossCalc: stars,
        chainRule: prevSnap?.perStep?.chainRule ?? 0,
        xorTraining: prevSnap?.perStep?.xorTraining ?? 0,
      }
      const stageAccuracy = {
        dotProduct: prevSnap?.stageAccuracy?.dotProduct ?? { correct: 0, total: 0 },
        matrixFill: prevSnap?.stageAccuracy?.matrixFill ?? { correct: 0, total: 0 },
        forwardPass: prevSnap?.stageAccuracy?.forwardPass ?? { correct: 0, total: 0 },
        lossCalc: { correct: 1, total: 1 },
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
      let hint = 'Not quite. Remember: cross-entropy when y=1 is just −log(output). Use natural log (ln)!'
      if (attempts >= 2) {
        hint = `Hint: −log(0.8) means "what power do I raise e to get 0.8?" Since e^−0.223 ≈ 0.8, the answer ≈ 0.223.`
      }
      if (attempts >= 3) {
        hint = `Answer range: any number between ${(task.correctAnswer - task.tolerance).toFixed(4)} and ${(task.correctAnswer + task.tolerance).toFixed(4)} is accepted.`
      }
      mission.setCoach('oops', hint)
    }
  }

  const handleAdvance = () => {
    sfx.whoosh()
    mission.advanceStage('chainRule')
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
      if (e.key === '-' && answer === '') {
        e.preventDefault()
        setAnswer('-')
        if (checked !== 'idle') setChecked('idle')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [answer, checked])

  const starLayout =
    checked === 'correct'
      ? STARS_PATTERN.map((s, i) => ({ ...s, filled: i < 2 }))
      : STARS_PATTERN

  const lossBarPct = checked === 'correct' ? Math.min(100, Math.max(0, 100 - task.correctAnswer * 100)) : 0

  return (
    <PlayShell
      stageLabel="STAGE 4 · Compute the Loss"
      stageNumber={4}
      totalStages={6}
      progress="4 / 6"
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
          <div className="mb-6 grid gap-3 sm:grid-cols-2 sm:gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.28, delay: 0.1 }}
              className="relative flex flex-col items-center rounded-xl p-4 ring-2 backdrop-blur sm:p-5"
              style={{
                background:
                  'linear-gradient(135deg, rgba(168,85,247,0.28) 0%, rgba(124,58,237,0.18) 100%)',
                borderColor: 'rgba(168,85,247,0.55)',
                boxShadow: '0 0 22px rgba(168,85,247,0.28)',
              }}
            >
              <span className="mb-1 font-display text-[10px] font-bold uppercase tracking-[0.18em] text-neon-fuchsia sm:text-xs">
                Network Output ŷ
              </span>
              <span className="font-display text-4xl font-extrabold text-white sm:text-5xl">
                {task.outputValue}
              </span>
              <div className="mt-2 flex gap-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={`out-${i}`}
                    initial={{ scaleY: 0.2 }}
                    animate={{ scaleY: [0.2, 0.4 + task.outputValue * 0.6, 0.2 + (i % 2) * 0.3] }}
                    transition={{
                      duration: 1.2,
                      delay: i * 0.06,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="h-5 w-1.5 rounded-full bg-neon-fuchsia"
                    style={{
                      boxShadow: '0 0 8px rgba(232,121,249,0.7)',
                    }}
                  />
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.28, delay: 0.16 }}
              className="relative flex flex-col items-center rounded-xl p-4 ring-2 backdrop-blur sm:p-5"
              style={{
                background:
                  'linear-gradient(135deg, rgba(163,230,53,0.26) 0%, rgba(34,211,238,0.18) 100%)',
                borderColor: 'rgba(163,230,53,0.55)',
                boxShadow: '0 0 22px rgba(163,230,53,0.28)',
              }}
            >
              <span className="mb-1 font-display text-[10px] font-bold uppercase tracking-[0.18em] text-neon-lime sm:text-xs">
                True Label y
              </span>
              <span className="font-display text-4xl font-extrabold text-white sm:text-5xl">
                {task.trueLabel}
              </span>
              <div className="mt-2 flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-neon-lime animate-pulse" style={{ boxShadow: '0 0 10px rgba(163,230,53,0.8)' }} />
                <span className="font-display text-xs font-bold text-neon-lime sm:text-sm">GROUND TRUTH</span>
              </div>
            </motion.div>
          </div>

          <div className="mb-5 rounded-xl border border-glass-ring bg-paper-2/40 p-3 sm:p-4">
            <p className="mb-3 font-display text-sm font-bold tracking-wider text-neon-amber sm:text-base">
              CROSS-ENTROPY FORMULA (y = 1)
            </p>
            <motion.div
              animate={showSteps ? { scale: [1, 1.03, 1] } : {}}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center gap-3"
            >
              <div
                className="rounded-xl px-5 py-3 font-display text-2xl font-extrabold text-white sm:text-3xl"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(34,211,238,0.22), rgba(168,85,247,0.22))',
                  border: '2px solid rgba(34,211,238,0.5)',
                }}
              >
                ℒ = −log(<span className="text-neon-fuchsia">ŷ</span>) = −log(<span className="text-neon-fuchsia">{task.outputValue}</span>)
              </div>
              <AnimatePresence>
                {showSteps && (
                  <motion.div
                    key={`loss-eval-${starAnim}`}
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                    className="flex w-full flex-col items-center gap-3"
                  >
                    <div
                      className="rounded-xl px-5 py-2.5 font-display text-xl font-extrabold sm:text-2xl"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(244,114,182,0.18))',
                        border: '2px solid rgba(251,191,36,0.5)',
                      }}
                    >
                      ≈ <span className="text-neon-amber">−</span>(<span className="text-neon-lime">−{task.correctAnswer.toFixed(3)}</span>)
                    </div>
                    <div
                      className="rounded-xl px-6 py-3 font-display text-3xl font-extrabold text-paper sm:text-4xl"
                      style={{
                        background: 'linear-gradient(135deg, #FBBF24 0%, #F472B6 50%, #22D3EE 100%)',
                        boxShadow: '0 0 32px rgba(251,191,36,0.55), 0 0 2px rgba(34,211,238,0.9)',
                      }}
                    >
                      ≈ {task.correctAnswer.toFixed(3)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <AnimatePresence>
              {showSteps && (
                <motion.div
                  key="lossmeter"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="mt-5"
                >
                  <p className="mb-2 flex items-center justify-between font-display text-xs font-bold tracking-wider text-white/70 sm:text-sm">
                    <span>0 (perfect)</span>
                    <span className="text-neon-amber">LOSS METER</span>
                    <span>~0.7 (bad)</span>
                  </p>
                  <div className="relative h-5 w-full overflow-hidden rounded-full bg-paper/60 ring-2 ring-glass-ring">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        background:
                          'linear-gradient(90deg, #A3E635 0%, #FBBF24 55%, #F472B6 100%)',
                      }}
                    />
                    <motion.div
                      initial={{ left: '100%' }}
                      animate={{ left: `${lossBarPct}%` }}
                      transition={{ duration: 0.9, delay: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
                      className="absolute top-1/2 -translate-y-1/2 h-7 w-2 -translate-x-1/2 rounded-full bg-white shadow-lg ring-2 ring-post"
                      style={{ boxShadow: '0 0 16px rgba(255,255,255,0.9)' }}
                    />
                  </div>
                  <p className="mt-2 text-center text-xs text-ink-2 sm:text-sm">
                    Loss <span className="font-bold text-neon-amber">{task.correctAnswer.toFixed(3)}</span> —{' '}
                    <span className="font-bold text-neon-lime">pretty good! ŷ was close to y=1.</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mb-4">
            <label
              htmlFor="loss-answer-hidden"
              className="mb-2 block font-display text-sm font-bold tracking-wider text-white/80 sm:text-base"
            >
              YOUR ANSWER (within ±{task.tolerance})
            </label>
            <div
              className="relative cursor-text rounded-xl bg-paper-2/70 p-3 ring-2 transition sm:p-4"
              style={{
                borderColor:
                  checked === 'correct'
                    ? 'rgba(163,230,53,0.7)'
                    : checked === 'wrong'
                      ? 'rgba(244,114,182,0.7)'
                      : 'rgba(124,58,237,0.45)',
                boxShadow:
                  checked === 'correct'
                    ? '0 0 22px rgba(163,230,53,0.4)'
                    : checked === 'wrong'
                      ? '0 0 22px rgba(244,114,182,0.35)'
                      : '0 0 14px rgba(124,58,237,0.2)',
              }}
              onClick={() => hiddenInputRef.current?.focus()}
            >
              <div
                className="min-h-[44px] text-right font-display text-3xl font-extrabold tracking-wide text-white sm:min-h-[52px] sm:text-4xl"
                style={{ minHeight: 44 }}
              >
                {answer || <span className="text-white/25">0.000</span>}
              </div>
              <input
                id="loss-answer-hidden"
                ref={hiddenInputRef}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                aria-label="Loss answer"
                className="absolute inset-0 h-full w-full cursor-text opacity-0"
                value={answer}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9.-]/g, '')
                  let cleaned = v
                  const dashCount = (cleaned.match(/-/g) || []).length
                  if (dashCount > 1 || (dashCount === 1 && !cleaned.startsWith('-'))) {
                    cleaned = cleaned.replace(/-/g, '')
                  }
                  if (cleaned.startsWith('-') && cleaned.length > 1) {
                    const body = cleaned.slice(1)
                    const parts = body.split('.')
                    cleaned = '-' + parts[0] + (parts.length > 1 ? '.' + parts.slice(1).join('') : '')
                  } else {
                    const parts = cleaned.split('.')
                    cleaned = parts[0] + (parts.length > 1 ? '.' + parts.slice(1).join('') : '')
                  }
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
              variant="fuchsia"
              value={answer}
              onChange={(v) => {
                setAnswer(v)
                if (checked !== 'idle') setChecked('idle')
              }}
              onSubmit={answer !== '' && checked !== 'correct' ? handleCheck : undefined}
              allowDecimal={true}
              allowNegative={true}
              disabled={checked === 'correct'}
            />
          </div>

          {checked !== 'correct' && (
            <div className="mt-2 flex justify-center">
              <ChunkyButton
                variant="success"
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
                  background:
                    'linear-gradient(135deg, rgba(163,230,53,0.18), rgba(34,211,238,0.14))',
                  borderColor: 'rgba(163,230,53,0.55)',
                  boxShadow: '0 0 22px rgba(163,230,53,0.3)',
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <p className="font-display text-lg font-extrabold text-neon-lime sm:text-xl">
                    ✨ CORRECT! Stage 4 Cleared ✨
                  </p>
                  <div className="flex items-center gap-2 sm:gap-3">
                    {starLayout.map((s, idx) => (
                      <motion.span
                        key={`star-${idx}-${starAnim}`}
                        initial={{ scale: 0, rotate: -40 }}
                        animate={
                          s.filled
                            ? { scale: 1, rotate: 0 }
                            : { scale: 0.6, rotate: 0, opacity: 0.3 }
                        }
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
                          filter: s.filled
                            ? 'drop-shadow(0 0 12px rgba(251,191,36,0.85))'
                            : 'none',
                        }}
                      >
                        ★
                      </motion.span>
                    ))}
                  </div>
                  <p className="text-sm text-ink-2">
                    Earned <span className="font-bold text-neon-lime">2 / 2</span> stars for Stage 4
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
