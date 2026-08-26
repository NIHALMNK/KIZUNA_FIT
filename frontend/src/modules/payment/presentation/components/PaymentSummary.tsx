'use client';

import React from 'react';
import { PaymentDetails } from '../../domain/types/payment.types';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { PaymentAmountBreakdown } from './PaymentAmountBreakdown';
import { ShieldCheck, User, Calendar, Receipt, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface PaymentSummaryProps {
  payment: PaymentDetails;
  onViewInvoice?: () => void;
  className?: string;
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  payment,
  onViewInvoice,
  className = '',
}) => {
  return (
    <div
      className={`bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 space-y-6 shadow-sm ${className}`}
      data-testid="payment-summary"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--color-border)]">
        <div>
          <span className="text-xs font-mono text-[var(--color-text-tertiary)] block">
            PAYMENT REF: {payment.paymentId}
          </span>
          <h2 className="text-xl font-extrabold text-[var(--color-text-primary)] mt-1">
            Monthly Coaching Package
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <PaymentStatusBadge status={payment.status} />
          {payment.payout && <PaymentStatusBadge status={payment.payout.status} type="payout" />}
        </div>
      </div>

      <PaymentAmountBreakdown pricing={payment.pricing} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="bg-[var(--color-surface-subtle)] p-3.5 rounded-xl space-y-1.5 border border-[var(--color-border)]">
          <span className="text-[var(--color-text-tertiary)] font-semibold">PARTICIPANTS</span>
          <div className="space-y-1 text-[var(--color-text-secondary)]">
            <p>
              Client ID:{' '}
              <span className="font-mono text-[var(--color-text-primary)]">{payment.clientId}</span>
            </p>
            <p>
              Trainer ID:{' '}
              <span className="font-mono text-[var(--color-text-primary)]">
                {payment.trainerId}
              </span>
            </p>
          </div>
        </div>

        <div className="bg-[var(--color-surface-subtle)] p-3.5 rounded-xl space-y-1.5 border border-[var(--color-border)]">
          <span className="text-[var(--color-text-tertiary)] font-semibold">
            SUBSCRIPTION STATUS
          </span>
          <div className="space-y-1 text-[var(--color-text-secondary)]">
            <p>
              Status:{' '}
              <span className="font-semibold text-[var(--color-text-primary)]">
                {payment.subscription.status}
              </span>
            </p>
            <p>
              Sessions Remaining:{' '}
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {payment.subscription.sessionsRemaining}
              </span>{' '}
              / {payment.subscription.sessionsIncluded}
            </p>
          </div>
        </div>
      </div>

      {onViewInvoice && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onViewInvoice}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>View Official Tax Invoice</span>
          </button>
        </div>
      )}
    </div>
  );
};
