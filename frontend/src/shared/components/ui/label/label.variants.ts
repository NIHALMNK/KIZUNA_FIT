import { cva } from 'class-variance-authority';

/**
 * CVA Variant Engine for KIZUNAFIT Label Primitive.
 * Uses semantic CSS tokens for multi-theme compatibility.
 */
export const labelVariants = cva(
  [
    'inline-flex items-center font-medium text-[var(--color-text-primary)] tracking-wide leading-none select-none cursor-pointer',
    'transition-colors duration-150 ease-in-out',
    'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
  ],
  {
    variants: {
      size: {
        sm: 'text-xs gap-1.5',
        md: 'text-sm gap-2',
        lg: 'text-base gap-2.5',
      },
      status: {
        default: 'text-[var(--color-text-primary)]',
        error: 'text-[var(--color-danger)] font-semibold',
        success: 'text-[var(--color-success)] font-semibold',
        warning: 'text-[var(--color-warning)] font-semibold',
        disabled: 'text-[var(--color-text-muted)] opacity-60 cursor-not-allowed pointer-events-none',
      },
    },
    defaultVariants: {
      size: 'md',
      status: 'default',
    },
  }
);

