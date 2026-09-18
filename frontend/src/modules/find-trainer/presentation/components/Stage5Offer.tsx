'use client';

import React, { useState } from 'react';
import {
  CoachingOfferResponseDTO,
  CoachingOfferStatus,
} from '@/modules/offer/domain/types/offer.types';
import { useGetPublicTrainerProfile } from '@/modules/profile/presentation/hooks/usePublicTrainers';
import { useOfferActions } from '@/modules/offer/application/hooks/useOfferActions';
import { OfferStatusBadge } from '@/modules/offer/presentation/components/OfferStatusBadge';
import { OfferDetailsModal } from '@/modules/offer/presentation/components/OfferDetailsModal';
import { PayNowButton } from '@/modules/payment/presentation/components/PayNowButton';
import {
  Tag,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  AlertCircle,
  FileText,
  XCircle,
  Check,
  CreditCard,
  Eye,
} from 'lucide-react';
import { Avatar } from '@/shared/components/ui/Avatar';

interface Stage5OfferProps {
  offer: CoachingOfferResponseDTO;
}

export const Stage5Offer: React.FC<Stage5OfferProps> = ({ offer }) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  const { data: trainerProfile } = useGetPublicTrainerProfile(offer.trainerId);
  const { acceptOffer, declineOffer, isAccepting } = useOfferActions();

  const displayName =
    trainerProfile?.fullName || trainerProfile?.trainerName || trainerProfile?.name || 'Your Coach';

  const isPendingResponse = offer.status === CoachingOfferStatus.SENT;
  const isAccepted = offer.status === CoachingOfferStatus.ACCEPTED;
  const isDeclined = offer.status === CoachingOfferStatus.DECLINED;
  const isExpired = offer.status === CoachingOfferStatus.EXPIRED;

  const handleAccept = async () => {
    try {
      await acceptOffer(offer.offerId);
    } catch {
      // Handled by hook
    }
  };

  const handleDecline = async () => {
    try {
      await declineOffer({
        offerId: offer.offerId,
        payload: { reason: declineReason.trim() || undefined },
      });
      setShowDeclineConfirm(false);
    } catch {
      // Handled by hook
    }
  };

  const formattedExpiry = offer.expiresAt
    ? new Date(offer.expiresAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-xs space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[var(--color-text-muted)]">
                  Offer: {(offer.offerId || (offer as any).id || '').slice(-8) || 'OFFER'}
                </span>
                <OfferStatusBadge status={offer.status} />
              </div>
              <h2 className="text-base sm:text-lg font-black text-[var(--color-heading)] mt-0.5">
                {isAccepted
                  ? 'Offer Accepted — Ready for Activation'
                  : 'Coaching Package & Enrollment Offer'}
              </h2>
            </div>
          </div>

          <div className="text-right">
            <span className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase">
              Total Fee
            </span>
            <span className="text-lg sm:text-xl font-black text-[var(--color-primary)] font-mono">
              {offer.pricing?.currency || 'INR'}{' '}
              {(offer.pricing?.totalAmount ?? 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Coach card */}
        <div className="flex items-center gap-3.5 p-4 bg-[var(--color-surface-alt)] rounded-xl border border-[var(--color-border)]">
          <Avatar
            src={trainerProfile?.avatarUrl || undefined}
            alt={displayName}
            fallback={displayName.substring(0, 2).toUpperCase()}
            size="lg"
            className="ring-1 ring-[var(--color-border)] shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-xs sm:text-sm font-extrabold text-[var(--color-heading)] truncate">
              {displayName}
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] truncate">
              {trainerProfile?.headline || 'Certified Fitness Professional'}
            </p>
          </div>
        </div>

        {/* Package Scope Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[var(--color-surface-alt)] rounded-xl border border-[var(--color-border)]">
              <span className="block text-[10px] font-bold uppercase text-[var(--color-text-muted)]">
                Plan Tier
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-[var(--color-heading)]">
                {offer.scope?.planType || 'Custom'} Plan
              </span>
            </div>

            <div className="p-3 bg-[var(--color-surface-alt)] rounded-xl border border-[var(--color-border)]">
              <span className="block text-[10px] font-bold uppercase text-[var(--color-text-muted)]">
                Duration
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-[var(--color-heading)]">
                {offer.scope?.durationDays || 30} Days
              </span>
            </div>
          </div>

          {/* Included Services */}
          {offer.scope?.includedFeatures && offer.scope.includedFeatures.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-[var(--color-heading)] block">
                Included Features & Services
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {offer.scope.includedFeatures.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 bg-[var(--color-surface-alt)] rounded-xl text-xs font-semibold text-[var(--color-text-primary)] border border-[var(--color-border)]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trainer Notes if available */}
          {offer.scope?.trainerNotes && (
            <div className="space-y-1.5 p-3.5 bg-[var(--color-surface-alt)] rounded-xl border border-[var(--color-border)]">
              <span className="text-xs font-bold text-[var(--color-heading)] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                Special Instructions from Coach
              </span>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed italic">
                &ldquo;{offer.scope.trainerNotes}&rdquo;
              </p>
            </div>
          )}

          {/* Expiry notice */}
          {isPendingResponse && formattedExpiry && (
            <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 p-3 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                This offer is valid until <strong>{formattedExpiry}</strong>.
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons based on Offer Status */}
        <div className="space-y-3 pt-2 border-t border-[var(--color-border)]">
          {/* If Pending Response: Accept or Pay directly */}
          {isPendingResponse && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAccept}
                  disabled={isAccepting}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-extrabold bg-[var(--color-primary)] text-white hover:opacity-95 shadow-xs transition-all active:scale-[0.99] disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isAccepting ? 'Accepting...' : 'Accept Offer'}</span>
                </button>

                <PayNowButton offerId={offer.offerId} className="w-full" />
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsDetailsModalOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-heading)] transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Review full contract details</span>
                </button>

                {!showDeclineConfirm && (
                  <button
                    type="button"
                    onClick={() => setShowDeclineConfirm(true)}
                    className="text-xs font-bold text-red-600 hover:underline"
                  >
                    Decline Offer
                  </button>
                )}
              </div>
            </div>
          )}

          {/* If Accepted: Pay Now */}
          {isAccepted && (
            <div className="space-y-3">
              <PayNowButton offerId={offer.offerId} className="w-full" />
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsDetailsModalOpen(true)}
                  className="text-xs font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-heading)]"
                >
                  View Accepted Contract Terms
                </button>
              </div>
            </div>
          )}

          {/* Decline Confirmation Box */}
          {showDeclineConfirm && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
              <div className="text-xs text-red-800 font-semibold">
                Decline Coaching Offer from {displayName}?
              </div>
              <textarea
                rows={2}
                placeholder="Optional feedback for your coach..."
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                className="w-full p-2 bg-white border border-red-200 rounded-lg text-xs text-[var(--color-text-primary)] placeholder:text-gray-400 focus:outline-none"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDeclineConfirm(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDecline}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600 text-white hover:bg-red-700"
                >
                  Confirm Decline
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Offer Details Full Modal */}
      {isDetailsModalOpen && (
        <OfferDetailsModal
          offer={offer}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          onAccept={handleAccept}
          onDecline={async (_id, reason) => {
            setDeclineReason(reason || '');
            await handleDecline();
          }}
          isClient={true}
        />
      )}
    </div>
  );
};
