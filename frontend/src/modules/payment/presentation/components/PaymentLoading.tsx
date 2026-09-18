'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export const PaymentLoading: React.FC<{ message?: string; className?: string }> = ({
  message = 'Loading payment details...',
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 space-y-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] ${className}`}
      data-testid="payment-loading"
    >
      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      <p className="text-sm font-medium text-[var(--color-text-secondary)]">{message}</p>
    </div>
  );
};
