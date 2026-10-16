import { useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Gavel, Pause, Play, Scale } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import { siteConfig } from '../siteConfig'
import { useGsapContext } from '../hooks/useGsapContext'
import { wrapRevealBlock, revealBlock } from '../utils/gsap/text'
import { bindButtonPress } from '../utils/gsap/ui'
import { counterReveal } from '../utils/gsap/effects'
import { clipWipe } from '../utils/gsap/scroll'
import { pinElement, scrubDrawLine } from '../utils/gsap/pin'

const bulletin = siteConfig.courtBulletin

const typeStyles = {
  Criminal: { border: 'rgba(201,84,76,0.45)', bg: 'rgba(201,84,76,0.1)', text: '#E8A090' },
  Constitutional: { border: 'rgba(44,185,168,0.45)', bg: 'rgba(44,185,168,0.1)', text: '#5EC4B8' },
  Civil: { border: 'rgba(201,168,76,0.45)', bg: 'rgba(201,168,76,0.1)', text: '#C9A84C' },
  NAB: { border: 'rgba(160,124,48,0.5)', bg: 'rgba(160,124,48,0.12)', text: '#E8C97A' },
  Taxation: { border: 'rgba(201,168,76,0.5)', bg: 'rgba(201,168,76,0.12)', text: '#E8C97A' },
}

function getTypeStyle(type) {
  return typeStyles[type] || typeStyles.Civil
}

function BulletinCard({ item, index }) {
  const style = getTypeStyle(item.type)
  const num = String(index + 1).padStart(2, '0')

  return (
    <article className="group hover-luxe-card relative w-full min-w-0 border border-[rgba(201,168,76,0.22)] bg-[#0D0C0A] p-4 sm:p-5">
      <div
        className="absolute top-0 left-5 right-5 h-px opacity-40 group-hover:opacity-100 transition-opacity"
        style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }}
      />

      <div className="flex flex-wrap items-start justify-between gap-2 mb-2.5">
        <span className="font-display text-[1.5rem] leading-none text-[#C9A84C]/12 group-hover:text-[#C9A84C]/22 transition-colors">
          {num}
        </span>
        {item.type && (
          <span
            className="text-[0.58rem] sm:text-[0.55rem] tracking-[0.12em] uppercase px-2 py-1 border"
            style={{ borderColor: style.border, color: style.text, background: style.bg }}
          >
            {item.type}
          </span>
        )}
      </div>

      <h3 className="font-display text-[1.05rem] sm:text-[1.12rem] font-normal text-parchment leading-snug mb-1.5">
        {item.title}
      </h3>
      <p className="text-[0.6rem] sm:text-[0.63rem] tracking-[0.12em] uppercase text-[#8A8270] mb-3">
        {item.court}
      </p>

      <p className="text-[0.74rem] sm:text-[0.76rem] leading-[1.8] text-[#A89F8C] mb-3">
        <span className="font-semibold text-parchment/85">Tag Line: </span>
        {item.tagLine}{' '}
        {item.readMoreUrl && (
          <a
            href={item.readMoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5EC4B8] no-underline hover-link inline-block mt-1 sm:mt-0 sm:inline"
          >
            {item.readMoreUrl.toLowerCase().endsWith('.pdf') ? 'View / Download PDF' : 'Read more'}
          </a>
        )}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 mb-4 text-[0.7rem] sm:text-[0.72rem] leading-[1.7]">
        <p className="text-[#5EC4B8] break-words"><span className="font-semibold text-parchment/85">Matter: </span>{item.matter}</p>
        <p className="text-[#C9A84C] break-words"><span className="font-semibold text-parchment/85">Citation: </span>{item.citation}</p>
        {item.status && <p className="text-[#E8C97A] break-words"><span className="font-semibold text-parchment/85">Status: </span>{item.status}</p>}
        {item.judges && <p className="sm:col-span-2 text-[#8A8270] break-words"><span className="font-semibold text-parchment/85">Judges: </span>{item.judges}</p>}
      </div>

      <div className="flex justify-end">
        <span className="inline-block text-[0.6rem] sm:text-[0.62rem] font-semibold tracking-[0.08em] uppercase px-2.5 py-1 bg-[rgba(201,168,76,0.12)] border border-[rgba(201,168,76,0.28)] text-parchment">
          Order Date: {item.orderDate}
        </span>
      </div>
    </article>
  )
}

