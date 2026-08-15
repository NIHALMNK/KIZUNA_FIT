import React, { useState } from 'react';
import Link from 'next/link';
import {
  useUpcomingConsultations,
  useConsultationHistory,
} from '../../application/hooks/useConsultationQueries';
import { ConsultationResponseDTO } from '../../domain/types/consultation.types';
import { ConsultationListCard } from './ConsultationListCard';
import { CancelConsultationModal } from './CancelConsultationModal';
import { LoadingState } from '../../../../shared/components/feedback/LoadingState';
import { EmptyState } from '../../../../shared/components/feedback/EmptyState';
import { ErrorState } from '../../../../shared/components/feedback/ErrorState';
import { Button } from '../../../../shared/components/ui/Button';
import { ROUTES } from '../../../../shared/constants/routes';

export const TrainerConsultationsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'HISTORY'>('UPCOMING');
  const [selectedCancelConsultation, setSelectedCancelConsultation] =
    useState<ConsultationResponseDTO | null>(null);

  const upcomingQuery = useUpcomingConsultations({ page: 1, limit: 10, sort: 'newest' });
  const historyQuery = useConsultationHistory({ page: 1, limit: 10, sort: 'newest' });

  const activeQuery = activeTab === 'UPCOMING' ? upcomingQuery : historyQuery;

  const handleCancelClick = (consultation: ConsultationResponseDTO) => {
    setSelectedCancelConsultation(consultation);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-heading)] tracking-tight">
            Client Consultations
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Manage 1-on-1 client consultation requests, confirm schedules, and join live sessions.
          </p>
        </div>

        <Link href={ROUTES.TRAINER_DASHBOARD}>
          <Button variant="outline" size="sm">
            &larr; Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('UPCOMING')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'UPCOMING'
              ? 'bg-[var(--color-primary)] text-white shadow-sm'
              : 'bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          Upcoming ({upcomingQuery.data?.total || 0})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('HISTORY')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'HISTORY'
              ? 'bg-[var(--color-primary)] text-white shadow-sm'
              : 'bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          History ({historyQuery.data?.total || 0})
        </button>
      </div>

      {/* Main Content Area */}
      {activeQuery.isLoading ? (
        <LoadingState message="Loading client consultation schedule..." count={3} />
      ) : activeQuery.isError ? (
        <ErrorState
          title="Failed to Load Consultations"
          message="We encountered an issue fetching your client consultation schedule."
          onRetry={() => activeQuery.refetch()}
        />
      ) : (activeQuery.data?.consultations || []).length === 0 ? (
        <EmptyState
          title={activeTab === 'UPCOMING' ? 'No Upcoming Consultations' : 'No Consultation History'}
          description={
            activeTab === 'UPCOMING'
              ? 'You do not have any active or pending consultation sessions with clients.'
              : 'No completed or cancelled consultation records found.'
          }
        />
      ) : (
        <div className="space-y-4">
          {(activeQuery.data?.consultations || []).map((c) => (
            <ConsultationListCard
              key={c.consultationId}
              consultation={c}
              role="TRAINER"
              onCancelClick={handleCancelClick}
            />
          ))}
        </div>
      )}

      {/* Cancel Modal */}
      {selectedCancelConsultation && (
        <CancelConsultationModal
          isOpen={!!selectedCancelConsultation}
          onClose={() => setSelectedCancelConsultation(null)}
          consultationId={selectedCancelConsultation.consultationId}
        />
      )}
    </div>
  );
};
