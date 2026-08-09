'use client';

import React, { useState } from 'react';
import { Button } from '../../../../shared/components/ui/Button';
import { DeleteAccountDialog } from './DeleteAccountDialog';

export const DangerZoneCard: React.FC = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <div className="bg-[var(--color-card)] border border-red-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 transition-all">
      <div className="flex items-center justify-between border-b border-red-100 pb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-600 block">
            DANGER ZONE
          </span>
          <h2 className="text-lg font-extrabold text-[var(--color-heading)] tracking-tight">
            Delete KIZUNAFIT Account
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)] font-normal">
            Permanently erase your client profile, preferences, and account access.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-red-50/40 border border-red-200/60 gap-4 transition-all">
        <div className="space-y-0.5">
          <span className="font-extrabold text-sm text-red-900 block">Delete Account</span>
          <p className="text-[11px] text-red-700/80">
            Once deleted, your account cannot be recovered.
          </p>
        </div>

        <div className="shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="border-red-300 text-red-700 hover:bg-red-100 text-xs rounded-xl font-extrabold w-full sm:w-auto"
          >
            Delete Account
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteAccountDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
};
