import { useMemo, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { MissionApi } from '../state/useMission'
import { PlayShell } from './ui/PlayShell'
import { ChunkyButton } from './ui/ChunkyButton'
import { sfx } from '../logic/sfx'
import { scoreForwardPass } from '../logic/scoreForwardPass'
import { FORWARD_PASS_TASKS } from '../content/forwardPassBlocks'
import { NeuralGridVisual } from './art/NeuralGridVisual'
import { Sparkles } from './art/Sparkles'
import type { ScoreSnap, PerStepStars } from '../types/game'

type CheckState = 'idle' | 'correct' | 'wrong'
const COLOR_STYLES: Record<string, { bg: string; ring: string; shadow: string; text: string }> = {
    cyan: {
        bg: 'linear-gradient(135deg, rgba(34,211,238,0.28) 0%, rgba(124,58,237,0.18) 100%)',
        ring: 'rgba(34,211,238,0.65)',
        shadow: '0 0 16px rgba(34,211,238,0.25)',
        text: 'text-neon-cyan',
    },
    green: {
        bg: 'linear-gradient(135deg, rgba(163,230,53,0.28) 0%, rgba(34,211,238,0.18) 100%)',
        ring: 'rgba(163,230,53,0.65)',
        shadow: '0 0 16px rgba(163,230,53,0.25)',
        text: 'text-neon-lime',
    },
    violet: {
        bg: 'linear-gradient(135deg, rgba(168,85,247,0.3) 0%, rgba(124,58,237,0.2) 100%)',
        ring: 'rgba(168,85,247,0.65)',
        shadow: '0 0 16px rgba(168,85,247,0.25)',
        text: 'text-post',
    },
    fuchsia: {
        bg: 'linear-gradient(135deg, rgba(232,121,249,0.28) 0%, rgba(244,114,182,0.2) 100%)',
        ring: 'rgba(232,121,249,0.65)',
        shadow: '0 0 16px rgba(232,121,249,0.25)',
        text: 'text-neon-fuchsia',
    },
}

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
}

