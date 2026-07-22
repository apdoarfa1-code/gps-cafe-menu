import { useState, useEffect, useCallback } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Boxes, Tag, Activity, RefreshCw, Database, FileText, Sparkles, ChevronLeft, LayoutGrid } from 'lucide-react'
import { useMenuData } from '../hooks/useMenuData.js'
import { hasSupabase } from '../lib/supabase.js'
import AnimatedBackground from '../components/AnimatedBackground.jsx'
import { ShineBorder, Sparkles as MagicSparkles, FloatingOrbs, AnimatedGridPattern } from '../components/magicui/index.js'
import SectionsPanel from '../components/admin/SectionsPanel.jsx'
import ItemsPanel from '../components/admin/ItemsPanel.jsx'
import BookingsPanel from '../components/admin/BookingsPanel.jsx'
import { itemsToCSV, sectionsToCSV, csvItemsToAdmin, csvSectionsToAdmin, parseCSV, subscribeToPaperUpdates } from '../lib/paperMenu.js'

const STORAGE_KEY_S = 'gps_admin_sections'
const STORAGE_KEY_I = 'gps_admin_items'

function loadStored(key, fallback) {
  try { const raw = sessionStorage.getItem(key); if (raw) return JSON.parse(raw) } catch {}
  return fallback
}
function saveStored(key, data) {
  try { sessionStorage.setItem(key, JSON.stringify(data)) } catch {}
}

