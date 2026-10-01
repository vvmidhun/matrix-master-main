import { ART_PATHS } from '../../content/art'

type Variant = 'home' | 'play' | 'badge'

interface SceneBackgroundProps {
  variant: Variant
  className?: string
}

export function SceneBackground({ variant, className }: SceneBackgroundProps) {
  const imagePath =
    variant === 'home'
      ? ART_PATHS.bgHome
      : variant === 'play'
        ? ART_PATHS.bgPlay
        : ART_PATHS.bgBadge

  return (
    <div className={className ?? ''}>
      <img
        src={imagePath}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover opacity-55"
        style={{ filter: 'saturate(1.06) contrast(1.02) brightness(0.8)' }}
      />
      <svg
        viewBox="0 0 1920 1080"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
      <defs>
        {/* Home gradient */}
        <radialGradient id="homeBgGrad" cx="50%" cy="40%" r="80%">
          <stop offset="0%" stopColor="#312E81" />
          <stop offset="40%" stopColor="#1E1B4B" />
          <stop offset="75%" stopColor="#0F0B2E" />
          <stop offset="100%" stopColor="#050517" />
        </radialGradient>
        {/* Play gradient */}
        <linearGradient id="playBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1A1145" />
          <stop offset="50%" stopColor="#120D30" />
          <stop offset="100%" stopColor="#09071E" />
        </linearGradient>
        {/* Badge celebratory gradient */}
        <radialGradient id="badgeBgGrad" cx="50%" cy="45%" r="85%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="25%" stopColor="#A855F7" />
          <stop offset="55%" stopColor="#5B21B6" />
          <stop offset="100%" stopColor="#1E0A3C" />
        </radialGradient>
        <radialGradient id="badgeGoldGlow" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.55" />
          <stop offset="40%" stopColor="#F59E0B" stopOpacity="0.22" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        {/* Circuit border gradient */}
        <linearGradient id="circuitBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="50%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
        {/* Neural line glow */}
        <filter id="neuralGlow" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="4" result="blur1" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="softGlow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="6" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Radial burst for badge */}
        <radialGradient id="burstGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#FDE68A" stopOpacity="0.08" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        {/* Glass panel */}
        <linearGradient id="glassPanel" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(124,58,237,0.25)" />
          <stop offset="50%" stopColor="rgba(124,58,237,0.08)" />
          <stop offset="100%" stopColor="rgba(124,58,237,0.2)" />
        </linearGradient>
      </defs>

      {/* ==================== HOME VARIANT ==================== */}
      {variant === 'home' && (
        <g>
          {/* Deep indigo-violet radial background */}
          <rect width="1920" height="1080" fill="url(#homeBgGrad)" />
          {/* Subtle vignette */}
          <radialGradient id="vignetteHome" cx="50%" cy="50%" r="70%">
            <stop offset="60%" stopColor="transparent" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
          </radialGradient>
          <rect width="1920" height="1080" fill="url(#vignetteHome)" />

          {/* Faint matrix numbers 0s and 1s */}
          <g fill="#22D3EE" opacity="0.08" fontFamily="monospace" fontSize="18">
            <text x="120" y="120">1</text>
            <text x="180" y="200">0</text>
            <text x="80" y="280">1</text>
            <text x="220" y="360">0</text>
            <text x="140" y="440">1</text>
            <text x="260" y="520">1</text>
            <text x="60" y="600">0</text>
            <text x="200" y="680">0</text>
            <text x="160" y="760">1</text>
            <text x="100" y="840">1</text>
            <text x="240" y="920">0</text>

            <text x="1760" y="140">0</text>
            <text x="1700" y="220">1</text>
            <text x="1820" y="300">1</text>
            <text x="1740" y="380">0</text>
            <text x="1680" y="460">0</text>
            <text x="1800" y="540">1</text>
            <text x="1720" y="620">1</text>
            <text x="1840" y="700">0</text>
            <text x="1760" y="780">1</text>
            <text x="1680" y="860">0</text>
            <text x="1800" y="940">0</text>

            <text x="420" y="80">101</text>
            <text x="1480" y="90">011</text>
            <text x="600" y="980">0101</text>
            <text x="1340" y="990">1101</text>
          </g>

          {/* Cyan particle dust */}
          <g>
            {[...Array(80)].map((_, i) => {
              const x = (i * 137.5) % 1920
              const y = (i * 293.3) % 1080
              const r = 0.8 + ((i * 13) % 20) / 18
              return (
                <circle
                  key={`particle-${i}`}
                  cx={x}
                  cy={y}
                  r={r}
                  fill={i % 5 === 0 ? '#E879F9' : i % 7 === 0 ? '#A3E635' : '#22D3EE'}
                  opacity={0.3 + ((i * 7) % 40) / 80}
                  filter="url(#softGlow)"
                />
              )
            })}
          </g>

          {/* Subtle scattered neural nodes in background (ambient, not the main hero graphic) */}
          <g transform="translate(260, 820)" filter="url(#neuralGlow)" opacity="0.55">
            <line x1="0" y1="0" x2="80" y2="-60" stroke="#22D3EE" strokeWidth="1.1" />
            <line x1="80" y1="-60" x2="150" y2="-20" stroke="#22D3EE" strokeWidth="1.1" />
            <line x1="80" y1="-60" x2="150" y2="-90" stroke="#E879F9" strokeWidth="1.1" />
            <circle cx="0" cy="0" r="5" fill="#22D3EE" />
            <circle cx="80" cy="-60" r="7" fill="#E879F9" />
            <circle cx="150" cy="-20" r="5" fill="#22D3EE" />
            <circle cx="150" cy="-90" r="4" fill="#A3E635" />
          </g>
          <g transform="translate(1600, 220)" filter="url(#neuralGlow)" opacity="0.5">
            <line x1="0" y1="0" x2="-90" y2="-30" stroke="#22D3EE" strokeWidth="1.1" />
            <line x1="0" y1="0" x2="-70" y2="70" stroke="#E879F9" strokeWidth="1.1" />
            <line x1="-90" y1="-30" x2="-150" y2="40" stroke="#22D3EE" strokeWidth="1.1" />
            <circle cx="0" cy="0" r="6" fill="#E879F9" />
            <circle cx="-90" cy="-30" r="5" fill="#22D3EE" />
            <circle cx="-70" cy="70" r="5" fill="#A3E635" />
            <circle cx="-150" cy="40" r="4" fill="#22D3EE" />
          </g>
          <g transform="translate(1680, 900)" filter="url(#neuralGlow)" opacity="0.5">
            <circle cx="0" cy="0" r="9" fill="rgba(124, 58, 237, 0.25)" stroke="#7C3AED" strokeWidth="1.2" />
            <circle cx="40" cy="-30" r="6" fill="rgba(34, 211, 238, 0.2)" stroke="#22D3EE" strokeWidth="1.2" />
            <circle cx="-35" cy="-25" r="6" fill="rgba(232, 121, 249, 0.2)" stroke="#E879F9" strokeWidth="1.2" />
            <circle cx="25" cy="40" r="5" fill="rgba(163, 230, 53, 0.2)" stroke="#A3E635" strokeWidth="1.2" />
            <line x1="0" y1="0" x2="40" y2="-30" stroke="#22D3EE" strokeWidth="1" opacity="0.6" />
            <line x1="0" y1="0" x2="-35" y2="-25" stroke="#E879F9" strokeWidth="1" opacity="0.6" />
            <line x1="0" y1="0" x2="25" y2="40" stroke="#A3E635" strokeWidth="1" opacity="0.6" />
          </g>
        </g>
      )}

      {/* ==================== PLAY VARIANT ==================== */}
      {variant === 'play' && (
        <g>
          {/* Darker gradient background */}
          <rect width="1920" height="1080" fill="url(#playBgGrad)" />
          {/* Vignette darker */}
          <radialGradient id="vignettePlay" cx="50%" cy="50%" r="72%">
            <stop offset="55%" stopColor="transparent" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.7" />
          </radialGradient>
          <rect width="1920" height="1080" fill="url(#vignettePlay)" />

          {/* Hexagon grid faint */}
          <g stroke="#7C3AED" strokeWidth="0.5" fill="none" opacity="0.15">
            {[...Array(18)].map((_, row) =>
              [...Array(28)].map((_, col) => {
                const cx = col * 72 + (row % 2 === 0 ? 0 : 36) + 36
                const cy = row * 62 + 36
                const hex = `M${cx} ${cy - 30} L${cx + 26} ${cy - 15} L${cx + 26} ${cy + 15} L${cx} ${cy + 30} L${cx - 26} ${cy + 15} L${cx - 26} ${cy - 15} Z`
                return <path key={`hex-${row}-${col}`} d={hex} />
              })
            )}
          </g>

          {/* Scan lines */}
          <g opacity="0.04">
            {[...Array(80)].map((_, i) => (
              <rect
                key={`scan-${i}`}
                x="0"
                y={i * 14}
                width="1920"
                height="2"
                fill="#22D3EE"
              />
            ))}
          </g>

          {/* Violet glass panel left */}
          <g>
            <path
              d="M0 0 L230 0 Q270 0 275 50 L275 1030 Q270 1080 230 1080 L0 1080 Z"
              fill="url(#glassPanel)"
              stroke="#7C3AED"
              strokeWidth="1"
              opacity="0.65"
            />
            {/* Panel circuit lines */}
            <g stroke="#22D3EE" strokeWidth="0.8" fill="none" opacity="0.5">
              <path d="M20 180 L100 180 L100 240 L180 240" />
              <circle cx="20" cy="180" r="2.5" fill="#22D3EE" />
              <circle cx="180" cy="240" r="2.5" fill="#22D3EE" />
              <path d="M50 400 L130 400 L130 470 L210 470" />
              <circle cx="50" cy="400" r="2.5" fill="#E879F9" />
              <circle cx="210" cy="470" r="2.5" fill="#E879F9" />
              <path d="M30 700 L110 700 L110 770 L190 770" />
              <circle cx="30" cy="700" r="2.5" fill="#22D3EE" />
              <circle cx="190" cy="770" r="2.5" fill="#22D3EE" />
              <path d="M70 920 L170 920" />
              <circle cx="70" cy="920" r="2.5" fill="#A3E635" />
              <circle cx="170" cy="920" r="2.5" fill="#A3E635" />
            </g>
          </g>
          {/* Violet glass panel right */}
          <g>
            <path
              d="M1920 0 L1690 0 Q1650 0 1645 50 L1645 1030 Q1650 1080 1690 1080 L1920 1080 Z"
              fill="url(#glassPanel)"
              stroke="#7C3AED"
              strokeWidth="1"
              opacity="0.65"
            />
            <g stroke="#22D3EE" strokeWidth="0.8" fill="none" opacity="0.5">
              <path d="M1900 180 L1820 180 L1820 240 L1740 240" />
              <circle cx="1900" cy="180" r="2.5" fill="#22D3EE" />
              <circle cx="1740" cy="240" r="2.5" fill="#22D3EE" />
              <path d="M1870 400 L1790 400 L1790 470 L1710 470" />
              <circle cx="1870" cy="400" r="2.5" fill="#E879F9" />
              <circle cx="1710" cy="470" r="2.5" fill="#E879F9" />
              <path d="M1890 700 L1810 700 L1810 770 L1730 770" />
              <circle cx="1890" cy="700" r="2.5" fill="#22D3EE" />
              <circle cx="1730" cy="770" r="2.5" fill="#22D3EE" />
              <path d="M1850 920 L1750 920" />
              <circle cx="1850" cy="920" r="2.5" fill="#A3E635" />
              <circle cx="1750" cy="920" r="2.5" fill="#A3E635" />
            </g>
          </g>

          {/* Small corner neural network decoration */}
          <g transform="translate(160, 970)" filter="url(#neuralGlow)" opacity="0.65">
            <g stroke="#22D3EE" strokeWidth="1" opacity="0.4" fill="none">
              <line x1="-40" y1="-20" x2="-10" y2="-35" />
              <line x1="-40" y1="-20" x2="-10" y2="0" />
              <line x1="-40" y1="15" x2="-10" y2="-35" />
              <line x1="-40" y1="15" x2="-10" y2="0" />
              <line x1="-40" y1="15" x2="-10" y2="30" />
              <line x1="-10" y1="-35" x2="25" y2="-15" />
              <line x1="-10" y1="0" x2="25" y2="-15" />
              <line x1="-10" y1="0" x2="25" y2="25" />
              <line x1="-10" y1="30" x2="25" y2="25" />
            </g>
            <g stroke="#E879F9" strokeWidth="1.4" opacity="0.5" fill="none">
              <line x1="-40" y1="15" x2="-10" y2="0" />
              <line x1="-10" y1="0" x2="25" y2="25" />
            </g>
            <circle cx="-40" cy="-20" r="4" fill="rgba(34,211,238,0.15)" stroke="#22D3EE" strokeWidth="0.8" />
            <circle cx="-40" cy="15" r="4.5" fill="rgba(232,121,249,0.2)" stroke="#E879F9" strokeWidth="1" />
            <circle cx="-10" cy="-35" r="4" fill="rgba(34,211,238,0.15)" stroke="#22D3EE" strokeWidth="0.8" />
            <circle cx="-10" cy="0" r="5" fill="rgba(232,121,249,0.25)" stroke="#E879F9" strokeWidth="1.2" />
            <circle cx="-10" cy="30" r="4" fill="rgba(34,211,238,0.15)" stroke="#22D3EE" strokeWidth="0.8" />
            <circle cx="25" cy="-15" r="4" fill="rgba(34,211,238,0.15)" stroke="#22D3EE" strokeWidth="0.8" />
            <circle cx="25" cy="25" r="4.5" fill="rgba(232,121,249,0.22)" stroke="#E879F9" strokeWidth="1" />
          </g>

          {/* Top-right small neural network */}
          <g transform="translate(1760, 130)" filter="url(#neuralGlow)" opacity="0.55">
            <g stroke="#22D3EE" strokeWidth="0.9" opacity="0.35" fill="none">
              <line x1="0" y1="-30" x2="30" y2="-15" />
              <line x1="0" y1="-30" x2="30" y2="15" />
              <line x1="0" y1="0" x2="30" y2="-15" />
              <line x1="0" y1="0" x2="30" y2="15" />
              <line x1="0" y1="30" x2="30" y2="15" />
              <line x1="30" y1="-15" x2="60" y2="0" />
              <line x1="30" y1="15" x2="60" y2="0" />
            </g>
            <circle cx="0" cy="-30" r="3.5" fill="rgba(34,211,238,0.15)" stroke="#22D3EE" strokeWidth="0.7" />
            <circle cx="0" cy="0" r="3.5" fill="rgba(34,211,238,0.15)" stroke="#22D3EE" strokeWidth="0.7" />
            <circle cx="0" cy="30" r="3.5" fill="rgba(34,211,238,0.15)" stroke="#22D3EE" strokeWidth="0.7" />
            <circle cx="30" cy="-15" r="4" fill="rgba(232,121,249,0.2)" stroke="#E879F9" strokeWidth="0.9" />
            <circle cx="30" cy="15" r="4" fill="rgba(34,211,238,0.18)" stroke="#22D3EE" strokeWidth="0.9" />
            <circle cx="60" cy="0" r="4.5" fill="rgba(232,121,249,0.25)" stroke="#E879F9" strokeWidth="1" />
          </g>
        </g>
      )}

      {/* ==================== BADGE VARIANT ==================== */}
      {variant === 'badge' && (
        <g>
          {/* Celebratory gradient gold-to-violet */}
          <rect width="1920" height="1080" fill="url(#badgeBgGrad)" />
          <rect width="1920" height="1080" fill="url(#badgeGoldGlow)" />
          {/* Vignette */}
          <radialGradient id="vignetteBadge" cx="50%" cy="45%" r="75%">
            <stop offset="65%" stopColor="transparent" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
          </radialGradient>
          <rect width="1920" height="1080" fill="url(#vignetteBadge)" />

          {/* Radial burst behind badge location (center) */}
          <g transform="translate(960, 500)">
            {[...Array(36)].map((_, i) => {
              const angle = (i * 10) * Math.PI / 180
              const len1 = 140
              const len2 = 420
              const x1 = Math.cos(angle) * len1
              const y1 = Math.sin(angle) * len1
              const x2 = Math.cos(angle) * len2
              const y2 = Math.sin(angle) * len2
              return (
                <line
                  key={`burst-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={i % 2 === 0 ? '#FDE68A' : '#E879F9'}
                  strokeWidth="3"
                  opacity="0.18"
                  strokeLinecap="round"
                />
              )
            })}
            {/* Radial glow disk */}
            <circle r="260" fill="url(#burstGrad)" />
            <circle r="180" fill="#FDE68A" opacity="0.09" />
          </g>

          {/* Laurel wreath silhouettes */}
          <g transform="translate(960, 520)" opacity="0.35" filter="url(#softGlow)">
            {/* Left laurel */}
            <g stroke="#FDE68A" strokeWidth="2.5" fill="none" strokeLinecap="round">
              <path d="M-310 -140 Q-330 -100 -325 -50 Q-320 0 -300 40 Q-275 80 -240 110 Q-200 135 -160 150" />
              {/* Leaves left */}
              <path d="M-308 -120 Q-285 -115 -270 -125 Q-290 -100 -308 -120 Z" fill="rgba(253,230,138,0.6)" />
              <path d="M-315 -85 Q-290 -80 -272 -92 Q-295 -62 -315 -85 Z" fill="rgba(253,230,138,0.6)" />
              <path d="M-318 -50 Q-292 -42 -275 -58 Q-298 -25 -318 -50 Z" fill="rgba(253,230,138,0.6)" />
              <path d="M-310 -10 Q-283 -2 -268 -20 Q-292 10 -310 -10 Z" fill="rgba(253,230,138,0.6)" />
              <path d="M-295 30 Q-266 40 -255 20 Q-278 62 -295 30 Z" fill="rgba(253,230,138,0.6)" />
              <path d="M-272 65 Q-244 75 -235 55 Q-255 94 -272 65 Z" fill="rgba(253,230,138,0.6)" />
              <path d="M-242 95 Q-216 105 -208 85 Q-226 120 -242 95 Z" fill="rgba(253,230,138,0.6)" />
              <path d="M-205 120 Q-180 128 -172 110 Q-190 142 -205 120 Z" fill="rgba(253,230,138,0.6)" />
            </g>
            {/* Right laurel */}
            <g stroke="#FDE68A" strokeWidth="2.5" fill="none" strokeLinecap="round">
              <path d="M310 -140 Q330 -100 325 -50 Q320 0 300 40 Q275 80 240 110 Q200 135 160 150" />
              <path d="M308 -120 Q285 -115 270 -125 Q290 -100 308 -120 Z" fill="rgba(253,230,138,0.6)" />
              <path d="M315 -85 Q290 -80 272 -92 Q295 -62 315 -85 Z" fill="rgba(253,230,138,0.6)" />
              <path d="M318 -50 Q292 -42 275 -58 Q298 -25 318 -50 Z" fill="rgba(253,230,138,0.6)" />
              <path d="M310 -10 Q283 -2 268 -20 Q292 10 310 -10 Z" fill="rgba(253,230,138,0.6)" />
              <path d="M295 30 Q266 40 255 20 Q278 62 295 30 Z" fill="rgba(253,230,138,0.6)" />
              <path d="M272 65 Q244 75 235 55 Q255 94 272 65 Z" fill="rgba(253,230,138,0.6)" />
              <path d="M242 95 Q216 105 208 85 Q226 120 242 95 Z" fill="rgba(253,230,138,0.6)" />
              <path d="M205 120 Q180 128 172 110 Q190 142 205 120 Z" fill="rgba(253,230,138,0.6)" />
            </g>
          </g>

          {/* Confetti SVGs - dots and stars: cyan, fuchsia, lime, gold */}
          <g>
            {/* Cyan confetti */}
            {[[200,180,6],[450,90,4],[700,230,5],[1100,130,6],[1350,200,4],[1600,320,5],[1750,120,7],[300,880,5],[600,940,6],[1400,900,5],[1700,820,4],[100,500,4],[1820,600,6]].map(([x,y,r],i) => (
              <circle key={`c-cyan-${i}`} cx={x as number} cy={y as number} r={r as number} fill="#22D3EE" filter="url(#softGlow)" opacity={0.7 + ((i*3)%30)/100} />
            ))}
            {/* Fuchsia confetti */}
            {[[350,260,5],[800,80,6],[1200,300,5],[1550,150,7],[250,600,4],[900,180,5],[1450,750,6],[500,780,5],[1680,480,4],[80,350,5],[1860,900,5],[1150,950,6]].map(([x,y,r],i) => (
              <circle key={`c-fuchsia-${i}`} cx={x as number} cy={y as number} r={r as number} fill="#E879F9" filter="url(#softGlow)" opacity={0.7 + ((i*5)%30)/100} />
            ))}
            {/* Lime confetti */}
            {[[600,350,5],[950,60,6],[1300,400,4],[50,750,5],[1750,680,6],[400,450,4],[1100,850,5],[1500,550,5],[850,990,4],[190,100,4],[1800,50,5],[700,700,4]].map(([x,y,r],i) => (
              <circle key={`c-lime-${i}`} cx={x as number} cy={y as number} r={r as number} fill="#A3E635" filter="url(#softGlow)" opacity={0.65 + ((i*7)%30)/100} />
            ))}
            {/* Gold confetti */}
            {[[150,50,5],[960,90,6],[1800,200,5],[500,150,4],[1250,80,4],[70,660,5],[1600,900,6],[900,870,5],[350,380,4],[1450,260,4],[550,880,5],[1300,650,4]].map(([x,y,r],i) => (
              <circle key={`c-gold-${i}`} cx={x as number} cy={y as number} r={r as number} fill="#FDE68A" filter="url(#softGlow)" opacity={0.7 + ((i*4)%30)/100} />
            ))}
            {/* Stars */}
            {[
              [280,120,14,'#22D3EE'],[1100,70,16,'#E879F9'],[1700,220,12,'#A3E635'],[80,780,14,'#FDE68A'],
              [780,920,16,'#22D3EE'],[1550,820,13,'#E879F9'],[480,220,11,'#A3E635'],[1350,450,15,'#FDE68A'],
              [200,450,12,'#E879F9'],[1820,380,14,'#22D3EE'],[650,600,11,'#FDE68A'],[1000,350,13,'#A3E635']
            ].map(([x,y,s,color],i) => {
              const size = s as number
              const cx = x as number
              const cy = y as number
              const sp = [
                `M${cx} ${cy - size}`,
                `L${cx + size*0.3} ${cy - size*0.3}`,
                `L${cx + size} ${cy - size*0.15}`,
                `L${cx + size*0.4} ${cy + size*0.15}`,
                `L${cx + size*0.55} ${cy + size}`,
                `L${cx} ${cy + size*0.5}`,
                `L${cx - size*0.55} ${cy + size}`,
                `L${cx - size*0.4} ${cy + size*0.15}`,
                `L${cx - size} ${cy - size*0.15}`,
                `L${cx - size*0.3} ${cy - size*0.3}`,
                'Z'
              ].join(' ')
              return <path key={`star-${i}`} d={sp} fill={color as string} filter="url(#softGlow)" opacity={0.75 + ((i*5)%25)/100} />
            })}
            {/* Tiny squares confetti */}
            {[
              [380,380,'#E879F9',30],[1200,580,'#22D3EE',-15],[160,680,'#FDE68A',45],[1400,50,'#A3E635',-40],
              [680,450,'#22D3EE',20],[1650,550,'#E879F9',-25],[960,940,'#FDE68A',60],[50,280,'#A3E635',-50],
              [1850,750,'#22D3EE',35],[900,250,'#E879F9',-30],[250,940,'#FDE68A',15],[1300,280,'#A3E635',-55]
            ].map(([x,y,c,r],i) => (
              <rect
                key={`sq-${i}`}
                x={(x as number) - 6}
                y={(y as number) - 6}
                width="12"
                height="12"
                fill={c as string}
                transform={`rotate(${r as number} ${x as number} ${y as number})`}
                opacity={0.7 + ((i*6)%30)/100}
                filter="url(#softGlow)"
              />
            ))}
          </g>
        </g>
      )}
      </svg>
    </div>
  )
}
