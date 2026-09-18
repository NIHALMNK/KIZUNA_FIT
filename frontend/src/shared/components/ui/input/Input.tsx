'use client';

import React, { useId } from 'react';
import { cn } from '../../../utils/cn';
import { InputProps } from './input.types';
import { inputContainerVariants, inputElementVariants } from './input.variants';
import { DEFAULT_INPUT_VARIANT, DEFAULT_INPUT_SIZE } from './input.constants';
import { Label } from '../Label';

/**
 * Production-Ready Golden Reference Input Primitive Component for KIZUNAFIT.
 * Fully compliant with Enterprise Design Tokens, UX Pattern Library, and Frontend Handbook.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = DEFAULT_INPUT_VARIANT,
      size = DEFAULT_INPUT_SIZE,
      label,
      helperText,
      error,
      success,
      warning,
      isDisabled = false,
      isRequired = false,
      isReadOnly = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      prefix,
      suffix,
      isClearable = false,
      onClear,
      containerClassName,
      inputClassName,
      className,
      id: customId,
      type = 'text',
      disabled,
      required,
      readOnly,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    // Generate unique ID for label and helper text association if not explicitly provided
    const autoId = useId();
    const inputId = customId || autoId;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    const effectiveDisabled = Boolean(isDisabled || disabled);
    const effectiveRequired = Boolean(isRequired || required);
    const effectiveReadOnly = Boolean(isReadOnly || readOnly);

    // Status evaluation (Error takes precedence over Warning & Success)
    const hasError = Boolean(error);
    const hasSuccess = Boolean(success && !hasError);
    const hasWarning = Boolean(warning && !hasError && !hasSuccess);

    const status = hasError ? 'error' : hasSuccess ? 'success' : hasWarning ? 'warning' : 'default';

    // Status message extraction
    const errorMessage = typeof error === 'string' ? error : undefined;
    const successMessage = typeof success === 'string' ? success : undefined;
    const warningMessage = typeof warning === 'string' ? warning : undefined;
    const displayMessage = errorMessage || successMessage || warningMessage || helperText;

    const hasValue = value !== undefined && value !== null && String(value).length > 0;
    const showClearButton = isClearable && hasValue && !effectiveDisabled && !effectiveReadOnly;

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onClear?.();
    };

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth ? 'w-full' : 'w-auto', containerClassName)}>
        {/* Field Label using Label Component */}
        {label && (
          <Label
            htmlFor={inputId}
            isRequired={effectiveRequired}
            isDisabled={effectiveDisabled}
            error={hasError}
            success={hasSuccess}
            warning={hasWarning}
            size={size === 'lg' ? 'md' : 'sm'}
          >
            {label}
          </Label>
        )}

        {/* Input Wrapper Container */}
        <div
          className={cn(
            inputContainerVariants({
              variant,
              size,
              status,
              fullWidth,
              className,
            })
          )}
        >
          {/* Prefix Text or Component */}
          {prefix && (
            <span className="pl-3 text-xs font-medium text-slate-400 select-none shrink-0">
              {prefix}
            </span>
          )}

          {/* Left Icon */}
          {leftIcon && (
            <span className="pl-3.5 text-slate-400 shrink-0 flex items-center justify-center" aria-hidden="true">
              {leftIcon}
            </span>
          )}

          {/* Core Input Element */}
          <input
            ref={ref}
            id={inputId}
            type={type}
            value={value}
            disabled={effectiveDisabled}
            required={effectiveRequired}
            readOnly={effectiveReadOnly}
            aria-invalid={hasError}
            aria-required={effectiveRequired}
            aria-describedby={displayMessage ? (hasError ? errorId : helperId) : undefined}
            onChange={onChange}
            className={cn(inputElementVariants({ size }), inputClassName)}
            {...props}
          />

          {/* Clear Button */}
          {showClearButton && (
            <button
              type="button"
              onClick={handleClear}
              tabIndex={-1}
              aria-label="Clear input value"
              className="pr-2 text-slate-400 hover:text-slate-100 transition-colors shrink-0 cursor-pointer"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Right Icon */}
          {rightIcon && (
            <span className="pr-3.5 text-slate-400 shrink-0 flex items-center justify-center" aria-hidden="true">
              {rightIcon}
            </span>
          )}

          {/* Suffix Text or Component */}
          {suffix && (
            <span className="pr-3 text-xs font-medium text-slate-400 select-none shrink-0">
              {suffix}
            </span>
          )}
        </div>

        {/* Helper / Validation Message */}
        {displayMessage && (
          <p
            id={hasError ? errorId : helperId}
            className={cn(
              'text-xs font-semibold tracking-wide transition-colors mt-0.5',
              hasError && 'text-rose-400',
              hasSuccess && 'text-emerald-400',
              hasWarning && 'text-amber-400',
              !hasError && !hasSuccess && !hasWarning && 'text-slate-400'
            )}
            role={hasError ? 'alert' : undefined}
          >
            {displayMessage}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
