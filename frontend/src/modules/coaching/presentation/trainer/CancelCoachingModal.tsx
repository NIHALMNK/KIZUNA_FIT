'use client';

import React, { useState } from 'react';
import { useCancelCoachingRelationship } from '../../application/mutations/useCancelCoachingRelationship';

interface CancelCoachingModalProps {
  isOpen: boolean;
  relationshipId: string;
  clientName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CancelCoachingModal: React.FC<CancelCoachingModalProps> = ({
  isOpen,
  relationshipId,
  clientName,
  onClose,
  onSuccess,
}) => {
  const [reason, setReason] = useState('');
  const { mutate: cancelRelationship, isPending, error } = useCancelCoachingRelationship();

  if (!isOpen) return null;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    cancelRelationship(
      {
        relationshipId,
        payload: { reason: reason.trim() },
      },
      {
        onSuccess: () => {
          onSuccess?.();
          onClose();
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Cancel Coaching Program
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Terminate the active coaching agreement with{' '}
            <span className="font-semibold text-zinc-900 dark:text-zinc-200">{clientName}</span>.
          </p>
        </div>

        <form onSubmit={handleConfirm} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
              Cancellation Reason (Required)
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide a clear explanation for early termination..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg text-xs text-rose-700 dark:text-rose-300">
              {error.message || 'Failed to cancel coaching relationship.'}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isPending || !reason.trim()}
              className="px-4 py-2 text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              {isPending ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
