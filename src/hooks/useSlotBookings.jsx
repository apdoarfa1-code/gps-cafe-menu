import { useEffect, useState } from 'react'
import { fetchSlots, hasSupabase } from '../lib/supabase.js'

const STORAGE_KEY = 'gps_slot_bookings'

function loadStored() {
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : [] } catch { return [] }
}

function saveStored(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
}

export function useSlotBookings() {
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(false)

  const refresh = async () => {
    setLoading(true)
    if (hasSupabase) {
      try {
        const data = await fetchSlots()
        if (data) { setSlots(data); return }
      } catch (e) { console.warn('Supabase fetchSlots failed:', e.message) }
    }
    setSlots(loadStored())
    setLoading(false)
  }

  useEffect(() => { refresh() }, [])

  const addSlot = (slot) => {
    const newSlot = { ...slot, id: Date.now(), created_at: new Date().toISOString() }
    const updated = [...slots, newSlot]
    setSlots(updated)
    if (!hasSupabase) saveStored(updated)
    return newSlot
  }

  const updateSlot = (id, updates) => {
    const updated = slots.map(s => s.id === id ? { ...s, ...updates } : s)
    setSlots(updated)
    if (!hasSupabase) saveStored(updated)
  }

  const toggleSlot = (id) => {
    const slot = slots.find(s => s.id === id)
    if (!slot) return
    const newStatus = slot.status === 'booked' ? 'available' : 'booked'
    updateSlot(id, { status: newStatus })
    return newStatus
  }

  const deleteSlot = (id) => {
    const updated = slots.filter(s => s.id !== id)
    setSlots(updated)
    if (!hasSupabase) saveStored(updated)
  }

  // Get booked slots for a specific date
  const getBookedForDate = (date, type = 'all') => {
    return slots.filter(s => s.status === 'booked' && s.date === date && (type === 'all' || s.type === type))
  }

  // Check if a specific slot is taken
  const isSlotTaken = (date, time, type = 'padel') => {
    return slots.some(s => s.status === 'booked' && s.date === date && s.time === time && s.type === type)
  }

  return { slots, loading, addSlot, updateSlot, toggleSlot, deleteSlot, getBookedForDate, isSlotTaken, refresh }
}