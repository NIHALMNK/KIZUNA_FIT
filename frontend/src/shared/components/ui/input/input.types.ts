import React, { InputHTMLAttributes } from 'react';

/**
 * Supported visual variants for the Input component.
 */
export type InputVariant = 'default' | 'filled' | 'outline' | 'ghost';

/**
 * Supported size scales for the Input component.
 */
export type InputSize = 'sm' | 'md' | 'lg';

/**
 * Enterprise specification props interface for the Input primitive component.
 * Extends standard HTML input attributes while enforcing enterprise standards.
 */
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  /** Visual variant style mapping strictly to semantic design tokens */
  variant?: InputVariant;
  /** Size scale controlling height, padding, font size, and icon dimensions */
  size?: InputSize;
  /** Accessible text or component label rendered above the input */
  label?: React.ReactNode;
  /** Helper text or contextual hint displayed below the input */
  helperText?: React.ReactNode;
  /** Error status boolean or error message string */
  error?: boolean | string;
  /** Success status boolean or success message string */
  success?: boolean | string;
  /** Warning status boolean or warning message string */
  warning?: boolean | string;
  /** Disables user interaction and applies muted opacity styling */
  isDisabled?: boolean;
  /** Marks field as mandatory with visual indicator and aria-required */
  isRequired?: boolean;
  /** Renders field in read-only mode */
  isReadOnly?: boolean;
  /** Expands container width to 100% */
  fullWidth?: boolean;
  /** Icon element rendered inside the input on the left */
  leftIcon?: React.ReactNode;
  /** Icon element rendered inside the input on the right */
  rightIcon?: React.ReactNode;
  /** Static text or element prefix rendered inside the input container before leftIcon */
  prefix?: React.ReactNode;
  /** Static text or element suffix rendered inside the input container after rightIcon */
  suffix?: React.ReactNode;
  /** Renders a clear button (X icon) when input has a value */
  isClearable?: boolean;
  /** Callback function executed when the clear button is clicked */
  onClear?: () => void;
  /** Custom CSS class names applied to the outer wrapper element */
  containerClassName?: string;
  /** Custom CSS class names applied directly to the `<input>` element */
  inputClassName?: string;
}
