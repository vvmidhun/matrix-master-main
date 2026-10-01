import { NeuralGridVisual } from '../art/NeuralGridVisual'

export interface GameHeaderProps {
  grade: number
  subject?: string
  missionName: string
  chapter?: string
}

export function GameHeader({ grade, subject, missionName, chapter }: GameHeaderProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-glass-bg p-4 ring-2 ring-glass-ring backdrop-blur-md shadow-panel sm:p-6">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(34, 211, 238, 0.18) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(232, 121, 249, 0.18) 0%, transparent 50%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-60"
        aria-hidden
        style={{
          border: '1px solid rgba(124, 58, 237, 0.5)',
          boxShadow: 'inset 0 0 30px rgba(124, 58, 237, 0.12)',
        }}
      />

      <div className="relative flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-5">
        <div className="flex shrink-0 items-center justify-center">
          <div className="rounded-full bg-neon-cyan/15 px-4 py-2 ring-2 ring-neon-cyan/50 shadow-neon-cyan">
            <span className="font-display text-sm font-extrabold uppercase tracking-[0.15em] text-neon-cyan sm:text-base">
              Grade {grade}
            </span>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center sm:items-start sm:text-left">
          <h2
            className="w-full break-words font-display text-3xl font-extrabold leading-none tracking-tight sm:text-4xl md:text-5xl"
            style={{
              background: 'linear-gradient(90deg, #22D3EE 0%, #7C3AED 50%, #E879F9 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 12px rgba(124, 58, 237, 0.45))',
            }}
          >
            {missionName}
          </h2>
          {(subject || chapter) && (
            <p className="text-sm font-semibold text-ink-2 sm:text-base">
              {subject && <span className="mr-2">{subject}</span>}
              {chapter && <span>· {chapter}</span>}
            </p>
          )}
        </div>

        <div className="shrink-0">
          <NeuralGridVisual className="h-20 w-20 sm:h-24 sm:w-24" />
        </div>
      </div>
    </div>
  )
}
