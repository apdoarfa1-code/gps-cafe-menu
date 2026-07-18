import { useRef } from 'react'
import { motion } from 'framer-motion'

const ripple = (e) => {
  const btn = e.currentTarget
  const rect = btn.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const span = document.createElement('span')
  span.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:20px;height:20px;border-radius:50%;background:rgba(214,255,0,0.35);transform:translate(-50%,-50%) scale(0);animation:ripple .6s ease-out;pointer-events:none;`
  btn.appendChild(span)
  setTimeout(() => span.remove(), 700)
}

const variants = {
  primary: {
    initial: { background: 'linear-gradient(135deg,#D6FF00,#CFFF04)' },
    hover: { background: 'linear-gradient(135deg,#F3FF57,#D6FF00)' },
    text: '#050505',
  },
  ghost: {
    initial: 'transparent',
    hover: 'rgba(255,255,255,0.08)',
    text: '#fff',
    border: true,
  },
  whatsapp: {
    initial: { background: 'linear-gradient(135deg,#22c55e,#16a34a)' },
    hover: { background: 'linear-gradient(135deg,#4ade80,#22c55e)' },
    text: '#fff',
  },
}

export default function GlowButton({ children, onClick, href, variant = 'primary', className = '', icon: Icon, ...rest }) {
  const v = variants[variant] || variants.primary
  const ref = useRef(null)

  const inner = (
    <>
      {Icon && <Icon size={18} strokeWidth={2.2} className="-translate-y-[1px]" />}
      <span className="relative z-10">{children}</span>
    </>
  )

  const cls = `relative overflow-hidden inline-flex items-center gap-2 justify-center px-7 py-3.5 rounded-2xl font-semibold text-[15px] tracking-tight select-none ${className}`

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.025 }}
        whileTap={{ scale: 0.97 }}
        onClick={ripple}
        className={cls}
        style={{
          background: v.initial?.background ? v.initial.background : v.initial,
          color: v.text,
          border: v.border ? '1px solid rgba(255,255,255,0.1)' : 'none',
          boxShadow: variant === 'ghost' ? 'none' : '0 8px 24px -4px rgba(214,255,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
        }}
        {...rest}
      >
        {inner}
      </motion.a>
    )
  }
  return (
    <motion.button
      ref={ref}
      onClick={(e) => { ripple(e); onClick?.(e) }}
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.97 }}
      className={cls}
      style={{
        background: v.initial?.background ? v.initial.background : v.initial,
        color: v.text,
        border: v.border ? '1px solid rgba(255,255,255,0.1)' : 'none',
        boxShadow: variant === 'ghost' ? 'none' : '0 8px 24px -4px rgba(214,255,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
      }}
      {...rest}
    >
      {inner}
    </motion.button>
  )
}