import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Coffee, Trophy, Gamepad2, PartyPopper, Phone, MessageCircle } from 'lucide-react'
import { telLink, menuWhatsApp } from '../lib/whatsapp.js'
import AnimatedBackground from '../components/AnimatedBackground.jsx'
import Magnetic from '../components/Magnetic.jsx'
import { Meteors, AnimatedGridPattern } from '../components/magicui/index.js'

const services = [
  { key: 'cafe', to: '/menu', icon: Coffee, color: '#D6FF00', bg: 'linear-gradient(135deg, rgba(214,255,0,0.18), rgba(214,255,0,0.04))', border: 'rgba(214,255,0,0.25)' },
  { key: 'padel', to: '/padel', icon: Trophy, color: '#52ffa8', bg: 'linear-gradient(135deg, rgba(82,255,168,0.18), rgba(82,255,168,0.04))', border: 'rgba(82,255,168,0.25)' },
  { key: 'playstation', to: '/playstation', icon: Gamepad2, color: '#c084fc', bg: 'linear-gradient(135deg, rgba(192,132,252,0.18), rgba(192,132,252,0.04))', border: 'rgba(192,132,252,0.25)' },
  { key: 'events', to: '/events', icon: PartyPopper, color: '#ff9b7a', bg: 'linear-gradient(135deg, rgba(255,155,122,0.18), rgba(255,155,122,0.04))', border: 'rgba(255,155,122,0.25)' },
]

function ServiceCard({ svc, index }) {
  const { t } = useTranslation()
  const Icon = svc.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
      transition={{ delay: 0.1 + index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <Magnetic>
        <Link to={svc.to} className="block">
          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative glass-strong rounded-3xl p-6 h-44 flex flex-col justify-between overflow-hidden group"
            style={{ borderColor: svc.border, background: svc.bg }}
          >
            <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl transition-all duration-500 group-hover:scale-150"
              style={{ background: svc.color, opacity: 0.25 }} />
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 12 }}
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${svc.border}` }}
            >
              <Icon size={22} strokeWidth={2.2} style={{ color: svc.color }} />
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight font-ar">{t(svc.key)}</h3>
              <div className="flex items-center gap-1 mt-1 text-white/40 text-xs font-medium">
                <span>Explore</span>
                <ArrowRight size={12} className="opacity-50 group-hover:translate-x-1 group-hover:opacity-100 transition-all" style={{ color: svc.color }} />
              </div>
            </div>
          </motion.div>
        </Link>
      </Magnetic>
    </motion.div>
  )
}

export default function Home() {
  const { t } = useTranslation()
  return (
    <div className="relative min-h-screen px-5 pb-10 pt-6 overflow-hidden noise-overlay">
      <AnimatedBackground />
      <AnimatedGridPattern dotColor="#E0FF00" dotSize={1.2} className="opacity-25" />
      <Meteors number={4} />

      <div className="relative z-10 max-w-md mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mt-4 mb-8"
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 12 }}
            className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden shadow-[0_0_32px_rgba(214,255,0,0.4)] inline-block"
          >
            <img src="/assets/logo.jpg" alt="GPS" className="w-full h-full object-cover" />
          </motion.div>
          <h1 className="shimmer-text text-5xl font-black tracking-tighter font-display">GPS Cafe</h1>
          <p className="text-white/40 text-sm mt-1.5 font-medium tracking-wide font-ar">{t('choose')}</p>
        </motion.div>

        {/* Services */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {services.map((s, i) => (
            <ServiceCard key={s.key} svc={s} index={i} />
          ))}
        </div>

        {/* Quick contact */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="glass-strong rounded-3xl p-5"
        >
          <p className="text-white/60 text-sm font-medium mb-4 text-center font-ar">{t('quickContact')}</p>
          <div className="grid grid-cols-2 gap-3">
            <motion.a href={telLink()} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.97 }}
              className="glass rounded-2xl py-3.5 flex items-center justify-center gap-2.5 font-semibold text-[15px] text-white/80 hover:text-accent transition-colors">
              <Phone size={18} strokeWidth={2.2} />
              <span>{t('call')}</span>
            </motion.a>
            <motion.a href={menuWhatsApp()} target="_blank" rel="noreferrer"
              whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.97 }}
              className="rounded-2xl py-3.5 flex items-center justify-center gap-2.5 font-semibold text-[15px] text-white transition-colors"
              style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)', boxShadow: '0 8px 24px -4px rgba(34,197,94,0.4)' }}>
              <MessageCircle size={18} strokeWidth={2.2} />
              <span>{t('whatsapp')}</span>
            </motion.a>
          </div>
        </motion.div>

        <p className="text-center text-white/25 text-[11px] mt-6 font-mono tracking-[0.3em] uppercase">
          GPS · Cafe · Club
        </p>
      </div>
    </div>
  )
}