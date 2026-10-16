import { useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import HomeSectionLink from '../components/HomeSectionLink'
import SectionHeader from '../components/SectionHeader'
import { siteConfig } from '../siteConfig'
import { useGsapContext } from '../hooks/useGsapContext'
import { clipStaggerReveal } from '../utils/gsap/effects'
import { bindButtonPress } from '../utils/gsap/ui'
import { bindPointerTilt } from '../utils/gsap/tilt'

const team = siteConfig.team

function TeamCard({ member, index, active, onSelect }) {
  const num = String(index + 1).padStart(2, '0')
  const isActive = active === index

  return (
    <div className="gsap-team-card-wrap h-full">
    <button
      type="button"
      onClick={() => onSelect(index)}
      className={`gsap-team-card group hover-luxe-card hover-bracket-corners relative w-full text-left border p-6 sm:p-7 cursor-pointer flex flex-col
        ${isActive
          ? 'border-[rgba(201,168,76,0.55)] bg-[rgba(201,168,76,0.05)] shadow-[0_20px_50px_rgba(0,0,0,0.4)]'
          : 'border-[rgba(201,168,76,0.18)] bg-[#0D0C0A]'}`}
    >
      <span className="corner corner-tl" aria-hidden="true" />
      <span className="corner corner-br" aria-hidden="true" />
      <div
        className="absolute top-0 left-6 right-6 h-px opacity-40 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }}
      />
      <div
        className={`absolute bottom-0 left-0 right-0 h-0.5 origin-left transition-transform duration-500
          ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
        style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }}
      />
      <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-[rgba(201,168,76,0.25)] group-hover:border-[rgba(201,168,76,0.6)] transition-colors duration-300" />

      <span className="absolute top-5 right-10 font-display text-[2.5rem] leading-none text-[#C9A84C]/10 group-hover:text-[#C9A84C]/20 transition-colors select-none">
        {num}
      </span>

      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[rgba(201,168,76,0.3)] flex items-center justify-center mb-4 sm:mb-5 bg-[rgba(201,168,76,0.05)] shrink-0 transition-all duration-500 group-hover:border-[rgba(201,168,76,0.65)] group-hover:shadow-[0_0_24px_rgba(201,168,76,0.2)] group-hover:scale-105">
        <span className="font-display text-lg sm:text-xl font-light text-[#C9A84C]">{member.initials}</span>
      </div>

      <h3 className="relative z-10 font-display text-[1.2rem] sm:text-[1.35rem] font-normal text-parchment leading-tight mb-1.5 transition-colors duration-300 group-hover:text-[#E8D49A]">{member.name}</h3>
      <p className="relative z-10 text-[0.55rem] sm:text-[0.58rem] tracking-[0.2em] uppercase text-[#C9A84C] mb-3 sm:mb-4">{member.role}</p>
      <p className="relative z-10 shrink-0 text-[0.8rem] sm:text-[0.84rem] leading-[1.9] text-[#E2DBC8] mb-5 pb-5 border-b border-[rgba(201,168,76,0.15)]">
        {member.spec}
      </p>

      <div className="relative z-10 flex flex-wrap gap-2 pt-1">
        {member.areas.map(a => (
          <span key={a} className="hover-chip text-[0.58rem] sm:text-[0.55rem] tracking-[0.12em] sm:tracking-[0.14em] uppercase px-2.5 py-1.5 border border-[rgba(201,168,76,0.2)] text-[#8A8270]">
            <span>{a}</span>
          </span>
        ))}
      </div>
    </button>
    </div>
  )
}

export default function Team() {
  const [active, setActive] = useState(0)
  const sectionRef = useRef(null)

  useGsapContext(sectionRef, (gsap, root) => {
    const grid = root.querySelector('.gsap-team-grid')
    if (grid) clipStaggerReveal(gsap, grid, '.gsap-team-card-wrap')

    const cta = root.querySelector('.gsap-team-cta')
    if (cta) {
      gsap.from(cta, {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: cta, start: 'top 88%', toggleActions: 'play none none none' },
      })
    }

    const cardCleanup = bindPointerTilt(gsap, root.querySelectorAll('.gsap-team-card'), { max: 7, scale: 1.02 })
    const btnCleanup = bindButtonPress(gsap, root.querySelectorAll('.gsap-team-cta'))

    return () => {
      cardCleanup?.()
      btnCleanup?.()
    }
  }, [])

  return (
    <section ref={sectionRef} id="team" className="section-surface scroll-anchor py-14 sm:py-20 md:py-24 px-4 sm:px-8 md:px-16 border-y border-[rgba(201,168,76,0.12)]">
      <SectionHeader label="The Team" index="03">
        Meet Our <em className="italic text-[#C9A84C]">Attorneys</em>
      </SectionHeader>

      <div className="gsap-team-grid grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-start -mt-2 md:-mt-4 w-full min-w-0">
        {team.map((m, i) => (
          <TeamCard key={m.initials} member={m} index={i} active={active} onSelect={setActive} />
        ))}
      </div>

      <div className="gsap-team-cta mt-10 sm:mt-12 flex justify-center">
        <HomeSectionLink
          section="contact"
          className="group inline-flex items-center gap-3 min-h-[44px] text-[0.62rem] tracking-[0.2em] uppercase text-[#8A8270] no-underline hover:text-[#C9A84C] transition-colors"
        >
          <span className="w-8 h-px bg-[#8A8270]/40 group-hover:bg-[#C9A84C] transition-colors" />
          Speak with our team
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          <span className="w-8 h-px bg-[#8A8270]/40 group-hover:bg-[#C9A84C] transition-colors" />
        </HomeSectionLink>
      </div>
    </section>
  )
}
