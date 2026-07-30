import { cva } from 'class-variance-authority';

/**
 * CVA Variant Engine for the 2026 World-Class SaaS Card Container Primitive.
 * Features frosted glassmorphism, subtle top edge light beam, and realistic depth shadows.
 */
export const cardVariants = cva(
  [
    'flex flex-col relative transition-all duration-300 ease-out',
    'overflow-hidden backdrop-blur-2xl',
    'before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-cyan-400/30 before:to-transparent before:z-20',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-slate-900/70 text-slate-100 border border-slate-800/80',
          'shadow-[0_20px_60px_-15px_rgba(2,6,23,0.9),0_0_1px_rgba(255,255,255,0.1)]',
          'hover:border-slate-700/80',
        ],
        outlined: [
          'bg-slate-950/50 text-slate-100 border-2 border-slate-800',
          'shadow-lg shadow-black/40',
        ],
        filled: [
          'bg-slate-900/90 text-slate-100 border border-slate-800/60',
          'shadow-md',
        ],
        elevated: [
          'bg-slate-900/80 text-slate-100 border border-slate-700/60',
          'shadow-[0_25px_70px_-10px_rgba(2,6,23,0.95)]',
          'hover:-translate-y-[2px]',
        ],
        ghost: [
          'bg-transparent text-slate-100 border border-transparent',
        ],
      },
      size: {
        sm: 'rounded-xl p-4 text-xs gap-3',
        md: 'rounded-2xl p-6 text-sm gap-4',
        lg: 'rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-base gap-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);
