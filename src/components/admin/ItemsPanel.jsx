import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Upload, Trash2, Plus, Image as ImageIcon, Tag, DollarSign, Hash, Flame } from 'lucide-react'
import { hasSupabase, upsertItem, deleteItem } from '../../lib/supabase.js'
import { itemsToCSV, itemsToCSVString, itemsToCSV as writeBack, csvItemsToAdmin, parseCSV, downloadCSVFile } from '../../lib/paperMenu.js'

const API_URL = import.meta.env.VITE_SUPABASE_URL
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export default function ItemsPanel({ items, sections, setItems, onClose }) {
  const [editing, setEditing] = useState(null)
  const [newMode, setNewMode] = useState(false)
  const [msg, setMsg] = useState('')
  const [filterSection, setFilterSection] = useState('all')
  const [search, setSearch] = useState('')
  const fileRef = useRef(null)
  const imgRef = useRef(null)

  const filtered = items
    .filter(i => filterSection === 'all' ? true : i.section_id === Number(filterSection))
    .filter(i => !search || i.name_ar.includes(search) || i.name_en.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.id - b.id)

  const sectionMap = {}
  sections.forEach(s => { sectionMap[s.id] = s })

  const refreshSheet = () => {
    writeBack(items, sections)
    setMsg(`✓ تم تحديث الشيت — ${items.length} منتج`)
    setTimeout(() => setMsg(''), 2000)
  }

  const saveItem = async (form) => {
    let updated
    if (form.id && items.find(i => i.id === form.id)) {
      updated = items.map(i => i.id === form.id ? { ...i, ...form } : i)
      setMsg(`✓ تم حفظ ${form.name_ar}`)
    } else {
      const newId = Date.now()
      updated = [...items, { ...form, id: newId }]
      setMsg(`✓ تم إضافة ${form.name_ar}`)
    }
    setItems(updated)
    writeBack(updated, sections)
    if (hasSupabase) {
      try { await upsertItem(updated[updated.length-1]) } catch {}
    }
    setEditing(null); setNewMode(false)
    setTimeout(() => setMsg(''), 2000)
  }

  const delItem = async (id) => {
    if (!confirm('حذف المنتج؟')) return
    const updated = items.filter(i => i.id !== id)
    setItems(updated)
    writeBack(updated, sections)
    if (hasSupabase) {
      try { await deleteItem(id) } catch {}
    }
    setMsg('✓ تم حذف المنتج')
    setTimeout(() => setMsg(''), 2000)
  }

  const exportCSV = () => {
    const csv = itemsToCSVString(items, sections)
    downloadCSVFile(csv, `gps_menu_items_${new Date().toISOString().slice(0, 10)}.csv`)
    setMsg('تم تنزيل شيت المنتجات')
    setTimeout(() => setMsg(''), 2000)
  }

  const importCSV = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const parsed = parseCSV(evt.target.result)
        const imported = csvItemsToAdmin(parsed)
        const merged = [...items]
        imported.forEach(imp => {
          const existing = merged.findIndex(i => i.id === imp.id)
          if (existing >= 0) merged[existing] = { ...merged[existing], ...imp }
          else merged.push(imp)
        })
        setItems(merged)
        writeBack(merged, sections)
        setMsg(`✓ تم استيراد ${imported.length} منتج من الشيت`)
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
        className="w-full max-w-4xl bg-[#0a0a0a] rounded-3xl border border-white/10 overflow-hidden my-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <div>
            <h2 className="text-xl font-black flex items-center gap-2"><Tag size={20} className="text-accent" /> المنتجات</h2>
            <p className="text-white/40 text-xs mt-0.5">{items.length} منتج في {sections.length} قسم</p>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            <input ref={fileRef} type="file" accept=".csv" onChange={importCSV} className="hidden" />
            <input ref={imgRef} type="file" accept=".csv,image/*" onChange={importCSV} className="hidden" />
            <button onClick={() => fileRef.current?.click()} className="text-xs font-bold px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08]">📥 CSV</button>
            <button onClick={exportCSV} className="text-xs font-bold px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08]">📤 CSV</button>
            <button onClick={() => { setNewMode(true); setEditing(null) }} className="text-xs bg-accent/15 text-accent font-bold px-3 py-2 rounded-xl hover:bg-accent/25 flex items-center gap-1">
              <Plus size={12} /> صنف جديد
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

        {/* Filters */}
        {!editing && !newMode && (
          <div className="px-5 pt-3 flex gap-2 flex-wrap">
            <input placeholder="ابحث..." value={search} onChange={e => setSearch(e.target.value)}
              className="flex-1 min-w-[120px] bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-accent/50 placeholder-white/20" />
            <select value={filterSection} onChange={e => setFilterSection(e.target.value)}
              className="bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none">
              <option value="all" className="bg-bg2">كل الأقسام</option>
              {sections.map(s => <option key={s.id} value={s.id} className="bg-bg2">{s.icon} {s.name_ar}</option>)}
            </select>
            <div className="bg-white/[0.04] px-3 py-2 rounded-xl text-xs text-white/40 self-center">{filtered.length} نتيجة</div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5 scrollbar-none">
          {(editing || newMode) ? (
            <ItemForm item={editing} sections={sections} onSave={saveItem} onDelete={delItem} onCancel={() => { setEditing(null); setNewMode(false) }} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {filtered.map(i => {
                const sec = sectionMap[i.section_id]
                return (
                  <motion.div key={i.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                    onClick={() => { setEditing(i); setNewMode(false) }}
                    className="glass rounded-2xl p-2.5 cursor-pointer hover:border-accent/30 transition-colors">
                    {i.image && <img src={i.image} className="w-full aspect-square object-cover rounded-xl mb-2" alt="" />}
                    {!i.image && (
                      <div className="w-full aspect-square rounded-xl mb-2 flex items-center justify-center bg-white/[0.03]">
                        <span className="text-4xl opacity-30">{sec?.icon || '🍽️'}</span>
                      </div>
                    )}
                    <div className="text-xs font-bold truncate">{i.name_ar}</div>
                    <div className="text-white/40 text-[10px] truncate">{i.name_en}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-accent font-black text-sm">{i.price} ج.م</span>
                      <span className="text-[9px] text-white/30 bg-white/[0.04] px-1.5 py-0.5 rounded">{sec?.name_ar || '-'}</span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>

        <div className="p-3 border-t border-white/[0.06] text-center text-[10px] text-white/30">
          🔄 بيتم تحديث <code className="text-accent/60">gps_menu_items.csv</code> تلقائياً مع كل تعديل
        </div>
      </motion.div>
    </div>
  )
}

function ItemForm({ item, sections, onSave, onDelete, onCancel }) {
  const [form, setForm] = useState(item || {
    id: null, section_id: sections[0]?.id || 1,
    name_ar: '', name_en: '', price: 0, rating: 4.7,
    image: '', description_ar: '', description_en: '',
    calories: '', prep_time: '', tags: '', is_active: true,
    suggest_id: null
  })
  const [uploading, setUploading] = useState(false)
  const [uploadErr, setUploadErr] = useState('')

  const uploadImage = async (file) => {
    if (!API_URL || !ANON_KEY) {
      // Fallback to base64 storage
      const reader = new FileReader()
      reader.onload = e => setForm(f => ({...f, image: e.target.result}))
      reader.readAsDataURL(file)
      return
    }
    setUploading(true); setUploadErr('')
    try {
      const name = `items/${Date.now()}-${file.name.replace(/\s/g,'')}`
      const res = await fetch(`${API_URL}/storage/v1/object/public/images/${name}`, {
        method: 'POST', headers: { Authorization: `Bearer ${ANON_KEY}` }, body: file,
      })
      if (!res.ok) throw new Error(await res.text())
      setForm(f => ({...f, image: `${API_URL}/storage/v1/object/public/images/${name}` }))
    } catch (e) { setUploadErr('فشل: ' + e.message) }
    finally { setUploading(false) }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="space-y-3 bg-white/[0.02] rounded-2xl p-4 border border-white/[0.04]">
      <h3 className="font-bold text-accent text-sm">{item ? `تعديل: ${item.name_ar}` : 'صنف جديد'}</h3>

      {/* Image */}
      <div className="flex items-start gap-3">
        <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-white/[0.04] border border-white/10">
          {form.image
            ? <img src={form.image} className="w-full h-full object-cover" alt="" />
            : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={24} className="text-white/20" /></div>}
        </div>
        <div className="flex-1">
          <label className="text-white/50 text-[11px] font-bold mb-1 block">صورة المنتج</label>
          <input type="file" accept="image/*" onChange={e => e.target.files[0] && uploadImage(e.target.files[0])}
            className="block w-full text-xs text-white/60 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-accent/15 file:text-accent hover:file:bg-accent/25" />
          <input value={form.image} onChange={e => setForm({...form, image: e.target.value})}
            placeholder="أو رابط الصورة"
            className="w-full mt-2 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-accent/50 placeholder-white/20" />
          {uploading && <p className="text-xs text-white/40 mt-1">جاري الرفع...</p>}
          {uploadErr && <p className="text-xs text-red-400 mt-1">{uploadErr}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input value={form.name_ar} onChange={e => setForm({...form, name_ar: e.target.value})} placeholder="الاسم بالعربي *" className="bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-accent/50 placeholder-white/20" />
        <input value={form.name_en} onChange={e => setForm({...form, name_en: e.target.value})} placeholder="Name English *" className="bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-accent/50 placeholder-white/20" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <select value={form.section_id} onChange={e => setForm({...form, section_id: Number(e.target.value)})}
          className="bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none">
          {sections.map(s => <option key={s.id} value={s.id} className="bg-bg2">{s.icon} {s.name_ar}</option>)}
        </select>
        <div className="relative">
          <DollarSign size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input type="number" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} step="0.01"
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-3 pr-9 py-2.5 text-sm text-white outline-none focus:border-accent/50" placeholder="السعر" />
        </div>
        <input type="number" step="0.1" min="1" max="5" value={form.rating} onChange={e => setForm({...form, rating: Number(e.target.value)})}
          className="bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-accent/50" placeholder="Rating" />
      </div>

      <textarea rows={2} value={form.description_ar} onChange={e => setForm({...form, description_ar: e.target.value})}
        placeholder="وصف قصير بالعربي" className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-accent/50 placeholder-white/20 resize-none" />
      <textarea rows={2} value={form.description_en} onChange={e => setForm({...form, description_en: e.target.value})}
        placeholder="Short description in English" className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-accent/50 placeholder-white/20 resize-none" />

      <div className="grid grid-cols-3 gap-3">
        <div className="relative">
          <Flame size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={form.calories} onChange={e => setForm({...form, calories: e.target.value})} placeholder="سعرات"
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-3 pr-9 py-2.5 text-sm text-white outline-none focus:border-accent/50 placeholder-white/20" />
        </div>
        <input value={form.prep_time} onChange={e => setForm({...form, prep_time: e.target.value})} placeholder="وقت التحضير"
          className="bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-accent/50 placeholder-white/20" />
        <input type="number" value={form.suggest_id ?? ''} onChange={e => setForm({...form, suggest_id: e.target.value ? Number(e.target.value) : null})}
          placeholder="اقترح مع (ID)" className="bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-accent/50 placeholder-white/20" />
      </div>

      <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})}
        placeholder="تاجات (مفصولة بفواصل): popular, new, vegan"
        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-accent/50 placeholder-white/20" />

      <label className="flex items-center gap-2 text-sm text-white/70">
        <input type="checkbox" checked={form.is_active !== false} onChange={e => setForm({...form, is_active: e.target.checked})}
          className="rounded accent-accent w-4 h-4" />
        مفعّل (يظهر للعملاء)
      </label>

      <div className="flex gap-2 pt-2">
        <button onClick={() => onSave(form)} className="flex-1 py-3 rounded-xl font-bold text-black text-sm flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg,#E0FF00,#D4FF00)' }}>
          <Save size={15} /> حفظ الصنف
        </button>
        <button onClick={onCancel} className="px-6 py-3 rounded-xl bg-white/[0.04] text-white/60 text-sm">إلغاء</button>
      </div>
      {item && (
        <button onClick={() => onDelete(item.id)} className="w-full py-2.5 rounded-xl bg-red-500/15 text-red-400 text-sm flex items-center justify-center gap-2 hover:bg-red-500/25">
          <Trash2 size={14} /> حذف نهائياً
        </button>
      )}
    </motion.div>
  )
}