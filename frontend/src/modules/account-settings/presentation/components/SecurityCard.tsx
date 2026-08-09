'use client';

import React from 'react';
import Link from 'next/link';

interface SecurityCardProps {
  changePasswordHref?: string;
}

export const SecurityCard: React.FC<SecurityCardProps> = ({
  changePasswordHref = '/client/settings/change-password',
}) => {
  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 transition-all">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)] block">
            SECURITY
          </span>
          <h2 className="text-lg font-extrabold text-[var(--color-heading)] tracking-tight">
            Security & Authentication
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)] font-normal">
            Manage your account password and security credentials.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)] gap-4 transition-all">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-white border border-[var(--color-border)] text-[var(--color-primary)] shrink-0 shadow-2xs">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <div className="space-y-0.5">
            <span className="font-extrabold text-sm text-[var(--color-heading)] block">
              Account Password
            </span>
            <p className="text-[11px] text-[var(--color-text-secondary)]">
              Changing your password will sign out your account on all other active devices.
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <Link
            href={changePasswordHref}
            className="inline-flex items-center justify-center h-9 px-4 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-bold transition-colors shadow-2xs w-full sm:w-auto"
          >
            Change Password
          </Link>
        </div>
      </div>
    </div>
  );
};
