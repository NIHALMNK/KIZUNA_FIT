import React from 'react';
import { cn } from '../../utils/cn';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy';
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

const statusClasses = {
  online: 'bg-[var(--color-success)]',
  offline: 'bg-[var(--color-text-muted)]',
  busy: 'bg-[var(--color-danger)]',
};

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt = 'Avatar',
      fallback = 'KF',
      size = 'md',
      status,
      className,
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = React.useState(false);

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-alt)] font-medium text-[var(--color-text-primary)] border border-[var(--color-border)] select-none overflow-hidden',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover rounded-full"
          />
        ) : (
          <span aria-label={alt}>{fallback.toUpperCase().slice(0, 2)}</span>
        )}

        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-[var(--color-background)]',
              statusClasses[status]
            )}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  }
);
Avatar.displayName = 'Avatar';
