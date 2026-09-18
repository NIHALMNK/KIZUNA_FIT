'use client';

import React from 'react';
import Link from 'next/link';
import { ChangePasswordForm } from '../../../../../modules/identity/presentation/components/ChangePasswordForm';

export default function ChangePasswordPage() {
  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Back Link */}
      <Link
        href="/client/settings"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)] hover:underline"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Settings
      </Link>

      {/* Main Card */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--color-heading)] tracking-tight">
            Change Password
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
            Update your password to keep your KIZUNAFIT account secure.
          </p>
        </div>

        {/* Security Notice */}
        <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-amber-900 text-xs font-medium flex items-start gap-2.5">
          <svg className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            Changing your password will automatically sign out your account on all other active devices. You will need to log in again.
          </span>
        </div>

        {/* Change Password Form */}
        <ChangePasswordForm />
      </div>
    </div>
  );
}