export function ForwardPassScreen({ mission }: { mission: MissionApi }) {
    const task = FORWARD_PASS_TASKS[0]
    const [pipeline, setPipeline] = useState<string[]>([])
    const [shuffledAvailable, setShuffledAvailable] = useState<string[]>(() =>
        shuffle(task.blocks.map((b) => b.id))
    )
    const [checked, setChecked] = useState<CheckState>('idle')
    const [wrongAttempts, setWrongAttempts] = useState(0)
    const [shakeId, setShakeId] = useState<string | null>(null)

    const availableBlocks = useMemo(() => {
        return shuffledAvailable.filter((id) => !pipeline.includes(id))
    }, [shuffledAvailable, pipeline])

    const activatedPath = useMemo(() => {
        const nodes: { layer: number; node: number }[] = []
        const len = pipeline.length
        const correctSoFar = pipeline.every((id, i) => id === task.correctOrder[i])

        if (!correctSoFar) {
            if (len >= 1) {
                for (let i = 0; i < 3; i++) nodes.push({ layer: 0, node: i })
            }
            return nodes
        }

        if (len >= 1) {
            for (let i = 0; i < 3; i++) nodes.push({ layer: 0, node: i })
            for (let i = 0; i < 2; i++) nodes.push({ layer: 1, node: i })
        }
        if (len >= 3) {
            nodes.push({ layer: 2, node: 0 })
        }
        return nodes
    }, [pipeline, task.correctOrder])

    const activeNode = useMemo(() => {
        const len = pipeline.length
        if (len === 0) return null
        const correctSoFar = pipeline.every((id, i) => id === task.correctOrder[i])
        if (!correctSoFar) return null

        const lastId = pipeline[len - 1]
        if (lastId === 'a1') return { layer: 1, node: 0 }
        if (lastId === 'out') return { layer: 2, node: 0 }
        return null
    }, [pipeline, task.correctOrder])

    const handleSpeak = () => {
        mission.speak(task.contextText)
    }

    const checkOrder = useCallback(
        (p: string[]) => {
            const { correct, stars } = scoreForwardPass(task, p)
            if (correct) {
                sfx.tada()
                setChecked('correct')
                mission.setCoach('cheer', `Yes! z₁ → a₁ → z₂ → ŷ. That's the forward pass. Data flows left-to-right through the network. Stage 3 complete!`)
                const prevSnap = mission.scoreSnap
                const perStep: PerStepStars = {
                    dotProduct: prevSnap?.perStep?.dotProduct ?? 0,
                    matrixFill: prevSnap?.perStep?.matrixFill ?? 0,
                    forwardPass: stars,
                    lossCalc: prevSnap?.perStep?.lossCalc ?? 0,
                    chainRule: prevSnap?.perStep?.chainRule ?? 0,
                    xorTraining: prevSnap?.perStep?.xorTraining ?? 0,
                }
                const stageAccuracy = {
                    dotProduct: prevSnap?.stageAccuracy?.dotProduct ?? { correct: 0, total: 0 },
                    matrixFill: prevSnap?.stageAccuracy?.matrixFill ?? { correct: 0, total: 0 },
                    forwardPass: { correct: 1, total: 1 },
                    lossCalc: prevSnap?.stageAccuracy?.lossCalc ?? { correct: 0, total: 0 },
                    chainRule: prevSnap?.stageAccuracy?.chainRule ?? { correct: 0, total: 0 },
                    xorTraining: prevSnap?.stageAccuracy?.xorTraining ?? { correct: 0, total: 0 },
                }
                const totalStars = Object.values(perStep).reduce((s, v) => s + v, 0)
                const snap: ScoreSnap = {
                    correct: (prevSnap?.correct ?? 0) + 1,
                    possible: (prevSnap?.possible ?? 0) + 1,
                    stars: totalStars,
                    perStep,
                    overallStars: Math.min(5, Math.ceil(totalStars / 2)) as ScoreSnap['overallStars'],
                    stageAccuracy,
                }
                mission.setScoreSnap(snap)
            } else {
                sfx.error()
                setChecked('wrong')
                setWrongAttempts((n) => n + 1)
                const attempts = wrongAttempts + 1
                let hint = 'Wrong order! That operation comes later. Hint: weighted sums before activations!'
                if (attempts >= 2) {
                    hint = 'Hint: Think "data flow" — hidden layer first (z then activation), then output layer (z then sigmoid)!'
                }
                if (attempts >= 3) {
                    hint = 'Hint pattern: weighted sum (z) → activation (a) repeats per layer. z₁ then a₁ then z₂ then ŷ!'
                }
                mission.setCoach('oops', hint)
            }
        },
        [task, mission, wrongAttempts]
    )

    const handleTapBlock = (blockId: string) => {
        if (checked === 'correct') return
        if (pipeline.includes(blockId)) return

        const nextIndex = pipeline.length
        const expectedId = task.correctOrder[nextIndex]

        if (blockId !== expectedId) {
            sfx.error()
            setShakeId(blockId)
            setTimeout(() => setShakeId(null), 500)
            setChecked('wrong')
            setWrongAttempts((n) => n + 1)
            const attempts = wrongAttempts + 1
            let hint = 'Wrong order! That operation comes later. Hint: weighted sums before activations!'
            if (attempts >= 2) {
                hint = 'Hint: Think "data flow" — hidden layer first (z then activation), then output layer (z then sigmoid)!'
            }
            mission.setCoach('oops', hint)
            return
        }

        sfx.activate()
        if (checked !== 'idle') setChecked('idle')
        const newPipeline = [...pipeline, blockId]
        setPipeline(newPipeline)

        if (newPipeline.length === 4) {
            checkOrder(newPipeline)
        }
    }

    const handleClear = () => {
        if (checked === 'correct') return
        sfx.click()
        setPipeline([])
        setShuffledAvailable(shuffle(task.blocks.map((b) => b.id)))
        setChecked('idle')
    }

    const handleAdvance = () => {
        sfx.whoosh()
        mission.advanceStage('lossCalc')
    }

    const pipelineSlots = 4
    const blockById = useMemo(() => {
        const m: Record<string, (typeof task.blocks)[number]> = {}
        task.blocks.forEach((b) => (m[b.id] = b))
        return m
    }, [task])

    return (
        <PlayShell
            stageLabel="STAGE 3 · Wire the Forward Pass"
            stageNumber={3}
            totalStages={6}
            progress="3 / 6"
            coachMood={mission.coachMood}
            coachLine={mission.coachLine}
            muted={mission.muted}
            onToggleMute={mission.toggleMute}
            onSpeak={handleSpeak}
            footer={
                checked === 'correct' && (
                    <div className="flex justify-end">
                        <ChunkyButton variant="cyan" size="lg" onClick={handleAdvance}>
                            Next Stage →
                        </ChunkyButton>
                    </div>
                )
            }
        >
            <div className="flex flex-col gap-2.5 sm:gap-4 pb-2">
                {/* Neural Visual Card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                    className="relative rounded-xl bg-glass-bg p-2.5 sm:p-3.5 ring-1.5 ring-glass-ring backdrop-blur-md shadow-panel"
                >
                    <div className="mb-1 flex items-center justify-center">
                        <p className="font-display text-xs font-bold tracking-wider text-neon-fuchsia sm:text-sm">
                            NEURAL NETWORK · 3 → 2 → 1
                        </p>
                    </div>
                    <div className="relative mx-auto flex items-center justify-center">
                        <NeuralGridVisual
                            layers={[3, 2, 1]}
                            activatedPath={activatedPath}
                            activeNode={activeNode}
                            className="h-[130px] w-full max-w-[320px] sm:h-[160px]"
                        />
                        <AnimatePresence>
                            {checked === 'correct' && (
                                <motion.div
                                    key="fp-sparkles"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="pointer-events-none absolute inset-0"
                                >
                                    <Sparkles variant="lime" count={16} className="h-full w-full opacity-80" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <div className="mt-1 flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-wider text-white/50 sm:text-[11px]">
                        <span className="text-neon-cyan">IN 3</span>
                        <span>→</span>
                        <span className="text-neon-lime">H 2</span>
                        <span>→</span>
                        <span className="text-neon-fuchsia">OUT 1</span>
                    </div>
                </motion.div>

                {/* Task Context Card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.06, ease: [0.2, 0.8, 0.2, 1] }}
                    className="rounded-xl bg-glass-bg p-3 sm:p-4 ring-1.5 ring-glass-ring backdrop-blur-md shadow-panel"
                >
                    <h2 className="mb-1 font-display text-base font-extrabold text-neon-cyan sm:text-lg">
                        {task.title}
                    </h2>
                    <p className="text-xs leading-relaxed text-ink-2 sm:text-sm">{task.contextText}</p>
                </motion.div>

                {/* Control & Interactive Slots Panel */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.12, ease: [0.2, 0.8, 0.2, 1] }}
                    className="rounded-xl bg-glass-bg p-3 sm:p-4 ring-1.5 ring-glass-ring backdrop-blur-md shadow-panel"
                >
                    {/* Current Pipeline Slots */}
                    <div className="mb-3.5">
                        <p className="mb-2 font-display text-xs font-bold tracking-wider text-neon-cyan sm:text-sm">
                            ⚡ CURRENT PIPELINE
                        </p>
                        <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5">
                            {Array.from({ length: pipelineSlots }).map((_, idx) => {
                                const blockId = pipeline[idx]
                                const block = blockId ? blockById[blockId] : null
                                const style = block ? COLOR_STYLES[block.color] ?? COLOR_STYLES.cyan : null
                                return (
                                    <div key={`slot-${idx}`} className="relative">
                                        {block ? (
                                            <motion.div
                                                key={`chip-${blockId}-${idx}`}
                                                layout
                                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1], type: 'spring', stiffness: 280, damping: 22 }}
                                                className="relative flex min-h-[56px] sm:min-h-[64px] flex-col items-center justify-center rounded-lg p-1.5 sm:p-2 ring-1.5 backdrop-blur"
                                                style={{
                                                    background: style!.bg,
                                                    borderColor: style!.ring,
                                                    boxShadow: style!.shadow,
                                                }}
                                            >
                        <span
                            className={`mb-0.5 font-display text-[9px] font-bold uppercase tracking-wider sm:text-[10px] ${style!.text}`}
                        >
                          STEP {idx + 1}
                        </span>
                                                <span className="text-center font-display text-xs sm:text-sm font-extrabold text-white leading-tight">
                          {block.text}
                        </span>
                                            </motion.div>
                                        ) : (
                                            <div
                                                className="flex min-h-[56px] sm:min-h-[64px] flex-col items-center justify-center rounded-lg p-1.5 sm:p-2"
                                                style={{
                                                    border: '1.5px dashed rgba(255,255,255,0.15)',
                                                    background: 'rgba(255,255,255,0.02)',
                                                }}
                                            >
                        <span className="font-display text-[10px] sm:text-xs font-bold text-white/20">
                          Step {idx + 1}
                        </span>
                                                <span className="mt-0.5 text-base text-white/15">+</span>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                        {checked === 'wrong' && (
                            <motion.p
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-2 text-center text-xs font-bold text-bad sm:text-sm"
                            >
                                ❌ Wrong order — weighted sums (z) come before activations (a)!
                            </motion.p>
                        )}
                    </div>

                    {/* Available Operations Section */}
                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <p className="font-display text-xs font-bold tracking-wider text-neon-fuchsia sm:text-sm">
                                🔧 AVAILABLE OPERATIONS
                            </p>
                            <ChunkyButton variant="ghost" size="sm" onClick={handleClear} disabled={checked === 'correct' || pipeline.length === 0}>
                                Clear
                            </ChunkyButton>
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                            {availableBlocks.map((blockId) => {
                                const block = blockById[blockId]
                                const style = COLOR_STYLES[block.color] ?? COLOR_STYLES.cyan
                                const isShaking = shakeId === blockId
                                return (
                                    <motion.button
                                        key={`avail-${blockId}`}
                                        type="button"
                                        onClick={() => handleTapBlock(blockId)}
                                        disabled={checked === 'correct'}
                                        whileHover={checked !== 'correct' ? { scale: 1.02, y: -1 } : {}}
                                        whileTap={checked !== 'correct' ? { scale: 0.98 } : {}}
                                        animate={isShaking ? { x: [-6, 6, -4, 4, -2, 2, 0] } : {}}
                                        transition={isShaking ? { duration: 0.4, ease: 'easeInOut' } : {}}
                                        className="relative flex min-h-[64px] sm:min-h-[72px] flex-col items-start justify-center rounded-lg p-2.5 sm:p-3 text-left ring-1.5 backdrop-blur transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{
                                            background: style.bg,
                                            borderColor: style.ring,
                                            boxShadow: style.shadow,
                                        }}
                                    >
                    <span
                        className={`mb-0.5 font-display text-[9px] font-bold uppercase tracking-wider sm:text-[11px] ${style.text}`}
                    >
                      {block.formula}
                    </span>
                                        <span className="font-display text-xs font-extrabold text-white sm:text-sm leading-snug">
                      {block.text}
                    </span>
                                    </motion.button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Success Card */}
                    <AnimatePresence>
                        {checked === 'correct' && (
                            <motion.div
                                key="fp-stars-success"
                                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                                className="mt-3.5 rounded-lg p-3 ring-1.5"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(163,230,53,0.18), rgba(34,211,238,0.14))',
                                    borderColor: 'rgba(163,230,53,0.55)',
                                    boxShadow: '0 0 18px rgba(163,230,53,0.25)',
                                }}
                            >
                                <div className="flex flex-col items-center gap-1">
                                    <p className="font-display text-base font-extrabold text-neon-lime sm:text-lg text-center">
                                        ✨ PIPELINE COMPLETE! Stage 3 Cleared ✨
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