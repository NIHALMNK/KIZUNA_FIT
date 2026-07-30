import React from 'react';
import { cn } from '../../../utils/cn';
import { CardContentProps } from './card.types';

/**
 * CardContent sub-component for main card body payload.
 */
export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex-1 text-foreground', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';
