import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[var(--color-surface-alt)] text-[var(--color-text-primary)]',
        primary: 'border-transparent bg-[var(--color-primary)] text-white',
        secondary: 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]',
        success: 'border-transparent bg-[var(--color-success-bg)] text-[var(--color-success)]',
        warning: 'border-transparent bg-[var(--color-warning-bg)] text-[var(--color-warning)]',
        danger: 'border-transparent bg-[var(--color-danger-bg)] text-[var(--color-danger)]',
        destructive: 'border-transparent bg-[var(--color-danger-bg)] text-[var(--color-danger)]',
        outline: 'border-[var(--color-border)] text-[var(--color-text-primary)] bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

