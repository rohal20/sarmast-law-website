import { useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { ShieldCheck, UserCheck, ClipboardCheck, Gavel, ArrowRight } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import HomeSectionLink from '../components/HomeSectionLink'
import { siteConfig } from '../siteConfig'
import { useGsapContext } from '../hooks/useGsapContext'
import { wrapRevealBlock, revealBlock, splitWords, revealWords } from '../utils/gsap/text'

const stepMeta = [
  { Icon: ShieldCheck, tag: 'Fully confidential' },
  { Icon: UserCheck, tag: 'Senior advocate assigned' },
  { Icon: ClipboardCheck, tag: 'Clear action plan' },
  { Icon: Gavel, tag: 'Representation in court' },
]

export default function ClientJourney() {
  const journey = siteConfig.clientJourney
  const steps = journey.steps
  const reduce = useReducedMotion()

  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const fillRef = useRef(null)

  const [active, setActive] = useState(reduce ? steps.length - 1 : -1)

  useGsapContext(sectionRef, (gsap, root) => {
    const sub = root.querySelector('.gsap-journey-sub')
    if (sub) {
      const inner = wrapRevealBlock(sub)
      revealBlock(gsap, inner, {
        scrollTrigger: { trigger: sub, start: 'top 85%', toggleActions: 'play none none none' },
      })
    }

    const stepEls = gsap.utils.toArray('.gsap-journey-step')
    stepEls.forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 60,
        rotateX: 8,
        transformPerspective: 900,
        transformOrigin: 'center top',
        duration: 0.9,
        ease: 'power4.out',
        scrollTrigger: { trigger: el, start: 'top 84%', toggleActions: 'play none none none' },
      })

      const title = el.querySelector('.gsap-journey-title')
      if (title) {
        const words = splitWords(title)
        revealWords(gsap, words, {
          stagger: 0.035,
          duration: 0.6,
          scrollTrigger: { trigger: el, start: 'top 82%', toggleActions: 'play none none none' },
        })
      }

      const tag = el.querySelector('.gsap-journey-tag')
      if (tag) {
        gsap.from(tag, {
          opacity: 0,
          x: -14,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' },
        })
      }
    })

    if (fillRef.current && trackRef.current) {
      gsap.fromTo(
        fillRef.current,
        { height: '0%' },
        {
          height: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: trackRef.current,
            start: 'top 60%',
            end: 'bottom 72%',
            scrub: 0.6,
            onUpdate: (self) => {
              const p = self.progress
              const next = p <= 0.02
                ? -1
                : Math.min(steps.length - 1, Math.floor(p * steps.length))
              // Bail when unchanged — avoids re-render storms during scrub.
              setActive((prev) => (prev === next ? prev : next))
            },
          },
        }
      )
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id={journey.sectionId || 'process'}
      className="scroll-anchor scroll-mt-20 section-surface py-14 sm:py-20 md:py-24 px-4 sm:px-8 md:px-16 border-y border-[rgba(201,168,76,0.12)]"
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <SectionHeader label={journey.label} index="05" className="!mb-0 flex-1">
          {journey.headline.before}{' '}
          <em className="italic text-[#C9A84C]">{journey.headline.accent}</em>
        </SectionHeader>

        <div className="hidden md:flex items-center gap-3 shrink-0 pb-2">
          <span className="font-display text-[2rem] leading-none text-[#C9A84C]">
            {String(Math.max(active, 0) + 1).padStart(2, '0')}
          </span>
          <span className="text-[0.55rem] tracking-[0.16em] uppercase text-[#8A8270] leading-tight max-w-[9rem]">
            <span className="text-[#8A8270]/60">of {String(steps.length).padStart(2, '0')} — </span>
            <span className="text-parchment">{steps[Math.max(active, 0)].title}</span>
          </span>
        </div>
      </div>

      <p className="gsap-journey-sub text-[0.8rem] leading-[1.85] text-[#8A8270] max-w-2xl mt-6 md:mt-8 mb-12">
        {journey.subtext}
      </p>

      <div ref={trackRef} className="relative">
        {/* Progress rail */}
        <div className="absolute left-[1.15rem] sm:left-[1.4rem] top-3 bottom-3 w-px bg-[rgba(201,168,76,0.14)]" aria-hidden="true">
          <div
            ref={fillRef}
            className="relative w-full origin-top"
            style={{
              height: reduce ? '100%' : '0%',
              background: 'linear-gradient(to bottom, #E8C97A, #C9A84C, #2CB9A8)',
              boxShadow: '0 0 12px rgba(201,168,76,0.5)',
            }}
          >
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#E8C97A] shadow-[0_0_16px_rgba(232,201,122,0.9)]" />
          </div>
        </div>

        <div className="flex flex-col gap-5 md:gap-7">
          {steps.map((step, i) => {
            const { Icon, tag } = stepMeta[i] || {}
            const isActive = i <= active
            const isCurrent = i === active

            return (
              <div
                key={step.title}
                className="gsap-journey-step group relative pl-[3.25rem] sm:pl-[4rem]"
              >
                {/* Node */}
                <div className="absolute left-[1.15rem] sm:left-[1.4rem] -translate-x-1/2 top-4 z-[2]">
                  {isCurrent && !reduce && (
                    <span className="absolute inset-0 rounded-full bg-[#C9A84C] opacity-40 animate-ping" />
                  )}
                  <div
                    className={`relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border transition-all duration-500
                      ${isActive
                        ? 'border-[#C9A84C] bg-[rgba(201,168,76,0.14)] text-[#E8C97A] shadow-[0_0_22px_rgba(201,168,76,0.4)]'
                        : 'border-[rgba(201,168,76,0.28)] bg-[#0A0A08] text-[#8A8270]'}
                      group-hover:border-[#C9A84C] group-hover:text-[#E8C97A] group-hover:scale-110`}
                  >
                    {Icon && <Icon size={16} strokeWidth={1.6} />}
                  </div>
                </div>

                {/* Card */}
                <div
                  className={`journey-card hover-luxe-card hover-bracket-corners relative liquid-glass border p-5 sm:p-6 transition-[transform,border-color,box-shadow] duration-500 will-change-transform
                    hover:-translate-y-1.5
                    ${isCurrent
                      ? 'border-[rgba(201,168,76,0.5)] shadow-[0_20px_60px_rgba(0,0,0,0.4)]'
                      : 'border-[rgba(201,168,76,0.18)]'}`}
                >
                  <span className="corner corner-tl" aria-hidden="true" />
                  <span className="corner corner-br" aria-hidden="true" />

                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-[1.9rem] sm:text-[2.2rem] leading-none text-[#C9A84C]/30 group-hover:text-[#C9A84C]/55 transition-colors">
                        0{i + 1}
                      </span>
                      <span className="text-[0.5rem] tracking-[0.2em] uppercase text-[#8A8270] md:hidden">
                        Step 0{i + 1}
                      </span>
                    </div>
                    <span className="text-[0.52rem] tracking-[0.2em] uppercase px-2.5 py-1 border border-[rgba(201,168,76,0.22)] text-[#C9A84C] whitespace-nowrap">
                      {step.time}
                    </span>
                  </div>

                  <h3 className="gsap-journey-title font-display text-[1.25rem] sm:text-[1.45rem] text-parchment group-hover:text-[#E8D49A] transition-colors">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[0.76rem] leading-[1.85] text-[#8A8270] max-w-2xl">
                    {step.desc}
                  </p>

                  {tag && (
                    <div className="gsap-journey-tag mt-4 inline-flex items-center gap-2 text-[0.58rem] tracking-[0.16em] uppercase text-[#C9A84C]">
                      <span
                        className="w-5 h-px transition-all duration-500 group-hover:w-8"
                        style={{ background: 'linear-gradient(90deg, #C9A84C, #2CB9A8)' }}
                      />
                      {tag}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-10 sm:mt-12 flex justify-center">
        <HomeSectionLink
          section="contact"
          className="group inline-flex items-center gap-3 min-h-[44px] text-[0.62rem] tracking-[0.2em] uppercase text-[#8A8270] no-underline hover:text-[#C9A84C] transition-colors"
        >
          <span className="w-8 h-px bg-[#8A8270]/40 group-hover:bg-[#C9A84C] transition-colors" />
          Start your confidential enquiry
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          <span className="w-8 h-px bg-[#8A8270]/40 group-hover:bg-[#C9A84C] transition-colors" />
        </HomeSectionLink>
      </div>
    </section>
  )
}
