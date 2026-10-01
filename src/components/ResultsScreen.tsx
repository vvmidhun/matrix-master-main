import { motion, useReducedMotion } from 'motion/react'
import type { MissionApi } from '../state/useMission'
import type { PerStepStars } from '../types/game'
import { MISSION } from '../content/mission'
import { SceneBackground } from './art/SceneBackground'
import { ChunkyButton } from './ui/ChunkyButton'

interface ResultsScreenProps {
  mission: MissionApi
}

const STAGE_META: readonly {
  key: keyof PerStepStars
  label: string
  title: string
  icon: string
  barColor: string
}[] = [
  { key: 'dotProduct', label: 'Stage 1', title: 'Vectors as Data', icon: '•', barColor: 'bg-neon-cyan' },
  { key: 'matrixFill', label: 'Stage 2', title: 'Fill the Matrix', icon: '▦', barColor: 'bg-neon-fuchsia' },
  { key: 'forwardPass', label: 'Stage 3', title: 'Wire Forward Pass', icon: '⟿', barColor: 'bg-post' },
  { key: 'lossCalc', label: 'Stage 4', title: 'Compute the Loss', icon: 'ℒ', barColor: 'bg-neon-amber' },
  { key: 'chainRule', label: 'Stage 5', title: 'Trace the Gradient', icon: '∂', barColor: 'bg-neon-lime' },
  { key: 'xorTraining', label: 'Stage 6', title: 'Train on XOR', icon: '🎯', barColor: 'bg-neon-fuchsia' },
] as const

function Stars({ count, max, size = 'lg' }: { count: number; max: number; size?: 'sm' | 'lg' }) {
  const cls = size === 'lg' ? 'text-3xl sm:text-4xl' : 'text-base sm:text-lg'
  return (
    <span className={`${cls} leading-none tracking-tight`} aria-label={`${count} of ${max} stars`}>
      <span className="text-neon-amber" style={{ filter: 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.55))' }}>
        {'★'.repeat(count)}
      </span>
      <span className="text-ink-2/35">{'★'.repeat(Math.max(0, max - count))}</span>
    </span>
  )
}

