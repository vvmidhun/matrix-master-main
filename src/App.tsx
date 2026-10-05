import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { useMission } from './state/useMission'
import { HomeScreen } from './components/HomeScreen'
import { HowToPlayOverlay } from './components/HowToPlayOverlay'
import { HOME_PRELOAD_URLS, PLAY_PRELOAD_URLS, LATE_PRELOAD_URLS } from './content/art'
import { preloadUrls, setLcpPreload } from './lib/preloadArt'

const DotProductScreen = lazy(() =>
  import('./components/DotProductScreen').then((m) => ({ default: m.DotProductScreen })),
)
const MatrixFillScreen = lazy(() =>
  import('./components/MatrixFillScreen').then((m) => ({ default: m.MatrixFillScreen })),
)
const ForwardPassScreen = lazy(() =>
  import('./components/ForwardPassScreen').then((m) => ({ default: m.ForwardPassScreen })),
)
const LossScreen = lazy(() =>
  import('./components/LossScreen').then((m) => ({ default: m.LossScreen })),
)
const ChainRuleScreen = lazy(() =>
  import('./components/ChainRuleScreen').then((m) => ({ default: m.ChainRuleScreen })),
)
const XorTrainingScreen = lazy(() =>
  import('./components/XorTrainingScreen').then((m) => ({ default: m.XorTrainingScreen })),
)
const ResultsScreen = lazy(() =>
  import('./components/ResultsScreen').then((m) => ({ default: m.ResultsScreen })),
)
const BadgeScreen = lazy(() =>
  import('./components/BadgeScreen').then((m) => ({ default: m.BadgeScreen })),
)
const ReflectScreen = lazy(() =>
  import('./components/ReflectScreen').then((m) => ({ default: m.ReflectScreen })),
)

type Preloadable = { preload?: () => Promise<unknown> }

function ScreenFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-ink">
      <div
        className="h-14 w-14 rounded-full border-4 border-neon-cyan border-t-transparent"
        style={{ animation: 'spin 0.9s linear infinite' }}
        aria-hidden
      />
      <p className="font-display text-base font-extrabold tracking-wide text-neon-cyan sm:text-lg">
        Booting the neural network…
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default function App() {
  const mission = useMission()
  const [ready, setReady] = useState(false)
  const [playWarm, setPlayWarm] = useState(false)

  useEffect(() => {
    setLcpPreload(HOME_PRELOAD_URLS[0] ?? null)
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      setReady(true)
    }
    void preloadUrls(HOME_PRELOAD_URLS).then(finish)
    const fallback = setTimeout(finish, 2500)
    const t = setTimeout(() => setPlayWarm(true), 200)
    return () => {
      clearTimeout(fallback)
      clearTimeout(t)
    }
  }, [])

  const ensurePlayAssets = useCallback(async () => {
    void preloadUrls(PLAY_PRELOAD_URLS)
    if (!playWarm) {
      await Promise.race([
        Promise.all([
          (DotProductScreen as Preloadable).preload?.(),
          (MatrixFillScreen as Preloadable).preload?.(),
          (ForwardPassScreen as Preloadable).preload?.(),
          (LossScreen as Preloadable).preload?.(),
          (ChainRuleScreen as Preloadable).preload?.(),
          (XorTrainingScreen as Preloadable).preload?.(),
          (ResultsScreen as Preloadable).preload?.(),
          (BadgeScreen as Preloadable).preload?.(),
          (ReflectScreen as Preloadable).preload?.(),
        ]).then(() => undefined),
        new Promise<void>((r) => setTimeout(r, 1800)),
      ])
      setPlayWarm(true)
    }
  }, [playWarm])

  useEffect(() => {
    if (mission.phase === 'results' || mission.phase === 'badge' || mission.phase === 'reflect') {
      void preloadUrls(LATE_PRELOAD_URLS)
    }
  }, [mission.phase])

  if (!ready) {
    return <ScreenFallback />
  }

  const { phase } = mission

  return (
    <main role="main" className="min-h-screen w-full overflow-hidden">
      {(phase === 'home' || phase === 'howto') && (
        <section aria-label="Home" className="relative h-screen w-full">
          <HomeScreen mission={mission} onPrefetchPlay={ensurePlayAssets} />
          {phase === 'howto' && (
            <HowToPlayOverlay
              mission={mission}
              onClose={() => {
                void ensurePlayAssets()
                mission.closeHowTo()
              }}
            />
          )}
        </section>
      )}

      {phase === 'dotProduct' && (
        <section aria-label="Stage 1: Dot Product" className="game-screen h-dvh w-full">
          <Suspense fallback={<ScreenFallback />}>
            <DotProductScreen mission={mission} />
          </Suspense>
        </section>
      )}

      {phase === 'matrixFill' && (
        <section aria-label="Stage 2: Matrix Fill" className="game-screen h-dvh w-full">
          <Suspense fallback={<ScreenFallback />}>
            <MatrixFillScreen mission={mission} />
          </Suspense>
        </section>
      )}

      {phase === 'forwardPass' && (
        <section aria-label="Stage 3: Forward Pass" className="game-screen h-dvh w-full">
          <Suspense fallback={<ScreenFallback />}>
            <ForwardPassScreen mission={mission} />
          </Suspense>
        </section>
      )}

      {phase === 'lossCalc' && (
        <section aria-label="Stage 4: Chapter Check" className="game-screen h-dvh w-full">
          <Suspense fallback={<ScreenFallback />}>
            <LossScreen mission={mission} />
          </Suspense>
        </section>
      )}

      {phase === 'chainRule' && (
        <section aria-label="Stage 5: Build the Forward Pass" className="game-screen h-dvh w-full">
          <Suspense fallback={<ScreenFallback />}>
            <ChainRuleScreen mission={mission} />
          </Suspense>
        </section>
      )}

      {phase === 'xorTraining' && (
        <section aria-label="Stage 6: Solve the XOR Challenge" className="game-screen h-dvh w-full">
          <Suspense fallback={<ScreenFallback />}>
            <XorTrainingScreen mission={mission} />
          </Suspense>
        </section>
      )}

      {phase === 'results' && (
        <section aria-label="Mission results" className="game-screen h-dvh w-full">
          <Suspense fallback={<ScreenFallback />}>
            <ResultsScreen mission={mission} />
          </Suspense>
        </section>
      )}

      {phase === 'badge' && (
        <section aria-label="Mission badge" className="game-screen h-dvh w-full">
          <Suspense fallback={<ScreenFallback />}>
            <BadgeScreen mission={mission} />
          </Suspense>
        </section>
      )}

      {phase === 'reflect' && (
        <section aria-label="Reflection" className="game-screen h-dvh w-full">
          <Suspense fallback={<ScreenFallback />}>
            <ReflectScreen mission={mission} />
          </Suspense>
        </section>
      )}
    </main>
  )
}
