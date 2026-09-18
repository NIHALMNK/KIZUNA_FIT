'use client';

import React, { useId } from 'react';
import { cn } from '../../../utils/cn';
import { CheckboxProps } from './checkbox.types';

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      isDisabled = false,
      isRequired = false,
      isError = false,
      disabled,
      required,
      className,
      id: customId,
      checked,
      onChange,
      ...props
    },
    ref
  ) => {
    const autoId = useId();
    const checkboxId = customId || autoId;
    const effectiveDisabled = Boolean(isDisabled || disabled);
    const effectiveRequired = Boolean(isRequired || required);

    return (
      <label
        htmlFor={checkboxId}
        className={cn(
          'inline-flex items-center gap-2.5 cursor-pointer select-none group',
          effectiveDisabled && 'cursor-not-allowed opacity-50',
          className
        )}
      >
        <div className="relative flex items-center justify-center">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            checked={checked}
            disabled={effectiveDisabled}
            required={effectiveRequired}
            onChange={onChange}
            className="sr-only peer"
            {...props}
          />

          {/* Custom Checkbox Surface */}
          <div
            className={cn(
              'w-4 h-4 rounded border transition-all duration-150 flex items-center justify-center',
              'bg-[var(--color-input)] border-[var(--color-border)] text-white',
              'group-hover:border-[var(--color-border-strong)]',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-ring)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--color-background)]',
              'peer-checked:bg-[var(--color-primary)] peer-checked:border-[var(--color-primary)]',
              isError && 'border-[var(--color-danger)]'
            )}
          >
            {/* Checkmark SVG Icon */}
            <svg
              className="w-3 h-3 text-white transform opacity-0 peer-checked:opacity-100 transition-opacity duration-150 stroke-[3]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Checkbox Label */}
        {label && (
          <span className="text-xs font-medium text-[var(--color-text-primary)] transition-colors">
            {label}
            {effectiveRequired && <span className="text-[var(--color-danger)] ml-1 font-bold">*</span>}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

