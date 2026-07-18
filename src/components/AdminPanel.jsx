import { useState, useEffect } from 'react'
import { useMenuData } from '../hooks/useMenuData.js'

export default function AdminPage() {
  const { sections, items, loading, usingDemo } = useMenuData()
  const [show, setShow] = useState(false)

  if (loading) return null
  if (usingDemo) return (
    <div className="fixed bottom-4 left-4 z-50 glass rounded-xl p-3 text-xs text-white/70">
      Demo data active. Add <code className="text-gold">VITE_SUPABASE_URL</code> in <code>.env</code> to connect Supabase.
    </div>
  )

  return (
    <>
      <button
        onClick={() => setShow(!show)}
        className="fixed bottom-4 left-4 z-50 glass rounded-full p-3 text-gold text-xs font-bold active:scale-95"
      >
        {show ? 'X' : 'ADMIN'}
      </button>
      {show && (
        <div className="fixed bottom-14 left-4 z-50 glass rounded-2xl p-4 w-72 max-h-[60vh] overflow-auto space-y-3 text-xs">
          <h3 className="text-gold font-bold text-base">Admin — {sections.length} sections, {items.length} items</h3>
          {sections.map((s) => (
            <div key={s.id} className="border-b border-white/5 pb-2 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">{s.icon}</span>
                <div>
                  <strong>{s.name_ar}</strong>
                  <span className="text-white/30 ml-1">{s.name_en}</span>
                </div>
                <span className="ml-auto text-white/20">{s.color}</span>
              </div>
              {items.filter(i => i.section_id === s.id).map((i) => (
                <div key={i.id} className="flex justify-between ml-8 text-white/50">
                  <span>{i.name_ar} / {i.name_en}</span>
                  <span className="text-gold/60">{i.price} EGP</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  )
}