export default function AdminDashboard() {
  const nav = useNavigate()
  const isAuthed = sessionStorage.getItem('gps_admin') === '1'
  if (!isAuthed) return <Navigate to="/admin/login" replace />

  const { sections: baseSections, items: baseItems, loading, usingDemo } = useMenuData()
  const [sectionItems, setSectionItems] = useState(() => loadStored(STORAGE_KEY_S, []))
  const [itemsList, setItemsList] = useState(() => loadStored(STORAGE_KEY_I, []))
  const [openPanel, setOpenPanel] = useState(null) // 'sections' | 'items' | 'bookings' | null
  const [msg, setMsg] = useState('')

  // Initialize from base data
  useEffect(() => {
    if (baseSections.length && sectionItems.length === 0) {
      setSectionItems(baseSections)
      saveStored(STORAGE_KEY_S, baseSections)
      sectionsToCSV(baseSections, baseItems)
    }
    if (baseItems.length && itemsList.length === 0) {
      setItemsList(baseItems)
      saveStored(STORAGE_KEY_I, baseItems)
      itemsToCSV(baseItems, baseSections)
    }
  }, [baseSections, baseItems])

  // Subscribe to paper (CSV) updates from other tabs/imports
  useEffect(() => {
    const unsub = subscribeToPaperUpdates(({ key }) => {
      // Triggered when CSV imported, auto-refresh local state from localStorage
      if (key === 'gps_paper_items') {
        try {
          const raw = localStorage.getItem('gps_paper_items')
          if (raw) {
            const parsed = parseCSV(['id,section_id,name_ar,name_en,price,rating,image,description_ar,description_en,calories,prep_time,tags,is_active,suggest_id,suggest_id,section_ar,section_en,section_slug'].concat(['']).join('\n'))
            // simpler: just rebuild the local items from the paper
            const items = csvItemsToAdmin(JSON.parse(raw))
            setItemsList(prev => {
              const merged = [...prev]
              items.forEach(imp => {
                const existing = merged.findIndex(i => i.id === imp.id)
                if (existing >= 0) merged[existing] = { ...merged[existing], ...imp }
                else merged.push(imp)
              })
              saveStored(STORAGE_KEY_I, merged)
              return merged
            })
          }
        } catch {}
      } else if (key === 'gps_paper_sections') {
        try {
          const raw = localStorage.getItem('gps_paper_sections')
          if (raw) {
            const sects = csvSectionsToAdmin(JSON.parse(raw))
            setSectionItems(prev => {
              const merged = [...prev]
              sects.forEach(imp => {
                const existing = merged.findIndex(s => s.id === imp.id)
                if (existing >= 0) merged[existing] = { ...merged[existing], ...imp }
                else merged.push(imp)
              })
              saveStored(STORAGE_KEY_S, merged)
              return merged
            })
          }
        } catch {}
      }
    })
    return unsub
  }, [])

  const resetAll = () => {
    if (!confirm('إعادة تعيين كل البيانات للأصل؟')) return
    setSectionItems(baseSections)
    setItemsList(baseItems)
    saveStored(STORAGE_KEY_S, baseSections)
    saveStored(STORAGE_KEY_I, baseItems)
    sectionsToCSV(baseSections, baseItems)
    itemsToCSV(baseItems, baseSections)
    setMsg('✓ تم الإعادة للأصل + تحديث الشيت')
    setTimeout(() => setMsg(''), 2500)
  }

  if (loading && sectionItems.length === 0) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-bg noise-overlay overflow-x-hidden">
      <AnimatedBackground />
      <AnimatedGridPattern dotColor="#E0FF00" dotSize={1} className="opacity-20" />
      <FloatingOrbs count={3} />
      <MagicSparkles count={10} />

      <div className="relative z-10 max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <button onClick={() => nav('/home')} className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/60 hover:text-accent transition-colors">
              <ChevronLeft size={18} className="rotate-180 md:rotate-0" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-black font-display flex items-center gap-2">
                <LayoutGrid size={24} className="text-accent" /> Dashboard
              </h1>
              <p className="text-white/40 text-xs mt-0.5 flex items-center gap-2">
                <span className={`inline-block w-2 h-2 rounded-full ${usingDemo ? 'bg-amber-400' : 'bg-green-400'}`} />
                {usingDemo ? 'وضع Demo (محلي)' : 'متصل بـ Supabase'} · {sectionItems.length} قسم / {itemsList.length} منتج
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={resetAll} className="hidden md:flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/60">
              <RefreshCw size={12} /> Reset
            </button>
            <button onClick={() => { sessionStorage.removeItem('gps_admin'); nav('/home') }}
              className="flex items-center gap-1 text-red-400 text-xs font-bold px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20">
              <LogOut size={12} /> <span className="hidden md:inline">خروج</span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {msg && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-4 glass rounded-2xl p-3 text-sm border border-accent/30 flex items-center gap-2">
              <Sparkles size={14} className="text-accent" /> {msg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Super Stat Strip */}
        <div className="grid grid-cols-3 md:grid-cols-3 gap-2 mb-6">
          {[
            { label: 'الأقسام', value: sectionItems.length, color: '#E0FF00', icon: Boxes },
            { label: 'المنتجات', value: itemsList.length, color: '#52ffa8', icon: Tag },
            { label: 'الحجوزات', value: '—', color: '#ec4899', icon: Activity },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="glass rounded-2xl p-3 md:p-4 text-center">
              <s.icon size={18} className="mx-auto mb-1" style={{ color: s.color }} />
              <div className="text-[10px] text-white/40 mb-0.5">{s.label}</div>
              <div className="text-xl md:text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Three big cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AdminCard
            color="#E0FF00"
            icon={Boxes}
            title="الأقسام"
            subtitle="إدارة أقسام المنيو"
            stat={`${sectionItems.length} قسم`}
            extra={[
              `${itemsList.length} منتج موزع`,
              'تصدير/استيراد CSV',
              '+ صورة وأيقونة ولون',
            ]}
            actionLabel="افتح الأقسام"
            onClick={() => setOpenPanel('sections')}
            delay={0.1}
          />
          <AdminCard
            color="#52ffa8"
            icon={Tag}
            title="المنتجات"
            subtitle="كل الصنف مع التفاصيل الكاملة"
            stat={`${itemsList.length} صنف`}
            extra={[
              'صور + سعر + تقييم',
              'وصف + سعرات + وقت تحضير',
              'ربط CSV بشيت واحد',
            ]}
            actionLabel="افتح المنتجات"
            onClick={() => setOpenPanel('items')}
            delay={0.2}
          />
          <AdminCard
            color="#ec4899"
            icon={Activity}
            title="الحجوزات"
            subtitle="بادل · بلايستيشن · روم VIP"
            stat="3 أنواع"
            extra={[
              'حجز يدوي للموظف',
              'تأكيد / إلغاء / حذف',
              'يشتغل على كل الموبايلات',
            ]}
            actionLabel="افتح الحجوزات"
            onClick={() => setOpenPanel('bookings')}
            delay={0.3}
          />
        </div>

        {/* CSV Sync Tip */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="mt-6 glass rounded-2xl p-4 md:p-5 border border-accent/20 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0">
            <FileText size={18} className="text-accent" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-sm mb-1 flex items-center gap-2">
              🔄 ربط شيت Excel / CSV تلقائي
            </div>
            <p className="text-white/60 text-xs leading-relaxed">
              كل تعديل في <span className="text-accent font-bold">الأقسام</span> أو <span className="text-accent font-bold">المنتجات</span> بينعكس تلقائياً في الشيت (`data/gps_menu_data.csv`).
              اضغط <kbd className="px-1.5 py-0.5 bg-white/[0.06] rounded text-[10px] text-accent">📤 تصدير CSV</kbd> من أي لوحة، عدّل الملف في Excel،
              ثم ارجع واستورده بـ <kbd className="px-1.5 py-0.5 bg-white/[0.06] rounded text-[10px] text-accent">📥 استيراد CSV</kbd>.
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center text-white/20 text-xs mt-8 hidden md:block">
          GPS · CAFE · CLUB · Admin v3
        </div>
      </div>

      {/* Popups */}
      <AnimatePresence>
        {openPanel === 'sections' && (
          <SectionsPanel sections={sectionItems} items={itemsList} setSections={(s) => { setSectionItems(s); saveStored(STORAGE_KEY_S, s); sectionsToCSV(s, itemsList) }} onClose={() => setOpenPanel(null)} />
        )}
        {openPanel === 'items' && (
          <ItemsPanel items={itemsList} sections={sectionItems} setItems={(i) => { setItemsList(i); saveStored(STORAGE_KEY_I, i); itemsToCSV(i, sectionItems) }} onClose={() => setOpenPanel(null)} />
        )}
        {openPanel === 'bookings' && (
          <BookingsPanel onClose={() => setOpenPanel(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

function AdminCard({ color, icon: Icon, title, subtitle, stat, extra, actionLabel, onClick, delay }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="text-right relative group overflow-hidden rounded-3xl p-0"
    >
      <ShineBorder shineColor={color} duration={5 + delay * 2} className="rounded-3xl">
        <div className="relative glass-strong rounded-3xl p-5 md:p-6 overflow-hidden h-full">
          {/* Background radial */}
          <motion.div className="absolute -top-12 -right-12 w-44 h-44 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${color}33, transparent 70%)` }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <motion.div whileHover={{ rotate: 8, scale: 1.1 }} transition={{ type: 'spring', stiffness: 400, damping: 14 }}
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}22`, border: `1px solid ${color}55` }}>
                <Icon size={26} style={{ color }} strokeWidth={2.2} />
              </motion.div>
              <div className="text-right">
                <div className="text-xl md:text-2xl font-black" style={{ color }}>{stat}</div>
                <div className="text-[10px] text-white/40 mt-0.5">إحصائية</div>
              </div>
            </div>

            <h3 className="text-lg md:text-xl font-black font-ar text-white mb-1">{title}</h3>
            <p className="text-white/40 text-xs mb-4">{subtitle}</p>

            <ul className="space-y-1.5">
              {extra?.map((line, i) => (
                <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: delay + 0.1 + i * 0.08 }}
                  className="text-xs text-white/55 flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full flex-shrink-0 mt-1.5" style={{ background: color }} />
                  {line}
                </motion.li>
              ))}
            </ul>

            <motion.div className="flex items-center gap-2 mt-5 text-sm font-bold"
              style={{ color }}>
              <span>{actionLabel}</span>
              <motion.svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity }}>
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </motion.svg>
            </motion.div>
          </div>
        </div>
      </ShineBorder>
    </motion.button>
  )
}