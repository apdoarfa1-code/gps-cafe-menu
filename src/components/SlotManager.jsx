import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Calendar, Plus, Trash2, X, Filter, Activity, Ban } from 'lucide-react'
import { useSlotBookings } from '../hooks/useSlotBookings.jsx'

const DAYS = ['السبت','الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة']
const HOURS = Array.from({ length: 12 }, (_, i) => `${i+1}:00 ${i+1 < 12 ? 'م' : 'ص'}`)
const TYPES = [
  { value: 'padel', label: 'Padel', color: '#52ffa8' },
  { value: 'playstation', label: 'بلايستيشن', color: '#c084fc' },
  { value: 'room', label: 'روم VIP', color: '#ec4899' },
]

export default function SlotManager() {
  const { slots, addSlot, toggleSlot, deleteSlot, refresh } = useSlotBookings()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ type: 'padel', date: '', time: '', name: '', phone: '' })
  const [filterType, setFilterType] = useState('all')
  const [filterDate, setFilterDate] = useState('')
  const [msg, setMsg] = useState('')

  const filtered = slots
    .filter(s => filterType === 'all' ? true : s.type === filterType)
    .filter(s => !filterDate || s.date === filterDate)
    .sort((a, b) => (a.date || '').localeCompare(b.date || '') || (a.time || '').localeCompare(b.time || ''))

  const handleAdd = () => {
    if (!form.date) { setMsg('اختار التاريخ'); return }
    addSlot({ ...form, status: 'available' })
    setForm({ type: 'padel', date: '', time: '', name: '', phone: '' })
    setShowForm(false)
    setMsg('✓ تمت الإضافة')
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <Activity size={16} className="text-accent" /> إدارة ساعات الحجز
        </h3>
        <div className="flex gap-1.5">
          <button onClick={refresh} className="text-xs text-white/40 hover:text-white">↻</button>
          <button onClick={() => setShowForm(!showForm)}
            className="text-xs bg-accent/15 text-accent font-bold px-3 py-1.5 rounded-xl hover:bg-accent/25 flex items-center gap-1">
            <Plus size={12} /> {showForm ? 'إغلاق' : 'فتحة جديدة'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[{ value: 'all', label: 'الكل' }, ...TYPES].map(tp => (
          <button key={tp.value} onClick={() => setFilterType(tp.value)}
            className={`text-xs font-bold px-2.5 py-1.5 rounded-xl transition-all ${filterType === tp.value ? 'text-black' : 'text-white/40 bg-white/[0.04] hover:text-white'}`}
            style={filterType === tp.value ? { background: '#E0FF00' } : {}}>
            {tp.label}
          </button>
        ))}
        <input type="text" placeholder="الإسبوع" value={filterDate} onChange={e => setFilterDate(e.target.value)}
          className="flex-1 min-w-[60px] bg-white/[0.04] border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white outline-none focus:border-accent/50 placeholder-white/20" />
      </div>

      {/* Toast */}
      <AnimatePresence>
        {msg && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="glass rounded-xl p-3 text-white/80 text-xs flex justify-between items-center">
            {msg} <button onClick={() => setMsg('')} className="text-white/30 hover:text-white"><X size={14} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="glass rounded-2xl overflow-hidden p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                className="col-span-2 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-accent/50 font-ar">
                <option value="padel" className="bg-bg2">ملعب بادل</option>
                <option value="playstation" className="bg-bg2">بلايستيشن</option>
                <option value="room" className="bg-bg2">رّوم VIP</option>
              </select>
              <select value={form.date} onChange={e => setForm({...form, date: e.target.value})}
                className="bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-accent/50 font-ar">
                <option value="" className="bg-bg2">اختر اليوم</option>
                {DAYS.map(d => <option key={d} value={d} className="bg-bg2">{d}</option>)}
              </select>
              <select value={form.time} onChange={e => setForm({...form, time: e.target.value})}
                className="bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-accent/50">
                <option value="">اختر الساعة</option>
                {HOURS.map(h => <option key={h} value={h} className="bg-bg2">{h}</option>)}
              </select>
            </div>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-accent/50 placeholder-white/25 font-ar"
              placeholder="اسم الحجز (اختياري)" />
            <button onClick={handleAdd}
              className="w-full py-2.5 rounded-xl font-bold text-black text-sm flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg,#E0FF00,#D4FF00)' }}>
              <Plus size={14} /> أضف مواعيد
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slots List */}
      <div className="space-y-1.5 max-h-[35vh] overflow-auto scrollbar-none">
        {filtered.length === 0 && (
          <p className="text-white/20 text-xs text-center py-4">لا يوجد مواعيد بعد</p>
        )}
        {filtered.map(s => {
          const tp = TYPES.find(t => t.value === s.type)
          return (
            <motion.div key={s.id} layout
              className={`glass rounded-2xl p-3 flex items-center gap-3 ${s.status === 'booked' ? 'border-red-500/20' : 'border-green-500/20'}`}>
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.status === 'booked' ? 'bg-red-500' : 'bg-green-500'}`} />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs flex items-center gap-2">
                  <span style={{ color: tp?.color || '#888' }}>{s.time || '—'}</span>
                  {s.name && <span className="text-white/40 truncate">{s.name}</span>}
                </div>
                <div className="text-white/30 text-[10px] mt-0.5 font-ar">
                  {s.date || '—'} · {tp?.label}
                  {s.phone && <span className="ml-2">{s.phone}</span>}
                </div>
              </div>
              <div className="flex gap-1.5">
                <motion.button whileTap={{ scale: 0.9 }}
                  onClick={() => { const st = toggleSlot(s.id); setMsg(st === 'booked' ? '🔴 محجوز' : '🟢 متاح') }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${s.status === 'booked' ? 'bg-red-500/15 text-red-400' : 'bg-green-500/15 text-green-400'}`}>
                  {s.status === 'booked' ? 'مشغول' : 'متاح'}
                </motion.button>
                <motion.button whileTap={{ scale: 0.9 }}
                  onClick={() => { deleteSlot(s.id); setMsg('✓ تم الحذف') }}
                  className="p-1 rounded-lg bg-white/[0.04] text-white/30 hover:text-red-400">
                  <Trash2 size={12} />
                </motion.button>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Stats */}
      <div className="glass rounded-2xl p-3 flex gap-3 text-center text-[10px]">
        <div className="flex-1">
          <div className="text-white/50">الكل</div>
          <div className="text-white font-bold">{slots.length || 0}</div>
        </div>
        <div className="flex-1">
          <div className="text-green-400/50">متاح</div>
          <div className="text-green-400 font-bold">{slots.filter(s => s.status !== 'booked').length}</div>
        </div>
        <div className="flex-1">
          <div className="text-red-400/50">محجوز</div>
          <div className="text-red-400 font-bold">{slots.filter(s => s.status === 'booked').length}</div>
        </div>
      </div>
    </div>
  )
}