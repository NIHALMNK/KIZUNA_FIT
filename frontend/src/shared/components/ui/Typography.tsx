import React from 'react';
import { cn } from '../../utils/cn';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  as?: React.ElementType;
}

const headingStyles: Record<number, string> = {
  1: 'text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--color-heading)]',
  2: 'text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-heading)]',
  3: 'text-xl sm:text-2xl font-semibold tracking-tight text-[var(--color-heading)]',
  4: 'text-lg font-semibold text-[var(--color-heading)]',
  5: 'text-base font-semibold text-[var(--color-heading)]',
  6: 'text-sm font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]',
};

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level = 1, as, className, children, ...props }, ref) => {
    const Component = as || (`h${level}` as React.ElementType);
    return (
      <Component
        ref={ref}
        className={cn(headingStyles[level], className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Heading.displayName = 'Heading';

export interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'muted' | 'secondary' | 'primary';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  as?: React.ElementType;
}

const variantStyles: Record<string, string> = {
  default: 'text-[var(--color-text-primary)]',
  secondary: 'text-[var(--color-text-secondary)]',
  muted: 'text-[var(--color-text-muted)]',
  primary: 'text-[var(--color-primary)] font-medium',
};

const sizeStyles: Record<string, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const weightStyles: Record<string, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export const Text = React.forwardRef<HTMLSpanElement, TextProps>(
  (
    {
      variant = 'default',
      size = 'sm',
      weight = 'normal',
      as: Component = 'span',
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          variantStyles[variant],
          sizeStyles[size],
          weightStyles[weight],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Text.displayName = 'Text';

export interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: 'default' | 'muted' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export const Paragraph = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ variant = 'default', size = 'md', className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          'leading-relaxed',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </p>
    );
  }
);
Paragraph.displayName = 'Paragraph';
