import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Cake, Crown, Sparkles, Heart, Calendar, Users, FileText, Send, Phone, User } from 'lucide-react'
import { telLink, eventsWhatsApp } from '../lib/whatsapp.js'

const partyTypes = [
  { key: 'birthday', icon: Cake, color: '#ff9b7a' },
  { key: 'vipRoom', icon: Crown, color: '#E0FF00' },
  { key: 'event', icon: Sparkles, color: '#7dd3fc' },
  { key: 'wedding', icon: Heart, color: '#fb7185' },
]

const inputCls = 'w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3.5 text-white text-[15px] outline-none focus:border-accent/50 focus:bg-white/[0.06] transition-all placeholder-white/25 font-ar'

export default function EventsPage() {
  const { t, i18n } = useTranslation()
  const lng = i18n.language
  const isRTL = lng === 'ar'

  const [name, setName] = useState('')
  const [eventType, setEventType] = useState('birthday')
  const [pax, setPax] = useState('')
  const [date, setDate] = useState('')
  const [details, setDetails] = useState('')

  const wts = eventsWhatsApp({ name, eventType, pax, date, details })

  return (
    <div className="relative min-h-screen bg-bg noise-overlay overflow-hidden">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,rgba(224,255,0,0.3)_0%,transparent_50%)]" />

      <div className="relative z-10 max-w-md mx-auto px-5 pb-10 pt-4">
        <div className="flex items-center gap-3">
          <Link to="/home">
            <motion.div whileHover={{ x: isRTL ? 3 : -3, scale: 1.1 }} whileTap={{ scale: 0.9 }}
              className="w-9 h-9 rounded-full glass flex items-center justify-center text-white/60 hover:text-accent transition-colors">
              <ArrowLeft size={18} className={isRTL ? '' : 'rotate-180'} />
            </motion.div>
          </Link>
          <h2 className="shimmer-text text-2xl font-black tracking-tight font-display">{t('events')}</h2>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }} className="text-center mt-6 mb-7">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-3 overflow-hidden shadow-[0_0_40px_rgba(224,255,0,0.5)]">
            <img src="/assets/logo.jpg" alt="GPS" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-xl font-bold font-ar">{t('eventsWelcome')}</h1>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass-strong rounded-[2rem] p-6 space-y-4">

          {/* Name */}
          <div>
            <label className="text-white/50 text-[11px] font-bold uppercase tracking-[0.15em] flex items-center gap-1.5 mb-2 font-ar">
              <User size={12} className="text-accent" /> {isRTL ? 'الاسم' : 'Name'}
            </label>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="اكتب اسمك يا اداره"
              className={inputCls} />
          </div>

          {/* Type selector */}
          <div>
            <label className="text-white/50 text-[11px] font-bold uppercase tracking-[0.15em] flex items-center gap-1.5 mb-2 font-ar">
              <Sparkles size={12} className="text-accent" /> {t('eventType')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {partyTypes.map(p => {
                const sel = eventType === t(p.key)
                const Icon = p.icon
                return (
                  <motion.button key={p.key} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setEventType(t(p.key))}
                    className="py-3 rounded-2xl text-sm font-bold font-ar transition-all flex items-center gap-2 justify-center"
                    style={{
                      background: sel ? `${p.color}22` : 'rgba(255,255,255,0.03)',
                      color: sel ? p.color : '#9F9FAA',
                      border: `1px solid ${sel ? p.color + '44' : 'rgba(255,255,255,0.06)'}`,
                      boxShadow: sel ? `0 0 20px ${p.color}33` : 'none',
                    }}>
                    <Icon size={16} fill={sel ? 'currentColor' : 'none'} />
                    {t(p.key)}
                  </motion.button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white/50 text-[11px] font-bold uppercase tracking-[0.15em] flex items-center gap-1.5 mb-2 font-ar">
                <Users size={12} className="text-accent" /> {t('pax')}
              </label>
              <input type="number" min="1" value={pax} onChange={e => setPax(e.target.value)}
                className={inputCls} placeholder="10" />
            </div>
            <div>
              <label className="text-white/50 text-[11px] font-bold uppercase tracking-[0.15em] flex items-center gap-1.5 mb-2 font-ar">
                <Calendar size={12} className="text-accent" /> {t('date')}
              </label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className={inputCls} />
            </div>
          </div>

          <div>
            <label className="text-white/50 text-[11px] font-bold uppercase tracking-[0.15em] flex items-center gap-1.5 mb-2 font-ar">
              <FileText size={12} className="text-accent" /> {t('details')}
            </label>
            <textarea rows="2" value={details} onChange={e => setDetails(e.target.value)}
              className={`${inputCls} resize-none`} placeholder={t('details')} />
          </div>

          <motion.a href={wts} target="_blank" rel="noreferrer"
            whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
            className="w-full block py-4 rounded-2xl font-bold text-black text-center text-[15px] flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg,#E0FF00,#D4FF00)', boxShadow: '0 8px 28px -4px rgba(224,255,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)' }}>
            <Send size={18} /> {t('sendWhatsapp')}
          </motion.a>

          <motion.a href={telLink()} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
            className="w-full block py-3.5 rounded-2xl font-bold text-white/80 text-center text-[15px] flex items-center justify-center gap-2 glass">
            <Phone size={16} /> {t('callNow')}
          </motion.a>
        </motion.div>
      </div>
    </div>
  )
}