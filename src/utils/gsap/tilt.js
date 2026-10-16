import { isMobileViewport } from './effects'

/** Disable pointer effects on small screens and touch / non-hover devices. */
export function tiltDisabled() {
  if (typeof window === 'undefined') return true
  if (isMobileViewport()) return true
  return window.matchMedia('(hover: none), (pointer: coarse)').matches
}

/**
 * Pointer-tracked 3D tilt. Uses gsap.quickTo so updates never touch React state
 * or trigger re-renders. Desktop only; returns a cleanup fn.
 */
export function pointerTilt(gsap, el, { max = 9, scale = 1.03 } = {}) {
  if (!el || tiltDisabled()) return () => {}

  gsap.set(el, { transformPerspective: 900, transformStyle: 'preserve-3d' })
  const rotX = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3.out' })
  const rotY = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3.out' })
  const scaleTo = gsap.quickTo(el, 'scale', { duration: 0.5, ease: 'power3.out' })

  const onMove = (e) => {
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    rotY(px * max * 2)
    rotX(-py * max * 2)
  }
  const onEnter = () => scaleTo(scale)
  const onLeave = () => {
    rotX(0)
    rotY(0)
    scaleTo(1)
  }

  el.addEventListener('pointermove', onMove)
  el.addEventListener('pointerenter', onEnter)
  el.addEventListener('pointerleave', onLeave)

  return () => {
    el.removeEventListener('pointermove', onMove)
    el.removeEventListener('pointerenter', onEnter)
    el.removeEventListener('pointerleave', onLeave)
    gsap.set(el, { clearProps: 'transform,transformPerspective,transformStyle' })
  }
}

export function bindPointerTilt(gsap, els, opts) {
  if (tiltDisabled()) return () => {}
  const cleanups = Array.from(els || []).map((el) => pointerTilt(gsap, el, opts))
  return () => cleanups.forEach((fn) => fn())
}

/** Magnetic pull toward the cursor for buttons / small targets. Desktop only. */
export function magnetize(gsap, el, { strength = 0.4 } = {}) {
  if (!el || tiltDisabled()) return () => {}

  const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' })
  const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' })

  const onMove = (e) => {
    const r = el.getBoundingClientRect()
    xTo((e.clientX - (r.left + r.width / 2)) * strength)
    yTo((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const onLeave = () => {
    xTo(0)
    yTo(0)
  }

  el.addEventListener('pointermove', onMove)
  el.addEventListener('pointerleave', onLeave)

  return () => {
    el.removeEventListener('pointermove', onMove)
    el.removeEventListener('pointerleave', onLeave)
    gsap.set(el, { clearProps: 'transform' })
  }
}

export function bindMagnetic(gsap, els, opts) {
  if (tiltDisabled()) return () => {}
  const cleanups = Array.from(els || []).map((el) => magnetize(gsap, el, opts))
  return () => cleanups.forEach((fn) => fn())
}
