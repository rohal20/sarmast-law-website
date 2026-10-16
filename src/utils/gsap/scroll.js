export function staggerScrollReveal(gsap, container, itemSelector, options = {}) {
  const items = container?.querySelectorAll(itemSelector)
  if (!items?.length) return null

  return gsap.from(items, {
    y: 48,
    opacity: 0,
    duration: 0.75,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: container,
      start: 'top 78%',
      toggleActions: 'play none none none',
      ...options.scrollTrigger,
    },
    ...options,
  })
}

export function scrubParallax(gsap, target, { trigger, y = 80, start = 'top bottom', end = 'bottom top' } = {}) {
  if (!target || !trigger) return null
  return gsap.to(target, {
    y,
    ease: 'none',
    scrollTrigger: {
      trigger,
      start,
      end,
      scrub: 1.2,
    },
  })
}

/** Fade / slide a target in, tied directly to scroll progress (scrubbed). */
export function scrubReveal(gsap, target, { trigger, y = 60, start = 'top 88%', end = 'top 48%' } = {}) {
  if (!target) return null
  return gsap.from(target, {
    y,
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: trigger || target,
      start,
      end,
      scrub: true,
    },
  })
}

/** Reveal an element by animating a clip-path inset wipe on scroll. */
export function clipWipe(gsap, target, { trigger, axis = 'x', start = 'top 82%' } = {}) {
  if (!target) return null
  const from = axis === 'y' ? 'inset(100% 0 0 0)' : 'inset(0 100% 0 0)'
  gsap.set(target, { clipPath: from, webkitClipPath: from })
  return gsap.to(target, {
    clipPath: 'inset(0% 0% 0% 0%)',
    webkitClipPath: 'inset(0% 0% 0% 0%)',
    duration: 1.15,
    ease: 'power3.inOut',
    scrollTrigger: {
      trigger: trigger || target,
      start,
      toggleActions: 'play none none none',
    },
  })
}

export function drawLineOnScroll(gsap, line, trigger, options = {}) {
  if (!line || !trigger) return null
  gsap.set(line, { scaleX: 0, transformOrigin: 'left center' })
  return gsap.to(line, {
    scaleX: 1,
    duration: 1,
    ease: 'power2.inOut',
    scrollTrigger: {
      trigger,
      start: 'top 75%',
      toggleActions: 'play none none none',
      ...options.scrollTrigger,
    },
    ...options,
  })
}
