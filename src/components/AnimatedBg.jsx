// Reanimated animated SVG component used as background — replaces missing video
// files. Renders smooth gradient + subtle moving shapes. Pure CSS, no media.
import { motion } from 'framer-motion'

export default function AnimatedBg({ variant = 'padel', className = '' }) {
  const colors = variant === 'padel'
    ? { primary: '#52ffa8', secondary: '#0e3b25', accent: '#a3ffd5' }
    : { primary: '#c084fc', secondary: '#3a1e63', accent: '#e9c6ff' }

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Deep gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${colors.secondary}66 0%, transparent 70%), radial-gradient(ellipse at 80% 90%, ${colors.primary}22 0%, transparent 60%), #000`
        }}
      />

      {/* Slow diagonal-moving bands */}
      <motion.div
        className="absolute -inset-x-1/4 top-1/4 h-1/2 opacity-30 blur-3xl"
        style={{
          background: `linear-gradient(45deg, ${colors.primary}55, transparent 60%)`
        }}
        animate={{ x: ['-25%', '25%', '-25%'], y: ['0%', '8%', '0%'] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -inset-x-1/4 bottom-1/4 h-1/2 opacity-25 blur-3xl"
        style={{
          background: `linear-gradient(-45deg, ${colors.accent}44, transparent 60%)`
        }}
        animate={{ x: ['25%', '-25%', '25%'], y: ['0%', '-6%', '0%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Subtle moving grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-15" aria-hidden="true">
        <defs>
          <pattern id={`g-${variant}`} width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={colors.primary} strokeWidth="0.5" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#g-${variant})`} />
      </svg>

      {/* Top vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
    </div>
  )
}
