import React, { ButtonHTMLAttributes } from 'react';

/**
 * Official visual variants for the KIZUNAFIT Button component.
 * Maps directly to semantic design tokens.
 */
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'warning'
  | 'icon';

/**
 * Official size scale for the KIZUNAFIT Button component.
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Enterprise specification props interface for the Button primitive component.
 * Extends standard HTML button attributes while enforcing enterprise standards.
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant style mapping to semantic design tokens */
  variant?: ButtonVariant;
  /** Size scale controlling height, padding, and typography */
  size?: ButtonSize;
  /** Async loading state; renders inline spinner and blocks user interaction */
  isLoading?: boolean;
  /** Disables user interaction and applies muted opacity styling */
  isDisabled?: boolean;
  /** Accessible text label for screen reader live region during loading state */
  loadingText?: string;
  /** Expands button container width to 100% */
  fullWidth?: boolean;
  /** Icon element rendered before the button label */
  leftIcon?: React.ReactNode;
  /** Icon element rendered after the button label */
  rightIcon?: React.ReactNode;
  /** Additional custom class names override */
  className?: string;
  /** Button content children */
  children?: React.ReactNode;
}
