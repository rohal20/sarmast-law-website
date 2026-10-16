import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { loadGsap, prefersReducedMotion } from '../utils/gsap/loadGsap'
import { bindMagnetic } from '../utils/gsap/tilt'
import { isMobileViewport } from '../utils/gsap/effects'

/**
 * Site-wide magnetic pull on primary CTAs. Runs once per route after the page
 * transition settles. Desktop only; skips buttons already handled by
 * MagneticLink (data-magnetic="framer").
 */
export default function MagneticButtons() {
  const location = useLocation()

  useEffect(() => {
    if (prefersReducedMotion() || isMobileViewport()) return undefined

    let cleanup
    let cancelled = false
    const timer = setTimeout(() => {
      loadGsap().then(({ gsap }) => {
        if (cancelled) return
        const els = document.querySelectorAll(
          '.btn-gold:not([data-magnetic]), .btn-outline:not([data-magnetic])'
        )
        cleanup = bindMagnetic(gsap, els, { strength: 0.28 })
      })
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(timer)
      cleanup?.()
    }
  }, [location.pathname])

  return null
}
