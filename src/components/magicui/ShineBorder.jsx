import { motion } from 'framer-motion'

export function ShineBorder({
  borderWidth = 1.5,
  duration = 8,
  shineColor = '#E0FF00',
  className = '',
  children,
  ...props
}) {
  const colorString = Array.isArray(shineColor) ? shineColor.join(',') : shineColor
  return (
    <div className={`relative ${className}`} {...props}>
      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none will-change-[background-position]"
        style={{
          padding: `${borderWidth}px`,
          backgroundImage: `radial-gradient(transparent,transparent, ${colorString},transparent,transparent)`,
          backgroundSize: '300% 300%',
          WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
        animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
      />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  )
}