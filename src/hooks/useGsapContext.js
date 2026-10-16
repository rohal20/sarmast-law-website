import { useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'
import { loadGsap, prefersReducedMotion, refreshScrollTrigger } from '../utils/gsap/loadGsap'

export function useGsapContext(scopeRef, setup, deps = []) {
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (reduceMotion || prefersReducedMotion() || !scopeRef.current) return undefined

    let ctx
    let cancelled = false
    let uiCleanup

    async function run() {
      const { gsap } = await loadGsap()
      if (cancelled || !scopeRef.current) return

      ctx = gsap.context(() => {
        uiCleanup = setup(gsap, scopeRef.current)
      }, scopeRef)

      // Debounced — Home mounts many contexts; refreshing each one snaps scroll on mobile.
      refreshScrollTrigger(160)
    }

    run()

    return () => {
      cancelled = true
      if (typeof uiCleanup === 'function') uiCleanup()
      if (ctx) ctx.revert()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion, scopeRef, ...deps])
}
