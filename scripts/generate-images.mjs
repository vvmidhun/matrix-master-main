import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const OUT_DIR = path.resolve(process.cwd(), 'src', 'assets')

function background(kind, width = 1600, height = 900) {
  const common = `
    <defs>
      <linearGradient id="base" x2="1" y2="1">
        <stop stop-color="#080d20"/><stop offset=".5" stop-color="#17123b"/><stop offset="1" stop-color="#06091a"/>
      </linearGradient>
      <radialGradient id="glow">
        <stop stop-color="#7c3aed" stop-opacity=".7"/><stop offset="1" stop-color="#7c3aed" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="line" x2="1" y2="1">
        <stop stop-color="#22d3ee" stop-opacity=".05"/><stop offset=".5" stop-color="#22d3ee" stop-opacity=".55"/><stop offset="1" stop-color="#e879f9" stop-opacity=".12"/>
      </linearGradient>
      <pattern id="grid" width="54" height="54" patternUnits="userSpaceOnUse">
        <path d="M54 0H0V54" fill="none" stroke="#b8c0e8" stroke-opacity=".08" stroke-width="1"/>
        <circle cx="1" cy="1" r="1.5" fill="#22d3ee" fill-opacity=".22"/>
      </pattern>
      <filter id="blur"><feGaussianBlur stdDeviation="55"/></filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#base)"/>
    <ellipse cx="320" cy="180" rx="410" ry="300" fill="url(#glow)" opacity=".65"/>
    <ellipse cx="1340" cy="760" rx="430" ry="350" fill="url(#glow)" opacity=".42"/>
    <rect width="100%" height="100%" fill="url(#grid)"/>
    <g fill="none" stroke="url(#line)" stroke-width="3" opacity=".65">
      <path d="M0 168h188l76 76h194l80 80h152"/>
      <path d="M1600 174h-195l-85 85h-128l-82 82h-88"/>
      <path d="M0 730h150l70-70h124l58-58h137"/>
      <path d="M1600 760h-182l-65-65h-145l-65-65h-100"/>
    </g>
    <g fill="#22d3ee" opacity=".75">
      <circle cx="458" cy="244" r="5"/><circle cx="1100" cy="341" r="5"/>
      <circle cx="402" cy="602" r="4"/><circle cx="1208" cy="629" r="4"/>
    </g>`
  const artwork = kind === 'home'
    ? `<g transform="translate(800 448)">
        <circle r="266" fill="none" stroke="#22d3ee" stroke-opacity=".18" stroke-width="2"/>
        <circle r="224" fill="none" stroke="#e879f9" stroke-opacity=".2" stroke-width="2" stroke-dasharray="8 18"/>
        <circle r="155" fill="#111a3d" fill-opacity=".72" stroke="#22d3ee" stroke-opacity=".55" stroke-width="3"/>
        <circle r="110" fill="none" stroke="#a3e635" stroke-opacity=".45" stroke-width="2"/>
        <g fill="none" stroke="#8be9ff" stroke-opacity=".7" stroke-width="2">
          <path d="M-180-82-92-138 10-84 122-143 188-68M-190 26-105-5 5 78 115 35 191 110"/>
          <path d="M-91-138-105-5M10-84 5 78M122-143 115 35M-180-82-190 26"/>
        </g>
        <g fill="#22d3ee">
          <circle cx="-180" cy="-82" r="11"/><circle cx="-92" cy="-138" r="13" fill="#e879f9"/>
          <circle cx="10" cy="-84" r="15" fill="#a3e635"/><circle cx="122" cy="-143" r="12"/>
          <circle cx="188" cy="-68" r="10" fill="#e879f9"/><circle cx="-190" cy="26" r="10"/>
          <circle cx="-105" cy="-5" r="12"/><circle cx="5" cy="78" r="13" fill="#e879f9"/>
          <circle cx="115" cy="35" r="12" fill="#a3e635"/><circle cx="191" cy="110" r="10"/>
        </g>
        <path d="M-60 0 0-58 60 0 0 58Z" fill="#1b2a59" stroke="#22d3ee" stroke-width="3"/>
        <circle r="24" fill="#7c3aed" stroke="#a5f3fc" stroke-width="3"/>
        <circle r="9" fill="#e0faff"/>
      </g>`
    : kind === 'badge'
      ? `<g opacity=".8">${Array.from({ length: 22 }, (_, i) => {
        const x = (i * 173 + 47) % width
        const y = (i * 317 + 69) % height
        const r = 70 + (i * 29) % 110
        return `<path d="M800 450L${x} ${y}" stroke="${i % 2 ? '#fbbf24' : '#22d3ee'}" stroke-opacity=".12" stroke-width="${r / 2}"/>`
      }).join('')}</g>
      <ellipse cx="800" cy="450" rx="400" ry="280" fill="url(#glow)" opacity=".8"/>
      <g fill="#fbbf24">${Array.from({ length: 36 }, (_, i) =>
        `<path d="M${(i * 271 + 31) % width} ${(i * 127 + 46) % height}l5 12 12 5-12 5-5 12-5-12-12-5 12-5z" opacity=".${(i % 5) + 3}"/>`,
      ).join('')}</g>`
      : `<g opacity=".5">${Array.from({ length: 42 }, (_, i) => {
        const x = (i * 191 + 83) % width
        const y = (i * 307 + 29) % height
        return `<circle cx="${x}" cy="${y}" r="${1 + i % 3}" fill="${i % 3 ? '#22d3ee' : '#e879f9'}"/>`
      }).join('')}</g>`

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${common}${artwork}</svg>`
}

function coachPortrait(mood) {
  const mouths = {
    idle: '<path d="M286 386q34 25 68 0" fill="none" stroke="#a13e58" stroke-width="10" stroke-linecap="round"/>',
    cheer: '<path d="M278 380q42 64 84 0q-8 57-42 57t-42-57" fill="#762048" stroke="#a13e58" stroke-width="7"/>',
    oops: '<ellipse cx="320" cy="400" rx="13" ry="19" fill="#762048" stroke="#a13e58" stroke-width="5"/>',
    wow: '<path d="M278 381q42 42 84 0" fill="none" stroke="#a13e58" stroke-width="10" stroke-linecap="round"/>',
  }
  const brows = mood === 'oops'
    ? '<path d="M252 305l49 13M339 318l49-13"/>'
    : '<path d="M252 310q25-16 48 0M340 310q25-16 48 0"/>'
  const blink = mood === 'oops'
    ? '<ellipse cx="277" cy="341" rx="15" ry="22" fill="#312321"/><ellipse cx="363" cy="341" rx="15" ry="22" fill="#312321"/>'
    : '<ellipse cx="277" cy="341" rx="13" ry="18" fill="#312321"/><ellipse cx="363" cy="341" rx="13" ry="18" fill="#312321"/>'
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="800" viewBox="0 0 640 800">
      <defs>
        <linearGradient id="back" x2=".8" y2="1"><stop stop-color="#101a3c"/><stop offset=".55" stop-color="#241950"/><stop offset="1" stop-color="#0b1026"/></linearGradient>
        <radialGradient id="halo"><stop stop-color="#22d3ee" stop-opacity=".32"/><stop offset="1" stop-color="#7c3aed" stop-opacity="0"/></radialGradient>
        <linearGradient id="skin" x2=".2" y2="1"><stop stop-color="#ffd9b5"/><stop offset=".6" stop-color="#efb68f"/><stop offset="1" stop-color="#cc876b"/></linearGradient>
        <linearGradient id="hair" x2="1" y2="1"><stop stop-color="#4a2e29"/><stop offset=".45" stop-color="#211824"/><stop offset=".75" stop-color="#63403b"/><stop offset="1" stop-color="#201522"/></linearGradient>
        <linearGradient id="coat" x2="1" y2="1"><stop stop-color="#a879e8"/><stop offset=".38" stop-color="#6734ae"/><stop offset="1" stop-color="#271850"/></linearGradient>
        <linearGradient id="glass" x2="0" y2="1"><stop stop-color="#19385a"/><stop offset="1" stop-color="#101329"/></linearGradient>
        <filter id="soft"><feGaussianBlur stdDeviation="30"/></filter>
      </defs>
      <rect width="640" height="800" rx="44" fill="url(#back)"/>
      <ellipse cx="324" cy="333" rx="275" ry="300" fill="url(#halo)"/>
      <g fill="none" stroke="#22d3ee" stroke-opacity=".18" stroke-width="2">
        <path d="M0 160h106l44 44h72M640 218h-82l-47 47h-50M0 615h108l36-36h90M640 620h-110l-45-45h-57"/>
      </g>
      <ellipse cx="320" cy="755" rx="225" ry="32" fill="#050711" opacity=".65"/>
      <path d="M88 800q14-202 112-236 51-18 120-18t120 18q98 34 112 236" fill="url(#coat)" stroke="#9672d8" stroke-opacity=".5" stroke-width="4"/>
      <path d="M195 572l53-38 72 62-50 204H132q8-157 63-228z" fill="#dce8f8" opacity=".94"/>
      <path d="M445 572l-53-38-72 62 50 204h138q-8-157-63-228z" fill="#c3d6f0" opacity=".88"/>
      <path d="M248 534l72 62 72-62-35-22h-74z" fill="#252044" stroke="#22d3ee" stroke-opacity=".65" stroke-width="3"/>
      <path d="M208 656l44 0 0 34 34 0M428 650h-38v44h-35" fill="none" stroke="#22d3ee" stroke-width="4" stroke-opacity=".82"/>
      <circle cx="208" cy="656" r="6" fill="#22d3ee"/><circle cx="355" cy="694" r="6" fill="#e879f9"/>
      <path d="M290 475v87q30 31 60 0v-87" fill="url(#skin)"/>
      <path d="M176 303q-18-147 144-176 145 22 144 176l-22 212q-9 76-68 104l-7-99H273l-7 99q-59-28-68-104z" fill="url(#hair)"/>
      <ellipse cx="320" cy="345" rx="115" ry="150" fill="url(#skin)"/>
      <ellipse cx="320" cy="397" rx="90" ry="92" fill="#da997d" opacity=".12"/>
      <path d="M205 315q4-167 119-184 128 10 120 169-38-48-90-57-57-10-91-54-19 53-58 79z" fill="url(#hair)"/>
      <path d="M221 251q25-76 95-94M376 174q44 26 57 81" fill="none" stroke="#b88970" stroke-width="8" stroke-linecap="round" opacity=".35"/>
      <ellipse cx="206" cy="358" rx="18" ry="30" fill="url(#skin)"/><ellipse cx="434" cy="358" rx="18" ry="30" fill="url(#skin)"/>
      ${brows}
      ${blink}
      <circle cx="281" cy="336" r="4" fill="#fff"/><circle cx="367" cy="336" r="4" fill="#fff"/>
      <path d="M320 353q-11 39 1 43q8 4 16-5" fill="none" stroke="#c78168" stroke-width="6" stroke-linecap="round"/>
      <ellipse cx="245" cy="391" rx="21" ry="10" fill="#f58e99" opacity=".3"/><ellipse cx="395" cy="391" rx="21" ry="10" fill="#f58e99" opacity=".3"/>
      ${mouths[mood]}
      <path d="M199 347q-24-160 119-199 148 25 124 202" fill="none" stroke="#22d3ee" stroke-width="9" opacity=".88"/>
      <rect x="184" y="338" width="25" height="54" rx="12" fill="#7c3aed" stroke="#67e8f9" stroke-width="4"/>
      <rect x="431" y="338" width="25" height="54" rx="12" fill="#7c3aed" stroke="#67e8f9" stroke-width="4"/>
      <path d="M447 386q2 24-33 31" fill="none" stroke="#22d3ee" stroke-width="6" stroke-linecap="round"/>
      <circle cx="414" cy="417" r="6" fill="#22d3ee"/>
      <path d="M279 562q41 29 82 0" fill="none" stroke="#22d3ee" stroke-width="4" opacity=".8"/>
      <circle cx="320" cy="584" r="15" fill="#7c3aed" stroke="#22d3ee" stroke-width="4"/><circle cx="315" cy="579" r="5" fill="#fff" opacity=".8"/>
      <g transform="translate(414 542) rotate(-8)">
        <rect width="142" height="188" rx="18" fill="#161b39" stroke="#22d3ee" stroke-width="5"/>
        <rect x="11" y="12" width="120" height="160" rx="11" fill="url(#glass)"/>
        <path d="M29 129l28-33 28 18 31-51" fill="none" stroke="#a3e635" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        <g fill="#22d3ee"><circle cx="29" cy="129" r="6"/><circle cx="57" cy="96" r="6"/><circle cx="85" cy="114" r="6"/><circle cx="116" cy="63" r="6"/></g>
      </g>
      <path d="M112 100h72m-36-36v72M504 106h62m-31-31v62" stroke="#22d3ee" stroke-opacity=".28" stroke-width="3"/>
    </svg>`
  return svg
}

