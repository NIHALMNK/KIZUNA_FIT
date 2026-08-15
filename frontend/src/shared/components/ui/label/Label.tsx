'use client';

import React from 'react';
import { cn } from '../../../utils/cn';
import { LabelProps } from './label.types';
import { labelVariants } from './label.variants';
import { DEFAULT_LABEL_SIZE, OPTIONAL_LABEL_TEXT } from './label.constants';

/**
 * 2026 SaaS Label Primitive Component for KIZUNAFIT.
 * High readability typography with subtle muted accent required field indicators.
 */
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  (
    {
      size = DEFAULT_LABEL_SIZE,
      htmlFor,
      isRequired = false,
      required = false,
      isOptional = false,
      optional = false,
      isDisabled = false,
      disabled = false,
      error = false,
      success = false,
      warning = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const effectiveRequired = Boolean(isRequired || required);
    const effectiveOptional = Boolean(isOptional || optional);
    const effectiveDisabled = Boolean(isDisabled || disabled);

    const hasError = Boolean(error);
    const hasSuccess = Boolean(success && !hasError);
    const hasWarning = Boolean(warning && !hasError && !hasSuccess);

    const status = effectiveDisabled
      ? 'disabled'
      : hasError
      ? 'error'
      : hasSuccess
      ? 'success'
      : hasWarning
      ? 'warning'
      : 'default';

    return (
      <label
        ref={ref}
        htmlFor={htmlFor}
        aria-disabled={effectiveDisabled}
        className={cn(labelVariants({ size, status, className }))}
        {...props}
      >
        <span>{children}</span>

        {/* Elegant Subtle Muted Accent Required Indicator (Dot) */}
        {effectiveRequired && (
          <span
            className="text-cyan-400/80 font-bold text-base leading-none ml-0.5"
            aria-hidden="true"
            title="Required field"
          >
            ·
          </span>
        )}

        {/* Muted Optional Indicator Tag */}
        {!effectiveRequired && effectiveOptional && (
          <span className="text-slate-500 font-normal text-[0.8em] ml-1" aria-hidden="true">
            {OPTIONAL_LABEL_TEXT}
          </span>
        )}
      </label>
    );
  }
);

Label.displayName = 'Label';
