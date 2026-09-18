import React from 'react';
import { cn } from '../../../utils/cn';
import { CardFooterProps } from './card.types';

/**
 * CardFooter sub-component for card action controls and metadata footers.
 */
export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center justify-between pt-2 border-t border-border/50', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';
