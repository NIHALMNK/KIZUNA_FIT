'use client';

import React, { useState } from 'react';
import { useGetUserSessions, useLogoutAllSessions } from '../../application/hooks/useAccountSettings';
import { Button } from '../../../../shared/components/ui/Button';
import { Dialog } from '../../../../shared/components/ui/Dialog';

export const ActiveSessionsCard: React.FC = () => {
  const { data: sessions = [], isLoading, isError, refetch } = useGetUserSessions();
  const logoutAllMutation = useLogoutAllSessions();
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  const handleSignOutAll = async () => {
    try {
      await logoutAllMutation.mutateAsync();
      setIsSignOutModalOpen(false);
    } catch {
      // Toast handles error
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Active now';
    try {
      return new Date(dateStr).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
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
            DEVICES
          </span>
          <h2 className="text-lg font-extrabold text-[var(--color-heading)] tracking-tight">
            Active Sessions
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)] font-normal">
            Devices currently logged into your KIZUNAFIT account.
          </p>
        </div>

        {sessions.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSignOutModalOpen(true)}
            className="border-amber-300 text-amber-900 hover:bg-amber-50 text-xs rounded-xl font-bold"
          >
            Sign Out Everywhere
          </Button>
        )}
      </div>

      {isLoading ? (
        /* Loading Skeleton State */
        <div className="space-y-3">
          <div className="h-16 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl animate-pulse" />
          <div className="h-16 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl animate-pulse" />
        </div>
      ) : isError ? (
        /* Section-level Error Recovery */
        <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 text-xs text-amber-800 flex items-center justify-between gap-3">
          <span>Unable to load active sessions.</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="border-amber-300 text-amber-900 hover:bg-amber-100 text-xs py-1 rounded-lg font-bold shrink-0"
          >
            Retry
          </Button>
        </div>
      ) : sessions.length === 0 ? (
        /* Empty State */
        <div className="p-6 text-center rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)]">
          <p className="text-xs text-[var(--color-text-secondary)] font-medium">No active sessions found.</p>
        </div>
      ) : (
        /* Active Sessions List */
        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.sessionId}
              className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)] gap-4 transition-all"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="p-2.5 rounded-xl bg-white border border-[var(--color-border)] text-[var(--color-text-secondary)] shrink-0 shadow-2xs">
                  {session.deviceType === 'mobile' ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>

                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-[var(--color-heading)] block truncate">
                      {session.deviceName} ({session.browser})
                    </span>
                    {session.currentSession && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Current Device
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--color-text-secondary)]">
                    {session.operatingSystem} • {session.ipAddress} • {formatDate(session.lastActiveAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sign Out Everywhere Confirmation Modal */}
      <Dialog
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        title="Sign out of all devices?"
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            This action will log your account out of all active browsers and mobile devices. You will need to log in again.
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsSignOutModalOpen(false)}
              className="border-[var(--color-border)] text-xs rounded-xl font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSignOutAll}
              isLoading={logoutAllMutation.isPending}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs rounded-xl font-bold"
            >
              Sign Out Everywhere
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
