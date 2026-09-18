'use client';

import React from 'react';

export const PaymentError: React.FC<{
  error: Error | null;
  onRetry?: () => void;
  className?: string;
}> = ({ error, onRetry, className = '' }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 space-y-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 text-center ${className}`}
      data-testid="payment-error"
      role="alert"
    >
      <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 font-bold">
        !
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400">Payment Error</h3>
        <p className="text-xs text-[var(--color-text-secondary)] max-w-md">
          {error?.message || 'An unexpected error occurred while fetching payment information.'}
        </p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-1.5 rounded-lg text-xs font-semibold text-rose-600 border border-rose-500/30 hover:bg-rose-500/10 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
