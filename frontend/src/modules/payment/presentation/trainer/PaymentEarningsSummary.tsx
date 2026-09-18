'use client';

import React from 'react';
import { DollarSign, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface PaymentEarningsSummaryProps {
  totalSettled: number;
  escrowPending: number;
  disputeLocked: number;
  currency?: string;
  className?: string;
}

export const PaymentEarningsSummary: React.FC<PaymentEarningsSummaryProps> = ({
  totalSettled,
  escrowPending,
  disputeLocked,
  currency = 'INR',
  className = '',
}) => {
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-3 gap-4 ${className}`}
      data-testid="payment-earnings-summary"
    >
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-5 space-y-2 shadow-sm">
        <div className="flex items-center justify-between text-zinc-500">
          <span className="text-xs font-semibold">Settled Earnings</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-extrabold text-[var(--color-text-primary)]">
          {formatMoney(totalSettled)}
        </p>
        <span className="text-[11px] text-[var(--color-text-secondary)] block">
          Transferred to your bank account
        </span>
      </div>

      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-5 space-y-2 shadow-sm">
        <div className="flex items-center justify-between text-zinc-500">
          <span className="text-xs font-semibold">In Escrow Review</span>
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-extrabold text-[var(--color-text-primary)]">
          {formatMoney(escrowPending)}
        </p>
        <span className="text-[11px] text-[var(--color-text-secondary)] block">
          3-day review holding period
        </span>
      </div>

      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-5 space-y-2 shadow-sm">
        <div className="flex items-center justify-between text-zinc-500">
          <span className="text-xs font-semibold">Locked by Disputes</span>
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-extrabold text-[var(--color-text-primary)]">
          {formatMoney(disputeLocked)}
        </p>
        <span className="text-[11px] text-[var(--color-text-secondary)] block">
          Under admin investigation
        </span>
      </div>
    </div>
  );
};
