import { useEffect, useRef } from 'react'

export function AnimatedGridPattern({ className = '', dotColor = '#E0FF00', dotSize = 1.2, mask = true }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    let raf = 0
    let t = 0

    const animate = () => {
      t += 0.4
      el.style.backgroundPosition = `${t}px ${t}px`
      raf = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(raf)
  }, [])

  const cols = 24
  const rows = 40

  return (
    <div
      ref={ref}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{
        backgroundImage: `radial-gradient(${dotColor} 1px, transparent ${dotSize}px)`,
        backgroundSize: `${100 / cols}rem ${100 / rows}rem`,
      }}
    >
      {mask && (
        <div className="absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
      )}
    </div>
  )
}