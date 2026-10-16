/** Offset for fixed navbar + safe area when scrolling to anchors */
export function getScrollOffset(extra = 8) {
  const nav = document.querySelector('nav')
  const navHeight = nav?.getBoundingClientRect().height ?? 64
  return navHeight + extra
}

function fallbackScroll(el, offset) {
  const top = el.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
}

function updateHash(id) {
  if (window.location.hash === `#${id}`) return
  // replaceState avoids the browser's native hash-scroll jump
  window.history.replaceState(null, '', `#${id}`)
}

/**
 * Scroll to a section id, accounting for the fixed nav and GSAP pin spacers.
 * On mobile there are no pins — skip ScrollTrigger.refresh (it snaps scroll to top).
 */
export function scrollToSection(id) {
  const el = document.getElementById(id)
  if (!el) return

  const offset = getScrollOffset(8)
  const isMobileOrTablet = window.matchMedia('(max-width: 1023px)').matches

  if (isMobileOrTablet) {
    fallbackScroll(el, offset)
    updateHash(id)
    return
  }

  import('./gsap/loadGsap')
    .then(({ loadGsap }) => loadGsap())
    .then(({ ScrollTrigger }) => {
      // Measure without a full refresh — refresh mid-navigation jumps the page.
      const probe = ScrollTrigger.create({
        trigger: el,
        start: 'top top',
      })
      const start = typeof probe.start === 'number' ? probe.start : null
      probe.kill()

      if (start == null || Number.isNaN(start)) {
        fallbackScroll(el, offset)
        return
      }

      window.scrollTo({ top: Math.max(0, start - offset), behavior: 'smooth' })
    })
    .catch(() => fallbackScroll(el, offset))

  updateHash(id)
}

export function scrollToContact() {
  scrollToSection('contact')
}
