import { useEffect, useState, useCallback } from 'react'
import { fetchSlots, upsertSlot, deleteSlot as sbDeleteSlot, hasSupabase } from '../lib/supabase.js'

const STORAGE_KEY = 'gps_slot_bookings'
const DAY_MAP = { 'السبت': 6, 'الأحد': 0, 'الإثنين': 1, 'الثلاثاء': 2, 'الأربعاء': 3, 'الخميس': 4, 'الجمعة': 5 }

function loadStored() {
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : [] } catch { return [] }
}

function saveStored(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
}

function parseTimeTo24(timeStr) {
  const m = timeStr.match(/(\d+):(\d+)\s*(م|ص|AM|PM)?/)
  if (!m) return null
  let h = parseInt(m[1], 10); const min = parseInt(m[2], 10); const ap = m[3] || 'ص'
  if ((ap === 'م' || ap === 'PM') && h !== 12) h += 12
  if ((ap === 'ص' || ap === 'AM') && h === 12) h = 0
  return parseInt(String(h).padStart(2,'0') + String(min).padStart(2,'0'), 10)
}

function isTimeExpired(date, time) {
  if (!date || !time) return false
  const now = new Date()
  const todayDayIdx = now.getDay()
  const slotDayIdx = DAY_MAP[date]
  if (slotDayIdx == null) return false

  const timeNum = parseTimeTo24(time)
  if (timeNum === null) return false

  const todayTimeNum = parseInt(String(now.getHours()).padStart(2,'0') + String(now.getMinutes()).padStart(2,'0'), 10)

  if (slotDayIdx === todayDayIdx) return timeNum < todayTimeNum

  const todayPos = todayDayIdx === 6 ? 0 : todayDayIdx + 1
  const slotPos = slotDayIdx === 6 ? 0 : slotDayIdx + 1
  return slotPos < todayPos
}

function cleanExpiredSlots(slots) {
  if (!slots || !slots.length) return slots
  return slots.map(s => {
    if (s.status === 'booked' && isTimeExpired(s.date, s.time)) {
      return { ...s, status: 'available', name: '', phone: '' }
    }
    return s
  })
}

export function useSlotBookings() {
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true); setError(null)
    if (hasSupabase) {
      try {
        const data = await fetchSlots()
        if (data) { const c = cleanExpiredSlots(data); setSlots(c); setLoading(false); return }
      } catch (e) { console.warn('Supabase fetchSlots failed:', e.message); setError(e.message) }
    }
    const stored = loadStored(); const c = cleanExpiredSlots(stored)
    setSlots(c); if (JSON.stringify(c) !== JSON.stringify(stored)) saveStored(c)
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const syncStorage = (updated) => {
    setSlots(updated)
    if (!hasSupabase) saveStored(updated)
  }

  const addSlot = async (slot) => {
    const newSlot = { ...slot, id: Date.now(), status: 'available', name: slot.name || '', phone: slot.phone || '', created_at: new Date().toISOString() }
    const updated = [...slots, newSlot]
    syncStorage(updated)
    if (hasSupabase) { try { await upsertSlot(newSlot) } catch (e) { setError(e.message) } }
    return newSlot
  }

  const bookSlot = async (date, time, type, customerName, customerPhone = '') => {
    // Find existing available slot for this date/time/type
    const existing = slots.find(s => s.date === date && s.time === time && s.type === type)
    if (existing) {
      if (existing.status === 'booked') return existing // already booked
      const updated = { ...existing, status: 'booked', name: customerName, phone: customerPhone }
      const newList = slots.map(s => s.id === existing.id ? updated : s)
      syncStorage(newList)
      if (hasSupabase) { try { await upsertSlot(updated) } catch (e) { setError(e.message) } }
      return updated
    }
    // No slot exists → create a new one as booked
    const newSlot = {
      id: Date.now(), date, time, type, status: 'booked',
      name: customerName, phone: customerPhone,
      created_at: new Date().toISOString()
    }
    const updated = [...slots, newSlot]
    syncStorage(updated)
    if (hasSupabase) { try { await upsertSlot(newSlot) } catch (e) { setError(e.message) } }
    return newSlot
  }

  const updateSlot = async (id, updates) => {
    const updated = slots.map(s => s.id === id ? { ...s, ...updates } : s)
    syncStorage(updated)
    const target = updated.find(s => s.id === id)
    if (hasSupabase && target) { try { await upsertSlot(target) } catch (e) { setError(e.message) } }
  }

  const toggleSlot = async (id) => {
    const slot = slots.find(s => s.id === id)
    if (!slot) return
    const newStatus = slot.status === 'booked' ? 'available' : 'booked'
    await updateSlot(id, { status: newStatus, name: newStatus === 'available' ? '' : slot.name, phone: newStatus === 'available' ? '' : slot.phone })
    return newStatus
  }

  const deleteSlotById = async (id) => {
    const updated = slots.filter(s => s.id !== id)
    syncStorage(updated)
    if (hasSupabase) { try { await sbDeleteSlot(id) } catch (e) { setError(e.message) } }
  }

  const getBookedForDate = (date, type = 'all') => {
    return slots.filter(s => s.status === 'booked' && s.date === date && (type === 'all' || s.type === type))
  }

  const isSlotTaken = (date, time, type = 'padel') => {
    return slots.some(s => s.status === 'booked' && s.date === date && s.time === time && s.type === type)
  }

  return { slots, loading, error, addSlot, bookSlot, updateSlot, toggleSlot, deleteSlot: deleteSlotById, getBookedForDate, isSlotTaken, refresh }
}