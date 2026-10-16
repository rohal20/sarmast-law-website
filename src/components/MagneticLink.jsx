import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

export default function MagneticLink({ children, className = '', strength = 0.18, onClick, ...props }) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 180, damping: 18, mass: 0.18 })
  const springY = useSpring(y, { stiffness: 180, damping: 18, mass: 0.18 })

  const handlePointerMove = (event) => {
    if (reduce) return
    const rect = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - rect.left - rect.width / 2) * strength)
    y.set((event.clientY - rect.top - rect.height / 2) * strength)
  }

  const handlePointerLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      {...props}
      data-magnetic="framer"
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      whileTap={reduce ? undefined : { scale: 0.98 }}
      style={reduce ? undefined : { x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.a>
  )
}
