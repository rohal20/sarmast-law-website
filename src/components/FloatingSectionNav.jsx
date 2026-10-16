import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion'
import { siteConfig } from '../siteConfig'
import { scrollToSection } from '../utils/scrollToSection'

const sections = [
  { id: 'practice', label: 'Practice' },
  { id: siteConfig.courtBulletin.sectionId, label: 'Results' },
  { id: 'team', label: 'Team' },
  { id: siteConfig.clients.sectionId, label: 'Clients' },
  { id: siteConfig.clientJourney.sectionId, label: 'Process' },
  { id: 'contact', label: 'Contact' },
]

export default function FloatingSectionNav() {
  const [active, setActive] = useState('')
  const [visible, setVisible] = useState(false)
  const { scrollYProgress } = useScroll()

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setVisible(latest > 0.08)
  })

  useEffect(() => {
    const ids = sections.map(s => s.id)
    const observer = new IntersectionObserver(
      entries => {
        const visibleEntries = entries.filter(e => e.isIntersecting)
        if (visibleEntries.length) {
          visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio)
          setActive(visibleEntries[0].target.id)
        }
      },
      { threshold: [0.2, 0.35, 0.5] }
    )
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.35 }}
          aria-label="Page sections"
          className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-4"
        >
          {sections.map(s => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={(e) => {
                e.preventDefault()
                scrollToSection(s.id)
              }}
              className="group flex items-center gap-3 no-underline"
            >
              <span
                className={`text-[0.52rem] tracking-[0.18em] uppercase transition-all duration-300
                  ${active === s.id ? 'text-[#C9A84C] opacity-100 translate-x-0' : 'text-[#8A8270] opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`}
              >
                {s.label}
              </span>
              <span
                className={`block rounded-full transition-all duration-500
                  ${active === s.id
                    ? 'w-2.5 h-2.5 bg-[#C9A84C] shadow-[0_0_16px_rgba(201,168,76,0.6)]'
                    : 'w-1.5 h-1.5 bg-[#8A8270]/50 group-hover:w-2 group-hover:h-2 group-hover:bg-[#C9A84C] group-hover:shadow-[0_0_14px_rgba(201,168,76,0.45)]'}`}
              />
            </a>
          ))}
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
