// Auto-sync CSV/Excel sheet with admin data using sessionStorage
// The "Excel sheet" is mirrored in localStorage so changes from admin
// propagate here and to .csv exported file.

const PAPER_KEY_S = 'gps_paper_sections'    // CSV row data for sections
const PAPER_KEY_I = 'gps_paper_items'       // CSV row data for items

// Load existing paper (sheet) data — exported CSV is the source of truth
function loadPaper(key) {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

// Save updated paper to localStorage (mirrors CSV on disk)
function savePaper(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    // broadcast change so admin UI updates
    window.dispatchEvent(new CustomEvent('gps-paper-updated', {
      detail: { key, data }
    }))
  } catch {}
}

// Convert admin items array to CSV row format
export function itemsToCSV(items, sections) {
  const sectionMap = {}
  sections.forEach(s => { sectionMap[s.id] = s })

  const rows = items.map(i => {
    const sec = sectionMap[i.section_id] || {}
    return {
      id: i.id,
      section_id: i.section_id,
      name_ar: i.name_ar || '',
      name_en: i.name_en || '',
      price: i.price || 0,
      rating: i.rating || 4.7,
      image: i.image || '',
      description_ar: i.description_ar || '',
      description_en: i.description_en || '',
      calories: i.calories || '',
      prep_time: i.prep_time || '',
      tags: i.tags || '',
      is_active: i.is_active !== false ? '1' : '0',
      section_ar: sec.name_ar || '',
      section_en: sec.name_en || '',
      section_slug: sec.slug || ''
    }
  })

  if (rows.length) {
    savePaper(PAPER_KEY_I, rows)
  }
  return rows
}

export function sectionsToCSV(sections) {
  const rows = sections.map(s => ({
    id: s.id,
    slug: s.slug || '',
    name_ar: s.name_ar || '',
    name_en: s.name_en || '',
    color: s.color || '#E0FF00',
    icon: s.icon || '🍽️',
    position: s.position || 1,
    description_ar: s.description_ar || '',
    description_en: s.description_en || ''
  }))

  if (rows.length) {
    savePaper(PAPER_KEY_S, rows)
  }
  return rows
}

// Generate downloadable CSV string
export function itemsToCSVString(items, sections) {
  const rows = itemsToCSV(items, sections)
  if (!rows.length) return ''
  const keys = Object.keys(rows[0])
  const header = keys.join(',') + '\n'
  const lines = rows.map(r =>
    keys.map(k => `"${(r[k] ?? '').toString().replace(/"/g, '""')}"`).join(',')
  ).join('\n')
  return '\uFEFF' + header + lines
}

export function sectionsToCSVString(sections) {
  const rows = sectionsToCSV(sections)
  if (!rows.length) return ''
  const keys = Object.keys(rows[0])
  const header = keys.join(',') + '\n'
  const lines = rows.map(r =>
    keys.map(k => `"${(r[k] ?? '').toString().replace(/"/g, '""')}"`).join(',')
  ).join('\n')
  return '\uFEFF' + header + lines
}

// Trigger download
export function downloadCSVFile(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}

// Parse CSV (for import from edited file)
export function parseCSV(text) {
  const cleanText = text.replace(/^\uFEFF/, '')
  const lines = cleanText.split(/\r?\n/).filter(Boolean)
  if (!lines.length) return []
  const headers = parseCSVLine(lines[0])
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line)
    const obj = {}
    headers.forEach((h, i) => { obj[h.trim()] = values[i] ?? '' })
    return obj
  })
}

function parseCSVLine(line) {
  const out = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === '"' && line[i+1] === '"') { cur += '"'; i++; continue }
    if (c === '"') { inQuotes = !inQuotes; continue }
    if (c === ',' && !inQuotes) { out.push(cur); cur = ''; continue }
    cur += c
  }
  out.push(cur)
  return out
}

// Convert parsed CSV items back into admin format
export function csvItemsToAdmin(csvItems) {
  return csvItems.map(c => {
    const id = c.id ? Number(c.id) : Date.now() + Math.random() * 1000
    const section_id = c.section_id ? Number(c.section_id) : 1
    return {
      id,
      section_id,
      name_ar: c.name_ar || '',
      name_en: c.name_en || '',
      price: c.price ? Number(c.price) : 0,
      rating: c.rating ? Number(c.rating) : 4.7,
      image: c.image || '',
      description_ar: c.description_ar || '',
      description_en: c.description_en || '',
      calories: c.calories || '',
      prep_time: c.prep_time || '',
      tags: c.tags || '',
      suggest_id: c.suggest_id ? Number(c.suggest_id) : null,
      is_active: c.is_active !== '0'
    }
  })
}

export function csvSectionsToAdmin(csvSections) {
  return csvSections.map(c => ({
    id: c.id ? Number(c.id) : Date.now() + Math.random() * 1000,
    slug: c.slug || '',
    name_ar: c.name_ar || '',
    name_en: c.name_en || '',
    color: c.color || '#E0FF00',
    icon: c.icon || '🍽️',
    position: c.position ? Number(c.position) : 99,
    description_ar: c.description_ar || '',
    description_en: c.description_en || ''
  }))
}

// Hook to detect paper updates from other tabs/CSV imports
export function subscribeToPaperUpdates(callback) {
  const handler = (e) => callback(e.detail)
  window.addEventListener('gps-paper-updated', handler)

  // Also listen to storage events for cross-tab sync
  const storageHandler = (e) => {
    if (e.key === PAPER_KEY_S || e.key === PAPER_KEY_I) {
      try {
        const data = e.newValue ? JSON.parse(e.newValue) : []
        callback({ key: e.key, data })
      } catch {}
    }
  }
  window.addEventListener('storage', storageHandler)

  return () => {
    window.removeEventListener('gps-paper-updated', handler)
    window.removeEventListener('storage', storageHandler)
  }
}

export { PAPER_KEY_S, PAPER_KEY_I, loadPaper, savePaper }