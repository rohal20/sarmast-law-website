import FadeIn from '../components/FadeIn'
import HomeSectionLink from '../components/HomeSectionLink'
import { siteConfig } from '../siteConfig'

function Section({ title, children }) {
  return (
    <section className="border border-[rgba(201,168,76,0.18)] bg-[#0D0C0A]">
      <div className="px-7 md:px-10 py-8">
        <h2 className="font-display text-2xl md:text-[1.9rem] font-light text-parchment mb-4">{title}</h2>
        <div className="text-[0.8rem] leading-[2] text-[#8A8270] space-y-4">{children}</div>
      </div>
    </section>
  )
}

export default function LegalPage({ title, subtitle, lastUpdated, sections }) {
  return (
    <div className="px-8 md:px-16 py-16">
      <FadeIn>
        <div className="section-label">Legal</div>
        <h1 className="font-display text-[2.6rem] md:text-[3.2rem] font-light leading-[1.1] mb-4">
          {title.split(' ').slice(0, -1).join(' ')}{' '}
          <em className="italic text-[#C9A84C]">{title.split(' ').slice(-1)}</em>
        </h1>
        <p className="text-[0.85rem] leading-[1.9] text-[#8A8270] max-w-2xl">
          {subtitle}
        </p>
        <p className="text-[0.6rem] tracking-[0.18em] uppercase text-[#8A8270] mt-5">
          Last updated: {lastUpdated} · {siteConfig.firmName}
        </p>
      </FadeIn>

      <div className="mt-10 space-y-6">
        {sections.map(s => (
          <FadeIn key={s.title} delay={0.05}>
            <Section title={s.title}>{s.content}</Section>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.1}>
        <div className="mt-10 border border-[rgba(201,168,76,0.18)] bg-[#111110] px-7 md:px-10 py-7">
          <p className="text-[0.72rem] leading-[1.9] text-[#8A8270]">
            {siteConfig.legal.disclaimerShort}
          </p>
          <div className="mt-4">
            <HomeSectionLink section="contact" className="btn-outline">
              Contact us
            </HomeSectionLink>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}

