import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollVideo({ src = '', className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { filter: 'brightness(0.5) blur(4px)', scale: 1.15 },
        {
          filter: 'brightness(1) blur(0px)',
          scale: 1,
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className={`relative overflow-hidden rounded-3xl ${className}`}>
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
        style={{ willChange: 'transform, filter' }}
      />
    </div>
  )
}