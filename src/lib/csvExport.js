export function downloadCSV(data, filenamePrefix = 'gps_export') {
  if (!data || !data.length) {
    alert('لا يوجد بيانات للتصدير')
    return
  }
  const keys = Object.keys(data[0])
  const header = keys.join(',') + '\n'
  const rows = data.map(row =>
    keys.map(k => `"${(row[k] ?? '').toString().replace(/"/g, '""')}"`).join(',')
  ).join('\n')
  const bom = '\uFEFF'
  const blob = new Blob([bom + header + rows], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filenamePrefix}_${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}