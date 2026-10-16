export default function PracticeAmbient() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="gsap-practice-orb absolute -top-[10%] right-[-5%] w-[min(70vw,520px)] h-[min(70vw,520px)] rounded-full will-change-transform"
        style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 68%)' }}
      />
      <div
        className="gsap-practice-orb absolute bottom-[-15%] left-[-8%] w-[min(55vw,400px)] h-[min(55vw,400px)] rounded-full will-change-transform"
        style={{ background: 'radial-gradient(circle, rgba(44,185,168,0.03) 0%, transparent 70%)' }}
      />
      <div className="gsap-practice-orb absolute top-[40%] left-[45%] w-32 h-32 rounded-full border border-[rgba(201,168,76,0.12)] opacity-30 hidden md:block" />
    </div>
  )
}
