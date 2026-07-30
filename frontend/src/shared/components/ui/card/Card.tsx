'use client';

import React from 'react';
import { cn } from '../../../utils/cn';
import { CardProps } from './card.types';
import { cardVariants } from './card.variants';
import { DEFAULT_CARD_VARIANT, DEFAULT_CARD_SIZE } from './card.constants';

/**
 * Production-Ready Golden Reference Card Primitive Component for KIZUNAFIT.
 * Fully compliant with Enterprise Design Tokens, UX Pattern Library, and Frontend Handbook.
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = DEFAULT_CARD_VARIANT,
      size = DEFAULT_CARD_SIZE,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
