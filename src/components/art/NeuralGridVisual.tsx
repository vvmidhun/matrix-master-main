interface NeuralGridVisualProps {
  layers?: readonly number[]
  activeNode?: { layer: number; node: number } | null
  activatedPath?: readonly { layer: number; node: number }[] | null
  className?: string
}

export function NeuralGridVisual({
  layers = [3, 4, 3, 1] as const,
  activeNode = null,
  activatedPath = null,
  className,
}: NeuralGridVisualProps) {
  const WIDTH = 320
  const HEIGHT = 220
  const PADDING_X = 36
  const PADDING_Y = 28
  const NODE_RADIUS = 11
  const ACTIVE_RADIUS = 13
  const PULSE_RADIUS = 16

  const layerCount = layers.length

  const usableW = WIDTH - PADDING_X * 2
  const usableH = HEIGHT - PADDING_Y * 2

  const getLayerX = (layerIdx: number) => {
    if (layerCount === 1) return WIDTH / 2
    return PADDING_X + (usableW * layerIdx) / (layerCount - 1)
  }

  const getNodeY = (layerIdx: number, nodeIdx: number) => {
    const total = layers[layerIdx]
    if (total === 1) return HEIGHT / 2
    const spacing = usableH / (total - 1)
    const startY = PADDING_Y
    return startY + spacing * nodeIdx
  }

  const isActivated = (layer: number, node: number): boolean => {
    if (!activatedPath) return false
    return activatedPath.some((n) => n.layer === layer && n.node === node)
  }

  const isActive = (layer: number, node: number): boolean => {
    if (!activeNode) return false
    return activeNode.layer === layer && activeNode.node === node
  }

  const isLineActivated = (
    fromLayer: number,
    fromNode: number,
    toLayer: number,
    toNode: number
  ): boolean => {
    if (!activatedPath) return false
    const fromOn = isActivated(fromLayer, fromNode)
    const toOn = isActivated(toLayer, toNode)
    return fromOn && toOn
  }

  const cyanGlowId = 'neuralGrid-cyanGlow'
  const fuchsiaGlowId = 'neuralGrid-fuchsiaGlow'

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id={cyanGlowId} x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={fuchsiaGlowId} x="-400%" y="-400%" width="900%" height="900%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Layer labels subtle */}
      <g opacity="0.4" fontFamily="system-ui, sans-serif" fontSize="10" fill="#B8C0E8">
        {layers.map((_, layerIdx) => {
          const x = getLayerX(layerIdx)
          const isFirst = layerIdx === 0
          const isLast = layerIdx === layerCount - 1
          let label = ''
          if (isFirst) label = 'IN'
          else if (isLast) label = 'OUT'
          else label = `H${layerIdx}`
          return (
            <text
              key={`label-${layerIdx}`}
              x={x}
              y={HEIGHT - 6}
              textAnchor="middle"
              fontWeight="600"
            >
              {label}
            </text>
          )
        })}
      </g>

      {/* Connections (lines between layers) */}
      <g>
        {layers.slice(0, -1).map((_, layerIdx) => {
          const fromX = getLayerX(layerIdx)
          const toX = getLayerX(layerIdx + 1)
          const fromCount = layers[layerIdx]
          const toCount = layers[layerIdx + 1]
          const lines: React.ReactNode[] = []
          for (let a = 0; a < fromCount; a++) {
            for (let b = 0; b < toCount; b++) {
              const y1 = getNodeY(layerIdx, a)
              const y2 = getNodeY(layerIdx + 1, b)
              const activated = isLineActivated(layerIdx, a, layerIdx + 1, b)
              const lineKey = `line-${layerIdx}-${a}-${layerIdx + 1}-${b}`
              if (activated) {
                lines.push(
                  <line
                    key={lineKey}
                    x1={fromX}
                    y1={y1}
                    x2={toX}
                    y2={y2}
                    stroke="#22D3EE"
                    strokeWidth="2"
                    opacity="0.95"
                    filter={`url(#${cyanGlowId})`}
                    strokeLinecap="round"
                  />
                )
              } else {
                lines.push(
                  <line
                    key={lineKey}
                    x1={fromX}
                    y1={y1}
                    x2={toX}
                    y2={y2}
                    stroke="#7C3AED"
                    strokeWidth="0.9"
                    opacity="0.35"
                    strokeLinecap="round"
                  />
                )
              }
            }
          }
          return <g key={`lines-${layerIdx}`}>{lines}</g>
        })}
      </g>

      {/* Nodes */}
      <g>
        {layers.map((count, layerIdx) => {
          const x = getLayerX(layerIdx)
          const nodes: React.ReactNode[] = []
          for (let i = 0; i < count; i++) {
            const y = getNodeY(layerIdx, i)
            const activated = isActivated(layerIdx, i)
            const active = isActive(layerIdx, i)
            const nodeKey = `node-${layerIdx}-${i}`

            if (active) {
              nodes.push(
                <g key={nodeKey}>
                  {/* Fuchsia pulse halo */}
                  <circle
                    cx={x}
                    cy={y}
                    r={PULSE_RADIUS + 5}
                    fill="none"
                    stroke="#E879F9"
                    strokeWidth="1.5"
                    opacity="0.5"
                    filter={`url(#${fuchsiaGlowId})`}
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r={PULSE_RADIUS}
                    fill="rgba(232,121,249,0.25)"
                    stroke="#E879F9"
                    strokeWidth="1.5"
                    filter={`url(#${fuchsiaGlowId})`}
                  />
                  {/* Core fuchsia node */}
                  <circle
                    cx={x}
                    cy={y}
                    r={ACTIVE_RADIUS}
                    fill="#E879F9"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                  {/* Inner highlight */}
                  <circle cx={x - 3.5} cy={y - 3.5} r="3" fill="#FFFFFF" opacity="0.75" />
                  <circle cx={x - 2} cy={y - 2} r="1.2" fill="#FFFFFF" />
                </g>
              )
            } else if (activated) {
              nodes.push(
                <g key={nodeKey}>
                  {/* Cyan halo */}
                  <circle
                    cx={x}
                    cy={y}
                    r={NODE_RADIUS + 6}
                    fill="rgba(34,211,238,0.15)"
                    stroke="#22D3EE"
                    strokeWidth="1"
                    opacity="0.8"
                    filter={`url(#${cyanGlowId})`}
                  />
                  {/* Cyan core */}
                  <circle
                    cx={x}
                    cy={y}
                    r={NODE_RADIUS + 1.5}
                    fill="rgba(34,211,238,0.35)"
                    stroke="#22D3EE"
                    strokeWidth="1.8"
                    filter={`url(#${cyanGlowId})`}
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r={NODE_RADIUS - 1}
                    fill="#22D3EE"
                    opacity="0.92"
                  />
                  {/* Shine */}
                  <circle cx={x - 3} cy={y - 3} r="2.5" fill="#FFFFFF" opacity="0.7" />
                  <circle cx={x - 1.5} cy={y - 1.5} r="1" fill="#FFFFFF" />
                </g>
              )
            } else {
              nodes.push(
                <g key={nodeKey}>
                  {/* Inactive node */}
                  <circle
                    cx={x}
                    cy={y}
                    r={NODE_RADIUS}
                    fill="rgba(124,58,237,0.12)"
                    stroke="#7C3AED"
                    strokeWidth="1.4"
                    opacity="0.85"
                  />
                  {/* Inner ring hint */}
                  <circle
                    cx={x}
                    cy={y}
                    r={NODE_RADIUS - 3.5}
                    fill="none"
                    stroke="#7C3AED"
                    strokeWidth="0.6"
                    opacity="0.5"
                  />
                </g>
              )
            }
          }
          return <g key={`nodes-${layerIdx}`}>{nodes}</g>
        })}
      </g>

      {/* MaxNodes center guide hint (hidden aesthetic) */}
      <circle cx={getLayerX(Math.floor(layerCount / 2))} cy={HEIGHT / 2} r="0" fill="none" />
    </svg>
  )
}
