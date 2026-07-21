import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, X, Calendar, Clock, User, Phone, CheckCircle, Ban } from 'lucide-react'
import { useSlotBookings } from '../hooks/useSlotBookings.jsx'
import { ShineBorder, NumberTicker } from './magicui/index.js'

const DAYS = ['السبت','الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة']
const HOURS = Array.from({ length: 12 }, (_, i) => `${i+1}:00 ${i+1 < 12 ? 'م' : 'ص'}`)
const TYPES = [
  { value: 'padel', label: 'Padel',  color: '#52ffa8', icon: '🎾' },
  { value: 'playstation', label: 'بلايستيشن', color: '#c084fc', icon: '🎮' },
  { value: 'room', label: 'روم VIP', color: '#ec4899', icon: '🛋️' },
]

export default function SlotManager() {
  const { slots, addSlot, toggleSlot, deleteSlot, refresh } = useSlotBookings()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ type: 'padel', date: '', time: '', name: '', phone: '' })
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [msg, setMsg] = useState('')

  const filtered = slots
    .filter(s => filterType === 'all' ? true : s.type === filterType)
    .filter(s => filterStatus === 'all' ? true : s.status === filterStatus)
    .sort((a, b) => (a.date || '').localeCompare(b.date || '') || (a.time || '').localeCompare(b.time || ''))

  const handleAdd = async () => {
    if (!form.date) { setMsg('⚠ اختار اليوم'); return }
    if (!form.time) { setMsg('⚠ اختار الساعة'); return }
    if (!form.name) { setMsg('⚠ اكتب اسم العميل'); return }
    const duplicate = slots.find(s => s.type === form.type && s.date === form.date && s.time === form.time)
    if (duplicate) { setMsg('⚠ فيه موعد بنفس التوقيت'); return }
    await addSlot({ ...form, status: 'booked' })
    const tp = TYPES.find(t => t.value === form.type)
    setMsg(`🔴 ${form.name} حجز — ${tp?.icon} ${form.date} ${form.time}`)
    setForm({ type: 'padel', date: '', time: '', name: '', phone: '' })
    setShowForm(false)
  }

  const availableCount = slots.filter(s => s.status !== 'booked').length
  const bookedCount = slots.filter(s => s.status === 'booked').length

  const stats = [
    { label: 'الكل', value: slots.length, color: '#fff' },
    { label: 'متاح', value: availableCount, color: '#34d399' },
    { label: 'محجوز', value: bookedCount, color: '#f87171' },
  ]

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white text-base font-ar flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-accent shadow-glow" />
            إدارة الحجوزات
          </h3>
          <p className="text-white/30 text-[10px] mt-0.5 font-ar">سينور لوحة تحكم الحجوزات</p>
        </div>
        <div className="flex gap-1.5">
          <motion.button whileTap={{ scale: 0.88 }} onClick={refresh}
            className="w-8 h-8 rounded-xl glass flex items-center justify-center text-white/40 hover:text-accent transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12a9 9 0 0 0-15-6.7L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 15 6.7l3-2.7" /><path d="M21 21v-5h-5" /></svg>
          </motion.button>
          <motion.button whileTap={{ scale: 0.92 }}
            onClick={() => setShowForm(!showForm)}
            className="text-xs bg-accent/15 text-accent font-bold px-3 py-1.5 rounded-xl hover:bg-accent/25 flex items-center gap-1.5 transition-all"
          >
            <motion.span animate={{ rotate: showForm ? 45 : 0 }} transition={{ duration: 0.25 }}>
              <Plus size={13} />
            </motion.span>
            {showForm ? 'إغلاق' : 'حجز جديد'}
          </motion.button>
        </div>
      </motion.div>

      {/* Stats — Bento */}
      <div className="grid grid-cols-3 gap-2">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative glass rounded-2xl p-3 text-center overflow-hidden"
          >
            <motion.div className="absolute -inset-px rounded-2xl"
              style={{ background: `radial-gradient(ellipse at center, ${s.color}22, transparent 70%)` }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
            />
            <div className="relative z-10">
              <div className="text-[10px] text-white/40 font-ar mb-1">{s.label}</div>
              <div className="text-2xl font-black tabular-nums" style={{ color: s.color }}>
                <NumberTicker value={s.value} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 flex-wrap">
        {[{ value: 'all', label: 'الكل' }, ...TYPES].map(tp => (
          <motion.button key={tp.value} whileTap={{ scale: 0.92 }} onClick={() => setFilterType(tp.value)}
            className={`text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
              filterType === tp.value ? 'text-black' :
              'text-white/50 bg-white/[0.03] hover:bg-white/[0.06]'
            }`}
            style={filterType === tp.value ? { background: '#E0FF00' } : {}}>
            {tp.icon && <span>{tp.icon}</span>}
            {tp.label}
          </motion.button>
        ))}
      </div>
      <div className="flex gap-1.5">
        {[{ value: 'all', label: 'الكل' }, { value: 'available', label: 'متاح' }, { value: 'booked', label: 'محجوز' }].map(st => (
          <motion.button key={st.value} whileTap={{ scale: 0.92 }} onClick={() => setFilterStatus(st.value)}
            className={`text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all ${
              filterStatus === st.value
                ? st.value === 'booked' ? 'bg-red-500/20 text-red-400' :
                  st.value === 'available' ? 'bg-green-500/20 text-green-400' :
                  'bg-accent/20 text-accent'
                : 'text-white/40 bg-white/[0.03] hover:bg-white/[0.06]'
            }`}>
            {st.label}
          </motion.button>
        ))}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {msg && (
          <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className="glass rounded-2xl p-3 text-white/85 text-xs flex justify-between items-center border border-accent/20">
            <span className="font-ar">{msg}</span>
            <motion.button whileTap={{ scale: 0.85 }} onClick={() => setMsg('')} className="text-white/30 hover:text-white">
              <X size={14} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Form — ShineBorder Popout */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
          >
            <ShineBorder duration={6} className="rounded-3xl">
              <div className="glass-strong rounded-3xl p-5 space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-accent font-bold text-sm flex items-center gap-1.5 font-ar">
                    <Calendar size={14} /> أضف حجز جديد
                  </h4>
                  <button onClick={() => setShowForm(false)} className="text-white/30 hover:text-white"><X size={16} /></button>
                </div>

                {/* Type pills */}
                <div className="flex gap-2">
                  {TYPES.map(tp => (
                    <motion.button key={tp.value} whileTap={{ scale: 0.94 }} onClick={() => setForm({...form, type: tp.value})}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                        form.type === tp.value ? 'text-black' : 'bg-white/[0.03] text-white/50'
                      }`}
                      style={form.type === tp.value ? { background: tp.color } : {}}>
                      <span className="text-xl">{tp.icon}</span>
                      <span className="font-ar">{tp.label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Day / Hour */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-white/40 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 font-ar">
                      <Calendar size={10} /> اليوم
                    </label>
                    <select value={form.date} onChange={e => setForm({...form, date: e.target.value})}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-accent/50 font-ar">
                      <option value="" className="bg-bg2">اختار</option>
                      {DAYS.map(d => <option key={d} value={d} className="bg-bg2">{d}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-white/40 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 font-ar">
                      <Clock size={10} /> الساعة
                    </label>
                    <select value={form.time} onChange={e => setForm({...form, time: e.target.value})}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-accent/50">
                      <option value="" className="bg-bg2">اختار</option>
                      {HOURS.map(h => <option key={h} value={h} className="bg-bg2">{h}</option>)}
                    </select>
                  </div>
                </div>

                {/* Name / Phone */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-white/40 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 font-ar">
                      <User size={10} /> الاسم
                    </label>
                    <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                      placeholder="اسم العميل"
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-accent/50 placeholder-white/25 font-ar" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-white/40 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 font-ar">
                      <Phone size={10} /> موبايل
                    </label>
                    <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                      placeholder="اختياري"
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-accent/50 placeholder-white/25 font-ar" />
                  </div>
                </div>

                <motion.button onClick={handleAdd} whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.96 }}
                  className="w-full py-3 rounded-xl font-bold text-black text-sm flex items-center justify-center gap-2 transition-all"
                  style={{ background: 'linear-gradient(135deg,#E0FF00,#D4FF00)', boxShadow: '0 8px 28px -8px rgba(224,255,0,0.5)' }}>
                  <CheckCircle size={15} /> احجز الآن
                </motion.button>
              </div>
            </ShineBorder>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="space-y-2 max-h-[38vh] overflow-auto scrollbar-none">
        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="glass rounded-2xl p-8 text-center">
            <div className="opacity-30 text-4xl mb-2">📅</div>
            <p className="text-white/25 text-xs font-ar">مفيش حجوزات لحد دلوقتي — أضف حجز جديد</p>
          </motion.div>
        )}
        <AnimatePresence>
          {filtered.map(s => {
            const tp = TYPES.find(t => t.value === s.type)
            const isBooked = s.status === 'booked'
            return (
              <motion.div key={s.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className={`glass rounded-2xl p-3.5 flex items-center gap-3 transition-all overflow-hidden relative ${
                  isBooked ? 'border border-red-500/20' : 'border border-white/[0.06]'
                }`}
              >
                {/* Background glow */}
                <motion.div className="absolute -inset-px rounded-2xl pointer-events-none"
                  style={{ background: `radial-gradient(circle at right, ${isBooked ? '#ef4444' : tp?.color}22, transparent 60%)` }}
                />

                {/* Status dot — pulsing if booked */}
                <motion.div
                  className={`relative w-2.5 h-2.5 rounded-full flex-shrink-0 ${isBooked ? 'bg-red-500' : 'bg-green-400'}`}
                  animate={isBooked ? { boxShadow: ['0 0 4px #ef4444', '0 0 14px #ef4444', '0 0 4px #ef4444'] } : {}}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />

                {/* Icon chip */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: `${tp?.color}18`, border: `1px solid ${tp?.color}33` }}>
                  {tp?.icon}
                </div>

                <div className="flex-1 min-w-0 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{s.time || '—'}</span>
                    <span className="text-[10px] text-white/40 font-ar">·</span>
                    <span className="text-[10px] text-white/40 font-ar">{s.date}</span>
                    {isBooked && (
                      <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                        className="text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-md font-bold font-ar">
                        محجوز
                      </motion.span>
                    )}
                  </div>
                  {isBooked && s.name && (
                    <div className="text-xs text-white/70 font-ar font-bold mt-1 flex items-center gap-1.5 truncate">
                      <User size={10} className="text-accent/60 flex-shrink-0" />
                      <span className="truncate">{s.name}</span>
                      {s.phone && <span className="text-white/35 text-[10px] font-normal">· {s.phone}</span>}
                    </div>
                  )}
                </div>

                {/* Action */}
                <div className="flex gap-1.5 flex-shrink-0 relative z-10">
                  {isBooked ? (
                    <motion.button whileTap={{ scale: 0.88 }} onClick={async () => { await toggleSlot(s.id); setMsg('🟢 الساعة بقيت متاحة تاني') }}
                      className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-all flex items-center gap-1 font-ar">
                      إلغاء الحجز
                    </motion.button>
                  ) : (
                    <motion.button whileTap={{ scale: 0.88 }} onClick={async () => { await toggleSlot(s.id); setMsg(`🔴 ${s.date} ${s.time} محجوز`) }}
                      className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-all font-ar">
                      احجز يدوي
                    </motion.button>
                  )}
                  <motion.button whileTap={{ scale: 0.88 }} onClick={async () => { await deleteSlot(s.id); setMsg('✓ تم الحذف') }}
                    className="w-7 h-7 rounded-xl bg-white/[0.03] text-white/25 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-all">
                    <Trash2 size={12} />
                  </motion.button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}