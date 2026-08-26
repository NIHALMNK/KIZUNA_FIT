'use client';

import React, { useState } from 'react';
import { usePayments } from '../../application/queries/usePayments';
import { PaymentStatus } from '../../domain/types/payment.types';
import { PaymentFilters } from './PaymentFilters';
import { PaymentList } from '../components/PaymentList';
import { PaymentLoading } from '../components/PaymentLoading';
import { PaymentError } from '../components/PaymentError';

interface AdminPaymentListProps {
  onSelectPayment?: (paymentId: string) => void;
  className?: string;
}

export const AdminPaymentList: React.FC<AdminPaymentListProps> = ({
  onSelectPayment,
  className = '',
}) => {
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | undefined>(undefined);
  const { data, isLoading, error, refetch } = usePayments({
    status: selectedStatus,
    page: 1,
    limit: 20,
  });

  return (
    <div className={`space-y-6 ${className}`} data-testid="admin-payment-list">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[var(--color-text-primary)]">
            Marketplace Payment Registry
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Admin oversight for all incoming payments, escrow holds, refunds, disputes, and payouts.
          </p>
        </div>
      </div>

      <PaymentFilters
        selectedStatus={selectedStatus}
        onStatusChange={(status) => setSelectedStatus(status)}
      />

      {isLoading ? (
        <PaymentLoading message="Loading marketplace payments..." />
      ) : error ? (
        <PaymentError error={error} onRetry={() => refetch()} />
      ) : (
        <PaymentList
          payments={data?.data || []}
          onSelectPayment={onSelectPayment}
          emptyMessage="No payments matched the selected filter."
        />
      )}
    </div>
  );
};
