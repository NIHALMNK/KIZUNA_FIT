import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  change?: string | number;
  changeType?: 'positive' | 'negative' | 'neutral';
  changePeriod?: string;
  icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'positive',
  changePeriod = 'vs last period',
  icon,
  className,
  ...props
}) => {
  const getChangeIcon = () => {
    if (changeType === 'positive') return <ArrowUpRight className="h-3.5 w-3.5" />;
    if (changeType === 'negative') return <ArrowDownRight className="h-3.5 w-3.5" />;
    return <Minus className="h-3.5 w-3.5" />;
  };

  const getChangeClasses = () => {
    if (changeType === 'positive') return 'text-[var(--color-success)] bg-[var(--color-success-bg)]';
    if (changeType === 'negative') return 'text-[var(--color-danger)] bg-[var(--color-danger-bg)]';
    return 'text-[var(--color-text-secondary)] bg-[var(--color-surface-alt)]';
  };

  return (
    <div
      className={cn(
        'rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm space-y-3 transition-colors',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-surface-alt)] text-[var(--color-primary)]">
            {icon}
          </div>
        )}
      </div>

      <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-heading)]">
        {value}
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-1.5 text-xs">
          <span className={cn('inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 font-semibold', getChangeClasses())}>
            {getChangeIcon()}
            {change}
          </span>
          <span className="text-[var(--color-text-muted)]">{changePeriod}</span>
        </div>
      )}
    </div>
  );
};
