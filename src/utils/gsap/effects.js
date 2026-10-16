/** True on phone-sized viewports. Used to skip heavy decorative scroll effects on mobile. */
export function isMobileViewport() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(max-width: 767px)').matches
}

/** GSAP-site style expanding highlight behind accent words. */
export function wrapAccentPill(em, className = 'gsap-accent-pill') {
  if (!em || em.dataset.gsapAccent === 'true') {
    return em?.querySelector(`.${className}-bg`) || null
  }

  const text = em.textContent?.trim() || ''
  em.dataset.gsapAccent = 'true'
  em.innerHTML = `
    <span class="${className}" style="position:relative;display:inline-block;padding:0 0.12em">
      <span class="${className}-bg" style="position:absolute;inset:-0.08em -0.22em;background:rgba(201,168,76,0.14);border:1px solid rgba(201,168,76,0.22);transform:scaleX(0);transform-origin:left center;border-radius:2px;z-index:0"></span>
      <span class="${className}-text" style="position:relative;z-index:1">${text}</span>
    </span>
  `
  return em.querySelector(`.${className}-bg`)
}

export function revealAccentPill(gsap, bgEl, options = {}) {
  if (!bgEl) return null
  return gsap.to(bgEl, {
    scaleX: 1,
    duration: 0.85,
    ease: 'power3.out',
    ...options,
  })
}

/** Dramatic 3D card entrance on scroll. */
export function clipStaggerReveal(gsap, container, itemSelector, options = {}) {
  const items = container?.querySelectorAll(itemSelector)
  if (!items?.length) return null

  return gsap.from(items, {
    y: 64,
    opacity: 0,
    rotateX: 10,
    transformPerspective: 900,
    transformOrigin: 'center top',
    duration: 0.9,
    stagger: 0.11,
    ease: 'power4.out',
    scrollTrigger: {
      trigger: container,
      start: 'top 76%',
      toggleActions: 'play none none none',
      ...options.scrollTrigger,
    },
    ...options,
  })
}

/** Gentle infinite float for ambient shapes. */
export function floatLoop(gsap, targets, { y = 18, rotate = 8, duration = 5 } = {}) {
  if (!targets?.length) return

  targets.forEach((target, i) => {
    gsap.to(target, {
      y: `+=${y}`,
      duration: duration + i * 0.45,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
    gsap.to(target, {
      rotation: `+=${rotate * (i % 2 === 0 ? 1 : -1)}`,
      duration: duration * 1.35 + i * 0.3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
  })
}

/** Scroll-scrubbed parallax for multiple fixed layers. */
export function parallaxOnScroll(gsap, pairs, options = {}) {
  pairs.forEach(({ el, y = 60 }, i) => {
    if (!el) return
    gsap.to(el, {
      y,
      ease: 'none',
      scrollTrigger: {
        trigger: options.trigger || document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.1 + i * 0.15,
        ...options.scrollTrigger,
      },
    })
  })
}

/** Count up numeric stat values on scroll. */
export function counterReveal(gsap, el, options = {}) {
  if (!el) return null

  const raw = el.textContent?.trim() || ''
  const match = raw.match(/^(\d+)(.*)$/)
  if (!match) return null

  const end = parseInt(match[1], 10)
  const suffix = match[2] || ''
  const counter = { value: 0 }

  return gsap.to(counter, {
    value: end,
    duration: 1.4,
    ease: 'power2.out',
    snap: { value: 1 },
    onUpdate: () => {
      el.textContent = `${Math.round(counter.value)}${suffix}`
    },
    scrollTrigger: {
      trigger: el,
      start: 'top 88%',
      toggleActions: 'play none none none',
      ...options.scrollTrigger,
    },
    ...options,
  })
}

/** Horizontal scrub shift for marquee-style elements. */
export function scrubShift(gsap, target, trigger, { x = -80 } = {}) {
  if (!target || !trigger) return null
  return gsap.to(target, {
    x,
    ease: 'none',
    scrollTrigger: {
      trigger,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.4,
    },
  })
}
