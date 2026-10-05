import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { MissionApi } from '../state/useMission'
import { PlayShell } from './ui/PlayShell'
import { ChunkyButton } from './ui/ChunkyButton'
import { sfx } from '../logic/sfx'
import { LOSS_TASKS } from '../content/lossTasks'
import type { PerStepStars, ScoreSnap } from '../types/game'

export function LossScreen({ mission }: { mission: MissionApi }) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    LOSS_TASKS.map(() => null),
  )
  const [complete, setComplete] = useState(false)

  const question = LOSS_TASKS[questionIndex]!
  const correctCount = answers.filter(
    (answer, index) => answer === LOSS_TASKS[index]!.correctIndex,
  ).length
  const isCorrect = selectedIndex === question.correctIndex

  const commitScore = (finalCorrectCount: number) => {
    const stars: 0 | 1 | 2 =
      finalCorrectCount === LOSS_TASKS.length ? 2 : finalCorrectCount >= 2 ? 1 : 0
    const previous = mission.scoreSnap
    const perStep: PerStepStars = {
      dotProduct: previous?.perStep.dotProduct ?? 0,
      matrixFill: previous?.perStep.matrixFill ?? 0,
      forwardPass: previous?.perStep.forwardPass ?? 0,
      lossCalc: stars,
      chainRule: previous?.perStep.chainRule ?? 0,
      xorTraining: previous?.perStep.xorTraining ?? 0,
    }
    const stageAccuracy = {
      dotProduct: previous?.stageAccuracy.dotProduct ?? { correct: 0, total: 0 },
      matrixFill: previous?.stageAccuracy.matrixFill ?? { correct: 0, total: 0 },
      forwardPass: previous?.stageAccuracy.forwardPass ?? { correct: 0, total: 0 },
      lossCalc: { correct: finalCorrectCount, total: LOSS_TASKS.length },
      chainRule: previous?.stageAccuracy.chainRule ?? { correct: 0, total: 0 },
      xorTraining: previous?.stageAccuracy.xorTraining ?? { correct: 0, total: 0 },
    }
    const totalStars = Object.values(perStep).reduce((total, value) => total + value, 0)
    const snap: ScoreSnap = {
      correct: (previous?.correct ?? 0) + (stars > 0 ? 1 : 0),
      possible: (previous?.possible ?? 0) + 1,
      stars: totalStars,
      perStep,
      overallStars: Math.min(5, Math.ceil(totalStars / 2)) as ScoreSnap['overallStars'],
      stageAccuracy,
    }
    mission.setScoreSnap(snap)
  }

  const handleChoice = (choiceIndex: number) => {
    if (selectedIndex !== null) return
    const correct = choiceIndex === question.correctIndex
    setSelectedIndex(choiceIndex)
    setAnswers((previous) =>
      previous.map((answer, index) => index === questionIndex ? choiceIndex : answer),
    )
    if (correct) {
      sfx.ding()
      mission.setCoach('cheer', 'That’s right! Keep going through the chapter check.')
    } else {
      sfx.error()
      mission.setCoach('oops', question.explanation)
    }
  }

  const handleContinue = () => {
    if (questionIndex < LOSS_TASKS.length - 1) {
      setQuestionIndex((index) => index + 1)
      setSelectedIndex(null)
      mission.setCoach('idle', 'Choose the best answer. You can do it!')
      return
    }

    const finalCorrectCount = correctCount
    const stars: 0 | 1 | 2 =
      finalCorrectCount === LOSS_TASKS.length ? 2 : finalCorrectCount >= 2 ? 1 : 0
    commitScore(finalCorrectCount)
    setComplete(true)
    if (stars > 0) {
      sfx.tada()
      mission.setCoach(
        'cheer',
        `Nice work! You got ${finalCorrectCount} out of ${LOSS_TASKS.length} chapter questions right.`,
      )
    } else {
      mission.setCoach(
        'idle',
        `You got ${finalCorrectCount} out of ${LOSS_TASKS.length}. Keep the explanations in mind as you continue.`,
      )
    }
  }

  const handleAdvance = () => {
    sfx.whoosh()
    mission.advanceStage('chainRule')
  }

  const completedCount = answers.filter((answer) => answer !== null).length

  return (
    <PlayShell
      stageLabel="STAGE 4 · Chapter Check"
      stageNumber={4}
      totalStages={6}
      progress="4 / 6"
      coachMood={mission.coachMood}
      coachLine={mission.coachLine}
      muted={mission.muted}
      onToggleMute={mission.toggleMute}
      onSpeak={() => mission.speak(question.question)}
      footer={
        complete && (
          <div className="flex justify-end">
            <ChunkyButton variant="cyan" size="lg" onClick={handleAdvance}>
              Next Stage →
            </ChunkyButton>
          </div>
        )
      }
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 pb-2 sm:gap-6">
        <div className="rounded-2xl bg-glass-bg p-4 ring-2 ring-glass-ring shadow-panel sm:p-5">
          <p className="font-display text-xs font-black uppercase tracking-widest text-neon-cyan sm:text-sm">
            Neural networks · Quick check
          </p>
          <h2 className="mt-2 font-display text-xl font-extrabold text-ink sm:text-2xl">
            Pick the best answer
          </h2>
          <p className="mt-1 text-sm text-ink-2">
            Review the ideas from the chapter. Choose one answer for each question.
          </p>
          <div className="mt-4 flex gap-2" aria-label={`${completedCount} of ${LOSS_TASKS.length} questions answered`}>
            {LOSS_TASKS.map((item, index) => (
              <div
                key={item.id}
                className="h-2 flex-1 rounded-full"
                style={{
                  background: answers[index] === null
                    ? 'rgba(168,85,247,0.25)'
                    : answers[index] === item.correctIndex
                      ? '#A3E635'
                      : '#F472B6',
                }}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {complete ? (
            <motion.div
              key="quiz-complete"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-glass-bg p-5 text-center ring-2 ring-glass-ring shadow-panel sm:p-7"
            >
              <p className="font-display text-2xl font-extrabold text-neon-lime">
                Chapter check complete!
              </p>
              <p className="mt-2 text-lg font-bold text-ink">
                You got {correctCount} of {LOSS_TASKS.length} questions right.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="rounded-2xl bg-glass-bg p-4 ring-2 ring-glass-ring shadow-panel sm:p-6"
            >
              <p className="font-display text-xs font-bold uppercase tracking-wider text-neon-fuchsia">
                Question {questionIndex + 1} of {LOSS_TASKS.length}
              </p>
              <h3 className="mt-2 font-display text-lg font-extrabold leading-snug text-ink sm:text-xl">
                {question.question}
              </h3>
              <div className="mt-4 grid gap-2 sm:gap-3">
                {question.choices.map((choice, index) => {
                  const chosen = selectedIndex === index
                  const revealedCorrect = selectedIndex !== null && index === question.correctIndex
                  const incorrectChoice = chosen && selectedIndex !== question.correctIndex
                  return (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => handleChoice(index)}
                      disabled={selectedIndex !== null}
                      className="flex min-h-12 items-center gap-3 rounded-xl border-2 p-3 text-left text-sm font-semibold transition-colors disabled:cursor-default sm:text-base"
                      style={{
                        borderColor: revealedCorrect
                          ? 'rgba(163,230,53,0.75)'
                          : incorrectChoice
                            ? 'rgba(244,114,182,0.75)'
                            : 'rgba(124,58,237,0.35)',
                        background: revealedCorrect
                          ? 'rgba(163,230,53,0.13)'
                          : incorrectChoice
                            ? 'rgba(244,114,182,0.13)'
                            : 'rgba(20,26,58,0.55)',
                        color: '#E9ECFF',
                      }}
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-post/30 font-display text-xs font-black">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span>{choice}</span>
                    </button>
                  )
                })}
              </div>
              {selectedIndex !== null && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 rounded-xl p-3 text-sm font-bold ${isCorrect ? 'bg-neon-lime/10 text-neon-lime' : 'bg-bad/10 text-bad'}`}
                  role="status"
                >
                  {isCorrect ? 'Correct! ' : 'Not quite. '}
                  {question.explanation}
                </motion.p>
              )}
              {selectedIndex !== null && (
                <div className="mt-4 flex justify-end">
                  <ChunkyButton variant="cyan" onClick={handleContinue}>
                    {questionIndex === LOSS_TASKS.length - 1 ? 'See Results' : 'Next Question →'}
                  </ChunkyButton>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PlayShell>
  )
}
