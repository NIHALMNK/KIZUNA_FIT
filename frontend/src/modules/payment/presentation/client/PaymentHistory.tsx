'use client';

import React from 'react';
import { usePayments } from '../../application/queries/usePayments';
import { PaymentList } from '../components/PaymentList';
import { PaymentLoading } from '../components/PaymentLoading';
import { PaymentError } from '../components/PaymentError';
import { PaymentStatus } from '../../domain/types/payment.types';

interface PaymentHistoryProps {
  onSelectPayment?: (paymentId: string) => void;
  className?: string;
}

export const PaymentHistory: React.FC<PaymentHistoryProps> = ({
  onSelectPayment,
  className = '',
}) => {
  const { data, isLoading, error, refetch } = usePayments({ page: 1, limit: 20 });

  if (isLoading) {
    return <PaymentLoading message="Loading payment history..." className={className} />;
  }

  if (error) {
    return <PaymentError error={error} onRetry={() => refetch()} className={className} />;
  }

  const payments = data?.data || [];

  return (
    <div className={`space-y-4 ${className}`} data-testid="payment-history">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[var(--color-text-primary)]">
            Payment & Transaction History
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Overview of your coaching subscriptions, escrow protections, and tax receipts.
          </p>
        </div>
      </div>

      <PaymentList
        payments={payments}
        onSelectPayment={onSelectPayment}
        emptyMessage="You have not made any coaching package payments yet."
      />
    </div>
  );
};
