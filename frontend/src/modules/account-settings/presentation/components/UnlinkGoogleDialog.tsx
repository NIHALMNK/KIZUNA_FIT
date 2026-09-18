'use client';

import React from 'react';
import { useUnlinkGoogle } from '../../application/hooks/useAccountSettings';
import { Dialog } from '../../../../shared/components/ui/Dialog';
import { Button } from '../../../../shared/components/ui/Button';

interface UnlinkGoogleDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UnlinkGoogleDialog: React.FC<UnlinkGoogleDialogProps> = ({ isOpen, onClose }) => {
  const unlinkMutation = useUnlinkGoogle();

  const handleUnlink = async () => {
    try {
      await unlinkMutation.mutateAsync();
      onClose();
    } catch {
      // Toast handles error
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Unlink Google account?">
      <div className="space-y-4 pt-2">
        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
          Your Google account will no longer be connected to KIZUNAFIT. You can connect it again later.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-[var(--color-border)] text-xs rounded-xl font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleUnlink}
            isLoading={unlinkMutation.isPending}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs rounded-xl font-bold"
          >
            Unlink Google
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
