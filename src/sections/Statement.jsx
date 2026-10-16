import { useRef } from 'react'
import { siteConfig } from '../siteConfig'
import { useGsapContext } from '../hooks/useGsapContext'
import { splitWords } from '../utils/gsap/text'
import { isMobileViewport } from '../utils/gsap/effects'

const statement = siteConfig.statement

export default function Statement() {
  const sectionRef = useRef(null)

  useGsapContext(sectionRef, (gsap, root) => {
    const mobile = isMobileViewport()
    const eyebrow = root.querySelector('.gsap-statement-eyebrow')
    const leadEl = root.querySelector('.gsap-statement-lead')
    const foot = root.querySelector('.gsap-statement-foot')
    const bg = root.querySelector('.gsap-statement-bg')

    let words = []
    if (leadEl) {
      leadEl.querySelectorAll('.gsap-sw').forEach((part) => {
        words = words.concat(Array.from(splitWords(part)))
      })
    }

    if (eyebrow) {
      gsap.from(eyebrow, {
        opacity: 0,
        y: 16,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: eyebrow, start: 'top 88%', toggleActions: 'play none none none' },
      })
    }

    // Word-by-word illumination tied to natural scroll (no pin = no long scroll).
    if (words.length) {
      gsap.set(words, { opacity: 0.14 })
      gsap.to(words, {
        opacity: 1,
        ease: 'none',
        stagger: { each: mobile ? 0.02 : 0.045 },
        scrollTrigger: {
          trigger: leadEl,
          start: mobile ? 'top 82%' : 'top 74%',
          end: mobile ? 'bottom 62%' : 'center 44%',
          scrub: true,
        },
      })
    }

    if (foot) {
      gsap.from(foot, {
        opacity: 0,
        y: 16,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: foot, start: 'top 92%', toggleActions: 'play none none none' },
      })
    }

    if (bg) {
      gsap.fromTo(
        bg,
        { yPercent: 8 },
        {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
        }
      )
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="statement"
      className="section-surface scroll-anchor relative overflow-hidden flex items-center px-5 sm:px-8 md:px-16 py-20 sm:py-24 md:py-28 border-y border-[rgba(201,168,76,0.12)]"
    >
      <div
        className="gsap-statement-bg pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.05] select-none"
        aria-hidden="true"
      >
        <span className="font-display text-[42vw] leading-none text-[#C9A84C]">SLA</span>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <div className="gsap-statement-eyebrow flex items-center gap-3 mb-8 md:mb-12">
          <span className="block w-10 h-px" style={{ background: 'linear-gradient(90deg,#C9A84C,#E8D49A)' }} />
          <span className="text-[0.58rem] tracking-[0.28em] uppercase text-[#C9A84C]">{statement.eyebrow}</span>
        </div>

        <p className="gsap-statement-lead font-display font-light text-parchment leading-[1.22] tracking-[-0.01em] text-[1.85rem] sm:text-[2.6rem] md:text-[3.3rem] xl:text-[4rem]">
          <span className="gsap-sw">{statement.lead}</span>{' '}
          <em className="gsap-sw italic text-[#C9A84C]">{statement.accent}</em>
        </p>

        <div className="gsap-statement-foot mt-10 md:mt-14 flex items-start gap-4">
          <span className="mt-2.5 block w-12 h-px shrink-0 bg-[rgba(201,168,76,0.4)]" />
          <p className="text-[0.74rem] sm:text-[0.82rem] leading-[1.85] text-[#8A8270] max-w-xl">
            {statement.foot}
          </p>
        </div>
      </div>
    </section>
  )
}
