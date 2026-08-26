'use client';

import React, { useState } from 'react';
import {
  useInvestigateDispute,
  useResolveDispute,
  useCloseDispute,
} from '../../application/mutations/useDisputeMutations';
import { PaymentDispute, DisputeStatus } from '../../domain/types/dispute.types';
import { X, Loader2, Search, CheckCircle2, ShieldCheck } from 'lucide-react';

interface AdminDisputeActionModalProps {
  paymentId: string;
  dispute: PaymentDispute;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AdminDisputeActionModal: React.FC<AdminDisputeActionModalProps> = ({
  paymentId,
  dispute,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const investigateMutation = useInvestigateDispute();
  const resolveMutation = useResolveDispute();
  const closeMutation = useCloseDispute();

  if (!isOpen) return null;

  const isPending =
    investigateMutation.isPending || resolveMutation.isPending || closeMutation.isPending;

  const handleInvestigate = async () => {
    try {
      setErrorMessage('');
      await investigateMutation.mutateAsync({
        paymentId,
        disputeId: dispute.disputeId,
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to start investigation.');
    }
  };

  const handleResolve = async () => {
    if (!resolutionNotes.trim()) {
      setErrorMessage('Resolution notes are required to resolve a dispute.');
      return;
    }
    try {
      setErrorMessage('');
      await resolveMutation.mutateAsync({
        paymentId,
        disputeId: dispute.disputeId,
        payload: { resolutionNotes: resolutionNotes.trim() },
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resolve dispute.');
    }
  };

  const handleClose = async () => {
    try {
      setErrorMessage('');
      await closeMutation.mutateAsync({
        paymentId,
        disputeId: dispute.disputeId,
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to close dispute.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      data-testid="admin-dispute-action-modal"
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
            DISPUTE ID: {dispute.disputeId}
          </span>
          <h2 className="text-lg font-extrabold text-[var(--color-text-primary)] mt-1">
            Admin Dispute Investigation Panel
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Current Status:{' '}
            <span className="font-bold text-[var(--color-text-primary)]">{dispute.status}</span>
          </p>
        </div>

        <div className="bg-[var(--color-surface-subtle)] p-4 rounded-xl text-xs space-y-1.5 border border-[var(--color-border)]">
          <p>
            Raised By:{' '}
            <span className="text-[var(--color-text-primary)] font-mono">{dispute.raisedBy}</span>
          </p>
          <p>
            Reason:{' '}
            <span className="text-[var(--color-text-primary)] font-medium">{dispute.reason}</span>
          </p>
          {dispute.evidence && (
            <p>
              Evidence: <span className="text-[var(--color-text-primary)]">{dispute.evidence}</span>
            </p>
          )}
        </div>

        {(dispute.status === DisputeStatus.OPEN ||
          dispute.status === DisputeStatus.UNDER_INVESTIGATION) && (
          <div className="space-y-1.5">
            <label
              htmlFor="resolution-notes"
              className="text-xs font-bold text-[var(--color-text-primary)]"
            >
              Resolution Notes
            </label>
            <textarea
              id="resolution-notes"
              rows={3}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="Summary of investigation findings and resolution decision..."
              className="w-full px-4 py-2.5 rounded-xl text-xs bg-[var(--color-surface-subtle)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-emerald-500 text-[var(--color-text-primary)] resize-none"
              data-testid="resolution-notes-input"
            />
          </div>
        )}

        {errorMessage && (
          <p className="text-xs text-rose-500 font-medium" role="alert">
            {errorMessage}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
          {dispute.status === DisputeStatus.OPEN && (
            <button
              type="button"
              onClick={handleInvestigate}
              disabled={isPending}
              className="py-2.5 px-4 rounded-xl text-xs font-bold text-amber-600 bg-amber-500/10 hover:bg-amber-500/20 transition-colors inline-flex items-center gap-1.5"
              data-testid="btn-investigate-dispute"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Mark Under Investigation</span>
            </button>
          )}

          {(dispute.status === DisputeStatus.OPEN ||
            dispute.status === DisputeStatus.UNDER_INVESTIGATION) && (
            <button
              type="button"
              onClick={handleResolve}
              disabled={isPending}
              className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors inline-flex items-center gap-1.5 shadow-md"
              data-testid="btn-resolve-dispute"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Resolve Dispute</span>
            </button>
          )}

          {dispute.status === DisputeStatus.RESOLVED && (
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600 transition-colors inline-flex items-center gap-1.5"
              data-testid="btn-close-dispute"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Close Dispute & Unfreeze Payout</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
