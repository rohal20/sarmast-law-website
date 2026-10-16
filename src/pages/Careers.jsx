import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, BriefcaseBusiness, CheckCircle2, GraduationCap, Scale, Send, Users } from 'lucide-react'
import RevealCard from '../components/RevealCard'
import RevealLine from '../components/RevealLine'
import SectionHeader from '../components/SectionHeader'
import careersHero from '../assets/careers-hero.webp'
import { siteConfig } from '../siteConfig'
import { getScrollOffset } from '../utils/scrollToSection'
import { useGsapContext } from '../hooks/useGsapContext'
import { bindPointerTilt } from '../utils/gsap/tilt'

const iconMap = {
  legal: Scale,
  graduate: GraduationCap,
  admin: BriefcaseBusiness,
}

const cultureIcons = [Scale, Users, CheckCircle2]

function HoverPanel({ children, className = '' }) {
  return (
    <div
      className={`group relative overflow-hidden border border-[rgba(201,168,76,0.18)] bg-[#0D0C0A] transition-all duration-300 hover:border-[rgba(201,168,76,0.45)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.35)] ${className}`}
    >
      <div
        className="absolute top-0 left-6 right-6 h-px opacity-40 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
        style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }}
      />
      <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-[rgba(201,168,76,0.25)] group-hover:border-[rgba(201,168,76,0.6)] transition-colors duration-300" />
      {children}
    </div>
  )
}

function ViewOpenRolesButton({ onClick, className = '' }) {
  const reduce = useReducedMotion()

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduce ? {} : { scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative inline-flex items-center justify-center gap-2.5 border border-[rgba(201,168,76,0.38)] bg-[rgba(10,10,8,0.72)] backdrop-blur-sm px-4 py-3.5 sm:py-3 min-h-[48px] cursor-pointer transition-colors duration-300 hover:border-[rgba(201,168,76,0.65)] hover:bg-[rgba(17,17,16,0.85)] ${className}`}
    >
      {!reduce && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(201,168,76,0.08)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
      )}
      <span className="relative text-[0.65rem] sm:text-[0.56rem] font-medium tracking-[0.2em] sm:tracking-[0.24em] uppercase text-[#C9A84C] group-hover:text-[#E8C97A] transition-colors">
        View Open Roles
      </span>
      <ArrowRight
        size={11}
        strokeWidth={1.5}
        className="relative text-[#C9A84C] transition-transform duration-300 group-hover:translate-x-0.5"
      />
    </motion.button>
  )
}

function CareersHeroContent({ onViewRoles }) {
  const careers = siteConfig.careers

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15, duration: 0.65 }}
        className="flex items-center gap-3 mb-4"
      >
        <span className="block w-8 h-px bg-[#C9A84C] shrink-0" />
        <span className="text-[0.5rem] sm:text-[0.58rem] tracking-[0.22em] uppercase text-[#C9A84C] leading-relaxed">
          {careers.hero.eyebrow}
        </span>
      </motion.div>

      <div className="mb-4">
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[2rem] sm:text-[2.6rem] font-light leading-[1.12] text-parchment"
        >
          Built on Principle.
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[2rem] sm:text-[2.6rem] font-light leading-[1.12] italic text-[#C9A84C]"
        >
          Driven by Purpose.
        </motion.h1>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.65 }}
        className="text-[0.76rem] sm:text-[0.82rem] leading-[1.85] text-[#A89F8C] max-w-md"
      >
        {careers.hero.subtitle}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.62, duration: 0.65 }}
        className="mt-6 md:hidden"
      >
        <ViewOpenRolesButton onClick={onViewRoles} className="w-full" />
      </motion.div>
    </>
  )
}

function MobileCareersHeroImage() {
  return (
    <div className="relative md:hidden bg-[#0A0A08]">
      <div className="h-px mx-5 bg-gradient-to-r from-transparent via-[rgba(201,168,76,0.35)] to-transparent" />
      <div className="relative h-[40svh] min-h-[230px] max-h-[330px] overflow-hidden">
        <img
          src={careersHero}
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute top-0 left-1/2 h-full w-[118%] max-w-none -translate-x-[46%] object-cover brightness-[1.06] contrast-[1.04]"
          style={{ objectPosition: '68% 14%' }}
          draggable={false}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(to bottom, #0A0A08 0%, rgba(10,10,8,0.45) 8%, transparent 24%),
              linear-gradient(to top, #0A0A08 0%, rgba(10,10,8,0.8) 16%, transparent 42%),
              linear-gradient(to right, rgba(10,10,8,0.55) 0%, transparent 22%)
            `,
          }}
        />
      </div>
    </div>
  )
}

