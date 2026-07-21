import { useState, useEffect, useCallback } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LogOut, Plus, Trash2, X, Search, Upload,
  Boxes, Tag, ArrowLeft, Save,
} from 'lucide-react'
import { useMenuData } from '../hooks/useMenuData.js'
import { hasSupabase, upsertSection, upsertItem, deleteSection, deleteItem } from '../lib/supabase.js'
import AnimatedBackground from '../components/AnimatedBackground.jsx'
import SlotManager from '../components/SlotManager.jsx'
import { Download } from 'lucide-react'
import { downloadCSV } from '../lib/csvExport.js'

const API_URL = import.meta.env.VITE_SUPABASE_URL
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const STORAGE_KEY_S = 'gps_admin_sections'
const STORAGE_KEY_I = 'gps_admin_items'

function loadStored(key, fallback) {
  try { const raw = sessionStorage.getItem(key); if (raw) return JSON.parse(raw) } catch {}
  return fallback
}
function saveStored(key, data) {
  try { sessionStorage.setItem(key, JSON.stringify(data)) } catch {}
}

const inputCls = 'w-full bg-white/[0.06] border border-white/10 rounded-xl px-3.5 py-3 text-white text-sm outline-none focus:border-accent/60 focus:bg-white/[0.1] transition-all placeholder-white/25 font-ar'

function SectionForm({ section, onSave, onDelete, onCancel }) {
  const [form, setForm] = useState(section || { id: null, name_ar: '', name_en: '', slug: '', color: '#D6FF00', icon: '🍽️', position: 1 })

  useEffect(() => { if (section) setForm({...section}) }, [section])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      className="glass-strong rounded-2xl p-5 space-y-3"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-accent font-bold text-sm flex items-center gap-2"><Boxes size={14} /> {section ? 'Edit Section' : 'New Section'}</h4>
        <button onClick={onCancel} className="text-white/30 hover:text-white"><X size={18} /></button>
      </div>
      <input className={inputCls} placeholder="الاسم عربي" value={form.name_ar} onChange={e => setForm(f => ({...f, name_ar: e.target.value}))} />
      <input className={inputCls} placeholder="Name English" value={form.name_en} onChange={e => setForm(f => ({...f, name_en: e.target.value}))} />
      <input className={inputCls} placeholder="slug" value={form.slug} onChange={e => setForm(f => ({...f, slug: e.target.value}))} />
      <div className="flex gap-2">
        <input className={inputCls} placeholder="#hex color" value={form.color} onChange={e => setForm(f => ({...f, color: e.target.value}))} />
        <input className={`${inputCls} w-20`} type="number" placeholder="ترتيب" value={form.position} onChange={e => setForm(f => ({...f, position: Number(e.target.value)}))} />
        <input className={`${inputCls} w-16 text-center text-xl`} placeholder="🎯" value={form.icon} onChange={e => setForm(f => ({...f, icon: e.target.value}))} />
      </div>
      <button onClick={() => onSave(form)} className="w-full py-3 rounded-xl font-bold text-black text-sm flex items-center justify-center gap-2"
        style={{ background: 'linear-gradient(135deg,#D6FF00,#CFFF04)' }}>
        <Save size={15} /> Save
      </button>
      {section && (
        <button onClick={() => onDelete(section.id)} className="w-full py-2.5 rounded-xl bg-red-500/15 text-red-400 text-sm flex items-center justify-center gap-2">
          <Trash2 size={14} /> Delete Permanently
        </button>
      )}
    </motion.div>
  )
}

