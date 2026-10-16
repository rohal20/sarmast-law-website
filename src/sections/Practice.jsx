import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import HomeSectionLink from '../components/HomeSectionLink'
import SectionHeader from '../components/SectionHeader'
import LegalMatterFinder from '../components/LegalMatterFinder'
import PracticeAmbient from '../components/PracticeAmbient'
import { siteConfig } from '../siteConfig'
import { AnimatePresence, motion } from 'framer-motion'
import { useGsapContext } from '../hooks/useGsapContext'
import { wrapRevealBlock, revealBlock } from '../utils/gsap/text'
import { scrubParallax } from '../utils/gsap/scroll'
import { clipStaggerReveal, isMobileViewport } from '../utils/gsap/effects'
import { scrubSpin } from '../utils/gsap/pin'
import { bindButtonPress } from '../utils/gsap/ui'

const practices = siteConfig.practiceAreas
const COLS = 3

function formatModalTitle(title) {
  const words = title.trim().split(' ')
  if (words.length <= 1) return { before: '', accent: title }
  const accent = words.pop()
  return { before: words.join(' '), accent }
}

function PracticeModal({ practice, onClose }) {
  const backdropReadyRef = useRef(false)

  useEffect(() => {
    backdropReadyRef.current = false
    const frame = requestAnimationFrame(() => {
      backdropReadyRef.current = true
    })

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  const lm = practice.learnMore || {}
  const { before, accent } = formatModalTitle(practice.title)

  return (
    <>
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 z-0 bg-black/90"
        onClick={() => {
          if (!backdropReadyRef.current) return
          onClose()
        }}
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`practice-modal-title-${practice.num}`}
        className="relative z-10 w-full max-w-[680px] max-h-[92dvh] sm:max-h-[90vh] flex flex-col border border-[rgba(201,168,76,0.3)] bg-[#0D0C0A] overflow-hidden rounded-t-xl sm:rounded-none"
        style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}
        initial={{ y: 28 }}
        animate={{ y: 0 }}
        exit={{ y: 28 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-0.5 shrink-0" style={{ background: 'linear-gradient(90deg, #C9A84C, #E8C97A, #A07C30)' }} />

        <div className="flex-1 min-h-0 overflow-y-auto px-6 sm:px-[30px] pt-6 sm:pt-[26px] pb-4">
          <div className="flex items-center gap-2 text-[0.62rem] tracking-[0.26em] uppercase text-[#C9A84C] mb-2.5">
            <span className="block w-[22px] h-px bg-[#C9A84C]" />
            Practice Area
          </div>

          <h3
            id={`practice-modal-title-${practice.num}`}
            className="font-display text-[1.5rem] sm:text-[1.75rem] font-light leading-[1.1] text-parchment mb-2.5"
          >
            {before && <>{before} </>}
            <em className="italic text-[#C9A84C]">{accent}</em>
          </h3>

          <p className="text-[0.75rem] leading-[1.9] text-[#8A8270] mb-5">
            {lm.description || practice.desc}
          </p>

          <div className="grid sm:grid-cols-2 gap-2.5">
            <div className="border border-[rgba(201,168,76,0.2)] px-4 py-4">
              <p className="text-[0.56rem] tracking-[0.22em] uppercase text-[#C9A84C] mb-3">Highlights</p>
              <ul className="space-y-2">
                {(lm.highlights || []).map((h) => (
                  <li key={h} className="flex items-start gap-2 text-[0.69rem] leading-[1.65] text-[#8A8270]">
                    <span className="w-[5px] h-[5px] rounded-full shrink-0 bg-[#C9A84C] mt-[5px]" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-[rgba(201,168,76,0.2)] px-4 py-4">
              <p className="text-[0.56rem] tracking-[0.22em] uppercase text-[#C9A84C] mb-3">What You Get</p>
              <ul className="space-y-2">
                {(lm.whatYouGet || []).map((h) => (
                  <li key={h} className="flex items-start gap-2 text-[0.69rem] leading-[1.65] text-[#8A8270]">
                    <span className="w-[5px] h-[5px] rounded-full shrink-0 bg-[#C9A84C] mt-[5px]" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sticky footer - CTA always visible while scrolling */}
        <div className="relative shrink-0 border-t border-[rgba(201,168,76,0.22)] bg-[rgba(13,12,10,0.82)] px-5 sm:px-[30px] py-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md">
          <div className="pointer-events-none absolute -top-10 left-0 right-0 h-10 bg-gradient-to-t from-[#0D0C0A] to-transparent" />
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <p className="text-[0.72rem] sm:text-[0.65rem] text-[#8A8270] leading-relaxed">
              Interested in <span className="text-parchment">{practice.title}</span>? Speak with our team.
            </p>
            <div className="flex flex-wrap gap-2.5 shrink-0">
              <HomeSectionLink
                section="contact"
                onClick={onClose}
                className="inline-flex items-center justify-center min-h-[44px] text-[0.7rem] sm:text-[0.62rem] tracking-[0.16em] uppercase font-semibold px-5 py-3 sm:py-2.5 bg-[#C9A84C] text-[#0A0A08] no-underline hover:bg-[#E8C97A] transition-colors flex-1 sm:flex-none"
              >
                Book a Consultation
              </HomeSectionLink>
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] text-[0.7rem] sm:text-[0.62rem] tracking-[0.16em] uppercase px-5 py-3 sm:py-2.5 bg-transparent text-parchment border border-parchment/30 hover:border-parchment/70 transition-colors cursor-pointer flex-1 sm:flex-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

function PracticeCard({ practice, index, onLearnMore, highlighted }) {
  const [hovered, setHovered] = useState(false)
  const lastRowStart = Math.floor((practices.length - 1) / COLS) * COLS
  const isLastCol = (index + 1) % COLS === 0
  const isLastRow = index >= lastRowStart
  const isLit = hovered || highlighted

  const openPractice = (e) => {
    e.stopPropagation()
    onLearnMore(practice)
  }

  return (
    <div className="gsap-practice-card h-full">
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={openPractice}
      onKeyDown={(e) => e.key === 'Enter' && openPractice(e)}
      role="button"
      tabIndex={0}
      className={`practice-card group hover-luxe-card hover-bracket-corners relative h-full p-5 md:px-5 md:py-[22px] border border-[rgba(201,168,76,0.18)] active:scale-[0.99] transition-transform
        md:border-0 md:border-b md:border-r md:border-[rgba(201,168,76,0.18)]
        ${isLastCol ? 'md:!border-r-0' : ''}
        ${isLastRow ? 'md:!border-b-0' : ''}
        cursor-pointer
        md:[transform-style:preserve-3d]
        ${isLit ? 'bg-[rgba(201,168,76,0.06)] md:-translate-y-1.5 md:[transform:perspective(1000px)_rotateX(2deg)_rotateY(-2deg)]' : 'bg-[#0A0A08] md:bg-transparent'}
        ${highlighted ? 'ring-1 ring-inset ring-[rgba(201,168,76,0.45)] shadow-[0_0_28px_rgba(201,168,76,0.08)]' : ''}`}
    >
      <span className="corner corner-tl" aria-hidden="true" />
      <span className="corner corner-br" aria-hidden="true" />

      <div className={`absolute left-0 top-4 bottom-4 w-0.5 transition-all duration-500 ${isLit ? 'opacity-100 shadow-[0_0_12px_#C9A84C]' : 'opacity-0'}`}
        style={{ background: 'linear-gradient(180deg, transparent, #C9A84C, #2CB9A8, transparent)' }}
      />

      <div
        className={`font-display text-[2rem] md:text-[2.25rem] font-light leading-none mb-2 select-none transition-all duration-300
          text-transparent bg-clip-text
          ${hovered
            ? 'bg-gradient-to-br from-[#E8C97A] via-[#C9A84C] to-[#C9A84C]/45'
            : highlighted
              ? 'bg-gradient-to-br from-[#E8C97A]/80 via-[#C9A84C]/70 to-[#C9A84C]/40'
              : 'bg-gradient-to-br from-[#C9A84C]/55 via-[#C9A84C]/38 to-[#C9A84C]/22'}`}
      >
        {practice.num}
      </div>
      <h3 className="text-[0.72rem] sm:text-[0.66rem] tracking-[0.12em] sm:tracking-[0.14em] uppercase font-bold text-parchment mb-1.5 flex items-center gap-1.5 flex-wrap leading-snug">
        {practice.title}
        {practice.core && (
          <span className="text-[0.5rem] tracking-[0.1em] font-normal px-1.5 py-0.5 bg-[rgba(201,168,76,0.12)] text-[#C9A84C] border border-[rgba(201,168,76,0.35)] whitespace-nowrap">
            Core Practice
          </span>
        )}
      </h3>
      <p className="text-[0.78rem] sm:text-[0.69rem] leading-[1.75] text-[#8A8270]">
        {practice.desc}
      </p>

      <div
        className={`relative z-[3] mt-3 flex items-center gap-2 text-[#C9A84C] text-[0.65rem] sm:text-[0.56rem] tracking-[0.14em] sm:tracking-[0.18em] uppercase transition-all duration-500 hover-read-more
          ${isLit ? 'opacity-100 translate-x-0' : 'opacity-70 md:opacity-0 md:-translate-x-2'}`}
      >
        <span className="w-5 h-px hidden sm:block transition-all duration-400 group-hover:w-8"
          style={{ background: 'linear-gradient(90deg, #C9A84C, #2CB9A8)' }}
        />
        <span className="sm:hidden text-[#8A8270]/60 group-hover:text-[#C9A84C] transition-colors">Tap for details</span>
        <span className="hidden sm:inline-flex items-center gap-1.5">
          Read More
          <span className="read-arrow">→</span>
        </span>
      </div>
    </div>
    </div>
  )
}

export default function Practice() {
  const [selected, setSelected] = useState(null)
  const [highlighted, setHighlighted] = useState('')
  const sectionRef = useRef(null)

  useGsapContext(sectionRef, (gsap, root) => {
    const intro = root.querySelector('.gsap-practice-intro')
    if (intro) {
      const inner = wrapRevealBlock(intro)
      revealBlock(gsap, inner, {
        scrollTrigger: { trigger: intro, start: 'top 85%', toggleActions: 'play none none none' },
      })
    }

    const grid = root.querySelector('.gsap-practice-grid')
    if (grid) clipStaggerReveal(gsap, grid, '.gsap-practice-card')

    if (!isMobileViewport()) {
      root.querySelectorAll('.gsap-practice-orb').forEach((orb, i) => {
        scrubParallax(gsap, orb, {
          trigger: root,
          y: 50 + i * 35,
          start: 'top bottom',
          end: 'bottom top',
        })
        scrubSpin(gsap, orb, root, { rotation: 100 + i * 60, scale: 1.08 })
      })
    }

    const btnCleanup = bindButtonPress(gsap, root.querySelectorAll('.gsap-pressable, .btn-gold, .btn-outline'))

    return () => {
      btnCleanup?.()
    }
  }, [])

  return (
    <section ref={sectionRef} id="practice" className="relative scroll-anchor py-14 sm:py-20 md:py-24 px-4 sm:px-8 md:px-16 overflow-hidden">
      <PracticeAmbient />

      <div className="relative z-[1]">
        <SectionHeader label="What We Do" index="01">
          Areas of <em className="italic text-[#C9A84C]">Legal Practice</em>
        </SectionHeader>

        <p className="gsap-practice-intro text-[0.81rem] leading-[1.7] text-[#8A8270] max-w-[540px] -mt-6 md:-mt-8 mb-8 md:mb-7">
          {siteConfig.practiceIntro}
        </p>

        <LegalMatterFinder
          onHighlight={setHighlighted}
          onLearnMore={setSelected}
        />

        <div className="section-panel p-4 sm:p-5 md:p-0 md:border md:border-[rgba(201,168,76,0.2)]">
          <div className="gsap-practice-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-0 w-full min-w-0">
            {practices.map((p, i) => (
              <PracticeCard
                key={p.num}
                practice={p}
                index={i}
                onLearnMore={setSelected}
                highlighted={highlighted === p.title}
              />
            ))}
          </div>
        </div>
      </div>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.num}
              className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <PracticeModal
                practice={selected}
                onClose={() => setSelected(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  )
}
