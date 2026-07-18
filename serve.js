import { createServer } from 'http'
import { createReadStream, statSync, existsSync } from 'fs'
import { join, extname } from 'path'

const DIST = '/home/apdo/Desktop/gps/dist'
const PORT = 3000
const INDEX = join(DIST, 'index.html')

const mime = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.json': 'application/json',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.ico': 'image/x-icon',
}

function serveFile(path, res, req) {
  const ext = extname(path).toLowerCase()
  const type = mime[ext] || 'application/octet-stream'

  if (type.startsWith('video/') && req.headers.range) {
    const stat = statSync(path)
    const [startStr, endStr] = req.headers.range.replace(/bytes=/, '').split('-')
    const start = parseInt(startStr, 10)
    const end = endStr ? parseInt(endStr, 10) : stat.size - 1
    res.writeHead(206, {
      'Content-Type': type, 'Content-Range': `bytes ${start}-${end}/${stat.size}`, 'Accept-Ranges': 'bytes',
      'Content-Length': (end - start + 1).toString(),
    })
    createReadStream(path, { start, end }).pipe(res)
    return
  }

  res.writeHead(200, { 'Content-Type': type, 'Accept-Ranges': 'bytes' })
  createReadStream(path).on('error', () => { res.end() }).pipe(res)
}

const server = createServer((req, res) => {
  const url = req.url === '/' ? '/index.html' : req.url
  const filePath = join(DIST, url)

  // SPA: any non-file route → serve index.html
  if (existsSync(filePath) && !filePath.endsWith('/')) {
    return serveFile(filePath, res, req)
  }

  // Fallback to index.html for client-side routing
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  createReadStream(INDEX).pipe(res)
})

server.listen(PORT, () => {
  console.log(`✅ GPS Cafe → http://localhost:${PORT}/`)
  console.log(`   All routes → SPA (index.html fallback)`)
  console.log(`   Videos     → Range streaming ✓`)
})