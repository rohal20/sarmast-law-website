import { motion } from 'framer-motion'

export default function RevealLine() {
  return (
    <div className="relative h-px w-full overflow-hidden">
      <motion.div
        className="absolute inset-y-0 left-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), #C9A84C, rgba(201,168,76,0.5), transparent)',
        }}
        initial={{ width: '0%', opacity: 0 }}
        whileInView={{ width: '100%', opacity: 1 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  )
}
