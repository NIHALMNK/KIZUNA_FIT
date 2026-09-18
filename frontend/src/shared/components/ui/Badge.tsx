import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[var(--color-surface-alt)] text-[var(--color-text-primary)]',
        primary: 'border-transparent bg-[var(--color-primary)] text-white',
        secondary:
          'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]',
        success:
          'border-emerald-300 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/50 dark:text-emerald-100 dark:border-emerald-700 font-bold',
        warning:
          'border-amber-300 bg-amber-50 text-amber-950 dark:bg-amber-950/50 dark:text-amber-100 dark:border-amber-700 font-bold',
        danger:
          'border-rose-300 bg-rose-50 text-rose-950 dark:bg-rose-950/50 dark:text-rose-100 dark:border-rose-700 font-bold',
        destructive:
          'border-rose-300 bg-rose-50 text-rose-950 dark:bg-rose-950/50 dark:text-rose-100 dark:border-rose-700 font-bold',
        outline: 'border-[var(--color-border)] text-[var(--color-text-primary)] bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
