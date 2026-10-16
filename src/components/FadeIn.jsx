import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'

export default function FadeIn({ children, delay = 0, direction = 'up', className = '' }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.12 })

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
      filter: 'blur(10px)',
      scale: 0.97,
    },
    visible: { opacity: 1, y: 0, x: 0, filter: 'blur(0px)', scale: 1 },
  }

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ duration: 0.95, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
