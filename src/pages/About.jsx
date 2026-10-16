import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight,
  Clock,
  Landmark,
  Mail,
  MapPin,
  Phone,
  Scale,
  Shield,
  Users,
} from 'lucide-react'
import AboutSection from '../sections/About'
import HomeSectionLink from '../components/HomeSectionLink'
import RevealCard from '../components/RevealCard'
import SectionHeader from '../components/SectionHeader'
import topCover from '../assets/top-cover.webp'
import { siteConfig } from '../siteConfig'
import { useGsapContext } from '../hooks/useGsapContext'
import { clipWipe } from '../utils/gsap/scroll'
import { bindPointerTilt } from '../utils/gsap/tilt'

const valueIcons = [Shield, Scale, Landmark, Users]

function PrincipleCard({ item, index }) {
  const Icon = valueIcons[index % valueIcons.length]

  return (
    <RevealCard index={index} variant="curtain">
      <div className="about-principle-card group hover-luxe-card relative h-full border border-[rgba(201,168,76,0.18)] bg-[#0D0C0A] p-5 sm:p-6">
        <div
          className="absolute top-0 left-5 right-5 h-px opacity-40 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }}
        />
        <div className="w-10 h-10 border border-[rgba(201,168,76,0.28)] flex items-center justify-center text-[#C9A84C] mb-4 transition-all duration-300 group-hover:border-[rgba(201,168,76,0.55)] group-hover:shadow-[0_0_20px_rgba(201,168,76,0.15)]">
          <Icon size={18} strokeWidth={1.5} />
        </div>
        <h3 className="font-display text-[1.2rem] sm:text-[1.35rem] font-light text-parchment mb-2">
          {item.title}
        </h3>
        <p className="text-[0.76rem] sm:text-[0.78rem] leading-[1.85] text-[#8A8270]">
          {item.text}
        </p>
      </div>
    </RevealCard>
  )
}

