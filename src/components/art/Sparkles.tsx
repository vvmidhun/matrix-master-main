type Variant = 'cyan' | 'fuchsia' | 'lime' | 'gold'

interface SparklesProps {
  variant?: Variant
  count?: number
  className?: string
}

const VARIANT_COLORS: Record<Variant, string> = {
  cyan: '#22D3EE',
  fuchsia: '#E879F9',
  lime: '#A3E635',
  gold: '#FBBF24',
}

export function Sparkles({ variant = 'cyan', count = 24, className }: SparklesProps) {
  const color = VARIANT_COLORS[variant]

  const filterId = `sparkleGlow-${variant}`

  const items = Array.from({ length: count }, (_, i) => {
    const seed = i * 997 + 7
    const x = ((seed * 17) % 1000) / 10
    const y = ((seed * 31) % 1000) / 10
    const type = seed % 3
    const sizeBase = 1.2 + ((seed * 7) % 35) / 10
    const size = Math.max(1.5, sizeBase)
    const opacity = 0.45 + ((seed * 11) % 55) / 100
    const rotation = (seed * 13) % 360
    return { x, y, type, size, opacity, rotation, key: i }
  })

  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="none"
    >
      <defs>
        <filter id={filterId} x="-400%" y="-400%" width="900%" height="900%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {items.map((item) => {
        const cx = item.x
        const cy = item.y
        const s = item.size

        if (item.type === 0) {
          return (
            <circle
              key={item.key}
              cx={cx}
              cy={cy}
              r={s * 0.45}
              fill={color}
              opacity={item.opacity}
              filter={`url(#${filterId})`}
            />
          )
        }

        if (item.type === 1) {
          const sp = s
          const path = [
            `M${cx} ${cy - sp}`,
            `L${cx + sp * 0.3} ${cy - sp * 0.3}`,
            `L${cx + sp} ${cy - sp * 0.15}`,
            `L${cx + sp * 0.4} ${cy + sp * 0.15}`,
            `L${cx + sp * 0.55} ${cy + sp}`,
            `L${cx} ${cy + sp * 0.5}`,
            `L${cx - sp * 0.55} ${cy + sp}`,
            `L${cx - sp * 0.4} ${cy + sp * 0.15}`,
            `L${cx - sp} ${cy - sp * 0.15}`,
            `L${cx - sp * 0.3} ${cy - sp * 0.3}`,
            'Z'
          ].join(' ')
          return (
            <path
              key={item.key}
              d={path}
              fill={color}
              opacity={item.opacity}
              filter={`url(#${filterId})`}
              transform={`rotate(${item.rotation} ${cx} ${cy})`}
            />
          )
        }

        const half = s * 0.45
        return (
          <rect
            key={item.key}
            x={cx - half}
            y={cy - half}
            width={half * 2}
            height={half * 2}
            fill={color}
            opacity={item.opacity}
            filter={`url(#${filterId})`}
            transform={`rotate(${item.rotation} ${cx} ${cy})`}
          />
        )
      })}
    </svg>
  )
}
