import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.2 })

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left shadow-[0_0_18px_rgba(201,168,76,0.35)]"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, rgba(201,168,76,0), rgba(201,168,76,0.95), rgba(44,185,168,0.9), rgba(201,168,76,0))',
      }}
    />
  )
}

