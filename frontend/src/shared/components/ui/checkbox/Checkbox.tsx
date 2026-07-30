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
              'w-5 h-5 rounded-lg border transition-all duration-200 flex items-center justify-center',
              'bg-slate-950/60 backdrop-blur-md border-slate-700/80',
              'group-hover:border-slate-600 group-hover:bg-slate-900/80',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-cyan-400 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-slate-950',
              'peer-checked:bg-gradient-to-tr peer-checked:from-cyan-500 peer-checked:to-teal-400 peer-checked:border-transparent peer-checked:shadow-[0_0_15px_rgba(6,182,212,0.4)]',
              isError && 'border-rose-500/80'
            )}
          >
            {/* Checkmark SVG Icon */}
            <svg
              className="w-3.5 h-3.5 text-slate-950 transform scale-0 peer-checked:scale-100 transition-transform duration-200 stroke-[3]"
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
          <span className="text-xs font-medium text-slate-300 group-hover:text-slate-100 transition-colors">
            {label}
            {effectiveRequired && <span className="text-rose-400 ml-1 font-bold">*</span>}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
