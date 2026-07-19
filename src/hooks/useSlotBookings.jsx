import { useEffect, useState, useCallback } from 'react'
import { fetchSlots, upsertSlot, deleteSlot as sbDeleteSlot, toggleSlotStatus, hasSupabase } from '../lib/supabase.js'

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
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    if (hasSupabase) {
      try {
        const data = await fetchSlots()
        if (data) { setSlots(data); setLoading(false); return }
      } catch (e) { console.warn('Supabase fetchSlots failed:', e.message); setError(e.message) }
    }
    setSlots(loadStored())
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const addSlot = async (slot) => {
    const newSlot = { ...slot, id: Date.now(), status: slot.status || 'available', created_at: new Date().toISOString() }
    const updated = [...slots, newSlot]
    setSlots(updated)
    if (!hasSupabase) {
      saveStored(updated)
    } else {
      try { await upsertSlot(newSlot) } catch (e) { console.warn('upsertSlot failed:', e.message); setError(e.message) }
    }
    return newSlot
  }

  const updateSlot = async (id, updates) => {
    const updated = slots.map(s => s.id === id ? { ...s, ...updates } : s)
    setSlots(updated)
    const target = updated.find(s => s.id === id)
    if (!hasSupabase) {
      saveStored(updated)
    } else if (target) {
      try { await upsertSlot(target) } catch (e) { console.warn('upsertSlot (update) failed:', e.message); setError(e.message) }
    }
  }

  const toggleSlot = async (id) => {
    const slot = slots.find(s => s.id === id)
    if (!slot) return
    const newStatus = slot.status === 'booked' ? 'available' : 'booked'
    await updateSlot(id, { status: newStatus })
    return newStatus
  }

  const deleteSlotById = async (id) => {
    const updated = slots.filter(s => s.id !== id)
    setSlots(updated)
    if (!hasSupabase) {
      saveStored(updated)
    } else {
      try { await sbDeleteSlot(id) } catch (e) { console.warn('deleteSlot failed:', e.message); setError(e.message) }
    }
  }

  // Get booked slots for a specific date (and optional type)
  const getBookedForDate = (date, type = 'all') => {
    return slots.filter(s => s.status === 'booked' && s.date === date && (type === 'all' || s.type === type))
  }

  // Check if a specific slot is taken
  const isSlotTaken = (date, time, type = 'padel') => {
    return slots.some(s => s.status === 'booked' && s.date === date && s.time === time && s.type === type)
  }

  return { slots, loading, error, addSlot, updateSlot, toggleSlot, deleteSlot: deleteSlotById, getBookedForDate, isSlotTaken, refresh }
}