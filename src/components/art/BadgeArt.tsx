interface BadgeArtProps {
  className?: string
}

export function BadgeArt({ className }: BadgeArtProps) {
  return (
    <svg
      viewBox="0 0 500 600"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Outer metallic ring gradient */}
        <linearGradient id="metalOuterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F3F4F6" />
          <stop offset="20%" stopColor="#9CA3AF" />
          <stop offset="45%" stopColor="#D1D5DB" />
          <stop offset="70%" stopColor="#6B7280" />
          <stop offset="85%" stopColor="#E5E7EB" />
          <stop offset="100%" stopColor="#4B5563" />
        </linearGradient>
        <linearGradient id="metalInnerHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="30%" stopColor="#FFFFFF" stopOpacity="0.2" />
          <stop offset="60%" stopColor="transparent" />
          <stop offset="85%" stopColor="#FFFFFF" stopOpacity="0.3" />
        </linearGradient>
        {/* Inner violet ring gradient */}
        <linearGradient id="violetRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="30%" stopColor="#A855F7" />
          <stop offset="55%" stopColor="#5B21B6" />
          <stop offset="80%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#4C1D95" />
        </linearGradient>
        {/* Neural core gem gradient cyan-fuchsia */}
        <radialGradient id="gemCoreGrad" cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#ECFEFF" />
          <stop offset="20%" stopColor="#67E8F9" />
          <stop offset="45%" stopColor="#22D3EE" />
          <stop offset="70%" stopColor="#E879F9" />
          <stop offset="90%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#5B21B6" />
        </radialGradient>
        <linearGradient id="gemFacetHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.65" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
        <radialGradient id="gemInnerGlow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
          <stop offset="50%" stopColor="#22D3EE" stopOpacity="0.4" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        {/* Gem glow filter */}
        <filter id="gemGlowStrong" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="10" result="blur1" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="gemOuterHalo" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="18" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Drop shadow for badge */}
        <filter id="badgeShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="14" />
          <feOffset dx="0" dy="18" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.5" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Metal engraving look */}
        <filter id="engraveEffect" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="0.6" result="blur1" />
          <feOffset dx="0" dy="1" in="blur1" result="offset1" />
          <feComposite operator="out" in="SourceGraphic" in2="offset1" result="shadow" />
          <feFlood floodColor="#000" floodOpacity="0.5" result="flood" />
          <feComposite in="flood" in2="shadow" operator="in" result="engravedShadow" />
          <feMerge>
            <feMergeNode in="engravedShadow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Bottom engraving dark */}
        <linearGradient id="bottomEngrave" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6B7280" />
          <stop offset="50%" stopColor="#374151" />
          <stop offset="100%" stopColor="#1F2937" />
        </linearGradient>
        {/* Wire/chip metal gradient */}
        <linearGradient id="wireMetalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9CA3AF" />
          <stop offset="30%" stopColor="#E5E7EB" />
          <stop offset="60%" stopColor="#F3F4F6" />
          <stop offset="100%" stopColor="#6B7280" />
        </linearGradient>
      </defs>

      {/* Overall badge shadow */}
      <g filter="url(#badgeShadow)">

        {/* ============== CHIP WIRES AT TOP ============== */}
        <g>
          {/* Left wire */}
          <path
            d="M185 50 Q195 70 210 78 Q225 82 232 96 L240 110"
            fill="none"
            stroke="url(#wireMetalGrad)"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M185 50 Q195 70 210 78 Q225 82 232 96 L240 110"
            fill="none"
            stroke="#22D3EE"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />
          {/* Left connector pad */}
          <rect x="168" y="36" width="34" height="20" rx="5" fill="url(#metalOuterGrad)" stroke="#4B5563" strokeWidth="1" />
          <rect x="175" y="42" width="20" height="8" rx="2" fill="#1F2937" opacity="0.8" />
          <line x1="178" y1="46" x2="192" y2="46" stroke="#22D3EE" strokeWidth="1.2" opacity="0.9" />
          <line x1="178" y1="48" x2="190" y2="48" stroke="#E879F9" strokeWidth="0.9" opacity="0.8" />
          {/* Right wire */}
          <path
            d="M315 50 Q305 70 290 78 Q275 82 268 96 L260 110"
            fill="none"
            stroke="url(#wireMetalGrad)"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M315 50 Q305 70 290 78 Q275 82 268 96 L260 110"
            fill="none"
            stroke="#E879F9"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />
          {/* Right connector pad */}
          <rect x="298" y="36" width="34" height="20" rx="5" fill="url(#metalOuterGrad)" stroke="#4B5563" strokeWidth="1" />
          <rect x="305" y="42" width="20" height="8" rx="2" fill="#1F2937" opacity="0.8" />
          <line x1="308" y1="46" x2="322" y2="46" stroke="#22D3EE" strokeWidth="1.2" opacity="0.9" />
          <line x1="308" y1="48" x2="320" y2="48" stroke="#E879F9" strokeWidth="0.9" opacity="0.8" />
          {/* Solder dots on wires */}
          <circle cx="240" cy="110" r="4.5" fill="url(#metalOuterGrad)" stroke="#374151" strokeWidth="0.6" />
          <circle cx="260" cy="110" r="4.5" fill="url(#metalOuterGrad)" stroke="#374151" strokeWidth="0.6" />
          <circle cx="240" cy="110" r="2" fill="#22D3EE" opacity="0.9" />
          <circle cx="260" cy="110" r="2" fill="#E879F9" opacity="0.9" />
        </g>

        {/* ============== OCTAGONAL BADGE OUTER SHAPE ============== */}
        {/* Octagon points: top flat, then angled sides */}
        {(() => {
          const cx = 250, cy = 330, w = 200, h = 210, a = 65
          const pts = [
            [cx, cy - h],
            [cx + w, cy - h + a],
            [cx + w + a * 0.55, cy - 10],
            [cx + w, cy + h - a + 60],
            [cx, cy + h + 60],
            [cx - w, cy + h - a + 60],
            [cx - w - a * 0.55, cy - 10],
            [cx - w, cy - h + a]
          ].map(p => p.join(',')).join(' ')
          return (
            <g>
              {/* Outer metal ring */}
              <polygon
                points={pts}
                fill="url(#metalOuterGrad)"
                stroke="#374151"
                strokeWidth="1.5"
              />
              {/* Metal highlight sweep */}
              <polygon
                points={pts}
                fill="url(#metalInnerHighlight)"
                opacity="0.9"
              />

              {/* Micro-circuit engraved pattern on outer ring */}
              <g filter="url(#engraveEffect)" opacity="0.9">
                <g stroke="#1F2937" strokeWidth="1" fill="none" opacity="0.55">
                  {/* Left side circuits */}
                  <path d="M60 220 L45 240 L45 275 L60 295" />
                  <path d="M70 320 L55 335 L55 375 L72 395" />
                  <path d="M68 440 L52 458 L52 495 L70 515" />
                  {/* Right side circuits */}
                  <path d="M440 220 L455 240 L455 275 L440 295" />
                  <path d="M430 320 L445 335 L445 375 L428 395" />
                  <path d="M432 440 L448 458 L448 495 L430 515" />
                  {/* Top circuits */}
                  <path d="M130 138 L160 138 L170 122 L210 122" />
                  <path d="M370 138 L340 138 L330 122 L290 122" />
                  {/* Bottom circuits */}
                  <path d="M120 490 L155 490 L165 510 L200 510" />
                  <path d="M380 490 L345 490 L335 510 L300 510" />
                </g>
                {/* Circuit dots */}
                <g fill="#1F2937" opacity="0.7">
                  <circle cx="60" cy="220" r="2.5" />
                  <circle cx="60" cy="295" r="2.5" />
                  <circle cx="72" cy="395" r="2.5" />
                  <circle cx="70" cy="515" r="2.5" />
                  <circle cx="440" cy="220" r="2.5" />
                  <circle cx="440" cy="295" r="2.5" />
                  <circle cx="428" cy="395" r="2.5" />
                  <circle cx="430" cy="515" r="2.5" />
                  <circle cx="130" cy="138" r="2.5" />
                  <circle cx="210" cy="122" r="2.5" />
                  <circle cx="370" cy="138" r="2.5" />
                  <circle cx="290" cy="122" r="2.5" />
                  <circle cx="120" cy="490" r="2.5" />
                  <circle cx="200" cy="510" r="2.5" />
                  <circle cx="380" cy="490" r="2.5" />
                  <circle cx="300" cy="510" r="2.5" />
                </g>
              </g>

              {/* ============== INNER VIOLET RING ============== */}
              {(() => {
                const w2 = w - 28, h2 = h - 28, a2 = a - 10
                const cy2 = cy + 5
                const pts2 = [
                  [cx, cy2 - h2],
                  [cx + w2, cy2 - h2 + a2],
                  [cx + w2 + a2 * 0.55, cy2 - 5],
                  [cx + w2, cy2 + h2 - a2 + 55],
                  [cx, cy2 + h2 + 55],
                  [cx - w2, cy2 + h2 - a2 + 55],
                  [cx - w2 - a2 * 0.55, cy2 - 5],
                  [cx - w2, cy2 - h2 + a2]
                ].map(p => p.join(',')).join(' ')
                return (
                  <g>
                    <polygon
                      points={pts2}
                      fill="url(#violetRingGrad)"
                      stroke="#A855F7"
                      strokeWidth="0.8"
                      opacity="0.98"
                    />
                    {/* Inner subtle highlight */}
                    <polygon
                      points={pts2}
                      fill="url(#metalInnerHighlight)"
                      opacity="0.25"
                    />
                    {/* Inner ring bevel dark */}
                    <polygon
                      points={pts2}
                      fill="none"
                      stroke="#3B0764"
                      strokeWidth="1.8"
                      opacity="0.55"
                    />

                    {/* Engraved text: GRADE 10 • MATRIX MASTER around circumference (top arc) */}
                    <g fontFamily="'Baloo 2', 'Arial Black', sans-serif" fontWeight="900" fill="#F5F3FF" opacity="0.92" filter="url(#engraveEffect)">
                      <path
                        id="badgeTopTextPath"
                        d={`M ${cx - 148} ${cy2 - 130} A 180 180 0 0 1 ${cx + 148} ${cy2 - 130}`}
                        fill="none"
                      />
                      <text fontSize="20" letterSpacing="4">
                        <textPath href="#badgeTopTextPath" startOffset="50%" textAnchor="middle">
                          ✦ GRADE 10 • MATRIX MASTER ✦
                        </textPath>
                      </text>

                      {/* Bottom engraving: ML ENGINEER */}
                      <path
                        id="badgeBottomTextPath"
                        d={`M ${cx - 110} ${cy2 + 155} A 150 150 0 0 0 ${cx + 110} ${cy2 + 155}`}
                        fill="none"
                      />
                      <text fontSize="18" letterSpacing="5" fill="#FDE68A" opacity="0.95">
                        <textPath href="#badgeBottomTextPath" startOffset="50%" textAnchor="middle">
                          ML ENGINEER
                        </textPath>
                      </text>
                    </g>

                    {/* ============== DARKEST INNER BODY ============== */}
                    {(() => {
                      const w3 = w2 - 32, h3 = h2 - 35, a3 = a2 - 6
                      const cy3 = cy2 + 10
                      const pts3 = [
                        [cx, cy3 - h3],
                        [cx + w3, cy3 - h3 + a3],
                        [cx + w3 + a3 * 0.55, cy3],
                        [cx + w3, cy3 + h3 - a3 + 40],
                        [cx, cy3 + h3 + 40],
                        [cx - w3, cy3 + h3 - a3 + 40],
                        [cx - w3 - a3 * 0.55, cy3],
                        [cx - w3, cy3 - h3 + a3]
                      ].map(p => p.join(',')).join(' ')
                      return (
                        <g>
                          <polygon
                            points={pts3}
                            fill="#1A0F3C"
                            opacity="0.98"
                          />
                          {/* Inner border glow */}
                          <polygon
                            points={pts3}
                            fill="none"
                            stroke="#22D3EE"
                            strokeWidth="1"
                            opacity="0.55"
                            filter="url(#gemGlowStrong)"
                          />
                          <polygon
                            points={pts3}
                            fill="none"
                            stroke="#7C3AED"
                            strokeWidth="1.4"
                            opacity="0.8"
                          />

                          {/* Small neural network etched behind gem (6 nodes) */}
                          <g transform={`translate(${cx}, ${cy2 + 5})`} opacity="0.55">
                            {/* Connections */}
                            <g stroke="#9CA3AF" strokeWidth="1.1" fill="none" opacity="0.75">
                              <line x1="-80" y1="-40" x2="-25" y2="-55" />
                              <line x1="-80" y1="-40" x2="-25" y2="-10" />
                              <line x1="-80" y1="20" x2="-25" y2="-55" />
                              <line x1="-80" y1="20" x2="-25" y2="-10" />
                              <line x1="-80" y1="20" x2="-25" y2="40" />
                              <line x1="-25" y1="-55" x2="40" y2="-20" />
                              <line x1="-25" y1="-10" x2="40" y2="-20" />
                              <line x1="-25" y1="-10" x2="40" y2="30" />
                              <line x1="-25" y1="40" x2="40" y2="30" />
                            </g>
                            {/* Nodes silver etched */}
                            <g fill="#1F2937" stroke="#D1D5DB" strokeWidth="1.2">
                              <circle cx="-80" cy="-40" r="5.5" />
                              <circle cx="-80" cy="20" r="5.5" />
                              <circle cx="-25" cy="-55" r="6" />
                              <circle cx="-25" cy="-10" r="6.5" />
                              <circle cx="-25" cy="40" r="6" />
                              <circle cx="40" cy="-20" r="5.5" />
                              <circle cx="40" cy="30" r="5.5" />
                            </g>
                            {/* Etch highlights on nodes */}
                            <g fill="#F3F4F6" opacity="0.55">
                              <circle cx="-82" cy="-42" r="1.8" />
                              <circle cx="-82" cy="18" r="1.8" />
                              <circle cx="-27" cy="-57" r="2" />
                              <circle cx="-27" cy="-12" r="2.2" />
                              <circle cx="-27" cy="38" r="2" />
                              <circle cx="38" cy="-22" r="1.8" />
                              <circle cx="38" cy="28" r="1.8" />
                            </g>
                          </g>

                          {/* ============== CENTER GEM / NEURAL CORE ============== */}
                          <g transform={`translate(${cx}, ${cy2 + 5})`}>
                            {/* Gem outer halo */}
                            <circle r="78" fill="#22D3EE" opacity="0.15" filter="url(#gemOuterHalo)" />
                            <circle r="62" fill="#E879F9" opacity="0.2" filter="url(#gemOuterHalo)" />

                            {/* Faceted octagon gem shape */}
                            {(() => {
                              const gr = 55
                              const gemPts = [
                                [0, -gr],
                                [gr * 0.7, -gr * 0.7],
                                [gr, 0],
                                [gr * 0.7, gr * 0.7],
                                [0, gr],
                                [-gr * 0.7, gr * 0.7],
                                [-gr, 0],
                                [-gr * 0.7, -gr * 0.7]
                              ].map(p => p.join(',')).join(' ')
                              return (
                                <g filter="url(#gemGlowStrong)">
                                  {/* Gem body */}
                                  <polygon
                                    points={gemPts}
                                    fill="url(#gemCoreGrad)"
                                    stroke="#FFFFFF"
                                    strokeWidth="1.2"
                                    opacity="0.98"
                                  />
                                  {/* Facet lines (divided into 8 triangles from center) */}
                                  <g stroke="#FFFFFF" strokeWidth="0.8" opacity="0.45" fill="none">
                                    <line x1="0" y1="-55" x2="0" y2="0" />
                                    <line x1="38.5" y1="-38.5" x2="0" y2="0" />
                                    <line x1="55" y1="0" x2="0" y2="0" />
                                    <line x1="38.5" y1="38.5" x2="0" y2="0" />
                                    <line x1="0" y1="55" x2="0" y2="0" />
                                    <line x1="-38.5" y1="38.5" x2="0" y2="0" />
                                    <line x1="-55" y1="0" x2="0" y2="0" />
                                    <line x1="-38.5" y1="-38.5" x2="0" y2="0" />
                                  </g>
                                  {/* Facet highlight triangles (top-left facets brighter) */}
                                  <polygon
                                    points={`0,-55 38.5,-38.5 0,0`}
                                    fill="url(#gemFacetHighlight)"
                                    opacity="0.95"
                                  />
                                  <polygon
                                    points={`-38.5,-38.5 0,-55 0,0`}
                                    fill="url(#gemFacetHighlight)"
                                    opacity="0.75"
                                  />
                                  <polygon
                                    points={`-55,0 -38.5,-38.5 0,0`}
                                    fill="url(#gemFacetHighlight)"
                                    opacity="0.45"
                                  />
                                  {/* Inner glow */}
                                  <circle r="30" fill="url(#gemInnerGlow)" />
                                  {/* Specular highlight spot */}
                                  <ellipse cx="-20" cy="-28" rx="12" ry="9" fill="#FFFFFF" opacity="0.85" />
                                  <ellipse cx="-15" cy="-32" rx="5" ry="3.5" fill="#FFFFFF" />
                                  {/* Tiny sparkle */}
                                  <polygon
                                    points="18,-36 20,-42 22,-36 28,-34 22,-32 20,-26 18,-32 12,-34"
                                    fill="#FFFFFF"
                                    opacity="0.95"
                                  />
                                </g>
                              )
                            })()}

                            {/* Wire connections into gem from chip wires above */}
                            <path
                              d="M-10 -62 Q-4 -50 0 -42"
                              fill="none"
                              stroke="#22D3EE"
                              strokeWidth="2"
                              opacity="0.8"
                              strokeLinecap="round"
                            />
                            <path
                              d="M10 -62 Q4 -50 0 -42"
                              fill="none"
                              stroke="#E879F9"
                              strokeWidth="2"
                              opacity="0.8"
                              strokeLinecap="round"
                            />
                          </g>
                        </g>
                      )
                    })()}
                  </g>
                )
              })()}

              {/* Outer bevel dark edge all around badge */}
              <polygon
                points={pts}
                fill="none"
                stroke="#1F2937"
                strokeWidth="2.5"
                opacity="0.75"
              />
            </g>
          )
        })()}

        {/* ============== RIBBON HANGERS FROM WIRES (decorative) ============== */}
        <g opacity="0.85">
          {/* Left ribbon segment */}
          <path
            d="M195 50 L180 100 Q175 120 190 130 L210 120 L215 75 Q218 60 205 55 Z"
            fill="rgba(232,121,249,0.35)"
            stroke="#E879F9"
            strokeWidth="0.8"
          />
          {/* Right ribbon segment */}
          <path
            d="M305 50 L320 100 Q325 120 310 130 L290 120 L285 75 Q282 60 295 55 Z"
            fill="rgba(34,211,238,0.35)"
            stroke="#22D3EE"
            strokeWidth="0.8"
          />
        </g>

      </g>

      {/* Extra floating sparkles around badge */}
      <g>
        <circle cx="70" cy="180" r="2.5" fill="#22D3EE" opacity="0.9" />
        <circle cx="430" cy="190" r="2.5" fill="#E879F9" opacity="0.9" />
        <circle cx="55" cy="420" r="2" fill="#A3E635" opacity="0.85" />
        <circle cx="445" cy="430" r="2" fill="#FDE68A" opacity="0.85" />
        <circle cx="250" cy="560" r="2.2" fill="#22D3EE" opacity="0.9" />
      </g>
    </svg>
  )
}
