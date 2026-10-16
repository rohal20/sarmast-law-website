import { useRef } from 'react'
import { useGsapContext } from '../hooks/useGsapContext'
import { floatLoop, isMobileViewport, parallaxOnScroll } from '../utils/gsap/effects'

const shapes = [
  { id: 'ring-a', className: 'top-[12%] left-[6%] w-24 h-24 md:w-36 md:h-36', border: 'border-[rgba(201,168,76,0.22)]', rotate: 12 },
  { id: 'ring-b', className: 'top-[38%] right-[4%] w-16 h-16 md:w-28 md:h-28', border: 'border-[rgba(44,185,168,0.2)]', rotate: -18 },
  { id: 'ring-c', className: 'bottom-[18%] left-[12%] w-20 h-20 md:w-32 md:h-32', border: 'border-[rgba(201,168,76,0.16)]', rotate: 45 },
  { id: 'bracket-a', className: 'top-[22%] right-[14%] w-10 h-10 md:w-14 md:h-14', bracket: true },
  { id: 'bracket-b', className: 'bottom-[32%] right-[22%] w-8 h-8 md:w-12 md:h-12', bracket: true },
  { id: 'line-a', className: 'top-[55%] left-[3%] w-32 md:w-48 h-px', line: true },
]

export default function ScrollAmbientShapes() {
  const ref = useRef(null)

  useGsapContext(ref, (gsap) => {
    if (isMobileViewport()) return undefined
    const els = ref.current?.querySelectorAll('.gsap-ambient-shape')
    if (!els?.length) return undefined

    floatLoop(gsap, els)
    parallaxOnScroll(
      gsap,
      Array.from(els).map((el, i) => ({ el, y: 40 + i * 28 }))
    )

    return undefined
  }, [])

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden hidden md:block"
      aria-hidden="true"
    >
      {shapes.map((s) => {
        if (s.line) {
          return (
            <div
              key={s.id}
              className={`gsap-ambient-shape absolute ${s.className} opacity-30`}
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.55), transparent)',
                transform: `rotate(${s.rotate || -8}deg)`,
              }}
            />
          )
        }

        if (s.bracket) {
          return (
            <div
              key={s.id}
              className={`gsap-ambient-shape absolute ${s.className} border-t border-l border-[rgba(201,168,76,0.28)] opacity-40`}
            />
          )
        }

        return (
          <div
            key={s.id}
            className={`gsap-ambient-shape absolute rounded-full border ${s.border} ${s.className} opacity-50`}
            style={{ transform: `rotate(${s.rotate}deg)` }}
          />
        )
      })}
    </div>
  )
}
