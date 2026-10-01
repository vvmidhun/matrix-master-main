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
    <div className="relative h-dvh w-full overflow-hidden text-ink">
      <SceneBackground variant="badge" className="absolute inset-0 h-full w-full" />

      <Sparkles
        variant="cyan"
        count={20}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-80"
      />
      <Sparkles
        variant="fuchsia"
        count={18}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-70 mix-blend-screen"
      />
      <Sparkles
        variant="gold"
        count={16}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-75 mix-blend-screen"
      />

      <div className="relative z-10 min-h-full w-full overflow-y-auto touch-pan-y">
        <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col items-center justify-between gap-5 px-4 py-6 sm:px-6 sm:py-8 md:gap-7 md:px-8 md:py-10">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex w-full flex-col items-center gap-2 text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-glass-bg px-4 py-2 ring-2 ring-neon-fuchsia/50 backdrop-blur shadow-neon-fuchsia">
              <span className="font-display text-[11px] font-black uppercase tracking-[0.22em] text-neon-fuchsia sm:text-xs">
                ✦ Badge Earned ✦
              </span>
            </div>
            <h1
              className="w-full font-display text-3xl font-extrabold leading-none tracking-tight sm:text-4xl md:text-5xl"
              style={{
                background:
                  'linear-gradient(90deg, #FDE68A 0%, #FBBF24 25%, #22D3EE 60%, #E879F9 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 18px rgba(251, 191, 36, 0.5))',
              }}
            >
              MATRIX MASTER BADGE
            </h1>
          </motion.div>

          <div className="flex flex-1 w-full flex-col items-center justify-center gap-5 py-2 sm:gap-6 md:gap-8">
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.6, rotate: -18 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.15,
                ease: [0.15, 1.1, 0.3, 1],
              }}
              className="relative"
            >
              <div
                className="pointer-events-none absolute -inset-8 -z-10 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(251, 191, 36, 0.45) 0%, rgba(232, 121, 249, 0.22) 40%, transparent 75%)',
                  filter: 'blur(8px)',
                }}
              />
              <motion.div
                animate={reduce ? {} : { y: [0, -6, 0] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.9,
                }}
              >
                <BadgeArt className="h-60 w-auto drop-shadow-2xl sm:h-72 md:h-[280px]" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55, ease: 'easeOut' }}
              className="flex w-full max-w-xl flex-col items-center gap-3 text-center"
            >
              <div className="relative w-full rounded-3xl bg-glass-bg p-4 ring-2 ring-glass-ring backdrop-blur-xl shadow-panel sm:p-5 md:p-6">
                <div
                  className="pointer-events-none absolute inset-0 rounded-3xl opacity-40"
                  aria-hidden
                  style={{
                    background:
                      'radial-gradient(circle at 50% 0%, rgba(251, 191, 36, 0.18) 0%, transparent 55%)',
                  }}
                />
                <div className="relative flex flex-col items-center gap-2 sm:gap-3">
                  <p className="font-display text-[11px] font-black uppercase tracking-[0.2em] text-neon-cyan sm:text-xs">
                    {MISSION.roleName}
                  </p>
                  <p
                    className="font-display text-xl font-extrabold leading-tight sm:text-2xl md:text-3xl"
                    style={{
                      background: 'linear-gradient(90deg, #22D3EE 0%, #E879F9 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    You just implemented a 2-layer neural network from scratch! 🏆
                  </p>
                  <div className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-post/20 px-3 py-1 ring-1 ring-post/50">
                      <span className="h-1.5 w-1.5 rounded-full bg-neon-lime shadow-neon-lime" />
                      <span className="font-display text-[10px] font-black uppercase tracking-[0.16em] text-ink-2 sm:text-xs">
                        Forward Pass
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-neon-fuchsia/20 px-3 py-1 ring-1 ring-neon-fuchsia/50">
                      <span className="h-1.5 w-1.5 rounded-full bg-neon-fuchsia shadow-neon-fuchsia" />
                      <span className="font-display text-[10px] font-black uppercase tracking-[0.16em] text-ink-2 sm:text-xs">
                        Cross-Entropy Loss
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-neon-cyan/20 px-3 py-1 ring-1 ring-neon-cyan/50">
                      <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan shadow-neon-cyan" />
                      <span className="font-display text-[10px] font-black uppercase tracking-[0.16em] text-ink-2 sm:text-xs">
                        Backprop + XOR
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.7, ease: 'easeOut' }}
            className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4"
          >
            <ChunkyButton
              variant="cyan"
              size="xl"
              className="w-full sm:w-auto"
              onClick={mission.goReflect}
            >
              💭 Reflect & Connect
            </ChunkyButton>
            <ChunkyButton
              variant="ghost"
              size="md"
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
