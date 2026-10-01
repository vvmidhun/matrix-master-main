import type { ReactNode } from 'react'
import type { CoachMood } from '../../types/game'
import { CoachSprite } from '../art/CoachSprite'
import { ChunkyButton } from './ChunkyButton'

export interface PlayShellProps {
  stageLabel: string
  progress?: string
  stageNumber?: number
  totalStages?: number
  coachMood: CoachMood
  coachLine: string
  coachTitle?: string
  muted: boolean
  onToggleMute: () => void
  onSpeak: () => void
  children: ReactNode
  footer?: ReactNode
}

export function PlayShell({
  stageLabel,
  progress,
  stageNumber,
  totalStages,
  coachMood,
  coachLine,
  coachTitle = 'Coach Nova',
  muted,
  onToggleMute,
  onSpeak,
  children,
  footer,
}: PlayShellProps) {
  return (
    <div className="flex h-full w-full flex-col">
      <header
        className="relative z-10 flex shrink-0 items-center gap-3 px-4 py-3 sm:px-6"
        style={{
          background: 'linear-gradient(135deg, var(--color-post) 0%, var(--color-post-deep) 100%)',
        }}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="rounded-full bg-paper/25 px-3 py-1 backdrop-blur">
            <span className="font-display text-xs font-extrabold tracking-[0.2em] text-white/90 sm:text-sm">
              STAGE {stageNumber != null && totalStages != null ? `${stageNumber} / ${totalStages}` : ''}
            </span>
          </div>
          <h1
            className="font-display text-lg font-extrabold tracking-tight text-white drop-shadow sm:text-2xl"
            style={{ textShadow: '0 0 18px rgba(232, 121, 249, 0.55)' }}
          >
            {stageLabel}
          </h1>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {progress && (
            <div className="rounded-full bg-paper/25 px-3 py-1 backdrop-blur">
              <span className="font-display text-sm font-bold text-white/90">
                {progress}
              </span>
            </div>
          )}
          <button
            onClick={onToggleMute}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-paper/25 text-lg text-white backdrop-blur transition hover:bg-paper/40 active:scale-95"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? '🔇' : '🔊'}
          </button>
        </div>
      </header>

      <div className="shrink-0 px-3 pt-3 sm:px-5 sm:pt-4">
        <div className="flex items-start gap-3 rounded-2xl bg-glass-bg p-3 ring-2 ring-glass-ring backdrop-blur-md shadow-panel sm:gap-4 sm:p-4">
          <CoachSprite mood={coachMood} className="h-16 w-16 sm:h-20 sm:w-20" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-extrabold text-neon-cyan sm:text-base">
                {coachTitle}
              </span>
              <div className="h-2 w-2 rounded-full bg-neon-lime shadow-neon-lime" />
            </div>
            <div className="flex items-start gap-3">
              <p className="flex-1 text-sm leading-snug text-ink-2 sm:text-base">
                {coachLine}
              </p>
              <ChunkyButton
                variant="cyan"
                size="sm"
                onClick={onSpeak}
                aria-label="Read aloud"
              >
                <span aria-hidden>▶</span>
                Read
              </ChunkyButton>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto px-3 py-3 sm:px-5 sm:py-4">
        {children}
      </main>

      {footer && (
        <footer className="shrink-0 border-t border-glass-ring/40 bg-glass-bg/80 px-3 py-3 backdrop-blur-md sm:px-5 sm:py-4">
          {footer}
        </footer>
      )}
    </div>
  )
}
