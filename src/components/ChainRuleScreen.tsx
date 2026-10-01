import { useCallback, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { MissionApi } from '../state/useMission'
import { PlayShell } from './ui/PlayShell'
import { ChunkyButton } from './ui/ChunkyButton'
import { StageProgressDots } from './ui/StageProgressDots'
import { sfx } from '../logic/sfx'
import { scoreChainRule } from '../logic/scoreChainRule'
import { CHAIN_RULE_TASKS } from '../content/chainRuleBlocks'
import type { ScoreSnap, PerStepStars, ChainRuleBlock } from '../types/game'
import { Sparkles } from './art/Sparkles'

type Status = 'idle' | 'snapping' | 'celebrating'

function shuffle<T>(arr: readonly T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function ChainRuleScreen({ mission }: { mission: MissionApi }) {
  const task = CHAIN_RULE_TASKS[0]!
  const [slotted, setSlotted] = useState<string[]>([])
  const [pool, setPool] = useState<ChainRuleBlock[]>(() => shuffle(task.blocks))
  const [status, setStatus] = useState<Status>('idle')
  const [snapPosition, setSnapPosition] = useState<number | null>(null)
  const [flash, setFlash] = useState(false)
  const [wrongAttempts, setWrongAttempts] = useState(0)

  const handleSpeak = () => {
    mission.speak(task.contextText)
  }

  const resetAll = useCallback(() => {
    setSlotted([])
    setPool(shuffle(task.blocks))
    setStatus('idle')
    setSnapPosition(null)
    setFlash(false)
  }, [task.blocks])

  const checkAndApplyWrong = useCallback(
    (newSlotted: string[]) => {
      const mismatchIdx = newSlotted.findIndex((id, i) => id !== task.correctOrder[i])
      if (mismatchIdx !== -1) {
        sfx.error()
        setFlash(true)
        setSnapPosition(mismatchIdx)
        setStatus('snapping')
        setWrongAttempts((n) => n + 1)
        const attempts = wrongAttempts + 1
        let hint = `💥 SNAP! Wrong link at position ${mismatchIdx + 1}. Chain breaks — try again!`
        if (attempts >= 2) {
          hint += ` Hint: Start from the loss side — ∂ℒ/∂ŷ is always first.`
        }
        if (attempts >= 3) {
          hint = `💥 SNAP at position ${mismatchIdx + 1}! Correct order: dLdy → dydz2 → dz2dW2. The chain flows from loss backwards through each layer.`
        }
        mission.setCoach('oops', hint)
        setTimeout(() => {
          setFlash(false)
          const wrongBlocks = newSlotted
            .map((id) => task.blocks.find((b) => b.id === id)!)
            .filter(Boolean)
          setSlotted([])
          setPool((prev) => [...prev, ...wrongBlocks])
          setSnapPosition(null)
          setStatus('idle')
        }, 1200)
        return true
      }
      return false
    },
    [task, wrongAttempts],
  )

  const handleTapLink = useCallback(
    (block: ChainRuleBlock) => {
      if (status !== 'idle') return
      if (slotted.includes(block.id)) return
      sfx.activate()
      const newSlotted = [...slotted, block.id]
      setPool((prev) => prev.filter((b) => b.id !== block.id))
      setSlotted(newSlotted)

      if (checkAndApplyWrong(newSlotted)) return

      if (newSlotted.length === task.correctOrder.length) {
        const { correct, stars } = scoreChainRule(task, newSlotted)
        if (correct) {
          setStatus('celebrating')
          sfx.tada()
          mission.setCoach('cheer', `Glowing chain complete! ∂ℒ/∂W₂ = ∂ℒ/∂ŷ · ∂ŷ/∂z₂ · ∂z₂/∂W₂. That's how backprop multiplies gradients stage by stage! Stage 5 cleared!`)
          const prevSnap = mission.scoreSnap
          const perStep: PerStepStars = {
            dotProduct: prevSnap?.perStep?.dotProduct ?? 0,
            matrixFill: prevSnap?.perStep?.matrixFill ?? 0,
            forwardPass: prevSnap?.perStep?.forwardPass ?? 0,
            lossCalc: prevSnap?.perStep?.lossCalc ?? 0,
            chainRule: stars,
            xorTraining: prevSnap?.perStep?.xorTraining ?? 0,
          }
          const stageAccuracy = {
            dotProduct: prevSnap?.stageAccuracy?.dotProduct ?? { correct: 0, total: 0 },
            matrixFill: prevSnap?.stageAccuracy?.matrixFill ?? { correct: 0, total: 0 },
            forwardPass: prevSnap?.stageAccuracy?.forwardPass ?? { correct: 0, total: 0 },
            lossCalc: prevSnap?.stageAccuracy?.lossCalc ?? { correct: 0, total: 0 },
            chainRule: { correct: 1, total: 1 },
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
        }
      }
    },
    [slotted, status, task, checkAndApplyWrong, mission, wrongAttempts],
  )

  const handleAdvance = () => {
    sfx.whoosh()
    mission.advanceStage('xorTraining')
  }

  const slotBlocks = useMemo(() => {
    return slotted.map((id) => task.blocks.find((b) => b.id === id) ?? null)
  }, [slotted, task.blocks])

  const isCorrectOrder = slotBlocks.length === task.correctOrder.length && status === 'celebrating'

  return (
    <PlayShell
      stageLabel="STAGE 5 · Trace the Gradient"
      stageNumber={5}
      totalStages={6}
      progress="5 / 6"
      coachMood={mission.coachMood}
      coachLine={mission.coachLine}
      muted={mission.muted}
      onToggleMute={mission.toggleMute}
      onSpeak={handleSpeak}
      footer={
        isCorrectOrder && (
          <div className="flex justify-end">
            <ChunkyButton variant="cyan" size="xl" onClick={handleAdvance}>
              Next Stage: FINALE 🎯
            </ChunkyButton>
          </div>
        )
      }
    >
      <div className="flex flex-col gap-4 pb-2 sm:gap-6">
        <StageProgressDots current={4} total={6} labels={['VEC', 'MAT', 'FWD', 'LOSS', 'CHAIN', 'XOR']} />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative overflow-hidden rounded-2xl bg-glass-bg p-4 ring-2 ring-glass-ring backdrop-blur-md shadow-panel sm:p-5"
        >
          <h2 className="mb-1 font-display text-lg font-extrabold text-neon-fuchsia sm:text-xl">
            ∂ℒ/∂W₂ = Multiply in order!
          </h2>
          <p className="text-sm leading-relaxed text-ink-2 sm:text-base">
            Snap the chain links in the RIGHT order. Wrong order = CHAIN SNAPS! 💥
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{
            opacity: 1,
            y: 0,
            boxShadow: flash
              ? '0 0 40px rgba(244,114,182,0.7)'
              : isCorrectOrder
                ? '0 0 40px rgba(163,230,53,0.35)'
                : '0 8px 40px rgba(124,58,237,0.18)',
          }}
          transition={{ duration: 0.45, delay: 0.08, ease: [0.2, 0.8, 0.2, 1] }}
          className={`relative overflow-hidden rounded-2xl p-4 ring-2 backdrop-blur-md shadow-panel sm:p-6 ${flash ? 'chain-snap' : ''}`}
          style={{
            background: flash
              ? 'linear-gradient(135deg, rgba(244,114,182,0.22), rgba(124,58,237,0.2))'
              : 'rgba(20,26,58,0.72)',
            borderColor: flash
              ? 'rgba(244,114,182,0.65)'
              : isCorrectOrder
                ? 'rgba(163,230,53,0.55)'
                : 'rgba(124,58,237,0.35)',
          }}
        >
          <AnimatePresence>
            {isCorrectOrder && (
              <motion.div
                key="sparkles-wrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute inset-0"
              >
                <Sparkles variant="lime" count={36} className="h-full w-full" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative z-10 flex items-stretch justify-center gap-2 py-4 sm:gap-4 sm:py-6">
            {task.correctOrder.map((_, slotIdx) => {
              const block = slotBlocks[slotIdx]
              const isShake = status === 'snapping' && snapPosition !== null && slotIdx <= snapPosition
              const isConnected = isCorrectOrder && slotIdx < task.correctOrder.length - 1
              return (
                <div key={`slot-${slotIdx}`} className="flex flex-1 items-center justify-center">
                  <div className="flex flex-col items-center gap-2 sm:gap-3">
                    <div
                      className={`relative flex w-full items-center justify-center ${isShake ? 'chain-snap' : ''}`}
                    >
                      <motion.div
                        layout
                        className={`relative flex min-h-[100px] w-full items-center justify-center rounded-full border-2 border-dashed px-2 py-3 sm:min-h-[120px] sm:px-4 ${
                          block
                            ? isCorrectOrder
                              ? 'border-neon-lime/70 bg-neon-lime/10'
                              : 'border-neon-cyan/60 bg-neon-cyan/8'
                            : 'border-glass-ring bg-paper-2/30'
                        }`}
                        style={{
                          boxShadow: block
                            ? isCorrectOrder
                              ? '0 0 22px rgba(163,230,53,0.4)'
                              : '0 0 14px rgba(34,211,238,0.2)'
                            : undefined,
                        }}
                      >
                        <AnimatePresence mode="wait">
                          {block ? (
                            <motion.div
                              key={`blk-${block.id}-${slotIdx}`}
                              initial={{ opacity: 0, scale: 0.6, y: 40 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.7, y: -20 }}
                              transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1], type: 'spring', stiffness: 240 }}
                              className="flex w-full flex-col items-center gap-1 text-center"
                            >
                              <span
                                className="font-display text-base font-extrabold text-white sm:text-lg"
                                style={{
                                  textShadow: isCorrectOrder
                                    ? '0 0 10px rgba(163,230,53,0.6)'
                                    : '0 0 8px rgba(34,211,238,0.5)',
                                }}
                              >
                                {block.label}
                              </span>
                              <span className="font-display text-[10px] font-bold text-neon-cyan sm:text-xs">
                                {block.formula}
                              </span>
                              <span className="text-[10px] leading-tight text-ink-2 sm:text-xs">
                                {block.description}
                              </span>
                            </motion.div>
                          ) : (
                            <motion.span
                              key={`empty-${slotIdx}`}
                              initial={{ opacity: 0.4 }}
                              animate={{ opacity: 0.6 }}
                              className="font-display text-xs font-bold uppercase tracking-widest text-ink-2/70 sm:text-sm"
                            >
                              LINK {slotIdx + 1}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                  </div>

                  {slotIdx < task.correctOrder.length - 1 && (
                    <div className="flex w-8 shrink-0 items-center sm:w-12">
                      <div className="relative h-1 w-full overflow-hidden rounded-full bg-glass-ring/50">
                        <AnimatePresence>
                          {isConnected && (
                            <motion.div
                              key={`conn-${slotIdx}`}
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              exit={{ scaleX: 0 }}
                              transition={{ duration: 0.5, delay: slotIdx * 0.18, ease: [0.2, 0.8, 0.2, 1] }}
                              style={{
                                transformOrigin: 'left center',
                                background: 'linear-gradient(90deg, #A3E635, #22D3EE, #E879F9)',
                                boxShadow: '0 0 10px rgba(163,230,53,0.7)',
                              }}
                              className="absolute inset-0 rounded-full"
                            />
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <AnimatePresence>
            {isCorrectOrder && (
              <motion.div
                key="formula-out"
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.85, ease: [0.2, 0.8, 0.2, 1] }}
                className="relative z-10 mt-4 rounded-xl border p-3 sm:mt-6 sm:p-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(163,230,53,0.15), rgba(34,211,238,0.12))',
                  borderColor: 'rgba(163,230,53,0.55)',
                  boxShadow: '0 0 22px rgba(163,230,53,0.25)',
                }}
              >
                <p className="mb-1 font-display text-xs font-bold uppercase tracking-wider text-neon-lime sm:text-sm">
                  ✨ CHAIN RULE PRODUCT ✨
                </p>
                <p className="font-display text-sm font-extrabold leading-relaxed text-white sm:text-base">
                  ∂ℒ/∂W₂ = ∂ℒ/∂ŷ · ∂ŷ/∂z₂ · ∂z₂/∂W₂
                </p>
                <p className="mt-1 text-xs text-ink-2 sm:text-sm">
                  Multiply each local gradient. Backprop = chain rule, end to end!
                </p>
              </motion.div>
            )}
            {status === 'snapping' && snapPosition !== null && (
              <motion.div
                key="snap-msg"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="relative z-10 mt-3 rounded-xl border border-bad/50 bg-bad/15 p-3 sm:mt-5 sm:p-4"
              >
                <p className="font-display text-sm font-extrabold text-bad sm:text-base">
                  💥 SNAP! Wrong link at position {snapPosition + 1}. Chain breaks — try again!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
          className="rounded-2xl bg-glass-bg p-4 ring-2 ring-glass-ring backdrop-blur-md shadow-panel sm:p-5"
        >
          <div className="mb-3 flex items-center justify-between sm:mb-4">
            <p className="font-display text-sm font-bold tracking-wider text-neon-cyan sm:text-base">
              AVAILABLE LINKS · Tap to snap in place
            </p>
            <ChunkyButton variant="ghost" size="sm" onClick={resetAll} disabled={status === 'celebrating'}>
              ↺ Reset
            </ChunkyButton>
          </div>

          {pool.length === 0 ? (
            <p className="py-6 text-center font-display text-sm font-bold text-ink-2/60">
              {isCorrectOrder ? 'Chain complete! 🎉' : 'Pool emptied — check the slots above.'}
            </p>
          ) : (
            <div className="grid gap-2 sm:gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(pool.length, 3)}, minmax(0,1fr))` }}>
              <AnimatePresence>
                {pool.map((block, idx) => (
                  <motion.button
                    key={block.id}
                    layout
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7, y: -30 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleTapLink(block)}
                    disabled={status !== 'idle'}
                    className="flex min-h-[92px] w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-full border-2 px-3 py-3 text-center transition sm:min-h-[110px] sm:px-4 sm:py-4"
                    style={{
                      background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(34,211,238,0.14))',
                      borderColor: 'rgba(168,85,247,0.55)',
                      boxShadow: '0 0 18px rgba(124,58,237,0.25)',
                    }}
                  >
                    <span className="font-display text-sm font-extrabold text-white sm:text-base">
                      {block.label}
                    </span>
                    <span className="font-display text-[10px] font-bold text-neon-cyan sm:text-xs">
                      {block.formula}
                    </span>
                    <span className="text-[10px] leading-tight text-ink-2 sm:text-xs">
                      {block.description}
                    </span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        <AnimatePresence>
          {isCorrectOrder && (
            <motion.div
              key="stars-success"
              initial={{ opacity: 0, y: 16, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 1.05, ease: [0.2, 0.8, 0.2, 1] }}
              className="rounded-xl p-4 ring-2"
              style={{
                background: 'linear-gradient(135deg, rgba(163,230,53,0.18), rgba(34,211,238,0.14))',
                borderColor: 'rgba(163,230,53,0.55)',
                boxShadow: '0 0 22px rgba(163,230,53,0.3)',
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <p className="font-display text-lg font-extrabold text-neon-lime sm:text-xl">
                  ✨ CHAIN COMPLETE! Stage 5 Cleared ✨
                </p>
                <div className="flex items-center gap-2 sm:gap-3">
                  {[0, 1].map((idx) => (
                    <motion.span
                      key={`star-${idx}`}
                      initial={{ scale: 0, rotate: -40 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 1.2 + idx * 0.12,
                        ease: [0.2, 0.8, 0.2, 1],
                        type: 'spring',
                        stiffness: 260,
                      }}
                      className="text-4xl sm:text-5xl"
                      style={{
                        color: '#FBBF24',
                        filter: 'drop-shadow(0 0 12px rgba(251,191,36,0.85))',
                      }}
                    >
                      ★
                    </motion.span>
                  ))}
                </div>
                <p className="text-sm text-ink-2">
                  Earned <span className="font-bold text-neon-lime">2 / 2</span> stars for Stage 5
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PlayShell>
  )
}
