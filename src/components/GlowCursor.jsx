import { useEffect, useState, useRef } from 'react'

export default function GlowCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [dot, setDot] = useState({ x: -100, y: -100 })
  const [hovering, setHovering] = useState(false)
  const ringRef = useRef(null)
  const dotRef = useRef(null)

  useEffect(() => {
    let rx = -100, ry = -100, dx = -100, dy = -100
    let targetX = -100, targetY = -100
    let raf

    const onMove = (e) => {
      targetX = e.clientX
      targetY = e.clientY
      setDot({ x: e.clientX, y: e.clientY })
      const el = e.target.closest('a,button,[role="button"],input,textarea,select,label')
      setHovering(!!el)
    }

    const tick = () => {
      rx += (targetX - rx) * 0.18
      ry += (targetY - ry) * 0.18
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(tick)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  const isActive = pos.x >= 0
  return (
    <>
      <div
        ref={ringRef}
        className={`glow-cursor ${hovering ? 'is-hovering' : ''}`}
        style={{ opacity: isActive ? 1 : 0 }}
      />
      <div
        ref={dotRef}
        className="glow-cursor-dot"
        style={{ left: dot.x, top: dot.y, opacity: isActive ? 1 : 0 }}
      />
    </>
  )
}