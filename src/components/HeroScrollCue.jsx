import { useEffect, useRef } from 'react'

export default function HeroScrollCue({ scrollProgressRef }) {
  const wrapRef = useRef(null)
  const lineRef = useRef(null)

  useEffect(() => {
    let raf
    const tick = () => {
      const p = scrollProgressRef?.current?.value ?? 0
      if (lineRef.current) lineRef.current.style.height = `${p * 100}%`
      if (wrapRef.current) {
        let opacity = 1
        if (p > 0.85) opacity = 0
        wrapRef.current.style.opacity = String(opacity)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [scrollProgressRef])

  return (
    <div
      ref={wrapRef}
      className="hidden md:flex absolute bottom-8 right-8 lg:right-16 z-20 flex-col items-end gap-3 pointer-events-none"
      aria-hidden="true"
    >
      <div className="relative w-px h-16 bg-[rgba(201,168,76,0.18)] overflow-hidden">
        <div
          ref={lineRef}
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#C9A84C] to-[#E8D49A]"
          style={{ height: '0%' }}
        />
      </div>
      <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] shadow-[0_0_12px_rgba(201,168,76,0.5)] animate-[bounce_2.2s_ease-in-out_infinite]" />
    </div>
  )
}
