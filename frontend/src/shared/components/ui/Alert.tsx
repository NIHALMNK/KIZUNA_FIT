import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '../../utils/cn';

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 text-sm font-normal [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-current [&>svg~*]:pl-7 transition-colors',
  {
    variants: {
      variant: {
        info: 'bg-[var(--color-info-bg)] border-[var(--color-info)]/30 text-[var(--color-info)]',
        success: 'bg-[var(--color-success-bg)] border-[var(--color-success)]/30 text-[var(--color-success)]',
        warning: 'bg-[var(--color-warning-bg)] border-[var(--color-warning)]/30 text-[var(--color-warning)]',
        danger: 'bg-[var(--color-danger-bg)] border-[var(--color-danger)]/30 text-[var(--color-danger)]',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
  onClose?: () => void;
}

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'info', title, children, onClose, ...props }, ref) => {
    const IconComponent = icons[variant || 'info'];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        <IconComponent className="h-4 w-4 shrink-0" aria-hidden="true" />
        <div className="flex-1">
          {title && <h5 className="mb-1 font-semibold leading-none tracking-tight">{title}</h5>}
          {children && <div className="text-xs opacity-90 leading-relaxed">{children}</div>}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close alert"
            className="absolute right-3 top-3.5 rounded-md p-1 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-current"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );
  }
);
Alert.displayName = 'Alert';
