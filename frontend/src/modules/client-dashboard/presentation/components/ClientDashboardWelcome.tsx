'use client';

import { useAuthStore } from '../../../identity/application/store/authStore';
import { useGetClientProfile } from '../../../profile/presentation/hooks/useClientProfile';
import { Avatar } from '../../../../shared/components/ui/Avatar';

interface ClientDashboardWelcomeProps {
  hasActiveCoaching: boolean;
}

export const ClientDashboardWelcome: React.FC<ClientDashboardWelcomeProps> = ({ hasActiveCoaching }) => {
  const { user } = useAuthStore();
  const { data: profile } = useGetClientProfile(user?.role === 'CLIENT');

  const rawName = profile?.fullName || user?.email?.split('@')[0] || 'Client';
  const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const initials = rawName.substring(0, 2).toUpperCase();
  const avatarUrl = profile?.avatarUrl;

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-all">
      <div className="flex items-center gap-4">
        <Avatar
          src={avatarUrl || undefined}
          fallback={initials}
          size="lg"
          className="ring-2 ring-[var(--color-border)] shrink-0"
        />

        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              Welcome back
            </span>
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
              hasActiveCoaching
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-[var(--color-tag)] text-[var(--color-tag-text)] border-[var(--color-border)]'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${hasActiveCoaching ? 'bg-emerald-500 animate-pulse' : 'bg-[var(--color-primary)]'}`} />
              {hasActiveCoaching ? 'Coaching Active' : 'Exploring Coaches'}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--color-heading)] tracking-tight truncate">
            Good morning, {formattedName}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] font-normal leading-relaxed">
            Here's what's happening with your personalized coaching journey today.
          </p>
        </div>
      </div>
    </div>
  );
};
