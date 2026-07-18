import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AnimatedBackground from '../components/AnimatedBackground.jsx'

export default function Splash() {
  const { t, i18n } = useTranslation()
  const nav = useNavigate()
  const lng = i18n.language

  useEffect(() => {
    const timer = setTimeout(() => nav('/home', { replace: true }), 3200)
    return () => clearTimeout(timer)
  }, [nav])

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden">
      <AnimatedBackground />

      {/* Logo ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-32 h-32 mb-6"
      >
        <motion.div
          className="absolute -inset-3 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(214,255,0,0.4), transparent 70%)', filter: 'blur(20px)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border border-accent/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border border-accent/20"
          style={{ borderTopColor: '#D6FF00' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-0 rounded-full overflow-hidden shadow-[0_0_40px_rgba(214,255,0,0.25)]">
          <img src="/assets/logo.jpg" alt="GPS" className="w-full h-full object-cover" />
        </div>
      </motion.div>

      {/* Title */}
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.7, ease: 'easeOut' }}
        className="text-white/50 text-sm font-medium tracking-[0.3em] uppercase mb-2 font-ar"
      >
        {lng === 'ar' ? 'أهلاً بيك في' : 'Welcome to'}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ delay: 0.85, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="shimmer-text text-6xl font-black tracking-tighter font-display"
      >
        GPS Cafe
      </motion.h1>

      {/* Loading line */}
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 160, opacity: 1 }}
        transition={{ delay: 1.6, duration: 1.4, ease: 'easeInOut' }}
        className="h-[2px] mt-10 rounded-full"
        style={{ background: 'linear-gradient(90deg, transparent, #D6FF00, transparent)' }}
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="text-white/30 text-[11px] mt-3 font-mono tracking-widest uppercase font-ar"
        style={{ transition: 'opacity .3s' }}
      >
        {lng === 'ar' ? 'تحميل التجربة' : 'Loading Experience'}
      </motion.p>
    </div>
  )
}