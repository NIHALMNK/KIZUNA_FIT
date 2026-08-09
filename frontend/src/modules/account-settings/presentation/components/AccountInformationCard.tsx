'use client';

import React, { useState } from 'react';
import { UserAccountDetails } from '../../domain/types/accountSettings.types';
import { useUpdateUserAccount } from '../../application/hooks/useAccountSettings';
import { Input } from '../../../../shared/components/ui/Input';
import { Button } from '../../../../shared/components/ui/Button';

interface AccountInformationCardProps {
  account: UserAccountDetails;
}

export const AccountInformationCard: React.FC<AccountInformationCardProps> = ({ account }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(account.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(account.phoneNumber || '');

  const updateMutation = useUpdateUserAccount();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
      });
      setIsEditing(false);
    } catch {
      // Toast handles error
    }
  };

  const handleCancel = () => {
    setFullName(account.fullName || '');
    setPhoneNumber(account.phoneNumber || '');
    setIsEditing(false);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 transition-all">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)] block">
            IDENTITY
          </span>
          <h2 className="text-lg font-extrabold text-[var(--color-heading)] tracking-tight">
            Account Information
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)] font-normal">
            Personal identity details associated with your KIZUNAFIT profile.
          </p>
        </div>

        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] text-xs rounded-xl font-semibold"
          >
            Edit Info
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">
                Full Name
              </label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
                required
                className="text-xs rounded-xl bg-[var(--color-surface-alt)] border-[var(--color-border)]"
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="text-xs rounded-xl bg-[var(--color-surface-alt)] border-[var(--color-border)]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="border-[var(--color-border)] text-xs rounded-xl font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={updateMutation.isPending}
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs rounded-xl font-bold"
            >
              Save Changes
            </Button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)] space-y-1">
            <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block">
              Full Name
            </span>
            <p className="font-extrabold text-[var(--color-heading)] text-sm">{account.fullName || 'Client User'}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)] space-y-1">
            <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block">
              Email Address
            </span>
            <div className="flex items-center gap-1.5 min-w-0">
              <p className="font-extrabold text-[var(--color-heading)] text-sm truncate">{account.email}</p>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                ✓ Verified
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)] space-y-1">
            <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block">
              Phone Number
            </span>
            <p className="font-extrabold text-[var(--color-heading)] text-sm">
              {account.phoneNumber || 'Not provided'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)] space-y-1">
            <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block">
              Account Type
            </span>
            <p className="font-extrabold text-[var(--color-heading)] text-sm">CLIENT</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)] space-y-1">
            <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block">
              Account Status
            </span>
            <p className="font-extrabold text-emerald-600 text-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Active
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)] space-y-1">
            <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block">
              Member Since
            </span>
            <p className="font-extrabold text-[var(--color-heading)] text-sm">{formatDate(account.createdAt)}</p>
          </div>
        </div>
      )}
    </div>
  );
};
