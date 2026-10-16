let gsapPromise
let refreshTimer = null
let refreshQueued = false

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export async function loadGsap() {
  if (!gsapPromise) {
    gsapPromise = Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]).then(([{ gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger)
      // Mobile URL-bar show/hide fires resize; refreshing mid-scroll snaps the page.
      ScrollTrigger.config({
        ignoreMobileResize: true,
        autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
      })
      return { gsap, ScrollTrigger }
    })
  }
  return gsapPromise
}

/**
 * Coalesce many section mounts into one ScrollTrigger.refresh().
 * Calling refresh per section on Home remaps scroll mid-gesture and jumps to top on iOS.
 */
export function refreshScrollTrigger(delay = 120) {
  refreshQueued = true
  if (refreshTimer != null) clearTimeout(refreshTimer)
  refreshTimer = setTimeout(async () => {
    refreshTimer = null
    if (!refreshQueued) return
    refreshQueued = false
    try {
      const { ScrollTrigger } = await loadGsap()
      ScrollTrigger.refresh()
    } catch {
      // GSAP may be unavailable during teardown
    }
  }, delay)
}
