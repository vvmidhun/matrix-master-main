import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const BASE = 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image'

const IMAGES = [
  {
    key: 'bgHome',
    prompt: 'cyberpunk neural network laboratory background, dark neon indigo violet theme, glowing cyan and magenta circuit patterns, floating neural nodes connected by light beams, futuristic ML research lab backdrop, cinematic lighting, realistic digital art, wide screen landscape',
    size: 'landscape_16_9',
    outName: 'bg-home.webp',
    quality: 74,
  },
  {
    key: 'bgPlay',
    prompt: 'dark matrix style training simulator background, deep navy purple gradient, faint hex grid overlay, glowing violet and cyan neon accents around edges, clean subtle HUD interface atmosphere, realistic sci fi training room, wide landscape',
    size: 'landscape_16_9',
    outName: 'bg-play.webp',
    quality: 72,
  },
  {
    key: 'bgBadge',
    prompt: 'celebratory award ceremony background, radiant purple violet and gold light rays, floating sparkles and confetti in cyan magenta lime, warm golden halo in center, epic victory moment, realistic fantasy illustration, wide landscape',
    size: 'landscape_16_9',
    outName: 'bg-badge.webp',
    quality: 76,
  },
  {
    key: 'coachIdle',
    prompt: 'realistic portrait of a friendly young woman ML engineer game coach in her late 20s, long dark brown hair, stylish purple lab coat with circuit patterns, headset earpiece, holding a tablet showing neural network, warm welcoming smile, soft studio lighting, white background for compositing, photorealistic, high detail, upper body portrait',
    size: 'portrait_4_3',
    outName: 'coach-idle.webp',
    quality: 80,
  },
  {
    key: 'badgeArt',
    prompt: 'photorealistic metallic Matrix Master badge medallion, octagonal silver and purple titanium frame, glowing cyan to magenta gem neural core in center, engraved ML ENGINEER text, small chip wires at top, laurel wreath accents, dark background, product photography style, ultra detailed macro shot, square hd',
    size: 'square_hd',
    outName: 'badge-art.webp',
    quality: 80,
  },
]

const OUT_DIR = path.resolve(process.cwd(), 'src', 'assets')

async function downloadAndConvert(img) {
  const url = `${BASE}?prompt=${encodeURIComponent(img.prompt)}&image_size=${img.size}`
  console.log(`Downloading ${img.key} -> ${img.outName} ...`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText} for ${img.key}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const outPath = path.join(OUT_DIR, img.outName)
  await mkdir(OUT_DIR, { recursive: true })
  await sharp(buf)
    .webp({ quality: img.quality, effort: 6, lossless: false })
    .toFile(outPath)
  const stats = await import('node:fs').then((f) => f.promises.stat(outPath))
  console.log(`  wrote ${img.outName} (${Math.round(stats.size / 1024)} KB)`)
  return { key: img.key, outPath: outPath }
}

async function main() {
  const results = await Promise.allSettled(IMAGES.map((i) => downloadAndConvert(i)))
  const ok = results.filter((r) => r.status === 'fulfilled').length
  const bad = results.filter((r) => r.status === 'rejected')
  console.log(`\nDone: ${ok} success, ${bad.length} failures`)
  bad.forEach((r) => console.error(' FAIL:', r.reason?.message ?? r))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
