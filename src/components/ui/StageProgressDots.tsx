export interface StageProgressDotsProps {
  current: number
  total: number
  labels?: readonly string[]
}

export function StageProgressDots({ current, total, labels }: StageProgressDotsProps) {
  const dots = Array.from({ length: total }, (_, i) => i)

  return (
    <div className="flex w-full items-center justify-center gap-1 sm:gap-2" role="list">
      {dots.map((i) => {
        const isCompleted = i < current
        const isCurrent = i === current
        const hasLabel = labels && labels[i]

        let dotCls = ''
        let ringCls = ''
        if (isCompleted) {
          dotCls = 'bg-neon-lime shadow-neon-lime'
          ringCls = 'ring-neon-lime/50'
        } else if (isCurrent) {
          dotCls = 'bg-neon-cyan shadow-neon-cyan'
          ringCls = 'ring-neon-cyan/60 ring-2 animate-pulse'
        } else {
          dotCls = 'bg-transparent'
          ringCls = 'ring-glass-ring ring-2'
        }

        return (
          <div key={i} className="flex items-center" role="listitem">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={[
                  'flex h-7 w-7 items-center justify-center rounded-full ring-2 transition-all sm:h-8 sm:w-8',
                  dotCls,
                  ringCls,
                ].join(' ')}
                aria-label={
                  isCompleted
                    ? `Stage ${i + 1} complete`
                    : isCurrent
                      ? `Current stage ${i + 1}`
                      : `Future stage ${i + 1}`
                }
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isCompleted ? (
                  <svg
                    viewBox="0 0 20 20"
                    className="h-4 w-4 text-paper sm:h-4.5 sm:w-4.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 10l4 4 8-8" />
                  </svg>
                ) : (
                  <span
                    className={[
                      'font-display text-xs font-extrabold',
                      isCurrent ? 'text-paper' : isCompleted ? 'text-paper' : 'text-ink-2',
                    ].join(' ')}
                  >
                    {i + 1}
                  </span>
                )}
              </div>
              {hasLabel && (
                <span
                  className={[
                    'font-display text-[10px] font-bold uppercase tracking-wider sm:text-xs',
                    isCompleted ? 'text-neon-lime' : isCurrent ? 'text-neon-cyan' : 'text-ink-2/60',
                  ].join(' ')}
                >
                  {labels![i]}
                </span>
              )}
            </div>
            {i < total - 1 && (
              <div
                className={[
                  'mx-0.5 h-1 w-4 rounded-full sm:w-6',
                  isCompleted ? 'bg-neon-lime/70' : 'bg-glass-ring/40',
                ].join(' ')}
                aria-hidden
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
