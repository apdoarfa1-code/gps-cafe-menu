import { useState, useMemo, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Search, X, ArrowLeft, Star, ShoppingBag, Heart } from 'lucide-react'
import { useMenuData } from '../hooks/useMenuData.js'
import { telLink, menuWhatsApp } from '../lib/whatsapp.js'
import AnimatedBackground from '../components/AnimatedBackground.jsx'
import ScrollVideo from '../components/ScrollVideo.jsx'

function SearchBar({ query, setQuery, t }) {
  return (
    <div className="sticky top-0 z-30 pt-3 pb-2 bg-bg/80 backdrop-blur-xl border-b border-white/5">
      <motion.div
        className="glass-strong rounded-2xl flex items-center gap-3 px-4 py-3.5"
        animate={{ scale: query ? 1.01 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <Search size={18} className="text-accent flex-shrink-0" strokeWidth={2.2} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search')}
          className="flex-1 bg-transparent outline-none text-white placeholder-white/30 text-[15px] font-medium font-ar"
        />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => setQuery('')}
              className="text-white/30 hover:text-white/80"
            >
              <X size={16} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

function SectionTabs({ sections, active, setActive, lng }) {
  const tabRefs = useRef({})
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  useEffect(() => {
    const el = tabRefs.current[active]
    if (el) {
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth })
    }
  }, [active, sections])

  return (
    <div className="sticky top-[72px] z-20 pt-3 pb-1 bg-bg/70 backdrop-blur-lg border-b border-white/5">
      <div className="flex gap-2 overflow-x-auto scrollbar-none px-4 -mx-4">
        {sections.map((s) => {
          const isActive = active === s.id
          return (
            <button
              key={s.id}
              ref={(el) => (tabRefs.current[s.id] = el)}
              onClick={() => setActive(s.id)}
              className="relative flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap font-ar"
              style={{
                color: isActive ? '#fff' : '#A1A1AA',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  initial={false}
                  animate={{ left: indicator.left, width: indicator.width }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(214,255,0,0.18), rgba(214,255,0,0.04))',
                    border: '1px solid rgba(214,255,0,0.25)',
                    boxShadow: '0 0 20px -4px rgba(214,255,0,0.3)',
                  }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <span className="text-base leading-none">{s.icon}</span>
                {lng === 'ar' ? s.name_ar : s.name_en}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function StarRating({ rating }) {
  const full = Math.floor(rating)
  const frac = rating - full
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => {
        const fill = i < full ? 1 : i === full ? frac : 0
        return (
          <div key={i} className="relative">
            <Star size={13} className="text-white/15" fill="currentColor" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star size={13} fill="#D6FF00" className="text-accent" />
            </div>
          </div>
        )
      })}
      <span className="ml-1 text-xs font-semibold text-accent/80">{rating.toFixed(1)}</span>
    </div>
  )
}

function ProductCard({ item, t, lng, index }) {
  const [fav, setFav] = useState(false)
  const img = item.image || '/assets/images/placeholder.jpg'
  const name = lng === 'ar' ? item.name_ar : item.name_en
  const altName = lng === 'ar' ? item.name_en : item.name_ar

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="relative glass rounded-3xl p-3 flex gap-3 items-stretch overflow-hidden group"
    >
      {/* Image */}
      <div className="relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-white/5">
        <motion.img
          src={img}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => (e.target.src = '/assets/images/placeholder.jpg')}
          whileHover={{ scale: 1.12 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-black/70 backdrop-blur-sm text-white/80">
          #{item.id}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-bold text-white text-[15px] leading-tight font-ar">{name}</h4>
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => setFav(!fav)}
              className="text-white/30 hover:text-accent flex-shrink-0"
            >
              <Heart size={16} fill={fav ? '#D6FF00' : 'none'} className={fav ? 'text-accent' : ''} />
            </motion.button>
          </div>
          <p className="text-white/35 text-xs mt-0.5 leading-tight">{altName}</p>
        </div>
        <div className="mt-2">
          <StarRating rating={item.rating || 4.7} />
          {item.suggest_id && (
            <p className="text-[10px] text-accent/60 mt-1.5 font-medium font-ar">{t('suggest')} →</p>
          )}
        </div>
      </div>

      {/* Price + CTA */}
      <div className="flex flex-col justify-between items-end flex-shrink-0 py-0.5">
        <div className="px-2.5 py-1 rounded-full text-sm font-black tabular-nums"
          style={{
            background: 'linear-gradient(135deg, rgba(214,255,0,0.15), rgba(214,255,0,0.05))',
            border: '1px solid rgba(214,255,0,0.25)',
            color: '#D6FF00',
          }}
        >
          {item.price} {t('currency')}
        </div>
        <motion.a
          href={menuWhatsApp()}
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.1, rotate: -5 }}
          whileTap={{ scale: 0.9 }}
          className="w-9 h-9 rounded-full flex items-center justify-center text-black"
          style={{ background: 'linear-gradient(135deg,#D6FF00,#CFFF04)', boxShadow: '0 4px 16px -2px rgba(214,255,0,0.45)' }}
        >
          <ShoppingBag size={15} strokeWidth={2.4} />
        </motion.a>
      </div>
    </motion.div>
  )
}

export default function MenuPage() {
  const { t, i18n } = useTranslation()
  const lng = i18n.language
  const { sections, items, loading } = useMenuData()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(null)

  useEffect(() => {
    if (sections.length && !active) setActive(sections[0].id)
  }, [sections])

  const filtered = useMemo(() => {
    let f = items
    if (query.trim()) {
      const q = query.toLowerCase()
      f = items.filter(
        (i) =>
          i.name_ar.includes(q) ||
          i.name_en.toLowerCase().includes(q) ||
          String(i.price).includes(q)
      )
    }
    if (active && !query.trim()) {
      f = f.filter((i) => i.section_id === active)
    }
    return f
  }, [items, query, active])

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-bg noise-overlay">
      <AnimatedBackground />
      <div className="relative z-10 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-4 pb-1">
          <Link to="/home">
            <motion.div whileHover={{ x: lng === 'ar' ? 3 : -3, scale: 1.1 }} whileTap={{ scale: 0.9 }}
              className="w-9 h-9 rounded-full glass flex items-center justify-center text-white/60 hover:text-accent transition-colors">
              <ArrowLeft size={18} className={lng === 'ar' ? '' : 'rotate-180'} />
            </motion.div>
          </Link>
          <h2 className="shimmer-text text-2xl font-black tracking-tight font-display">{t('menu')}</h2>
          <a href={telLink()} className="ml-auto text-accent/80 text-xs font-bold font-ar">{t('call')}</a>
        </div>

        <div className="px-5">
          <SearchBar query={query} setQuery={setQuery} t={t} lng={lng} />
        </div>

        {!query.trim() && (
          <div className="px-5 pt-3 pb-2">
            <ScrollVideo src="/assets/videos/nutella.mp4" className="h-48" />
          </div>
        )}

        {!query.trim() && (
          <div className="px-5">
            <SectionTabs sections={sections} active={active} setActive={setActive} lng={lng} />
          </div>
        )}

        <div className="px-5 pb-24 pt-3 space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <ProductCard key={item.id} item={item} t={t} lng={lng} index={i} />
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-white/30 py-16"
            >
              <Search size={32} className="mx-auto mb-3 opacity-40" />
              <p className="font-ar text-sm">{t('search')}...</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}