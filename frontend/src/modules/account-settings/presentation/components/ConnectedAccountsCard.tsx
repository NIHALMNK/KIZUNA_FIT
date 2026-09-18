'use client';

import React, { useState } from 'react';
import { useGetAuthProviders } from '../../application/hooks/useAccountSettings';
import { Button } from '../../../../shared/components/ui/Button';
import { GoogleAuthButton } from '../../../../shared/components/ui/GoogleAuthButton';
import { UnlinkGoogleDialog } from './UnlinkGoogleDialog';

export const ConnectedAccountsCard: React.FC = () => {
  const { data: providers = [], isLoading, isError, refetch } = useGetAuthProviders();
  const [isUnlinkDialogOpen, setIsUnlinkDialogOpen] = useState(false);

  const googleProvider = providers.find((p) => p.provider === 'GOOGLE');
  const isLinked = Boolean(googleProvider?.linked);
  const canUnlink = Boolean(googleProvider?.canUnlink);

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 transition-all">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)] block">
            INTEGRATIONS
          </span>
          <h2 className="text-lg font-extrabold text-[var(--color-heading)] tracking-tight">
            Connected Accounts
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)] font-normal">
            Third-party identity providers associated with your KIZUNAFIT account.
          </p>
        </div>
      </div>

      {isLoading ? (
        /* Loading Skeleton State */
        <div className="p-4 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)] animate-pulse flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--color-border)]" />
            <div className="space-y-2">
              <div className="h-4 w-24 bg-[var(--color-border)] rounded" />
              <div className="h-3 w-48 bg-[var(--color-border)]/60 rounded" />
            </div>
          </div>
          <div className="h-8 w-24 bg-[var(--color-border)] rounded-xl" />
        </div>
      ) : isError ? (
        /* Error Recovery State */
        <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 text-xs text-amber-800 flex items-center justify-between gap-3">
          <span>Unable to load connection status.</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="border-amber-300 text-amber-900 hover:bg-amber-100 text-xs py-1 rounded-lg font-bold shrink-0"
          >
            Retry
          </Button>
        </div>
      ) : (
        /* Connected / Not Connected View */
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)] gap-4 transition-all">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="p-2.5 rounded-xl bg-white border border-[var(--color-border)] shrink-0 shadow-2xs">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>

            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-[var(--color-heading)] block">
                  Google
                </span>
                {isLinked ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    Not connected
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[var(--color-text-secondary)]">
                {isLinked
                  ? 'Your Google account is connected to KIZUNAFIT.'
                  : 'Sign in with Google is available for your KIZUNAFIT account.'}
              </p>
            </div>
          </div>

          <div className="shrink-0 w-full sm:w-auto">
            {isLinked ? (
              canUnlink ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsUnlinkDialogOpen(true)}
                  className="border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] text-xs rounded-xl font-bold w-full sm:w-auto"
                >
                  Unlink
                </Button>
              ) : (
                <span className="inline-flex items-center text-[11px] font-bold text-[var(--color-text-muted)] bg-[var(--color-surface-alt)] border border-[var(--color-border)] px-3 py-1.5 rounded-xl">
                  Managed by account security
                </span>
              )
            ) : (
              <div className="w-full sm:w-48">
                <GoogleAuthButton />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Unlink Confirmation Dialog */}
      <UnlinkGoogleDialog
        isOpen={isUnlinkDialogOpen}
        onClose={() => setIsUnlinkDialogOpen(false)}
      />
    </div>
  );
};
