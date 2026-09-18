'use client';

import React from 'react';
import { PaymentSummary, PaymentStatus } from '../../domain/types/payment.types';
import { PayoutStatus } from '../../domain/types/payout.types';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import {
  Calendar,
  User,
  ArrowRight,
  ShieldAlert,
  Clock,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';
import Link from 'next/link';

interface PaymentCardProps {
  payment: PaymentSummary;
  href?: string;
  onSelect?: (paymentId: string) => void;
  className?: string;
}

export const PaymentCard: React.FC<PaymentCardProps> = ({
  payment,
  href,
  onSelect,
  className = '',
}) => {
  const formatMoney = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getPayoutLifecycleBadge = () => {
    if (payment.hasActiveDispute) {
      return (
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400"
          data-testid="payout-status-dispute"
        >
          Locked by Dispute
        </span>
      );
    }
    if (payment.status === PaymentStatus.REFUNDED) {
      return (
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400"
          data-testid="payout-status-refunded"
        >
          Refunded
        </span>
      );
    }
    const payoutStatus = payment.payout?.status;
    if (payoutStatus === PayoutStatus.PAID) {
      return (
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
          data-testid="payout-status-paid"
        >
          Paid
        </span>
      );
    }
    if (payoutStatus === PayoutStatus.PROCESSING) {
      return (
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400"
          data-testid="payout-status-processing"
        >
          Payout Processing
        </span>
      );
    }
    const isEligible =
      (payoutStatus as string) === 'ELIGIBLE' ||
      (payment.payout?.eligibleAt && new Date(payment.payout.eligibleAt).getTime() <= Date.now());
    if (isEligible) {
      return (
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400"
          data-testid="payout-status-eligible"
        >
          Payout Eligible
        </span>
      );
    }
    if (
      payoutStatus === PayoutStatus.ON_HOLD ||
      payoutStatus === PayoutStatus.PENDING ||
      payment.status === PaymentStatus.SUCCESS
    ) {
      return (
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400"
          data-testid="payout-status-escrow"
        >
          In Escrow Review
        </span>
      );
    }
    return null;
  };

  const trainerEarnings =
    payment.status === PaymentStatus.REFUNDED ? 0 : payment.pricing.trainerFee;

  const content = (
    <div
      className={`bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-border-strong)] rounded-2xl p-5 transition-all shadow-sm flex flex-col justify-between gap-4 cursor-pointer ${className}`}
      onClick={() => onSelect && onSelect(payment.paymentId)}
      data-testid="payment-card"
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-[var(--color-text-tertiary)] uppercase font-semibold">
              ID: {payment.paymentId.slice(-8)}
            </span>
            {payment.offerId && (
              <span className="text-[10px] font-mono text-[var(--color-text-muted)] bg-[var(--color-surface-hover)] px-1.5 py-0.5 rounded border border-[var(--color-border)]">
                Offer: {payment.offerId.slice(-6)}
              </span>
            )}
          </div>
          <h4 className="text-sm font-extrabold text-[var(--color-text-primary)]">
            Coaching Package
          </h4>
        </div>
        <div className="flex flex-col items-end gap-1">
          <PaymentStatusBadge status={payment.status} />
          {getPayoutLifecycleBadge()}
        </div>
      </div>

      {/* Financial Amounts Breakdown */}
      <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs">
        <div>
          <span className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase">
            Total Paid
          </span>
          <span className="font-extrabold text-sm text-[var(--color-text-primary)] font-mono">
            {formatMoney(payment.pricing.totalAmount, payment.pricing.currency)}
          </span>
        </div>
        <div className="text-right">
          <span className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase">
            Trainer Earnings
          </span>
          <span
            className={`font-extrabold text-sm font-mono ${
              payment.status === PaymentStatus.REFUNDED
                ? 'text-zinc-400 line-through'
                : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {formatMoney(trainerEarnings, payment.pricing.currency)}
          </span>
        </div>
      </div>

      {/* Metadata & Settlement Info */}
      <div className="space-y-1.5 text-xs text-[var(--color-text-secondary)]">
        {payment.clientId && (
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[var(--color-text-muted)]">Client:</span>
            <span className="font-mono text-[var(--color-text-primary)] truncate max-w-[150px]">
              {payment.clientId}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[var(--color-text-muted)]">Recorded:</span>
          <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
        </div>

        {payment.payout?.eligibleAt && (
          <div className="flex items-center justify-between text-[11px] text-amber-600 dark:text-amber-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Eligible Date:</span>
            </span>
            <span>{new Date(payment.payout.eligibleAt).toLocaleDateString()}</span>
          </div>
        )}

        {payment.settlement && payment.payout?.status === 'PAID' && (
          <div className="flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-1 border-t border-[var(--color-border)]">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Settled Amount:</span>
            </span>
            <span>{formatMoney(payment.settlement.trainerAmount, payment.pricing.currency)}</span>
          </div>
        )}

        {payment.hasActiveDispute && (
          <div className="flex items-center gap-1 text-rose-500 font-semibold pt-1">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>Active Dispute (Payout Frozen)</span>
          </div>
        )}
      </div>

      {/* Footer Action */}
      <div className="flex items-center justify-end text-xs font-bold text-emerald-600 dark:text-emerald-400 gap-1 pt-2 border-t border-[var(--color-border)]">
        <span>View Details</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
};
