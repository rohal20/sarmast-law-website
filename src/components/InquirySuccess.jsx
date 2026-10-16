import { useRef } from 'react'
import { useGsapContext } from '../hooks/useGsapContext'
import { prefersReducedMotion } from '../utils/gsap/loadGsap'

/** Compact success notice — stays inside the form card, no oversized ceremony. */
export default function InquirySuccess({ email, onReset }) {
  const rootRef = useRef(null)

  useGsapContext(rootRef, (gsap, root) => {
    if (prefersReducedMotion()) {
      gsap.set(root.children, { clearProps: 'all', opacity: 1 })
      return
    }

    const line = root.querySelector('.gsap-ok-line')
    const items = root.querySelectorAll('.gsap-ok-item')

    gsap.set(line, { scaleX: 0, transformOrigin: 'left center' })
    gsap.set(items, { opacity: 0, y: 8 })

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
    tl.to(line, { scaleX: 1, duration: 0.55 }, 0)
    tl.to(items, { opacity: 1, y: 0, duration: 0.4, stagger: 0.07 }, 0.12)
  }, [])

  return (
    <div ref={rootRef} className="py-2">
      <div
        className="gsap-ok-line h-px w-full mb-5"
        style={{ background: 'linear-gradient(90deg, #C9A84C, transparent)' }}
        aria-hidden="true"
      />

      <div className="gsap-ok-item flex items-center gap-3 mb-3">
        <span className="shrink-0 w-7 h-7 border border-[rgba(201,168,76,0.45)] flex items-center justify-center text-[#E8C97A]">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6.2 L4.6 8.8 L10 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div className="min-w-0 text-left">
          <p className="font-display text-[1.35rem] font-light text-parchment leading-none">Thank you</p>
          <p className="mt-1 text-[0.55rem] tracking-[0.18em] uppercase text-[#C9A84C]">Enquiry received</p>
        </div>
      </div>

      <p className="gsap-ok-item text-left text-[0.72rem] leading-[1.75] text-[#8A8270] mb-2">
        Our team will respond within 24 hours.
      </p>

      <p className="gsap-ok-item text-left text-[0.62rem] leading-[1.6] text-[#A89F8C] break-all">
        Confirmation sent to <span className="text-[#E8C97A]">{email}</span>
      </p>

      <button
        type="button"
        onClick={onReset}
        className="gsap-ok-item mt-5 text-left text-[0.55rem] tracking-[0.18em] uppercase text-[#C9A84C] bg-transparent border-0 p-0 cursor-pointer hover:text-[#E8C97A] transition-colors"
      >
        Send another enquiry →
      </button>
    </div>
  )
}
