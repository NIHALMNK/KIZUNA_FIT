import { cva } from 'class-variance-authority';

/**
 * CVA Variant Engine for KIZUNAFIT Reusable Button Primitive.
 * Strictly uses semantic CSS token variables for multi-theme compatibility.
 */
export const buttonVariants = cva(
  [
    'relative inline-flex items-center justify-center font-medium text-sm tracking-wide select-none cursor-pointer overflow-hidden',
    'transition-all duration-150 ease-in-out border border-transparent rounded-lg',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]',
    'disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none',
    'active:scale-[0.98]',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white border-transparent',
          'shadow-sm hover:shadow transition-colors',
        ],
        secondary: [
          'bg-[var(--color-surface-alt)] hover:bg-[var(--color-border)] text-[var(--color-text-primary)] border border-[var(--color-border)]',
          'shadow-sm transition-colors',
        ],
        outline: [
          'bg-transparent hover:bg-[var(--color-surface-alt)] text-[var(--color-text-primary)] border border-[var(--color-border)]',
          'transition-colors',
        ],
        ghost: [
          'bg-transparent hover:bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border-transparent',
          'transition-colors',
        ],
        danger: [
          'bg-[var(--color-danger)] hover:opacity-90 text-white border-transparent',
          'shadow-sm transition-colors',
        ],
        success: [
          'bg-[var(--color-success)] hover:opacity-90 text-white border-transparent',
          'shadow-sm transition-colors',
        ],
        warning: [
          'bg-[var(--color-warning)] hover:opacity-90 text-white border-transparent',
          'shadow-sm transition-colors',
        ],
        icon: [
          'bg-[var(--color-surface)] hover:bg-[var(--color-surface-alt)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
          'aspect-square p-0 justify-center transition-colors',
        ],
      },
      size: {
        sm: 'h-8 px-3 text-xs gap-1.5',
        md: 'h-10 px-4 text-sm gap-2',
        lg: 'h-12 px-6 text-base gap-2.5 rounded-xl',
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
        className: 'h-8 w-8 px-0',
      },
      {
        variant: 'icon',
        size: 'md',
        className: 'h-10 w-10 px-0',
      },
      {
        variant: 'icon',
        size: 'lg',
        className: 'h-12 w-12 px-0',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

