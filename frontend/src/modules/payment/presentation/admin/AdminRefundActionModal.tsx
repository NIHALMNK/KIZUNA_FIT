'use client';

import React, { useState } from 'react';
import {
  useReviewRefund,
  useApproveRefund,
  useRejectRefund,
  useProcessApprovedRefund,
} from '../../application/mutations/useRefundMutations';
import { PaymentRefund, RefundStatus } from '../../domain/types/refund.types';
import { X, Loader2, CheckCircle2, XCircle, Clock, Send } from 'lucide-react';

interface AdminRefundActionModalProps {
  paymentId: string;
  refund: PaymentRefund;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AdminRefundActionModal: React.FC<AdminRefundActionModalProps> = ({
  paymentId,
  refund,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [adminNotes, setAdminNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const reviewMutation = useReviewRefund();
  const approveMutation = useApproveRefund();
  const rejectMutation = useRejectRefund();
  const processMutation = useProcessApprovedRefund();

  if (!isOpen) return null;

  const isPending =
    reviewMutation.isPending ||
    approveMutation.isPending ||
    rejectMutation.isPending ||
    processMutation.isPending;

  const handleReview = async () => {
    try {
      setErrorMessage('');
      await reviewMutation.mutateAsync({
        paymentId,
        refundId: refund.refundId,
        payload: { adminNotes: adminNotes.trim() || undefined },
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update refund status.');
    }
  };

  const handleApprove = async () => {
    try {
      setErrorMessage('');
      await approveMutation.mutateAsync({
        paymentId,
        refundId: refund.refundId,
        payload: { adminNotes: adminNotes.trim() || undefined },
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to approve refund.');
    }
  };

  const handleReject = async () => {
    if (!adminNotes.trim()) {
      setErrorMessage('Admin notes explaining rejection reason are required.');
      return;
    }
    try {
      setErrorMessage('');
      await rejectMutation.mutateAsync({
        paymentId,
        refundId: refund.refundId,
        payload: { adminNotes: adminNotes.trim() },
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to reject refund.');
    }
  };

  const handleProcess = async () => {
    try {
      setErrorMessage('');
      await processMutation.mutateAsync({
        paymentId,
        refundId: refund.refundId,
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to dispatch refund to gateway.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      data-testid="admin-refund-action-modal"
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
            REFUND ID: {refund.refundId}
          </span>
          <h2 className="text-lg font-extrabold text-[var(--color-text-primary)] mt-1">
            Admin Refund Action Panel
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Current Status:{' '}
            <span className="font-bold text-[var(--color-text-primary)]">{refund.status}</span>
          </p>
        </div>

        <div className="bg-[var(--color-surface-subtle)] p-4 rounded-xl text-xs space-y-1.5 border border-[var(--color-border)]">
          <p>
            Client Reason:{' '}
            <span className="text-[var(--color-text-primary)] font-medium">{refund.reason}</span>
          </p>
          <p>
            Refund Target:{' '}
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              ₹{refund.amount}
            </span>{' '}
            (Full Trainer Fee)
          </p>
          <p>
            Policy: <span className="text-zinc-500">Platform fee is non-refundable.</span>
          </p>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="admin-notes"
            className="text-xs font-bold text-[var(--color-text-primary)]"
          >
            Admin Notes
          </label>
          <textarea
            id="admin-notes"
            rows={3}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Administrative review rationale..."
            className="w-full px-4 py-2.5 rounded-xl text-xs bg-[var(--color-surface-subtle)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-emerald-500 text-[var(--color-text-primary)] resize-none"
            data-testid="admin-notes-input"
          />
        </div>

        {errorMessage && (
          <p className="text-xs text-rose-500 font-medium" role="alert">
            {errorMessage}
          </p>
        )}

        <div className="grid grid-cols-2 gap-2.5 pt-2">
          {refund.status === RefundStatus.PENDING && (
            <button
              type="button"
              onClick={handleReview}
              disabled={isPending}
              className="py-2.5 px-3 rounded-xl text-xs font-bold text-blue-600 bg-blue-500/10 hover:bg-blue-500/20 transition-colors inline-flex items-center justify-center gap-1.5"
              data-testid="btn-mark-under-review"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Mark Under Review</span>
            </button>
          )}

          {(refund.status === RefundStatus.PENDING ||
            refund.status === RefundStatus.UNDER_REVIEW) && (
            <>
              <button
                type="button"
                onClick={handleApprove}
                disabled={isPending}
                className="py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors inline-flex items-center justify-center gap-1.5"
                data-testid="btn-approve-refund"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve Full Refund</span>
              </button>

              <button
                type="button"
                onClick={handleReject}
                disabled={isPending}
                className="py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors inline-flex items-center justify-center gap-1.5"
                data-testid="btn-reject-refund"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject Refund</span>
              </button>
            </>
          )}

          {refund.status === RefundStatus.APPROVED && (
            <button
              type="button"
              onClick={handleProcess}
              disabled={isPending}
              className="col-span-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors inline-flex items-center justify-center gap-1.5 shadow-lg"
              data-testid="btn-process-refund"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Gateway Refund</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