function FirmTimeline({ milestones }) {
  const trackRef = useRef(null)
  const hzRef = useRef(null)
  const hzSectionRef = useRef(null)
  const hzTrackRef = useRef(null)
  const hzBarRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 85%', 'end 35%'],
  })
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  useGsapContext(hzRef, (gsap, root) => {
    if (!window.matchMedia('(min-width: 1024px)').matches) return undefined
    const section = hzSectionRef.current
    const track = hzTrackRef.current
    const bar = hzBarRef.current
    if (!section || !track) return undefined

    // CSS `sticky` handles the pin (robust); GSAP only scrubs the horizontal x.
    const stickyH = () => window.innerHeight - 64
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)
    const setHeight = () => {
      section.style.height = `${stickyH() + distance() * 0.85}px`
    }
    setHeight()

    gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top+=64',
        end: 'bottom bottom',
        scrub: 1,
        invalidateOnRefresh: true,
      },
    })

    if (bar) {
      gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          transformOrigin: 'left center',
          scrollTrigger: { trigger: section, start: 'top top+=64', end: 'bottom bottom', scrub: 1 },
        }
      )
    }

    gsap.from('.gsap-hz-panel', {
      opacity: 0,
      y: 40,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: section, start: 'top 72%', once: true },
    })

    const onResize = () => setHeight()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <>
      {/* Mobile / tablet: vertical timeline */}
      <div ref={trackRef} className="vt-timeline relative lg:hidden">
        <div className="hidden md:block absolute left-[1.65rem] top-3 bottom-3 w-px bg-[rgba(201,168,76,0.15)]">
          <motion.div
            className="w-full h-full origin-top"
            style={{
              scaleY: lineScale,
              background: 'linear-gradient(to bottom, #C9A84C, #2CB9A8)',
            }}
          />
        </div>

        <div className="grid gap-5 md:gap-6">
          {milestones.map((item, i) => (
            <RevealCard key={item.year + item.title} index={i} variant={i % 2 === 0 ? 'left' : 'right'}>
              <div className="group hover-luxe-card relative md:pl-14 border border-[rgba(201,168,76,0.18)] bg-[#0D0C0A] p-5 sm:p-6">
                <div className="hidden md:flex absolute left-5 top-7 w-3 h-3 rounded-full border border-[#C9A84C] bg-[#0A0A08] transition-all duration-500 group-hover:bg-[#C9A84C] group-hover:shadow-[0_0_16px_rgba(201,168,76,0.5)]" />
                <p className="text-[0.58rem] tracking-[0.22em] uppercase text-[#C9A84C] mb-2">{item.year}</p>
                <h3 className="font-display text-[1.25rem] sm:text-[1.45rem] font-light text-parchment mb-2">
                  {item.title}
                </h3>
                <p className="text-[0.76rem] sm:text-[0.78rem] leading-[1.85] text-[#8A8270] max-w-3xl">
                  {item.text}
                </p>
              </div>
            </RevealCard>
          ))}
        </div>
      </div>

      {/* Desktop: sticky horizontal-scroll timeline */}
      <div ref={hzRef} className="hz-timeline hidden lg:block -mx-16">
        <div ref={hzSectionRef} className="relative">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-hidden">
            <div className="pointer-events-none absolute top-10 left-16 z-10 flex items-center gap-3 text-[0.55rem] tracking-[0.24em] uppercase text-[#8A8270]">
              <span className="w-8 h-px bg-[rgba(201,168,76,0.5)]" />
              Scroll to travel two decades
            </div>

            <div
              className="absolute left-16 right-16 top-1/2 h-px -translate-y-1/2 bg-[rgba(201,168,76,0.1)]"
              aria-hidden="true"
            />

            <div ref={hzTrackRef} className="flex h-full items-center gap-12 pl-16 pr-[16vw] will-change-transform">
              {milestones.map((item, i) => (
                <article
                  key={item.year + item.title}
                  className="gsap-hz-panel group relative shrink-0 w-[64vw] max-w-[820px] h-[58vh] max-h-[520px] flex flex-col justify-between overflow-hidden hover-luxe-card border border-[rgba(201,168,76,0.2)] bg-[#0D0C0A] p-10 xl:p-14"
                >
                  <span className="pointer-events-none absolute -bottom-10 right-4 font-display text-[16rem] leading-none text-[#C9A84C]/[0.05] group-hover:text-[#C9A84C]/[0.09] transition-colors select-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div className="relative flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full border border-[#C9A84C] bg-[#0A0A08] transition-all duration-500 group-hover:bg-[#C9A84C] group-hover:shadow-[0_0_16px_rgba(201,168,76,0.5)]" />
                    <span className="h-px w-16 bg-gradient-to-r from-[#C9A84C] to-transparent" />
                    <p className="text-[0.62rem] tracking-[0.28em] uppercase text-[#C9A84C]">{item.year}</p>
                  </div>

                  <div className="relative max-w-2xl">
                    <h3 className="font-display text-[2.6rem] xl:text-[3.2rem] font-light text-parchment leading-[1.05] mb-5">
                      {item.title}
                    </h3>
                    <p className="text-[0.92rem] leading-[1.95] text-[#A89F8C]">{item.text}</p>
                  </div>

                  <p className="relative text-[0.55rem] tracking-[0.24em] uppercase text-[#8A8270]">
                    {String(i + 1).padStart(2, '0')} — {String(milestones.length).padStart(2, '0')}
                  </p>
                </article>
              ))}
            </div>

            <div className="absolute bottom-10 left-16 right-16 h-px bg-[rgba(201,168,76,0.12)]" aria-hidden="true">
              <div
                ref={hzBarRef}
                className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-[#C9A84C] to-[#2CB9A8]"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function TeamPreview({ members }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {members.map((member, i) => (
        <RevealCard key={member.name} index={i} variant="curtain">
          <div className="group hover-luxe-card border border-[rgba(201,168,76,0.18)] bg-[#0D0C0A] p-5 text-center h-full">
            <div className="w-12 h-12 mx-auto rounded-full border border-[rgba(201,168,76,0.3)] flex items-center justify-center mb-4 bg-[rgba(201,168,76,0.05)] transition-all duration-500 group-hover:border-[rgba(201,168,76,0.6)] group-hover:shadow-[0_0_20px_rgba(201,168,76,0.15)]">
              <span className="font-display text-[0.95rem] text-[#C9A84C]">{member.initials}</span>
            </div>
            <h3 className="font-display text-[1.05rem] font-light text-parchment leading-snug">{member.name}</h3>
            <p className="mt-1 text-[0.58rem] tracking-[0.16em] uppercase text-[#8A8270]">{member.role}</p>
          </div>
        </RevealCard>
      ))}
    </div>
  )
}

