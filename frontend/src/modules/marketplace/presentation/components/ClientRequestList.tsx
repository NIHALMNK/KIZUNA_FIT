import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGetTrainerRequests, useWithdrawTrainerRequest } from '../../application/useMarketplace';
import { TrainerRequestResponseDTO } from '../../domain/types';
import { useCreateConsultation } from '@/modules/consultation/application/hooks/useConsultationMutations';
import { consultationApi } from '@/modules/consultation/infrastructure/api/consultationApi';
import { LoadingState } from '@/shared/components/feedback/LoadingState';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { StatusBadge, DomainStatus } from '@/shared/components/ui/StatusBadge';
import { Avatar } from '@/shared/components/ui/Avatar';
import { Button } from '@/shared/components/ui/Button';
import { ROUTES } from '@/shared/constants/routes';

export const ClientRequestList: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const { data, isLoading, isError, error, refetch } = useGetTrainerRequests();
  const withdrawMutation = useWithdrawTrainerRequest();

  if (isLoading) {
    return <LoadingState message="Loading your coaching requests..." count={3} />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to Load Requests"
        message={(error as any)?.message || 'Unable to fetch your trainer requests.'}
        onRetry={() => refetch()}
      />
    );
  }

  const requests = data?.requests || [];

  const filteredRequests = requests.filter((req) => {
    if (selectedFilter === 'ALL') return true;
    const normalizedStatus = (req.requestStatus || req.status || '').toUpperCase();
    return normalizedStatus.includes(selectedFilter);
  });

  const getStatusBadgeProps = (statusStr: string): { status: DomainStatus; label: string } => {
    const s = (statusStr || '').toUpperCase();
    if (s.includes('PENDING')) return { status: 'pending', label: 'Pending Response' };
    if (s.includes('ACCEPT')) return { status: 'active', label: 'Accepted' };
    if (s.includes('REJECT')) return { status: 'suspended', label: 'Rejected' };
    if (s.includes('CANCEL') || s.includes('WITHDRAW'))
      return { status: 'cancelled', label: 'Cancelled' };
    return { status: 'draft', label: statusStr };
  };

  const isPending = (statusStr: string) => {
    const s = (statusStr || '').toUpperCase();
    return s.includes('PENDING');
  };

  return (
    <div className="space-y-6">
      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-heading)] tracking-tight">
            My Coaching Requests
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Track and manage your submitted trainer coaching proposals.
          </p>
        </div>

        <Link href={ROUTES.PUBLIC_TRAINERS}>
          <Button variant="primary" size="sm">
            + Discover Trainers
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--color-border)] pb-3">
        {['ALL', 'PENDING', 'ACCEPTED', 'REJECTED', 'CANCEL'].map((filterKey) => (
          <button
            key={filterKey}
            type="button"
            onClick={() => setSelectedFilter(filterKey)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedFilter === filterKey
                ? 'bg-[var(--color-primary)] text-white shadow-sm'
                : 'bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            {filterKey === 'ALL'
              ? `All (${requests.length})`
              : filterKey === 'CANCEL'
                ? 'Cancelled'
                : filterKey.charAt(0) + filterKey.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* List / Empty State */}
      {filteredRequests.length === 0 ? (
        <EmptyState
          title="No Coaching Requests Found"
          description={
            selectedFilter === 'ALL'
              ? "You haven't submitted any coaching requests to trainers yet."
              : `No requests found with status matching "${selectedFilter}".`
          }
          action={
            <Link href={ROUTES.PUBLIC_TRAINERS}>
              <Button variant="primary" size="sm">
                Find a Trainer
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req: TrainerRequestResponseDTO) => {
            const badgeProps = getStatusBadgeProps(req.requestStatus || req.status);
            const canWithdraw = isPending(req.requestStatus || req.status);

            return (
              <div
                key={req.requestId || req.pipelineId}
                className="p-5 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm space-y-4 transition-all hover:border-[var(--color-primary)]/40"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-border)]">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={req.trainerSnapshot?.profileImage}
                      fallback={req.trainerSnapshot?.fullName?.slice(0, 2) || 'TR'}
                      size="md"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-[var(--color-heading)]">
                        {req.trainerSnapshot?.fullName || 'Certified Trainer'}
                      </h3>
                      {req.trainerSnapshot?.headline && (
                        <p className="text-xs text-[var(--color-text-secondary)] line-clamp-1">
                          {req.trainerSnapshot.headline}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <StatusBadge status={badgeProps.status} label={badgeProps.label} />
                  </div>
                </div>

                {/* Body Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1 bg-[var(--color-surface-alt)] p-3 rounded-xl border border-[var(--color-border)]">
                    <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                      Coaching Goal
                    </span>
                    <p className="font-semibold text-[var(--color-text-primary)]">{req.goal}</p>
                  </div>

                  <div className="space-y-1 bg-[var(--color-surface-alt)] p-3 rounded-xl border border-[var(--color-border)]">
                    <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                      Submitted Date
                    </span>
                    <p className="font-medium text-[var(--color-text-secondary)]">
                      {req.submittedAt
                        ? new Date(req.submittedAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Optional Message */}
                {req.message && (
                  <div className="space-y-1 text-xs bg-[var(--color-surface-alt)]/50 p-3 rounded-xl border border-[var(--color-border)]">
                    <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                      Your Message
                    </span>
                    <p className="text-[var(--color-text-secondary)] whitespace-pre-line">
                      {req.message}
                    </p>
                  </div>
                )}

                {/* Response Reason if rejected */}
                {req.responseReason && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs space-y-1">
                    <span className="font-bold text-red-500">Response Reason:</span>
                    <p className="text-red-400">{req.responseReason}</p>
                  </div>
                )}

                {/* Actions Footer */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-[var(--color-border)]">
                  {canWithdraw && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs text-red-500 border-red-500/40 hover:bg-red-500/10"
                      isLoading={withdrawMutation.isPending}
                      onClick={() => withdrawMutation.mutate(req.requestId)}
                    >
                      Withdraw Request
                    </Button>
                  )}

                  {(req.requestStatus || req.status || '').toUpperCase().includes('ACCEPT') && (
                    <AcceptedScheduleButton pipelineId={req.pipelineId} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const AcceptedScheduleButton: React.FC<{ pipelineId: string }> = ({ pipelineId }) => {
  const router = useRouter();
  const createMutation = useCreateConsultation();
  const [isChecking, setIsChecking] = useState(false);

  const handleScheduleClick = async () => {
    setIsChecking(true);
    try {
      const existing = await consultationApi.getConsultationByPipeline(pipelineId);
      if (existing && existing.consultationId) {
        router.push(ROUTES.CLIENT_CONSULTATION_DETAIL(existing.consultationId));
        return;
      }
    } catch {
      // Consultation not found (404), proceed to create
    } finally {
      setIsChecking(false);
    }

    const tomorrowMs = Date.now() + 86400000;
    const startIso = new Date(tomorrowMs).toISOString();
    const endIso = new Date(tomorrowMs + 2700000).toISOString();

    createMutation.mutate(
      {
        acquisitionPipelineId: pipelineId,
        scheduledStartAt: startIso,
        scheduledEndAt: endIso,
        timezone: 'UTC',
      },
      {
        onSuccess: (data) => {
          router.push(ROUTES.CLIENT_CONSULTATION_DETAIL(data.consultationId));
        },
      },
    );
  };

  return (
    <Button
      variant="primary"
      size="sm"
      className="text-xs font-bold bg-[var(--color-primary)] text-white"
      isLoading={isChecking || createMutation.isPending}
      onClick={handleScheduleClick}
    >
      Schedule Consultation
    </Button>
  );
};
