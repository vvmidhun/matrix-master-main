/**
 * Asset pipeline for the generated art.
 *
 * The image generator returns opaque PNGs whose "transparent" background is
 * actually painted near-white pixels. This script keys out that background,
 * downscales each asset, and re-encodes as WebP with real alpha.
 *
 * Usage:
 *   node scripts/optimize-assets.mjs [sourceDir]
 *   node scripts/optimize-assets.mjs --recompress
 */
import { readdir, stat, mkdir, writeFile, unlink, readFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const args = process.argv.slice(2).filter((a) => a !== '--recompress')
const RECOMPRESS = process.argv.includes('--recompress')
const SOURCE = path.resolve(args[0] ?? 'art-source')
const OUT = path.resolve(import.meta.dirname, '..', 'src', 'assets')

/** Longest edge, in px, for each asset family (sized for on-screen use + 2x retina). */
const WIDTHS = [
  [/^bg-/, 1280],
  [/^map-/, 1200],
  [/^bot-/, 256],
  [/^tile-/, 192],
  [/^vehicle-/, 220],
  [/^card-/, 192],
  [/^badge-/, 192],
  [/^bin-/, 192],
]

const BG_QUALITY = 72
const SPRITE_QUALITY = 80

const widthFor = (name) => WIDTHS.find(([re]) => re.test(name))?.[1] ?? 256

/** Full-bleed scene backgrounds keep their painted background: no keying, no trim. */
const isFullBleed = (name) => /^(bg-|map-)/.test(name)

const mb = (n) => `${(n / 1024 / 1024).toFixed(2)} MB`

/** Near-white and near-grey: the generator's stand-in for transparency. */
function isBackground(r, g, b) {
  const min = Math.min(r, g, b)
  const max = Math.max(r, g, b)
  return min >= 225 && max - min <= 14
}

/**
 * Clears background connected to the image border via flood fill.
 */
function cutBackground(data, width, height, channels) {
  const size = width * height
  const bg = new Uint8Array(size)
  const stack = []

  const consider = (x, y) => {
    const p = y * width + x
    if (bg[p]) return
    const i = p * channels
    if (!isBackground(data[i], data[i + 1], data[i + 2])) return
    bg[p] = 1
    stack.push(p)
  }

  for (let x = 0; x < width; x++) {
    consider(x, 0)
    consider(x, height - 1)
  }
  for (let y = 0; y < height; y++) {
    consider(0, y)
    consider(width - 1, y)
  }

  while (stack.length) {
    const p = stack.pop()
    const x = p % width
    const y = (p / width) | 0
    if (x > 0) consider(x - 1, y)
    if (x < width - 1) consider(x + 1, y)
    if (y > 0) consider(x, y - 1)
    if (y < height - 1) consider(x, y + 1)
  }

  const alpha = new Uint8Array(size)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p = y * width + x
      if (bg[p]) continue
      let touching = false
      for (let dy = -1; dy <= 1 && !touching; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx
          const ny = y + dy
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue
          if (bg[ny * width + nx]) {
            touching = true
            break
          }
        }
      }
      alpha[p] = touching ? 0 : 255
    }
  }

  const soft = new Uint8Array(size)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0
      let n = 0
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx
          const ny = y + dy
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue
          sum += alpha[ny * width + nx]
          n++
        }
      }
      soft[y * width + x] = Math.round(sum / n)
    }
  }

  let cleared = 0
  for (let p = 0; p < size; p++) {
    data[p * channels + 3] = soft[p]
    if (soft[p] < 8) cleared++
  }
  return cleared / size
}

async function recompressExisting() {
  const files = (await readdir(OUT)).filter((f) => f.endsWith('.webp') && !f.includes('.tmp.'))
  let before = 0
  let after = 0

  for (const leftover of await readdir(OUT)) {
    if (leftover.includes('.tmp.')) await unlink(path.join(OUT, leftover))
  }

  for (const file of files) {
    const target = path.join(OUT, file)
    const input = await readFile(target)
    before += input.length
    const size = widthFor(file)

    const pipeline = sharp(input).resize(
      isFullBleed(file)
        ? { width: size, withoutEnlargement: true }
        : { width: size, height: size, fit: 'inside', withoutEnlargement: true },
    )

    const encoded = isFullBleed(file)
      ? pipeline.webp({ quality: BG_QUALITY, effort: 6 })
      : pipeline.webp({ quality: SPRITE_QUALITY, alphaQuality: 88, effort: 6 })

    const { data, info } = await encoded.toBuffer({ resolveWithObject: true })
    pipeline.destroy()
    await writeFile(target, data)
    after += data.length
    console.log(`${file}: recompress -> ${info.width}x${info.height}`)
  }

  console.log(`\n${files.length} assets: ${mb(before)} -> ${mb(after)}`)
}

if (RECOMPRESS) {
  await recompressExisting()
} else {
  await mkdir(OUT, { recursive: true })
  const files = (await readdir(SOURCE)).filter((f) => f.endsWith('.png'))
  let before = 0
  let after = 0

  for (const file of files) {
    const from = path.join(SOURCE, file)
    const to = path.join(OUT, file.replace(/\.png$/, '.webp'))
    before += (await stat(from)).size

    const size = widthFor(file)

    if (isFullBleed(file)) {
      const out = await sharp(from)
        .resize({ width: size, withoutEnlargement: true })
        .webp({ quality: BG_QUALITY, effort: 6 })
        .toFile(to)
      after += (await stat(to)).size
      console.log(`${file}: full-bleed -> ${out.width}x${out.height}`)
      continue
    }

    const { data, info } = await sharp(from).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
    const ratio = cutBackground(data, info.width, info.height, info.channels)

    const out = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
      .trim({ threshold: 2 })
      .resize({ width: size, height: size, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: SPRITE_QUALITY, alphaQuality: 88, effort: 6 })
      .toFile(to)

    after += (await stat(to)).size
    const flag = ratio < 0.05 ? '  <-- barely any background removed' : ''
    console.log(`${file}: ${(ratio * 100).toFixed(1)}% cleared -> ${out.width}x${out.height}${flag}`)
  }

  console.log(`\n${files.length} assets: ${mb(before)} -> ${mb(after)}`)
}
