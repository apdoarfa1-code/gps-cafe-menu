import { useState, useRef, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, ArrowLeft, X } from 'lucide-react'
import { ShineBorder, Meteors } from '../components/magicui/index.js'

const ADMIN_CODE = '2026'

export default function AdminLogin() {
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const [granted, setGranted] = useState(false)
  const nav = useNavigate()
  const inpRef = useRef(null)

  useEffect(() => { inpRef.current?.focus() }, [])

  const handleChange = (e) => {
    const v = e.target.value.replace(/\D/g, '').slice(0, 4)
    setCode(v)
    setError(false)
    if (v.length === 4) {
      if (v === ADMIN_CODE) {
        sessionStorage.setItem('gps_admin', '1')
        setTimeout(() => setGranted(true), 200)
      } else {
        setError(true)
        setCode('')
      }
    }
  }

  if (granted) return <Navigate to="/admin/dashboard" replace />

  return (
    <div className="relative min-h-screen bg-bg noise-overlay overflow-hidden flex flex-col items-center justify-center px-5">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_center,rgba(214,255,0,0.2)_0%,transparent_60%)]" />
      <Meteors number={5} />

      <button onClick={() => nav('/home')}
        className="absolute top-5 right-5 w-9 h-9 rounded-full glass flex items-center justify-center text-white/60 hover:text-accent transition-colors">
        <ArrowLeft size={18} />
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        <ShineBorder shineColor="#E0FF00" duration={5} className="rounded-[2rem]">
          <div className="relative glass-strong rounded-[2rem] p-8 w-full text-center">
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 12 }}
              className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center relative"
              style={{ background: 'linear-gradient(135deg, rgba(214,255,0,0.25), rgba(214,255,0,0.05))', border: '1px solid rgba(214,255,0,0.3)' }}
            >
              <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
                animate={{ boxShadow: ['0 0 16px rgba(214,255,0,0.3)', '0 0 40px rgba(214,255,0,0.6)', '0 0 16px rgba(214,255,0,0.3)'] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              <Lock size={26} className="text-accent relative z-10" strokeWidth={2.2} />
            </motion.div>

            <h1 className="text-2xl font-black tracking-tight font-display mb-1">Admin Access</h1>
            <p className="text-white/40 text-xs mb-6 font-ar">كود الدخول</p>

            <input
              ref={inpRef}
              type="text"
              inputMode="numeric"
              value={code}
              onChange={handleChange}
              placeholder="••••"
              maxLength={4}
              className={`w-full text-center text-3xl font-black font-display tracking-[12px] py-4 rounded-2xl bg-white/[0.06] border outline-none transition-all
                ${error ? 'border-red-500/60 animate-pulse' : code.length ? 'border-accent/60 text-accent' : 'border-white/10 text-white'}
                focus:border-accent focus:bg-white/[0.1] placeholder:text-white/15`}
              style={{ direction: 'ltr', letterSpacing: '14px' }}
            />

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-400 text-xs font-bold mt-3 flex items-center justify-center gap-1.5"
                >
                  <X size={12} /> Wrong code — try again
                </motion.p>
              )}
            </AnimatePresence>

            <p className="text-white/25 text-[10px] mt-6 font-mono tracking-wider uppercase">
              GPS · Cafe · Admin
            </p>
          </div>
        </ShineBorder>
      </motion.div>
    </div>
  )
}