function CareersHeroImage() {
  return (
    <div className="absolute inset-0 bg-[#0A0A08]">
      <img
        src={careersHero}
        alt="Built on principle. Driven by purpose - careers at Sarmast Law Associates"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-[50%_18%] brightness-[1.05] contrast-[1.04]"
        draggable={false}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to bottom, rgba(10,10,8,0.3) 0%, transparent 10%, transparent 82%, rgba(10,10,8,0.82) 100%),
            linear-gradient(to right, rgba(10,10,8,0.12) 0%, transparent 34%)
          `,
        }}
      />
    </div>
  )
}

export default function Careers() {
  const careers = siteConfig.careers
  const applyHref = `mailto:${siteConfig.contact.email}?subject=Career%20Application%20-%20Sarmast%20Law%20Associates`
  const rootRef = useRef(null)
  const heroRef = useRef(null)
  const openingsRef = useRef(null)

  useGsapContext(rootRef, (gsap, root) => {
    return bindPointerTilt(gsap, root.querySelectorAll('.careers-tilt'), { max: 6, scale: 1.02 })
  }, [])
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 32])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.01, 1.04])

  const scrollToOpenings = () => {
    if (!openingsRef.current) return
    const top = openingsRef.current.getBoundingClientRect().top + window.scrollY - getScrollOffset()
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
  }

  return (
    <div ref={rootRef} className="bg-[#0A0A08]">
      <section
        ref={heroRef}
        className="relative border-b border-[rgba(201,168,76,0.18)] md:min-h-[calc(100vh-4rem)] md:overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 hidden md:block will-change-transform"
          style={{ y: imageY, scale: imageScale }}
        >
          <CareersHeroImage />
        </motion.div>

        <div className="relative z-10 md:hidden">
          <div className="px-5 pt-5 pb-5 bg-[#0A0A08]">
            <CareersHeroContent onViewRoles={scrollToOpenings} />
          </div>
          <MobileCareersHeroImage />
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none hidden md:block">
          <div
            className="pointer-events-auto border-t border-[rgba(201,168,76,0.12)] px-8 md:px-12 lg:px-16 py-4"
            style={{
              background: 'linear-gradient(to top, rgba(10,10,8,0.96) 0%, rgba(10,10,8,0.82) 60%, transparent 100%)',
            }}
          >
            <div className="flex flex-row items-center justify-between gap-6 max-w-6xl">
              <p className="text-[0.72rem] leading-[1.8] text-[#8A8270] max-w-md">
                Ready to take the next step? Browse our current openings in Karachi.
              </p>
              <ViewOpenRolesButton onClick={scrollToOpenings} />
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 md:px-16 py-12 sm:py-20 md:py-24 bg-[#0D0C0A] border-b border-[rgba(201,168,76,0.12)]">
        <SectionHeader label={careers.label} className="mb-8 sm:mb-10 md:mb-14">
          Build Your <em className="italic text-[#C9A84C]">Legal Career</em>
        </SectionHeader>

        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 sm:gap-10 md:gap-14 -mt-2 sm:-mt-4 md:-mt-6">
          <RevealCard index={0} variant="left">
            <p className="text-[0.58rem] tracking-[0.22em] uppercase text-[#C9A84C] mb-3 sm:mb-4">About Working Here</p>
            <p className="text-[0.8rem] sm:text-[0.88rem] leading-[1.85] sm:leading-[2] text-[#A89F8C] max-w-2xl">{careers.intro}</p>
            <p className="mt-4 sm:mt-5 text-[0.78rem] sm:text-[0.85rem] leading-[1.85] sm:leading-[1.95] text-[#8A8270] max-w-2xl">
              {careers.hero.subtitle}
            </p>
          </RevealCard>

          <RevealCard index={1} variant="right">
            <HoverPanel className="careers-tilt p-5 sm:p-8">
              <p className="text-[0.58rem] tracking-[0.22em] uppercase text-[#C9A84C] mb-4 sm:mb-5">Why Join Us</p>
              <ul className="space-y-3 sm:space-y-3.5">
                {careers.whyJoin.map(point => (
                  <li key={point} className="flex items-start gap-3 text-[0.78rem] sm:text-[0.78rem] leading-[1.75] sm:leading-[1.8] text-[#8A8270] group-hover:text-[#A89F8C] transition-colors duration-300">
                    <span className="mt-2 w-1.5 h-1.5 shrink-0 rounded-full bg-[#C9A84C]" />
                    {point}
                  </li>
                ))}
              </ul>
            </HoverPanel>
          </RevealCard>
        </div>
      </section>

      <div className="px-5 sm:px-8 md:px-16 py-2">
        <RevealLine />
      </div>

      <section className="px-5 sm:px-8 md:px-16 py-12 sm:py-20 md:py-24 border-b border-[rgba(201,168,76,0.12)]">
        <SectionHeader label="Our Culture" className="mb-8 sm:mb-10 md:mb-14">
          What We <em className="italic text-[#C9A84C]">Stand For</em>
        </SectionHeader>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 mb-8 sm:mb-12 -mt-2 sm:-mt-4 md:-mt-6">
          {careers.culture.map((item, i) => {
            const Icon = cultureIcons[i] || Scale
            return (
              <RevealCard key={item.title} index={i} variant="curtain" className={i === 2 ? 'sm:col-span-2 md:col-span-1' : ''}>
                <HoverPanel className="careers-tilt h-full p-5 sm:p-7">
                  <div className="w-9 h-9 border border-[rgba(201,168,76,0.28)] flex items-center justify-center text-[#C9A84C] mb-3 sm:mb-4 group-hover:border-[rgba(201,168,76,0.55)] transition-colors duration-300">
                    <Icon size={16} />
                  </div>
                  <h3 className="font-display text-[1.1rem] sm:text-[1.15rem] text-parchment">{item.title}</h3>
                  <p className="mt-2.5 sm:mt-3 text-[0.76rem] leading-[1.8] sm:leading-[1.85] text-[#8A8270]">{item.text}</p>
                </HoverPanel>
              </RevealCard>
            )
          })}
        </div>

        <RevealCard index={3} variant="curtain">
          <HoverPanel className="px-5 sm:px-8 py-5 sm:py-7 bg-[rgba(17,17,16,0.5)]">
            <p className="text-[0.58rem] tracking-[0.22em] uppercase text-[#C9A84C] mb-3 sm:mb-4">What We Offer</p>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-3">
              {careers.benefits.map(benefit => (
                <p key={benefit} className="flex items-start gap-2.5 text-[0.76rem] leading-[1.7] sm:leading-[1.75] text-[#8A8270]">
                  <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-[#C9A84C]" />
                  {benefit}
                </p>
              ))}
            </div>
          </HoverPanel>
        </RevealCard>
      </section>

      <div className="px-5 sm:px-8 md:px-16 py-2">
        <RevealLine />
      </div>

      <section
        id="openings"
        ref={openingsRef}
        className="scroll-anchor scroll-mt-24 px-4 sm:px-8 md:px-16 py-12 sm:py-20 md:py-24 border-b border-[rgba(201,168,76,0.12)] bg-[#0D0C0A]"
      >
        <SectionHeader label="Current Openings" className="mb-8 sm:mb-10 md:mb-14">
          Open <em className="italic text-[#C9A84C]">Positions</em>
        </SectionHeader>

        <div className="space-y-6 sm:space-y-8 -mt-2 sm:-mt-4 md:-mt-6">
          {careers.openings.map((role, i) => {
            const Icon = iconMap[role.icon] || BriefcaseBusiness
            return (
              <RevealCard key={role.title} index={i} variant="left">
                <HoverPanel>
                  <div className="px-5 sm:px-8 pt-5 sm:pt-8 pb-4 sm:pb-5 border-b border-[rgba(201,168,76,0.12)] flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                      <div className="w-10 h-10 shrink-0 border border-[rgba(201,168,76,0.28)] flex items-center justify-center text-[#C9A84C] group-hover:border-[rgba(201,168,76,0.55)] transition-colors duration-300">
                        <Icon size={18} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-display text-[1.3rem] sm:text-[1.7rem] text-parchment leading-tight">{role.title}</h3>
                        <p className="mt-1 text-[0.64rem] sm:text-[0.68rem] tracking-[0.15em] uppercase text-[#C9A84C]">{role.location}</p>
                      </div>
                    </div>
                    <span className="self-start text-[0.52rem] tracking-[0.18em] uppercase px-3 py-1.5 border border-[rgba(201,168,76,0.25)] text-[#8A8270] group-hover:border-[rgba(201,168,76,0.45)] group-hover:text-[#C9A84C] transition-all duration-300">
                      {role.type}
                    </span>
                  </div>

                  <div className="px-5 sm:px-8 py-5 sm:py-7">
                    <p className="text-[0.78rem] sm:text-[0.8rem] leading-[1.85] sm:leading-[1.9] text-[#8A8270]">{role.summary}</p>

                    <div className="mt-6 sm:mt-8 grid gap-6 md:grid-cols-2 md:gap-8">
                      <div>
                        <p className="text-[0.55rem] tracking-[0.2em] uppercase text-[#C9A84C] mb-3 sm:mb-4">Responsibilities</p>
                        <ul className="space-y-2 sm:space-y-2.5">
                          {role.responsibilities.map(item => (
                            <li key={item} className="flex items-start gap-2.5 text-[0.74rem] sm:text-[0.75rem] leading-[1.75] sm:leading-[1.8] text-[#8A8270]">
                              <span className="mt-2 w-1 h-1 shrink-0 bg-[#C9A84C]" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[0.55rem] tracking-[0.2em] uppercase text-[#C9A84C] mb-3 sm:mb-4">Requirements</p>
                        <ul className="space-y-2 sm:space-y-2.5">
                          {role.requirements.map(item => (
                            <li key={item} className="flex items-start gap-2.5 text-[0.74rem] sm:text-[0.75rem] leading-[1.75] sm:leading-[1.8] text-[#8A8270]">
                              <span className="mt-2 w-1 h-1 shrink-0 bg-[#C9A84C]" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <a href={applyHref} className="btn-gold btn-mobile-full inline-flex items-center justify-center gap-2 mt-6 sm:mt-8 w-full sm:w-auto">
                      Apply for this role <Send size={14} />
                    </a>
                  </div>
                </HoverPanel>
              </RevealCard>
            )
          })}
        </div>
      </section>

      <div className="px-5 sm:px-8 md:px-16 py-2">
        <RevealLine />
      </div>

      <section className="px-5 sm:px-8 md:px-16 py-12 sm:py-20 md:py-24 pb-16 sm:pb-24">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
          <RevealCard index={0} variant="left">
            <HoverPanel className="careers-tilt h-full p-5 sm:p-8 bg-[rgba(10,10,8,0.75)]">
              <p className="text-[0.58rem] tracking-[0.22em] uppercase text-[#C9A84C] mb-4 sm:mb-5">Hiring Process</p>
              <div className="space-y-3.5 sm:space-y-4">
                {careers.process.map((step, i) => (
                  <div key={step} className="flex items-start gap-3">
                    <span className="w-7 h-7 shrink-0 border border-[rgba(201,168,76,0.25)] text-[#C9A84C] text-[0.55rem] tracking-[0.12em] flex items-center justify-center group-hover:border-[rgba(201,168,76,0.5)] transition-colors duration-300">
                      0{i + 1}
                    </span>
                    <p className="text-[0.75rem] sm:text-[0.76rem] leading-[1.75] sm:leading-[1.8] text-[#8A8270] pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </HoverPanel>
          </RevealCard>

          <RevealCard index={1} variant="right">
            <HoverPanel className="careers-tilt h-full p-5 sm:p-8 flex flex-col bg-[#0F0E0C]">
              <p className="text-[0.58rem] tracking-[0.22em] uppercase text-[#C9A84C] mb-3 sm:mb-4">How to Apply</p>
              <p className="text-[0.78rem] sm:text-[0.8rem] leading-[1.85] sm:leading-[1.9] text-[#8A8270]">{careers.applyNote}</p>

              <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-[rgba(201,168,76,0.18)]">
                <p className="text-[0.55rem] tracking-[0.2em] uppercase text-[#8A8270] mb-2">Careers inbox</p>
                <a
                  href={applyHref}
                  className="text-[0.82rem] sm:text-[0.85rem] text-parchment no-underline hover:text-[#C9A84C] transition-colors break-all sm:break-normal"
                >
                  {siteConfig.contact.email}
                </a>
              </div>

              <a href={applyHref} className="btn-gold btn-mobile-full inline-flex items-center justify-center gap-2 mt-6 sm:mt-7 w-full sm:w-auto sm:self-start">
                Submit Application <Send size={14} />
              </a>

              <p className="mt-6 sm:mt-8 text-[0.72rem] leading-[1.8] sm:leading-[1.85] text-[#8A8270]/80">{careers.equalOpportunity}</p>
            </HoverPanel>
          </RevealCard>
        </div>
      </section>
    </div>
  )
}
