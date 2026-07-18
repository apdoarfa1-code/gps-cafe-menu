import { motion } from 'framer-motion'

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-[1] overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-20%,#151515,#050505)]" />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-[10%] right-[12%] w-[280px] h-[280px] rounded-full blur-[100px]"
        style={{ background: 'radial-gradient(circle, rgba(214,255,0,0.25), transparent 70%)' }}
        animate={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[8%] left-[8%] w-[220px] h-[220px] rounded-full blur-[80px]"
        style={{ background: 'radial-gradient(circle, rgba(102,255,0,0.18), transparent 70%)' }}
        animate={{ x: [0, -50, 0], y: [0, -30, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[45%] left-[40%] w-[180px] h-[180px] rounded-full blur-[90px]"
        style={{ background: 'radial-gradient(circle, rgba(243,255,87,0.12), transparent 70%)' }}
        animate={{ x: [0, 30, 0], y: [0, -60, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
    </div>
  )
}