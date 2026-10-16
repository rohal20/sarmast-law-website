import { useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { siteConfig } from '../siteConfig'
import FirmBrand from '../components/FirmBrand'
import { navigateToHomeSection } from '../components/HomeSectionLink'
import { useGsapContext } from '../hooks/useGsapContext'
import { clipStaggerReveal } from '../utils/gsap/effects'

export default function Footer() {
  const ref = useRef(null)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const address = siteConfig.location.addressLines.join(', ')
  const phoneHref = `tel:${siteConfig.contact.phoneE164 || siteConfig.contact.phoneDisplay}`
  const emailHref = `mailto:${siteConfig.contact.email}`

  useGsapContext(ref, (gsap, root) => {
    const cols = root.querySelector('.gsap-footer-cols')
    if (cols) clipStaggerReveal(gsap, cols, '.gsap-footer-col')

    const bar = root.querySelector('.gsap-footer-bar')
    if (bar) {
      gsap.from(bar, {
        opacity: 0,
        y: 16,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: bar, start: 'top 95%', toggleActions: 'play none none none' },
      })
    }
  }, [])

  return (
    <footer ref={ref} className="border-t border-[rgba(201,168,76,0.18)] section-surface relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -left-32 w-[600px] h-[600px] bg-radial-gold blur-2xl opacity-50" />
      <div className="pointer-events-none absolute -top-52 right-[-120px] w-[620px] h-[620px] bg-radial-jade blur-2xl opacity-40" />
      <div className="gsap-footer-cols px-5 sm:px-8 md:px-16 py-14 grid gap-10 md:grid-cols-12">
        <div className="gsap-footer-col md:col-span-5">
          <FirmBrand size="footer" href="/" />
          <p className="mt-4 text-[0.78rem] leading-[1.9] text-[#8A8270] max-w-md">
            {siteConfig.tagline}
          </p>
          <div className="mt-6 text-[0.72rem] leading-[1.9] text-[#8A8270] space-y-2">
            <p className="text-parchment/80">{address}</p>
            <p>
              <a className="block sm:inline hover:text-[#C9A84C] transition-colors no-underline text-[#8A8270] py-1" href={phoneHref}>
                {siteConfig.contact.phoneDisplay}
              </a>
              <span className="hidden sm:inline mx-2 text-[#8A8270]/40">·</span>
              <a className="block sm:inline hover:text-[#C9A84C] transition-colors no-underline text-[#8A8270] break-all py-1" href={emailHref}>
                {siteConfig.contact.email}
              </a>
            </p>
            <p className="text-[0.62rem] tracking-[0.18em] uppercase">
              Hours: {siteConfig.contact.hours}
            </p>
          </div>
        </div>

        <div className="gsap-footer-col md:col-span-3">
          <p className="text-[0.62rem] tracking-[0.22em] uppercase text-[#C9A84C] mb-4">Quick Links</p>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Practice Areas', href: '/#practice', section: 'practice' },
              { label: 'About', href: '/about' },
              { label: 'Our Team', href: '/#team', section: 'team' },
              { label: 'Careers', href: '/careers' },
              { label: 'Contact', href: '/#contact', section: 'contact' },
            ].map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => {
                  if (!l.section) return
                  e.preventDefault()
                  navigateToHomeSection(l.section, { navigate, pathname })
                }}
                className="inline-flex items-center min-h-[44px] text-[0.75rem] sm:text-[0.72rem] tracking-[0.08em] text-[#8A8270] no-underline hover-link"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>

        <div className="gsap-footer-col md:col-span-4">
          <p className="text-[0.62rem] tracking-[0.22em] uppercase text-[#C9A84C] mb-4">Legal</p>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Use', href: '/terms' },
              { label: 'Disclaimer', href: '/disclaimer' },
            ].map(l => (
              <a
                key={l.href}
                href={l.href}
                className="inline-flex items-center min-h-[44px] text-[0.75rem] sm:text-[0.72rem] tracking-[0.08em] text-[#8A8270] no-underline hover-link"
              >
                {l.label}
              </a>
            ))}
          </div>

          <p className="mt-6 text-[0.7rem] leading-[1.9] text-[#8A8270]">
            {siteConfig.legal.disclaimerShort}
          </p>
        </div>
      </div>

      <div className="gsap-footer-bar border-t border-[rgba(201,168,76,0.12)]">
        <div className="px-5 sm:px-8 md:px-16 py-6 flex flex-col md:flex-row gap-3 md:gap-6 items-start md:items-center justify-between pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <p className="text-[0.62rem] tracking-[0.12em] text-[#8A8270]">
            © {new Date().getFullYear()} {siteConfig.firmName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[0.62rem] tracking-[0.14em] uppercase">
            <a className="hover-link text-[#8A8270] no-underline py-1" href="/privacy">Privacy</a>
            <span className="text-[#8A8270]/40">·</span>
            <a className="hover-link text-[#8A8270] no-underline py-1" href="/terms">Terms</a>
            <span className="text-[#8A8270]/40">·</span>
            <a className="hover-link text-[#8A8270] no-underline py-1" href="/disclaimer">Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
