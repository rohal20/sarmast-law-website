import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { siteConfig } from '../siteConfig'
import FirmBrand from './FirmBrand'
import { navigateToHomeSection } from './HomeSectionLink'
import MagneticLink from './MagneticLink'

const links = [
  { label: 'Practice Areas', href: '/#practice', section: 'practice' },
  { label: siteConfig.courtBulletin.navLabel, href: `/#${siteConfig.courtBulletin.sectionId}`, section: siteConfig.courtBulletin.sectionId },
  { label: 'Our Team', href: '/#team', section: 'team' },
  { label: siteConfig.clients.navLabel, href: `/#${siteConfig.clients.sectionId}`, section: siteConfig.clients.sectionId },
  { label: 'Careers', href: '/careers', section: 'careers' },
  { label: 'About', href: '/about', section: 'about' },
  { label: siteConfig.clientJourney.navLabel, href: `/#${siteConfig.clientJourney.sectionId}`, section: siteConfig.clientJourney.sectionId },
  { label: 'Contact', href: '/#contact', section: 'contact' },
]

const desktopLinks = [links[0], links[1], links[2], links[4], links[5]]

const EASE = [0.22, 1, 0.36, 1]

function ExperimentalMenu({ open, onClose, activeSection, location }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  const isActive = (link) => {
    if (link.href === '/careers') return location.pathname === '/careers'
    if (link.href === '/about') return location.pathname === '/about'
    if (location.pathname !== '/') return false
    return activeSection === link.section
  }

  const handleNavClick = (e, link) => {
    if (!link.href.startsWith('/#')) return
    e.preventDefault()
    onClose()
    navigateToHomeSection(link.section, { navigate, pathname: location.pathname })
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-[rgba(4,3,2,0.72)] backdrop-blur-sm cursor-pointer border-none"
            onClick={onClose}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="absolute top-0 right-0 h-full w-full sm:w-[min(100%,520px)] md:w-[min(58vw,680px)] flex flex-col liquid-glass-strong border-l border-[rgba(201,168,76,0.28)] shadow-[-24px_0_80px_rgba(0,0,0,0.55)] pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <div className="h-1.5 shrink-0" style={{ background: 'linear-gradient(90deg, #A07C30, #C9A84C, #E8D49A)' }} />

            <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-[rgba(201,168,76,0.12)]">
              <div>
                <p className="text-[0.65rem] tracking-[0.24em] uppercase text-[#8A8270] mb-1">Navigation</p>
                <FirmBrand size="menu" />
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="touch-target w-11 h-11 border border-[rgba(201,168,76,0.3)] flex items-center justify-center text-parchment hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors cursor-pointer bg-transparent"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-6 sm:px-8 py-4">
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  initial={{ opacity: 0, x: 32 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.45, ease: EASE }}
                  className={`group block py-4 sm:py-6 border-b border-[rgba(201,168,76,0.1)] no-underline min-h-[56px]
                    ${isActive(link) ? 'border-[rgba(201,168,76,0.35)]' : ''}`}
                >
                  <span className="text-[0.62rem] tracking-[0.26em] uppercase text-[#8A8270] group-hover:text-[#C9A84C] transition-colors">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`block mt-1 font-display text-[1.75rem] sm:text-[2.25rem] md:text-[2.5rem] leading-[1.05] transition-[color,transform] duration-500
                      ${isActive(link) ? 'text-[#C9A84C]' : 'text-parchment group-hover:text-[#E8D49A] group-hover:translate-x-2'}`}
                  >
                    {link.label}
                  </span>
                  <span
                    className={`block mt-2 h-0.5 origin-left transition-transform duration-500
                      ${isActive(link) ? 'scale-x-100 bg-[#C9A84C]' : 'scale-x-0 bg-[#C9A84C] group-hover:scale-x-100'}`}
                    style={{ width: '2.5rem' }}
                  />
                </motion.a>
              ))}
            </nav>

            <div className="shrink-0 px-6 sm:px-8 py-6 border-t border-[rgba(201,168,76,0.15)] bg-[rgba(201,168,76,0.03)]">
              <a
                href="/#contact"
                onClick={(e) => {
                  e.preventDefault()
                  onClose()
                  navigateToHomeSection('contact', { navigate, pathname: location.pathname })
                }}
                className="btn-gold inline-block"
              >
                Book a Consultation
              </a>
              <p className="mt-4 text-[0.65rem] tracking-[0.12em] uppercase text-[#8A8270] leading-relaxed break-words">
                {siteConfig.contact.phoneDisplay} · {siteConfig.contact.email}
              </p>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActive] = useState('')

  useEffect(() => {
    setScrolled(scrollY.get() > 60)
  }, [scrollY])

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 60)
  })

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const ids = ['practice', siteConfig.courtBulletin.sectionId, 'team', siteConfig.clients.sectionId, siteConfig.clientJourney.sectionId, 'contact']
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActive(e.target.id)),
      { threshold: 0.4 }
    )
    ids.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 md:px-12 min-h-[4rem] transition-all duration-300
          pt-[env(safe-area-inset-top,0px)]
          ${scrolled
            ? 'pb-2.5 bg-[rgba(10,10,8,0.98)] border-b border-[rgba(201,168,76,0.18)] backdrop-blur-xl nav-glass-scrolled'
            : 'pb-3.5 bg-[rgba(10,10,8,0.85)] border-b border-[rgba(201,168,76,0.12)] backdrop-blur-md'
          }`}
      >
        <div className="flex items-center self-center shrink-0 min-h-[2.75rem]">
          <FirmBrand size="nav" href="/" />
        </div>

        <div className="hidden lg:flex items-center gap-3.5 xl:gap-5 self-center">
          {desktopLinks.map(l => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => {
                if (!l.href.startsWith('/#')) return
                e.preventDefault()
                navigateToHomeSection(l.section, { navigate, pathname: location.pathname })
              }}
              className="hover-nav-link text-[0.56rem] xl:text-[0.58rem] tracking-[0.14em] xl:tracking-[0.16em] uppercase text-[#8A8270] leading-none whitespace-nowrap"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3 sm:gap-4 self-center">
          <MagneticLink
            href="/#contact"
            onClick={(e) => {
              e.preventDefault()
              navigateToHomeSection('contact', { navigate, pathname: location.pathname })
            }}
            className="hidden sm:inline-flex sm:items-center text-[0.58rem] tracking-[0.18em] uppercase leading-none px-4 py-2 border border-[rgba(201,168,76,0.5)] text-[#C9A84C] no-underline transition-all duration-200 hover:bg-[#C9A84C] hover:text-[#0A0A08]"
          >
            Book a Consultation
          </MagneticLink>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="touch-target inline-flex items-center justify-center gap-2 text-[0.65rem] tracking-[0.16em] uppercase text-parchment border border-[rgba(201,168,76,0.25)] px-4 py-2.5 min-h-[44px] hover:border-[#C9A84C] hover:text-[#C9A84C] hover:shadow-[0_0_20px_rgba(201,168,76,0.15)] transition-[color,border-color,box-shadow] duration-300 cursor-pointer bg-transparent"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <Menu size={16} />
            <span className="hidden sm:inline">Menu</span>
          </button>
        </div>
      </motion.nav>

      <ExperimentalMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        activeSection={activeSection}
        location={location}
      />
    </>
  )
}
