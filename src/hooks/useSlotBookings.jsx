import { useEffect, useState, useCallback } from 'react'
import { fetchSlots, upsertSlot, deleteSlot as sbDeleteSlot, hasSupabase } from '../lib/supabase.js'

const STORAGE_KEY = 'gps_slot_bookings'
const BROADCAST_NAME = 'gps_slots_changed'
const DAY_MAP = { 'السبت': 6, 'الأحد': 0, 'الإثنين': 1, 'الثلاثاء': 2, 'الأربعاء': 3, 'الخميس': 4, 'الجمعة': 5 }

function loadStored() {
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : [] } catch { return [] }
}

function saveStored(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
}

// Broadcast changes so all mounted instances of useSlotBookings re-read latest data
function broadcastChange() {
  window.dispatchEvent(new CustomEvent(BROADCAST_NAME, { detail: { at: Date.now() } }))
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
  const [version, setVersion] = useState(0) // bumped on every change so consumers re-derive

  const refresh = useCallback(async () => {
    setLoading(true); setError(null)
    let data = null
    if (hasSupabase) {
      try { const fetched = await fetchSlots(); if (fetched) data = fetched } catch (e) { console.warn('Supabase fetchSlots failed:', e.message); setError(e.message) }
    }
    let stored = loadStored()
    // If Supabase returned data, replace localStorage with it so they're synced
    if (data) stored = data

    const clean = cleanExpiredSlots(stored)
    setSlots(clean)
    if (JSON.stringify(clean) !== JSON.stringify(stored)) saveStored(clean)
    setLoading(false)
  }, [])

  // Re-fetch on mount
  useEffect(() => { refresh() }, [refresh])

  // Listen for broadcasts (other tabs / components updating state)
  useEffect(() => {
    const handler = () => { setVersion(v => v + 1); refresh() }
    const storageHandler = (e) => {
      if (e.key === STORAGE_KEY) {
        setVersion(v => v + 1)
        const stored = loadStored()
        setSlots(cleanExpiredSlots(stored))
      }
    }
    window.addEventListener(BROADCAST_NAME, handler)
    window.addEventListener('storage', storageHandler)
    return () => {
      window.removeEventListener(BROADCAST_NAME, handler)
      window.removeEventListener('storage', storageHandler)
    }
  }, [refresh])

  const commit = useCallback((updated) => {
    const cleaned = cleanExpiredSlots(updated)
    setSlots(cleaned)
    saveStored(cleaned)
    broadcastChange()
  }, [])

  const addSlot = async (slot) => {
    const newSlot = {
      ...slot,
      id: Date.now(),
      status: 'available',
      name: slot.name || '',
      phone: slot.phone || '',
      created_at: new Date().toISOString()
    }
    const updated = [...slots, newSlot]
    commit(updated)
    if (hasSupabase) { try { await upsertSlot(newSlot) } catch (e) { setError(e.message) } }
    return newSlot
  }

  const bookSlot = async (date, time, type, customerName, customerPhone = '') => {
    // Find existing slot first to update (avoid duplicates)
    const existing = slots.find(s => s.date === date && s.time === time && s.type === type)

    let updated, target
    if (existing) {
      if (existing.status === 'booked') return existing
      target = { ...existing, status: 'booked', name: customerName, phone: customerPhone, updated_at: new Date().toISOString() }
      updated = slots.map(s => s.id === existing.id ? target : s)
    } else {
      target = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        date, time, type, status: 'booked',
        name: customerName, phone: customerPhone,
        created_at: new Date().toISOString()
      }
      updated = [...slots, target]
    }
    commit(updated)
    // Force bump trigger
    setVersion(v => v + 1)
    if (hasSupabase) { try { await upsertSlot(target) } catch (e) { setError(e.message) } }
    return target
  }

  const updateSlot = async (id, updates) => {
    const updated = slots.map(s => s.id === id ? { ...s, ...updates } : s)
    commit(updated)
    setVersion(v => v + 1)
    const target = updated.find(s => s.id === id)
    if (hasSupabase && target) { try { await upsertSlot(target) } catch (e) { setError(e.message) } }
  }

  const toggleSlot = async (id) => {
    const slot = slots.find(s => s.id === id)
    if (!slot) return
    const newStatus = slot.status === 'booked' ? 'available' : 'booked'
    await updateSlot(id, {
      status: newStatus,
      name: newStatus === 'available' ? '' : slot.name,
      phone: newStatus === 'available' ? '' : slot.phone
    })
    return newStatus
  }

  const deleteSlotById = async (id) => {
    const updated = slots.filter(s => s.id !== id)
    commit(updated)
    setVersion(v => v + 1)
    if (hasSupabase) { try { await sbDeleteSlot(id) } catch (e) { setError(e.message) } }
  }

  const getBookedForDate = (date, type = 'all') => {
    return slots.filter(s => s.status === 'booked' && s.date === date && (type === 'all' || s.type === type))
  }

  const isSlotTaken = (date, time, type = 'padel') => {
    return slots.some(s => s.status === 'booked' && s.date === date && s.time === time && s.type === type)
  }

  return {
    slots,
    loading,
    error,
    version,
    addSlot,
    bookSlot,
    updateSlot,
    toggleSlot,
    deleteSlot: deleteSlotById,
    getBookedForDate,
    isSlotTaken,
    refresh
  }
}