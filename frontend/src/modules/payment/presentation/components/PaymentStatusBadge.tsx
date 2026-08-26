'use client';

import React from 'react';
import { PaymentStatus } from '../../domain/types/payment.types';
import { RefundStatus } from '../../domain/types/refund.types';
import { DisputeStatus } from '../../domain/types/dispute.types';
import { PayoutStatus } from '../../domain/types/payout.types';

export type AnyPaymentStatus = PaymentStatus | RefundStatus | DisputeStatus | PayoutStatus;

interface PaymentStatusBadgeProps {
  status: AnyPaymentStatus;
  type?: 'payment' | 'refund' | 'dispute' | 'payout';
  className?: string;
}

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({
  status,
  type = 'payment',
  className = '',
}) => {
  const getBadgeConfig = () => {
    switch (status) {
      // Payment Statuses
      case PaymentStatus.SUCCESS:
        return {
          bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
          dot: 'bg-emerald-500',
          label: 'Success',
        };
      case PaymentStatus.PROCESSING:
        return {
          bg: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
          dot: 'bg-blue-500 animate-pulse',
          label: 'Processing',
        };
      case PaymentStatus.CREATED:
        return {
          bg: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400',
          dot: 'bg-amber-500',
          label: 'Created',
        };
      case PaymentStatus.FAILED:
        return {
          bg: 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400',
          dot: 'bg-rose-500',
          label: 'Failed',
        };
      case PaymentStatus.REFUNDED:
        return {
          bg: 'bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400',
          dot: 'bg-purple-500',
          label: 'Refunded',
        };

      // Refund Statuses
      case RefundStatus.PENDING:
        return {
          bg: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400',
          dot: 'bg-amber-500 animate-pulse',
          label: 'Refund Pending',
        };
      case RefundStatus.UNDER_REVIEW:
        return {
          bg: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
          dot: 'bg-blue-500 animate-pulse',
          label: 'Under Review',
        };
      case RefundStatus.APPROVED:
        return {
          bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
          dot: 'bg-emerald-500',
          label: 'Approved',
        };
      case RefundStatus.REJECTED:
        return {
          bg: 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400',
          dot: 'bg-rose-500',
          label: 'Rejected',
        };
      case RefundStatus.PROCESSED:
        return {
          bg: 'bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400',
          dot: 'bg-purple-500',
          label: 'Processed',
        };
      case RefundStatus.CANCELLED:
        return {
          bg: 'bg-zinc-500/10 text-zinc-600 border-zinc-500/20 dark:text-zinc-400',
          dot: 'bg-zinc-400',
          label: 'Cancelled',
        };

      // Dispute Statuses
      case DisputeStatus.OPEN:
        return {
          bg: 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400',
          dot: 'bg-rose-500 animate-pulse',
          label: 'Dispute Open',
        };
      case DisputeStatus.UNDER_INVESTIGATION:
        return {
          bg: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400',
          dot: 'bg-amber-500 animate-pulse',
          label: 'Under Investigation',
        };
      case DisputeStatus.RESOLVED:
        return {
          bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
          dot: 'bg-emerald-500',
          label: 'Resolved',
        };
      case DisputeStatus.CLOSED:
        return {
          bg: 'bg-zinc-500/10 text-zinc-600 border-zinc-500/20 dark:text-zinc-400',
          dot: 'bg-zinc-400',
          label: 'Closed',
        };

      // Payout Statuses
      case PayoutStatus.ON_HOLD:
        return {
          bg: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400',
          dot: 'bg-amber-500',
          label: 'Escrow Hold',
        };
      case PayoutStatus.PAID:
        return {
          bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
          dot: 'bg-emerald-500',
          label: 'Paid',
        };

      default:
        return {
          bg: 'bg-zinc-500/10 text-zinc-600 border-zinc-500/20 dark:text-zinc-400',
          dot: 'bg-zinc-400',
          label: status,
        };
    }
  };

  const { bg, dot, label } = getBadgeConfig();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${bg} ${className}`}
      data-testid="payment-status-badge"
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
      <span>{label}</span>
    </span>
  );
};
