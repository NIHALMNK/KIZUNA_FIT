import React, { LabelHTMLAttributes } from 'react';

/**
 * Official size scale for the KIZUNAFIT Label component.
 */
export type LabelSize = 'sm' | 'md' | 'lg';

/**
 * Enterprise specification props interface for the Label primitive component.
 * Extends standard HTML label attributes while enforcing enterprise standards.
 */
export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** Size scale controlling typography size and indicator spacing */
  size?: LabelSize;
  /** HTML ID of the target input element linked to this label */
  htmlFor?: string;
  /** Renders a red asterisk (*) indicator for mandatory form fields */
  isRequired?: boolean;
  /** Alias for isRequired for backward compatibility */
  required?: boolean;
  /** Renders a muted (optional) indicator tag for non-mandatory form fields */
  isOptional?: boolean;
  /** Alias for isOptional for backward compatibility */
  optional?: boolean;
  /** Disables label interaction and applies muted opacity styling */
  isDisabled?: boolean;
  /** Alias for isDisabled for backward compatibility */
  disabled?: boolean;
  /** Applies error status styling (--color-danger) */
  error?: boolean | string;
  /** Applies success status styling (--color-success) */
  success?: boolean | string;
  /** Applies warning status styling (--color-warning) */
  warning?: boolean | string;
  /** Additional CSS class names override */
  className?: string;
  /** Label content children */
  children?: React.ReactNode;
}
