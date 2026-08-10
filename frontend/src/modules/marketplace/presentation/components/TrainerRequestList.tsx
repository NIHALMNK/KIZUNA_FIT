import React, { useState } from 'react';
import {
  useGetPendingTrainerRequests,
  useGetTrainerRequests,
  useAcceptTrainerRequest,
  useRejectTrainerRequest,
} from '../../application/useMarketplace';
import { TrainerRequestResponseDTO } from '../../domain/types';
import { LoadingState } from '@/shared/components/feedback/LoadingState';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { StatusBadge, DomainStatus } from '@/shared/components/ui/StatusBadge';
import { Button } from '@/shared/components/ui/Button';
import { Dialog, DialogFooter } from '@/shared/components/ui/Dialog';
import { Textarea } from '@/shared/components/ui/Textarea';

export const TrainerRequestList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [rejectingRequestId, setRejectingRequestId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  const pendingQuery = useGetPendingTrainerRequests();
  const allQuery = useGetTrainerRequests();

  const acceptMutation = useAcceptTrainerRequest();
  const rejectMutation = useRejectTrainerRequest();

  const activeQuery = activeTab === 'pending' ? pendingQuery : allQuery;

  if (activeQuery.isLoading) {
    return <LoadingState message="Loading client coaching proposals..." count={3} />;
  }

  if (activeQuery.isError) {
    return (
      <ErrorState
        title="Failed to Load Proposals"
        message={(activeQuery.error as any)?.message || 'Unable to fetch client proposals.'}
        onRetry={() => activeQuery.refetch()}
      />
    );
  }

  const requests = activeQuery.data?.requests || [];

  const getStatusBadgeProps = (statusStr: string): { status: DomainStatus; label: string } => {
    const s = (statusStr || '').toUpperCase();
    if (s.includes('PENDING')) return { status: 'pending', label: 'Pending Action' };
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

  const handleConfirmReject = () => {
    if (!rejectingRequestId) return;
    rejectMutation.mutate(
      {
        requestId: rejectingRequestId,
        payload: rejectionReason.trim() ? { reason: rejectionReason.trim() } : undefined,
      },
      {
        onSuccess: () => {
          setRejectingRequestId(null);
          setRejectionReason('');
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-heading)] tracking-tight">
            Client Coaching Proposals
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Review and respond to intake requests from interested clients.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)] self-start">
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'pending'
                ? 'bg-[var(--color-card)] text-[var(--color-text-primary)] shadow-sm'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            Pending Queue
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-[var(--color-card)] text-[var(--color-text-primary)] shadow-sm'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            All History
          </button>
        </div>
      </div>

      {/* List / Empty State */}
      {requests.length === 0 ? (
        <EmptyState
          title={activeTab === 'pending' ? 'No Pending Proposals' : 'No Request History'}
          description={
            activeTab === 'pending'
              ? 'You currently have no new client requests awaiting your decision.'
              : 'You have not received any client coaching requests yet.'
          }
        />
      ) : (
        <div className="space-y-4">
          {requests.map((req: TrainerRequestResponseDTO) => {
            const badgeProps = getStatusBadgeProps(req.requestStatus || req.status);
            const pendingAction = isPending(req.requestStatus || req.status);

            return (
              <div
                key={req.requestId || req.pipelineId}
                className="p-5 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm space-y-4 transition-all hover:border-[var(--color-primary)]/40"
              >
                {/* Top status bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--color-border)] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[var(--color-text-muted)] uppercase tracking-wider text-[10px]">
                      Client Request ID:
                    </span>
                    <span className="font-mono text-[var(--color-text-secondary)]">
                      {req.requestId}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[var(--color-text-muted)] text-[11px]">
                      Submitted{' '}
                      {req.submittedAt ? new Date(req.submittedAt).toLocaleDateString() : 'N/A'}
                    </span>
                    <StatusBadge status={badgeProps.status} label={badgeProps.label} />
                  </div>
                </div>

                {/* Client Goal & Details */}
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)] space-y-1">
                    <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                      Client Goal
                    </span>
                    <p className="text-sm font-bold text-[var(--color-text-primary)]">{req.goal}</p>
                  </div>

                  {req.message && (
                    <div className="p-3 rounded-xl bg-[var(--color-surface-alt)]/60 border border-[var(--color-border)] space-y-1 text-xs">
                      <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                        Client Message
                      </span>
                      <p className="text-[var(--color-text-secondary)] whitespace-pre-line">
                        {req.message}
                      </p>
                    </div>
                  )}
                </div>

                {/* Response Reason if rejected */}
                {req.responseReason && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs space-y-1">
                    <span className="font-bold text-red-500">Rejection Reason Provided:</span>
                    <p className="text-red-400">{req.responseReason}</p>
                  </div>
                )}

                {/* Action Buttons for Pending */}
                {pendingAction && (
                  <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--color-border)]">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs text-red-500 border-red-500/40 hover:bg-red-500/10"
                      onClick={() => {
                        setRejectingRequestId(req.requestId);
                        setRejectionReason('');
                      }}
                      disabled={acceptMutation.isPending || rejectMutation.isPending}
                    >
                      Reject Request
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      className="text-xs"
                      isLoading={
                        acceptMutation.isPending && acceptMutation.variables === req.requestId
                      }
                      onClick={() => acceptMutation.mutate(req.requestId)}
                      disabled={acceptMutation.isPending || rejectMutation.isPending}
                    >
                      Accept Client ✓
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Modal */}
      <Dialog
        isOpen={!!rejectingRequestId}
        onClose={() => setRejectingRequestId(null)}
        title="Reject Client Proposal"
        description="Optionally provide a reason to inform the client why you cannot take on this proposal."
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="rejection-reason"
              className="text-xs font-bold text-[var(--color-text-primary)]"
            >
              Rejection Reason (Optional)
            </label>
            <Textarea
              id="rejection-reason"
              placeholder="e.g. Current client roster is full, outside my primary specialization area..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
              maxLength={500}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setRejectingRequestId(null)}
              disabled={rejectMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-red-500 border-red-500/40 hover:bg-red-500/10"
              isLoading={rejectMutation.isPending}
              onClick={handleConfirmReject}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </div>
      </Dialog>
    </div>
  );
};