function ItemForm({ item, sections, onSave, onDelete, onCancel }) {
  const [form, setForm] = useState(item || { id: null, section_id: sections[0]?.id || 1, name_ar: '', name_en: '', price: 0, rating: 4.7, image: '', suggest_id: null })
  const [uploading, setUploading] = useState(false)
  const [uploadErr, setUploadErr] = useState('')

  useEffect(() => { if (item) setForm({...item}) }, [item])

  const uploadImage = async (file) => {
    if (!API_URL || !ANON_KEY) { setUploadErr('Supabase not configured'); return }
    setUploading(true); setUploadErr('')
    try {
      const name = `items/${Date.now()}-${file.name.replace(/\s/g,'')}`
      const res = await fetch(`${API_URL}/storage/v1/object/public/images/${name}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${ANON_KEY}` },
        body: file,
      })
      if (!res.ok) throw new Error(await res.text())
      setForm(f => ({...f, image: `${API_URL}/storage/v1/object/public/images/${name}` }))
    } catch (e) { setUploadErr('Upload failed: ' + e.message) }
    finally { setUploading(false) }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      className="glass-strong rounded-2xl p-5 space-y-3"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-accent font-bold text-sm flex items-center gap-2"><Tag size={14} /> {item ? 'Edit Item' : 'New Item'}</h4>
        <button onClick={onCancel} className="text-white/30 hover:text-white"><X size={18} /></button>
      </div>
      <select className={inputCls} value={form.section_id} onChange={e => setForm(f => ({...f, section_id: Number(e.target.value)}))}>
        {sections.map(s => <option key={s.id} value={s.id} className="bg-bg2">{s.name_ar}</option>)}
      </select>
      <input className={inputCls} placeholder="الاسم عربي" value={form.name_ar} onChange={e => setForm(f => ({...f, name_ar: e.target.value}))} />
      <input className={inputCls} placeholder="Name English" value={form.name_en} onChange={e => setForm(f => ({...f, name_en: e.target.value}))} />
      <div className="flex gap-2">
        <input className={inputCls} type="number" placeholder="Price (EGP)" value={form.price} onChange={e => setForm(f => ({...f, price: Number(e.target.value)}))} />
        <input className={`${inputCls} w-24`} type="number" step="0.1" min="1" max="5" placeholder="Rating" value={form.rating} onChange={e => setForm(f => ({...f, rating: Number(e.target.value)}))} />
      </div>
      <div>
        <label className="flex items-center gap-2 justify-center py-3 rounded-xl bg-white/[0.04] border border-dashed border-white/10 text-xs text-white/40 cursor-pointer hover:border-accent/50 hover:text-accent transition-all font-ar">
          {uploading ? 'جاري الرفع…' : (<><Upload size={14} /> {form.image ? 'تغيير الصورة' : 'رفع صورة'}</>)}
          <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files[0] && uploadImage(e.target.files[0])} />
        </label>
        {form.image && <img src={form.image} alt="" className="w-16 h-16 object-cover rounded-xl mt-2 mx-auto" />}
        <input className={`${inputCls} mt-2`} placeholder="أو الصق رابط الصورة" value={form.image} onChange={e => setForm(f => ({...f, image: e.target.value}))} />
        {uploadErr && <p className="text-red-400 text-xs mt-1">{uploadErr}</p>}
      </div>
      <button onClick={() => onSave(form)} className="w-full py-3 rounded-xl font-bold text-black text-sm flex items-center justify-center gap-2"
        style={{ background: 'linear-gradient(135deg,#D6FF00,#CFFF04)' }}>
        <Save size={15} /> Save
      </button>
      {item && (
        <button onClick={() => onDelete(item.id)} className="w-full py-2.5 rounded-xl bg-red-500/15 text-red-400 text-sm flex items-center justify-center gap-2">
          <Trash2 size={14} /> Delete Permanently
        </button>
      )}
    </motion.div>
  )
}

