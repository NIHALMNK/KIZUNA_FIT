'use client';

import React from 'react';
import { PaymentStatus } from '../../domain/types/payment.types';

interface PaymentFiltersProps {
  selectedStatus?: PaymentStatus;
  onStatusChange: (status?: PaymentStatus) => void;
  className?: string;
}

export const PaymentFilters: React.FC<PaymentFiltersProps> = ({
  selectedStatus,
  onStatusChange,
  className = '',
}) => {
  const statuses: { label: string; value?: PaymentStatus }[] = [
    { label: 'All Payments', value: undefined },
    { label: 'Success', value: PaymentStatus.SUCCESS },
    { label: 'Processing', value: PaymentStatus.PROCESSING },
    { label: 'Created', value: PaymentStatus.CREATED },
    { label: 'Failed', value: PaymentStatus.FAILED },
    { label: 'Refunded', value: PaymentStatus.REFUNDED },
  ];

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`} data-testid="payment-filters">
      {statuses.map((item) => {
        const isSelected = selectedStatus === item.value;
        return (
          <button
            key={item.label}
            type="button"
            onClick={() => onStatusChange(item.value)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isSelected
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-border-strong)]'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};
