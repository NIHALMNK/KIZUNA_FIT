import React from 'react';
import { cn } from '../../utils/cn';

export type DomainStatus = 'active' | 'pending' | 'suspended' | 'completed' | 'cancelled' | 'draft';

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: DomainStatus;
  showDot?: boolean;
  label?: string;
}

const statusStyles: Record<DomainStatus, { bg: string; text: string; dot: string; defaultLabel: string }> = {
  active: {
    bg: 'bg-[var(--color-success-bg)]',
    text: 'text-[var(--color-success)]',
    dot: 'bg-[var(--color-success)]',
    defaultLabel: 'Active',
  },
  pending: {
    bg: 'bg-[var(--color-warning-bg)]',
    text: 'text-[var(--color-warning)]',
    dot: 'bg-[var(--color-warning)]',
    defaultLabel: 'Pending',
  },
  suspended: {
    bg: 'bg-[var(--color-danger-bg)]',
    text: 'text-[var(--color-danger)]',
    dot: 'bg-[var(--color-danger)]',
    defaultLabel: 'Suspended',
  },
  completed: {
    bg: 'bg-[var(--color-info-bg)]',
    text: 'text-[var(--color-info)]',
    dot: 'bg-[var(--color-info)]',
    defaultLabel: 'Completed',
  },
  cancelled: {
    bg: 'bg-[var(--color-surface-alt)]',
    text: 'text-[var(--color-text-muted)]',
    dot: 'bg-[var(--color-text-muted)]',
    defaultLabel: 'Cancelled',
  },
  draft: {
    bg: 'bg-[var(--color-surface-alt)]',
    text: 'text-[var(--color-text-secondary)]',
    dot: 'bg-[var(--color-text-secondary)]',
    defaultLabel: 'Draft',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  showDot = true,
  label,
  className,
  ...props
}) => {
  const config = statusStyles[status] || statusStyles.draft;
  const displayLabel = label || config.defaultLabel;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold select-none border border-transparent',
        config.bg,
        config.text,
        className
      )}
      {...props}
    >
      {showDot && <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', config.dot)} aria-hidden="true" />}
      {displayLabel}
    </span>
  );
};
