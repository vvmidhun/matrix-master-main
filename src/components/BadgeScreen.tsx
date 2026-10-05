import { motion, useReducedMotion } from 'motion/react'
import type { MissionApi } from '../state/useMission'
import { MISSION } from '../content/mission'
import { SceneBackground } from './art/SceneBackground'
import { BadgeArt } from './art/BadgeArt'
import { Sparkles } from './art/Sparkles'
import { ChunkyButton } from './ui/ChunkyButton'

interface BadgeScreenProps {
    mission: MissionApi
}

export function BadgeScreen({ mission }: BadgeScreenProps) {
    const reduce = useReducedMotion()

    return (
        <div className="fixed inset-0 z-50 h-full w-full overflow-y-auto overscroll-y-contain bg-paper text-ink touch-pan-y">
            {/* Fixed Background Layers */}
            <SceneBackground variant="badge" className="fixed inset-0 h-full w-full pointer-events-none z-0" />

            <Sparkles
                variant="cyan"
                count={20}
                className="pointer-events-none fixed inset-0 h-full w-full opacity-80 z-0"
            />
            <Sparkles
                variant="fuchsia"
                count={18}
                className="pointer-events-none fixed inset-0 h-full w-full opacity-70 mix-blend-screen z-0"
            />
            <Sparkles
                variant="gold"
                count={16}
                className="pointer-events-none fixed inset-0 h-full w-full opacity-75 mix-blend-screen z-0"
            />

            {/* Main Content Container */}
            <div className="relative z-10 min-h-full w-full px-3 py-6 sm:px-6 sm:py-8">
                <div className="mx-auto flex w-full max-w-xl flex-col items-center justify-between gap-4 sm:gap-6 pb-10">

                    {/* Top Header Badge & Title */}
                    <motion.div
                        initial={reduce ? false : { opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, ease: 'easeOut' }}
                        className="flex w-full flex-col items-center gap-1.5 text-center"
                    >
                        <div className="inline-flex items-center gap-2 rounded-full bg-glass-bg px-3.5 py-1 ring-1.5 ring-neon-fuchsia/50 backdrop-blur shadow-neon-fuchsia">
              <span className="font-display text-[10px] font-black uppercase tracking-widest text-neon-fuchsia sm:text-xs">
                ✦ Badge Earned ✦
              </span>
                        </div>
                        <h1
                            className="w-full font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl md:text-4xl"
                            style={{
                                background:
                                    'linear-gradient(90deg, #FDE68A 0%, #FBBF24 25%, #22D3EE 60%, #E879F9 100%)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                filter: 'drop-shadow(0 0 14px rgba(251, 191, 36, 0.45))',
                            }}
                        >
                            MATRIX MASTER BADGE
                        </h1>
                    </motion.div>

                    {/* Badge Graphic Section */}
                    <div className="flex w-full flex-col items-center justify-center gap-4 py-1 sm:gap-5">
                        <motion.div
                            initial={reduce ? false : { opacity: 0, scale: 0.6, rotate: -18 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: 0.12,
                                ease: [0.15, 1.1, 0.3, 1],
                            }}
                            className="relative"
                        >
                            <div
                                className="pointer-events-none absolute -inset-6 -z-10 rounded-full"
                                style={{
                                    background:
                                        'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, rgba(232, 121, 249, 0.2) 45%, transparent 75%)',
                                    filter: 'blur(8px)',
                                }}
                            />
                            <motion.div
                                animate={reduce ? {} : { y: [0, -5, 0] }}
                                transition={{
                                    duration: 3.5,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                    delay: 0.8,
                                }}
                            >
                                <BadgeArt className="h-44 w-auto drop-shadow-2xl sm:h-56 md:h-64" />
                            </motion.div>
                        </motion.div>

                        {/* Achievement Card */}
                        <motion.div
                            initial={reduce ? false : { opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.4, ease: 'easeOut' }}
                            className="flex w-full flex-col items-center gap-2 text-center"
                        >
                            <div className="relative w-full rounded-2xl bg-glass-bg p-3.5 ring-1.5 ring-glass-ring backdrop-blur-xl shadow-panel sm:p-5">
                                <div
                                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-40"
                                    aria-hidden
                                    style={{
                                        background:
                                            'radial-gradient(circle at 50% 0%, rgba(251, 191, 36, 0.18) 0%, transparent 60%)',
                                    }}
                                />
                                <div className="relative flex flex-col items-center gap-2">
                                    <p className="font-display text-[10px] font-black uppercase tracking-widest text-neon-cyan sm:text-xs">
                                        {MISSION.roleName}
                                    </p>
                                    <p
                                        className="font-display text-base font-extrabold leading-snug sm:text-xl md:text-2xl"
                                        style={{
                                            background: 'linear-gradient(90deg, #22D3EE 0%, #E879F9 100%)',
                                            WebkitBackgroundClip: 'text',
                                            backgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        You just implemented a 2-layer neural network from scratch! 🏆
                                    </p>

                                    {/* High-Contrast Skill Tags */}
                                    <div className="mt-1 flex flex-wrap items-center justify-center gap-2 pt-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-post/30 px-2.5 py-1 ring-1 ring-post/60 backdrop-blur-md">
                      <span className="h-1.5 w-1.5 rounded-full bg-neon-lime shadow-neon-lime" />
                      <span className="font-display text-[9px] font-black uppercase tracking-wider text-white sm:text-[10px]">
                        Forward Pass
                      </span>
                    </span>
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-neon-fuchsia/30 px-2.5 py-1 ring-1 ring-neon-fuchsia/60 backdrop-blur-md">
                      <span className="h-1.5 w-1.5 rounded-full bg-neon-fuchsia shadow-neon-fuchsia" />
                      <span className="font-display text-[9px] font-black uppercase tracking-wider text-white sm:text-[10px]">
                        Cross-Entropy Loss
                      </span>
                    </span>
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-neon-cyan/30 px-2.5 py-1 ring-1 ring-neon-cyan/60 backdrop-blur-md">
                      <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan shadow-neon-cyan" />
                      <span className="font-display text-[9px] font-black uppercase tracking-wider text-white sm:text-[10px]">
                        Backprop + XOR
                      </span>
                    </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={reduce ? false : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.55, ease: 'easeOut' }}
                        className="flex w-full flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-3"
                    >
                        <ChunkyButton
                            variant="cyan"
                            size="lg"
                            className="w-full sm:w-auto"
                            onClick={mission.goReflect}
                        >
                            💭 Reflect & Connect
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