import { motion, useReducedMotion } from 'motion/react'
import type { MissionApi } from '../state/useMission'
import { MISSION } from '../content/mission'
import { SceneBackground } from './art/SceneBackground'
import { CoachSprite } from './art/CoachSprite'
import { ChunkyButton } from './ui/ChunkyButton'

interface ReflectScreenProps {
    mission: MissionApi
}

export function ReflectScreen({ mission }: ReflectScreenProps) {
    const reduce = useReducedMotion()

    return (
        <div className="fixed inset-0 z-50 h-full w-full overflow-y-auto overscroll-y-contain bg-paper text-ink touch-pan-y">
            {/* Background fixed behind content */}
            <SceneBackground variant="play" className="fixed inset-0 h-full w-full pointer-events-none z-0" />

            {/* Main Container */}
            <div className="relative z-10 min-h-full w-full px-3 py-5 sm:px-6 sm:py-7">
                <div className="mx-auto flex w-full max-w-xl flex-col gap-3.5 sm:gap-4 pb-12">

                    {/* Header Grade Badge */}
                    <motion.div
                        initial={reduce ? false : { opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, ease: 'easeOut' }}
                        className="flex flex-col items-center gap-1 text-center"
                    >
                        <div className="inline-flex items-center gap-2 rounded-full bg-glass-bg px-3.5 py-1 ring-1.5 ring-post/50 backdrop-blur">
              <span className="font-display text-[10px] font-black uppercase tracking-widest text-neon-fuchsia sm:text-xs">
                Grade {MISSION.grade} · {MISSION.missionName}
              </span>
                        </div>
                    </motion.div>

                    {/* Coach Dialogue Section */}
                    <motion.div
                        initial={reduce ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.08, ease: 'easeOut' }}
                        className="relative flex flex-col items-center gap-2.5 sm:flex-row sm:items-center sm:justify-center sm:gap-4"
                    >
                        <motion.div
                            animate={reduce ? {} : { y: [0, -4, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            className="relative shrink-0"
                        >
                            <CoachSprite mood="wow" className="game-coach-portrait h-28 w-auto drop-shadow-xl sm:h-36 md:h-40" />
                            <div
                                className="pointer-events-none absolute -inset-3 -z-10 rounded-full opacity-60 blur-xl"
                                style={{
                                    background:
                                        'radial-gradient(circle, rgba(232, 121, 249, 0.4) 0%, transparent 70%)',
                                }}
                            />
                        </motion.div>

                        <motion.div
                            initial={reduce ? false : { opacity: 0, y: 8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
                            className="relative max-w-md rounded-xl bg-glass-bg px-3.5 py-2.5 ring-1.5 ring-neon-cyan/50 backdrop-blur-md shadow-panel sm:px-4 sm:py-3"
                        >
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 h-4 w-4 rotate-45 bg-glass-bg ring-1.5 ring-neon-cyan/50 ring-b-transparent ring-l-transparent sm:left-[-8px] sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0" />
                            <p className="font-display text-[10px] font-black uppercase tracking-widest text-neon-cyan sm:text-xs">
                                Coach Nova
                            </p>
                            <p className="mt-0.5 text-xs font-semibold leading-relaxed text-white sm:text-sm">
                                Wow — you just watched a straight line <em className="text-neon-fuchsia not-italic font-extrabold">bend</em> into a curve that
                                cracks XOR! That's the magic of hidden layers. Take a second to think about what
                                that <em className="text-neon-cyan not-italic font-extrabold">actually</em> means… 🤔
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Deep Think Card */}
                    <motion.div
                        initial={reduce ? false : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                        className="relative overflow-hidden rounded-2xl bg-glass-bg ring-1.5 ring-glass-ring backdrop-blur-xl shadow-panel"
                    >
                        <div
                            className="pointer-events-none absolute inset-0 opacity-40"
                            aria-hidden
                            style={{
                                background:
                                    'radial-gradient(circle at 15% 0%, rgba(34, 211, 238, 0.2) 0%, transparent 55%), radial-gradient(circle at 85% 100%, rgba(232, 121, 249, 0.2) 0%, transparent 55%)',
                            }}
                        />

                        <div className="relative flex flex-col gap-3.5 p-4 sm:p-6 sm:gap-4">
                            <div className="flex flex-col items-start gap-1">
                                <div className="inline-flex items-center gap-1.5 rounded-full bg-post/25 px-3 py-1 ring-1 ring-post/60">
                                    <span className="text-sm">🧠</span>
                                    <span className="font-display text-[10px] font-black uppercase tracking-widest text-neon-fuchsia sm:text-xs">
                    Deep Think
                  </span>
                                </div>
                                <h2
                                    className="font-display text-2xl font-extrabold leading-tight sm:text-3xl"
                                    style={{
                                        background:
                                            'linear-gradient(90deg, #22D3EE 0%, #7C3AED 50%, #E879F9 100%)',
                                        WebkitBackgroundClip: 'text',
                                        backgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        filter: 'drop-shadow(0 0 10px rgba(124, 58, 237, 0.4))',
                                    }}
                                >
                                    REFLECT &amp; CONNECT
                                </h2>
                            </div>

                            {/* Reflection Prompt Box */}
                            <div className="relative rounded-xl bg-paper-2/60 p-3 sm:p-4 ring-1 ring-glass-ring">
                                <div className="absolute -left-1 top-0 h-full w-1 rounded-full bg-gradient-to-b from-neon-cyan via-post to-neon-fuchsia" />
                                <p className="text-sm font-bold leading-relaxed text-white sm:text-base md:text-lg">
                                    {MISSION.reflectPrompt}
                                </p>
                            </div>

                            {/* Reflection Hints & Examples */}
                            <div className="flex flex-col gap-2 rounded-xl bg-neon-cyan/10 p-3 sm:p-4 ring-1.5 ring-neon-cyan/35">
                                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neon-cyan/25 text-sm ring-1 ring-neon-cyan/50">
                    ✨
                  </span>
                                    <p className="font-display text-[11px] font-black uppercase tracking-wider text-neon-cyan sm:text-xs">
                                        Reflection Space
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2 pl-9 sm:pl-9">
                                    <p className="text-xs font-semibold leading-relaxed text-white/90 sm:text-sm">
                                        Take a quiet moment. Think of patterns in the real world that can't be split
                                        with just one straight line.
                                    </p>

                                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                                        {['Face detection', 'Handwriting', 'Voice tones', 'Game moves', 'Medical scans'].map((tag) => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center rounded-lg bg-glass-bg/90 px-2.5 py-1 text-[11px] font-bold text-white ring-1 ring-glass-ring sm:text-xs"
                                            >
                        🔸 {tag}
                      </span>
                                        ))}
                                    </div>

                                    <div className="mt-1 rounded-lg bg-paper-2/50 p-3 ring-1 ring-glass-ring/60">
                                        <p className="text-xs font-semibold leading-normal text-white/80">
                                            <span className="font-extrabold text-neon-cyan">💡 Teacher note:</span>{' '}
                                            Discuss aloud with your class or think through quietly. No written answers
                                            needed — the goal is to build the intuition that depth = non-linearity = power!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Restart Action Button */}
                    <motion.div
                        initial={reduce ? false : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.35, ease: 'easeOut' }}
                        className="flex shrink-0 flex-col items-stretch gap-2 pt-1 sm:flex-row sm:items-center sm:justify-center sm:gap-3"
                    >
                        <ChunkyButton
                            variant="ghost"
                            size="lg"
                            className="w-full sm:w-auto"
                            onClick={mission.restart}
                        >
                            ↻ Restart Mission
                        </ChunkyButton>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}