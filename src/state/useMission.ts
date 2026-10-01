import { useCallback, useEffect, useState } from 'react'
import { SPEECH } from '../content/speech'
import { isMuted, setMuted as persistMute, sfx } from '../logic/sfx'
import type { CoachMood, Phase, ScoreSnap } from '../types/game'

const PHASE_ORDER: Phase[] = [
  'home',
  'howto',
  'dotProduct',
  'matrixFill',
  'forwardPass',
  'lossCalc',
  'chainRule',
  'xorTraining',
  'results',
  'badge',
  'reflect',
]

function phaseIndex(p: Phase): number {
  return PHASE_ORDER.indexOf(p)
}

function isPast(current: Phase, target: Phase): boolean {
  return phaseIndex(current) > phaseIndex(target)
}

export interface MissionApi {
  phase: Phase
  muted: boolean
  reducedMotion: boolean
  coachMood: CoachMood
  coachLine: string
  scoreSnap: ScoreSnap | null
  openHowTo: () => void
  closeHowTo: () => void
  startPlay: () => void
  advanceStage: (nextPhase: Phase) => void
  setScoreSnap: (snap: ScoreSnap | null) => void
  setCoach: (mood: CoachMood, line: string) => void
  toggleMute: () => void
  goBadge: () => void
  goReflect: () => void
  goResults: (snap: ScoreSnap) => void
  restart: () => void
  speak: (line: string) => void
}

export function useMission(): MissionApi {
  const [phase, setPhase] = useState<Phase>('home')
  const [muted, setMutedState] = useState(isMuted)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [coachMood, setCoachMood] = useState<CoachMood>('idle')
  const [coachLine, setCoachLine] = useState<string>(SPEECH.home)
  const [scoreSnap, setScoreSnap] = useState<ScoreSnap | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReducedMotion(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  const speak = useCallback(
    (line: string) => {
      if (muted) return
      if (typeof window === 'undefined' || !window.speechSynthesis) return
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(line)
      u.rate = 1.02
      u.pitch = 1.05
      window.speechSynthesis.speak(u)
    },
    [muted],
  )

  const setCoach = useCallback((mood: CoachMood, line: string) => {
    setCoachMood(mood)
    setCoachLine(line)
  }, [])

  const openHowTo = useCallback(() => {
    sfx.click()
    setPhase('howto')
    setCoachMood('idle')
    setCoachLine(SPEECH.howto)
  }, [])

  const closeHowTo = useCallback(() => {
    sfx.click()
    if (isPast(phase, 'howto') && phase !== 'howto') {
      setPhase(phase)
    } else {
      setPhase('home')
      setCoachLine(SPEECH.home)
    }
  }, [phase])

  const startPlay = useCallback(() => {
    sfx.ding()
    setPhase('dotProduct')
    setCoachMood('idle')
    setCoachLine(SPEECH.dotProduct)
  }, [])

  const advanceStage = useCallback((nextPhase: Phase) => {
    sfx.whoosh()
    setPhase(nextPhase)
    setCoachMood('idle')
    const lines: Partial<Record<Phase, string>> = {
      matrixFill: SPEECH.matrixFill,
      forwardPass: SPEECH.forwardPass,
      lossCalc: SPEECH.lossCalc,
      chainRule: SPEECH.chainRule,
      xorTraining: SPEECH.xorTraining,
    }
    setCoachLine(lines[nextPhase] ?? 'Great job! Next challenge.')
  }, [])

  const toggleMute = useCallback(() => {
    setMutedState((m) => {
      const next = !m
      persistMute(next)
      if (next && typeof window !== 'undefined') window.speechSynthesis?.cancel()
      return next
    })
  }, [])

  const goResults = useCallback((snap: ScoreSnap) => {
    sfx.tada()
    setScoreSnap(snap)
    setPhase('results')
    setCoachMood('wow')
    setCoachLine(SPEECH.results)
  }, [])

  const goBadge = useCallback(() => {
    sfx.winChime()
    setPhase('badge')
    setCoachMood('wow')
    setCoachLine(SPEECH.badge)
  }, [])

  const goReflect = useCallback(() => {
    sfx.click()
    setPhase('reflect')
    setCoachMood('idle')
    setCoachLine(SPEECH.reflect)
  }, [])

  const restart = useCallback(() => {
    sfx.click()
    setPhase('home')
    setCoachMood('idle')
    setCoachLine(SPEECH.home)
    setScoreSnap(null)
  }, [])

  return {
    phase,
    muted,
    reducedMotion,
    coachMood,
    coachLine,
    scoreSnap,
    openHowTo,
    closeHowTo,
    startPlay,
    advanceStage,
    setScoreSnap,
    setCoach,
    toggleMute,
    goBadge,
    goReflect,
    goResults,
    restart,
    speak,
  }
}
