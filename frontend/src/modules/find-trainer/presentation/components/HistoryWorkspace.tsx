'use client';

import React, { useState } from 'react';
import { useGetTrainerRequests } from '@/modules/marketplace/application/useMarketplace';
import { useConsultationHistory } from '@/modules/consultation/application/hooks/useConsultationQueries';
import { useReceivedOffers } from '@/modules/offer/application/hooks/useOffers';
import { OfferStatusBadge } from '@/modules/offer/presentation/components/OfferStatusBadge';
import {
  History,
  Send,
  Calendar,
  Tag,
  ChevronDown,
  ChevronUp,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
} from 'lucide-react';
import Image from 'next/image';

export const HistoryWorkspace: React.FC = () => {
  const [openSections, setOpenSections] = useState<{
    requests: boolean;
    consultations: boolean;
    offers: boolean;
  }>({
    requests: true,
    consultations: true,
    offers: true,
  });

  const toggleSection = (section: 'requests' | 'consultations' | 'offers') => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const requestsQuery = useGetTrainerRequests();
  const consultationsQuery = useConsultationHistory();
  const offersQuery = useReceivedOffers();

  const isLoading =
    requestsQuery.isLoading || consultationsQuery.isLoading || offersQuery.isLoading;

  const requests = requestsQuery.data?.requests || [];
  const consultations = consultationsQuery.data?.consultations || [];
  const offers = offersQuery.data?.offers || [];

  const hasAnyHistory = requests.length > 0 || consultations.length > 0 || offers.length > 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center shrink-0">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[var(--color-heading)] tracking-tight">
              Acquisition Journey History
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              Review your historical trainer requests, past consultation sessions, and previous
              coaching offers.
            </p>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 animate-pulse h-28"
            />
          ))}
        </div>
      )}

      {!isLoading && !hasAnyHistory && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-12 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[var(--color-surface-alt)] flex items-center justify-center mx-auto text-[var(--color-text-muted)]">
            <History className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-[var(--color-heading)]">
            No trainer journey history yet
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto">
            You have not submitted any coach proposals, completed consultations, or received offers
            yet.
          </p>
        </div>
      )}

      {!isLoading && hasAnyHistory && (
        <div className="space-y-4">
          {/* Section 1: Request History */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('requests')}
              className="w-full flex items-center justify-between p-5 text-left bg-[var(--color-surface)] hover:bg-[var(--color-surface-alt)] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Send className="w-4 h-4 text-[var(--color-primary)]" />
                <h3 className="text-sm font-extrabold text-[var(--color-heading)]">
                  Trainer Requests ({requests.length})
                </h3>
              </div>
              {openSections.requests ? (
                <ChevronUp className="w-4 h-4 text-[var(--color-text-muted)]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
              )}
            </button>

            {openSections.requests && (
              <div className="p-5 pt-0 border-t border-[var(--color-border)] space-y-3">
                {requests.length === 0 ? (
                  <p className="text-xs text-[var(--color-text-muted)] py-4 text-center">
                    No trainer proposals recorded.
                  </p>
                ) : (
                  <div className="divide-y divide-[var(--color-border)]">
                    {requests.map((req) => {
                      const statusStr = (
                        req.requestStatus ||
                        req.status ||
                        'PENDING'
                      ).toUpperCase();
                      const trainerName = req.trainerSnapshot?.fullName || 'Coach';
                      const formattedDate = req.submittedAt
                        ? new Date(req.submittedAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '—';

                      return (
                        <div
                          key={req.requestId}
                          className="py-3.5 first:pt-2 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative w-10 h-10 rounded-full bg-[var(--color-surface-alt)] border border-[var(--color-border)] overflow-hidden shrink-0 flex items-center justify-center">
                              {req.trainerSnapshot?.profileImage ? (
                                <Image
                                  src={req.trainerSnapshot.profileImage}
                                  alt={trainerName}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <User className="w-5 h-5 text-[var(--color-text-muted)]" />
                              )}
                            </div>
                            <div className="space-y-0.5 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs sm:text-sm font-extrabold text-[var(--color-heading)] truncate">
                                  {trainerName}
                                </h4>
                                <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                                  {req.requestId.slice(-6)}
                                </span>
                              </div>
                              <p className="text-xs text-[var(--color-text-secondary)] line-clamp-1">
                                Goal: &ldquo;{req.goal}&rdquo;
                              </p>
                              <div className="flex items-center gap-2 text-[10px] text-[var(--color-text-muted)]">
                                <Clock className="w-3 h-3" />
                                <span>{formattedDate}</span>
                              </div>
                            </div>
                          </div>

                          <div className="self-end sm:self-center shrink-0">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                                statusStr.includes('ACCEPT')
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : statusStr.includes('REJECT') ||
                                      statusStr.includes('CANCEL') ||
                                      statusStr.includes('WITHDRAW')
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {statusStr.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 2: Consultation History */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('consultations')}
              className="w-full flex items-center justify-between p-5 text-left bg-[var(--color-surface)] hover:bg-[var(--color-surface-alt)] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[var(--color-primary)]" />
                <h3 className="text-sm font-extrabold text-[var(--color-heading)]">
                  Consultation History ({consultations.length})
                </h3>
              </div>
              {openSections.consultations ? (
                <ChevronUp className="w-4 h-4 text-[var(--color-text-muted)]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
              )}
            </button>

            {openSections.consultations && (
              <div className="p-5 pt-0 border-t border-[var(--color-border)] space-y-3">
                {consultations.length === 0 ? (
                  <p className="text-xs text-[var(--color-text-muted)] py-4 text-center">
                    No consultation sessions recorded.
                  </p>
                ) : (
                  <div className="divide-y divide-[var(--color-border)]">
                    {consultations.map((cons) => {
                      const statusStr = (cons.status || '').toUpperCase();
                      const scheduledStart = cons.slot?.scheduledStartAt;
                      const formattedDate = scheduledStart
                        ? new Date(scheduledStart).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'No slot booked';

                      return (
                        <div
                          key={cons.consultationId}
                          className="py-3.5 first:pt-2 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-extrabold text-[var(--color-heading)]">
                                1-on-1 Consultation
                              </span>
                              <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                                {cons.consultationId.slice(-6)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                              <Calendar className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                              <span>{formattedDate}</span>
                              {cons.slot?.timezone && (
                                <span className="text-[10px] text-[var(--color-text-muted)]">
                                  ({cons.slot.timezone})
                                </span>
                              )}
                            </div>
                            {cons.cancellation?.reason && (
                              <p className="text-[11px] text-red-600 italic">
                                Reason: {cons.cancellation.reason}
                              </p>
                            )}
                          </div>

                          <div className="self-end sm:self-center shrink-0">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                                statusStr === 'COMPLETED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : statusStr === 'CANCELLED' || statusStr === 'NO_SHOW'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {statusStr.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 3: Offer History */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('offers')}
              className="w-full flex items-center justify-between p-5 text-left bg-[var(--color-surface)] hover:bg-[var(--color-surface-alt)] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4 text-[var(--color-primary)]" />
                <h3 className="text-sm font-extrabold text-[var(--color-heading)]">
                  Coaching Offers ({offers.length})
                </h3>
              </div>
              {openSections.offers ? (
                <ChevronUp className="w-4 h-4 text-[var(--color-text-muted)]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
              )}
            </button>

            {openSections.offers && (
              <div className="p-5 pt-0 border-t border-[var(--color-border)] space-y-3">
                {offers.length === 0 ? (
                  <p className="text-xs text-[var(--color-text-muted)] py-4 text-center">
                    No coaching offers recorded.
                  </p>
                ) : (
                  <div className="divide-y divide-[var(--color-border)]">
                    {offers.map((off) => {
                      const formattedDate = off.createdAt
                        ? new Date(off.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '—';

                      return (
                        <div
                          key={off.offerId}
                          className="py-3.5 first:pt-2 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-extrabold text-[var(--color-heading)]">
                                {off.scope.planType} Plan ({off.scope.durationDays} Days)
                              </span>
                              <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                                {off.offerId.slice(-6)}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)]">
                              <span className="font-extrabold text-[var(--color-primary)] font-mono">
                                {off.pricing.currency} {off.pricing.totalAmount.toLocaleString()}
                              </span>
                              <span>•</span>
                              <span>Issued: {formattedDate}</span>
                            </div>
                          </div>

                          <div className="self-end sm:self-center shrink-0">
                            <OfferStatusBadge status={off.status} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
