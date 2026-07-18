import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function AdminLock() {
  const nav = useNavigate()
  return (
    <motion.button
      onClick={() => nav('/admin/login')}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-5 left-5 z-[60] w-11 h-11 rounded-full glass-strong flex items-center justify-center text-white/40 hover:text-accent transition-colors group"
      title="Admin"
    >
      <svg width="14" height="18" viewBox="0 0 14 18" fill="none" className="group-hover:drop-shadow-[0_0_8px_#D6FF00] transition-all">
        <path d="M2 8V6a5 5 0 1 1 10 0v2h1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h1zm0 0h10M4 8V6a3 3 0 1 1 6 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
      </svg>
    </motion.button>
  )
}