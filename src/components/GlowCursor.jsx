import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'

// Detect if device has mouse + is wide enough (laptop/desktop)
function isDesktopEnv() {
  if (typeof window === 'undefined') return false
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches
  const hasHover = window.matchMedia('(hover: hover)').matches
  // Only show on desktop with real mouse (>= 1024px AND fine pointer)
  const wide = window.innerWidth >= 1024
  return hasFinePointer && wide
}

export default function GlowCursor() {
  const [enabled, setEnabled] = useState(isDesktopEnv())
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [dot, setDot] = useState({ x: -100, y: -100 })
  const [hovering, setHovering] = useState(false)
  const [clicking, setClicking] = useState(false)
  const trailRef = useRef([])
  const ringRef = useRef(null)
  const dotRef = useRef(null)
  const trailContainerRef = useRef(null)

  useEffect(() => {
    const check = () => setEnabled(isDesktopEnv())
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (!enabled) return

    let rx = -100, ry = -100, dx = -100, dy = -100
    let targetX = -100, targetY = -100
    let raf
    let lastMoveAt = 0

    const onMove = (e) => {
      targetX = e.clientX
      targetY = e.clientY
      setDot({ x: e.clientX, y: e.clientY })

      // Trail dots
      const now = performance.now()
      if (now - lastMoveAt > 16) {
        lastMoveAt = now
        const trail = trailRef.current
        const span = document.createElement('span')
        span.className = 'glow-cursor-trail'
        span.style.left = `${e.clientX}px`
        span.style.top = `${e.clientY}px`
        if (trailContainerRef.current) {
          trailContainerRef.current.appendChild(span)
          setTimeout(() => span.remove(), 600)
        }
      }

      const el = e.target.closest('a,button,[role="button"],input,textarea,select,label,summary,[data-cursor="hover"]')
      setHovering(!!el)
    }

    const onDown = () => setClicking(true)
    const onUp = () => setClicking(false)

    document.documentElement.classList.add('cursor-enabled')

    const tick = () => {
      rx += (targetX - rx) * 0.18
      ry += (targetY - ry) * 0.18
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('cursor-enabled')
    }
  }, [enabled])

  if (!enabled) return null

  const cursorHTML = (
    <>
      <style>{`
        .cursor-enabled, .cursor-enabled * { cursor: none !important; }
        .cursor-enabled input, .cursor-enabled textarea { cursor: text !important; }
      `}</style>

      {/* Trail container */}
      <div
        ref={trailContainerRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 2147483646 }}
        aria-hidden="true"
      />

      {/* Outer ring */}
      <div
        ref={ringRef}
        className={`glow-cursor ${hovering ? 'is-hovering' : ''} ${clicking ? 'is-clicking' : ''}`}
        aria-hidden="true"
      />

      {/* Inner dot */}
      <div
        ref={dotRef}
        className="glow-cursor-dot"
        style={{ left: dot.x, top: dot.y }}
        aria-hidden="true"
      />

      {/* Hover label - subtle */}
      {hovering && dot.x > 0 && (
        <div
          className="fixed pointer-events-none text-[10px] font-bold uppercase tracking-widest text-accent bg-black/70 px-2 py-1 rounded-full border border-accent/30"
          style={{
            left: dot.x + 18,
            top: dot.y + 22,
            zIndex: 2147483647
          }}
        >
          ✦
        </div>
      )}
    </>
  )

  return typeof document !== 'undefined' ? createPortal(cursorHTML, document.body) : null
}