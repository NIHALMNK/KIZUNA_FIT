'use client';

import React from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/shared/components/guards/AuthGuard';
import { RoleGuard } from '@/shared/components/guards/RoleGuard';
import { Permission } from '@/shared/components/navigation/permissions';
import { ROUTES } from '@/shared/constants/routes';
import { useGetTrainerProfile, useUploadTrainerAvatar, useDeleteTrainerAvatar } from '@/modules/profile/presentation/hooks/useTrainerProfile';
import { PageHeader } from '@/modules/profile/presentation/components/PageHeader';
import { SectionCard } from '@/modules/profile/presentation/components/SectionCard';
import { InfoCard } from '@/modules/profile/presentation/components/InfoCard';
import { AvatarUploader } from '@/modules/profile/presentation/components/AvatarUploader';
import { ProfileCompletionCard } from '@/modules/profile/presentation/components/ProfileCompletionCard';
import { LoadingState } from '@/shared/components/feedback/LoadingState';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { CertificationCard } from '@/modules/profile/presentation/components/CertificationCard';
import { ShowcaseCard } from '@/modules/profile/presentation/components/ShowcaseCard';
import { mapApiError } from '@/shared/utils/errorMapper';

function TrainerProfileContent() {
  const { data: profile, isLoading, isError, error, refetch } = useGetTrainerProfile();
  const uploadAvatarMutation = useUploadTrainerAvatar();
  const deleteAvatarMutation = useDeleteTrainerAvatar();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-12">
        <PageHeader title="Trainer Profile" role="TRAINER" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <LoadingState message="Loading trainer profile data..." />
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
          <PageHeader title="Trainer Profile" role="TRAINER" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <EmptyState
              title="You haven't created your trainer profile yet"
              description="Set up your professional bio, certifications, and availability to start receiving client matches."
              action={
                <Link
                  href={ROUTES.TRAINER_PROFILE_CREATE}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md"
                >
                  Create Trainer Profile
                </Link>
              }
            />
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 pb-12">
        <PageHeader title="Trainer Profile" role="TRAINER" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <ErrorState error={error} onRetry={refetch} />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 pb-12">
        <PageHeader title="Trainer Profile" role="TRAINER" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <EmptyState
            title="You haven't created your trainer profile yet"
            description="Set up your trainer profile to unlock client features."
            action={
              <Link
                href={ROUTES.TRAINER_PROFILE_CREATE}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md"
              >
                Create Trainer Profile
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
        title={profile.headline}
        subtitle={`${profile.yearsOfExperience} years experience • ${profile.location.city}, ${profile.location.country}`}
        role="TRAINER"
        action={
          <div className="flex items-center gap-2">
            <Link
              href={ROUTES.PUBLIC_TRAINER_DETAILS(profile.userId)}
              className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md"
            >
              View Public Page
            </Link>
            <Link
              href={ROUTES.TRAINER_PROFILE_EDIT}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md"
            >
              Edit Details
            </Link>
          </div>
        }
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <ProfileCompletionCard completed={profile.profileCompleted} role="TRAINER" />

        <AvatarUploader
          currentAvatarUrl={profile.avatarUrl}
          onUpload={async (file) => {
            await uploadAvatarMutation.mutateAsync(file);
          }}
          onDelete={async () => {
            await deleteAvatarMutation.mutateAsync();
          }}
          isLoading={uploadAvatarMutation.isPending || deleteAvatarMutation.isPending}
          role="TRAINER"
        />

        <SectionCard title="Reputation & Performance Metrics">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <InfoCard label="Average Rating" value={`★ ${profile.averageRating.toFixed(1)}`} />
            <InfoCard label="Total Reviews" value={profile.totalReviews} />
            <InfoCard label="Total Clients" value={profile.totalClients} />
            <InfoCard label="Status" value={profile.availability.status} />
          </div>
        </SectionCard>

        <SectionCard title="Professional Overview">
          <div className="space-y-4">
            <div>
              <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Biography</span>
              <p className="text-sm text-gray-800 whitespace-pre-line bg-gray-50 p-3 rounded border border-gray-100">
                {profile.bio}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoCard label="Languages Spoken" value={profile.languages.join(', ')} />
              <InfoCard
                label="Location"
                value={`${profile.location.city}, ${profile.location.state}, ${profile.location.country}`}
              />
            </div>

            <div>
              <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Specializations
              </span>
              <div className="flex flex-wrap gap-2">
                {profile.specializations.map((spec) => (
                  <span key={spec} className="px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 rounded">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Availability Schedule"
          subtitle={`Status: ${profile.availability.status} (${profile.availability.timezone})`}
          action={
            <Link
              href={ROUTES.TRAINER_AVAILABILITY}
              className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md"
            >
              Manage Schedule
            </Link>
          }
        >
          <div className="text-xs text-gray-600">
            {profile.availability.weeklySchedule.length === 0 ? (
              <p className="italic text-gray-400">No recurring weekly availability configured.</p>
            ) : (
              <p>Active schedule across {profile.availability.weeklySchedule.length} days of the week.</p>
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="Certifications"
          subtitle={`Total verified: ${profile.certifications.filter((c) => c.status === 'APPROVED').length}`}
          action={
            <Link
              href={ROUTES.TRAINER_CERTIFICATIONS}
              className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md"
            >
              Manage Certifications
            </Link>
          }
        >
          {profile.certifications.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No certifications added yet.</p>
          ) : (
            <div className="space-y-2">
              {profile.certifications.slice(0, 3).map((cert) => (
                <CertificationCard key={cert.certificationId} certification={cert} />
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Showcase Items"
          subtitle={`Total items: ${profile.showcase.length}`}
          action={
            <Link
              href={ROUTES.TRAINER_SHOWCASE}
              className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md"
            >
              Manage Showcase
            </Link>
          }
        >
          {profile.showcase.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No showcase items added yet.</p>
          ) : (
            <div className="space-y-2">
              {profile.showcase.slice(0, 3).map((item) => (
                <ShowcaseCard key={item.showcaseId} showcase={item} />
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

export default function TrainerProfilePage() {
  return (
    <AuthGuard>
      <RoleGuard permission={Permission.TRAINER_PROFILE}>
        <TrainerProfileContent />
      </RoleGuard>
    </AuthGuard>
  );
}
