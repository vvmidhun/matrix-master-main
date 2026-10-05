import { motion } from 'motion/react'
import type { MissionApi } from '../state/useMission'
import { MISSION } from '../content/mission'
import { ART_PATHS } from '../content/art'
import { SceneBackground } from './art/SceneBackground'
import { ChunkyButton } from './ui/ChunkyButton'

interface HomeScreenProps {
    mission: MissionApi
    onPrefetchPlay: () => void
}

export function HomeScreen({ mission, onPrefetchPlay }: HomeScreenProps) {
    return (
        <div className="relative h-full min-h-dvh w-full overflow-hidden text-ink touch-pan-y [text-size-adjust:none]">
            <SceneBackground variant="home" className="absolute inset-0 h-full w-full" />

            {/* Dark Backdrop Overlay & Blur for Text Readability */}
            <div
                className="pointer-events-none absolute inset-0 z-[1] bg-slate-950/60 backdrop-blur-[2px]"
                aria-hidden
            />

            <div className="relative z-10 h-full w-full overflow-y-auto">
                <div className="mx-auto flex min-h-full w-full max-w-lg flex-col px-3 py-3 sm:px-4 sm:py-6 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] gap-3 sm:gap-4">

                    {/* ========================= HEADER CARD ========================= */}
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="shrink-0"
                    >
                        <div
                            className="relative overflow-hidden rounded-2xl px-4 py-3.5 sm:px-6 sm:py-5 shadow-panel text-center"
                            style={{
                                background:
                                    'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
                                boxShadow:
                                    '0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.2)',
                            }}
                        >
                            <div
                                className="pointer-events-none absolute inset-0 opacity-70"
                                aria-hidden
                                style={{
                                    background:
                                        'radial-gradient(ellipse at 90% 10%, rgba(34, 211, 238, 0.16) 0%, transparent 50%), radial-gradient(ellipse at 10% 100%, rgba(232, 121, 249, 0.18) 0%, transparent 50%)',
                                }}
                            />

                            <div className="relative flex flex-col items-center gap-1">
                <span
                    className="rounded-full px-3 py-0.5 font-display text-[10px] font-black uppercase tracking-[0.2em] sm:text-xs"
                    style={{
                        background: 'linear-gradient(90deg, rgba(34, 211, 238, 0.18), rgba(124, 58, 237, 0.2))',
                        color: '#4338CA',
                        border: '1px solid rgba(124, 58, 237, 0.3)',
                    }}
                >
                  Grade {MISSION.grade}
                </span>
                                <h1
                                    className="font-display text-xl font-extrabold leading-tight tracking-tight sm:text-3xl"
                                    style={{
                                        background:
                                            'linear-gradient(92deg, #1E293B 0%, #4338CA 42%, #7C3AED 60%, #C026D3 100%)',
                                        WebkitBackgroundClip: 'text',
                                        backgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    AI Innovators
                                </h1>
                                <p className="font-medium text-slate-600 text-xs sm:text-sm">
                                    {MISSION.chapter}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* ========================= COACH PORTRAIT ========================= */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
                        className="flex shrink-0 justify-center py-1"
                    >
                        <div className="relative flex flex-col items-center">
                            <div
                                className="absolute -inset-3 -z-10 rounded-full blur-2xl opacity-60"
                                style={{
                                    background:
                                        'radial-gradient(circle, rgba(124, 58, 237, 0.5) 0%, rgba(34, 211, 238, 0.25) 50%, transparent 75%)',
                                }}
                            />
                            <div
                                className="relative overflow-hidden rounded-2xl ring-2 ring-white/80"
                                style={{
                                    boxShadow: '0 15px 30px -10px rgba(0,0,0,0.5)',
                                }}
                            >
                                <img
                                    src={ART_PATHS.coachIdle}
                                    alt="Coach Nova"
                                    className="h-30 w-auto object-cover object-center sm:h-30"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* ========================= MISSION CARD ========================= */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
                        className="shrink-0"
                    >
                        <div
                            className="relative overflow-hidden rounded-2xl px-4 py-3.5 sm:px-6 sm:py-5 shadow-panel"
                            style={{
                                background:
                                    'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 243, 199, 0.98) 100%)',
                                boxShadow:
                                    '0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.3)',
                            }}
                        >
                            <div
                                className="pointer-events-none absolute inset-0 opacity-40"
                                aria-hidden
                                style={{
                                    background:
                                        'radial-gradient(ellipse at 0% 0%, rgba(250, 204, 21, 0.25) 0%, transparent 45%), radial-gradient(ellipse at 100% 100%, rgba(236, 72, 153, 0.15) 0%, transparent 40%)',
                                }}
                            />

                            <div className="relative flex flex-col gap-1.5 sm:gap-2">
                <span className="font-display text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-amber-800">
                  {MISSION.roleName}
                </span>
                                <h2 className="font-display text-lg sm:text-2xl font-extrabold leading-tight text-slate-900">
                                    {MISSION.missionName}
                                </h2>
                                <p className="text-xs sm:text-sm font-semibold leading-relaxed text-slate-900 mt-0.5">
                                    {MISSION.intro}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Spacer */}
                    <div className="flex-1 min-h-[8px]" />

                    {/* ========================= CTA BUTTONS ========================= */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
                        className="flex shrink-0 flex-col gap-2 pt-1"
                    >
                        <ChunkyButton
                            variant="primary"
                            size="md"
                            className="w-full !py-2.5 !text-xs sm:!text-base"
                            onClick={() => {
                                onPrefetchPlay()
                                mission.startPlay()
                            }}
                        >
                            🚀 Start mission
                        </ChunkyButton>
                        <ChunkyButton
                            variant="cyan"
                            size="md"
                            className="w-full !py-2.5 !text-xs sm:!text-base"
                            onClick={mission.openHowTo}
                        >
                            📖 How to play
                        </ChunkyButton>
                    </motion.div>

                </div>
            </div>
        </div>
    )
}