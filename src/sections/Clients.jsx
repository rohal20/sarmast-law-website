import { useRef } from 'react'
import {
  ArrowRight,
  Cpu,
  Factory,
  Globe2,
  Newspaper,
  Radio,
  MonitorSmartphone,
  Wheat,
} from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import HomeSectionLink from '../components/HomeSectionLink'
import { siteConfig } from '../siteConfig'
import { useGsapContext } from '../hooks/useGsapContext'
import { splitChars, revealChars, wrapRevealBlock, revealBlock } from '../utils/gsap/text'
import { isMobileViewport, counterReveal } from '../utils/gsap/effects'
import { bindButtonPress } from '../utils/gsap/ui'
import { pointerTilt, magnetize, bindMagnetic } from '../utils/gsap/tilt'

const clients = siteConfig.clients
const totalOrgs = 1 + (clients.house?.entities?.length || 0) + clients.roster.length

const sectorIcons = {
  tech: Cpu,
  trade: Globe2,
  comms: Radio,
  factory: Factory,
  digital: MonitorSmartphone,
  food: Wheat,
  media: Newspaper,
}

function initialsFrom(name) {
  return name
    .split(/[\s&-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('')
}

/** Radial spotlight follows the cursor without React state (no re-render). */
function trackSpotlight(e) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${e.clientX - r.left}px`)
  el.style.setProperty('--my', `${e.clientY - r.top}px`)
}

function FeaturedClient({ client }) {
  return (
    <div onMouseMove={trackSpotlight} className="gsap-client-featured client-spotlight gradient-border-wrap h-full">
      <div className="gradient-border-inner client-featured relative h-full flex flex-col justify-between p-6 sm:p-8 md:p-9 overflow-hidden">
        <div className="client-spot" aria-hidden="true" />

        {/* Parallax watermark — desktop only motion */}
        <span
          className="gsap-client-watermark pointer-events-none absolute -right-4 sm:-right-2 top-1/2 -translate-y-1/2 font-display font-light leading-none select-none text-[#C9A84C]/[0.055] tracking-[-0.04em] whitespace-nowrap"
          style={{ fontSize: 'clamp(5.5rem, 18vw, 11rem)' }}
          aria-hidden="true"
        >
          POPULAR
        </span>

        <div className="relative z-[1]">
          <div className="flex items-center gap-2 text-[0.56rem] tracking-[0.24em] uppercase text-[#C9A84C] mb-6">
            <span className="gsap-client-label-line block w-6 h-px origin-left bg-[#C9A84C]" />
            Flagship Client
          </div>

          <div className="flex items-start gap-4 sm:gap-5">
            <div className="gsap-client-mono relative shrink-0 w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] border border-[rgba(201,168,76,0.4)] bg-[rgba(201,168,76,0.06)] flex items-center justify-center will-change-transform">
              <span
                className="gsap-mono-flash pointer-events-none absolute inset-0 bg-[#C9A84C]/20 opacity-0"
                aria-hidden="true"
              />
              <span className="relative font-display text-2xl sm:text-[1.75rem] font-light text-[#E8C97A] leading-none tracking-tight">
                {initialsFrom(client.name)}
              </span>
            </div>
            <div className="min-w-0">
              <h3 className="gsap-client-name font-display text-[1.75rem] sm:text-[2.15rem] md:text-[2.35rem] font-light leading-[1.08] text-parchment">
                {client.name}
              </h3>
              <p className="gsap-client-sector mt-1.5 text-[0.6rem] sm:text-[0.62rem] tracking-[0.18em] uppercase text-[#C9A84C] overflow-hidden">
                <span className="gsap-sector-inner inline-block">{client.sector}</span>
              </p>
            </div>
          </div>
        </div>

        <p className="gsap-client-note relative z-[1] mt-7 text-[0.82rem] sm:text-[0.86rem] leading-[1.85] text-[#A89F8C] max-w-md">
          {client.note}
        </p>
      </div>
    </div>
  )
}

function PopularHouse({ house }) {
  if (!house?.entities?.length) return null

  return (
    <div className="gsap-client-house relative h-full flex flex-col border border-[rgba(201,168,76,0.18)] bg-[#0D0C0A] p-5 sm:p-6 md:p-7 overflow-hidden">
      <div
        className="pointer-events-none absolute -right-8 -top-10 w-40 h-40 rounded-full opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.14), transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative flex items-center justify-between gap-3 mb-5 sm:mb-6">
        <div className="flex items-center gap-2 text-[0.56rem] tracking-[0.22em] uppercase text-[#C9A84C]">
          <span className="gsap-house-label-line block w-5 h-px origin-left bg-[#C9A84C]" />
          {house.label}
        </div>
        <span className="text-[0.52rem] tracking-[0.16em] uppercase text-[#8A8270]">
          {String(house.entities.length).padStart(2, '0')} entities
        </span>
      </div>

      <div className="relative flex flex-1 gap-3 sm:gap-4">
        {/* Constellation thread */}
        <div className="relative w-px shrink-0 self-stretch ml-[0.55rem] sm:ml-[0.65rem]" aria-hidden="true">
          <div className="absolute inset-0 bg-[rgba(201,168,76,0.12)]" />
          <div
            className="gsap-house-thread absolute top-0 left-0 w-full origin-top"
            style={{
              height: '100%',
              background: 'linear-gradient(to bottom, #E8C97A, #C9A84C, #2CB9A8)',
              boxShadow: '0 0 10px rgba(201,168,76,0.35)',
              transform: 'scaleY(0)',
            }}
          />
        </div>

        <ul className="relative flex flex-col flex-1 min-w-0">
          {house.entities.map((entity, i) => (
            <li
              key={entity.name}
              className="gsap-house-row group relative flex items-start gap-3 sm:gap-4 py-3.5 sm:py-4 border-t border-[rgba(201,168,76,0.12)] first:border-t-0 first:pt-0 last:pb-0"
            >
              <span className="gsap-house-node absolute -left-[1.05rem] sm:-left-[1.2rem] top-[1.15rem] w-2 h-2 rounded-full border border-[#C9A84C] bg-[#0D0C0A] shadow-[0_0_0_0_rgba(201,168,76,0.5)] group-hover:bg-[#C9A84C] group-hover:shadow-[0_0_14px_rgba(201,168,76,0.8)] transition-all duration-300" aria-hidden="true" />

              <span className="font-display text-[0.95rem] leading-none text-[#C9A84C]/45 mt-0.5 tabular-nums shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-[1.05rem] sm:text-[1.15rem] font-light leading-[1.2] text-parchment group-hover:text-[#E8D49A] transition-colors duration-300">
                  {entity.name}
                  {entity.legal ? (
                    <span className="ml-1.5 text-[0.55rem] tracking-[0.14em] uppercase text-[#8A8270] align-middle">
                      {entity.legal}
                    </span>
                  ) : null}
                </p>
                <p className="gsap-house-sector mt-1 text-[0.52rem] tracking-[0.18em] uppercase text-[#8A8270] overflow-hidden">
                  <span className="gsap-sector-inner inline-block">{entity.sector}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative mt-5 pt-4 border-t border-[rgba(201,168,76,0.12)] text-[0.62rem] leading-[1.7] text-[#8A8270]/85">
        Represented as a connected group — corporate counsel across the Popular constellation.
      </p>
    </div>
  )
}

function CounselLedger({ roster }) {
  return (
    <div className="gsap-client-ledger mt-5 sm:mt-6 md:mt-8">
      <div className="flex items-end justify-between gap-4 mb-4 sm:mb-5">
        <div className="flex items-center gap-2 text-[0.56rem] tracking-[0.22em] uppercase text-[#C9A84C]">
          <span className="gsap-ledger-label-line block w-5 h-px origin-left bg-[#C9A84C]" />
          Independent Counsel
        </div>
        <span className="text-[0.52rem] tracking-[0.16em] uppercase text-[#8A8270]">
          {String(roster.length).padStart(2, '0')} organisations
        </span>
      </div>

      <ol className="border-y border-[rgba(201,168,76,0.16)]">
        {roster.map((client, i) => {
          const Icon = sectorIcons[client.icon] || Globe2
          return (
            <li
              key={client.name}
              className="gsap-ledger-row group relative"
              onMouseMove={trackSpotlight}
            >
              <div className="client-spotlight relative flex items-center gap-3 sm:gap-5 md:gap-6 py-4 sm:py-5 border-t border-[rgba(201,168,76,0.1)] first:border-t-0">
                <div className="client-spot" aria-hidden="true" />

                {/* Ink-draw rule under each row */}
                <span
                  className="gsap-ledger-ink pointer-events-none absolute left-0 right-0 bottom-0 h-px origin-left"
                  style={{ background: 'linear-gradient(90deg, #C9A84C, rgba(44,185,168,0.55), transparent)' }}
                  aria-hidden="true"
                />

                <span className="relative font-display text-[0.95rem] sm:text-[1.05rem] leading-none text-[#C9A84C]/40 tabular-nums w-7 sm:w-8 shrink-0 group-hover:text-[#C9A84C] transition-colors duration-300">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className="gsap-ledger-icon relative hidden sm:flex w-10 h-10 shrink-0 items-center justify-center border border-[rgba(201,168,76,0.22)] text-[#C9A84C] transition-all duration-300 group-hover:border-[rgba(201,168,76,0.55)] group-hover:shadow-[0_0_18px_rgba(201,168,76,0.16)] will-change-transform">
                  <Icon size={16} strokeWidth={1.5} />
                </div>

                <div className="relative min-w-0 flex-1 grid sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-1 sm:gap-4 items-baseline">
                  <div className="min-w-0">
                    <p className="gsap-ledger-name client-letter-spread font-display text-[1.12rem] sm:text-[1.28rem] md:text-[1.35rem] font-light leading-[1.15] text-parchment truncate group-hover:text-[#E8D49A] transition-[color,letter-spacing] duration-500">
                      {client.name}
                    </p>
                    {client.legal ? (
                      <p className="mt-0.5 text-[0.5rem] tracking-[0.16em] uppercase text-[#8A8270]/80 sm:hidden">
                        {client.legal}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 min-w-0">
                    {client.legal ? (
                      <span className="hidden sm:inline text-[0.5rem] tracking-[0.14em] uppercase text-[#8A8270]/70 shrink-0">
                        {client.legal}
                      </span>
                    ) : null}
                    <p className="gsap-ledger-sector overflow-hidden text-[0.55rem] sm:text-[0.58rem] tracking-[0.16em] uppercase text-[#8A8270] group-hover:text-[#C9A84C] transition-colors duration-300 truncate sm:text-right">
                      <span className="gsap-sector-inner inline-block">{client.sector}</span>
                    </p>
                  </div>
                </div>

                <span
                  className="relative hidden md:block w-0 group-hover:w-8 h-px shrink-0 transition-all duration-500 origin-left"
                  style={{ background: 'linear-gradient(90deg, #C9A84C, transparent)' }}
                  aria-hidden="true"
                />
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default function Clients() {
  const sectionRef = useRef(null)

  useGsapContext(sectionRef, (gsap, root) => {
    const mobile = isMobileViewport()
    const cleanups = []

    const subtitle = root.querySelector('.gsap-client-subtitle')
    if (subtitle) {
      const inner = wrapRevealBlock(subtitle)
      revealBlock(gsap, inner, {
        scrollTrigger: { trigger: subtitle, start: 'top 86%', toggleActions: 'play none none none' },
      })
    }

    // Count-up tally
    const countEl = root.querySelector('.gsap-client-count')
    if (countEl) counterReveal(gsap, countEl)

    // Label ink lines
    ;['.gsap-client-label-line', '.gsap-house-label-line', '.gsap-ledger-label-line'].forEach((sel) => {
      const line = root.querySelector(sel)
      if (!line) return
      gsap.set(line, { scaleX: 0, transformOrigin: 'left center' })
      gsap.to(line, {
        scaleX: 1,
        duration: 0.85,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: line, start: 'top 90%', toggleActions: 'play none none none' },
      })
    })

    const featured = root.querySelector('.gsap-client-featured')
    if (featured) {
      gsap.from(featured, {
        y: 44,
        opacity: 0,
        filter: mobile ? 'none' : 'blur(8px)',
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: featured, start: 'top 82%', toggleActions: 'play none none none' },
      })

      const nameEl = root.querySelector('.gsap-client-name')
      if (nameEl) {
        const chars = splitChars(nameEl)
        revealChars(gsap, chars, {
          stagger: 0.035,
          duration: 0.85,
          scrollTrigger: { trigger: featured, start: 'top 78%', toggleActions: 'play none none none' },
        })
      }

      // Sector wipe
      const sectorInner = featured.querySelector('.gsap-sector-inner')
      if (sectorInner) {
        gsap.from(sectorInner, {
          xPercent: 40,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: featured, start: 'top 74%', toggleActions: 'play none none none' },
        })
      }

      const noteEl = root.querySelector('.gsap-client-note')
      if (noteEl) {
        const inner = wrapRevealBlock(noteEl)
        revealBlock(gsap, inner, {
          y: 20,
          scrollTrigger: { trigger: featured, start: 'top 72%', toggleActions: 'play none none none' },
        })
      }

      // Monogram stamp press + flash + float
      const mono = root.querySelector('.gsap-client-mono')
      if (mono) {
        const flash = mono.querySelector('.gsap-mono-flash')
        const stamp = gsap.timeline({
          scrollTrigger: { trigger: featured, start: 'top 80%', toggleActions: 'play none none none' },
        })
        stamp
          .from(mono, { scale: 1.28, opacity: 0, duration: 0.55, ease: 'power3.out' }, 0)
          .to(mono, { scale: 0.94, duration: 0.14, ease: 'power2.in' }, 0.45)
          .to(mono, { scale: 1, duration: 0.35, ease: 'power3.out' }, 0.58)
        if (flash) {
          stamp
            .fromTo(flash, { opacity: 0 }, { opacity: 1, duration: 0.12 }, 0.5)
            .to(flash, { opacity: 0, duration: 0.45 }, 0.62)
        }
        if (!mobile) {
          gsap.to(mono, {
            y: '+=6',
            duration: 3.2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 1.2,
          })
          cleanups.push(magnetize(gsap, mono, { strength: 0.35 }))
        }
      }

      // Watermark parallax (desktop)
      const watermark = root.querySelector('.gsap-client-watermark')
      if (watermark && !mobile) {
        gsap.fromTo(
          watermark,
          { x: 40, opacity: 0 },
          {
            x: -50,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: featured,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.4,
            },
          }
        )
      }
    }

    const house = root.querySelector('.gsap-client-house')
    if (house) {
      gsap.from(house, {
        y: 36,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: { trigger: house, start: 'top 84%', toggleActions: 'play none none none' },
      })

      // Constellation thread grows
      const thread = house.querySelector('.gsap-house-thread')
      if (thread) {
        gsap.fromTo(
          thread,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 1.15,
            ease: 'power2.inOut',
            scrollTrigger: { trigger: house, start: 'top 78%', toggleActions: 'play none none none' },
          }
        )
      }

      const rows = house.querySelectorAll('.gsap-house-row')
      gsap.from(rows, {
        y: 18,
        opacity: 0,
        duration: 0.55,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: house, start: 'top 78%', toggleActions: 'play none none none' },
      })

      // Node pulse as rows land
      const nodes = house.querySelectorAll('.gsap-house-node')
      nodes.forEach((node, i) => {
        gsap.fromTo(
          node,
          { scale: 0, boxShadow: '0 0 0 0 rgba(201,168,76,0.5)' },
          {
            scale: 1,
            boxShadow: '0 0 12px 2px rgba(201,168,76,0.35)',
            duration: 0.45,
            delay: 0.12,
            ease: 'back.out(2.2)',
            scrollTrigger: { trigger: rows[i] || house, start: 'top 82%', toggleActions: 'play none none none' },
          }
        )
      })

      house.querySelectorAll('.gsap-sector-inner').forEach((el) => {
        gsap.from(el, {
          xPercent: 35,
          opacity: 0,
          duration: 0.55,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
        })
      })
    }

    const ledger = root.querySelector('.gsap-client-ledger')
    if (ledger) {
      const ledgerRows = ledger.querySelectorAll('.gsap-ledger-row')

      gsap.from(ledgerRows, {
        y: 28,
        opacity: 0,
        duration: 0.65,
        stagger: 0.07,
        ease: 'power3.out',
        scrollTrigger: { trigger: ledger, start: 'top 84%', toggleActions: 'play none none none' },
      })

      // Ink-draw under each row
      ledgerRows.forEach((row) => {
        const ink = row.querySelector('.gsap-ledger-ink')
        if (!ink) return
        gsap.set(ink, { scaleX: 0, transformOrigin: 'left center' })
        gsap.to(ink, {
          scaleX: 1,
          duration: 0.9,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: row, start: 'top 88%', toggleActions: 'play none none none' },
        })

        const sectorInner = row.querySelector('.gsap-sector-inner')
        if (sectorInner) {
          gsap.from(sectorInner, {
            xPercent: 40,
            opacity: 0,
            duration: 0.55,
            ease: 'power3.out',
            scrollTrigger: { trigger: row, start: 'top 88%', toggleActions: 'play none none none' },
          })
        }
      })

      // Magnetic icons (desktop)
      if (!mobile) {
        cleanups.push(bindMagnetic(gsap, ledger.querySelectorAll('.gsap-ledger-icon'), { strength: 0.32 }))
      }
    }

    const featuredEl = root.querySelector('.gsap-client-featured')
    if (!mobile && featuredEl) {
      cleanups.push(pointerTilt(gsap, featuredEl, { max: 5, scale: 1.01 }))
    }
    cleanups.push(bindButtonPress(gsap, root.querySelectorAll('.gsap-client-cta')))

    return () => cleanups.forEach((fn) => typeof fn === 'function' && fn())
  }, [])

  return (
    <section
      ref={sectionRef}
      id={clients.sectionId}
      className="section-surface scroll-anchor py-14 sm:py-20 md:py-24 px-4 sm:px-8 md:px-16 border-y border-[rgba(201,168,76,0.12)]"
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-2">
        <SectionHeader label={clients.label} index="04" className="!mb-0 flex-1">
          {clients.headline.before} <em className="italic text-[#C9A84C]">{clients.headline.accent}</em>
        </SectionHeader>

        <div className="gsap-client-tally shrink-0 flex items-baseline gap-2.5 md:pb-2 md:pl-6">
          <span className="gsap-client-count font-display text-[2.4rem] sm:text-[2.8rem] leading-none text-[#C9A84C] tabular-nums">
            {totalOrgs}
          </span>
          <span className="text-[0.55rem] tracking-[0.16em] uppercase text-[#8A8270] leading-tight max-w-[7.5rem]">
            organisations · counsel retained
          </span>
        </div>
      </div>

      <p className="gsap-client-subtitle text-[0.81rem] sm:text-[0.85rem] leading-[1.85] text-[#8A8270] max-w-[560px] mt-6 md:mt-8 mb-8 sm:mb-10">
        {clients.subtext}
      </p>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 items-stretch">
        <FeaturedClient client={clients.featured} />
        <PopularHouse house={clients.house} />
      </div>

      <CounselLedger roster={clients.roster} />

      <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-[0.68rem] leading-[1.7] text-[#8A8270]/80 max-w-lg">
          {clients.note}
        </p>
        <HomeSectionLink
          section={clients.cta.section}
          className="gsap-client-cta group inline-flex items-center gap-2.5 shrink-0 text-[0.62rem] tracking-[0.2em] uppercase text-[#C9A84C] no-underline hover-link"
        >
          {clients.cta.label}
          <ArrowRight size={13} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-1" />
        </HomeSectionLink>
      </div>
    </section>
  )
}
