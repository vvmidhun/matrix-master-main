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
    { key: 'lossCalc', label: 'Stage 4', title: 'Neural Network Quick Check', icon: '?', barColor: 'bg-neon-amber' },
    { key: 'chainRule', label: 'Stage 5', title: 'Build the Forward Pass', icon: '⟿', barColor: 'bg-neon-lime' },
    { key: 'xorTraining', label: 'Stage 6', title: 'Solve the XOR Challenge', icon: '🎯', barColor: 'bg-neon-fuchsia' },
] as const

function Stars({ count, max, size = 'lg' }: { count: number; max: number; size?: 'sm' | 'lg' }) {
    const cls = size === 'lg' ? 'text-2xl sm:text-3xl' : 'text-sm sm:text-base'
    return (
        <span className={`${cls} leading-none tracking-tight`} aria-label={`${count} of ${max} stars`}>
      <span className="text-neon-amber" style={{ filter: 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.55))' }}>
        {'★'.repeat(count)}
      </span>
      <span className="text-white/20">{'★'.repeat(Math.max(0, max - count))}</span>
    </span>
    )
}

export function ResultsScreen({ mission }: ResultsScreenProps) {
    const reduce = useReducedMotion()
    const snap = mission.scoreSnap

    if (!snap) {
        return (
            <div className="relative min-h-screen w-full bg-paper text-ink overflow-y-auto">
                <SceneBackground variant="badge" className="fixed inset-0 h-full w-full pointer-events-none z-0" />
                <div className="relative z-10 flex min-h-screen w-full items-center justify-center p-4 sm:p-6">
                    <div className="rounded-2xl bg-glass-bg p-6 text-center ring-1.5 ring-glass-ring backdrop-blur-md shadow-panel">
                        <p className="font-display text-lg font-bold text-white">No mission data yet.</p>
                        <p className="mt-1 text-xs font-semibold text-white/70">Play through the mission to see your results.</p>
                        <div className="mt-5 flex justify-center">
                            <ChunkyButton variant="ghost" size="sm" onClick={mission.restart}>
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
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.35, staggerChildren: 0.05, delayChildren: 0.03 },
        }

    return (
        /* Outer viewport container: forced scrolling with touch-pan-y enabled */
        <div className="fixed inset-0 z-50 h-full w-full overflow-y-auto overscroll-y-contain bg-paper text-ink touch-pan-y">
            {/* Background fixed behind content */}
            <SceneBackground variant="badge" className="fixed inset-0 h-full w-full pointer-events-none z-0" />

            {/* Scrollable Content Container */}
            <div className="relative z-10 min-h-full w-full px-3 py-6 sm:px-6 sm:py-8">
                <div className="mx-auto flex w-full max-w-xl flex-col gap-3.5 sm:gap-4 pb-12">
                    {/* Header Badge & Title */}
                    <motion.div
                        {...staggerChildren}
                        className="flex flex-col items-center gap-1.5 text-center"
                    >
                        <motion.div
                            className="inline-flex items-center gap-2 rounded-full bg-glass-bg px-3 py-1 ring-1.5 ring-neon-cyan/50 backdrop-blur"
                            style={{ filter: 'drop-shadow(0 0 10px rgba(34, 211, 238, 0.3))' }}
                        >
              <span className="font-display text-[10px] font-black uppercase tracking-widest text-neon-cyan sm:text-xs">
                Grade {MISSION.grade} · {MISSION.missionName}
              </span>
                        </motion.div>
                        <motion.h1
                            className="font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl"
                            style={{
                                background:
                                    'linear-gradient(90deg, #FDE68A 0%, #E879F9 50%, #22D3EE 100%)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                filter: 'drop-shadow(0 0 12px rgba(232, 121, 249, 0.35))',
                            }}
                        >
                            MISSION REPORT
                        </motion.h1>
                    </motion.div>

                    {/* Score Summary Box */}
                    <motion.div
                        initial={reduce ? false : { opacity: 0, scale: 0.97, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.08, ease: [0.2, 0.8, 0.2, 1] }}
                        className="relative overflow-hidden rounded-2xl bg-glass-bg p-3.5 ring-1.5 ring-glass-ring backdrop-blur-xl shadow-panel sm:p-4"
                    >
                        <div
                            className="pointer-events-none absolute inset-0 opacity-40"
                            aria-hidden
                            style={{
                                background:
                                    'radial-gradient(circle at 50% 0%, rgba(251, 191, 36, 0.15) 0%, transparent 60%), radial-gradient(circle at 15% 100%, rgba(34, 211, 238, 0.15) 0%, transparent 60%)',
                            }}
                        />
                        <div className="relative flex flex-col items-center gap-2 text-center sm:gap-3">
                            <p className="font-display text-[10px] font-black uppercase tracking-widest text-neon-cyan sm:text-xs">
                                Overall Rating
                            </p>
                            <Stars count={snap.overallStars} max={5} size="lg" />

                            <div className="grid w-full grid-cols-2 gap-2 pt-1">
                                <div className="rounded-xl bg-paper-2/60 p-2.5 ring-1 ring-glass-ring">
                                    <p className="font-display text-[9px] font-black uppercase tracking-wider text-neon-cyan sm:text-[10px]">
                                        Correct
                                    </p>
                                    <p
                                        className="mt-0.5 font-display text-2xl font-extrabold leading-none sm:text-3xl"
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
                                <div className="rounded-xl bg-paper-2/60 p-2.5 ring-1 ring-glass-ring">
                                    <p className="font-display text-[9px] font-black uppercase tracking-wider text-neon-fuchsia sm:text-[10px]">
                                        Possible
                                    </p>
                                    <p
                                        className="mt-0.5 font-display text-2xl font-extrabold leading-none sm:text-3xl"
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
                            <p className="text-xs font-semibold text-white/80 sm:text-sm">
                                <span className="font-bold text-white">{snap.correct}</span> correct out of{' '}
                                <span className="font-bold text-white">{snap.possible}</span> possible
                            </p>
                        </div>
                    </motion.div>

                    {/* Stage Breakdown List */}
                    <motion.div
                        initial={reduce ? false : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
                        className="flex flex-col gap-2"
                    >
                        <div className="flex items-center justify-between px-1">
                            <h3 className="font-display text-[11px] font-black uppercase tracking-widest text-neon-cyan sm:text-xs">
                                Stage Breakdown
                            </h3>
                            <span className="font-display text-[10px] font-bold uppercase tracking-wider text-white/60">
                ACC · STARS
              </span>
                        </div>

                        <div className="flex flex-col gap-2">
                            {STAGE_META.map((meta, idx) => {
                                const acc = snap.stageAccuracy[meta.key]
                                const stars = snap.perStep[meta.key] ?? 0
                                const correct = acc?.correct ?? 0
                                const total = Math.max(1, acc?.total ?? 1)
                                const pct = Math.min(100, Math.round((correct / total) * 100))
                                return (
                                    <motion.div
                                        key={meta.key}
                                        initial={reduce ? false : { opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: 0.18 + idx * 0.04,
                                            ease: 'easeOut',
                                        }}
                                        className="relative flex items-center gap-2.5 overflow-hidden rounded-xl bg-glass-bg p-2.5 ring-1.5 ring-glass-ring backdrop-blur-md"
                                    >
                                        <div
                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-post/25 text-base ring-1 ring-post/60"
                                            style={{ filter: 'drop-shadow(0 0 6px rgba(124, 58, 237, 0.4))' }}
                                        >
                                            {meta.icon}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-baseline justify-between gap-x-2">
                                                <div className="min-w-0">
                          <span className="font-display text-[9px] font-black uppercase tracking-wider text-neon-cyan block leading-none mb-0.5">
                            {meta.label}
                          </span>
                                                    <p className="truncate text-xs font-bold leading-tight text-white">
                                                        {meta.title}
                                                    </p>
                                                </div>
                                                <div className="shrink-0 font-mono text-xs font-extrabold text-white/90">
                                                    {correct}/{total}
                                                </div>
                                            </div>
                                            <div className="mt-1.5 flex items-center gap-2.5">
                                                <div className="min-w-0 flex-1 h-1.5 overflow-hidden rounded-full bg-paper-2/80 ring-1 ring-glass-ring/50">
                                                    <motion.div
                                                        initial={reduce ? false : { width: 0 }}
                                                        animate={{ width: `${pct}%` }}
                                                        transition={{
                                                            duration: 0.6,
                                                            delay: 0.3 + idx * 0.04,
                                                            ease: [0.2, 0.8, 0.2, 1],
                                                        }}
                                                        className={`h-full rounded-full ${meta.barColor}`}
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

                    {/* Bottom Action Buttons */}
                    <motion.div
                        initial={reduce ? false : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.45, ease: 'easeOut' }}
                        className="mt-2 flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-3"
                    >
                        <ChunkyButton
                            variant="primary"
                            size="lg"
                            className="w-full sm:w-auto"
                            onClick={mission.goBadge}
                        >
                            🏆 Claim Badge
                        </ChunkyButton>
                        <ChunkyButton
                            variant="ghost"
                            size="lg"
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