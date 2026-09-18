'use client';

import React from 'react';
import { PaymentDetails, PaymentStatus } from '../../domain/types/payment.types';
import { PayoutStatus } from '../../domain/types/payout.types';
import { RefundStatus } from '../../domain/types/refund.types';
import { DisputeStatus } from '../../domain/types/dispute.types';
import { CheckCircle2, Clock, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';

interface PaymentTimelineProps {
  payment: PaymentDetails;
  className?: string;
}

export const PaymentTimeline: React.FC<PaymentTimelineProps> = ({ payment, className = '' }) => {
  const steps = [
    {
      title: 'Payment Completed',
      subtitle:
        payment.status === PaymentStatus.SUCCESS
          ? 'Verified via Razorpay'
          : 'Pending Client Payment',
      completed:
        payment.status === PaymentStatus.SUCCESS || payment.status === PaymentStatus.REFUNDED,
      current:
        payment.status === PaymentStatus.CREATED || payment.status === PaymentStatus.PROCESSING,
      error: payment.status === PaymentStatus.FAILED,
    },
    {
      title: '3-Day Escrow Review',
      subtitle: payment.hasActiveDispute
        ? 'Frozen by Active Dispute'
        : payment.refunds.length > 0 && payment.refunds[0].status === RefundStatus.PENDING
          ? 'Under Refund Review'
          : payment.payout.eligibleAt
            ? `Eligible: ${new Date(payment.payout.eligibleAt).toLocaleDateString()}`
            : 'Escrow holding window',
      completed:
        payment.payout.status === PayoutStatus.PROCESSING ||
        payment.payout.status === PayoutStatus.PAID,
      current:
        payment.status === PaymentStatus.SUCCESS && payment.payout.status === PayoutStatus.ON_HOLD,
      error:
        payment.hasActiveDispute ||
        (payment.refunds.length > 0 && payment.refunds[0].status === RefundStatus.APPROVED),
    },
    {
      title: 'Trainer Payout & Settlement',
      subtitle:
        payment.payout.status === PayoutStatus.PAID
          ? 'Settled to Trainer'
          : payment.payout.status === PayoutStatus.FAILED
            ? 'Payout Transfer Failed'
            : payment.payout.status === PayoutStatus.PROCESSING
              ? 'Transfer in progress'
              : 'Awaiting review expiry',
      completed: payment.payout.status === PayoutStatus.PAID,
      current: payment.payout.status === PayoutStatus.PROCESSING,
      error: payment.payout.status === PayoutStatus.FAILED,
    },
  ];

  return (
    <div
      className={`border border-[var(--color-border)] bg-[var(--color-surface)] rounded-xl p-5 space-y-4 ${className}`}
      data-testid="payment-timeline"
    >
      <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
        Payment Lifecycle Timeline
      </h3>

      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div key={step.title} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  step.error
                    ? 'bg-rose-500/10 text-rose-600 border border-rose-500/30'
                    : step.completed
                      ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                      : step.current
                        ? 'bg-blue-500/10 text-blue-600 border border-blue-500/30 animate-pulse'
                        : 'bg-zinc-100 text-zinc-400 border border-zinc-200 dark:bg-zinc-800'
                }`}
              >
                {step.error ? (
                  <AlertTriangle className="w-3.5 h-3.5" />
                ) : step.completed ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <Clock className="w-3.5 h-3.5" />
                )}
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`w-0.5 h-6 my-1 ${
                    step.completed ? 'bg-emerald-500/30' : 'bg-zinc-200 dark:bg-zinc-700'
                  }`}
                />
              )}
            </div>

            <div className="pt-0.5 space-y-0.5">
              <p
                className={`text-xs font-bold ${
                  step.error
                    ? 'text-rose-600 dark:text-rose-400'
                    : step.completed
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : step.current
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-[var(--color-text-primary)]'
                }`}
              >
                {step.title}
              </p>
              <p className="text-[11px] text-[var(--color-text-secondary)]">{step.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
