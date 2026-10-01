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
    <div className="relative h-dvh w-full overflow-hidden text-ink">
      <SceneBackground variant="play" className="absolute inset-0 h-full w-full" />

      <div className="relative z-10 min-h-full w-full overflow-y-auto touch-pan-y">
        <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col gap-5 px-4 py-5 sm:px-6 sm:py-7 md:gap-6 md:px-8 md:py-9">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="flex flex-col items-center gap-1 text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-glass-bg px-4 py-2 ring-2 ring-post/50 backdrop-blur">
              <span className="font-display text-[11px] font-black uppercase tracking-[0.22em] text-neon-fuchsia sm:text-xs">
                Grade {MISSION.grade} · {MISSION.missionName}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: 'easeOut' }}
            className="relative flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:justify-center sm:gap-5"
          >
            <motion.div
              animate={reduce ? {} : { y: [0, -7, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="relative shrink-0"
            >
              <CoachSprite mood="wow" className="h-40 w-auto drop-shadow-2xl sm:h-48 md:h-52" />
              <div
                className="pointer-events-none absolute -inset-4 -z-10 rounded-full opacity-60 blur-2xl"
                style={{
                  background:
                    'radial-gradient(circle, rgba(232, 121, 249, 0.4) 0%, transparent 70%)',
                }}
              />
            </motion.div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.18, ease: 'easeOut' }}
              className="relative max-w-md rounded-2xl bg-glass-bg px-4 py-3.5 ring-2 ring-neon-cyan/50 backdrop-blur-md shadow-panel sm:px-5 sm:py-4.5"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-6 w-6 rotate-45 bg-glass-bg ring-2 ring-neon-cyan/50 ring-b-transparent ring-l-transparent sm:left-8 sm:-translate-x-0" />
              <p className="font-display text-[11px] font-black uppercase tracking-[0.2em] text-neon-cyan sm:text-xs">
                Coach Nova
              </p>
              <p className="mt-0.5 text-sm font-semibold leading-snug text-ink sm:text-base">
                Wow — you just watched a straight line <em className="text-neon-fuchsia">bend</em> into a curve that
                cracks XOR! That's the magic of hidden layers. Take a second to think about what
                that <em className="text-neon-cyan">actually</em> means… 🤔
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative flex-1 overflow-hidden rounded-3xl bg-glass-bg ring-2 ring-glass-ring backdrop-blur-xl shadow-panel"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-50"
              aria-hidden
              style={{
                background:
                  'radial-gradient(circle at 15% 0%, rgba(34, 211, 238, 0.2) 0%, transparent 55%), radial-gradient(circle at 85% 100%, rgba(232, 121, 249, 0.2) 0%, transparent 55%)',
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 rounded-3xl opacity-70"
              aria-hidden
              style={{
                border: '1px solid rgba(124, 58, 237, 0.45)',
                boxShadow: 'inset 0 0 45px rgba(124, 58, 237, 0.12)',
              }}
            />

            <div className="relative flex flex-col gap-5 p-5 sm:p-7 md:gap-6 md:p-8">
              <div className="flex flex-col items-start gap-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-post/25 px-3.5 py-1.5 ring-2 ring-post/60">
                  <span className="text-lg">🧠</span>
                  <span className="font-display text-[11px] font-black uppercase tracking-[0.24em] text-neon-fuchsia sm:text-xs">
                    Deep Think
                  </span>
                </div>
                <h2
                  className="font-display text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl"
                  style={{
                    background:
                      'linear-gradient(90deg, #22D3EE 0%, #7C3AED 50%, #E879F9 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 12px rgba(124, 58, 237, 0.5))',
                  }}
                >
                  REFLECT &amp; CONNECT
                </h2>
              </div>

              <div className="relative rounded-2xl bg-paper-2/60 p-4 ring-1 ring-glass-ring sm:p-5 md:p-6">
                <div className="absolute -left-1 top-0 h-full w-1 rounded-full bg-gradient-to-b from-neon-cyan via-post to-neon-fuchsia" />
                <p className="text-base font-bold leading-relaxed text-ink sm:text-lg md:text-xl">
                  {MISSION.reflectPrompt}
                </p>
              </div>

              <div className="flex flex-col gap-3 rounded-2xl bg-neon-cyan/8 p-4 ring-2 ring-neon-cyan/35 sm:p-5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neon-cyan/25 text-lg ring-2 ring-neon-cyan/50">
                    ✨
                  </span>
                  <p className="font-display text-xs font-black uppercase tracking-[0.2em] text-neon-cyan sm:text-sm">
                    Reflection Space
                  </p>
                </div>
                <div className="flex flex-col gap-2.5 pl-11.5 sm:pl-[3.35rem]">
                  <p className="text-sm font-semibold leading-relaxed text-ink-2 sm:text-base">
                    Take a quiet moment. Think of patterns in the real world that can't be split
                    with just one straight line.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Face detection', 'Handwriting', 'Voice tones', 'Game moves', 'Medical scans'].map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-xl bg-glass-bg/80 px-3 py-1.5 text-xs font-bold text-ink ring-1 ring-glass-ring sm:px-3.5 sm:py-2 sm:text-sm"
                      >
                        🔸 {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 rounded-xl bg-paper-2/50 p-3.5 ring-1 ring-glass-ring/60 sm:p-4.5">
                    <p className="text-xs font-semibold leading-snug text-ink-2/85 sm:text-sm">
                      <span className="font-black text-neon-cyan">💡 Teacher note:</span>{' '}
                      Discuss aloud with your class or think through quietly. No written answers
                      needed — the goal is to build the intuition that depth = non-linearity = power!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.6, ease: 'easeOut' }}
            className="flex shrink-0 flex-col items-stretch gap-3 pt-1 sm:flex-row sm:items-center sm:justify-center sm:gap-4"
          >
            <ChunkyButton
              variant="ghost"
              size="xl"
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
