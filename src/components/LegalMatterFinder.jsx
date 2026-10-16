import { useState, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Compass, Sparkles, Search, X } from 'lucide-react'
import { siteConfig } from '../siteConfig'
import { scrollToContact, setContactPrefill } from '../utils/contactPrefill'
import { useGsapContext } from '../hooks/useGsapContext'
import { clipStaggerReveal } from '../utils/gsap/effects'
import { wrapRevealBlock, revealBlock } from '../utils/gsap/text'

const practiceAreas = siteConfig.practiceAreas

export default function LegalMatterFinder({ onHighlight, onLearnMore }) {
  const finder = siteConfig.matterFinder
  const [active, setActive] = useState(null)
  const [query, setQuery] = useState('')
  const ref = useRef(null)

  useGsapContext(ref, (gsap, root) => {
    const head = root.querySelector('.gsap-finder-headline')
    if (head) {
      const inner = wrapRevealBlock(head)
      revealBlock(gsap, inner, {
        scrollTrigger: { trigger: head, start: 'top 88%', toggleActions: 'play none none none' },
      })
    }

    const chips = root.querySelector('.gsap-finder-chips')
    if (chips) clipStaggerReveal(gsap, chips, '.gsap-finder-chip', { stagger: 0.06, y: 24 })
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return practiceAreas
      .filter((p) => {
        const haystack = [
          p.title,
          p.desc,
          ...(p.learnMore?.highlights || []),
        ].join(' ').toLowerCase()
        return haystack.includes(q)
      })
      .slice(0, 5)
  }, [query])

  const selectScenario = (scenario) => {
    setActive(scenario)
    const practice = practiceAreas.find(p => p.title === scenario.area)
    onHighlight?.(practice?.title || scenario.area)
  }

  const selectPractice = (practice, { open = false } = {}) => {
    setActive({ area: practice.title, prompt: query.trim() || practice.title })
    onHighlight?.(practice.title)
    if (open) onLearnMore?.(practice)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && results.length) {
      e.preventDefault()
      selectPractice(results[0], { open: true })
    }
  }

  const bookConsultation = () => {
    if (!active) return
    setContactPrefill({
      area: active.area,
      message: `I need assistance regarding: ${active.prompt}.`,
    })
    scrollToContact()
  }

  const openPractice = () => {
    if (!active) return
    const practice = practiceAreas.find(p => p.title === active.area)
    if (practice) onLearnMore?.(practice)
  }

  return (
    <div ref={ref} className="mb-10 md:mb-12 relative">
      <div className="gradient-border-wrap">
        <div className="gradient-border-inner p-5 sm:p-7 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-20 -right-16 w-48 h-48 opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.25), transparent 70%)' }} />

      <div className="relative flex items-start gap-3 mb-4">
        <div className="w-9 h-9 border border-[rgba(201,168,76,0.3)] flex items-center justify-center text-[#C9A84C] shrink-0">
          <Compass size={16} />
        </div>
        <div>
          <p className="text-[0.55rem] tracking-[0.22em] uppercase text-[#C9A84C]">{finder.label}</p>
          <h3 className="gsap-finder-headline font-display text-[1.35rem] sm:text-[1.55rem] font-light text-parchment mt-1">{finder.headline}</h3>
          <p className="text-[0.74rem] leading-[1.8] text-[#8A8270] mt-2 max-w-xl">{finder.subtext}</p>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative mb-4">
        <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8270]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search your legal issue — e.g. tax notice, custody, FIR…"
          aria-label="Search practice areas"
          className="w-full bg-[#0A0A08] border border-[rgba(201,168,76,0.25)] pl-10 pr-10 py-3 text-[0.8rem] sm:text-[0.78rem] text-parchment placeholder:text-[#8A8270]/60 focus:border-[#C9A84C] focus:outline-none focus:shadow-[0_0_0_3px_rgba(201,168,76,0.12)] transition-all"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8270] hover:text-[#C9A84C] transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Search results */}
      <AnimatePresence>
        {query.trim() && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            {results.length ? (
              <div className="border border-[rgba(201,168,76,0.2)] bg-[#0A0A08] divide-y divide-[rgba(201,168,76,0.1)]">
                {results.map((p) => (
                  <button
                    key={p.num}
                    type="button"
                    onClick={() => selectPractice(p, { open: true })}
                    className="group w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-[rgba(201,168,76,0.06)] transition-colors cursor-pointer"
                  >
                    <div className="min-w-0">
                      <p className="text-[0.8rem] text-parchment group-hover:text-[#E8D49A] transition-colors">{p.title}</p>
                      <p className="text-[0.68rem] text-[#8A8270] line-clamp-1">{p.desc}</p>
                    </div>
                    <ArrowRight size={14} className="shrink-0 text-[#C9A84C] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-[0.72rem] text-[#8A8270] leading-relaxed px-1">
                No direct match. Pick a common situation below, or describe it in the enquiry form.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-[0.55rem] tracking-[0.18em] uppercase text-[#8A8270]/70 mb-2.5">Or pick a common situation</p>

      <div className="gsap-finder-chips relative flex flex-wrap gap-2 sm:gap-2.5">
        {finder.scenarios.map((scenario) => {
          const isActive = active?.prompt === scenario.prompt
          return (
            <motion.button
              key={scenario.prompt}
              type="button"
              onClick={() => selectScenario(scenario)}
              whileTap={{ scale: 0.97 }}
              className={`gsap-finder-chip hover-chip text-[0.65rem] sm:text-[0.6rem] tracking-[0.12em] sm:tracking-[0.14em] uppercase px-3.5 py-2.5 min-h-[44px] border transition-all duration-300 cursor-pointer
                ${isActive
                  ? 'border-[#C9A84C] bg-[rgba(201,168,76,0.12)] text-[#E8C97A] shadow-[0_0_20px_rgba(201,168,76,0.12)]'
                  : 'border-[rgba(201,168,76,0.2)] bg-[#0A0A08] text-[#8A8270]'}`}
            >
              <span>{scenario.prompt}</span>
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border border-[rgba(201,168,76,0.22)] bg-[#0A0A08] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-3">
                <Sparkles size={14} className="text-[#C9A84C] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[0.55rem] tracking-[0.18em] uppercase text-[#8A8270]">Recommended area</p>
                  <p className="font-display text-[1.15rem] text-parchment mt-0.5">{active.area}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={openPractice}
                  className="min-h-[44px] text-[0.65rem] sm:text-[0.58rem] tracking-[0.14em] sm:tracking-[0.18em] uppercase px-4 py-3 sm:py-2.5 border border-[rgba(201,168,76,0.3)] text-[#8A8270] hover:text-[#C9A84C] hover:border-[rgba(201,168,76,0.55)] transition-colors bg-transparent cursor-pointer flex-1 sm:flex-none"
                >
                  Read more
                </button>
                <button
                  type="button"
                  onClick={bookConsultation}
                  className="btn-gold inline-flex items-center justify-center gap-2 !px-5 !py-3 sm:!py-2.5 !text-[0.65rem] sm:!text-[0.58rem] flex-1 sm:flex-none min-h-[44px]"
                >
                  Book on this matter <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
