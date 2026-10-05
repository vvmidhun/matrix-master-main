import { motion, useReducedMotion } from 'motion/react'
import type { MissionApi } from '../state/useMission'
import { ChunkyButton } from './ui/ChunkyButton'

interface HowToPlayOverlayProps {
  mission: MissionApi
  onClose: () => void
}

const HOW_TO_STEPS = [
  {
    stage: 'STAGE 1 • VECTORS',
    icon: '⚡',
    accent: 'from-neon-cyan/30 to-neon-cyan/5',
    ring: 'ring-neon-cyan/50',
    body:
      'Type the dot product number. Use the on-screen keypad or your keyboard.',
  },
  {
    stage: 'STAGE 2 • MATRIX',
    icon: '📊',
    accent: 'from-neon-fuchsia/30 to-neon-fuchsia/5',
    ring: 'ring-neon-fuchsia/50',
    body:
      'Fill each cell in the grid. Tap a cell to see the calculation breakdown!',
  },
  {
    stage: 'STAGE 3 • FORWARD PASS',
    icon: '🔀',
    accent: 'from-neon-cyan/30 to-post/10',
    ring: 'ring-neon-cyan/50',
    body:
      'Tap the operation blocks IN ORDER to wire the signal through the 2-layer net.',
  },
  {
    stage: 'STAGE 4 • CHAPTER CHECK',
    icon: '🧠',
    accent: 'from-neon-fuchsia/30 to-neon-amber/10',
    ring: 'ring-neon-fuchsia/50',
    body:
      'Answer quick multiple-choice questions about forward passes, PCA, and ReLU.',
  },
  {
    stage: 'STAGE 5 • FORWARD PASS',
    icon: '➡️',
    accent: 'from-neon-lime/25 to-neon-lime/5',
    ring: 'ring-neon-lime/50',
    body:
      'Put the input, weighted sum, activation, and output in the order data moves through a layer.',
  },
  {
    stage: 'STAGE 6 • SOLVE XOR',
    icon: '🎯',
    accent: 'from-neon-amber/30 to-post/10',
    ring: 'ring-neon-amber/50',
    body:
      'Label the four input pairs, decide whether one straight line can separate the outputs, then start the network once and watch its hidden layer learn the pattern.',
  },
] as const

export function HowToPlayOverlay({ mission, onClose }: HowToPlayOverlayProps) {
  const reduce = useReducedMotion()

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-md p-3 sm:p-4 touch-pan-y [text-size-adjust:none]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="howto-title"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose()
      }}
    >
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0"
        aria-hidden
      />

      <motion.div
        initial={reduce ? false : { y: 16, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[85dvh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-glass-bg ring-1 ring-glass-ring backdrop-blur-xl shadow-panel"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          aria-hidden
          style={{
            background:
              'radial-gradient(circle at 15% 0%, rgba(34, 211, 238, 0.18) 0%, transparent 50%), radial-gradient(circle at 85% 100%, rgba(232, 121, 249, 0.18) 0%, transparent 50%)',
          }}
        />

        {/* Header */}
        <div className="relative shrink-0 px-4 pt-4 pb-2.5 sm:px-5 sm:pt-5 sm:pb-3">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="flex items-start justify-between gap-2"
          >
            <div className="min-w-0 flex-1">
              <p className="font-display !text-[9px] sm:!text-[10px] font-black uppercase tracking-[0.2em] text-neon-cyan">
                Mission Briefing
              </p>
              <h2
                id="howto-title"
                className="mt-0.5 font-display !text-base sm:!text-xl font-extrabold leading-tight"
                style={{
                  background:
                    'linear-gradient(90deg, #22D3EE 0%, #7C3AED 50%, #E879F9 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                HOW TO PLAY — MATRIX MASTER
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close how to play"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-paper-2/70 text-sm text-ink-2 ring-1 ring-glass-ring transition hover:bg-paper-2 hover:text-ink active:scale-95"
            >
              ✕
            </button>
          </motion.div>
        </div>

        {/* Scrollable Step List */}
        <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-3 sm:px-5">
          <ol className="flex flex-col gap-2">
            {HOW_TO_STEPS.map((step, idx) => (
              <motion.li
                key={step.stage}
                initial={reduce ? false : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.25,
                  delay: 0.05 + idx * 0.04,
                  ease: 'easeOut',
                }}
                className={`relative flex items-start gap-2.5 rounded-xl bg-gradient-to-br ${step.accent} p-2.5 sm:p-3 ring-1 ${step.ring} backdrop-blur`}
              >
                <span
                  className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-glass-bg text-sm sm:text-base ring-1 ring-glass-ring"
                >
                  {step.icon}
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="font-display !text-xs font-black uppercase tracking-[0.1em] text-neon-cyan leading-none">
                    {step.stage}
                  </p>
                  <p className="mt-1 !text-[11px] sm:!text-xs font-medium leading-relaxed text-ink/90">
                    {step.body}
                  </p>
                </div>
              </motion.li>
            ))}

            {/* Coach Tip */}
            <motion.li
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.35, ease: 'easeOut' }}
              className="relative flex items-start gap-2.5 rounded-xl bg-neon-fuchsia/10 p-2.5 sm:p-3 ring-1 ring-neon-fuchsia/40"
            >
              <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-neon-fuchsia/25 text-xs sm:text-sm ring-1 ring-neon-fuchsia/60">
                💡
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="font-display !text-xs font-black uppercase tracking-[0.1em] text-neon-fuchsia leading-none">
                  Coach Tip
                </p>
                <p className="mt-1 !text-[11px] sm:!text-xs font-medium leading-relaxed text-ink/90">
                  Tap the purple Read button any time to hear Coach Nova read the task out loud.
                </p>
              </div>
            </motion.li>
          </ol>
        </div>

        {/* Footer Actions */}
        <div className="relative shrink-0 border-t border-glass-ring/70 px-4 py-3 sm:px-5 sm:py-3.5">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.4 }}
            className="flex items-center justify-end gap-2"
          >
            <ChunkyButton
              variant="ghost"
              size="md"
              className="!py-1.5 !px-3 !text-xs"
              onClick={onClose}
            >
              Back
            </ChunkyButton>
            <ChunkyButton
              variant="primary"
              size="md"
              className="!py-1.5 !px-4 !text-xs"
              onClick={() => {
                onClose()
                mission.startPlay()
              }}
            >
              Got it — start!
            </ChunkyButton>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}