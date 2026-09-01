'use client';

import React from 'react';
import { useCompleteCoachingRelationship } from '../../application/mutations/useCompleteCoachingRelationship';

interface CompleteProgramModalProps {
  isOpen: boolean;
  relationshipId: string;
  clientName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CompleteProgramModal: React.FC<CompleteProgramModalProps> = ({
  isOpen,
  relationshipId,
  clientName,
  onClose,
  onSuccess,
}) => {
  const { mutate: completeRelationship, isPending, error } = useCompleteCoachingRelationship();

  if (!isOpen) return null;

  const handleConfirm = () => {
    completeRelationship(relationshipId, {
      onSuccess: () => {
        onSuccess?.();
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Complete Coaching Program
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Are you sure you want to mark the coaching program with{' '}
            <span className="font-semibold text-zinc-900 dark:text-zinc-200">{clientName}</span> as
            completed?
          </p>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-lg text-xs text-blue-700 dark:text-blue-300">
            Completing this program unlocks client reviews and triggers the escrow payout timer in
            the Payment Domain.
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg text-xs text-rose-700 dark:text-rose-300">
            {error.message || 'Failed to complete coaching relationship.'}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            {isPending ? 'Completing...' : 'Yes, Complete Program'}
          </button>
        </div>
      </div>
    </div>
  );
};