export function ResultsScreen({ mission }: ResultsScreenProps) {
  const reduce = useReducedMotion()
  const snap = mission.scoreSnap

  if (!snap) {
    return (
      <div className="relative h-dvh w-full overflow-hidden text-ink">
        <SceneBackground variant="badge" className="absolute inset-0 h-full w-full" />
        <div className="relative z-10 flex min-h-full w-full items-center justify-center p-6">
          <div className="rounded-3xl bg-glass-bg p-8 text-center ring-2 ring-glass-ring backdrop-blur-md shadow-panel">
            <p className="font-display text-xl font-bold text-ink-2">No mission data yet.</p>
            <p className="mt-2 text-sm font-semibold text-ink-2/70">Play through the mission to see your results.</p>
            <div className="mt-6 flex justify-center">
              <ChunkyButton variant="ghost" onClick={mission.restart}>
                ← Back to Home
              </ChunkyButton>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const staggerChildren = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, staggerChildren: 0.07, delayChildren: 0.05 },
      }

  return (
    <div className="relative h-dvh w-full overflow-hidden text-ink">
      <SceneBackground variant="badge" className="absolute inset-0 h-full w-full" />

      <div className="relative z-10 min-h-full w-full overflow-y-auto touch-pan-y">
        <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col gap-5 px-4 py-5 sm:px-6 sm:py-7 md:gap-6 md:px-8 md:py-9">
          <motion.div
            {...staggerChildren}
            className="flex flex-col items-center gap-3 text-center"
          >
            <motion.div
              className="inline-flex items-center gap-2 rounded-full bg-glass-bg px-4 py-2 ring-2 ring-neon-cyan/50 backdrop-blur"
              style={{ filter: 'drop-shadow(0 0 12px rgba(34, 211, 238, 0.35))' }}
            >
              <span className="font-display text-[11px] font-black uppercase tracking-[0.2em] text-neon-cyan sm:text-xs">
                Grade {MISSION.grade} · {MISSION.missionName}
              </span>
            </motion.div>
            <motion.h1
              className="font-display text-4xl font-extrabold leading-none tracking-tight sm:text-5xl md:text-6xl"
              style={{
                background:
                  'linear-gradient(90deg, #FDE68A 0%, #E879F9 50%, #22D3EE 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 16px rgba(232, 121, 249, 0.45))',
              }}
            >
              MISSION REPORT
            </motion.h1>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative overflow-hidden rounded-3xl bg-glass-bg p-5 ring-2 ring-glass-ring backdrop-blur-xl shadow-panel sm:p-7"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-55"
              aria-hidden
              style={{
                background:
                  'radial-gradient(circle at 50% 0%, rgba(251, 191, 36, 0.18) 0%, transparent 55%), radial-gradient(circle at 15% 100%, rgba(34, 211, 238, 0.16) 0%, transparent 55%), radial-gradient(circle at 85% 100%, rgba(232, 121, 249, 0.16) 0%, transparent 55%)',
              }}
            />
            <div className="relative flex flex-col items-center gap-4 text-center sm:gap-5">
              <p className="font-display text-xs font-black uppercase tracking-[0.24em] text-neon-cyan sm:text-sm">
                Overall Rating
              </p>
              <Stars count={snap.overallStars} max={5} size="lg" />
              <div className="grid w-full grid-cols-2 gap-3 pt-2 sm:gap-5">
                <div className="rounded-2xl bg-paper-2/60 p-3.5 ring-1 ring-glass-ring sm:p-4.5">
                  <p className="font-display text-[10px] font-black uppercase tracking-[0.18em] text-neon-cyan sm:text-xs">
                    Correct
                  </p>
                  <p
                    className="mt-1 font-display text-3xl font-extrabold leading-none sm:text-4xl"
                    style={{
                      background: 'linear-gradient(180deg, #A3E635 0%, #22D3EE 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {snap.correct}
                  </p>
                </div>
                <div className="rounded-2xl bg-paper-2/60 p-3.5 ring-1 ring-glass-ring sm:p-4.5">
                  <p className="font-display text-[10px] font-black uppercase tracking-[0.18em] text-neon-fuchsia sm:text-xs">
                    Possible
                  </p>
                  <p
                    className="mt-1 font-display text-3xl font-extrabold leading-none sm:text-4xl"
                    style={{
                      background: 'linear-gradient(180deg, #E879F9 0%, #7C3AED 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {snap.possible}
                  </p>
                </div>
              </div>
              <p className="text-sm font-bold text-ink-2 sm:text-base">
                <span className="text-ink">{snap.correct}</span> correct out of{' '}
                <span className="text-ink">{snap.possible}</span> possible
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22, ease: 'easeOut' }}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center justify-between px-1">
              <h3 className="font-display text-xs font-black uppercase tracking-[0.2em] text-neon-cyan sm:text-sm">
                Stage Breakdown
              </h3>
              <span className="font-display text-[10px] font-black uppercase tracking-wider text-ink-2/60 sm:text-xs">
                Acc · Stars
              </span>
            </div>
            <div className="flex flex-col gap-2.5 sm:gap-3">
              {STAGE_META.map((meta, idx) => {
                const acc = snap.stageAccuracy[meta.key]
                const stars = snap.perStep[meta.key] ?? 0
                const correct = acc?.correct ?? 0
                const total = Math.max(1, acc?.total ?? 1)
                const pct = Math.min(100, Math.round((correct / total) * 100))
                return (
                  <motion.div
                    key={meta.key}
                    initial={reduce ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.38,
                      delay: 0.28 + idx * 0.05,
                      ease: 'easeOut',
                    }}
                    className="relative flex items-center gap-3 overflow-hidden rounded-2xl bg-glass-bg p-3.5 ring-2 ring-glass-ring backdrop-blur-md sm:gap-4 sm:p-4.5"
                  >
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-post/25 text-xl ring-2 ring-post/60 sm:h-12 sm:w-12 sm:text-2xl"
                      style={{ filter: 'drop-shadow(0 0 8px rgba(124, 58, 237, 0.5))' }}
                    >
                      {meta.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                        <div className="min-w-0">
                          <p className="font-display text-[10px] font-black uppercase tracking-[0.16em] text-neon-cyan sm:text-xs">
                            {meta.label}
                          </p>
                          <p className="truncate text-sm font-bold leading-tight text-ink sm:text-base">
                            {meta.title}
                          </p>
                        </div>
                        <div className="shrink-0 font-mono text-xs font-black text-ink-2 sm:text-sm">
                          {correct}/{total}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="min-w-0 flex-1 h-2 overflow-hidden rounded-full bg-paper-2/80 ring-1 ring-glass-ring/60">
                          <motion.div
                            initial={reduce ? false : { width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{
                              duration: 0.7,
                              delay: 0.5 + idx * 0.05,
                              ease: [0.2, 0.8, 0.2, 1],
                            }}
                            className={`h-full rounded-full ${meta.barColor}`}
                            style={{
                              boxShadow: '0 0 10px currentColor',
                            }}
                          />
                        </div>
                        <div className="shrink-0">
                          <Stars count={stars} max={2} size="sm" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.65, ease: 'easeOut' }}
            className="mt-2 flex shrink-0 flex-col gap-3 pt-2 sm:flex-row sm:justify-center sm:gap-4"
          >
            <ChunkyButton
              variant="primary"
              size="xl"
              className="w-full sm:w-auto"
              onClick={mission.goBadge}
            >
              🏆 Claim Badge
            </ChunkyButton>
            <ChunkyButton
              variant="ghost"
              size="xl"
              className="w-full sm:w-auto"
              onClick={mission.restart}
            >
              ↻ Play Again
            </ChunkyButton>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
