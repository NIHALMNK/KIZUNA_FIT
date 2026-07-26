'use client';

import React from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/shared/components/guards/AuthGuard';
import { RoleGuard } from '@/shared/components/guards/RoleGuard';
import { Permission } from '@/shared/components/navigation/permissions';
import { ROUTES } from '@/shared/constants/routes';
import { useGetTrainerProfile } from '@/modules/profile/presentation/hooks/useTrainerProfile';
import {
  useAddShowcaseItem,
  useUpdateShowcaseItem,
  useDeleteShowcaseItem,
} from '@/modules/profile/presentation/hooks/useTrainerShowcase';
import { useProfileUiStore } from '@/modules/profile/presentation/store/profileUiStore';
import { PageHeader } from '@/modules/profile/presentation/components/PageHeader';
import { SectionCard } from '@/modules/profile/presentation/components/SectionCard';
import { ShowcaseCard } from '@/modules/profile/presentation/components/ShowcaseCard';
import { ShowcaseForm } from '@/modules/profile/presentation/components/ShowcaseForm';
import { ConfirmationModal } from '@/modules/profile/presentation/components/ConfirmationModal';
import { LoadingState } from '@/shared/components/feedback/LoadingState';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { TrainerShowcase } from '@/modules/profile/domain/types/profile.types';

function TrainerShowcaseContent() {
  const { data: profile, isLoading, isError, error, refetch } = useGetTrainerProfile();
  const addMutation = useAddShowcaseItem();
  const updateMutation = useUpdateShowcaseItem();
  const deleteMutation = useDeleteShowcaseItem();

  const {
    activeShowcaseModal,
    openShowcaseModal,
    closeShowcaseModal,
    activeDeleteModal,
    openDeleteModal,
    closeDeleteModal,
  } = useProfileUiStore();

  const handleFormSubmit = async (values: any) => {
    if (activeShowcaseModal.showcase) {
      await updateMutation.mutateAsync({
        id: activeShowcaseModal.showcase.showcaseId,
        dto: values,
      });
    } else {
      await addMutation.mutateAsync(values);
    }
    closeShowcaseModal();
  };

  const handleConfirmDelete = async () => {
    if (activeDeleteModal.id) {
      await deleteMutation.mutateAsync(activeDeleteModal.id);
      closeDeleteModal();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <PageHeader
        title="Manage Showcase Portfolio"
        subtitle="Highlight client transformations, awards, competition videos, and achievements"
        role="TRAINER"
        action={
          <div className="flex items-center gap-3">
            <Link
              href={ROUTES.TRAINER_PROFILE}
              className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              ← Back to Profile
            </Link>
            <button
              onClick={() => openShowcaseModal(null)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md"
            >
              + Add Showcase Item
            </button>
          </div>
        }
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {isLoading && <LoadingState message="Loading showcase items..." />}
        {isError && <ErrorState error={error} onRetry={refetch} />}

        {profile && (
          <SectionCard title="Showcase Portfolio" subtitle="Showcase items are displayed prominently on your public profile">
            {profile.showcase.length === 0 ? (
              <EmptyState
                title="No Showcase Items"
                description="Add client transformation photos, videos, or awards to showcase your track record."
                action={
                  <button
                    onClick={() => openShowcaseModal(null)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md"
                  >
                    + Add First Showcase Item
                  </button>
                }
              />
            ) : (
              <div className="space-y-3">
                {profile.showcase.map((item: TrainerShowcase) => (
                  <ShowcaseCard
                    key={item.showcaseId}
                    showcase={item}
                    onEdit={(s) => openShowcaseModal(s)}
                    onDelete={(id) => openDeleteModal(id, 'showcase')}
                  />
                ))}
              </div>
            )}
          </SectionCard>
        )}
      </div>

      {/* Showcase Add/Edit Modal */}
      {activeShowcaseModal.open && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {activeShowcaseModal.showcase ? 'Edit Showcase Item' : 'Add Showcase Item'}
            </h3>
            <ShowcaseForm
              initialValues={activeShowcaseModal.showcase}
              onSubmit={handleFormSubmit}
              onCancel={closeShowcaseModal}
              isLoading={addMutation.isPending || updateMutation.isPending}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={activeDeleteModal.open && activeDeleteModal.type === 'showcase'}
        title="Delete Showcase Item"
        message="Are you sure you want to delete this showcase item from your portfolio? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

export default function TrainerShowcasePage() {
  return (
    <AuthGuard>
      <RoleGuard permission={Permission.TRAINER_SHOWCASE}>
        <TrainerShowcaseContent />
      </RoleGuard>
    </AuthGuard>
  );
}
