'use client';

import React from 'react';
import { cn } from '../../../utils/cn';
import { ButtonProps } from './button.types';
import { buttonVariants } from './button.variants';
import { DEFAULT_BUTTON_VARIANT, DEFAULT_BUTTON_SIZE, DEFAULT_LOADING_TEXT } from './button.constants';

/**
 * Production-Ready Golden Reference Button Primitive Component for KIZUNAFIT.
 * Fully compliant with Enterprise Design Tokens, UX Pattern Library, and Frontend Handbook.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = DEFAULT_BUTTON_VARIANT,
      size = DEFAULT_BUTTON_SIZE,
      isLoading = false,
      isDisabled = false,
      disabled,
      loadingText = DEFAULT_LOADING_TEXT,
      fullWidth = false,
      leftIcon,
      rightIcon,
      type = 'button',
      className,
      children,
      onClick,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    // Effective disabled state incorporates both explicit isDisabled flag and native disabled prop
    const effectiveDisabled = Boolean(isDisabled || disabled || isLoading);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (effectiveDisabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={effectiveDisabled}
        aria-disabled={effectiveDisabled}
        aria-busy={isLoading}
        aria-label={ariaLabel}
        onClick={handleClick}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        {...props}
      >
        {/* Inline Self-Contained Spinner (Zero Component Dependency) */}
        {isLoading && (
          <span className="inline-flex items-center gap-1.5" aria-live="polite">
            <svg
              className="h-4 w-4 animate-spin text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="sr-only">{loadingText}</span>
          </span>
        )}

        {/* Left Icon (Hidden during loading state) */}
        {!isLoading && leftIcon && (
          <span className="inline-flex shrink-0 items-center justify-center" aria-hidden="true">
            {leftIcon}
          </span>
        )}

        {/* Button Content Label */}
        {children && (
          <span className={cn('inline-flex items-center', isLoading && 'opacity-70')}>
            {children}
          </span>
        )}

        {/* Right Icon (Hidden during loading state) */}
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0 items-center justify-center" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