export default function AdminDashboard() {
  const nav = useNavigate()
  const isAuthed = sessionStorage.getItem('gps_admin') === '1'
  if (!isAuthed) return <Navigate to="/admin/login" replace />

  const { sections: baseSections, items: baseItems, loading, usingDemo } = useMenuData()
  const [sectionItems, setSectionItems] = useState(() => loadStored(STORAGE_KEY_S, []))
  const [itemsList, setItemsList] = useState(() => loadStored(STORAGE_KEY_I, []))
  const [editingSection, setEditingSection] = useState(null)
  const [newSection, setNewSection] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [newItem, setNewItem] = useState(false)
  const [search, setSearch] = useState('')
  const [msg, setMsg] = useState('')

  // Initialize from base data if nothing stored
  useEffect(() => {
    if (baseSections.length && sectionItems.length === 0) {
      setSectionItems(baseSections)
      saveStored(STORAGE_KEY_S, baseSections)
    }
    if (baseItems.length && itemsList.length === 0) {
      setItemsList(baseItems)
      saveStored(STORAGE_KEY_I, baseItems)
    }
  }, [baseSections, baseItems])

  const filteredItems = itemsList.filter(i =>
    !search || i.name_ar.includes(search) || i.name_en.toLowerCase().includes(search.toLowerCase())
  )

  if (loading && sectionItems.length === 0) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    )
  }

  const resetAll = () => {
    setSectionItems(baseSections)
    setItemsList(baseItems)
    saveStored(STORAGE_KEY_S, baseSections)
    saveStored(STORAGE_KEY_I, baseItems)
    setMsg('✓ Reset to original data')
  }

  const saveSection = async (form) => {
    if (hasSupabase) {
      try { await upsertSection(form); setMsg('✓ Saved to Supabase') } catch (e) { setMsg('✗ ' + e.message); return }
    }
    let updated
    if (form.id && sectionItems.find(s => s.id === form.id)) {
      updated = sectionItems.map(s => s.id === form.id ? { ...s, ...form } : s)
    } else {
      const newId = Date.now()
      updated = [...sectionItems, { ...form, id: newId }]
    }
    setSectionItems(updated)
    saveStored(STORAGE_KEY_S, updated)
    setMsg('✓ القسم تم حفظه')
    setEditingSection(null); setNewSection(false)
  }

  const delSection = async (id) => {
    if (hasSupabase) {
      try { await deleteSection(id); setMsg('✓ Deleted') } catch (e) { setMsg('✗ ' + e.message); return }
    }
    const updated = sectionItems.filter(s => s.id !== id)
    setSectionItems(updated)
    saveStored(STORAGE_KEY_S, updated)
    // Also remove items linked to this section
    const cleanItems = itemsList.filter(i => i.section_id !== id)
    setItemsList(cleanItems)
    saveStored(STORAGE_KEY_I, cleanItems)
    setMsg('✓ القسم تم حذفه'); setEditingSection(null)
  }

  const saveItem = async (form) => {
    if (hasSupabase) {
      try { await upsertItem(form); setMsg('✓ Saved to Supabase') } catch (e) { setMsg('✗ ' + e.message); return }
    }
    let updated
    if (form.id && itemsList.find(i => i.id === form.id)) {
      updated = itemsList.map(i => i.id === form.id ? { ...i, ...form } : i)
    } else {
      const newId = Date.now()
      updated = [...itemsList, { ...form, id: newId }]
    }
    setItemsList(updated)
    saveStored(STORAGE_KEY_I, updated)
    setMsg('✓ المنتج تم حفظه')
    setEditingItem(null); setNewItem(false)
  }

  const delItem = async (id) => {
    if (hasSupabase) {
      try { await deleteItem(id); setMsg('✓ Deleted') } catch (e) { setMsg('✗ ' + e.message); return }
    }
    const updated = itemsList.filter(i => i.id !== id)
    setItemsList(updated)
    saveStored(STORAGE_KEY_I, updated)
    setMsg('✓ المنتج تم حذفه'); setEditingItem(null)
  }

  return (
    <div className="relative min-h-screen bg-bg noise-overlay">
      <AnimatedBackground />
      <div className="relative z-10 max-w-md mx-auto p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <button onClick={() => nav('/home')}
              className="w-9 h-9 rounded-full glass flex items-center justify-center text-white/60 hover:text-accent transition-colors">
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-xl font-black font-display">Dashboard</h1>
              <p className="text-white/40 text-[11px] font-ar">{usingDemo ? 'محلي' : 'Supabase'} · {sectionItems.length} اقسام / {itemsList.length} منتجات</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <button onClick={resetAll} className="text-xs font-bold px-2 py-1.5 rounded-xl bg-accent/5 text-accent/60">Reset</button>
            <button onClick={() => { sessionStorage.removeItem('gps_admin'); sessionStorage.removeItem(STORAGE_KEY_S); sessionStorage.removeItem(STORAGE_KEY_I); nav('/home') }}
              className="flex items-center gap-1 text-red-400 text-xs font-bold px-2 py-1.5 rounded-xl bg-red-500/10">
              <LogOut size={12} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {msg && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="glass rounded-xl p-3 text-white/80 text-xs mb-4 flex justify-between items-center">
              <span>{msg}</span>
              <button onClick={() => setMsg('')} className="text-white/30 hover:text-white"><X size={14} /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sections */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2"><Boxes size={16} className="text-accent" /> الأقسام</h3>
            <button onClick={() => { setNewSection(true); setEditingSection(null); setEditingItem(null); setNewItem(false) }}
              className="text-xs bg-accent/15 text-accent font-bold px-3 py-1.5 rounded-xl hover:bg-accent/25 flex items-center gap-1">
              <Plus size={12} /> جديد
            </button>
          </div>
          <div className="space-y-2 max-h-[28vh] overflow-auto scrollbar-none">
            {sectionItems.map(s => (
              <div key={s.id}
                onClick={() => { setEditingSection(s); setNewSection(false); setEditingItem(null); setNewItem(false) }}
                className={`glass rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition-all ${editingSection?.id === s.id ? 'ring-1 ring-accent/50 bg-accent/5' : ''}`}>
                <span className="text-xl w-7 text-center">{s.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{s.name_ar}</div>
                  <div className="text-white/30 text-xs truncate">{s.name_en}</div>
                </div>
                <div className="w-3.5 h-3.5 rounded-full flex-shrink-0 border-2 border-white/10" style={{ background: s.color, boxShadow: `0 0 12px ${s.color}55` }} />
              </div>
            ))}
          </div>
        </div>

        {/* Items */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2"><Tag size={16} className="text-accent" /> المنتجات</h3>
            <button onClick={() => { setNewItem(true); setEditingItem(null); setNewSection(false); setEditingSection(null) }}
              className="text-xs bg-accent/15 text-accent font-bold px-3 py-1.5 rounded-xl hover:bg-accent/25 flex items-center gap-1">
              <Plus size={12} /> جديد
            </button>
          </div>
          <div className="glass rounded-xl flex items-center gap-2 px-3 py-2.5 mb-3">
            <Search size={14} className="text-accent/60 flex-shrink-0" />
            <input placeholder="ابحث عن منتج…" value={search} onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/30 font-ar" />
            {search && <button onClick={() => setSearch('')} className="text-white/30 hover:text-white"><X size={12} /></button>}
          </div>
          <div className="space-y-1.5 max-h-[32vh] overflow-auto scrollbar-none">
            {filteredItems.map(i => {
              const sec = sectionItems.find(s => s.id === i.section_id)
              return (
                <div key={i.id}
                  onClick={() => { setEditingItem(i); setNewItem(false); setNewSection(false); setEditingSection(null) }}
                  className={`glass rounded-2xl p-2.5 flex items-center gap-2.5 cursor-pointer transition-all ${editingItem?.id === i.id ? 'ring-1 ring-accent/50 bg-accent/5' : ''}`}>
                  <img src={i.image || '/assets/images/placeholder.jpg'} alt="" className="w-10 h-10 object-cover rounded-lg flex-shrink-0 bg-bg2" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs truncate">{i.name_ar}</div>
                    <div className="text-white/30 text-[10px] truncate">{i.name_en}</div>
                  </div>
                  <div className="text-accent font-black text-xs flex-shrink-0">{i.price} ج.م</div>
                </div>
              )
            })}
            {filteredItems.length === 0 && <p className="text-white/20 text-xs text-center py-4">لا يوجد منتجات</p>}
          </div>
        </div>

        {/* Slot Booking Manager — Card */}
        <div className="mt-6 pt-6 border-t border-white/[0.06]">
          <SlotManager />
        </div>
      </div>

      <AnimatePresence>
        {(newSection || editingSection) && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm" onClick={() => { setEditingSection(null); setNewSection(false) }}>
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md p-4">
              <SectionForm section={editingSection} onSave={saveSection} onDelete={delSection} onCancel={() => { setEditingSection(null); setNewSection(false) }} />
            </div>
          </div>
        )}
        {(newItem || editingItem) && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm" onClick={() => { setEditingItem(null); setNewItem(false) }}>
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md p-4">
              <ItemForm item={editingItem} sections={sectionItems} onSave={saveItem} onDelete={delItem} onCancel={() => { setEditingItem(null); setNewItem(false) }} />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}