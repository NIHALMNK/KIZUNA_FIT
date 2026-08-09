'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  useGetClientProfile,
  useUploadClientAvatar,
  useDeleteClientAvatar,
} from '../../../modules/profile/presentation/hooks/useClientProfile';
import {
  formatGender,
  formatActivityLevel,
  formatExperienceLevel,
  formatFitnessGoal,
} from '../../../modules/profile/presentation/utils/profileMappers';

import { Avatar } from '../../../shared/components/ui/Avatar';
import { Button } from '../../../shared/components/ui/Button';
import { ClientAvatarDialog } from '../../../modules/profile/presentation/components/ClientAvatarDialog';
import { EmptyState } from '../../../shared/components/feedback/EmptyState';
import { ErrorState } from '../../../shared/components/feedback/ErrorState';
import { mapApiError } from '../../../shared/utils/errorMapper';
import { useAuthStore } from '../../../modules/identity/application/store/authStore';

export default function ClientProfilePage() {
  const { user } = useAuthStore();
  const { data: profile, isLoading, isError, error, refetch } = useGetClientProfile();
  const uploadAvatarMutation = useUploadClientAvatar();
  const deleteAvatarMutation = useDeleteClientAvatar();

  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);

  // Skeleton loading state
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse" aria-label="Loading profile">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-7 h-44" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 h-56" />
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 h-56" />
        </div>
      </div>
    );
  }

  // 404 / Missing Profile Handling -> Guided Onboarding CTA
  if (isError) {
    const mapped = mapApiError(error);
    if (mapped.isNotFound || (error as any)?.status === 404) {
      return (
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-8 sm:p-12 text-center space-y-6 max-w-2xl mx-auto shadow-xs">
          <EmptyState
            title="Complete your fitness profile"
            description="Set up your physical details, fitness preferences, and health goals to personalize your KIZUNAFIT coaching experience."
            action={
              <Link href="/profile/client/create">
                <Button
                  variant="primary"
                  size="md"
                  className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold rounded-xl shadow-xs"
                >
                  Complete Profile
                </Button>
              </Link>
            }
          />
        </div>
      );
    }

    return <ErrorState error={error} onRetry={refetch} />;
  }

  if (!profile) {
    return (
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-8 text-center space-y-4 max-w-xl mx-auto">
        <h2 className="text-xl font-extrabold text-[var(--color-heading)]">Complete your fitness profile</h2>
        <p className="text-xs text-[var(--color-text-secondary)]">Set up your profile to unlock fitness features.</p>
        <Link href="/profile/client/create">
          <Button variant="primary" size="md" className="bg-[var(--color-primary)] text-white font-bold rounded-xl">
            Complete Profile
          </Button>
        </Link>
      </div>
    );
  }

  const rawName = profile.fullName || user?.email?.split('@')[0] || 'Client User';
  const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const initials = rawName.substring(0, 2).toUpperCase();

  const formattedDob = profile.dateOfBirth
    ? new Date(profile.dateOfBirth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null;

  const memberSince = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;

  const locationStr = [profile.city, profile.state, profile.country].filter(Boolean).join(', ');

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-[var(--color-heading)] tracking-tight">Profile</h1>
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] font-normal">
          Manage your personal information, fitness profile, and account identity.
        </p>
      </div>

      {/* Profile Hero / Identity Card */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <Avatar
              src={profile.avatarUrl || undefined}
              fallback={initials}
              size="xl"
              className="ring-4 ring-[var(--color-border)] shrink-0 shadow-md"
            />
            <button
              type="button"
              onClick={() => setIsAvatarDialogOpen(true)}
              className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:text-[var(--color-primary)] border border-[var(--color-border)] shadow-md transition-all focus:outline-none cursor-pointer"
              title="Change Photo"
              aria-label="Change photo"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--color-heading)] truncate capitalize">
                {displayName}
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-[var(--color-tag)] text-[var(--color-tag-text)] border border-[var(--color-border)]">
                CLIENT
              </span>
            </div>
            {memberSince && (
              <p className="text-xs text-[var(--color-text-muted)] font-medium">Member since {memberSince}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsAvatarDialogOpen(true)}
            className="border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)] font-semibold rounded-xl text-xs"
          >
            {profile.avatarUrl ? 'Change Photo' : 'Add Photo'}
          </Button>
          <Link href="/profile/client/edit" className="flex-1 md:flex-initial">
            <Button
              variant="primary"
              size="md"
              fullWidth
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold rounded-xl text-xs"
            >
              Edit Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Two-Column Workspace Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details Card */}
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-xs space-y-4">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)] block">
            PERSONAL DETAILS
          </span>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase">Date of Birth</span>
              <span className="font-semibold text-[var(--color-text-primary)]">{formattedDob || 'Not specified'}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase">Gender</span>
              <span className="font-semibold text-[var(--color-text-primary)]">{formatGender(profile.gender)}</span>
            </div>
            {locationStr && (
              <div>
                <span className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase">Location</span>
                <span className="font-semibold text-[var(--color-text-primary)]">{locationStr}</span>
              </div>
            )}
            {profile.timezone && (
              <div>
                <span className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase">Timezone</span>
                <span className="font-semibold text-[var(--color-text-primary)]">{profile.timezone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Fitness Profile Card */}
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-xs space-y-4">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)] block">
            FITNESS PROFILE
          </span>
          <div className="space-y-3 text-xs">
            <div>
              <span className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase mb-1">Fitness Goals</span>
              {profile.fitnessGoals && profile.fitnessGoals.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {profile.fitnessGoals.map((g) => (
                    <span key={g} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[var(--color-tag)] text-[var(--color-tag-text)] border border-[var(--color-border)]">
                      {formatFitnessGoal(g)}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-[var(--color-text-muted)] italic">No goals specified</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <span className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase">Activity Level</span>
                <span className="font-semibold text-[var(--color-text-primary)]">{formatActivityLevel(profile.activityLevel)}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase">Experience Level</span>
                <span className="font-semibold text-[var(--color-text-primary)]">{formatExperienceLevel(profile.experienceLevel)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Body Metrics Card */}
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-xs space-y-4">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)] block">
            BODY METRICS
          </span>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase">Height</span>
              <span className="font-extrabold text-base text-[var(--color-heading)]">
                {profile.height ? `${profile.height.value} ${profile.height.unit || 'cm'}` : 'Not added'}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase">Weight</span>
              <span className="font-extrabold text-base text-[var(--color-heading)]">
                {profile.weight ? `${profile.weight.value} ${profile.weight.unit || 'kg'}` : 'Not added'}
              </span>
            </div>
          </div>
        </div>

        {/* About You / Bio Section */}
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-xs space-y-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)] block">
            ABOUT YOU
          </span>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            {profile.bio ? profile.bio : (
              <span className="text-[var(--color-text-muted)] italic">No bio added yet.</span>
            )}
          </p>
        </div>
      </div>

      {/* Health Information (Discreet & Sensitive) */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)]">
            HEALTH INFORMATION
          </span>
          <span className="text-[10px] text-[var(--color-text-muted)] font-medium">Private to you and your coach</span>
        </div>
        <p className="text-xs text-[var(--color-text-secondary)]">
          {profile.medicalNotes ? profile.medicalNotes : 'No health conditions added.'}
        </p>
      </div>

      {/* Avatar Dialog */}
      <ClientAvatarDialog
        isOpen={isAvatarDialogOpen}
        onClose={() => setIsAvatarDialogOpen(false)}
        currentAvatarUrl={profile.avatarUrl}
        initials={initials}
        onUpload={async (file) => {
          await uploadAvatarMutation.mutateAsync(file);
        }}
        onDelete={async () => {
          await deleteAvatarMutation.mutateAsync();
        }}
        isUploading={uploadAvatarMutation.isPending}
        isDeleting={deleteAvatarMutation.isPending}
      />
    </div>
  );
}
