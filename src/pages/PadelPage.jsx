import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Minus, Plus, Clock, User, Trophy, Calendar, ChevronDown, Ban } from 'lucide-react'
import { telLink, padelWhatsApp } from '../lib/whatsapp.js'
import { useSlotBookings } from '../hooks/useSlotBookings.jsx'

const DAYS = ['السبت','الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة']
const HOURS = Array.from({ length: 12 }, (_, i) => `${i+1}:00 ${i+1 < 12 ? 'م' : 'ص'}`)

function Picker({ title, icon: Icon, color, value, onChange, options, open, onToggle, placeholder, disabled = [], bookedLabel = 'محجوز' }) {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center gap-3 p-3.5 text-white/80 hover:text-white transition-colors">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}22`, border: `1px solid ${color}44` }}>
          <Icon size={16} style={{ color }} />
        </div>
        <div className="flex-1 text-right">
          <div className="text-[11px] text-white/40 font-ar uppercase tracking-wide">{title}</div>
          <div className="text-sm font-bold text-white truncate">{value || placeholder}</div>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown size={18} className="text-white/40" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="grid grid-cols-4 gap-2 p-3 pt-0 max-h-44 overflow-auto scrollbar-none">
              {options.map(opt => {
                const isTaken = disabled.includes(opt)
                const isSelected = value === opt
                return (
                  <button key={opt} disabled={isTaken} onClick={() => { if (!isTaken) { onChange(opt); onToggle() } }}
                    className={`py-2 rounded-xl text-xs font-bold transition-all relative ${
                      isSelected ? 'text-black' :
                      isTaken ? 'text-red-400/40 bg-red-500/5 cursor-not-allowed line-through' :
                      'text-white/60 bg-white/[0.04] hover:bg-white/[0.08]'
                    }`}
                    style={isSelected ? { background: color } : isTaken ? { border: '1px dashed rgba(239,68,68,0.2)' } : {}}>
                    {opt}
                    {isTaken && <Ban size={9} className="absolute top-1 right-1 text-red-400/50" />}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function PadelPage() {
  const { t, i18n } = useTranslation()
  const lng = i18n.language
  const isRTL = lng === 'ar'
  const { getBookedForDate } = useSlotBookings()
  const [name, setName] = useState('')
  const [hours, setHours] = useState(1)
  const [day, setDay] = useState('')
  const [hour, setHour] = useState('')
  const [openWhich, setOpenWhich] = useState(null)
  const toggle = (k) => setOpenWhich(openWhich === k ? null : k)

  // Get booked hours for the selected day (type: padel)
  const bookedHours = day
    ? getBookedForDate(day, 'padel').map(s => s.time).filter(Boolean)
    : []
  const isHourBooked = hour && bookedHours.includes(hour)
  const wts = padelWhatsApp({ name, hours, day, hour })

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video src="/assets/videos/padel.mp4" autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-35"
          onError={e => (e.target.style.display = 'none')} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black/95" />
      </div>
      <div className="absolute inset-0 opacity-25 bg-[radial-gradient(ellipse_at_top,rgba(82,255,168,0.35)_0%,transparent_60%)]" />

      <div className="relative z-10 flex flex-col min-h-screen max-w-md mx-auto px-5 pb-10">
        <div className="flex items-center gap-3 pt-4">
          <Link to="/home">
            <motion.div whileHover={{ x: isRTL ? 3 : -3, scale: 1.1 }} whileTap={{ scale: 0.9 }}
              className="w-9 h-9 rounded-full glass flex items-center justify-center text-white/60 hover:text-accent transition-colors">
              <ArrowLeft size={18} className={isRTL ? '' : 'rotate-180'} />
            </motion.div>
          </Link>
          <h2 className="text-xl font-bold font-ar text-[#52ffa8]">{t('padel')}</h2>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-5">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }} className="text-center">
            <div className="w-20 h-20 rounded-3xl mx-auto mb-3 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(82,255,168,0.25), rgba(82,255,168,0.05))', border: '1px solid rgba(82,255,168,0.3)' }}>
              <Trophy size={32} className="text-[#52ffa8]" strokeWidth={2.2} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight font-display">Padel Court</h1>
            <p className="text-white/50 text-sm mt-2 max-w-xs font-ar">{t('book')} · GPS Club</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong rounded-[2rem] p-5 w-full space-y-3">

            <div>
              <label className="text-white/50 text-[11px] font-bold uppercase tracking-[0.15em] flex items-center gap-1.5 mb-2 font-ar">
                <User size={12} className="text-accent" /> {isRTL ? 'الاسم' : 'Name'}
              </label>
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder="اكتب اسمك يا كابتن"
                className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3.5 text-white text-[15px] outline-none focus:border-accent/50 focus:bg-white/[0.06] transition-all placeholder-white/25 font-ar" />
            </div>

            <Picker title="إيمتي؟ (اليوم)" icon={Calendar} color="#52ffa8" value={day} onChange={(v) => { setDay(v); setHour('') }}
              options={DAYS} open={openWhich === 'day'} onToggle={() => toggle('day')} placeholder="اختار اليوم" />
            <Picker title="الساعة كام؟" icon={Clock} color="#52ffa8" value={hour} onChange={setHour}
              options={HOURS} open={openWhich === 'hour'} onToggle={() => toggle('hour')} placeholder="اختار الساعة"
              disabled={bookedHours} />
            <AnimatePresence>
              {isHourBooked && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                  className="glass rounded-xl p-2.5 text-red-400/80 text-xs flex items-center gap-2 border border-red-500/20 font-ar">
                  <Ban size={12} /> الساعة دي محجوزة — اختار ساعة تانية يا كابتن
                </motion.div>
              )}
            </AnimatePresence>

            <div className="text-center pt-1">
              <p className="text-white/40 text-xs uppercase tracking-[0.2em] font-medium mb-2 flex items-center justify-center gap-1.5 font-ar">
                <Clock size={12} /> {t('hours')}
              </p>
              <div className="flex items-center justify-center gap-6">
                <motion.button whileTap={{ scale: 0.85 }} onClick={() => setHours(Math.max(1, hours - 1))}
                  className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-white/80 hover:text-accent transition-all"
                  disabled={hours <= 1}>
                  <Minus size={22} />
                </motion.button>
                <motion.div key={hours} initial={{ scale: 0.7, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }} className="text-center">
                  <div className="text-5xl font-black tabular-nums text-white font-display">{hours}</div>
                  <div className="text-xs text-white/40 mt-1 font-ar">{hours === 1 ? t('hour') : t('hoursPl')}</div>
                </motion.div>
                <motion.button whileTap={{ scale: 0.85 }} onClick={() => setHours(Math.min(99, hours + 1))}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-black"
                  style={{ background: 'linear-gradient(135deg,#E0FF00,#D4FF00)', boxShadow: '0 4px 20px -2px rgba(224,255,0,0.5)' }}>
                  <Plus size={22} />
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <motion.a href={telLink()} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.97 }}
                className="glass rounded-2xl py-3.5 flex items-center justify-center gap-2 font-semibold text-[15px] text-white/80 hover:text-accent transition-colors">
                📞 {t('call')}
              </motion.a>
              <motion.a href={wts} target="_blank" rel="noreferrer"
                whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.97 }}
                className="rounded-2xl py-3.5 flex items-center justify-center gap-2 font-semibold text-[15px] text-white transition-colors"
                style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)', boxShadow: '0 8px 24px -4px rgba(34,197,94,0.4)' }}>
                💬 {t('whatsapp')}
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}