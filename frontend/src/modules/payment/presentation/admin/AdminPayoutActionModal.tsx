'use client';

import React, { useState } from 'react';
import { useProcessPayout, useRetryPayout } from '../../application/mutations/usePayoutMutations';
import { PaymentDetails } from '../../domain/types/payment.types';
import { PayoutStatus } from '../../domain/types/payout.types';
import { X, Loader2, Send, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AdminPayoutActionModalProps {
  payment: PaymentDetails;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AdminPayoutActionModal: React.FC<AdminPayoutActionModalProps> = ({
  payment,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const processMutation = useProcessPayout();
  const retryMutation = useRetryPayout();

  if (!isOpen) return null;

  const isPending = processMutation.isPending || retryMutation.isPending;
  const isFailed = payment.payout.status === PayoutStatus.FAILED;

  const handleProcess = async () => {
    try {
      setErrorMessage('');
      await processMutation.mutateAsync({
        paymentId: payment.paymentId,
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Payout transfer initiation failed.');
    }
  };

  const handleRetry = async () => {
    try {
      setErrorMessage('');
      await retryMutation.mutateAsync({
        paymentId: payment.paymentId,
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Payout transfer retry failed.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      data-testid="admin-payout-action-modal"
    >
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <span className="text-xs font-mono text-[var(--color-text-tertiary)] block">
            PAYOUT AGGREGATE REF: {payment.payout.payoutId}
          </span>
          <h2 className="text-lg font-extrabold text-[var(--color-text-primary)] mt-1">
            Execute Trainer Payout Transfer
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Razorpay Route linked account dispatch.
          </p>
        </div>

        <div className="bg-[var(--color-surface-subtle)] p-4 rounded-xl text-xs space-y-2 border border-[var(--color-border)]">
          <div className="flex justify-between">
            <span className="text-[var(--color-text-secondary)]">Trainer Account</span>
            <span className="font-mono text-[var(--color-text-primary)]">{payment.trainerId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--color-text-secondary)]">Calculated Payout Amount</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
              ₹{payment.payout.amount}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--color-text-secondary)]">Escrow Status</span>
            <span className="font-bold text-[var(--color-text-primary)]">
              {payment.payout.status}
            </span>
          </div>
        </div>

        {payment.hasActiveDispute && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Warning: Payout is currently frozen by an active dispute.</span>
          </div>
        )}

        {errorMessage && (
          <p className="text-xs text-rose-500 font-medium" role="alert">
            {errorMessage}
          </p>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] transition-colors"
          >
            Cancel
          </button>

          {isFailed ? (
            <button
              type="button"
              onClick={handleRetry}
              disabled={isPending}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
              data-testid="btn-retry-payout"
            >
              {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              <span>Retry Payout Transfer</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleProcess}
              disabled={isPending || payment.hasActiveDispute}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
              data-testid="btn-execute-payout"
            >
              {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>Dispatch Transfer via Route</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
