export function registerAssetCache(): void {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return
  window.addEventListener('load', () => {
    const base = (import.meta as any).env?.BASE_URL ?? '/'
    navigator.serviceWorker
      .register(`${base}sw.js`)
      .catch(() => {})
  })
}
