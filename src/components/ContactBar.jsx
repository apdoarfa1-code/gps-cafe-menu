import { motion } from 'framer-motion'
import { Phone, MessageCircle } from 'lucide-react'
import { telLink } from '../lib/whatsapp.js'

export default function ContactBar({ wtsLink, wtsLabel = 'WhatsApp', callLabel = 'Call' }) {
  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      <motion.a
        href={telLink()}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.97 }}
        className="glass-strong rounded-2xl py-3.5 flex items-center justify-center gap-2.5 font-semibold text-[15px] text-white/80 hover:text-accent transition-colors"
      >
        <Phone size={18} strokeWidth={2.2} />
        <span>{callLabel}</span>
      </motion.a>
      <motion.a
        href={wtsLink}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.97 }}
        className="rounded-2xl py-3.5 flex items-center justify-center gap-2.5 font-semibold text-[15px] text-white"
        style={{
          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
          boxShadow: '0 8px 24px -4px rgba(34,197,94,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
        }}
      >
        <MessageCircle size={18} strokeWidth={2.2} />
        <span>{wtsLabel}</span>
      </motion.a>
    </div>
  )
}