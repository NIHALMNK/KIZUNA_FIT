import React, { HTMLAttributes } from 'react';

/**
 * Official visual variants for the KIZUNAFIT Card component.
 */
export type CardVariant = 'default' | 'outlined' | 'filled' | 'elevated' | 'ghost';

/**
 * Official size scale controlling internal padding and layout gap.
 */
export type CardSize = 'sm' | 'md' | 'lg';

/**
 * Props specification for the outer Card container primitive.
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual variant style mapping strictly to semantic design tokens */
  variant?: CardVariant;
  /** Size scale controlling internal padding and spacing */
  size?: CardSize;
  /** Custom CSS class names override */
  className?: string;
  /** Card container content children */
  children?: React.ReactNode;
}

/**
 * Props specification for the CardHeader sub-component.
 */
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Props specification for the CardTitle sub-component.
 */
export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Props specification for the CardDescription sub-component.
 */
export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Props specification for the CardContent sub-component.
 */
export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Props specification for the CardFooter sub-component.
 */
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}
