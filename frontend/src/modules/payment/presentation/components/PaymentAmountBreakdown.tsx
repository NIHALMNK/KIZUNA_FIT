'use client';

import React from 'react';
import { PaymentPricing } from '../../domain/types/payment.types';

interface PaymentAmountBreakdownProps {
  pricing: PaymentPricing;
  showPlatformFee?: boolean;
  className?: string;
}

export const PaymentAmountBreakdown: React.FC<PaymentAmountBreakdownProps> = ({
  pricing,
  showPlatformFee = true,
  className = '',
}) => {
  const formatMoney = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div
      className={`bg-[var(--color-surface-subtle)] border border-[var(--color-border)] rounded-xl p-4 space-y-3 ${className}`}
      data-testid="payment-amount-breakdown"
    >
      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--color-text-secondary)]">Trainer Coaching Fee</span>
        <span className="font-medium text-[var(--color-text-primary)]">
          {formatMoney(pricing.trainerFee, pricing.currency)}
        </span>
      </div>

      {showPlatformFee && pricing.platformFee > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--color-text-secondary)]">Platform & Escrow Service Fee</span>
          <span className="font-medium text-[var(--color-text-primary)]">
            {formatMoney(pricing.platformFee, pricing.currency)}
          </span>
        </div>
      )}

      <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
        <span className="text-base font-bold text-[var(--color-text-primary)]">Total Amount</span>
        <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
          {formatMoney(pricing.totalAmount, pricing.currency)}
        </span>
      </div>
    </div>
  );
};
