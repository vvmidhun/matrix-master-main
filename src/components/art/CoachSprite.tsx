import type { CoachMood } from '../../types/game'
import { ART_PATHS } from '../../content/art'

interface CoachSpriteProps {
  mood: CoachMood
  className?: string
}

export function CoachSprite({ mood, className }: CoachSpriteProps) {
  const artByMood: Record<CoachMood, string> = {
    idle: ART_PATHS.coachIdle,
    cheer: ART_PATHS.coachCheer,
    oops: ART_PATHS.coachOops,
    wow: ART_PATHS.coachWow,
  }

  return (
    <img
      src={artByMood[mood]}
      className={className}
      alt="Coach Nova"
      draggable={false}
    />
  )
}
