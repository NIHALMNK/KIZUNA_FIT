'use client';

import React from 'react';
import Link from 'next/link';
import { useGetTrainerProfile } from '@/modules/profile/presentation/hooks/useTrainerProfile';
import {
  useAddCertification,
  useUpdateCertification,
  useDeleteCertification,
} from '@/modules/profile/presentation/hooks/useTrainerCertifications';
import { useProfileUiStore } from '@/modules/profile/presentation/store/profileUiStore';
import { PageHeader } from '@/modules/profile/presentation/components/PageHeader';
import { SectionCard } from '@/modules/profile/presentation/components/SectionCard';
import { CertificationCard } from '@/modules/profile/presentation/components/CertificationCard';
import { CertificationForm } from '@/modules/profile/presentation/components/CertificationForm';
import { ConfirmationModal } from '@/modules/profile/presentation/components/ConfirmationModal';
import { LoadingState } from '@/modules/profile/presentation/components/LoadingState';
import { ErrorState } from '@/modules/profile/presentation/components/ErrorState';
import { EmptyState } from '@/modules/profile/presentation/components/EmptyState';
import { TrainerCertification } from '@/modules/profile/domain/types/profile.types';

export default function TrainerCertificationsPage() {
  const { data: profile, isLoading, isError, error, refetch } = useGetTrainerProfile();
  const addMutation = useAddCertification();
  const updateMutation = useUpdateCertification();
  const deleteMutation = useDeleteCertification();

  const {
    activeCertificationModal,
    openCertificationModal,
    closeCertificationModal,
    activeDeleteModal,
    openDeleteModal,
    closeDeleteModal,
  } = useProfileUiStore();

  const handleFormSubmit = async (values: any) => {
    if (activeCertificationModal.certification) {
      await updateMutation.mutateAsync({
        id: activeCertificationModal.certification.certificationId,
        dto: values,
      });
    } else {
      await addMutation.mutateAsync(values);
    }
    closeCertificationModal();
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
        title="Manage Certifications"
        subtitle="Upload and manage your professional fitness credentials for verification"
        role="TRAINER"
        action={
          <div className="flex items-center gap-3">
            <Link
              href="/profile/trainer"
              className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              ← Back to Profile
            </Link>
            <button
              onClick={() => openCertificationModal(null)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md"
            >
              + Add Certification
            </button>
          </div>
        }
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {isLoading && <LoadingState message="Loading certifications..." />}
        {isError && <ErrorState message={(error as any)?.message || 'Failed to load certifications'} onRetry={refetch} />}

        {profile && (
          <SectionCard title="Your Certifications" subtitle="Approved certifications display a green status badge on your public profile">
            {profile.certifications.length === 0 ? (
              <EmptyState
                title="No Certifications Added"
                description="Add your certifications to build credibility with prospective clients."
                action={
                  <button
                    onClick={() => openCertificationModal(null)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md"
                  >
                    + Add First Certification
                  </button>
                }
              />
            ) : (
              <div className="space-y-3">
                {profile.certifications.map((cert: TrainerCertification) => (
                  <CertificationCard
                    key={cert.certificationId}
                    certification={cert}
                    onEdit={(c) => openCertificationModal(c)}
                    onDelete={(id) => openDeleteModal(id, 'certification')}
                  />
                ))}
              </div>
            )}
          </SectionCard>
        )}
      </div>

      {/* Certification Add/Edit Modal */}
      {activeCertificationModal.open && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {activeCertificationModal.certification ? 'Edit Certification' : 'Add New Certification'}
            </h3>
            <CertificationForm
              initialValues={activeCertificationModal.certification}
              onSubmit={handleFormSubmit}
              onCancel={closeCertificationModal}
              isLoading={addMutation.isPending || updateMutation.isPending}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={activeDeleteModal.open && activeDeleteModal.type === 'certification'}
        title="Delete Certification"
        message="Are you sure you want to delete this certification? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
