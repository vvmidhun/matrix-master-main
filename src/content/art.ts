import bgHome from '../assets/bg-home.webp'
import bgPlay from '../assets/bg-play.webp'
import bgBadge from '../assets/bg-badge.webp'
import coachIdle from '../assets/coach-idle.webp'
import badgeArt from '../assets/badge-art.webp'

export type ArtKey = 'bgHome' | 'bgPlay' | 'bgBadge' | 'coachIdle' | 'coachCheer' | 'coachOops' | 'coachWow' | 'badgeArt'

export const ART_PATHS: Record<ArtKey, string> = {
  bgHome,
  bgPlay,
  bgBadge,
  coachIdle,
  coachCheer: coachIdle,
  coachOops: coachIdle,
  coachWow: coachIdle,
  badgeArt,
}

export const HOME_PRELOAD_URLS: readonly string[] = [bgHome, coachIdle]
export const PLAY_PRELOAD_URLS: readonly string[] = [bgPlay, coachIdle]
export const LATE_PRELOAD_URLS: readonly string[] = [bgBadge, badgeArt]
