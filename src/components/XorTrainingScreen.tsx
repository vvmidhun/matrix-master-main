import { useMemo, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { MissionApi } from '../state/useMission'
import { PlayShell } from './ui/PlayShell'
import { ChunkyButton } from './ui/ChunkyButton'
import { StageProgressDots } from './ui/StageProgressDots'
import { Sparkles } from './art/Sparkles'
import { sfx } from '../logic/sfx'
import { scoreXorTraining } from '../logic/scoreXorTraining'
import { XOR_TRAINING_TASKS } from '../content/xorTrainingSteps'
import type { PerStepStars, ScoreSnap } from '../types/game'

type PlotPoint = {
  x: 0 | 1
  y: 0 | 1
  label: 0 | 1
  key: '0,0' | '0,1' | '1,0' | '1,1'
}

const XOR_POINTS: readonly PlotPoint[] = [
  { x: 0, y: 0, label: 0, key: '0,0' },
  { x: 0, y: 1, label: 1, key: '0,1' },
  { x: 1, y: 0, label: 1, key: '1,0' },
  { x: 1, y: 1, label: 0, key: '1,1' },
] as const

export function XorTrainingScreen({ mission }: { mission: MissionApi }) {
  const task = XOR_TRAINING_TASKS[0]
  const [epochIdx, setEpochIdx] = useState(0)
  const [isTraining, setIsTraining] = useState(false)
  const [justWon, setJustWon] = useState(false)
  const [starAnim, setStarAnim] = useState(0)
  const [scored, setScored] = useState(false)

  const epoch = task.epochs[epochIdx]!
  const isWin = epochIdx >= task.winEpoch
  const isFinished = epochIdx >= task.epochs.length - 1

  const handleSpeak = () => {
    mission.speak(task.contextText)
  }

  const allCorrect = useMemo(() => {
    return XOR_POINTS.every((p) => epoch.classifications[p.key] === p.label)
  }, [epoch.classifications])

  useEffect(() => {
    if (isWin && !justWon && !scored) {
      setJustWon(true)
    }
  }, [isWin, justWon, scored])

  const handleTrainOne = useCallback(() => {
    if (isFinished) return
    sfx.click()
    setIsTraining(true)
    setTimeout(() => {
      setEpochIdx((prev) => Math.min(task.epochs.length - 1, prev + 1))
      setIsTraining(false)
    }, 520)
  }, [task.epochs.length, isFinished])

  const handleTrainFive = useCallback(() => {
    if (isFinished) return
    let count = 0
    const maxStep = Math.min(5, task.epochs.length - 1 - epochIdx)
    if (maxStep <= 0) return
    sfx.click()
    const iv = setInterval(() => {
      setEpochIdx((prev) => {
        const next = Math.min(task.epochs.length - 1, prev + 1)
        if (next === prev) {
          clearInterval(iv)
          setIsTraining(false)
        }
        return next
      })
      count++
      if (count >= maxStep) {
        clearInterval(iv)
        setIsTraining(false)
      }
    }, 360)
    setIsTraining(true)
  }, [epochIdx, task.epochs.length, isFinished])

  const handleResetTraining = useCallback(() => {
    if (scored) return
    sfx.click()
    setEpochIdx(0)
    setJustWon(false)
    setIsTraining(false)
  }, [scored])

  const handleFinish = useCallback(() => {
    if (scored) return
    const { correct, stars } = scoreXorTraining(task, epochIdx)
    if (correct) {
      sfx.tada()
      setStarAnim(Date.now())
      setScored(true)
      const prevSnap = mission.scoreSnap
      const perStep: PerStepStars = {
        dotProduct: prevSnap?.perStep?.dotProduct ?? 0,
        matrixFill: prevSnap?.perStep?.matrixFill ?? 0,
        forwardPass: prevSnap?.perStep?.forwardPass ?? 0,
        lossCalc: prevSnap?.perStep?.lossCalc ?? 0,
        chainRule: prevSnap?.perStep?.chainRule ?? 0,
        xorTraining: stars,
      }
      const stageAccuracy = {
        dotProduct: prevSnap?.stageAccuracy?.dotProduct ?? { correct: 0, total: 0 },
        matrixFill: prevSnap?.stageAccuracy?.matrixFill ?? { correct: 0, total: 0 },
        forwardPass: prevSnap?.stageAccuracy?.forwardPass ?? { correct: 0, total: 0 },
        lossCalc: prevSnap?.stageAccuracy?.lossCalc ?? { correct: 0, total: 0 },
        chainRule: prevSnap?.stageAccuracy?.chainRule ?? { correct: 0, total: 0 },
        xorTraining: { correct: allCorrect ? 4 : XOR_POINTS.filter((p) => epoch.classifications[p.key] === p.label).length, total: 4 },
      }
      const totalStars = Object.values(perStep).reduce((s, v) => s + v, 0)
      const snap: ScoreSnap = {
        correct: (prevSnap?.correct ?? 0) + (allCorrect ? 1 : 0),
        possible: (prevSnap?.possible ?? 0) + 1,
        stars: totalStars,
        perStep,
        overallStars: Math.min(5, Math.ceil(totalStars / 2)) as ScoreSnap['overallStars'],
        stageAccuracy,
      }
      mission.setScoreSnap(snap)
      mission.setCoach(
        stars === 2 ? 'wow' : 'cheer',
        stars === 2
          ? 'FULL TRAINING! You took the network all the way to the minimum loss. That\'s textbook convergence. ALL STAGES CLEARED! 🎯'
          : 'You solved XOR! The straight line bent into a curve — that\'s the hidden layer doing its job. Mission complete!',
      )
    }
  }, [scored, task, epochIdx, mission, allCorrect, epoch.classifications])

  const handleAdvanceResults = () => {
    sfx.whoosh()
    mission.advanceStage('results')
  }

  const plotSize = 280
  const pad = 36
  const innerSize = plotSize - pad * 2

  const toPx = (val: number): number => pad + val * innerSize

  const boundaryD = useMemo(() => {
    const pts = epoch.boundaryPoints
    if (pts.length === 0) return ''
    return pts
      .map(([x, y], i) => {
        const px = toPx(x)
        const py = toPx(1 - y)
        return `${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`
      })
      .join(' ')
  }, [epoch.boundaryPoints])

  const correctCount = XOR_POINTS.filter((p) => epoch.classifications[p.key] === p.label).length

  return (
    <PlayShell
      stageLabel="STAGE 6 · Train on XOR — FINALE"
      stageNumber={6}
      totalStages={6}
      progress="6 / 6"
      coachMood={mission.coachMood}
      coachLine={mission.coachLine}
      muted={mission.muted}
      onToggleMute={mission.toggleMute}
      onSpeak={handleSpeak}
      footer={
        scored && (
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex-1">
              <p className="font-display text-sm font-bold text-neon-lime sm:text-base">
                🎉 Mission complete! All 6 stages done.
              </p>
            </div>
            <ChunkyButton variant="success" size="xl" onClick={handleAdvanceResults}>
              View Results →
            </ChunkyButton>
          </div>
        )
      }
    >
      <div className="flex flex-col gap-4 pb-2 sm:gap-6">
        <StageProgressDots current={5} total={6} labels={['VEC', 'MAT', 'FWD', 'LOSS', 'CHAIN', 'XOR']} />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative overflow-hidden rounded-2xl bg-glass-bg p-4 ring-2 ring-glass-ring backdrop-blur-md shadow-panel sm:p-5"
        >
          <h2 className="mb-1 font-display text-lg font-extrabold text-neon-lime sm:text-xl">
            {task.title}
          </h2>
          <p className="text-sm leading-relaxed text-ink-2 sm:text-base">{task.contextText}</p>
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative overflow-hidden rounded-2xl bg-glass-bg p-4 ring-2 ring-glass-ring backdrop-blur-md shadow-panel sm:p-5"
          >
            <AnimatePresence>
              {(isWin || isTraining) && (
                <motion.div
                  key="plot-sparkles"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isWin ? 0.9 : 0.4 }}
                  exit={{ opacity: 0 }}
                  className="pointer-events-none absolute inset-0 z-10"
                >
                  <Sparkles
                    variant={allCorrect ? 'lime' : 'cyan'}
                    count={allCorrect ? 26 : 10}
                    className="h-full w-full"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-neon-cyan sm:text-sm">
                XOR DECISION BOUNDARY
              </p>
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5"
                  style={{
                    background: allCorrect ? '#A3E635' : isTraining ? '#FBBF24' : '#F472B6',
                    boxShadow: `0 0 10px ${allCorrect ? '#A3E635' : isTraining ? '#FBBF24' : '#F472B6'}`,
                    animation: isTraining ? 'pulse 0.8s ease-in-out infinite' : undefined,
                  }}
                />
                <span className="font-display text-xs font-bold text-white/80 sm:text-sm">
                  {allCorrect ? 'ALL CORRECT' : isTraining ? 'TRAINING…' : 'LEARNING'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <motion.svg
                viewBox={`0 0 ${plotSize} ${plotSize}`}
                className="h-[280px] w-full max-w-[320px] sm:h-[320px] sm:max-w-[360px]"
                style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }}
              >
                <defs>
                  <linearGradient id="grid-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="rgba(34,211,238,0.08)" />
                    <stop offset="100%" stopColor="rgba(168,85,247,0.08)" />
                  </linearGradient>
                  <filter id="glow-green">
                    <feGaussianBlur stdDeviation="2.5" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="glow-pink">
                    <feGaussianBlur stdDeviation="2.5" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>

                <rect x="0" y="0" width={plotSize} height={plotSize} rx="18" fill="url(#grid-grad)" />
                <rect x={pad} y={pad} width={innerSize} height={innerSize} rx="10"
                  fill="rgba(10,14,38,0.6)"
                  stroke="rgba(124,58,237,0.45)" strokeWidth="2" strokeDasharray="4 6"
                />

                {[0.25, 0.5, 0.75].map((t, i) => (
                  <line key={`gx-${i}`}
                    x1={toPx(t)} y1={pad} x2={toPx(t)} y2={plotSize - pad}
                    stroke="rgba(255,255,255,0.06)" strokeWidth="1"
                  />
                ))}
                {[0.25, 0.5, 0.75].map((t, i) => (
                  <line key={`gy-${i}`}
                    x1={pad} y1={toPx(1 - t)} x2={plotSize - pad} y2={toPx(1 - t)}
                    stroke="rgba(255,255,255,0.06)" strokeWidth="1"
                  />
                ))}

                <motion.path
                  key={boundaryD}
                  d={boundaryD}
                  fill="none"
                  stroke={allCorrect ? '#A3E635' : isWin ? '#FBBF24' : '#F472B6'}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  style={{
                    filter: allCorrect
                      ? 'drop-shadow(0 0 10px rgba(163,230,53,0.85))'
                      : isWin
                        ? 'drop-shadow(0 0 10px rgba(251,191,36,0.75))'
                        : 'drop-shadow(0 0 8px rgba(244,114,182,0.65))',
                  }}
                />

                {XOR_POINTS.map((p) => {
                  const isCorrect = epoch.classifications[p.key] === p.label
                  const predWrong = epoch.classifications[p.key] !== p.label
                  const cx = toPx(p.x)
                  const cy = toPx(1 - p.y)
                  const targetColor = p.label === 1 ? '#22D3EE' : '#E879F9'
                  const targetBg = p.label === 1 ? 'rgba(34,211,238,0.22)' : 'rgba(232,121,249,0.22)'
                  return (
                    <g key={p.key}>
                      <motion.circle
                        animate={predWrong ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                        transition={{ duration: predWrong ? 0.9 : 0.2, repeat: predWrong ? Infinity : 0, ease: 'easeInOut' }}
                        cx={cx} cy={cy} r={18}
                        fill={targetBg}
                        stroke={predWrong ? '#F472B6' : isCorrect ? '#A3E635' : targetColor}
                        strokeWidth={predWrong ? 3.5 : 2.5}
                        strokeDasharray={predWrong ? '4 3' : undefined}
                        filter={isCorrect ? (p.label === 1 ? 'url(#glow-green)' : 'url(#glow-pink)') : undefined}
                        style={{ transformOrigin: `${cx}px ${cy}px` }}
                      />
                      <text
                        x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
                        className="font-display"
                        fontSize="13"
                        fontWeight="800"
                        fill={isCorrect ? '#FFFFFF' : predWrong ? '#F472B6' : targetColor}
                      >
                        {p.label}
                      </text>
                      <text
                        x={cx} y={cy - 22} textAnchor="middle"
                        fontSize="9"
                        fontWeight="700"
                        fill="rgba(255,255,255,0.5)"
                      >
                        ({p.x},{p.y})
                      </text>
                      {isCorrect && (
                        <motion.text
                          key={`tick-${epochIdx}-${p.key}`}
                          initial={{ opacity: 0, y: 4, scale: 0.7 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.3 }}
                          x={cx + 14} y={cy - 10}
                          fontSize="14"
                          fill="#A3E635"
                        >
                          ✓
                        </motion.text>
                      )}
                    </g>
                  )
                })}

                <text x={pad} y={plotSize - 8} fontSize="10" fill="rgba(255,255,255,0.45)" fontWeight="700">x₁ →</text>
                <text x={8} y={pad + 6} fontSize="10" fill="rgba(255,255,255,0.45)" fontWeight="700" transform={`rotate(-90, 8, ${pad + 6})`}>x₂ ↑</text>
              </motion.svg>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
              <div className="rounded-xl bg-paper-2/50 p-2.5 ring-1 ring-glass-ring sm:p-3">
                <p className="mb-1 font-display text-[10px] font-bold uppercase tracking-wider text-neon-cyan sm:text-xs">
                  Truth Table Legend
                </p>
                <div className="flex items-center gap-3 text-[11px] font-bold sm:text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block h-3 w-3 rounded-full ring-2 ring-neon-cyan/60" style={{ background: 'rgba(34,211,238,0.25)' }} />
                    <span className="text-ink">class=1</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block h-3 w-3 rounded-full ring-2 ring-neon-fuchsia/60" style={{ background: 'rgba(232,121,249,0.25)' }} />
                    <span className="text-ink">class=0</span>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-paper-2/50 p-2.5 ring-1 ring-glass-ring sm:p-3">
                <p className="mb-1 font-display text-[10px] font-bold uppercase tracking-wider text-neon-lime sm:text-xs">
                  Classified
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-2xl font-extrabold text-white sm:text-3xl">
                    {correctCount}
                  </span>
                  <span className="text-sm font-bold text-white/60">/ 4</span>
                  {allCorrect && (
                    <motion.span
                      key={`all-${starAnim}`}
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                      className="ml-1 font-display text-sm font-extrabold text-neon-lime sm:text-base"
                      style={{ textShadow: '0 0 10px rgba(163,230,53,0.75)' }}
                    >
                      ✓ SOLVED
                    </motion.span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.12, ease: [0.2, 0.8, 0.2, 1] }}
            className="flex flex-col gap-4 sm:gap-5"
          >
            <div className="relative overflow-hidden rounded-2xl bg-glass-bg p-4 ring-2 ring-glass-ring backdrop-blur-md shadow-panel sm:p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-display text-[10px] font-bold uppercase tracking-[0.18em] text-neon-amber sm:text-xs">
                    Training Status
                  </p>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="font-display text-3xl font-extrabold text-white sm:text-4xl">
                      Epoch {epoch.epoch}
                    </span>
                    <span className="font-display text-sm font-bold text-white/50">
                      / {task.epochs.length - 1}
                    </span>
                  </div>
                </div>
                <motion.div
                  animate={isTraining ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 0.7, repeat: isTraining ? Infinity : 0 }}
                  className={`rounded-xl px-3.5 py-2 ring-2 ${
                    isFinished
                      ? 'bg-neon-lime/20 ring-neon-lime/60'
                      : isWin
                        ? 'bg-neon-amber/20 ring-neon-amber/60'
                        : 'bg-neon-fuchsia/18 ring-neon-fuchsia/55'
                  }`}
                >
                  <span className={`font-display text-sm font-extrabold sm:text-base ${
                    isFinished ? 'text-neon-lime' : isWin ? 'text-neon-amber' : 'text-neon-fuchsia'
                  }`}>
                    {isFinished ? '✅ DONE' : isWin ? '🎯 XOR SOLVED' : '⏳ IN PROGRESS'}
                  </span>
                </motion.div>
              </div>

              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-neon-fuchsia sm:text-sm">
                    ℒ Loss
                  </span>
                  <span
                    className="font-display text-xl font-extrabold sm:text-2xl"
                    style={{
                      color: epoch.loss < 0.1 ? '#A3E635' : epoch.loss < 0.3 ? '#FBBF24' : '#F472B6',
                      textShadow: epoch.loss < 0.1 ? '0 0 10px rgba(163,230,53,0.6)' : undefined,
                    }}
                  >
                    {epoch.loss.toFixed(4)}
                  </span>
                </div>
                <div className="relative h-4 w-full overflow-hidden rounded-full bg-paper/60 ring-2 ring-glass-ring">
                  <motion.div
                    key={epoch.epoch}
                    initial={{ width: '100%' }}
                    animate={{ width: `${Math.min(100, (epoch.loss / 0.693) * 100)}%` }}
                    transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      background:
                        'linear-gradient(90deg, #F472B6 0%, #FBBF24 55%, #A3E635 100%)',
                      boxShadow: '0 0 12px rgba(251,191,36,0.5)',
                    }}
                  />
                </div>
              </div>

              <motion.div
                key={`desc-${epoch.epoch}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative rounded-xl border p-3 sm:p-3.5"
                style={{
                  background: allCorrect
                    ? 'linear-gradient(135deg, rgba(163,230,53,0.16), rgba(34,211,238,0.12))'
                    : 'rgba(20,26,58,0.55)',
                  borderColor: allCorrect ? 'rgba(163,230,53,0.55)' : 'rgba(124,58,237,0.35)',
                }}
              >
                <p className={`text-sm font-bold leading-relaxed sm:text-base ${allCorrect ? 'text-neon-lime' : 'text-ink'}`}>
                  {epoch.description}
                </p>
              </motion.div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-glass-bg p-4 ring-2 ring-glass-ring backdrop-blur-md shadow-panel sm:p-5">
              <p className="mb-3 font-display text-[10px] font-bold uppercase tracking-[0.18em] text-neon-cyan sm:text-xs">
                LIVE WEIGHTS · W₁ (2×2)
              </p>
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {epoch.weightsW1.map((row, r) =>
                  row.map((v, c) => (
                    <motion.div
                      key={`w1-${r}-${c}-${epoch.epoch}`}
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 0.5, delay: (r * 2 + c) * 0.05 }}
                      className="relative rounded-xl bg-paper-2/60 p-2.5 ring-1 ring-neon-cyan/40 sm:p-3"
                      style={{
                        boxShadow: '0 0 12px rgba(34,211,238,0.18)',
                      }}
                    >
                      <p className="font-display text-[9px] font-bold uppercase tracking-wider text-neon-cyan/70 sm:text-[10px]">
                        W₁[{r}][{c}]
                      </p>
                      <motion.p
                        key={v}
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className="font-display text-lg font-extrabold text-white sm:text-xl"
                      >
                        {v}
                      </motion.p>
                    </motion.div>
                  )),
                )}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
                <div className="rounded-xl bg-paper-2/60 p-2.5 ring-1 ring-neon-fuchsia/40 sm:p-3">
                  <p className="font-display text-[9px] font-bold uppercase tracking-wider text-neon-fuchsia/70 sm:text-[10px]">
                    W₂
                  </p>
                  <p className="font-display text-sm font-extrabold text-white sm:text-base">
                    [{epoch.weightsW2.join(', ')}]
                  </p>
                </div>
                <div className="rounded-xl bg-paper-2/60 p-2.5 ring-1 ring-neon-amber/40 sm:p-3">
                  <p className="font-display text-[9px] font-bold uppercase tracking-wider text-neon-amber/70 sm:text-[10px]">
                    b₁
                  </p>
                  <p className="font-display text-sm font-extrabold text-white sm:text-base">
                    [{epoch.biasesB1.join(', ')}]
                  </p>
                </div>
                <div className="rounded-xl bg-paper-2/60 p-2.5 ring-1 ring-neon-lime/40 col-span-2 sm:col-span-1 sm:p-3">
                  <p className="font-display text-[9px] font-bold uppercase tracking-wider text-neon-lime/70 sm:text-[10px]">
                    b₂
                  </p>
                  <p className="font-display text-sm font-extrabold text-white sm:text-base">
                    {epoch.biasB2}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <ChunkyButton
                variant={scored ? 'ghost' : 'fuchsia'}
                size="lg"
                onClick={handleTrainOne}
                disabled={scored || isFinished || isTraining}
                className="w-full"
              >
                ▶ Train 1 Epoch
              </ChunkyButton>
              <ChunkyButton
                variant={scored ? 'ghost' : 'cyan'}
                size="lg"
                onClick={handleTrainFive}
                disabled={scored || isFinished || isTraining}
                className="w-full"
              >
                ⏩ ×5 Fast Train
              </ChunkyButton>
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <ChunkyButton
                variant="ghost"
                size="md"
                onClick={handleResetTraining}
                disabled={scored || epochIdx === 0 || isTraining}
                className="w-full"
              >
                ↺ Reset Training
              </ChunkyButton>
              {!scored && isWin && (
                <ChunkyButton
                  variant="success"
                  size="md"
                  onClick={handleFinish}
                  className="w-full"
                >
                  🏁 Complete Mission
                </ChunkyButton>
              )}
              {!scored && !isWin && (
                <div className="w-full" />
              )}
            </div>

            <AnimatePresence>
              {scored && (
                <motion.div
                  key={`stars-${starAnim}`}
                  initial={{ opacity: 0, y: 16, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                  className="rounded-xl p-4 ring-2"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(163,230,53,0.2), rgba(34,211,238,0.14))',
                    borderColor: 'rgba(163,230,53,0.55)',
                    boxShadow: '0 0 22px rgba(163,230,53,0.3)',
                  }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <p className="font-display text-lg font-extrabold text-neon-lime sm:text-xl">
                      🎯 XOR SOLVED! Stage 6 Cleared 🎯
                    </p>
                    <div className="flex items-center gap-2 sm:gap-3">
                      {[0, 1].map((idx) => {
                        const earned = epochIdx >= task.epochs.length - 1 ? idx < 2 : idx < 1
                        return (
                          <motion.span
                            key={`star-${idx}-${starAnim}`}
                            initial={{ scale: 0, rotate: -40 }}
                            animate={
                              earned
                                ? { scale: 1, rotate: 0 }
                                : { scale: 0.6, rotate: 0, opacity: 0.3 }
                            }
                            transition={{
                              duration: 0.5,
                              delay: 0.2 + idx * 0.12,
                              ease: [0.2, 0.8, 0.2, 1],
                              type: earned ? 'spring' : undefined,
                              stiffness: earned ? 260 : undefined,
                            }}
                            className="text-4xl sm:text-5xl"
                            style={{
                              color: earned ? '#FBBF24' : '#6B7280',
                              filter: earned
                                ? 'drop-shadow(0 0 12px rgba(251,191,36,0.85))'
                                : 'none',
                            }}
                          >
                            ★
                          </motion.span>
                        )
                      })}
                    </div>
                    <p className="text-sm text-ink-2">
                      Earned{' '}
                      <span className="font-bold text-neon-lime">
                        {epochIdx >= task.epochs.length - 1 ? '2 / 2' : '1 / 2'}
                      </span>{' '}
                      stars for Stage 6
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </PlayShell>
  )
}
