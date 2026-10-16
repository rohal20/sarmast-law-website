import { useRef } from 'react'
import { useGsapContext } from '../hooks/useGsapContext'
import { drawLineOnScroll } from '../utils/gsap/scroll'

export default function SectionBreak() {
  const ref = useRef(null)

  useGsapContext(ref, (gsap, root) => {
    const line = root.querySelector('.gsap-break-line')
    const gem = root.querySelector('.gsap-break-gem')

    if (line) drawLineOnScroll(gsap, line, root, { duration: 1.2 })

    if (gem) {
      gsap.from(gem, {
        scale: 0,
        rotation: 90,
        opacity: 0,
        duration: 0.55,
        ease: 'back.out(2)',
        scrollTrigger: { trigger: root, start: 'top 85%', toggleActions: 'play none none none' },
      })
    }
  }, [])

  return (
    <div ref={ref} className="relative py-6 md:py-8" aria-hidden="true">
      <div
        className="gsap-break-line h-px w-full origin-center"
        style={{
          background: 'linear-gradient(90deg, transparent 5%, rgba(201,168,76,0.22) 35%, rgba(201,168,76,0.35) 50%, rgba(201,168,76,0.22) 65%, transparent 95%)',
        }}
      />
      <div
        className="gsap-break-gem absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border border-[rgba(201,168,76,0.45)] bg-[#0B0907]"
      />
    </div>
  )
}
