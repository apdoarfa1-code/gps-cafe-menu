import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Upload, Trash2, Plus, ImageIcon, Hash, Boxes } from 'lucide-react'
import { hasSupabase, upsertSection, deleteSection } from '../../lib/supabase.js'
import { sectionsToCSV, sectionsToCSVString, itemsToCSV, csvSectionsToAdmin, parseCSV, downloadCSVFile } from '../../lib/paperMenu.js'

const PREDEFINED = [
  { icon: '☕', color: '#c0843e' },
  { icon: '🧊', color: '#3b82f6' },
  { icon: '🥤', color: '#22c55e' },
  { icon: '🥛', color: '#ec4899' },
  { icon: '🍉', color: '#84cc16' },
  { icon: '🍰', color: '#f59e0b' },
  { icon: '💨', color: '#a855f7' },
  { icon: '🍟', color: '#ef4444' },
]

const slugify = (s) => (s || '').toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/^-|-$/g, '')

export default function SectionsPanel({ sections, items, setSections, onClose }) {
  const [editing, setEditing] = useState(null)
  const [newMode, setNewMode] = useState(false)
  const [msg, setMsg] = useState('')
  const fileRef = useRef(null)

  const sorted = [...sections].sort((a, b) => (a.position || 0) - (b.position || 0))

  const refreshCSV = () => {
    const updated = sectionsToCSV(sorted, items)
    setMsg(`✓ تم تحديث الشيت — ${updated.length} قسم`)
    setTimeout(() => setMsg(''), 2500)
  }

  const saveSection = async (form) => {
    let updated
    if (form.id && sections.find(s => s.id === form.id)) {
      updated = sections.map(s => s.id === form.id ? { ...s, ...form, slug: form.slug || slugify(form.name_en || form.name_ar) } : s)
      setMsg(`✓ تم حفظ القسم`)
    } else {
      const newId = Date.now()
      updated = [...sections, { ...form, id: newId, slug: form.slug || slugify(form.name_en || form.name_ar) }]
      setMsg(`✓ تم إضافة القسم`)
    }
    setSections(updated)
    sectionsToCSV(updated, items)
    if (hasSupabase) {
      try { await upsertSection(updated[updated.length-1]) } catch {}
    }
    setEditing(null); setNewMode(false)
    setTimeout(() => setMsg(''), 2000)
  }

  const delSection = async (id) => {
    if (!confirm('حذف القسم؟ المنتجات بداخله هتتحذف كمان.')) return
    const updated = sections.filter(s => s.id !== id)
    setSections(updated)
    sectionsToCSV(updated, items)
    if (hasSupabase) {
      try { await deleteSection(id) } catch {}
    }
    setMsg('✓ تم حذف القسم')
    setTimeout(() => setMsg(''), 2000)
  }

  const exportCSV = () => {
    const csv = sectionsToCSVString(sorted, items)
    downloadCSVFile(csv, `gps_sections_${new Date().toISOString().slice(0, 10)}.csv`)
    setMsg('تم تنزيل شيت الأقسام')
    setTimeout(() => setMsg(''), 2000)
  }

  const importCSV = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const parsed = parseCSV(evt.target.result)
        const imported = csvSectionsToAdmin(parsed)
        const merged = [...sections]
        imported.forEach(imp => {
          const existing = merged.findIndex(s => s.id === imp.id)
          if (existing >= 0) merged[existing] = imp
          else merged.push(imp)
        })
        setSections(merged)
        sectionsToCSV(merged, items)
        setMsg(`✓ تم استيراد ${imported.length} قسم من الشيت`)
        setTimeout(() => setMsg(''), 2500)
      } catch (err) {
        setMsg('✗ فشل قراءة الملف: ' + err.message)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-3xl bg-[#0a0a0a] rounded-3xl border border-white/10 overflow-hidden my-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <div>
            <h2 className="text-xl font-black flex items-center gap-2"><Boxes size={20} className="text-accent" /> الأقسام</h2>
            <p className="text-white/40 text-xs mt-0.5">{sorted.length} قسم · {items.length} منتج</p>
          </div>
          <div className="flex gap-2">
            <input ref={fileRef} type="file" accept=".csv" onChange={importCSV} className="hidden" />
            <button onClick={() => fileRef.current?.click()} className="text-xs font-bold px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08]">📥 استيراد CSV</button>
            <button onClick={exportCSV} className="text-xs font-bold px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08]">📤 تصدير CSV</button>
            <button onClick={() => { setNewMode(true); setEditing(null) }} className="text-xs bg-accent/15 text-accent font-bold px-3 py-2 rounded-xl hover:bg-accent/25 flex items-center gap-1">
              <Plus size={12} /> قسم جديد
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-full glass flex items-center justify-center hover:text-white"><X size={16} /></button>
          </div>
        </div>

        <AnimatePresence>
          {msg && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mx-5 mt-3 glass rounded-xl p-2.5 text-sm border border-accent/20">{msg}</motion.div>
          )}
        </AnimatePresence>

        {/* List or Form */}
        <div className="flex-1 overflow-y-auto p-5 scrollbar-none">
          {(editing || newMode) ? (
            <SectionForm section={editing} onSave={saveSection} onDelete={delSection} onCancel={() => { setEditing(null); setNewMode(false) }} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {sorted.map(s => {
                const itemsInSection = items.filter(i => i.section_id === s.id).length
                return (
                  <motion.div key={s.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                    onClick={() => { setEditing(s); setNewMode(false) }}
                    className="glass rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:border-accent/30 transition-colors">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: `${s.color}22`, border: `1px solid ${s.color}44` }}>
                      {s.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate">{s.name_ar}</div>
                      <div className="text-white/40 text-xs truncate">{s.name_en}</div>
                      <div className="text-white/30 text-[10px] mt-0.5">{itemsInSection} منتج · #{s.position}</div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>

        <div className="p-3 border-t border-white/[0.06] text-center text-[10px] text-white/30">
          🔄 أي تعديل هنا بيتحدّث تلقائياً في <code className="text-accent/60">gps_sections.csv</code>
        </div>
      </motion.div>
    </div>
  )
}

function SectionForm({ section, onSave, onDelete, onCancel }) {
  const [form, setForm] = useState(section || {
    id: null, slug: '', name_ar: '', name_en: '',
    color: '#E0FF00', icon: '🍽️', position: 99,
    description_ar: '', description_en: ''
  })

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="space-y-3 bg-white/[0.02] rounded-2xl p-4 border border-white/[0.04]">
      <h3 className="font-bold text-accent text-sm">{section ? `تعديل: ${section.name_ar}` : 'قسم جديد'}</h3>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-white/50 text-[11px] font-bold mb-1 block">الاسم بالعربي *</label>
          <input value={form.name_ar} onChange={e => setForm({...form, name_ar: e.target.value})}
            placeholder="مثال: مشروبات ساخنة" className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-accent/50 placeholder-white/20" />
        </div>
        <div>
          <label className="text-white/50 text-[11px] font-bold mb-1 block">الاسم بالإنجليزي *</label>
          <input value={form.name_en} onChange={e => setForm({...form, name_en: e.target.value})}
            placeholder="Hot Drinks" className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-accent/50 placeholder-white/20" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-white/50 text-[11px] font-bold mb-1 block">Slug (اختياري)</label>
          <input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})}
            placeholder="hot-drinks" className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-accent/50 placeholder-white/20" />
        </div>
        <div>
          <label className="text-white/50 text-[11px] font-bold mb-1 block">ترتيب العرض</label>
          <input type="number" value={form.position} onChange={e => setForm({...form, position: Number(e.target.value)})}
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-accent/50" />
        </div>
      </div>

      <div>
        <label className="text-white/50 text-[11px] font-bold mb-2 block">الأيقونة (إيموجي)</label>
        <div className="grid grid-cols-8 gap-1.5">
          {PREDEFINED.map((p, i) => (
            <button key={i} onClick={() => setForm({...form, icon: p.icon, color: p.color})}
              className={`aspect-square rounded-xl text-2xl flex items-center justify-center transition-all ${form.icon === p.icon ? 'ring-2 ring-accent' : 'bg-white/[0.04] hover:bg-white/[0.08]'}`}>{p.icon}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-white/50 text-[11px] font-bold mb-1 block">لون القسم (hex)</label>
          <div className="flex gap-2">
            <input type="color" value={form.color} onChange={e => setForm({...form, color: e.target.value})}
              className="w-12 h-9 rounded-xl border border-white/10" />
            <input value={form.color} onChange={e => setForm({...form, color: e.target.value})}
              className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-accent/50" />
          </div>
        </div>
        <div>
          <label className="text-white/50 text-[11px] font-bold mb-1 block">أيقونة مخصصة</label>
          <input value={form.icon} onChange={e => setForm({...form, icon: e.target.value})}
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white text-center text-2xl outline-none focus:border-accent/50" />
        </div>
      </div>

      <div>
        <label className="text-white/50 text-[11px] font-bold mb-1 block">وصف مختصر بالعربي</label>
        <input value={form.description_ar} onChange={e => setForm({...form, description_ar: e.target.value})}
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-accent/50" placeholder="مشروبات ساخنة مميزة..." />
      </div>
      <div>
        <label className="text-white/50 text-[11px] font-bold mb-1 block">وصف مختصر بالإنجليزي</label>
        <input value={form.description_en} onChange={e => setForm({...form, description_en: e.target.value})}
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-accent/50" placeholder="Premium hot drinks..." />
      </div>

      <div className="flex gap-2 pt-2">
        <button onClick={() => onSave(form)} className="flex-1 py-3 rounded-xl font-bold text-black text-sm flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg,#E0FF00,#D4FF00)' }}>
          <Save size={15} /> حفظ
        </button>
        <button onClick={onCancel} className="px-6 py-3 rounded-xl bg-white/[0.04] text-white/60 text-sm">إلغاء</button>
      </div>
      {section && (
        <button onClick={() => onDelete(section.id)} className="w-full py-2.5 rounded-xl bg-red-500/15 text-red-400 text-sm flex items-center justify-center gap-2 hover:bg-red-500/25">
          <Trash2 size={14} /> حذف القسم نهائياً
        </button>
      )}
    </motion.div>
  )
}