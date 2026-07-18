import { motion } from 'framer-motion'
import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function LangSwitch({ lang, toggle }) {
  const { t } = useTranslation()
  const isRTL = lang === 'ar'
  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.93 }}
      className={`fixed top-4 z-[60] glass-strong rounded-full px-3 py-2 flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-accent transition-colors ${isRTL ? 'left-4' : 'right-4'}`}
      style={{ boxShadow: '0 0 20px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)' }}
      title="Toggle language"
    >
      <Languages size={16} strokeWidth={2.2} className="text-accent" />
      <span className="font-ar">
        {isRTL ? 'EN' : 'ع'}
      </span>
    </motion.button>
  )
}