export default function About() {
  const about = siteConfig.about
  const reduce = useReducedMotion()
  const address = siteConfig.location.addressLines.join(', ')
  const phoneHref = `tel:${siteConfig.contact.phoneE164 || siteConfig.contact.phoneDisplay}`
  const emailHref = `mailto:${siteConfig.contact.email}`
  const rootRef = useRef(null)

  useGsapContext(rootRef, (gsap, root) => {
    const heroImg = root.querySelector('.about-hero-img')
    if (heroImg) clipWipe(gsap, heroImg, { trigger: heroImg, axis: 'x', start: 'top 95%' })

    return bindPointerTilt(gsap, root.querySelectorAll('.about-principle-card'), { max: 6, scale: 1.02 })
  }, [])

  return (
    <div ref={rootRef} className="bg-[#0A0A08]">
      <section className="relative border-b border-[rgba(201,168,76,0.18)] overflow-hidden">
        <img
          src={topCover}
          alt=""
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="about-hero-img absolute inset-0 w-full h-full object-cover object-[50%_22%] brightness-[0.42] contrast-[1.05] saturate-[0.95]"
          draggable={false}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(to bottom, rgba(10,10,8,0.35) 0%, rgba(10,10,8,0.72) 55%, #0A0A08 100%),
              linear-gradient(to right, rgba(10,10,8,0.5) 0%, transparent 45%)
            `,
          }}
        />

        <div className="relative z-10 px-5 sm:px-8 md:px-16 py-16 sm:py-20 md:py-28">
          <div className="max-w-4xl">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={reduce ? false : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="section-label">About the Firm</div>
              <h1 className="font-display text-[2.4rem] sm:text-[3rem] md:text-[3.6rem] font-light leading-[1.08] tracking-[-0.01em] text-parchment mb-5 sm:mb-6">
                {about.headline.before}{' '}
                <em className="italic text-[#C9A84C]">{about.headline.accent}</em>
              </h1>
              <p className="text-[0.82rem] sm:text-[0.88rem] leading-[1.9] text-[#A89F8C] max-w-2xl">
                {about.paragraphs[0]}
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={reduce ? false : { opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 sm:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-px bg-[rgba(201,168,76,0.18)] max-w-4xl"
          >
            {about.stats.map(stat => (
              <div key={stat.label} className="bg-[rgba(10,10,8,0.88)] backdrop-blur-sm px-4 py-4 sm:py-5 text-center">
                <p className="font-display text-[1.6rem] sm:text-[2rem] font-light text-[#C9A84C] leading-none">
                  {stat.num}{stat.suffix}
                </p>
                <p className="mt-1.5 text-[0.5rem] sm:text-[0.55rem] tracking-[0.18em] uppercase text-[#8A8270]">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <AboutSection />

      <section className="section-surface px-4 sm:px-8 md:px-16 py-14 sm:py-20 md:py-24 border-b border-[rgba(201,168,76,0.12)]">
        <SectionHeader label="Our Principles" className="mb-10 md:mb-12">
          How We <em className="italic text-[#C9A84C]">Practice Law</em>
        </SectionHeader>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {about.values.map((item, i) => (
            <PrincipleCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-8 md:px-16 py-14 sm:py-20 md:py-24 border-b border-[rgba(201,168,76,0.12)] bg-[#0D0C0A]">
        <SectionHeader label="Our Story" className="mb-10 md:mb-12">
          Two Decades of <em className="italic text-[#C9A84C]">Advocacy</em>
        </SectionHeader>
        <FirmTimeline milestones={about.milestones} />
      </section>

      <section className="section-surface px-4 sm:px-8 md:px-16 py-14 sm:py-20 md:py-24 border-b border-[rgba(201,168,76,0.12)]">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-start">
          <RevealCard index={0} variant="left">
            <SectionHeader label="Jurisdiction" className="mb-6">
              Courts & <em className="italic text-[#C9A84C]">Forums</em>
            </SectionHeader>
            <p className="text-[0.78rem] sm:text-[0.82rem] leading-[1.9] text-[#8A8270] max-w-xl -mt-2">
              SLA appears before courts, tribunals, and regulatory bodies across Pakistan - from trial courts to the superior judiciary.
            </p>
            <div className="flex flex-wrap gap-2.5 mt-6">
              {about.forums.map(forum => (
                <span
                  key={forum}
                  className="hover-chip text-[0.58rem] sm:text-[0.55rem] tracking-[0.12em] uppercase px-3 py-2 border border-[rgba(201,168,76,0.22)] text-[#8A8270]"
                >
                  {forum}
                </span>
              ))}
            </div>
          </RevealCard>

          <RevealCard index={1} variant="right">
            <div className="hover-luxe-card border border-[rgba(201,168,76,0.22)] bg-[#0D0C0A] p-5 sm:p-7">
              <p className="text-[0.58rem] tracking-[0.22em] uppercase text-[#C9A84C] mb-4">Practice Coverage</p>
              <div className="grid grid-cols-2 gap-2.5">
                {about.fields.map(field => (
                  <div
                    key={field}
                    className="flex items-center gap-2.5 px-3 py-2.5 border border-[rgba(201,168,76,0.12)] bg-[#111110]"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#C9A84C] shrink-0" />
                    <span className="text-[0.68rem] sm:text-[0.72rem] text-[#A89F8C] leading-snug">{field}</span>
                  </div>
                ))}
              </div>
              <HomeSectionLink section="practice" className="group inline-flex items-center gap-2 mt-6 text-[0.62rem] tracking-[0.18em] uppercase text-[#C9A84C] no-underline hover-link">
                Explore all practice areas
                <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
              </HomeSectionLink>
            </div>
          </RevealCard>
        </div>
      </section>

      <section className="px-4 sm:px-8 md:px-16 py-14 sm:py-20 md:py-24 border-b border-[rgba(201,168,76,0.12)] bg-[#0D0C0A]">
        <SectionHeader label="Leadership" className="mb-8 sm:mb-10">
          The <em className="italic text-[#C9A84C]">Partners</em>
        </SectionHeader>
        <TeamPreview members={siteConfig.team} />
        <div className="mt-8 sm:mt-10 text-center">
          <HomeSectionLink section="team" className="btn-outline inline-flex items-center gap-2">
            Meet Our Full Team
            <ArrowRight size={14} strokeWidth={1.5} />
          </HomeSectionLink>
        </div>
      </section>

      <section className="section-surface px-4 sm:px-8 md:px-16 py-14 sm:py-20 md:py-24 border-b border-[rgba(201,168,76,0.12)]">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-14 items-stretch">
          <RevealCard index={0} variant="left">
            <div className="hover-luxe-card marble-surface h-full border border-[rgba(201,168,76,0.22)] p-6 sm:p-8">
              <p className="text-[0.58rem] tracking-[0.22em] uppercase text-[#C9A84C] mb-4">Visit Our Office</p>
              <h2 className="font-display text-[1.8rem] sm:text-[2.2rem] font-light text-parchment mb-5">
                {siteConfig.location.city}, {siteConfig.location.country}
              </h2>
              <div className="space-y-4 text-[0.78rem] leading-[1.85] text-[#8A8270]">
                <p className="flex items-start gap-3">
                  <MapPin size={16} className="text-[#C9A84C] shrink-0 mt-0.5" strokeWidth={1.5} />
                  <span>{address}</span>
                </p>
                <p className="flex items-center gap-3">
                  <Phone size={16} className="text-[#C9A84C] shrink-0" strokeWidth={1.5} />
                  <a href={phoneHref} className="no-underline text-[#8A8270] hover:text-[#C9A84C] transition-colors">
                    {siteConfig.contact.phoneDisplay}
                  </a>
                </p>
                <p className="flex items-center gap-3">
                  <Mail size={16} className="text-[#C9A84C] shrink-0" strokeWidth={1.5} />
                  <a href={emailHref} className="no-underline text-[#8A8270] hover:text-[#C9A84C] transition-colors break-all">
                    {siteConfig.contact.email}
                  </a>
                </p>
                <p className="flex items-center gap-3">
                  <Clock size={16} className="text-[#C9A84C] shrink-0" strokeWidth={1.5} />
                  <span>{siteConfig.contact.hours}</span>
                </p>
              </div>
            </div>
          </RevealCard>

          <RevealCard index={1} variant="right">
            <div className="h-full border border-[rgba(201,168,76,0.22)] bg-[#0D0C0A] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <p className="text-[0.58rem] tracking-[0.22em] uppercase text-[#C9A84C] mb-4">Start a Conversation</p>
                <h2 className="font-display text-[1.8rem] sm:text-[2.2rem] font-light text-parchment leading-[1.15] mb-4">
                  Confidential counsel.<br />
                  <em className="italic text-[#C9A84C]">Clear next steps.</em>
                </h2>
                <p className="text-[0.78rem] sm:text-[0.82rem] leading-[1.9] text-[#8A8270]">
                  Whether you need urgent representation or long-term advisory support, our team will review your matter and respond with discretion.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <HomeSectionLink section="contact" className="btn-gold text-center">
                  Speak to an Attorney
                </HomeSectionLink>
                <HomeSectionLink section="practice" className="btn-outline text-center">
                  Our Practice Areas
                </HomeSectionLink>
              </div>
            </div>
          </RevealCard>
        </div>
      </section>
    </div>
  )
}
