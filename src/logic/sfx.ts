const MUTE_KEY = 'mtm-muted'

let ctx: AudioContext | null = null
let muted = typeof localStorage !== 'undefined' && localStorage.getItem(MUTE_KEY) === '1'

export function isMuted(): boolean {
  return muted
}

export function setMuted(m: boolean): void {
  muted = m
  localStorage.setItem(MUTE_KEY, m ? '1' : '0')
}

function audio(): AudioContext | null {
  if (muted) return null
  if (!ctx) {
    try {
      ctx = new AudioContext()
    } catch {
      return null
    }
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

interface ToneOpts {
  freq: number
  dur: number
  type?: OscillatorType
  vol?: number
  delay?: number
  slideTo?: number
}

function tone({ freq, dur, type = 'sine', vol = 0.16, delay = 0, slideTo }: ToneOpts): void {
  const ac = audio()
  if (!ac) return
  const t0 = ac.currentTime + delay
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur)
  gain.gain.setValueAtTime(0, t0)
  gain.gain.linearRampToValueAtTime(vol, t0 + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(gain).connect(ac.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.05)
}

export const sfx = {
  matrixBlip(): void {
    tone({ freq: 520, dur: 0.08, type: 'square', vol: 0.07, slideTo: 880 })
  },
  activate(): void {
    tone({ freq: 440, dur: 0.1, type: 'sine' })
    tone({ freq: 660, dur: 0.1, type: 'sine', delay: 0.05, vol: 0.12 })
  },
  ding(): void {
    tone({ freq: 880, dur: 0.13, type: 'sine' })
    tone({ freq: 1320, dur: 0.18, type: 'triangle', vol: 0.12, delay: 0.06 })
  },
  hum(): void {
    tone({ freq: 220, dur: 0.22, type: 'sawtooth', slideTo: 110, vol: 0.1 })
  },
  think(): void {
    tone({ freq: 380, dur: 0.08, type: 'sine', vol: 0.08 })
    tone({ freq: 500, dur: 0.08, type: 'sine', vol: 0.08, delay: 0.1 })
    tone({ freq: 620, dur: 0.1, type: 'sine', vol: 0.08, delay: 0.2 })
  },
  tada(): void {
    const notes = [523, 659, 784, 1047]
    notes.forEach((f, i) => tone({ freq: f, dur: 0.22, type: 'triangle', delay: i * 0.1 }))
    tone({ freq: 1319, dur: 0.55, type: 'sine', delay: 0.4, vol: 0.18 })
  },
  click(): void {
    tone({ freq: 720, dur: 0.05, type: 'square', vol: 0.06 })
  },
  error(): void {
    tone({ freq: 440, dur: 0.14, type: 'square', vol: 0.08, slideTo: 180 })
  },
  whoosh(): void {
    tone({ freq: 320, dur: 0.38, type: 'sawtooth', vol: 0.05, slideTo: 120 })
    tone({ freq: 980, dur: 0.26, type: 'sine', vol: 0.08, delay: 0.1, slideTo: 1560 })
  },
  trainStep(): void {
    tone({ freq: 260, dur: 0.06, type: 'square', vol: 0.05 })
    tone({ freq: 520, dur: 0.08, type: 'triangle', vol: 0.06, delay: 0.04, slideTo: 720 })
  },
  winChime(): void {
    const notes = [523, 659, 784, 1047, 1319]
    notes.forEach((f, i) => tone({ freq: f, dur: 0.28, type: 'sine', delay: i * 0.09, vol: 0.12 + i * 0.015 }))
  },
}
