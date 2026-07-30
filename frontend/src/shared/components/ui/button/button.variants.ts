import { cva } from 'class-variance-authority';

/**
 * CVA Variant Engine for the 2026 World-Class SaaS Button Primitive.
 * Features refined tactile 60fps micro-interactions: 2px hover elevation, subtle scale, gentle press, and clean focus rings.
 */
export const buttonVariants = cva(
  [
    'relative inline-flex items-center justify-center font-bold text-sm tracking-wide select-none cursor-pointer overflow-hidden',
    'transition-all duration-200 ease-out border border-transparent',
    'rounded-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
    'disabled:pointer-events-none disabled:opacity-40 disabled:shadow-none',
    'active:translate-y-0.5 active:scale-[0.985]',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 hover:from-cyan-400 hover:via-teal-400 hover:to-blue-500 text-white',
          'shadow-md shadow-cyan-950/40 border border-white/15',
          'hover:-translate-y-[2px] hover:scale-[1.008] hover:shadow-lg hover:shadow-cyan-950/60 hover:border-white/25',
        ],
        secondary: [
          'bg-slate-900/90 hover:bg-slate-850 text-slate-100 border border-slate-700/80 hover:border-slate-600',
          'shadow-sm hover:shadow-md hover:-translate-y-[2px] backdrop-blur-md',
        ],
        outline: [
          'border border-slate-800 bg-slate-950/50 hover:bg-slate-900 text-slate-200 hover:text-white hover:border-slate-700',
          'backdrop-blur-md hover:-translate-y-[2px] shadow-sm',
        ],
        ghost: [
          'bg-transparent hover:bg-slate-900/60 text-slate-300 hover:text-white border-transparent',
          'hover:-translate-y-[2px]',
        ],
        danger: [
          'bg-gradient-to-r from-rose-600 via-red-600 to-pink-600 text-white',
          'shadow-md shadow-rose-950/40 border border-white/15',
          'hover:-translate-y-[2px] hover:scale-[1.008] hover:shadow-lg hover:border-white/25',
        ],
        success: [
          'bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 text-white',
          'shadow-md shadow-emerald-950/40 border border-white/15',
          'hover:-translate-y-[2px] hover:scale-[1.008] hover:shadow-lg hover:border-white/25',
        ],
        warning: [
          'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-extrabold',
          'shadow-md shadow-amber-950/40 border border-white/20',
          'hover:-translate-y-[2px] hover:scale-[1.008] hover:shadow-lg',
        ],
        icon: [
          'bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white',
          'aspect-square p-0 justify-center hover:-translate-y-[2px] shadow-sm',
        ],
      },
      size: {
        sm: 'h-10 px-4 text-xs gap-2',
        md: 'h-12 px-6 text-sm gap-2.5',
        lg: 'h-14 px-8 text-base gap-3 rounded-2xl',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    compoundVariants: [
      {
        variant: 'icon',
        size: 'sm',
        className: 'h-10 w-10 px-0',
      },
      {
        variant: 'icon',
        size: 'md',
        className: 'h-12 w-12 px-0',
      },
      {
        variant: 'icon',
        size: 'lg',
        className: 'h-14 w-14 px-0',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);
