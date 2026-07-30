import { cva } from 'class-variance-authority';

/**
 * CVA Variant Engine for the 2026 SaaS Label Primitive.
 * Optimized for high readability, crisp typography contrast, and elegant status indicators.
 */
export const labelVariants = cva(
  [
    'inline-flex items-center font-semibold text-slate-100 tracking-wide leading-none select-none cursor-pointer',
    'transition-colors duration-200 ease-out',
    'peer-disabled:cursor-not-allowed peer-disabled:opacity-40',
  ],
  {
    variants: {
      size: {
        sm: 'text-xs gap-1.5',
        md: 'text-sm gap-2',
        lg: 'text-base gap-2.5',
      },
      status: {
        default: 'text-slate-100',
        error: 'text-rose-400 font-bold',
        success: 'text-emerald-400 font-semibold',
        warning: 'text-amber-400 font-semibold',
        disabled: 'text-slate-500 opacity-60 cursor-not-allowed pointer-events-none',
      },
    },
    defaultVariants: {
      size: 'md',
      status: 'default',
    },
  }
);
