import { useEffect, useState, useCallback } from 'react'
import { fetchSlots, upsertSlot, deleteSlot as sbDeleteSlot, toggleSlotStatus, hasSupabase } from '../lib/supabase.js'

const STORAGE_KEY = 'gps_slot_bookings'
const DAY_MAP = { 'السبت': 6, 'الأحد': 0, 'الإثنين': 1, 'الثلاثاء': 2, 'الأربعاء': 3, 'الخميس': 4, 'الجمعة': 5 }

function loadStored() {
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : [] } catch { return [] }
}

function saveStored(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
}

function cleanExpiredSlots(slots) {
  if (!slots || !slots.length) return slots
  const now = new Date()
  const todayDayIdx = now.getDay() // 0=Sun, 6=Sat (egypt: Sat=last)
  const todayHour = String(now.getHours()).padStart(2, '0')
  const todayMin = String(now.getMinutes()).padStart(2, '0')
  const todayTimeNum = parseInt(todayHour + todayMin, 10) // e.g. 1430

  return slots.filter(s => {
    if (!s.date || !s.time) return true // keep slots with no date/time for safety
    const slotDayIdx = DAY_MAP[s.date]
    if (slotDayIdx == null) return true

    // Parse slot time like "2:00 م"
    const timeMatch = s.time.match(/(\d+):(\d+)\s*(م|ص|AM|PM)?/)
    if (!timeMatch) return true
    let hour = parseInt(timeMatch[1], 10)
    const min = parseInt(timeMatch[2], 10)
    const ampm = timeMatch[3] || 'ص'
    // Convert to 24h if PM/م
    if ((ampm === 'م' || ampm === 'PM') && hour !== 12) hour += 12
    if ((ampm === 'ص' || ampm === 'AM') && hour === 12) hour = 0
    const slotTimeNum = parseInt(String(hour).padStart(2, '0') + String(min).padStart(2, '0'), 10)

    // Same day: check if time has passed
    if (slotDayIdx === todayDayIdx) {
      return slotTimeNum >= todayTimeNum
    }

    // Different day: check if day already passed this week
    // Egyptian week: 6=Sat > 0=Sun > 1=Mon > ... > 5=Fri
    // Calculate distance in week order
    const todayPos = todayDayIdx === 6 ? 0 : todayDayIdx + 1 // 0=Sat, 1=Sun...6=Fri
    const slotPos = slotDayIdx === 6 ? 0 : slotDayIdx + 1
    return slotPos >= todayPos
  })
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
        if (data) {
          const cleaned = cleanExpiredSlots(data)
          setSlots(cleaned)
          setLoading(false)
          return
        }
      } catch (e) { console.warn('Supabase fetchSlots failed:', e.message); setError(e.message) }
    }
    const stored = loadStored()
    const cleaned = cleanExpiredSlots(stored)
    setSlots(cleaned)
    if (cleaned.length !== stored.length) saveStored(cleaned)
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

  return { slots, loading, error, addSlot, updateSlot, toggleSlot, deleteSlot: deleteSlotById, getBookedForDate, isSlotTaken, refresh, cleanExpired: () => { const c = cleanExpiredSlots(slots); setSlots(c); if (!hasSupabase) saveStored(c); } }
}