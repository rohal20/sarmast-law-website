import { useRef } from 'react'
import { useGsapContext } from '../hooks/useGsapContext'
import { splitChars, revealChars, wrapRevealBlock, revealBlock } from '../utils/gsap/text'
import { drawLineOnScroll } from '../utils/gsap/scroll'
import { wrapAccentPill, revealAccentPill } from '../utils/gsap/effects'

function HeaderBody({ label, children, index }) {
  return (
    <div className="relative">
      {index && (
        <span
          className="gsap-header-index absolute -top-4 sm:-top-6 md:-top-8 left-0 font-display font-light leading-none select-none pointer-events-none text-[#C9A84C]/[0.07]"
          style={{ fontSize: 'clamp(3.5rem, 14vw, 8rem)' }}
          aria-hidden="true"
        >
          {index}
        </span>
      )}
      <div className="relative">
        <div className="section-label gsap-header-label">{label}</div>
        <h2 className="gsap-header-title font-display text-[2.2rem] sm:text-[2.6rem] md:text-[3.5rem] font-light leading-[1.08] tracking-[-0.02em]">
          {children}
        </h2>
      </div>
    </div>
  )
}

export default function SectionHeader({ label, children, index, className = '' }) {
  const ref = useRef(null)

  useGsapContext(ref, (gsap, root) => {
    const labelEl = root.querySelector('.gsap-header-label')
    const titleEl = root.querySelector('.gsap-header-title')
    const lineEl = root.querySelector('.gsap-header-line')
    const indexEl = root.querySelector('.gsap-header-index')

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    })

    if (indexEl) {
      tl.from(indexEl, { opacity: 0, y: 30, duration: 1.1, ease: 'power2.out' }, 0)
    }

    if (labelEl) {
      const inner = wrapRevealBlock(labelEl)
      tl.add(revealBlock(gsap, inner, { y: 16, duration: 0.6 }), 0.05)
    }

    if (titleEl) {
      titleEl.querySelectorAll('em').forEach((em) => wrapAccentPill(em))
      const chars = splitChars(titleEl)
      tl.add(revealChars(gsap, chars, { stagger: 0.02, duration: 0.85 }), 0.12)

      titleEl.querySelectorAll('.gsap-accent-pill-bg').forEach((pillBg) => {
        tl.add(revealAccentPill(gsap, pillBg, { duration: 0.75, ease: 'power3.out' }), 0.5)
      })
    }

    if (lineEl) drawLineOnScroll(gsap, lineEl, root)
  // label/index only — never depend on `children` (new element every parent render).
  // Re-splitting text mid-scroll changes document height and snaps the page to top.
  }, [label, index])

  return (
    <div ref={ref} className={`mb-10 md:mb-14 ${className}`}>
      <HeaderBody label={label} index={index}>{children}</HeaderBody>
      <div
        className="gsap-header-line mt-6 h-px max-w-[140px] origin-left"
        style={{ background: 'linear-gradient(90deg, #C9A84C, #2CB9A8, transparent)' }}
      />
    </div>
  )
}
