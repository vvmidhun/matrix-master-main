import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import type { MissionApi } from '../state/useMission'
import { PlayShell } from './ui/PlayShell'
import { ChunkyButton } from './ui/ChunkyButton'
import { StageProgressDots } from './ui/StageProgressDots'
import { sfx } from '../logic/sfx'
import { scoreChainRule } from '../logic/scoreChainRule'
import { CHAIN_RULE_TASKS } from '../content/chainRuleBlocks'
import type { PerStepStars, ScoreSnap } from '../types/game'

function shuffle(ids: readonly string[]): string[] {
  const result = [...ids]
  for (let index = result.length - 1; index > 0; index--) {
    const swapWith = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[swapWith]] = [result[swapWith]!, result[index]!]
  }
  return result
}

export function ChainRuleScreen({ mission }: { mission: MissionApi }) {
  const task = CHAIN_RULE_TASKS[0]!
  const [selected, setSelected] = useState<string[]>([])
  const [pool, setPool] = useState<string[]>(() =>
    shuffle(task.blocks.map((block) => block.id)),
  )
  const [checked, setChecked] = useState<'idle' | 'wrong' | 'correct'>('idle')

  const selectedBlocks = useMemo(
    () => selected.map((id) => task.blocks.find((block) => block.id === id)!),
    [selected, task.blocks],
  )
  const availableBlocks = pool.map((id) => task.blocks.find((block) => block.id === id)!)
  const isCorrect = checked === 'correct'

  const handleSelect = (id: string) => {
    if (checked === 'correct' || selected.includes(id)) return
    sfx.activate()
    setSelected((previous) => [...previous, id])
    setPool((previous) => previous.filter((poolId) => poolId !== id))
    setChecked('idle')
  }

  const handleRemove = (id: string) => {
    if (checked === 'correct') return
    setSelected((previous) => previous.filter((selectedId) => selectedId !== id))
    setPool((previous) => [...previous, id])
    setChecked('idle')
  }

  const handleReset = () => {
    setSelected([])
    setPool(shuffle(task.blocks.map((block) => block.id)))
    setChecked('idle')
  }

  const handleCheck = () => {
    const result = scoreChainRule(task, selected)
    if (!result.correct) {
      sfx.error()
      setChecked('wrong')
      mission.setCoach('oops', 'Not quite. Start with the input, then calculate, activate, and pass the output on.')
      return
    }

    setChecked('correct')
    sfx.tada()
    mission.setCoach('cheer', 'That’s it! A forward pass carries the input through the weighted sum and activation to produce an output.')

    const previous = mission.scoreSnap
    const perStep: PerStepStars = {
      dotProduct: previous?.perStep.dotProduct ?? 0,
      matrixFill: previous?.perStep.matrixFill ?? 0,
      forwardPass: previous?.perStep.forwardPass ?? 0,
      lossCalc: previous?.perStep.lossCalc ?? 0,
      chainRule: result.stars,
      xorTraining: previous?.perStep.xorTraining ?? 0,
    }
    const stageAccuracy = {
      dotProduct: previous?.stageAccuracy.dotProduct ?? { correct: 0, total: 0 },
      matrixFill: previous?.stageAccuracy.matrixFill ?? { correct: 0, total: 0 },
      forwardPass: previous?.stageAccuracy.forwardPass ?? { correct: 0, total: 0 },
      lossCalc: previous?.stageAccuracy.lossCalc ?? { correct: 0, total: 0 },
      chainRule: { correct: task.correctOrder.length, total: task.correctOrder.length },
      xorTraining: previous?.stageAccuracy.xorTraining ?? { correct: 0, total: 0 },
    }
    const totalStars = Object.values(perStep).reduce((total, value) => total + value, 0)
    const snap: ScoreSnap = {
      correct: (previous?.correct ?? 0) + 1,
      possible: (previous?.possible ?? 0) + 1,
      stars: totalStars,
      perStep,
      overallStars: Math.min(5, Math.ceil(totalStars / 2)) as ScoreSnap['overallStars'],
      stageAccuracy,
    }
    mission.setScoreSnap(snap)
  }

  const handleAdvance = () => {
    sfx.whoosh()
    mission.advanceStage('xorTraining')
  }

  return (
    <PlayShell
      stageLabel="STAGE 5 · Build the Forward Pass"
      stageNumber={5}
      totalStages={6}
      progress="5 / 6"
      coachMood={mission.coachMood}
      coachLine={mission.coachLine}
      muted={mission.muted}
      onToggleMute={mission.toggleMute}
      onSpeak={() => mission.speak(task.contextText)}
      footer={
        isCorrect && (
          <div className="flex justify-end">
            <ChunkyButton variant="cyan" size="lg" onClick={handleAdvance}>
              Next Stage: FINALE 🎯
            </ChunkyButton>
          </div>
        )
      }
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 pb-2 sm:gap-6">
        <StageProgressDots
          current={4}
          total={6}
          labels={['VEC', 'MAT', 'FWD', 'MCQ', 'FLOW', 'XOR']}
        />

        <div className="rounded-2xl bg-glass-bg p-4 ring-2 ring-glass-ring shadow-panel sm:p-5">
          <p className="font-display text-xs font-black uppercase tracking-widest text-neon-cyan sm:text-sm">
            One layer at a time
          </p>
          <h2 className="mt-2 font-display text-xl font-extrabold text-ink sm:text-2xl">
            {task.title}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-2 sm:text-base">
            {task.contextText}
          </p>
        </div>

        <div className="rounded-2xl bg-glass-bg p-4 ring-2 ring-glass-ring shadow-panel sm:p-6">
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-neon-fuchsia">
            Your sequence
          </h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {task.correctOrder.map((_, index) => {
              const block = selectedBlocks[index]
              return (
                <button
                  key={`slot-${index}`}
                  type="button"
                  onClick={() => block && handleRemove(block.id)}
                  disabled={!block || isCorrect}
                  className="flex min-h-16 items-center gap-3 rounded-xl border-2 border-dashed p-3 text-left disabled:cursor-default"
                  style={{
                    borderColor: isCorrect
                      ? 'rgba(163,230,53,0.65)'
                      : block
                        ? 'rgba(34,211,238,0.55)'
                        : 'rgba(124,58,237,0.38)',
                    background: isCorrect
                      ? 'rgba(163,230,53,0.1)'
                      : 'rgba(20,26,58,0.5)',
                  }}
                  aria-label={block ? `Remove ${block.label} from position ${index + 1}` : `Empty step ${index + 1}`}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-post/30 font-display text-sm font-black text-ink">
                    {index + 1}
                  </span>
                  {block ? (
                    <span className="min-w-0">
                      <span className="block font-display text-sm font-extrabold text-ink">{block.label}</span>
                      <span className="block text-xs text-neon-cyan">{block.formula}</span>
                    </span>
                  ) : (
                    <span className="text-sm font-semibold text-ink-2/70">Choose a step below</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="rounded-2xl bg-glass-bg p-4 ring-2 ring-glass-ring shadow-panel sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-neon-cyan">
              Available steps
            </h3>
            {!isCorrect && (
              <button
                type="button"
                onClick={handleReset}
                disabled={selected.length === 0}
                className="min-h-10 rounded-lg px-3 text-sm font-bold text-ink-2 ring-1 ring-glass-ring disabled:opacity-50"
              >
                Reset
              </button>
            )}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {availableBlocks.map((block) => (
              <motion.button
                key={block.id}
                type="button"
                onClick={() => handleSelect(block.id)}
                disabled={isCorrect}
                whileTap={{ scale: 0.98 }}
                className="flex min-h-16 flex-col items-start justify-center rounded-xl border border-glass-ring bg-paper/50 p-3 text-left transition hover:border-neon-cyan/60 disabled:opacity-50"
              >
                <span className="font-display text-sm font-extrabold text-ink">{block.label}</span>
                <span className="font-display text-xs font-bold text-neon-cyan">{block.formula}</span>
                <span className="mt-0.5 text-xs leading-snug text-ink-2">{block.description}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {checked === 'wrong' && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-bad/10 p-3 text-sm font-bold text-bad"
            role="status"
          >
            Check the order and try again. Tap a selected step to remove it, or press Reset to start over.
          </motion.p>
        )}

        {isCorrect && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-neon-lime/10 p-4 text-center ring-1 ring-neon-lime/50"
            role="status"
          >
            <p className="font-display text-lg font-extrabold text-neon-lime">
              Correct! That’s a forward pass.
            </p>
            <p className="mt-1 text-sm text-ink-2">
              Input → weighted sum + bias → activation → output
            </p>
          </motion.div>
        )}

        {!isCorrect && (
          <div className="flex justify-center">
            <ChunkyButton
              variant="fuchsia"
              size="lg"
              onClick={handleCheck}
              disabled={selected.length !== task.correctOrder.length}
            >
              Check Sequence
            </ChunkyButton>
          </div>
        )}
      </div>
    </PlayShell>
  )
}
