import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = (url && key) ? createClient(url, key) : null
export const hasSupabase = Boolean(supabase)

export async function fetchSections() {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('sections')
    .select('id, slug, name_ar, name_en, color, icon, position')
    .order('position', { ascending: true })
  if (error) throw error
  return data
}

export async function fetchItems() {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('items')
    .select('id, section_id, name_ar, name_en, price, image, rating, suggest_id')
    .order('id', { ascending: true })
  if (error) throw error
  return data
}

export async function upsertSection(row) {
  if (!supabase) return null
  const { data, error } = await supabase.from('sections').upsert(row).select()
  if (error) throw error
  return data
}

export async function upsertItem(row) {
  if (!supabase) return null
  const { data, error } = await supabase.from('items').upsert(row).select()
  if (error) throw error
  return data
}

export async function deleteSection(id) {
  if (!supabase) return null
  const { data, error } = await supabase.from('sections').delete().eq('id', id).select()
  if (error) throw error
  return data
}

export async function deleteItem(id) {
  if (!supabase) return null
  const { data, error } = await supabase.from('items').delete().eq('id', id).select()
  if (error) throw error
  return data
}
