import React from 'react';
import { cn } from '../../utils/cn';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  fullWidth?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, fullWidth = true, className, disabled, id, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;

    return (
      <div className={cn('space-y-1.5', fullWidth ? 'w-full' : 'w-auto')}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-medium text-[var(--color-text-secondary)]"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          className={cn(
            'flex h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-input)] px-3 text-sm text-[var(--color-text-primary)] transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] focus:border-[var(--color-ring)]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
              className="bg-[var(--color-card)] text-[var(--color-text-primary)]"
            >
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-[var(--color-danger)] font-medium">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';
