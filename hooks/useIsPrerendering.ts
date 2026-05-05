/**
 * useIsPrerendering
 *
 * Returns true when the app is running inside vite-plugin-prerender's
 * headless Chromium snapshot. Use this to:
 *  - Skip animations (they'd be frozen in the snapshot)
 *  - Skip live API calls (use static placeholder data instead)
 *  - Render synchronous, fully-populated HTML for crawlers
 *
 * Usage:
 *   const isPrerendering = useIsPrerendering()
 *   if (isPrerendering) return <StaticFallback />
 */

declare global {
  interface Window {
    __PRERENDERING__?: boolean
  }
}

export function useIsPrerendering(): boolean {
  return typeof window !== 'undefined' && window.__PRERENDERING__ === true
}
