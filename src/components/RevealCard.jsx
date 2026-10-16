import { motion, useReducedMotion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]

export default function RevealCard({ children, index = 0, variant = 'curtain', className = '' }) {
  const reduce = useReducedMotion()
  const delay = Math.min(index * 0.08, 0.4)

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  const hidden = {
    curtain: { opacity: 0, y: 40, filter: 'blur(10px)' },
    left: { opacity: 0, x: -36, filter: 'blur(6px)' },
    right: { opacity: 0, x: 36, filter: 'blur(6px)' },
  }
  const visible = {
    curtain: { opacity: 1, y: 0, filter: 'blur(0px)' },
    left: { opacity: 1, x: 0, filter: 'blur(0px)' },
    right: { opacity: 1, x: 0, filter: 'blur(0px)' },
  }

  const v = variant in hidden ? variant : 'curtain'

  return (
    <motion.div
      className={className}
      initial={hidden[v]}
      whileInView={visible[v]}
      viewport={{ once: true, margin: '0px', amount: 0.08 }}
      transition={{ duration: 0.75, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}
