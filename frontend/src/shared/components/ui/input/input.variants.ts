import { cva } from 'class-variance-authority';

/**
 * CVA Variant Engine for the 2026 World-Class SaaS Input Primitive.
 * Features comfortable height scales (h-12), softer glass borders, and subtle cyan focus rings.
 */
export const inputContainerVariants = cva(
  [
    'group relative flex items-center w-full transition-all duration-200 ease-out',
    'rounded-[14px] focus-within:ring-2 focus-within:ring-cyan-500/20 focus-within:border-cyan-500/50 focus-within:shadow-sm',
    'disabled:pointer-events-none disabled:opacity-40 select-none overflow-hidden',
  ],
  {
    variants: {
      variant: {
        default: 'border border-slate-800/80 bg-slate-950/60 backdrop-blur-xl hover:border-slate-700/80',
        filled: 'border border-transparent bg-slate-900/90 hover:bg-slate-900 focus-within:bg-slate-950/80 focus-within:border-cyan-500/50',
        outline: 'border-2 border-slate-800 bg-slate-950/60 backdrop-blur-xl hover:border-slate-700',
        ghost: 'border border-transparent bg-transparent hover:bg-slate-900/40 focus-within:bg-slate-950/80 focus-within:border-cyan-500/50',
      },
      size: {
        sm: 'h-10 text-xs',
        md: 'h-12 text-sm',
        lg: 'h-14 text-base rounded-2xl',
      },
      status: {
        default: '',
        error: 'border-rose-500/80 focus-within:border-rose-500 focus-within:ring-rose-500/20 text-rose-200',
        success: 'border-emerald-500/80 focus-within:border-emerald-500 focus-within:ring-emerald-500/20',
        warning: 'border-amber-500/80 focus-within:border-amber-500 focus-within:ring-amber-500/20',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      status: 'default',
      fullWidth: false,
    },
  }
);

export const inputElementVariants = cva(
  [
    'w-full bg-transparent font-medium text-slate-100 placeholder:text-slate-500 tracking-wide',
    'focus:outline-none disabled:cursor-not-allowed read-only:cursor-default',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
  ],
  {
    variants: {
      size: {
        sm: 'px-3 text-xs',
        md: 'px-4 text-sm',
        lg: 'px-5 text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);
