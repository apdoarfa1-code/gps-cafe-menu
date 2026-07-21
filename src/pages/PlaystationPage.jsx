import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Gamepad2, Sofa, User, Clock, Calendar, ChevronDown, Plus, Minus, Ban } from 'lucide-react'
import { telLink, playstationWhatsApp } from '../lib/whatsapp.js'
import { useSlotBookings } from '../hooks/useSlotBookings.jsx'
import { ShineBorder, Meteors, AnimatedGridPattern } from '../components/magicui/index.js'

const DAYS = ['السبت','الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة']
const HOURS = Array.from({ length: 12 }, (_, i) => `${i+1}:00 ${i+1 < 12 ? 'م' : 'ص'}`)

function Accordion({ title, icon: Icon, color, value, onChange, options, open, onToggle, placeholder, disabled = [] }) {
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

function BookingCard({ icon: Icon, accent, title, subtitle, name, setName, day, setDay, hour, setHour, t, label, placeholder, slotType = 'playstation' }) {
  const [openWhich, setOpenWhich] = useState(null)
  const toggle = (k) => setOpenWhich(openWhich === k ? null : k)
  const { getBookedForDate, bookSlot } = useSlotBookings()
  const bookedHours = day ? getBookedForDate(day, slotType).map(s => s.time).filter(Boolean) : []
  const availableHours = HOURS.filter(h => !bookedHours.includes(h))
  const isHourBooked = hour && bookedHours.includes(hour)
  const wts = playstationWhatsApp({ name, type: title, day, hour })

  const handleBook = () => {
    if (name && day && hour && !isHourBooked) bookSlot(day, hour, slotType, name)
    window.open(wts, '_blank', 'noopener')
  }

  return (
    <ShineBorder shineColor={accent} duration={6} className="rounded-3xl w-full">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        className="glass-strong rounded-3xl p-5 w-full space-y-3"
        style={{ borderColor: `${accent}22` }}>
      <div className="flex items-center gap-3 mb-1">
        <motion.div whileHover={{ rotate: 8, scale: 1.1 }}
          className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${accent}33, ${accent}08)`, border: `1px solid ${accent}55` }}>
          <Icon size={26} style={{ color: accent }} strokeWidth={2.2} />
        </motion.div>
        <div className="flex-1">
          <h3 className="text-lg font-bold font-ar" style={{ color: accent }}>{title}</h3>
          <p className="text-white/40 text-xs mt-0.5 font-ar">{subtitle}</p>
        </div>
        <motion.button onClick={handleBook} disabled={!name || !day || !hour || isHourBooked}
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
          className="w-11 h-11 rounded-full flex items-center justify-center text-black flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, boxShadow: `0 4px 18px -2px ${accent}66` }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </motion.button>
      </div>

      <div>
        <label className="text-white/50 text-[11px] font-bold uppercase tracking-[0.15em] flex items-center gap-1.5 mb-2 font-ar">
          <User size={12} className="text-accent" /> {label || 'الاسم'}
        </label>
        <input value={name} onChange={e => setName(e.target.value)}
          placeholder={placeholder || 'اكتب اسمك يانجم'}
          className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3.5 text-white text-[15px] outline-none focus:border-accent/50 focus:bg-white/[0.06] transition-all placeholder-white/25 font-ar" />
      </div>

      <Accordion title="إيمتي؟ (اليوم)" icon={Calendar} color={accent} value={day} onChange={(v) => { setDay(v); setHour('') }}
        options={DAYS} open={openWhich === 'day'} onToggle={() => toggle('day')} placeholder="اختار اليوم" />
      <Accordion title="الساعة كام؟" icon={Clock} color={accent} value={hour} onChange={setHour}
        options={availableHours} open={openWhich === 'hour'} onToggle={() => toggle('hour')} placeholder={availableHours.length === 0 ? 'كل الساعات محجوزة' : 'اختار الساعة'} />
      <AnimatePresence>
        {isHourBooked && (
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
            className="glass rounded-2xl p-3 text-red-400/90 text-sm flex items-center gap-2 border border-red-500/30 font-ar">
            <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center flex-shrink-0">
              <Ban size={18} className="text-red-400" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-red-400">الساعة دي محجوزة يا نجم</div>
              <div className="text-xs text-red-400/70 mt-0.5">اختار ساعة تانية عشان نكمّل حجزك</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button onClick={handleBook}
        disabled={!name || !day || !hour || isHourBooked}
        whileHover={{ scale: isHourBooked ? 1 : 1.02, y: isHourBooked ? 0 : -2 }}
        whileTap={{ scale: isHourBooked ? 1 : 0.97 }}
        className={`w-full py-3.5 rounded-2xl font-semibold text-[15px] flex items-center justify-center gap-2 transition-all ${isHourBooked ? 'cursor-not-allowed bg-white/[0.04] text-white/30 border border-white/10' : 'text-white'}`}
        style={isHourBooked ? {} : { background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, boxShadow: `0 8px 24px -4px ${accent}66` }}>
        {isHourBooked ? '🔒 الساعة دي محجوزة' : `💬 احجز الآن (${t('whatsapp')})`}
      </motion.button>
      </motion.div>
    </ShineBorder>
  )
}

export default function PlaystationPage() {
  const { t, i18n } = useTranslation()
  const lng = i18n.language
  const isRTL = lng === 'ar'
  const [ps, setPs] = useState({ name: '', day: '', hour: '' })
  const [room, setRoom] = useState({ name: '', day: '', hour: '' })

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Backgrounds */}
      <div className="absolute inset-0 z-0">
        <video src="/assets/videos/ps.mp4" autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-25"
          onError={e => (e.target.style.display = 'none')} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/95" />
      </div>
      <div className="absolute inset-0 opacity-35 bg-[radial-gradient(ellipse_at_top,rgba(192,132,252,0.4)_0%,transparent_60%)]" />
      <AnimatedGridPattern dotColor="#c084fc" dotSize={1.2} className="opacity-30" />
      <Meteors number={6} />
      <motion.div className="absolute top-1/3 -left-20 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(192,132,252,0.18), transparent 70%)' }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 flex flex-col min-h-screen max-w-md mx-auto px-5 pb-10">
        <div className="flex items-center gap-3 pt-4">
          <Link to="/home">
            <motion.div whileHover={{ x: isRTL ? 3 : -3, scale: 1.1 }} whileTap={{ scale: 0.9 }}
              className="w-9 h-9 rounded-full glass flex items-center justify-center text-white/60 hover:text-accent transition-colors">
              <ArrowLeft size={18} className={isRTL ? '' : 'rotate-180'} />
            </motion.div>
          </Link>
          <h2 className="text-xl font-bold font-ar" style={{ color: '#c084fc' }}>{t('psBooking')}</h2>
        </div>

        <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="text-center mt-6 mb-3">
          <motion.div initial={{ scale: 0.6, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.15 }}
            className="w-24 h-24 rounded-full mx-auto overflow-hidden shadow-[0_0_40px_rgba(192,132,252,0.6)] mb-3 relative">
            <motion.div className="absolute inset-0 rounded-full pointer-events-none"
              animate={{ boxShadow: ['0 0 20px rgba(192,132,252,0.4)', '0 0 50px rgba(192,132,252,0.7)', '0 0 20px rgba(192,132,252,0.4)'] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            <img src="/assets/logo.jpg" alt="GPS" className="w-full h-full object-cover" />
          </motion.div>
          <h1 className="text-4xl font-black tracking-tight font-display drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
            style={{ color: '#d8b4fe' }}>
            <span className="bg-gradient-to-r from-[#d8b4fe] via-[#c084fc] to-[#d8b4fe] bg-clip-text text-transparent">{t('psTitle')}</span>
          </h1>
          <p className="text-white/40 text-sm font-ar mt-1">{t('psSubtitle')}</p>
        </motion.div>

        <div className="flex-1 flex flex-col gap-3 justify-center pb-4">
          <BookingCard icon={Gamepad2} accent="#c084fc" title={t('psBooking')} subtitle={t('psSubtitle')}
            name={ps.name} setName={(v) => setPs(s => ({ ...s, name: v }))}
            day={ps.day} setDay={(v) => setPs(s => ({ ...s, day: v }))}
            hour={ps.hour} setHour={(v) => setPs(s => ({ ...s, hour: v }))}
            t={t} label="الاسم" placeholder="اكتب اسمك يانجم" slotType="playstation" />
          <BookingCard icon={Sofa} accent="#ec4899" title={t('roomBooking')} subtitle="VIP · Private"
            name={room.name} setName={(v) => setRoom(s => ({ ...s, name: v }))}
            day={room.day} setDay={(v) => setRoom(s => ({ ...s, day: v }))}
            hour={room.hour} setHour={(v) => setRoom(s => ({ ...s, hour: v }))}
            t={t} label="الاسم" placeholder="اكتب اسمك يانجم" slotType="room" />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }} className="grid grid-cols-2 gap-3">
            <motion.a href={telLink()} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.97 }}
              className="glass rounded-2xl py-3.5 flex items-center justify-center gap-2 font-semibold text-[15px] text-white/80 hover:text-accent transition-colors">
              📞 {t('call')}
            </motion.a>
            <motion.button onClick={() => window.open(playstationWhatsApp({ name: '', type: 'استفسار' }), '_blank', 'noopener')}
              whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.97 }}
              className="rounded-2xl py-3.5 flex items-center justify-center gap-2 font-semibold text-[15px] text-white transition-colors"
              style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)', boxShadow: '0 8px 24px -4px rgba(34,197,94,0.4)' }}>
              💬 {t('whatsapp')}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}