'use client';

import React from 'react';
import {
  PaymentDetails as PaymentDetailsModel,
  PaymentStatus,
} from '../../domain/types/payment.types';
import { PaymentSummary } from './PaymentSummary';
import { PaymentTimeline } from './PaymentTimeline';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { PayoutStatus } from '../../domain/types/payout.types';
import { RefundStatus } from '../../domain/types/refund.types';
import { DisputeStatus } from '../../domain/types/dispute.types';
import { ShieldAlert, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

interface PaymentDetailsViewProps {
  payment: PaymentDetailsModel;
  onRequestRefund?: () => void;
  onRaiseDispute?: () => void;
  onViewInvoice?: () => void;
  onProcessPayout?: () => void;
  userRole?: 'CLIENT' | 'TRAINER' | 'ADMIN';
  className?: string;
}

export const PaymentDetailsView: React.FC<PaymentDetailsViewProps> = ({
  payment,
  onRequestRefund,
  onRaiseDispute,
  onViewInvoice,
  onProcessPayout,
  userRole = 'CLIENT',
  className = '',
}) => {
  const canRequestRefund =
    userRole === 'CLIENT' &&
    payment.status === PaymentStatus.SUCCESS &&
    payment.refunds.length === 0;

  const canRaiseDispute =
    (userRole === 'CLIENT' || userRole === 'TRAINER') &&
    payment.status === PaymentStatus.SUCCESS &&
    payment.payout.status !== PayoutStatus.PAID;

  const canProcessPayout =
    userRole === 'ADMIN' &&
    payment.status === PaymentStatus.SUCCESS &&
    (payment.payout.status === PayoutStatus.PENDING ||
      payment.payout.status === PayoutStatus.ON_HOLD ||
      payment.payout.status === PayoutStatus.FAILED);

  return (
    <div className={`space-y-6 ${className}`} data-testid="payment-details-view">
      <PaymentSummary payment={payment} onViewInvoice={onViewInvoice} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Active Dispute Warning Banner */}
          {payment.hasActiveDispute && (
            <div
              className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-xs text-rose-600 dark:text-rose-400"
              role="alert"
            >
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Payment Payout Is Frozen</p>
                <p className="mt-0.5 text-zinc-600 dark:text-zinc-300">
                  An active dispute is currently under investigation. Payout transfers remain locked
                  until dispute resolution.
                </p>
              </div>
            </div>
          )}

          {/* Exceptional Refund Section */}
          {payment.refunds.length > 0 && (
            <div className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                  Exceptional Service-Failure Refund
                </h3>
                <PaymentStatusBadge status={payment.refunds[0].status} type="refund" />
              </div>
              <div className="text-xs text-[var(--color-text-secondary)] space-y-1">
                <p>
                  Reason:{' '}
                  <span className="text-[var(--color-text-primary)]">
                    {payment.refunds[0].reason}
                  </span>
                </p>
                <p>
                  Refund Amount:{' '}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{payment.refunds[0].amount}
                  </span>{' '}
                  (Full Trainer Fee Refund)
                </p>
                {payment.refunds[0].adminNotes && (
                  <p>
                    Admin Notes:{' '}
                    <span className="text-[var(--color-text-primary)]">
                      {payment.refunds[0].adminNotes}
                    </span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Disputes Section */}
          {payment.disputes.length > 0 && (
            <div className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                  Payment Dispute
                </h3>
                <PaymentStatusBadge status={payment.disputes[0].status} type="dispute" />
              </div>
              <div className="text-xs text-[var(--color-text-secondary)] space-y-1">
                <p>
                  Reason:{' '}
                  <span className="text-[var(--color-text-primary)]">
                    {payment.disputes[0].reason}
                  </span>
                </p>
                {payment.disputes[0].evidence && (
                  <p>
                    Evidence:{' '}
                    <span className="text-[var(--color-text-primary)]">
                      {payment.disputes[0].evidence}
                    </span>
                  </p>
                )}
                {payment.disputes[0].resolutionNotes && (
                  <p>
                    Resolution:{' '}
                    <span className="text-[var(--color-text-primary)]">
                      {payment.disputes[0].resolutionNotes}
                    </span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Settlement Snapshot */}
          {payment.settlement && (
            <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  Final Financial Settlement Snapshot
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[var(--color-text-secondary)]">Trainer Transferred</span>
                  <p className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                    ₹{payment.settlement.trainerAmount}
                  </p>
                </div>
                <div>
                  <span className="text-[var(--color-text-secondary)]">Platform Retained</span>
                  <p className="font-extrabold text-zinc-700 dark:text-zinc-300 text-sm">
                    ₹{payment.settlement.platformAmount}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Timeline & Actions */}
        <div className="space-y-6">
          <PaymentTimeline payment={payment} />

          {/* Action Buttons */}
          <div className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] space-y-3">
            <h3 className="text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider">
              Actions
            </h3>

            {canRequestRefund && onRequestRefund && (
              <button
                type="button"
                onClick={onRequestRefund}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-rose-600 bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
                data-testid="request-refund-button"
              >
                Request Service-Failure Refund
              </button>
            )}

            {canRaiseDispute && onRaiseDispute && (
              <button
                type="button"
                onClick={onRaiseDispute}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-amber-600 bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
                data-testid="raise-dispute-button"
              >
                Raise Payment Dispute
              </button>
            )}

            {canProcessPayout && onProcessPayout && (
              <button
                type="button"
                onClick={onProcessPayout}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
                data-testid="process-payout-button"
              >
                Process Trainer Payout Transfer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
