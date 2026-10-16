import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import RevealCard from '../components/RevealCard'
import HomeSectionLink from '../components/HomeSectionLink'
import { siteConfig } from '../siteConfig'

function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  const [ref, inView] = useInView({ triggerOnce: true })

  useEffect(() => {
    if (!inView) return
    const duration = 1800
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(current))
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, target])

  return (
    <span ref={ref} className="font-display text-[2rem] sm:text-[2.5rem] font-light text-[#C9A84C] leading-none">
      {count}{suffix}
    </span>
  )
}

const stats = siteConfig.about.stats

export default function About() {
  const paragraphs = siteConfig.about.paragraphs.slice(1)

  return (
    <section className="section-surface py-14 sm:py-20 md:py-24 px-4 sm:px-8 md:px-16 border-b border-[rgba(201,168,76,0.18)]">
      <div className="grid md:grid-cols-2 gap-10 sm:gap-16 lg:gap-24 items-center">

        <RevealCard index={0} variant="left">
          <div className="relative marble-surface hover-luxe-card border border-[rgba(201,168,76,0.22)] p-6 sm:p-8 md:p-10">
            <div className="absolute top-0 left-6 sm:left-8 right-6 sm:right-8 h-px" style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }} />

            <blockquote className="font-display text-[1.25rem] sm:text-[1.5rem] md:text-[1.75rem] font-light italic leading-[1.55] text-[#EDE6D6] mb-4">
              {siteConfig.about.quote}
            </blockquote>
            <p className="text-[0.55rem] sm:text-[0.58rem] tracking-[0.22em] uppercase text-[#C9A84C] mb-6 sm:mb-8">
              {siteConfig.about.quoteAttribution}
            </p>

            <div className="grid grid-cols-2 gap-px bg-[rgba(201,168,76,0.18)]">
              {stats.map(s => (
                <div key={s.label} className="bg-[#111110] p-4 sm:p-5 text-center">
                  <Counter target={s.num} suffix={s.suffix} />
                  <p className="text-[0.5rem] sm:text-[0.55rem] tracking-[0.2em] uppercase text-[#8A8270] mt-1.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealCard>

        <RevealCard index={1} variant="right">
          <div className="relative">
            <div className="section-label">{siteConfig.about.label}</div>
            <div className="space-y-4 sm:space-y-5 text-[0.76rem] sm:text-[0.78rem] leading-[1.9] sm:leading-[2] text-[#8A8270]">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-10">
              <HomeSectionLink section="contact" className="btn-gold inline-block text-center">
                Speak to an Attorney
              </HomeSectionLink>
              <HomeSectionLink section="practice" className="btn-outline inline-block text-center">
                Our Practice Areas
              </HomeSectionLink>
            </div>
          </div>
        </RevealCard>
      </div>
    </section>
  )
}
