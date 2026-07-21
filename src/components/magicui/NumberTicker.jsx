import { motion } from 'framer-motion'

export function NumberTicker({ value, duration = 2, className = '', prefix = '', suffix = '' }) {
  return (
    <motion.span
      className={`inline-block tabular-nums tracking-wider ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      key={value}
    >
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="inline-block"
      >
        {prefix}{value}{suffix}
      </motion.span>
    </motion.span>
  )
}