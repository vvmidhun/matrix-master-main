import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { MissionApi } from '../state/useMission'
import { PlayShell } from './ui/PlayShell'
import { ChunkyButton } from './ui/ChunkyButton'
import { NumericInputPad } from './ui/NumericInputPad'
import { sfx } from '../logic/sfx'
import { scoreMatrixFill, type MatrixFillAnswers } from '../logic/scoreMatrixFill'
import { MATRIX_FILL_TASKS } from '../content/matrixFillTasks'
import type { PerStepStars, ScoreSnap } from '../types/game'

type SectionKey = 'z' | 'relu'
type CellKey = string

function makeKey(section: SectionKey, row: number, col: number): CellKey {
  return `${section}-${row}-${col}`
}

type CellStatus = Record<CellKey, 'correct' | 'wrong' | undefined>

const STARS_PATTERN_MF: Array<{ filled: boolean; delay: number }> = [
  { filled: false, delay: 0 },
  { filled: false, delay: 0.12 },
]

export function MatrixFillScreen({ mission }: { mission: MissionApi }) {
  const task = MATRIX_FILL_TASKS[0]
  const x = task.vectorX
  const W = task.matrixW
  const b = task.biasB

  const [cellValues, setCellValues] = useState<Record<CellKey, string>>({
    [makeKey('z', 0, 0)]: '',
    [makeKey('z', 1, 0)]: '',
    [makeKey('relu', 0, 0)]: '',
    [makeKey('relu', 1, 0)]: '',
  })

  const [expandedCell, setExpandedCell] = useState<CellKey | null>(null)
  const [cellStatus, setCellStatus] = useState<CellStatus>({})
  const [allChecked, setAllChecked] = useState(false)
  const [allCorrect, setAllCorrect] = useState(false)
  const [starAnim, setStarAnim] = useState(0)
  const [shakeKey, setShakeKey] = useState(0)
  const hiddenInputRef = useRef<HTMLInputElement>(null)

  const handleSpeak = () => {
    mission.speak(task.contextText)
  }

  const zBreakdown = useMemo(() => {
    const z0 = {
      pairs: W[0]!.map((w, c) => ({ x: x[c]!, w, product: x[c]! * w })),
      bias: b[0]!,
      total: W[0]!.reduce((s, w, c) => s + x[c]! * w, 0) + b[0]!,
    }
    const z1 = {
      pairs: W[1]!.map((w, c) => ({ x: x[c]!, w, product: x[c]! * w })),
      bias: b[1]!,
      total: W[1]!.reduce((s, w, c) => s + x[c]! * w, 0) + b[1]!,
    }
    return [z0, z1]
  }, [W, x, b])

  const reluBreakdown = useMemo(() => {
    return zBreakdown.map((z) => ({
      input: z.total,
      output: Math.max(0, z.total),
      clamped: z.total < 0,
    }))
  }, [zBreakdown])

  const activeKey = expandedCell

  const setActiveValue = (v: string) => {
    if (!activeKey) return
    setCellValues((prev) => ({ ...prev, [activeKey]: v }))
    if (allChecked) {
      setAllChecked(false)
      setCellStatus((prev) => ({ ...prev, [activeKey]: undefined }))
    }
  }

  useEffect(() => {
    if (activeKey) {
      requestAnimationFrame(() => hiddenInputRef.current?.focus())
    }
  }, [activeKey])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!activeKey) return
      if (allCorrect) return
      if (e.key === 'Backspace') {
        e.preventDefault()
        setActiveValue(cellValues[activeKey]!.slice(0, -1))
        return
      }
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault()
        setActiveValue(cellValues[activeKey]! + e.key)
        return
      }
      if (e.key === '.' && !cellValues[activeKey]!.includes('.')) {
        e.preventDefault()
        const cur = cellValues[activeKey]!
        setActiveValue(cur === '' ? '0.' : cur + '.')
        return
      }
      if (e.key === '-' && cellValues[activeKey]! === '') {
        e.preventDefault()
        setActiveValue('-')
        return
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeKey, cellValues, allCorrect])

  const buildAnswers = (): MatrixFillAnswers => {
    const parse = (s: string): number | null => {
      if (s === '' || s === '-') return null
      const n = Number(s)
      return isNaN(n) ? null : n
    }
    const zCells: (number | null)[][] = [[parse(cellValues[makeKey('z', 0, 0)]! )], [parse(cellValues[makeKey('z', 1, 0)]! )]]
    const reluCells: (number | null)[][] = [[parse(cellValues[makeKey('relu', 0, 0)]! )], [parse(cellValues[makeKey('relu', 1, 0)]! )]]
    return { zCells, reluCells }
  }

  const handleCheck = () => {
    const answers = buildAnswers()
    const result = scoreMatrixFill(task, answers)
    const nextStatus: CellStatus = {}
    for (const cell of task.zCells) {
      const k = makeKey('z', cell.row, cell.col)
      const v = answers.zCells[cell.row]?.[cell.col]
      const ok = v != null && !isNaN(v) && Math.abs(v - cell.correctValue) <= cell.tolerance
      nextStatus[k] = ok ? 'correct' : 'wrong'
    }
    for (const cell of task.reluCells) {
      const k = makeKey('relu', cell.row, cell.col)
      const v = answers.reluCells[cell.row]?.[cell.col]
      const ok = v != null && !isNaN(v) && Math.abs(v - cell.correctValue) <= cell.tolerance
      nextStatus[k] = ok ? 'correct' : 'wrong'
    }
    setCellStatus(nextStatus)
    setAllChecked(true)

    if (result.correct) {
      sfx.tada()
      setAllCorrect(true)
      mission.setCoach('cheer', `Perfect! All 4 cells correct. z = W·x + b with biases, and ReLU keeps values >= 0. Stage 2 locked in!`)
      setStarAnim(Date.now())
      const prevSnap = mission.scoreSnap
      const perStep: PerStepStars = {
        dotProduct: prevSnap?.perStep?.dotProduct ?? 0,
        matrixFill: result.stars,
        forwardPass: prevSnap?.perStep?.forwardPass ?? 0,
        lossCalc: prevSnap?.perStep?.lossCalc ?? 0,
        chainRule: prevSnap?.perStep?.chainRule ?? 0,
        xorTraining: prevSnap?.perStep?.xorTraining ?? 0,
      }
      const stageAccuracy = {
        dotProduct: prevSnap?.stageAccuracy?.dotProduct ?? { correct: 0, total: 0 },
        matrixFill: { correct: result.zCorrect + result.reluCorrect, total: result.total },
        forwardPass: prevSnap?.stageAccuracy?.forwardPass ?? { correct: 0, total: 0 },
        lossCalc: prevSnap?.stageAccuracy?.lossCalc ?? { correct: 0, total: 0 },
        chainRule: prevSnap?.stageAccuracy?.chainRule ?? { correct: 0, total: 0 },
        xorTraining: prevSnap?.stageAccuracy?.xorTraining ?? { correct: 0, total: 0 },
      }
      const totalStars = Object.values(perStep).reduce((s, v) => s + v, 0)
      const snap: ScoreSnap = {
        correct: (prevSnap?.correct ?? 0) + (result.correct ? 1 : 0),
        possible: (prevSnap?.possible ?? 0) + 1,
        stars: totalStars,
        perStep,
        overallStars: Math.min(5, Math.ceil(totalStars / 2)) as ScoreSnap['overallStars'],
        stageAccuracy,
      }
      mission.setScoreSnap(snap)
    } else {
      sfx.error()
      setShakeKey((k) => k + 1)
      const wrongCount = result.total - (result.zCorrect + result.reluCorrect)
      let coach = `${wrongCount} cell${wrongCount === 1 ? '' : 's'} off. Remember: z = each weight row · x + bias. ReLU just clamps negatives to 0.`
      if (wrongCount >= 3) {
        coach = `Tap any cell to see the step-by-step breakdown. Start with z₁ = 0.8×0.6 + 0.3×0.4 + 0.9×0.7 + 0.1.`
      }
      mission.setCoach('oops', coach)
    }
  }

  const handleAdvance = () => {
    sfx.whoosh()
    mission.advanceStage('forwardPass')
  }

  const toggleCell = (key: CellKey) => {
    sfx.click()
    if (expandedCell === key) {
      setExpandedCell(null)
    } else {
      setExpandedCell(key)
    }
  }

  const renderCell = (key: CellKey, label: string) => {
    const status = cellStatus[key]
    const value = cellValues[key] ?? ''
    const expanded = expandedCell === key
    const isActive = expanded
    const isZ = key.startsWith('z')
    const rowIdx = Number(key.split('-')[1]!)
    const breakdown = isZ ? zBreakdown[rowIdx]! : reluBreakdown[rowIdx]!

    const ringStyle =
      status === 'correct'
        ? { borderColor: 'rgba(163,230,53,0.8)', boxShadow: '0 0 22px rgba(163,230,53,0.5), inset 0 0 14px rgba(163,230,53,0.15)' }
        : status === 'wrong'
          ? { borderColor: 'rgba(244,114,182,0.8)', boxShadow: '0 0 22px rgba(244,114,182,0.45), inset 0 0 14px rgba(244,114,182,0.12)' }
          : isActive
            ? { borderColor: 'rgba(232,121,249,0.8)', boxShadow: '0 0 22px rgba(232,121,249,0.55), inset 0 0 14px rgba(232,121,249,0.15)' }
            : { borderColor: 'rgba(124,58,237,0.5)', boxShadow: '0 0 14px rgba(124,58,237,0.22)' }

    return (
      <div className="w-full">
        <motion.button
          key={`cell-${key}`}
          type="button"
          onClick={() => toggleCell(key)}
          className={`relative w-full rounded-2xl p-3 text-left backdrop-blur-md transition-all duration-200 sm:p-4 ${isActive ? 'z-10' : ''}`}
          style={{
            background: 'linear-gradient(135deg, rgba(20,26,58,0.82) 0%, rgba(30,37,80,0.7) 100%)',
            border: '2px solid',
            minHeight: expanded ? undefined : 76,
            ...ringStyle,
          }}
          whileHover={!allCorrect ? { scale: 1.015 } : {}}
          whileTap={!allCorrect ? { scale: 0.985 } : {}}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <span
                className="inline-flex h-9 min-w-[44px] items-center justify-center rounded-lg px-2 font-display text-sm font-extrabold sm:text-base"
                style={{
                  background: isZ
                    ? 'linear-gradient(135deg, rgba(124,58,237,0.5), rgba(168,85,247,0.38))'
                    : 'linear-gradient(135deg, rgba(34,211,238,0.45), rgba(163,230,53,0.32))',
                  color: '#fff',
                  boxShadow: '0 0 12px rgba(124,58,237,0.35)',
                }}
              >
                {label}
              </span>
              <div
                className="min-w-[80px] flex-1 text-right font-display text-2xl font-extrabold sm:min-w-[120px] sm:text-3xl"
                style={{
                  color:
                    status === 'correct'
                      ? '#A3E635'
                      : status === 'wrong'
                        ? '#F472B6'
                        : value
                          ? '#E9ECFF'
                          : 'rgba(233,236,255,0.25)',
                  textShadow:
                    status === 'correct'
                      ? '0 0 10px rgba(163,230,53,0.6)'
                      : status === 'wrong'
                        ? '0 0 10px rgba(244,114,182,0.6)'
                        : 'none',
                }}
              >
                {value || '—'}
              </div>
              {status === 'correct' && (
                <motion.span
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 16 }}
                  className="text-2xl sm:text-3xl"
                  style={{ color: '#A3E635', filter: 'drop-shadow(0 0 10px rgba(163,230,53,0.7))' }}
                >
                  ✓
                </motion.span>
              )}
              {status === 'wrong' && (
                <motion.span
                  key={`x-${shakeKey}`}
                  initial={{ x: 0 }}
                  animate={{ x: [-7, 7, -5, 5, 0] }}
                  transition={{ duration: 0.4 }}
                  className="text-2xl sm:text-3xl"
                  style={{ color: '#F472B6', filter: 'drop-shadow(0 0 10px rgba(244,114,182,0.7))' }}
                >
                  ✗
                </motion.span>
              )}
            </div>
            <span
              className="ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg transition-transform duration-300"
              style={{
                background: expanded ? 'rgba(232,121,249,0.22)' : 'rgba(255,255,255,0.05)',
                color: expanded ? '#E879F9' : 'rgba(255,255,255,0.7)',
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >
              ▾
            </span>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                key={`bd-${key}`}
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
                className="overflow-hidden"
              >
                <div className="rounded-xl border border-glass-ring bg-paper/40 p-3 sm:p-4">
                  {isZ ? (
                    <>
                      <p className="mb-2 font-display text-xs font-bold uppercase tracking-wider text-neon-fuchsia sm:text-sm">
                        z = W·x + b (row {rowIdx + 1})
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                        {(breakdown as typeof zBreakdown[0]).pairs.map((p, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, delay: i * 0.12 }}
                            className="flex items-center gap-1 rounded-lg px-2 py-1.5 sm:gap-1.5 sm:px-2.5"
                            style={{
                              background: 'linear-gradient(135deg, rgba(168,85,247,0.22), rgba(34,211,238,0.12))',
                              border: '1px solid rgba(168,85,247,0.45)',
                            }}
                          >
                            <span className="font-display text-xs font-bold text-neon-fuchsia sm:text-sm">
                              {p.x}
                            </span>
                            <motion.span
                              animate={{ scale: [1, 1.22, 1], color: ['#fff', '#A3E635', '#fff'] }}
                              transition={{ duration: 0.4, delay: 0.1 + i * 0.12, repeat: 0 }}
                              className="font-display text-xs font-bold text-white/70 sm:text-sm"
                            >
                              ×
                            </motion.span>
                            <span className="font-display text-xs font-bold text-neon-cyan sm:text-sm">
                              {p.w}
                            </span>
                            <span className="ml-0.5 font-display text-xs font-bold text-white/70 sm:text-sm">
                              =
                            </span>
                            <span className="font-display text-xs font-extrabold text-neon-lime sm:text-sm" style={{ textShadow: '0 0 8px rgba(163,230,53,0.6)' }}>
                              {p.product.toFixed(2)}
                            </span>
                          </motion.div>
                        ))}
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2, delay: 0.1 + (breakdown as typeof zBreakdown[0]).pairs.length * 0.12 }}
                          className="font-display text-lg font-bold text-white/70 sm:text-xl"
                        >
                          +
                        </motion.span>
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25, delay: 0.16 + (breakdown as typeof zBreakdown[0]).pairs.length * 0.12 }}
                          className="flex items-center gap-1 rounded-lg px-2 py-1.5 sm:gap-1.5 sm:px-2.5"
                          style={{
                            background: 'rgba(251,191,36,0.14)',
                            border: '1px solid rgba(251,191,36,0.55)',
                          }}
                        >
                          <span className="font-display text-xs font-bold text-neon-amber sm:text-sm">
                            bias b
                          </span>
                          <span className="font-display text-xs font-extrabold text-neon-lime sm:text-sm" style={{ textShadow: '0 0 8px rgba(163,230,53,0.6)' }}>
                            = {(breakdown as typeof zBreakdown[0]).bias >= 0 ? `+${(breakdown as typeof zBreakdown[0]).bias}` : (breakdown as typeof zBreakdown[0]).bias}
                          </span>
                        </motion.div>
                      </div>
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.38 + (breakdown as typeof zBreakdown[0]).pairs.length * 0.12, ease: [0.2, 0.8, 0.2, 1] }}
                        className="mt-3 flex items-center justify-center gap-3"
                      >
                        <span className="font-display text-xl font-extrabold text-white/80 sm:text-2xl">
                          =
                        </span>
                        <span
                          className="rounded-xl px-4 py-1.5 font-display text-2xl font-extrabold text-paper sm:text-3xl"
                          style={{
                            background: 'linear-gradient(135deg, #7C3AED 0%, #22D3EE 100%)',
                            boxShadow: '0 0 22px rgba(124,58,237,0.55)',
                          }}
                        >
                          {(breakdown as typeof zBreakdown[0]).total.toFixed(2)}
                        </span>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <p className="mb-2 font-display text-xs font-bold uppercase tracking-wider text-neon-cyan sm:text-sm">
                        ReLU(z) = max(0, z)
                      </p>
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-wrap items-center justify-center gap-2"
                      >
                        <span className="rounded-lg px-3 py-1.5 font-display text-sm font-extrabold text-white" style={{
                          background: 'linear-gradient(135deg, rgba(124,58,237,0.55), rgba(168,85,247,0.38))',
                          boxShadow: '0 0 12px rgba(124,58,237,0.4)',
                        }}>
                          z = {(breakdown as typeof reluBreakdown[0]).input.toFixed(2)}
                        </span>
                        <span className="font-display text-xl font-bold text-white/70">→</span>
                        {(breakdown as typeof reluBreakdown[0]).clamped ? (
                          <span className="rounded-lg px-3 py-1.5 font-display text-sm font-extrabold text-neon-amber" style={{
                            background: 'rgba(251,191,36,0.14)',
                            border: '1px solid rgba(251,191,36,0.55)',
                          }}>
                            clamped to 0 (negative → 0)
                          </span>
                        ) : (
                          <span className="rounded-lg px-3 py-1.5 font-display text-sm font-extrabold text-paper" style={{
                            background: 'linear-gradient(135deg, #A3E635, #22D3EE)',
                            boxShadow: '0 0 18px rgba(163,230,53,0.55)',
                          }}>
                            stays {(breakdown as typeof reluBreakdown[0]).output.toFixed(2)} ✓
                          </span>
                        )}
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
                        className="mt-3 flex items-center justify-center gap-3"
                      >
                        <span className="font-display text-xl font-extrabold text-white/80 sm:text-2xl">
                          a =
                        </span>
                        <span
                          className="rounded-xl px-4 py-1.5 font-display text-2xl font-extrabold text-paper sm:text-3xl"
                          style={{
                            background: 'linear-gradient(135deg, #22D3EE 0%, #A3E635 100%)',
                            boxShadow: '0 0 22px rgba(34,211,238,0.55)',
                          }}
                        >
                          {(breakdown as typeof reluBreakdown[0]).output.toFixed(2)}
                        </span>
                      </motion.div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    )
  }

  const starLayout = allCorrect
    ? STARS_PATTERN_MF.map((s, i) => ({ ...s, filled: i < 2 }))
    : STARS_PATTERN_MF

  const correctCount = Object.values(cellStatus).filter((s) => s === 'correct').length
  const totalCells = task.zCells.length + task.reluCells.length

  return (
    <PlayShell
      stageLabel="STAGE 2 · Fill the Matrix"
      stageNumber={2}
      totalStages={6}
      progress="2 / 6"
      coachMood={mission.coachMood}
      coachLine={mission.coachLine}
      muted={mission.muted}
      onToggleMute={mission.toggleMute}
      onSpeak={handleSpeak}
      footer={
        allCorrect && (
          <div className="flex justify-end">
            <ChunkyButton variant="cyan" size="xl" onClick={handleAdvance}>
              Next Stage →
            </ChunkyButton>
          </div>
        )
      }
    >
      <div className="flex flex-col gap-4 pb-2 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          className="rounded-2xl bg-glass-bg p-4 ring-2 ring-glass-ring backdrop-blur-md shadow-panel sm:p-5"
        >
          <h2 className="mb-2 font-display text-lg font-extrabold text-neon-cyan sm:text-xl">
            {task.title}
          </h2>
          <p className="text-sm leading-relaxed text-ink-2 sm:text-base">{task.contextText}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: [0.2, 0.8, 0.2, 1] }}
          className="rounded-2xl bg-glass-bg p-4 ring-2 ring-glass-ring backdrop-blur-md shadow-panel sm:p-6"
        >
          <div className="mb-5">
            <p className="mb-2 font-display text-sm font-bold tracking-wider text-neon-fuchsia">
              INPUT x (3 features)
            </p>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {x.map((v, i) => (
                <motion.div
                  key={`x-${i}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, delay: 0.12 + i * 0.06 }}
                  className="flex flex-col items-center rounded-xl p-2 ring-2 sm:p-3"
                  style={{
                    background: 'linear-gradient(135deg, rgba(168,85,247,0.26), rgba(124,58,237,0.18))',
                    borderColor: 'rgba(168,85,247,0.55)',
                    boxShadow: '0 0 18px rgba(168,85,247,0.25)',
                  }}
                >
                  <span className="mb-1 font-display text-[10px] font-bold uppercase tracking-wider text-white/70 sm:text-xs">
                    x{i + 1}
                  </span>
                  <span className="font-display text-xl font-extrabold text-white sm:text-2xl">
                    {v}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <p className="mb-2 font-display text-sm font-bold tracking-wider text-neon-cyan">
              WEIGHTS W (2×3)
            </p>
            <div className="space-y-2 sm:space-y-3">
              {W.map((row, r) => (
                <div key={`w-${r}`} className="grid grid-cols-3 gap-2 sm:gap-3">
                  {row.map((v, c) => (
                    <motion.div
                      key={`w-${r}-${c}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.22, delay: 0.28 + (r * 3 + c) * 0.045 }}
                      className="flex flex-col items-center rounded-xl p-2 ring-2 sm:p-3"
                      style={{
                        background: 'linear-gradient(135deg, rgba(34,211,238,0.2), rgba(124,58,237,0.14))',
                        borderColor: 'rgba(34,211,238,0.5)',
                        boxShadow: '0 0 16px rgba(34,211,238,0.2)',
                      }}
                    >
                      <span className="mb-1 font-display text-[10px] font-bold uppercase tracking-wider text-white/70 sm:text-xs">
                        W{r + 1}{c + 1}
                      </span>
                      <span className="font-display text-xl font-extrabold text-white sm:text-2xl">
                        {v}
                      </span>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="mb-2 font-display text-sm font-bold tracking-wider text-neon-amber">
              BIAS b (2 outputs)
            </p>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {b.map((v, i) => (
                <motion.div
                  key={`b-${i}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, delay: 0.5 + i * 0.06 }}
                  className="flex flex-col items-center rounded-xl p-2 ring-2 sm:p-3"
                  style={{
                    background: 'linear-gradient(135deg, rgba(251,191,36,0.22), rgba(168,85,247,0.14))',
                    borderColor: 'rgba(251,191,36,0.55)',
                    boxShadow: '0 0 16px rgba(251,191,36,0.22)',
                  }}
                >
                  <span className="mb-1 font-display text-[10px] font-bold uppercase tracking-wider text-white/70 sm:text-xs">
                    b{i + 1}
                  </span>
                  <span className="font-display text-xl font-extrabold text-white sm:text-2xl">
                    {v}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="font-display text-base font-extrabold text-neon-fuchsia sm:text-lg">
                Step 1: Compute z = W·x + b
              </h3>
              <span className="rounded-full bg-post/35 px-2.5 py-1 font-display text-xs font-bold text-white/90">
                2 cells
              </span>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {task.zCells.map((cell) => (
                <div key={`zwrap-${cell.row}-${cell.col}`} className="w-full">
                  {renderCell(makeKey('z', cell.row, cell.col), `z${cell.row + 1}`)}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="font-display text-base font-extrabold text-neon-cyan sm:text-lg">
                Step 2: Compute a = ReLU(z) &nbsp;
                <span className="font-display text-sm font-bold text-white/65 sm:text-base">
                  i.e. max(0, z)
                </span>
              </h3>
              <span className="rounded-full bg-neon-cyan/30 px-2.5 py-1 font-display text-xs font-bold text-paper">
                2 cells
              </span>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {task.reluCells.map((cell) => (
                <div key={`rwrap-${cell.row}-${cell.col}`} className="w-full">
                  {renderCell(makeKey('relu', cell.row, cell.col), `a${cell.row + 1}`)}
                </div>
              ))}
            </div>
          </div>

          {!allCorrect && (
            <div className="mb-4 rounded-xl border border-glass-ring bg-paper-2/50 p-3 sm:p-4">
              <p className="mb-2 text-center font-display text-xs font-bold tracking-wider text-white/75 sm:text-sm">
                {activeKey
                  ? `EDITING: ${activeKey.startsWith('z') ? 'z' : 'a'}${Number(activeKey.split('-')[1]!) + 1} — use keypad below or type`
                  : 'Tap a cell to expand it and edit its value'}
              </p>
              <NumericInputPad
                variant="cyan"
                value={activeKey ? (cellValues[activeKey] ?? '') : ''}
                onChange={(v) => setActiveValue(v)}
                disabled={!activeKey || allCorrect}
                allowDecimal={true}
                allowNegative={true}
              />
              <input
                ref={hiddenInputRef}
                type="text"
                inputMode="decimal"
                aria-label="Active cell value"
                className="absolute h-0 w-0 opacity-0"
                value={activeKey ? (cellValues[activeKey] ?? '') : ''}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9.-]/g, '')
                  const deduped = v.replace(/\.(?=.*\.)/g, '').replace(/(?!^)-/g, '')
                  setActiveValue(deduped)
                }}
              />
            </div>
          )}

          {!allCorrect && (
            <div className="flex justify-center">
              <ChunkyButton variant="fuchsia" size="lg" onClick={handleCheck}>
                ✓ Check All Cells
              </ChunkyButton>
            </div>
          )}

          <AnimatePresence>
            {allChecked && !allCorrect && (
              <motion.div
                key="mf-summary"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                className="mt-5 rounded-xl p-4 ring-2"
                style={{
                  background: correctCount >= Math.ceil(totalCells * 0.6)
                    ? 'linear-gradient(135deg, rgba(163,230,53,0.14), rgba(34,211,238,0.1))'
                    : 'rgba(244,114,182,0.1)',
                  borderColor: correctCount >= Math.ceil(totalCells * 0.6)
                    ? 'rgba(163,230,53,0.55)'
                    : 'rgba(244,114,182,0.55)',
                }}
              >
                <p className="text-center font-display font-bold text-ink sm:text-lg">
                  <span className={correctCount >= Math.ceil(totalCells * 0.6) ? 'text-neon-lime' : 'text-bad'}>
                    {correctCount} / {totalCells}
                  </span>{' '}
                  cells correct. Tap cells marked ✗ to fix and re-check!
                </p>
              </motion.div>
            )}
            {allCorrect && (
              <motion.div
                key="mf-success"
                initial={{ opacity: 0, y: 16, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                className="mt-5 rounded-xl p-4 ring-2"
                style={{
                  background: 'linear-gradient(135deg, rgba(163,230,53,0.18), rgba(34,211,238,0.14))',
                  borderColor: 'rgba(163,230,53,0.55)',
                  boxShadow: '0 0 22px rgba(163,230,53,0.3)',
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <p className="font-display text-lg font-extrabold text-neon-lime sm:text-xl">
                    ✨ Stage 2 Cleared — Neural Layer Complete! ✨
                  </p>
                  <div className="flex items-center gap-2 sm:gap-3">
                    {starLayout.map((s, idx) => (
                      <motion.span
                        key={`star-${idx}-${starAnim}`}
                        initial={{ scale: 0, rotate: -40 }}
                        animate={s.filled ? { scale: 1, rotate: 0 } : { scale: 0.6, rotate: 0, opacity: 0.3 }}
                        transition={{
                          duration: 0.5,
                          delay: 0.2 + s.delay,
                          ease: [0.2, 0.8, 0.2, 1],
                          type: s.filled ? 'spring' : undefined,
                          stiffness: s.filled ? 260 : undefined,
                        }}
                        className="text-4xl sm:text-5xl"
                        style={{
                          color: s.filled ? '#FBBF24' : '#6B7280',
                          filter: s.filled ? 'drop-shadow(0 0 12px rgba(251,191,36,0.85))' : 'none',
                        }}
                      >
                        ★
                      </motion.span>
                    ))}
                  </div>
                  <p className="text-sm text-ink-2">
                    Earned <span className="font-bold text-neon-lime">2 / 2</span> stars for Stage 2
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </PlayShell>
  )
}
