import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, X, Activity, UserX, CheckCircle } from 'lucide-react'
import { useSlotBookings } from '../hooks/useSlotBookings.jsx'

const DAYS = ['السبت','الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة']
const HOURS = Array.from({ length: 12 }, (_, i) => `${i+1}:00 ${i+1 < 12 ? 'م' : 'ص'}`)
const TYPES = [
  { value: 'padel', label: 'Padel', color: '#52ffa8' },
  { value: 'playstation', label: 'بلايستيشن', color: '#c084fc' },
  { value: 'room', label: 'روم VIP', color: '#ec4899' },
]

export default function SlotManager() {
  const { slots, addSlot, toggleSlot, deleteSlot, refresh, bookSlot } = useSlotBookings()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ type: 'padel', date: '', time: '', name: '', phone: '' })
  const [filterType, setFilterType] = useState('all')
  const [filterDate, setFilterDate] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [msg, setMsg] = useState('')

  const filtered = slots
    .filter(s => filterType === 'all' ? true : s.type === filterType)
    .filter(s => !filterDate || s.date === filterDate)
    .filter(s => filterStatus === 'all' ? true : s.status === filterStatus)
    .sort((a, b) => (a.date || '').localeCompare(b.date || '') || (a.time || '').localeCompare(b.time || ''))

  const handleAdd = async () => {
    if (!form.date) { setMsg('اختار اليوم'); return }
    if (!form.time) { setMsg('اختار الساعة'); return }
    const duplicate = slots.find(s => s.type === form.type && s.date === form.date && s.time === form.time)
    if (duplicate) { setMsg('⚠ فيه موعد زيها بالظبط'); return }
    await addSlot(form)
    setForm({ type: 'padel', date: '', time: '', name: '', phone: '' })
    setShowForm(false)
    setMsg('✓ تمت إضافة ساعة متاحة')
  }

  const handleManualBook = async (slot) => {
    // Admin manually marks an available slot as booked (with existing name or prompt)
    const nm = slot.name || prompt('اسم العميل؟') || ''
    if (!nm) return
    await bookSlot(slot.date, slot.time, slot.type, nm, slot.phone || '')
    setMsg(`🔴 ${nm} حجز — ${slot.time}`)
  }

  const availableCount = slots.filter(s => s.status !== 'booked').length
  const bookedCount = slots.filter(s => s.status === 'booked').length

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <Activity size={16} className="text-accent" /> إدارة ساعات الحجز
        </h3>
        <div className="flex gap-1.5">
          <button onClick={refresh} className="text-xs text-white/40 hover:text-white transition-colors">↻</button>
          <button onClick={() => setShowForm(!showForm)}
            className="text-xs bg-accent/15 text-accent font-bold px-3 py-1.5 rounded-xl hover:bg-accent/25 flex items-center gap-1 transition-all">
            <Plus size={12} /> {showForm ? 'إغلاق' : 'أضف ساعة متاحة'}
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
        {[{ value: 'all', label: 'الكل' }, { value: 'available', label: 'متاح' }, { value: 'booked', label: 'محجوز' }].map(st => (
          <button key={st.value} onClick={() => setFilterStatus(st.value)}
            className={`text-xs font-bold px-2.5 py-1.5 rounded-xl transition-all ${filterStatus === st.value ? 'text-black' : 'text-white/40 bg-white/[0.04] hover:text-white'}`}
            style={filterStatus === st.value ? { background: '#E0FF00' } : {}}>
            {st.label}
          </button>
        ))}
        <input type="text" placeholder="اليوم" value={filterDate} onChange={e => setFilterDate(e.target.value)}
          className="flex-1 min-w-[50px] bg-white/[0.04] border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white outline-none focus:border-accent/50 placeholder-white/20" />
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
            <div className="text-xs text-white/60 font-ar text-center">أضف ساعة متاحة (تظهر للعملاء)</div>
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
            <button onClick={handleAdd}
              className="w-full py-2.5 rounded-xl font-bold text-black text-sm flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg,#E0FF00,#D4FF00)' }}>
              <CheckCircle size={14} /> أضف الساعة
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
          const isBooked = s.status === 'booked'
          return (
            <motion.div key={s.id} layout
              className={`glass rounded-2xl p-3 flex items-center gap-3 transition-all ${isBooked ? 'border-red-500/20 bg-red-500/[0.02]' : 'border-green-500/20'}`}>
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-md ${isBooked ? 'bg-red-500 shadow-red-500/30' : 'bg-green-400 shadow-green-400/30'}`} />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs flex items-center gap-2">
                  <span style={{ color: tp?.color || '#888' }}>{s.time || '—'}</span>
                  <span className={isBooked ? 'text-red-400' : 'text-green-400'}>{isBooked ? 'محجوز' : 'متاح'}</span>
                </div>
                <div className="text-white/40 text-[10px] mt-0.5 font-ar">
                  {s.date || '—'} · {tp?.label}
                </div>
                {isBooked && s.name && (
                  <div className="text-white/70 text-[10px] mt-0.5 font-ar font-bold truncate">
                    👤 {s.name}
                    {s.phone && <span className="text-white/30 ml-1.5">{s.phone}</span>}
                  </div>
                )}
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                {isBooked ? (
                  <motion.button whileTap={{ scale: 0.9 }}
                    onClick={async () => { await toggleSlot(s.id); setMsg('🟢 فتحنا الساعة تاني — متاحة') }}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold bg-red-500/18 text-red-400 hover:bg-red-500/30 transition-all flex items-center gap-1">
                    <UserX size={10} /> الغاء
                  </motion.button>
                ) : (
                  <motion.button whileTap={{ scale: 0.9 }}
                    onClick={() => handleManualBook(s)}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold bg-green-500/14 text-green-400 hover:bg-green-500/28 transition-all">
                    احجز
                  </motion.button>
                )}
                <motion.button whileTap={{ scale: 0.9 }}
                  onClick={async () => { await deleteSlot(s.id); setMsg('✓ تم الحذف') }}
                  className="p-1 rounded-lg bg-white/[0.04] text-white/30 hover:text-red-400 transition-colors">
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
          <div className="text-green-400 font-bold">{availableCount}</div>
        </div>
        <div className="flex-1">
          <div className="text-red-400/50">محجوز</div>
          <div className="text-red-400 font-bold">{bookedCount}</div>
        </div>
      </div>
    </div>
  )
}