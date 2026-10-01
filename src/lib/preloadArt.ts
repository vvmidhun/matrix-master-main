export async function preloadUrls(urls: readonly string[]): Promise<void> {
  if (typeof window === 'undefined') return
  await Promise.all(
    urls.map(
      (src) =>
        new Promise<void>((resolve) => {
          if (!src) {
            resolve()
            return
          }
          const img = new Image()
          img.onload = () => resolve()
          img.onerror = () => resolve()
          img.src = src
        }),
    ),
  )
}

let lcpPreloadHref: string | null = null
export function setLcpPreload(href: string | null): void {
  lcpPreloadHref = href
}
export function getLcpPreload(): string | null {
  return lcpPreloadHref
}