function BulletinPauseButton({ paused, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="mt-3 sm:mt-4 inline-flex items-center gap-2 min-h-[44px] text-[0.62rem] tracking-[0.16em] uppercase text-[#8A8270] hover:text-[#C9A84C] transition-colors cursor-pointer bg-transparent border-none px-1"
    >
      {paused ? <Play size={14} /> : <Pause size={14} />}
      {paused ? 'Resume feed' : 'Pause feed'}
    </button>
  )
}

function BulletinFeed({ items, paused, tall }) {
  const doubled = items.length > 1 ? [...items, ...items] : items
  const scrollDuration = `${Math.max(items.length * 16, 40)}s`

  if (items.length <= 1) {
    return (
      <div className="p-3 sm:p-4">
        <BulletinCard item={items[0]} index={0} />
      </div>
    )
  }

  return (
    <div className="bulletin-feed-hover relative w-full min-w-0 max-w-full overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 sm:h-16"
        style={{ background: 'linear-gradient(to bottom, #0A0A08 0%, transparent 100%)' }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 sm:h-16"
        style={{ background: 'linear-gradient(to top, #0A0A08 0%, transparent 100%)' }}
      />

      <div className={`overflow-hidden ${tall ? 'h-[min(72svh,560px)]' : 'h-[min(62svh,480px)] lg:h-[520px]'}`}>
        <div
          className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 animate-bulletin-scroll"
          style={{
            '--bulletin-duration': scrollDuration,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        >
          {doubled.map((item, i) => (
            <BulletinCard key={`${item.id}-${i}`} item={item} index={i % items.length} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function CourtBulletin() {
  const reduce = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const sectionRef = useRef(null)
  const items = bulletin.items
  const useAutoScroll = !reduce && items.length > 1

  useGsapContext(sectionRef, (gsap, root) => {
    const sub = root.querySelector('.gsap-bulletin-sub')
    if (sub) {
      const inner = wrapRevealBlock(sub)
      revealBlock(gsap, inner, {
        scrollTrigger: { trigger: sub, start: 'top 82%', toggleActions: 'play none none none' },
      })
    }

    const panel = root.querySelector('.gsap-bulletin-panel')
    if (panel) {
      clipWipe(gsap, panel, { trigger: panel, axis: 'x', start: 'top 82%' })
    }

    const feed = root.querySelector('.gsap-bulletin-feed')
    const story = root.querySelector('.gsap-bulletin-story')
    if (feed) {
      gsap.from(feed, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: feed, start: 'top 80%', toggleActions: 'play none none none' },
      })

      if (story && window.matchMedia('(min-width: 1024px)').matches) {
        pinElement({
          trigger: feed,
          pin: story,
          start: 'top top+=96',
          end: 'bottom bottom-=80',
          pinSpacing: false,
        })
      }
    }

    const divider = root.querySelector('.gsap-bulletin-line')
    if (divider) scrubDrawLine(gsap, divider, root, { axis: 'y', start: 'top 75%', end: 'top 35%' })

    root.querySelectorAll('.gsap-bulletin-stat').forEach((stat, i) => {
      const valueEl = stat.querySelector('.gsap-stat-value')
      if (valueEl && /^\d+/.test(valueEl.textContent?.trim())) {
        counterReveal(gsap, valueEl, {
          scrollTrigger: { trigger: stat, start: 'top 88%', toggleActions: 'play none none none' },
        })
      }

      gsap.from(stat, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: i * 0.08,
        ease: 'power2.out',
        scrollTrigger: { trigger: stat, start: 'top 85%', toggleActions: 'play none none none' },
      })
    })

    return bindButtonPress(gsap, root.querySelectorAll('button, a'))
  }, [])

  return (
    <section
      ref={sectionRef}
      id={bulletin.sectionId}
      className="relative w-full min-w-0 max-w-full overflow-x-hidden px-4 sm:px-8 md:px-16 py-12 sm:py-20 md:py-24 border-y border-[rgba(201,168,76,0.12)] section-surface scroll-anchor"
    >
      <div className="relative w-full min-w-0 max-w-full">
        <SectionHeader label={bulletin.label} index="02" className="mb-6 sm:mb-8">
          {bulletin.headline.before}{' '}
          <em className="italic text-[#C9A84C]">{bulletin.headline.accent}</em>
        </SectionHeader>

        <div className="grid lg:grid-cols-[minmax(0,340px)_1fr] gap-6 sm:gap-8 lg:gap-10 items-stretch -mt-2 w-full min-w-0 relative">
          <div
            className="gsap-bulletin-line hidden lg:block absolute left-[340px] top-8 bottom-8 w-px origin-top bg-gradient-to-b from-[#C9A84C] via-[#2CB9A8] to-transparent opacity-40"
            aria-hidden="true"
          />
          <div className="gsap-bulletin-story flex flex-col min-w-0 lg:self-start">
            <p className="gsap-bulletin-sub text-[0.78rem] sm:text-[0.82rem] leading-[1.85] text-[#8A8270] mb-5 sm:mb-6">
              {bulletin.subtext}
            </p>

            <div className="gsap-bulletin-panel relative border border-[rgba(201,168,76,0.25)] bg-[#0D0C0A] p-4 sm:p-6 flex-1 overflow-hidden min-w-0">
              <div className="h-0.5 mb-4 sm:mb-5" style={{ background: 'linear-gradient(90deg, #C9A84C, #2CB9A8, transparent)' }} />
              <Scale size={120} strokeWidth={0.35} className="absolute -right-4 bottom-0 text-[#C9A84C] opacity-[0.04] pointer-events-none" />

              <div className="flex items-center gap-2 mb-4">
                <Gavel size={14} className="text-[#C9A84C]" />
                <span className="text-[0.55rem] tracking-[0.22em] uppercase text-[#C9A84C] font-medium">
                  Superior Court Registry
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-5 sm:mb-6">
                {bulletin.stats?.map(stat => (
                  <div key={stat.label} className="gsap-bulletin-stat text-center border border-[rgba(201,168,76,0.15)] bg-[rgba(0,0,0,0.2)] py-3 px-2 sm:px-3 min-w-0">
                    <p className="gsap-stat-value font-display text-[1.15rem] sm:text-[1.35rem] text-[#C9A84C] leading-none">{stat.value}</p>
                    <p className="text-[0.58rem] sm:text-[0.6rem] tracking-[0.08em] uppercase text-[#8A8270] mt-1.5 leading-snug">{stat.label}</p>
                  </div>
                ))}
              </div>

              <p className="text-[0.72rem] leading-[1.8] text-[#A89F8C]">
                Reported judgments from the Sindh High Court, Appellate Tribunal, and Federal Tax Ombudsman - available as PDF.
              </p>
            </div>
          </div>

          <div className="gsap-bulletin-feed relative min-w-0 w-full max-w-full">
            <div className="flex items-center justify-center py-2.5 border border-b-0 border-[rgba(201,168,76,0.3)] bg-[rgba(201,168,76,0.06)]">
              <span className="relative flex h-1.5 w-1.5 mr-2">
                {useAutoScroll && !paused && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C9A84C] opacity-40" />
                )}
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#C9A84C]" />
              </span>
              <span className="text-[0.58rem] sm:text-[0.62rem] tracking-[0.24em] uppercase text-[#C9A84C] font-medium">
                Judgments News
              </span>
            </div>

            <div className="relative w-full min-w-0 max-w-full overflow-hidden border border-[rgba(201,168,76,0.25)] bg-[#0A0A08] shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
              {useAutoScroll ? (
                <BulletinFeed items={items} paused={paused} tall />
              ) : (
                <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 max-h-[min(72svh,560px)] overflow-y-auto overscroll-contain">
                  {items.map((item, i) => (
                    <BulletinCard key={item.id} item={item} index={i} />
                  ))}
                </div>
              )}
            </div>

            {useAutoScroll && (
              <BulletinPauseButton paused={paused} onToggle={() => setPaused(p => !p)} />
            )}

          </div>
        </div>
      </div>
    </section>
  )
}
