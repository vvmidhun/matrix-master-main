type Mood = 'idle' | 'cheer' | 'oops' | 'wow'

interface CoachSpriteProps {
  mood: Mood
  className?: string
}

export function CoachSprite({ mood, className }: CoachSpriteProps) {
  return (
    <svg
      viewBox="0 0 400 600"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <radialGradient id="skinGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FDD8C2" />
          <stop offset="45%" stopColor="#F5C4A5" />
          <stop offset="100%" stopColor="#E0A885" />
        </radialGradient>
        <radialGradient id="skinShadow" cx="30%" cy="60%" r="70%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="100%" stopColor="#C48B6B" stopOpacity="0.35" />
        </radialGradient>
        <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A2C1A" />
          <stop offset="30%" stopColor="#3D2315" />
          <stop offset="55%" stopColor="#5C3720" />
          <stop offset="80%" stopColor="#6B4228" />
          <stop offset="100%" stopColor="#3D2315" />
        </linearGradient>
        <linearGradient id="hairHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8B5E3C" stopOpacity="0.55" />
          <stop offset="50%" stopColor="#A67950" stopOpacity="0.3" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
        <linearGradient id="labCoatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5B21B6" />
          <stop offset="40%" stopColor="#7C3AED" />
          <stop offset="70%" stopColor="#4C1D95" />
          <stop offset="100%" stopColor="#3B0764" />
        </linearGradient>
        <linearGradient id="labCoatHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.35" />
          <stop offset="60%" stopColor="transparent" />
        </linearGradient>
        <radialGradient id="eyeGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#5D3B1C" />
          <stop offset="50%" stopColor="#3D2312" />
          <stop offset="100%" stopColor="#1A0F06" />
        </radialGradient>
        <radialGradient id="eyeShine" cx="35%" cy="30%" r="30%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="blushGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF9AA2" stopOpacity="0.45" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id="tabletGlass" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
          <stop offset="30%" stopColor="rgba(34,211,238,0.12)" />
          <stop offset="70%" stopColor="rgba(124,58,237,0.18)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
        </linearGradient>
        <radialGradient id="gemNecklaceGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="60%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#3B0764" />
        </radialGradient>
        <radialGradient id="lipsIdle" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#E87089" />
          <stop offset="100%" stopColor="#B34559" />
        </radialGradient>
        <radialGradient id="lipsCheer" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#BE185D" />
        </radialGradient>
        <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
          <feOffset dx="2" dy="6" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.35" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="gemGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="mouthCheerInside" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#581C87" />
          <stop offset="100%" stopColor="#1E0A3C" />
        </radialGradient>
      </defs>

      {/* Shadow under character */}
      <ellipse cx="200" cy="575" rx="130" ry="16" fill="#000" opacity="0.3" />

      {/* Shoulders / Lab Coat */}
      <g filter="url(#softShadow)">
        <path
          d="M80 580 L80 380 Q100 320 140 300 L260 300 Q300 320 320 380 L320 580 Z"
          fill="url(#labCoatGrad)"
        />
        {/* Lab coat highlight */}
        <path
          d="M100 380 L110 340 Q115 325 130 315 L180 305 L150 400 L120 550 Z"
          fill="url(#labCoatHighlight)"
          opacity="0.6"
        />
        {/* Lab coat collar */}
        <path
          d="M160 300 L180 340 L200 310 L220 340 L240 300 L225 305 L210 320 L200 330 L190 320 L175 305 Z"
          fill="#4C1D95"
          stroke="#22D3EE"
          strokeWidth="1"
        />
        {/* Circuit pattern on coat left */}
        <g stroke="#22D3EE" strokeWidth="1.2" fill="none" opacity="0.7" filter="url(#cyanGlow)">
          <path d="M110 400 L130 400 L130 430 L150 430 L150 410" />
          <circle cx="110" cy="400" r="2.5" fill="#22D3EE" />
          <circle cx="150" cy="410" r="2.5" fill="#22D3EE" />
          <path d="M120 470 L145 470 L145 495 L170 495" />
          <circle cx="120" cy="470" r="2.5" fill="#22D3EE" />
          <circle cx="170" cy="495" r="2.5" fill="#22D3EE" />
        </g>
        {/* Circuit pattern on coat right */}
        <g stroke="#22D3EE" strokeWidth="1.2" fill="none" opacity="0.7" filter="url(#cyanGlow)">
          <path d="M290 400 L270 400 L270 430 L250 430 L250 410" />
          <circle cx="290" cy="400" r="2.5" fill="#22D3EE" />
          <circle cx="250" cy="410" r="2.5" fill="#22D3EE" />
          <path d="M280 470 L255 470 L255 495 L230 495" />
          <circle cx="280" cy="470" r="2.5" fill="#22D3EE" />
          <circle cx="230" cy="495" r="2.5" fill="#22D3EE" />
        </g>
        {/* Neon dots on coat */}
        <g>
          <circle cx="140" cy="360" r="2" fill="#22D3EE" opacity="0.9" filter="url(#cyanGlow)" />
          <circle cx="260" cy="360" r="2" fill="#E879F9" opacity="0.9" />
          <circle cx="100" cy="500" r="1.8" fill="#A3E635" opacity="0.8" />
          <circle cx="300" cy="500" r="1.8" fill="#22D3EE" opacity="0.8" />
          <circle cx="170" cy="450" r="1.5" fill="#E879F9" opacity="0.7" />
          <circle cx="230" cy="450" r="1.5" fill="#22D3EE" opacity="0.7" />
          <circle cx="115" cy="440" r="1.2" fill="#A3E635" opacity="0.8" />
          <circle cx="285" cy="440" r="1.2" fill="#22D3EE" opacity="0.8" />
        </g>
      </g>

      {/* Neck */}
      <path d="M175 290 L175 320 Q175 335 200 340 Q225 335 225 320 L225 290 Z" fill="url(#skinGrad)" />
      <path d="M175 290 L175 320 Q175 335 200 340 L200 295 Z" fill="url(#skinShadow)" opacity="0.4" />

      {/* Circuit Necklace */}
      <g filter="url(#gemGlow)">
        {/* Chain left */}
        <path
          d="M175 305 Q180 340 190 360"
          stroke="#7C3AED"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Chain right */}
        <path
          d="M225 305 Q220 340 210 360"
          stroke="#7C3AED"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Hexagon pendant frame */}
        <polygon
          points="200,355 215,363 215,380 200,388 185,380 185,363"
          fill="rgba(34,211,238,0.15)"
          stroke="#22D3EE"
          strokeWidth="1.8"
        />
        {/* Gem inside */}
        <polygon
          points="200,360 209,366 209,377 200,383 191,377 191,366"
          fill="url(#gemNecklaceGrad)"
        />
        {/* Gem highlight */}
        <polygon
          points="200,360 209,366 200,370 191,366"
          fill="#FFFFFF"
          opacity="0.45"
        />
        {/* Circuit traces on pendant */}
        <g stroke="#22D3EE" strokeWidth="0.8" fill="none" opacity="0.9">
          <path d="M190 362 L186 358" />
          <path d="M210 362 L214 358" />
          <path d="M190 380 L186 384" />
          <path d="M210 380 L214 384" />
        </g>
      </g>

      {/* Tablet in hands */}
      <g transform="translate(250, 420) rotate(-8)">
        {/* Tablet back shadow */}
        <rect x="2" y="4" width="115" height="155" rx="10" fill="#000" opacity="0.3" />
        {/* Tablet body */}
        <rect x="0" y="0" width="115" height="155" rx="10" fill="url(#tabletGlass)" stroke="#22D3EE" strokeWidth="1.5" opacity="0.9" />
        <rect x="4" y="4" width="107" height="147" rx="7" fill="none" stroke="#7C3AED" strokeWidth="0.8" opacity="0.6" />
        {/* Neural network on tablet */}
        <g filter="url(#cyanGlow)">
          {/* Layer 1 */}
          <circle cx="25" cy="35" r="5" fill="none" stroke="#22D3EE" strokeWidth="1.5" />
          <circle cx="25" cy="60" r="5" fill="none" stroke="#22D3EE" strokeWidth="1.5" />
          <circle cx="25" cy="85" r="5" fill="none" stroke="#22D3EE" strokeWidth="1.5" />
          <circle cx="25" cy="110" r="5" fill="none" stroke="#22D3EE" strokeWidth="1.5" />
          {/* Layer 2 */}
          <circle cx="58" cy="40" r="5" fill="#22D3EE" fillOpacity="0.5" stroke="#22D3EE" strokeWidth="1.5" />
          <circle cx="58" cy="65" r="5" fill="#22D3EE" fillOpacity="0.7" stroke="#22D3EE" strokeWidth="1.5" />
          <circle cx="58" cy="90" r="5" fill="#22D3EE" fillOpacity="0.4" stroke="#22D3EE" strokeWidth="1.5" />
          {/* Layer 3 */}
          <circle cx="90" cy="55" r="6" fill="#E879F9" fillOpacity="0.6" stroke="#E879F9" strokeWidth="1.8" />
          <circle cx="90" cy="95" r="6" fill="#E879F9" fillOpacity="0.4" stroke="#E879F9" strokeWidth="1.8" />
          {/* Connections */}
          <g stroke="#22D3EE" strokeWidth="0.8" opacity="0.55">
            <line x1="29" y1="35" x2="53" y2="40" />
            <line x1="29" y1="35" x2="53" y2="65" />
            <line x1="29" y1="60" x2="53" y2="40" />
            <line x1="29" y1="60" x2="53" y2="65" />
            <line x1="29" y1="60" x2="53" y2="90" />
            <line x1="29" y1="85" x2="53" y2="65" />
            <line x1="29" y1="85" x2="53" y2="90" />
            <line x1="29" y1="110" x2="53" y2="90" />
          </g>
          <g stroke="#E879F9" strokeWidth="1" opacity="0.7">
            <line x1="63" y1="40" x2="84" y2="55" />
            <line x1="63" y1="65" x2="84" y2="55" />
            <line x1="63" y1="65" x2="84" y2="95" />
            <line x1="63" y1="90" x2="84" y2="95" />
          </g>
        </g>
        {/* Data bars at bottom */}
        <g opacity="0.7">
          <rect x="15" y="130" width="12" height="8" rx="1" fill="#22D3EE" />
          <rect x="32" y="126" width="12" height="12" rx="1" fill="#A3E635" />
          <rect x="49" y="130" width="12" height="8" rx="1" fill="#7C3AED" />
          <rect x="66" y="123" width="12" height="15" rx="1" fill="#E879F9" />
          <rect x="83" y="128" width="12" height="10" rx="1" fill="#22D3EE" />
        </g>
        {/* Tablet reflection */}
        <path d="M8 8 L30 8 L28 25 L8 25 Z" fill="white" opacity="0.1" />
      </g>

      {/* Face base */}
      <ellipse cx="200" cy="200" rx="78" ry="95" fill="url(#skinGrad)" filter="url(#softShadow)" />
      {/* Face shadow side */}
      <ellipse cx="200" cy="200" rx="78" ry="95" fill="url(#skinShadow)" />
      {/* Forehead highlight */}
      <ellipse cx="185" cy="135" rx="28" ry="20" fill="#FFE4CF" opacity="0.55" />
      {/* Cheek highlight */}
      <ellipse cx="158" cy="215" rx="16" ry="12" fill="#FFD7C0" opacity="0.45" />
      <ellipse cx="238" cy="218" rx="14" ry="10" fill="#FFD7C0" opacity="0.35" />
      {/* Nose */}
      <path
        d="M200 180 Q194 210 190 225 Q195 235 200 236 Q205 235 210 225 Q206 210 200 180"
        fill="none"
        stroke="#D9A788"
        strokeWidth="1.2"
        opacity="0.6"
        strokeLinecap="round"
      />
      {/* Nose tip shadow */}
      <ellipse cx="198" cy="232" rx="6" ry="3.5" fill="#C48B6B" opacity="0.25" />

      {/* Blush */}
      {(mood === 'idle' || mood === 'wow') && (
        <g>
          <ellipse cx="148" cy="230" rx="16" ry="10" fill="url(#blushGrad)" opacity="0.9" />
          <ellipse cx="252" cy="230" rx="16" ry="10" fill="url(#blushGrad)" opacity="0.85" />
        </g>
      )}

      {/* Hair - back layer */}
      <path
        d="M110 190 Q95 130 140 75 Q170 50 200 48 Q235 48 265 75 Q310 130 290 190 Q285 160 270 130 Q250 100 220 90 Q200 95 180 90 Q150 100 130 130 Q115 160 110 190 Z"
        fill="url(#hairGrad)"
      />
      {/* Hair wavy bottom - back strands */}
      <path
        d="M112 180 Q100 250 118 310 Q135 340 150 320 Q140 280 150 240 Q142 210 130 200 Z"
        fill="url(#hairGrad)"
      />
      <path
        d="M288 180 Q300 250 282 310 Q265 340 250 320 Q260 280 250 240 Q258 210 270 200 Z"
        fill="url(#hairGrad)"
      />

      {/* Eyes */}
      {/* Left eye */}
      <g>
        {/* Eye white */}
        <ellipse
          cx="168"
          cy="190"
          rx={mood === 'wow' ? 15 : 12}
          ry={mood === 'wow' ? 14 : 11}
          fill="#FBF7F2"
        />
        {/* Eyelid shadow */}
        <path
          d={`M155 178 Q168 ${mood === 'oops' ? 172 : 175} 181 178 Q180 182 168 185 Q156 182 155 178 Z`}
          fill="#F5C4A5"
          opacity="0.5"
        />
        {/* Iris */}
        <circle
          cx="168"
          cy={mood === 'oops' ? 193 : 191}
          r={mood === 'wow' ? 8.5 : 7}
          fill="url(#eyeGrad)"
        />
        {/* Pupil */}
        <circle
          cx="168"
          cy={mood === 'oops' ? 193 : 191}
          r={mood === 'wow' ? 4.2 : 3.3}
          fill="#0D0503"
        />
        {/* Eye shine */}
        <ellipse cx="164" cy="187" rx="2.5" ry="2" fill="url(#eyeShine)" />
        <circle cx="171" cy="194" r="1.1" fill="#FFFFFF" opacity="0.85" />
        {/* Lower lash line */}
        <path
          d="M156 200 Q168 205 180 200"
          fill="none"
          stroke="#3D2315"
          strokeWidth="0.8"
          opacity="0.5"
          strokeLinecap="round"
        />
        {/* Oops: left eyebrow raised */}
        {mood === 'oops' && (
          <path
            d="M152 162 Q165 152 180 160"
            fill="none"
            stroke="#3D2315"
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}
        {/* Normal eyebrow */}
        {mood !== 'oops' && (
          <path
            d="M153 166 Q166 161 180 165"
            fill="none"
            stroke="#3D2315"
            strokeWidth={mood === 'wow' ? '2.8' : '2.5'}
            strokeLinecap="round"
          />
        )}
        {/* Upper eyelashes */}
        <path
          d="M155 180 Q168 175 181 180"
          fill="none"
          stroke="#2D1808"
          strokeWidth={mood === 'wow' ? '2.5' : '2'}
          strokeLinecap="round"
        />
      </g>
      {/* Right eye */}
      <g>
        <ellipse
          cx="232"
          cy="190"
          rx={mood === 'wow' ? 15 : 12}
          ry={mood === 'wow' ? 14 : 11}
          fill="#FBF7F2"
        />
        <path
          d={`M219 178 Q232 175 245 178 Q244 182 232 185 Q220 182 219 178 Z`}
          fill="#F5C4A5"
          opacity="0.5"
        />
        <circle
          cx="232"
          cy="191"
          r={mood === 'wow' ? 8.5 : 7}
          fill="url(#eyeGrad)"
        />
        <circle
          cx="232"
          cy="191"
          r={mood === 'wow' ? 4.2 : 3.3}
          fill="#0D0503"
        />
        <ellipse cx="228" cy="187" rx="2.5" ry="2" fill="url(#eyeShine)" />
        <circle cx="235" cy="194" r="1.1" fill="#FFFFFF" opacity="0.85" />
        <path
          d="M220 200 Q232 205 244 200"
          fill="none"
          stroke="#3D2315"
          strokeWidth="0.8"
          opacity="0.5"
          strokeLinecap="round"
        />
        {/* Right eyebrow - normal for oops too */}
        <path
          d="M220 166 Q232 160 247 166"
          fill="none"
          stroke="#3D2315"
          strokeWidth={mood === 'wow' ? '2.8' : '2.5'}
          strokeLinecap="round"
        />
        <path
          d="M219 180 Q232 175 245 180"
          fill="none"
          stroke="#2D1808"
          strokeWidth={mood === 'wow' ? '2.5' : '2'}
          strokeLinecap="round"
        />
      </g>

      {/* Earpiece - right ear */}
      <g>
        {/* Right ear (partial) */}
        <path d="M272 185 Q282 195 280 215 Q275 225 272 220" fill="url(#skinGrad)" />
        <path d="M273 190 Q277 198 275 210" fill="none" stroke="#C48B6B" strokeWidth="0.8" opacity="0.5" />
        {/* Earpiece body */}
        <ellipse cx="278" cy="192" rx="5" ry="8" fill="#1F2937" stroke="#374151" strokeWidth="0.8" />
        {/* Earpiece tip in ear */}
        <ellipse cx="273" cy="195" rx="3" ry="4" fill="#111827" />
        {/* Earpiece stem */}
        <rect x="276" y="198" width="2.5" height="10" rx="1" fill="#1F2937" />
        {/* Earpiece LED cyan */}
        <circle cx="280" cy="189" r="1.5" fill="#22D3EE" filter="url(#cyanGlow)" />
      </g>
      {/* Left ear (partial) */}
      <path d="M128 185 Q118 195 120 215 Q125 225 128 220" fill="url(#skinGrad)" />
      <path d="M127 190 Q123 198 125 210" fill="none" stroke="#C48B6B" strokeWidth="0.8" opacity="0.5" />

      {/* Mouth expressions */}
      {mood === 'idle' && (
        <g>
          {/* Gentle closed smile */}
          <path
            d="M178 258 Q200 272 222 258 Q200 266 178 258 Z"
            fill="url(#lipsIdle)"
            opacity="0.92"
          />
          {/* Upper lip line */}
          <path
            d="M180 258 Q190 254 200 256 Q210 254 220 258"
            fill="none"
            stroke="#B34559"
            strokeWidth="1.2"
            opacity="0.55"
            strokeLinecap="round"
          />
          {/* Bottom lip subtle highlight */}
          <path
            d="M188 266 Q200 270 212 266"
            fill="none"
            stroke="#FFC2CF"
            strokeWidth="1"
            opacity="0.4"
            strokeLinecap="round"
          />
        </g>
      )}
      {mood === 'cheer' && (
        <g>
          {/* Big open smiling mouth */}
          <path
            d="M170 252 Q200 292 230 252 Q230 270 200 286 Q170 270 170 252 Z"
            fill="url(#mouthCheerInside)"
          />
          {/* Tongue */}
          <ellipse cx="200" cy="278" rx="13" ry="7" fill="#F472B6" opacity="0.85" />
          {/* Teeth top */}
          <rect x="178" y="255" width="44" height="8" rx="2" fill="#FFF9F0" />
          <g stroke="#E8E0D4" strokeWidth="0.8" opacity="0.6">
            <line x1="189" y1="255" x2="189" y2="263" />
            <line x1="200" y1="255" x2="200" y2="263" />
            <line x1="211" y1="255" x2="211" y2="263" />
          </g>
          {/* Lip outline bottom */}
          <path
            d="M170 252 Q200 292 230 252"
            fill="none"
            stroke="#BE185D"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.9"
          />
          {/* Top lip accent */}
          <path
            d="M174 254 Q187 248 200 251 Q213 248 226 254"
            fill="none"
            stroke="#F472B6"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </g>
      )}
      {mood === 'oops' && (
        <g>
          {/* Small O shape mouth */}
          <ellipse cx="200" cy="260" rx="9" ry="12" fill="#3B0764" />
          {/* Tongue tip */}
          <ellipse cx="200" cy="265" rx="4" ry="3" fill="#F472B6" opacity="0.7" />
          {/* Inner lip outline */}
          <ellipse
            cx="200"
            cy="260"
            rx="9"
            ry="12"
            fill="none"
            stroke="#B34559"
            strokeWidth="2.2"
            opacity="0.9"
          />
          {/* Lip shine bottom */}
          <ellipse cx="197" cy="270" rx="2" ry="1.2" fill="#FFB6C2" opacity="0.6" />
        </g>
      )}
      {mood === 'wow' && (
        <g>
          {/* Wide excited open mouth */}
          <path
            d="M172 250 Q200 295 228 250 Q228 268 200 288 Q172 268 172 250 Z"
            fill="url(#mouthCheerInside)"
          />
          {/* Tongue */}
          <ellipse cx="200" cy="280" rx="12" ry="7" fill="#F472B6" opacity="0.85" />
          {/* Upper teeth */}
          <path d="M180 255 L180 263 L220 263 L220 255 Q200 250 180 255 Z" fill="#FFF9F0" />
          <g stroke="#E8E0D4" strokeWidth="0.7" opacity="0.5">
            <line x1="190" y1="255" x2="190" y2="263" />
            <line x1="200" y1="255" x2="200" y2="263" />
            <line x1="210" y1="255" x2="210" y2="263" />
          </g>
          {/* Lip border */}
          <path
            d="M172 250 Q200 295 228 250"
            fill="none"
            stroke="#BE185D"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.9"
          />
          {/* Upper lip accent */}
          <path
            d="M176 252 Q188 246 200 249 Q212 246 224 252"
            fill="none"
            stroke="#F472B6"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Lower teeth hint */}
          <path
            d="M186 280 Q200 284 214 280"
            stroke="#FFF9F0"
            strokeWidth="1.8"
            opacity="0.6"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      )}

      {/* Hair - front layer */}
      <path
        d="M120 180 Q110 110 150 65 Q180 45 200 50 Q200 60 195 75 Q190 95 175 100 Q155 108 145 125 Q135 150 140 180 Q128 170 120 180 Z"
        fill="url(#hairGrad)"
      />
      {/* Front right hair wave */}
      <path
        d="M280 180 Q290 110 250 65 Q230 50 215 55 Q215 70 220 90 Q228 110 245 118 Q265 130 265 160 Q265 180 275 190 Q280 188 280 180 Z"
        fill="url(#hairGrad)"
      />
      {/* Front bangs sweep */}
      <path
        d="M145 100 Q170 78 200 75 Q225 80 245 95 Q235 90 215 88 Q200 92 190 102 Q180 112 160 115 Q150 110 145 100 Z"
        fill="url(#hairGrad)"
      />
      {/* Hair highlights */}
      <path
        d="M150 70 Q165 60 180 68 Q175 82 158 88 Q148 82 150 70 Z"
        fill="url(#hairHighlight)"
      />
      <path
        d="M240 72 Q255 64 268 78 Q260 92 245 95 Q238 86 240 72 Z"
        fill="url(#hairHighlight)"
        opacity="0.75"
      />
      <path
        d="M118 220 Q128 205 142 210 Q140 240 128 258 Q118 245 118 220 Z"
        fill="url(#hairHighlight)"
        opacity="0.6"
      />
      <path
        d="M282 220 Q272 205 258 210 Q260 240 272 258 Q282 245 282 220 Z"
        fill="url(#hairHighlight)"
        opacity="0.55"
      />

      {/* Chin shadow */}
      <path
        d="M160 275 Q200 295 240 275 Q220 292 200 295 Q180 292 160 275 Z"
        fill="#C48B6B"
        opacity="0.25"
      />
    </svg>
  )
}
