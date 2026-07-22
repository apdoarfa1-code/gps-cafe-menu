import { useEffect, useState } from 'react'

export function Sparkles({ count = 18, className = '' }) {
  const [sparkles] = useState(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 2 + Math.random() * 3,
      size: 2 + Math.random() * 3,
    }))
  )

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {sparkles.map(s => (
        <span
          key={s.id}
          className="absolute rounded-full animate-pulse-glow"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            background: 'radial-gradient(circle, rgba(224,255,0,0.95) 0%, rgba(224,255,0,0.3) 60%, transparent 100%)',
            boxShadow: '0 0 10px rgba(224,255,0,0.55), 0 0 22px rgba(224,255,0,0.3)',
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            opacity: 0.55,
          }}
        />
      ))}
    </div>
  )
}

export function FloatingOrbs({ count = 6, className = '' }) {
  const [orbs] = useState(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 90,
      top: Math.random() * 90,
      delay: Math.random() * 8,
      duration: 14 + Math.random() * 16,
      size: 60 + Math.random() * 120,
    }))
  )
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {orbs.map(o => (
        <div
          key={o.id}
          className="absolute rounded-full"
          style={{
            left: `${o.left}%`,
            top: `${o.top}%`,
            width: `${o.size}px`,
            height: `${o.size}px`,
            background: 'radial-gradient(circle, rgba(224,255,0,0.18) 0%, rgba(224,255,0,0.04) 50%, transparent 75%)',
            filter: 'blur(20px)',
            animation: `floatOrb ${o.duration}s ease-in-out infinite`,
            animationDelay: `${o.delay}s`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
      <style>{`
        @keyframes floatOrb {
          0%, 100% { transform: translate(-50%, -50%) translate(0, 0); }
          25% { transform: translate(-50%, -50%) translate(40px, -30px); }
          50% { transform: translate(-50%, -50%) translate(-30px, 40px); }
          75% { transform: translate(-50%, -50%) translate(30px, 30px); }
        }
      `}</style>
    </div>
  )
}
