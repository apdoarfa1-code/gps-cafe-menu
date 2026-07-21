import { forwardRef } from 'react'

export const ShimmerButton = forwardRef(({ children, shimmerColor = '#ffffff', shimmerSize = '0.06em', shimmerDuration = '2.5s', background = 'rgba(0,0,0,0.85)', className = '', ...props }, ref) => {
  return (
    <button
      ref={ref}
      style={{
        '--spread': '90deg',
        '--shimmer-color': shimmerColor,
        '--speed': shimmerDuration,
        '--cut': shimmerSize,
        '--bg': background,
        borderRadius: '14px',
      }}
      className={`group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden border border-white/10 px-6 py-3 whitespace-nowrap text-white [background:var(--bg)] transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px ${className}`}
      {...props}
    >
      <div className="-z-30 blur-[2px] [container-type:size] absolute inset-0 overflow-visible">
        <div className="animate-shimmer-slide absolute inset-0 aspect-[1] h-[100cqh] rounded-none [mask:none]">
          <div className="animate-spin-around absolute -inset-full w-auto [translate:0_0] rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
        </div>
      </div>
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 size-full rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f] transform-gpu transition-all duration-300 ease-in-out group-hover:shadow-[inset_0_-6px_10px_#ffffff3f] group-active:shadow-[inset_0_-10px_10px_#ffffff3f]" />
      <div className="absolute inset-[var(--cut)] -z-20 rounded-2xl [background:var(--bg)]" />
    </button>
  )
})

ShimmerButton.displayName = 'ShimmerButton'