const images = [
  ['bg-home.webp', background('home'), 1600, 900],
  ['bg-play.webp', background('play'), 1600, 900],
  ['bg-badge.webp', background('badge'), 1600, 900],
  ['coach-idle.webp', coachPortrait('idle'), 640, 800],
  ['coach-cheer.webp', coachPortrait('cheer'), 640, 800],
  ['coach-oops.webp', coachPortrait('oops'), 640, 800],
  ['coach-wow.webp', coachPortrait('wow'), 640, 800],
  ['badge-art.webp', `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
    <defs>
      <linearGradient id="metal" x2="1" y2="1"><stop stop-color="#fff2b0"/><stop offset=".23" stop-color="#d09d34"/><stop offset=".5" stop-color="#fff0a2"/><stop offset=".8" stop-color="#9a6820"/><stop offset="1" stop-color="#f5d56e"/></linearGradient>
      <linearGradient id="edge" x2="0" y2="1"><stop stop-color="#e6e9ff"/><stop offset=".5" stop-color="#8063c9"/><stop offset="1" stop-color="#302452"/></linearGradient>
      <radialGradient id="core"><stop stop-color="#a5f3fc"/><stop offset=".35" stop-color="#22d3ee"/><stop offset=".7" stop-color="#7c3aed"/><stop offset="1" stop-color="#29154d"/></radialGradient>
      <filter id="glow"><feGaussianBlur stdDeviation="17" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <circle cx="400" cy="408" r="333" fill="#7c3aed" opacity=".22" filter="url(#glow)"/>
    <path d="M400 54 493 91 590 78 636 166 722 215 709 312 746 405 709 498 722 595 636 644 590 732 493 719 400 762 307 719 210 732 164 644 78 595 91 498 54 405 91 312 78 215 164 166 210 78 307 91Z" fill="url(#edge)" stroke="#e9ecff" stroke-width="8"/>
    <path d="M400 87 481 119 568 108 609 187 687 230 676 317 709 405 676 493 687 580 609 623 568 702 481 691 400 723 319 691 232 702 191 623 113 580 124 493 91 405 124 317 113 230 191 187 232 108 319 119Z" fill="#11142c" stroke="url(#metal)" stroke-width="16"/>
    <circle cx="400" cy="394" r="220" fill="url(#core)" stroke="url(#metal)" stroke-width="18"/>
    <circle cx="400" cy="394" r="176" fill="none" stroke="#dffaff" stroke-opacity=".65" stroke-width="4"/>
    <g stroke="#c9fbff" stroke-width="10" stroke-linecap="round" filter="url(#glow)">
      <path d="M280 360h70l50-61 54 63h68M282 449h65l53 59 55-63h66"/>
    </g>
    <g fill="#f8fdff" stroke="#22d3ee" stroke-width="6">
      <circle cx="280" cy="360" r="15"/><circle cx="350" cy="360" r="15"/><circle cx="400" cy="299" r="15"/>
      <circle cx="454" cy="362" r="15"/><circle cx="522" cy="362" r="15"/>
      <circle cx="282" cy="449" r="15"/><circle cx="347" cy="449" r="15"/><circle cx="400" cy="508" r="15"/>
      <circle cx="455" cy="445" r="15"/><circle cx="521" cy="445" r="15"/>
    </g>
    <path d="M244 584h312" stroke="url(#metal)" stroke-width="5"/>
    <text x="400" y="638" text-anchor="middle" fill="#fff4bd" font-family="Arial,sans-serif" font-size="26" font-weight="800" letter-spacing="3">MATRIX MASTER</text>
    <path d="M375 80q25-41 50 0l-25 52z" fill="url(#metal)" stroke="#fff2b0" stroke-width="4"/>
    <circle cx="400" cy="105" r="10" fill="#22d3ee"/>
  </svg>`, 800, 800],
]

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  await Promise.all(images.map(async ([name, svg, width, height]) => {
    const file = path.join(OUT_DIR, name)
    await sharp(Buffer.from(svg))
      .resize(width, height)
      .webp({ quality: 84, effort: 6 })
      .toFile(file)
    console.log(`Created ${name}`)
  }))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
