import { cva } from 'class-variance-authority';

/**
 * CVA Variant Engine for KIZUNAFIT Card Container Primitive.
 * Uses semantic CSS tokens for multi-theme compatibility.
 */
export const cardVariants = cva(
  [
    'flex flex-col relative transition-all duration-200 ease-in-out',
    'overflow-hidden rounded-xl',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-[var(--color-card)] text-[var(--color-text-primary)] border border-[var(--color-border)]',
          'shadow-sm hover:border-[var(--color-border-strong)]',
        ],
        outlined: [
          'bg-[var(--color-card)] text-[var(--color-text-primary)] border-2 border-[var(--color-border-strong)]',
        ],
        filled: [
          'bg-[var(--color-surface-alt)] text-[var(--color-text-primary)] border border-[var(--color-border)]',
        ],
        elevated: [
          'bg-[var(--color-card)] text-[var(--color-text-primary)] border border-[var(--color-border)]',
          'shadow-md hover:-translate-y-0.5 hover:shadow-lg',
        ],
        ghost: [
          'bg-transparent text-[var(--color-text-primary)] border border-transparent',
        ],
      },
      size: {
        sm: 'p-3 text-xs gap-2 rounded-lg',
        md: 'p-5 text-sm gap-3 rounded-xl',
        lg: 'p-6 sm:p-8 text-base gap-4 rounded-2xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

