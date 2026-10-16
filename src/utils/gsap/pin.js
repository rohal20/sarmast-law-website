/** Pinned section with scroll-scrubbed timeline (GSAP ScrollTrigger showcase pattern). */
export function scrubTimeline(gsap, trigger, setup, options = {}) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger,
      start: options.start || 'top top',
      end: options.end || 'bottom bottom',
      scrub: options.scrub ?? 1.2,
      ...options.scrollTrigger,
    },
  })

  setup(tl, gsap)
  return tl
}

/** Pin an element for the duration of a trigger's scroll span. */
export function pinElement({ trigger, pin, start, end, pinSpacing = true, scrub }) {
  if (!trigger || !pin) return null

  return import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
    return ScrollTrigger.create({
      trigger,
      pin,
      start: start || 'top top',
      end: end || 'bottom bottom',
      pinSpacing,
      scrub,
      anticipatePin: 1,
    })
  })
}

/** Horizontal scroll driven by vertical scroll (scrub). */
export function horizontalScrub(gsap, { wrap, track, trigger, distance }) {
  if (!wrap || !track || !trigger) return null

  const getDistance = () => {
    if (typeof distance === 'number') return distance
    return Math.max(0, track.scrollWidth - wrap.clientWidth)
  }

  return gsap.to(track, {
    x: () => -getDistance(),
    ease: 'none',
    scrollTrigger: {
      trigger,
      start: 'top top',
      end: () => `+=${getDistance() * 1.35}`,
      scrub: 1.1,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  })
}

/** Split children into scrubbed opacity / y phases. */
export function scrubPhases(gsap, items, trigger, options = {}) {
  if (!items?.length) return null

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger,
      start: options.start || 'top top',
      end: options.end || 'bottom bottom',
      scrub: options.scrub ?? 1.2,
    },
  })

  const segment = 1 / items.length
  items.forEach((item, i) => {
    const enter = i * segment
    const peak = enter + segment * 0.35
    const exit = (i + 1) * segment

    tl.fromTo(
      item,
      { opacity: 0, y: 48, scale: 0.96, filter: 'blur(8px)' },
      { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: segment * 0.4, ease: 'power2.out' },
      enter
    )
    if (i < items.length - 1) {
      tl.to(
        item,
        { opacity: 0, y: -36, scale: 0.98, filter: 'blur(6px)', duration: segment * 0.35, ease: 'power2.in' },
        exit - segment * 0.25
      )
    }
  })

  return tl
}

/** Continuous rotation / scale tied to scroll progress. */
export function scrubSpin(gsap, target, trigger, { rotation = 180, scale = 1.15 } = {}) {
  if (!target || !trigger) return null
  return gsap.to(target, {
    rotation,
    scale,
    ease: 'none',
    scrollTrigger: {
      trigger,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
    },
  })
}

/** Draw a line on scroll scrub (horizontal or vertical). */
export function scrubDrawLine(gsap, line, trigger, options = {}) {
  if (!line || !trigger) return null
  const axis = options.axis || 'x'
  const prop = axis === 'y' ? 'scaleY' : 'scaleX'
  const origin = axis === 'y' ? 'top center' : 'left center'

  gsap.set(line, { [prop]: 0, transformOrigin: origin })
  return gsap.to(line, {
    [prop]: 1,
    ease: 'none',
    scrollTrigger: {
      trigger,
      start: options.start || 'top 70%',
      end: options.end || 'top 30%',
      scrub: 1,
      ...options.scrollTrigger,
    },
  })
}
