import { cva } from 'class-variance-authority';

/**
 * CVA Variant Engine for KIZUNAFIT Input Primitive.
 * Uses semantic CSS tokens for multi-theme compatibility.
 */
export const inputContainerVariants = cva(
  [
    'group relative flex items-center w-full transition-all duration-150 ease-in-out',
    'rounded-lg focus-within:ring-2 focus-within:ring-[var(--color-ring)] focus-within:border-[var(--color-ring)]',
    'disabled:pointer-events-none disabled:opacity-50 select-none overflow-hidden',
  ],
  {
    variants: {
      variant: {
        default: 'border border-[var(--color-border)] bg-[var(--color-input)] hover:border-[var(--color-border-strong)]',
        filled: 'border border-transparent bg-[var(--color-surface-alt)] hover:bg-[var(--color-border)]',
        outline: 'border-2 border-[var(--color-border)] bg-[var(--color-input)] hover:border-[var(--color-border-strong)]',
        ghost: 'border border-transparent bg-transparent hover:bg-[var(--color-surface-alt)]',
      },
      size: {
        sm: 'h-9 text-xs',
        md: 'h-10 text-sm',
        lg: 'h-12 text-base rounded-xl',
      },
      status: {
        default: '',
        error: 'border-[var(--color-danger)] focus-within:border-[var(--color-danger)] focus-within:ring-[var(--color-danger)]',
        success: 'border-[var(--color-success)] focus-within:border-[var(--color-success)] focus-within:ring-[var(--color-success)]',
        warning: 'border-[var(--color-warning)] focus-within:border-[var(--color-warning)] focus-within:ring-[var(--color-warning)]',
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
    'w-full bg-transparent font-normal text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] tracking-wide',
    'focus:outline-none disabled:cursor-not-allowed read-only:cursor-default',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
  ],
  {
    variants: {
      size: {
        sm: 'px-3 text-xs',
        md: 'px-3.5 text-sm',
        lg: 'px-4 text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

