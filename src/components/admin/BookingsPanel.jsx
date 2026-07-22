import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Trash2, Calendar, Clock, User, Phone, CheckCircle, Activity } from 'lucide-react'
import { useSlotBookings } from '../../hooks/useSlotBookings.jsx'
import { hasSupabase, upsertSlot, deleteSlot as sbDeleteSlot } from '../../lib/supabase.js'

const DAYS = ['السبت','الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة']
const HOURS = Array.from({ length: 12 }, (_, i) => `${i+1}:00 ${i+1 < 12 ? 'م' : 'ص'}`)
const TYPES = [
  { key: 'padel', label: 'Padel', icon: '🎾', color: '#52ffa8' },
  { key: 'playstation', label: 'بلايستيشن', icon: '🎮', color: '#c084fc' },
  { key: 'room', label: 'روم VIP', icon: '🛋️', color: '#ec4899' },
]

export default function BookingsPanel({ onClose }) {
  const { slots, deleteSlot, bookSlot, refresh } = useSlotBookings()
  const [tab, setTab] = useState('padel')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ type: 'padel', date: '', time: '', name: '', phone: '' })
  const [msg, setMsg] = useState('')

  const filtered = slots
    .filter(s => s.status === 'booked' && s.type === tab)
    .sort((a, b) => (a.date || '').localeCompare(b.date || '') || (a.time || '').localeCompare(b.time || ''))

  const stats = {
    total: filtered.length,
  }

  const handleAdd = async () => {
    if (!form.date) { setMsg('⚠ اختار اليوم'); return }
    if (!form.time) { setMsg('⚠ اختار الساعة'); return }
    if (!form.name) { setMsg('⚠ اكتب اسم العميل'); return }
    const res = await bookSlot(form.date, form.time, form.type, form.name, form.phone)
    setMsg(`✓ ${res?.name || form.name} تم تسجيل الحجز`)
    setForm({ type: tab, date: '', time: '', name: '', phone: '' })
    setShowForm(false)
    setTimeout(() => setMsg(''), 2500)
  }

  const handleDelete = async (id) => {
    if (!confirm('حذف الحجز؟')) return
    await deleteSlot(id)
    setMsg('✓ تم الحذف')
    setTimeout(() => setMsg(''), 1500)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl bg-[#0a0a0a] rounded-3xl border border-white/10 overflow-hidden my-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <div>
            <h2 className="text-xl font-black flex items-center gap-2"><Activity size={20} className="text-accent" /> الحجوزات</h2>
            <p className="text-white/40 text-xs mt-0.5">إدارة الحجوزات في كل الأقسام</p>
          </div>
          <div className="flex gap-2">
            <button onClick={refresh} className="text-xs font-bold px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08]">↻</button>
            <button onClick={() => { setForm({...form, type: tab}); setShowForm(true) }} className="text-xs bg-accent/15 text-accent font-bold px-3 py-2 rounded-xl hover:bg-accent/25 flex items-center gap-1">
              <Plus size={12} /> حجز جديد
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-full glass flex items-center justify-center"><X size={16} /></button>
          </div>
        </div>

        <AnimatePresence>
          {msg && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mx-5 mt-3 glass rounded-xl p-2.5 text-sm border border-accent/20">{msg}</motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex gap-2 p-3 pt-3 px-5 border-b border-white/[0.04]">
          {TYPES.map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setForm({...form, type: t.key}) }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${tab === t.key ? 'text-black' : 'bg-white/[0.04] text-white/60 hover:bg-white/[0.08]'}`}
              style={tab === t.key ? { background: t.color } : {}}>
              <span className="text-lg">{t.icon}</span> {t.label}
              <span className="text-[10px] opacity-60">({slots.filter(s => s.type === t.key).length})</span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5 scrollbar-none">
          {showForm ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="space-y-3 bg-white/[0.02] rounded-2xl p-4 border border-white/[0.04]">
              <h3 className="font-bold text-accent text-sm flex items-center gap-2">
                <Plus size={14} /> حجز جديد — {TYPES.find(t => t.key === form.type)?.label}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <select value={form.date} onChange={e => setForm({...form, date: e.target.value})}
                  className="bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none">
                  <option value="" className="bg-bg2">اختر اليوم</option>
                  {DAYS.map(d => <option key={d} value={d} className="bg-bg2">{d}</option>)}
                </select>
                <select value={form.time} onChange={e => setForm({...form, time: e.target.value})}
                  className="bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none">
                  <option value="" className="bg-bg2">اختر الساعة</option>
                  {HOURS.map(h => <option key={h} value={h} className="bg-bg2">{h}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  placeholder="اسم العميل *" className="bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-accent/50 placeholder-white/20" />
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                  placeholder="رقم الموبايل" className="bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-accent/50 placeholder-white/20" />
              </div>
              <div className="flex gap-2">
                <button onClick={handleAdd} className="flex-1 py-3 rounded-xl font-bold text-black text-sm flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg,#E0FF00,#D4FF00)' }}>
                  <CheckCircle size={15} /> تسجيل الحجز
                </button>
                <button onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl bg-white/[0.04] text-white/60 text-sm">إلغاء</button>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Stats mini */}
              <div className="glass rounded-2xl p-3 text-center mb-3">
                <div className="text-[10px] text-white/50">إجمالي الحجوزات</div>
                <div className="text-xl font-black text-white">{stats.total}</div>
              </div>

              {filtered.length === 0 ? (
                <div className="glass rounded-2xl p-8 text-center">
                  <div className="opacity-30 text-4xl mb-2">📅</div>
                  <p className="text-white/30 text-sm">مفيش حجوزات لـ {TYPES.find(t => t.key === tab)?.label} — أضف أول حجز</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <AnimatePresence>
                    {filtered.map(s => {
                      const isBooked = s.status === 'booked'
                      return (
                        <motion.div key={s.id} layout initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
                          className={`glass rounded-2xl p-3 flex items-center gap-3 ${isBooked ? 'border border-accent/20 bg-accent/[0.02]' : 'border border-white/[0.06]'}`}>
                          <motion.div
                            className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isBooked ? 'bg-accent' : 'bg-white/30'}`}
                            animate={isBooked ? { boxShadow: ['0 0 4px #E0FF00', '0 0 14px #E0FF00', '0 0 4px #E0FF00'] } : {}}
                            transition={{ duration: 1.8, repeat: Infinity }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white">{s.time || '—'}</span>
                              <span className="text-[10px] text-white/40">·</span>
                              <span className="text-[10px] text-white/40">{s.date}</span>
                              {isBooked && <span className="text-[9px] bg-accent/15 text-accent px-1.5 py-0.5 rounded-md font-bold">محجوز</span>}
                            </div>
                            {isBooked && s.name && (
                              <div className="text-xs text-white/70 font-ar font-bold mt-0.5 flex items-center gap-1.5 truncate">
                                <User size={10} className="text-accent/60 flex-shrink-0" />
                                <span className="truncate">{s.name}</span>
                                {s.phone && <span className="text-white/35 text-[10px]">· {s.phone}</span>}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1.5 flex-shrink-0">
                            <motion.button whileTap={{ scale: 0.88 }} onClick={() => handleDelete(s.id)}
                              className="w-7 h-7 rounded-xl bg-white/[0.03] hover:bg-red-500/15 hover:text-red-400 flex items-center justify-center text-white/30">
                              <Trash2 size={12} />
                            </motion.button>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}