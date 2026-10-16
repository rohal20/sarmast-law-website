import { useRef } from 'react'
import { siteConfig } from '../siteConfig'
import { useGsapContext } from '../hooks/useGsapContext'
import { scrubShift } from '../utils/gsap/effects'

const items = siteConfig.ticker

export default function Ticker() {
  const doubled = [...items, ...items]
  const ref = useRef(null)

  useGsapContext(ref, (gsap, root) => {
    const track = root.querySelector('.gsap-ticker-track')
    const glow = root.querySelector('.gsap-ticker-glow')

    if (glow) {
      gsap.from(glow, {
        opacity: 0,
        scaleX: 0.4,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: { trigger: root, start: 'top 92%', toggleActions: 'play none none none' },
      })
    }

    if (track) scrubShift(gsap, track, root, { x: -48 })

    root.querySelectorAll('.gsap-ticker-item').forEach((item, i) => {
      gsap.from(item, {
        opacity: 0,
        y: 8,
        duration: 0.5,
        delay: i * 0.03,
        ease: 'power2.out',
        scrollTrigger: { trigger: root, start: 'top 90%', toggleActions: 'play none none none' },
      })
    })
  }, [])

  return (
    <div ref={ref} className="relative border-y border-[rgba(201,168,76,0.2)] overflow-hidden py-3.5 sm:py-4 section-surface w-full max-w-full">
      <div
        className="gsap-ticker-glow pointer-events-none absolute inset-0 bg-gradient-to-r from-[rgba(201,168,76,0.04)] via-transparent to-[rgba(44,185,168,0.04)] origin-center"
      />
      <div className="overflow-hidden w-full max-w-full">
        <div
          className="gsap-ticker-track flex whitespace-nowrap animate-ticker w-max max-w-none will-change-transform"
          style={{ animationDuration: '38s' }}
        >
        {doubled.map((item, i) => (
          <span key={i} className="gsap-ticker-item flex items-center">
            <span className="text-[0.58rem] sm:text-[0.6rem] tracking-[0.2em] sm:tracking-[0.24em] uppercase text-[#8A8270] mx-4 sm:mx-6">
              {item}
            </span>
            <span className="text-[#C9A84C] text-xs opacity-70">·</span>
          </span>
        ))}
        </div>
      </div>
    </div>
  )
}
