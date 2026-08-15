'use client';

import React, { useState } from 'react';
import { useDeleteAccount } from '../../application/hooks/useAccountSettings';
import { Dialog } from '../../../../shared/components/ui/Dialog';
import { Button } from '../../../../shared/components/ui/Button';
import { Input } from '../../../../shared/components/ui/Input';

interface DeleteAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteAccountDialog: React.FC<DeleteAccountDialogProps> = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const deleteMutation = useDeleteAccount();

  const isConfirmDisabled = confirmText.trim().toUpperCase() !== 'DELETE';

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isConfirmDisabled) return;

    try {
      await deleteMutation.mutateAsync({ password: password || undefined });
      onClose();
    } catch {
      // Toast handles error
    }
  };

  const handleClose = () => {
    setPassword('');
    setConfirmText('');
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} title="Delete KIZUNAFIT Account?">
      <form onSubmit={handleDelete} className="space-y-4 pt-2">
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs leading-relaxed space-y-1">
          <p className="font-extrabold text-red-700">Warning: This action is permanent and cannot be undone.</p>
          <p>
            Your profile data, workout progress, and access will be permanently deleted. Active coaching relationships or pending payments may prevent account deletion.
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">
              Current Password (Optional if Google login)
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter current password to verify identity"
              className="text-xs rounded-xl bg-[var(--color-surface-alt)] border-[var(--color-border)]"
            />
          </div>

          <div>
            <label htmlFor="confirmText" className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">
              Type <span className="font-extrabold text-red-600">DELETE</span> to confirm
            </label>
            <Input
              id="confirmText"
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE"
              required
              className="text-xs rounded-xl bg-[var(--color-surface-alt)] border-[var(--color-border)]"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClose}
            className="border-[var(--color-border)] text-xs rounded-xl font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isConfirmDisabled}
            isLoading={deleteMutation.isPending}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs rounded-xl font-bold"
          >
            Permanently Delete Account
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
