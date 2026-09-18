'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '../../../modules/identity/application/store/authStore';
import { useGetTrainerProfile } from '../../../modules/profile/presentation/hooks/useTrainerProfile';

export default function TrainerDashboardPage() {
  const { user } = useAuthStore();
  const { data: profile } = useGetTrainerProfile();

  const name = user?.email?.split('@')[0] || 'Coach';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--color-tag)] text-[var(--color-tag-text)] border border-[var(--color-border)] uppercase tracking-wider">
            Trainer Portal
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-heading)] tracking-tight mt-2 capitalize">
            Welcome back, {name}
          </h2>
          <p className="text-sm font-medium text-[var(--color-text-secondary)] mt-1">
            {profile?.headline || 'Manage your coaching profile, availability, and certifications.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/profile/trainer"
            className="px-4 py-2.5 rounded-xl bg-[var(--color-primary)] text-white font-bold text-xs hover:bg-[var(--color-primary-hover)] transition-colors shadow-xs"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
