/** Split visible text into word spans for stagger reveals (no SplitText plugin needed). */
export function splitWords(element, className = 'gsap-word') {
  if (!element || element.dataset.gsapSplit === 'true') {
    return element?.querySelectorAll(`.${className}-inner`) || []
  }

  const original = element.textContent?.trim() || ''
  if (!original) return []

  element.setAttribute('aria-label', original)
  element.dataset.gsapSplit = 'true'

  const parts = original.split(/(\s+)/)
  element.innerHTML = parts.map((part) => {
    if (!part.trim()) return part
    return `<span class="${className}" style="display:inline-block;overflow:hidden;vertical-align:top"><span class="${className}-inner" style="display:inline-block;will-change:transform">${part}</span></span>`
  }).join('')

  return element.querySelectorAll(`.${className}-inner`)
}

/**
 * Split visible text into per-character masked spans, preserving nested elements
 * (e.g. an <em> accent) so the reveal can run character-by-character across the
 * whole headline. Returns the inner char spans for animation.
 */
export function splitChars(element, className = 'gsap-char') {
  if (!element || element.dataset.gsapChars === 'true') {
    return element?.querySelectorAll(`.${className}-inner`) || []
  }

  const full = element.textContent?.trim() || ''
  if (!full) return []
  element.dataset.gsapChars = 'true'
  element.setAttribute('aria-label', full)

  const wrapTextNode = (textNode) => {
    const text = textNode.textContent || ''
    if (!text) return
    const frag = document.createDocumentFragment()
    for (const ch of text) {
      if (ch === ' ') {
        // Regular space (not nbsp) so multi-word titles still wrap between words.
        frag.appendChild(document.createTextNode(' '))
        continue
      }
      const outer = document.createElement('span')
      outer.className = className
      outer.setAttribute('aria-hidden', 'true')
      outer.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top'
      const inner = document.createElement('span')
      inner.className = `${className}-inner`
      inner.style.cssText = 'display:inline-block;will-change:transform'
      inner.textContent = ch
      outer.appendChild(inner)
      frag.appendChild(outer)
    }
    textNode.parentNode.replaceChild(frag, textNode)
  }

  const walk = (node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === 3) wrapTextNode(child)
      else if (child.nodeType === 1) walk(child)
    })
  }

  walk(element)
  return element.querySelectorAll(`.${className}-inner`)
}

export function revealChars(gsap, targets, options = {}) {
  if (!targets?.length) return null
  return gsap.from(targets, {
    yPercent: 120,
    opacity: 0,
    rotateX: -75,
    transformPerspective: 600,
    transformOrigin: 'center bottom',
    duration: 0.9,
    stagger: 0.022,
    ease: 'power4.out',
    ...options,
  })
}

/** Masked line reveal for paragraphs and subtext. */
export function wrapRevealBlock(element, className = 'gsap-block') {
  if (!element || element.dataset.gsapWrap === 'true') {
    return element?.querySelector(`.${className}-inner`) || null
  }

  const html = element.innerHTML
  element.dataset.gsapWrap = 'true'
  element.innerHTML = `<span class="${className}" style="display:block;overflow:hidden"><span class="${className}-inner" style="display:block;will-change:transform">${html}</span></span>`
  return element.querySelector(`.${className}-inner`)
}

export function revealWords(gsap, targets, options = {}) {
  if (!targets?.length) return null
  return gsap.from(targets, {
    yPercent: 110,
    opacity: 0,
    duration: 0.9,
    stagger: 0.045,
    ease: 'power4.out',
    ...options,
  })
}

export function revealBlock(gsap, target, options = {}) {
  if (!target) return null
  return gsap.from(target, {
    y: 28,
    opacity: 0,
    duration: 0.85,
    ease: 'power3.out',
    ...options,
  })
}
