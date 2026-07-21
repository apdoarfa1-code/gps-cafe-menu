import { useEffect, useState } from 'react'

export function Meteors({ number = 12, className = '' }) {
  const [meteors] = useState(
    Array.from({ length: number }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      size: 1 + Math.random() * 2,
    }))
  )

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {meteors.map(m => (
        <div
          key={m.id}
          className="absolute top-0 h-px w-px animate-meteors"
          style={{
            left: `${m.left}%`,
            animationDelay: `${m.delay}s`,
            animationDuration: `${m.duration}s`,
          }}
        >
          <div
            style={{
              width: `${m.size * 50}px`,
              height: `${m.size}px`,
              background: 'linear-gradient(90deg, rgba(224,255,0,0.85), transparent)',
              transform: 'translateX(-50%)',
              boxShadow: '0 0 8px rgba(224,255,0,0.6)',
              borderRadius: '999px',
            }}
          />
        </div>
      ))}
    </div>
  )
}