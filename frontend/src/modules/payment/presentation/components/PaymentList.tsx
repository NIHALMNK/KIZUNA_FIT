'use client';

import React from 'react';
import { PaymentSummary } from '../../domain/types/payment.types';
import { PaymentCard } from './PaymentCard';
import { CreditCard } from 'lucide-react';

interface PaymentListProps {
  payments: PaymentSummary[];
  onSelectPayment?: (paymentId: string) => void;
  emptyMessage?: string;
  className?: string;
}

export const PaymentList: React.FC<PaymentListProps> = ({
  payments,
  onSelectPayment,
  emptyMessage = 'No payment transactions found.',
  className = '',
}) => {
  if (payments.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] space-y-3"
        data-testid="payment-list-empty"
      >
        <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
          <CreditCard className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium text-[var(--color-text-secondary)]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}
      data-testid="payment-list"
    >
      {payments.map((payment) => (
        <PaymentCard key={payment.paymentId} payment={payment} onSelect={onSelectPayment} />
      ))}
    </div>
  );
};
