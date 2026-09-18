'use client';

import React from 'react';
import { useGetUserAccount } from '../../../../modules/account-settings/application/hooks/useAccountSettings';
import { AccountInformationCard } from '../../../../modules/account-settings/presentation/components/AccountInformationCard';
import { SecurityCard } from '../../../../modules/account-settings/presentation/components/SecurityCard';
import { ActiveSessionsCard } from '../../../../modules/account-settings/presentation/components/ActiveSessionsCard';
import { ConnectedAccountsCard } from '../../../../modules/account-settings/presentation/components/ConnectedAccountsCard';
import { DangerZoneCard } from '../../../../modules/account-settings/presentation/components/DangerZoneCard';
import { SettingsSkeleton } from '../../../../modules/account-settings/presentation/components/SettingsSkeleton';
import { useAuthStore } from '../../../../modules/identity/application/store/authStore';

export default function ClientSettingsPage() {
  const { data: account, isLoading } = useGetUserAccount();
  const user = useAuthStore((state) => state.user);

  // Fallback details if account endpoint returns partial data
  const safeAccount = account || {
    id: user?.id || '',
    email: user?.email || '',
    fullName: user?.email?.split('@')[0] || 'Client User',
    phoneNumber: null,
    role: (user?.role || 'CLIENT') as 'CLIENT' | 'TRAINER' | 'ADMIN',
    emailVerified: true,
    accountStatus: 'ACTIVE' as const,
    createdAt: new Date().toISOString(),
  };

  if (isLoading && !account) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-[var(--color-heading)] tracking-tight">
          Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] font-normal">
          Manage your account identity, security preferences, and active sessions.
        </p>
      </div>

      {/* Account Information Section */}
      <AccountInformationCard account={safeAccount} />

      {/* Security & Password Section */}
      <SecurityCard />

      {/* Active Sessions Section */}
      <ActiveSessionsCard />

      {/* Connected Accounts Section */}
      <ConnectedAccountsCard />

      {/* Danger Zone Section */}
      <DangerZoneCard />
    </div>
  );
}
