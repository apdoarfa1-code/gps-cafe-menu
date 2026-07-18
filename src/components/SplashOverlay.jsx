import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useTranslation } from 'react-i18next'

export default function SplashOverlay({ onDone }) {
  const { t } = useTranslation()
  const ref = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => onDone(),
      defaults: { ease: 'power3.inOut' },
    })
    tl.from(ref.current, { opacity: 0, duration: 0.6 })
      .to({}, { duration: 1.5 })
      .to(ref.current, { opacity: 0, scale: 1.06, duration: 0.7 })
  }, [])

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-ink"
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-36 h-36 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-gold/30 via-gold/10 to-transparent border border-gold/20 flex items-center justify-center animate-pulse-glow">
          <span className="text-5xl md:text-6xl font-bubblegum text-gold capitalize tracking-wider drop-shadow-[0_0_18px_rgba(212,175,55,0.6)]">
            GPS
          </span>
        </div>
        <div className="text-center">
          <p className="text-sm md:text-base text-white/60 uppercase tracking-[.35em] font-cairo">
            {t('welcome')}
          </p>
          <p className="text-lg md:text-xl text-white/90 font-cairo font-black mt-1 tracking-widest">
            {t('brand')}
          </p>
        </div>
      </div>
    </div>
  )
}
