import { useEffect, useState } from 'react'
import { fetchSections, fetchItems, hasSupabase } from '../lib/supabase.js'
import { demoSections, demoItems } from '../data/demoData.js'

export function useMenuData() {
  const [sections, setSections] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [usingDemo, setUsingDemo] = useState(!hasSupabase)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!hasSupabase) {
        setSections(demoSections)
        setItems(demoItems)
        setUsingDemo(true)
        setLoading(false)
        return
      }
      try {
        const [s, i] = await Promise.all([fetchSections(), fetchItems()])
        if (cancelled) return
        if (!s || !s.length) { setSections(demoSections); setItems(demoItems); setUsingDemo(true) }
        else { setSections(s); setItems(i || []); setUsingDemo(false) }
      } catch (e) {
        console.warn('Supabase failed, fallback to demo:', e.message)
        setSections(demoSections)
        setItems(demoItems)
        setUsingDemo(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return { sections, items, loading, usingDemo }
}
