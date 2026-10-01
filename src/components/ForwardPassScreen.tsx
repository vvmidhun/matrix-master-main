import { useMemo, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { MissionApi } from '../state/useMission'
import { PlayShell } from './ui/PlayShell'
import { ChunkyButton } from './ui/ChunkyButton'
import { sfx } from '../logic/sfx'
import { scoreForwardPass } from '../logic/scoreForwardPass'
import { FORWARD_PASS_TASKS } from '../content/forwardPassBlocks'
import { NeuralGridVisual } from './art/NeuralGridVisual'
import { Sparkles } from './art/Sparkles'
import type { ScoreSnap, PerStepStars } from '../types/game'

type CheckState = 'idle' | 'correct' | 'wrong'

const STARS_PATTERN_FP: Array<{ filled: boolean; delay: number }> = [
  { filled: false, delay: 0 },
  { filled: false, delay: 0.12 },
]

const COLOR_STYLES: Record<string, { bg: string; ring: string; shadow: string; text: string }> = {
  cyan: {
    bg: 'linear-gradient(135deg, rgba(34,211,238,0.28) 0%, rgba(124,58,237,0.18) 100%)',
    ring: 'rgba(34,211,238,0.65)',
    shadow: '0 0 20px rgba(34,211,238,0.35)',
    text: 'text-neon-cyan',
  },
  green: {
    bg: 'linear-gradient(135deg, rgba(163,230,53,0.28) 0%, rgba(34,211,238,0.18) 100%)',
    ring: 'rgba(163,230,53,0.65)',
    shadow: '0 0 20px rgba(163,230,53,0.35)',
    text: 'text-neon-lime',
  },
  violet: {
    bg: 'linear-gradient(135deg, rgba(168,85,247,0.3) 0%, rgba(124,58,237,0.2) 100%)',
    ring: 'rgba(168,85,247,0.65)',
    shadow: '0 0 20px rgba(168,85,247,0.35)',
    text: 'text-post',
  },
  fuchsia: {
    bg: 'linear-gradient(135deg, rgba(232,121,249,0.28) 0%, rgba(244,114,182,0.2) 100%)',
    ring: 'rgba(232,121,249,0.65)',
    shadow: '0 0 20px rgba(232,121,249,0.35)',
    text: 'text-neon-fuchsia',
  },
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function ForwardPassScreen({ mission }: { mission: MissionApi }) {
  const task = FORWARD_PASS_TASKS[0]
  const [pipeline, setPipeline] = useState<string[]>([])
  const [shuffledAvailable, setShuffledAvailable] = useState<string[]>(() =>
    shuffle(task.blocks.map((b) => b.id))
  )
  const [checked, setChecked] = useState<CheckState>('idle')
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [starAnim, setStarAnim] = useState(0)
  const [shakeId, setShakeId] = useState<string | null>(null)

  const availableBlocks = useMemo(() => {
    return shuffledAvailable.filter((id) => !pipeline.includes(id))
  }, [shuffledAvailable, pipeline])

  const activatedPath = useMemo(() => {
    const nodes: { layer: number; node: number }[] = []
    const len = pipeline.length
    const correctSoFar = pipeline.every((id, i) => id === task.correctOrder[i])

    if (!correctSoFar) {
      if (len >= 1) {
        for (let i = 0; i < 3; i++) nodes.push({ layer: 0, node: i })
      }
      return nodes
    }

    if (len >= 1) {
      for (let i = 0; i < 3; i++) nodes.push({ layer: 0, node: i })
      for (let i = 0; i < 2; i++) nodes.push({ layer: 1, node: i })
    }
    if (len >= 3) {
      nodes.push({ layer: 2, node: 0 })
    }
    return nodes
  }, [pipeline, task.correctOrder])

  const activeNode = useMemo(() => {
    const len = pipeline.length
    if (len === 0) return null
    const correctSoFar = pipeline.every((id, i) => id === task.correctOrder[i])
    if (!correctSoFar) return null

    const lastId = pipeline[len - 1]
    if (lastId === 'a1') return { layer: 1, node: 0 }
    if (lastId === 'out') return { layer: 2, node: 0 }
    return null
  }, [pipeline, task.correctOrder])

  const handleSpeak = () => {
    mission.speak(task.contextText)
  }

  const checkOrder = useCallback(
    (p: string[]) => {
      const { correct, stars } = scoreForwardPass(task, p)
      if (correct) {
        sfx.tada()
        setChecked('correct')
        mission.setCoach('cheer', `Yes! z₁ → a₁ → z₂ → ŷ. That's the forward pass. Data flows left-to-right through the network. Stage 3 complete!`)
        setStarAnim(Date.now())
        const prevSnap = mission.scoreSnap
        const perStep: PerStepStars = {
          dotProduct: prevSnap?.perStep?.dotProduct ?? 0,
          matrixFill: prevSnap?.perStep?.matrixFill ?? 0,
          forwardPass: stars,
          lossCalc: prevSnap?.perStep?.lossCalc ?? 0,
          chainRule: prevSnap?.perStep?.chainRule ?? 0,
          xorTraining: prevSnap?.perStep?.xorTraining ?? 0,
        }
        const stageAccuracy = {
          dotProduct: prevSnap?.stageAccuracy?.dotProduct ?? { correct: 0, total: 0 },
          matrixFill: prevSnap?.stageAccuracy?.matrixFill ?? { correct: 0, total: 0 },
          forwardPass: { correct: 1, total: 1 },
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
        let hint = 'Wrong order! That operation comes later. Hint: weighted sums before activations!'
        if (attempts >= 2) {
          hint = 'Hint: Think "data flow" — hidden layer first (z then activation), then output layer (z then sigmoid)!'
        }
        if (attempts >= 3) {
          hint = 'Hint pattern: weighted sum (z) → activation (a) repeats per layer. z₁ then a₁ then z₂ then ŷ!'
        }
        mission.setCoach('oops', hint)
      }
    },
    [task, mission, wrongAttempts]
  )

  const handleTapBlock = (blockId: string) => {
    if (checked === 'correct') return
    if (pipeline.includes(blockId)) return

    const nextIndex = pipeline.length
    const expectedId = task.correctOrder[nextIndex]

    if (blockId !== expectedId) {
      sfx.error()
      setShakeId(blockId)
      setTimeout(() => setShakeId(null), 500)
      setChecked('wrong')
      setWrongAttempts((n) => n + 1)
      const attempts = wrongAttempts + 1
      let hint = 'Wrong order! That operation comes later. Hint: weighted sums before activations!'
      if (attempts >= 2) {
        hint = 'Hint: Think "data flow" — hidden layer first (z then activation), then output layer (z then sigmoid)!'
      }
      mission.setCoach('oops', hint)
      return
    }

    sfx.activate()
    if (checked !== 'idle') setChecked('idle')
    const newPipeline = [...pipeline, blockId]
    setPipeline(newPipeline)

    if (newPipeline.length === 4) {
      checkOrder(newPipeline)
    }
  }

  const handleClear = () => {
    if (checked === 'correct') return
    sfx.click()
    setPipeline([])
    setShuffledAvailable(shuffle(task.blocks.map((b) => b.id)))
    setChecked('idle')
  }

  const handleAdvance = () => {
    sfx.whoosh()
    mission.advanceStage('lossCalc')
  }

  const pipelineSlots = 4
  const blockById = useMemo(() => {
    const m: Record<string, (typeof task.blocks)[number]> = {}
    task.blocks.forEach((b) => (m[b.id] = b))
    return m
  }, [task])

  const starLayout =
    checked === 'correct'
      ? STARS_PATTERN_FP.map((s, i) => ({ ...s, filled: i < 2 }))
      : STARS_PATTERN_FP

  return (
    <PlayShell
      stageLabel="STAGE 3 · Wire the Forward Pass"
      stageNumber={3}
      totalStages={6}
      progress="3 / 6"
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
          className="relative rounded-2xl bg-glass-bg p-4 ring-2 ring-glass-ring backdrop-blur-md shadow-panel sm:p-5"
        >
          <div className="mb-2 flex items-center justify-center">
            <p className="font-display text-sm font-bold tracking-wider text-neon-fuchsia sm:text-base">
              NEURAL NETWORK · 3 → 2 → 1
            </p>
          </div>
          <div className="relative mx-auto flex items-center justify-center">
            <NeuralGridVisual
              layers={[3, 2, 1]}
              activatedPath={activatedPath}
              activeNode={activeNode}
              className="h-[180px] w-full max-w-[380px] sm:h-[220px]"
            />
            <AnimatePresence>
              {checked === 'correct' && (
                <motion.div
                  key="fp-sparkles"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="pointer-events-none absolute inset-0"
                >
                  <Sparkles variant="lime" count={20} className="h-full w-full opacity-80" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="mt-2 flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-wider text-white/50 sm:text-xs">
            <span className="text-neon-cyan">IN 3</span>
            <span>→</span>
            <span className="text-neon-lime">H 2</span>
            <span>→</span>
            <span className="text-neon-fuchsia">OUT 1</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08, ease: [0.2, 0.8, 0.2, 1] }}
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
          transition={{ duration: 0.45, delay: 0.16, ease: [0.2, 0.8, 0.2, 1] }}
          className="rounded-2xl bg-glass-bg p-4 ring-2 ring-glass-ring backdrop-blur-md shadow-panel sm:p-6"
        >
          <div className="mb-4">
            <p className="mb-3 font-display text-sm font-bold tracking-wider text-neon-cyan sm:text-base">
              ⚡ CURRENT PIPELINE
            </p>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {Array.from({ length: pipelineSlots }).map((_, idx) => {
                const blockId = pipeline[idx]
                const block = blockId ? blockById[blockId] : null
                const style = block ? COLOR_STYLES[block.color] ?? COLOR_STYLES.cyan : null
                return (
                  <div key={`slot-${idx}`} className="relative">
                    {block ? (
                      <motion.div
                        key={`chip-${blockId}-${idx}`}
                        layout
                        initial={{ opacity: 0, y: 30, scale: 0.85 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1], type: 'spring', stiffness: 260, damping: 22 }}
                        className="relative flex flex-col items-center rounded-xl p-2 ring-2 backdrop-blur sm:p-3"
                        style={{
                          background: style!.bg,
                          borderColor: style!.ring,
                          boxShadow: style!.shadow,
                          minHeight: 84,
                        }}
                      >
                        <span
                          className={`mb-1 font-display text-[10px] font-bold uppercase tracking-wider sm:text-xs ${style!.text}`}
                        >
                          STEP {idx + 1}
                        </span>
                        <span className="text-center font-display text-sm font-extrabold text-white sm:text-base leading-tight">
                          {block.text}
                        </span>
                      </motion.div>
                    ) : (
                      <div
                        className="flex min-h-[84px] flex-col items-center justify-center rounded-xl p-2 sm:p-3"
                        style={{
                          border: '2px dashed rgba(255,255,255,0.15)',
                          background: 'rgba(255,255,255,0.02)',
                        }}
                      >
                        <span className="font-display text-xs font-bold text-white/20 sm:text-sm">
                          Step {idx + 1}
                        </span>
                        <span className="mt-1 text-xl text-white/15">+</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            {checked === 'wrong' && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-center text-sm font-bold text-bad sm:text-base"
              >
                ❌ Wrong order — weighted sums (z) come before activations (a)!
              </motion.p>
            )}
          </div>

          <div className="mb-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-sm font-bold tracking-wider text-neon-fuchsia sm:text-base">
                🔧 AVAILABLE OPERATIONS
              </p>
              <ChunkyButton variant="ghost" size="sm" onClick={handleClear} disabled={checked === 'correct' || pipeline.length === 0}>
                Clear Pipeline
              </ChunkyButton>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {availableBlocks.map((blockId) => {
                const block = blockById[blockId]
                const style = COLOR_STYLES[block.color] ?? COLOR_STYLES.cyan
                const isShaking = shakeId === blockId
                return (
                  <motion.button
                    key={`avail-${blockId}`}
                    type="button"
                    onClick={() => handleTapBlock(blockId)}
                    disabled={checked === 'correct'}
                    whileHover={checked !== 'correct' ? { scale: 1.03, y: -2 } : {}}
                    whileTap={checked !== 'correct' ? { scale: 0.97 } : {}}
                    animate={isShaking ? { x: [-8, 8, -6, 6, -4, 4, 0] } : {}}
                    transition={isShaking ? { duration: 0.45, ease: 'easeInOut' } : {}}
                    className="relative flex flex-col items-start rounded-xl p-3 text-left ring-2 backdrop-blur transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed sm:p-4"
                    style={{
                      background: style.bg,
                      borderColor: style.ring,
                      boxShadow: style.shadow,
                      minHeight: 88,
                    }}
                  >
                    <span
                      className={`mb-1 font-display text-[10px] font-bold uppercase tracking-wider sm:text-xs ${style.text}`}
                    >
                      {block.formula}
                    </span>
                    <span className="font-display text-base font-extrabold text-white sm:text-lg leading-tight">
                      {block.text}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </div>

          <AnimatePresence>
            {checked === 'correct' && (
              <motion.div
                key="fp-stars-success"
                initial={{ opacity: 0, y: 16, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                className="rounded-xl p-4 ring-2"
                style={{
                  background: 'linear-gradient(135deg, rgba(163,230,53,0.18), rgba(34,211,238,0.14))',
                  borderColor: 'rgba(163,230,53,0.55)',
                  boxShadow: '0 0 22px rgba(163,230,53,0.3)',
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <p className="font-display text-lg font-extrabold text-neon-lime sm:text-xl">
                    ✨ PIPELINE COMPLETE! Stage 3 Cleared ✨
                  </p>
                  <div className="flex items-center gap-2 sm:gap-3">
                    {starLayout.map((s, idx) => (
                      <motion.span
                        key={`fp-star-${idx}-${starAnim}`}
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
                    Earned <span className="font-bold text-neon-lime">2 / 2</span> stars for Stage 3
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </PlayShell>
  )
}
