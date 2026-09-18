'use client';

import React from 'react';
import { usePayments } from '../../application/queries/usePayments';
import { PaymentList } from '../components/PaymentList';
import { PaymentLoading } from '../components/PaymentLoading';
import { PaymentError } from '../components/PaymentError';

interface TrainerPaymentHistoryProps {
  onSelectPayment?: (paymentId: string) => void;
  className?: string;
}

export const TrainerPaymentHistory: React.FC<TrainerPaymentHistoryProps> = ({
  onSelectPayment,
  className = '',
}) => {
  const { data, isLoading, error, refetch } = usePayments({ page: 1, limit: 20 });

  if (isLoading) {
    return <PaymentLoading message="Loading coaching payment records..." className={className} />;
  }

  if (error) {
    return <PaymentError error={error} onRetry={() => refetch()} className={className} />;
  }

  const payments = data?.data || [];

  return (
    <div className={`space-y-4 ${className}`} data-testid="trainer-payment-history">
      <div>
        <h2 className="text-xl font-extrabold text-[var(--color-text-primary)]">
          Coaching Payment Transactions
        </h2>
        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
          Track payments received for your accepted coaching packages and payout progress.
        </p>
      </div>

      <PaymentList
        payments={payments}
        onSelectPayment={onSelectPayment}
        emptyMessage="No coaching payments recorded yet."
      />
    </div>
  );
};
