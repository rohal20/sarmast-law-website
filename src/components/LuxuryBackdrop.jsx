import { useRef } from 'react'
import { useGsapContext } from '../hooks/useGsapContext'
import { isMobileViewport, parallaxOnScroll } from '../utils/gsap/effects'

export default function LuxuryBackdrop() {
  const ref = useRef(null)

  useGsapContext(ref, (gsap) => {
    if (isMobileViewport()) return undefined
    const blobs = ref.current?.querySelectorAll('.gsap-backdrop-blob')
    if (!blobs?.length) return undefined

    parallaxOnScroll(
      gsap,
      Array.from(blobs).map((el, i) => ({
        el,
        y: 80 + i * 55,
      }))
    )

    return undefined
  }, [])

  return (
    <div ref={ref} className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 marble-base" />

      <div
        className="gsap-backdrop-blob absolute w-[min(140vw,900px)] h-[min(140vw,900px)] -top-[20%] -left-[25%] rounded-full blur-[120px] animate-aurora-a will-change-transform"
        style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 68%)' }}
      />
      <div
        className="gsap-backdrop-blob absolute w-[min(100vw,640px)] h-[min(100vw,640px)] top-[35%] -right-[20%] rounded-full blur-[100px] animate-aurora-b will-change-transform"
        style={{ background: 'radial-gradient(circle, rgba(232,201,122,0.08) 0%, transparent 65%)' }}
      />
      <div
        className="gsap-backdrop-blob absolute w-[min(80vw,520px)] h-[min(80vw,520px)] bottom-[-10%] left-[20%] rounded-full blur-[90px] animate-aurora-c will-change-transform"
        style={{ background: 'radial-gradient(circle, rgba(44,185,168,0.05) 0%, transparent 70%)' }}
      />

      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(201,168,76,0.25) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.25) 1px, transparent 1px)
          `,
          backgroundSize: '96px 96px',
          maskImage: 'radial-gradient(ellipse 90% 80% at 50% 45%, black 15%, transparent 72%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 45%, black 15%, transparent 72%)',
        }}
      />

      <div
        className="absolute top-16 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.35), rgba(232,201,122,0.45), rgba(201,168,76,0.35), transparent)' }}
      />

      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 70% at 50% 48%, transparent 35%, rgba(4,3,2,0.5) 100%)',
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }}
      />
    </div>
  )
}
