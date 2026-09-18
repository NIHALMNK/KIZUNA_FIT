'use client';

import React, { useState } from 'react';
import { useRaiseDispute } from '../../application/mutations/useDisputeMutations';
import { ShieldAlert, X, Loader2 } from 'lucide-react';

interface RaiseDisputeModalProps {
  paymentId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RaiseDisputeModal: React.FC<RaiseDisputeModalProps> = ({
  paymentId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [reason, setReason] = useState('');
  const [evidence, setEvidence] = useState('');
  const [validationError, setValidationError] = useState('');
  const raiseDisputeMutation = useRaiseDispute();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || reason.trim().length < 5) {
      setValidationError(
        'Please provide a specific reason for the dispute (minimum 5 characters).',
      );
      return;
    }

    try {
      setValidationError('');
      await raiseDisputeMutation.mutateAsync({
        paymentId,
        payload: {
          reason: reason.trim(),
          evidence: evidence.trim() || undefined,
        },
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
      data-testid="raise-dispute-modal"
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
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[var(--color-text-primary)]">
              Raise Payment Dispute
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
              Raising a dispute will immediately place the trainer payout on hold pending
              administrative investigation.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="dispute-reason"
              className="text-xs font-bold text-[var(--color-text-primary)]"
            >
              Dispute Reason
            </label>
            <textarea
              id="dispute-reason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State the core issue or disagreement..."
              className="w-full px-4 py-3 rounded-xl text-xs bg-[var(--color-surface-subtle)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-amber-500 text-[var(--color-text-primary)] resize-none"
              data-testid="dispute-reason-input"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="dispute-evidence"
              className="text-xs font-bold text-[var(--color-text-primary)]"
            >
              Supporting Evidence / Notes (Optional)
            </label>
            <input
              id="dispute-evidence"
              type="text"
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              placeholder="Links to logs, messages, or reference notes"
              className="w-full px-4 py-2.5 rounded-xl text-xs bg-[var(--color-surface-subtle)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-amber-500 text-[var(--color-text-primary)]"
              data-testid="dispute-evidence-input"
            />
          </div>

          {validationError && (
            <p className="text-xs text-rose-500 font-medium" role="alert">
              {validationError}
            </p>
          )}

          {raiseDisputeMutation.error && (
            <p className="text-xs text-rose-500 font-medium" role="alert">
              {raiseDisputeMutation.error.message || 'Failed to raise dispute.'}
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
              disabled={raiseDisputeMutation.isPending}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
              data-testid="submit-dispute-button"
            >
              {raiseDisputeMutation.isPending && (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              )}
              <span>Submit Dispute</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
