'use client';

import React, { useState } from 'react';
import { useRequestRefund } from '../../application/mutations/useRefundMutations';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

interface ExceptionalRefundModalProps {
  paymentId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ExceptionalRefundModal: React.FC<ExceptionalRefundModalProps> = ({
  paymentId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [reason, setReason] = useState('');
  const [validationError, setValidationError] = useState('');
  const requestRefundMutation = useRequestRefund();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || reason.trim().length < 10) {
      setValidationError('Please provide a detailed reason (minimum 10 characters).');
      return;
    }

    try {
      setValidationError('');
      await requestRefundMutation.mutateAsync({
        paymentId,
        payload: { reason: reason.trim() },
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: unknown) {
      // Error handled by mutation state
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      data-testid="exceptional-refund-modal"
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

        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[var(--color-text-primary)]">
              Request Exceptional Service-Failure Refund
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
              Refunds are exclusively reserved for verified coach non-delivery and are subject to
              administrative review.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 space-y-1">
          <p className="font-bold">Authoritative Refund Policy Notice:</p>
          <p>
            Standard and arbitrary partial refunds are not permitted. If approved by Admin, the
            entire Trainer Coaching Fee will be refunded to your source payment account. Platform
            fees remain retained.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="refund-reason"
              className="text-xs font-bold text-[var(--color-text-primary)]"
            >
              Detailed Reason for Service Failure
            </label>
            <textarea
              id="refund-reason"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please explain in detail why the coaching service was not delivered..."
              className="w-full px-4 py-3 rounded-xl text-xs bg-[var(--color-surface-subtle)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-emerald-500 text-[var(--color-text-primary)] resize-none"
              data-testid="refund-reason-input"
            />
            {validationError && (
              <p className="text-xs text-rose-500 font-medium" role="alert">
                {validationError}
              </p>
            )}
          </div>

          {requestRefundMutation.error && (
            <p className="text-xs text-rose-500 font-medium" role="alert">
              {requestRefundMutation.error.message || 'Failed to submit refund request.'}
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
            <button
              type="submit"
              disabled={requestRefundMutation.isPending}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
              data-testid="submit-refund-button"
            >
              {requestRefundMutation.isPending && (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              )}
              <span>Submit for Admin Review</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
