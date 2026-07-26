'use client';

import React from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/shared/components/guards/AuthGuard';
import { RoleGuard } from '@/shared/components/guards/RoleGuard';
import { Permission } from '@/shared/components/navigation/permissions';
import { ROUTES } from '@/shared/constants/routes';
import { useGetClientProfile, useUploadClientAvatar, useDeleteClientAvatar } from '@/modules/profile/presentation/hooks/useClientProfile';
import { PageHeader } from '@/modules/profile/presentation/components/PageHeader';
import { SectionCard } from '@/modules/profile/presentation/components/SectionCard';
import { InfoCard } from '@/modules/profile/presentation/components/InfoCard';
import { AvatarUploader } from '@/modules/profile/presentation/components/AvatarUploader';
import { ProfileCompletionCard } from '@/modules/profile/presentation/components/ProfileCompletionCard';
import { LoadingState } from '@/shared/components/feedback/LoadingState';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { mapApiError } from '@/shared/utils/errorMapper';

function ClientProfileContent() {
  const { data: profile, isLoading, isError, error, refetch } = useGetClientProfile();
  const uploadAvatarMutation = useUploadClientAvatar();
  const deleteAvatarMutation = useDeleteClientAvatar();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-12">
        <PageHeader title="Client Profile" role="CLIENT" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <LoadingState message="Loading client profile data..." />
        </div>
      </div>
    );
  }

  // Differentiate 404 (Not Created) from 500/Connection Error
  if (isError) {
    const mapped = mapApiError(error);

    if (mapped.isNotFound) {
      return (
        <div className="min-h-screen bg-gray-50 pb-12">
          <PageHeader title="Client Profile" role="CLIENT" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <EmptyState
              title="You haven't created your client profile yet"
              description="Set up your physical details, health metrics, and fitness preferences to get matched with coaches."
              action={
                <Link
                  href={ROUTES.CLIENT_PROFILE_CREATE}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  Create Client Profile
                </Link>
              }
            />
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 pb-12">
        <PageHeader title="Client Profile" role="CLIENT" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <ErrorState error={error} onRetry={refetch} />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 pb-12">
        <PageHeader title="Client Profile" role="CLIENT" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <EmptyState
            title="You haven't created your client profile yet"
            description="Set up your client details to unlock fitness features."
            action={
              <Link
                href={ROUTES.CLIENT_PROFILE_CREATE}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                Create Client Profile
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <PageHeader
        title={profile.fullName}
        subtitle="Manage your personal health details, goals, and measurements"
        role="CLIENT"
        action={
          <Link
            href={ROUTES.CLIENT_PROFILE_EDIT}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Edit Profile
          </Link>
        }
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <ProfileCompletionCard completed={profile.profileCompleted} role="CLIENT" />

        <AvatarUploader
          currentAvatarUrl={profile.avatarUrl}
          onUpload={async (file) => {
            await uploadAvatarMutation.mutateAsync(file);
          }}
          onDelete={async () => {
            await deleteAvatarMutation.mutateAsync();
          }}
          isLoading={uploadAvatarMutation.isPending || deleteAvatarMutation.isPending}
          role="CLIENT"
        />

        <SectionCard title="Personal Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoCard label="Full Name" value={profile.fullName} />
            <InfoCard label="Gender" value={profile.gender} />
            <InfoCard
              label="Date of Birth"
              value={profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : null}
            />
            <InfoCard label="Phone Number" value={profile.phoneNumber} />
            <InfoCard label="Location" value={[profile.city, profile.state, profile.country].filter(Boolean).join(', ')} />
            <InfoCard label="Timezone" value={profile.timezone} />
          </div>
        </SectionCard>

        <SectionCard title="Health & Physical Metrics">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <InfoCard
              label="Weight"
              value={profile.weight ? `${profile.weight.value} ${profile.weight.unit}` : null}
            />
            <InfoCard
              label="Height"
              value={profile.height ? `${profile.height.value} ${profile.height.unit}` : null}
            />
            <InfoCard label="Experience Level" value={profile.experienceLevel} />
            <InfoCard label="Activity Level" value={profile.activityLevel} />
          </div>
          <InfoCard label="Medical Notes & Injuries" value={profile.medicalNotes} />
        </SectionCard>

        <SectionCard title="Goals & Dietary Preferences">
          <div className="space-y-4">
            <div>
              <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Fitness Goals
              </span>
              {profile.fitnessGoals.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.fitnessGoals.map((goal) => (
                    <span key={goal} className="px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded">
                      {goal}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No fitness goals selected</p>
              )}
            </div>

            <div>
              <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Dietary Preferences
              </span>
              {profile.dietaryPreferences.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.dietaryPreferences.map((pref) => (
                    <span key={pref} className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 rounded">
                      {pref}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No dietary preferences selected</p>
              )}
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

export default function ClientProfilePage() {
  return (
    <AuthGuard>
      <RoleGuard permission={Permission.CLIENT_PROFILE}>
        <ClientProfileContent />
      </RoleGuard>
    </AuthGuard>
  );
}
