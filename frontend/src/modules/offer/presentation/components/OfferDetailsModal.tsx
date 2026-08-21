'use client';

import React, { useState } from 'react';
import { CoachingOfferResponseDTO, CoachingOfferStatus } from '../../domain/types/offer.types';
import { OfferStatusBadge } from './OfferStatusBadge';
import { Button } from '../../../../shared/components/ui/Button';

interface OfferDetailsModalProps {
  offer: CoachingOfferResponseDTO | null;
  isOpen: boolean;
  onClose: () => void;
  onAccept?: (offerId: string) => Promise<void>;
  onDecline?: (offerId: string, reason?: string) => Promise<void>;
  onSend?: (offerId: string) => Promise<void>;
  isClient?: boolean;
}

export const OfferDetailsModal: React.FC<OfferDetailsModalProps> = ({
  offer,
  isOpen,
  onClose,
  onAccept,
  onDecline,
  onSend,
  isClient = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeclineReason, setShowDeclineReason] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  if (!isOpen || !offer) return null;

  const handleAccept = async () => {
    if (!onAccept) return;
    try {
      setIsSubmitting(true);
      await onAccept(offer.offerId);
      onClose();
    } catch {
      // Handled by hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = async () => {
    if (!onDecline) return;
    try {
      setIsSubmitting(true);
      await onDecline(offer.offerId, declineReason);
      setShowDeclineReason(false);
      onClose();
    } catch {
      // Handled by hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSend = async () => {
    if (!onSend) return;
    try {
      setIsSubmitting(true);
      await onSend(offer.offerId);
      onClose();
    } catch {
      // Handled by hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedExpiresAt = new Date(offer.expiresAt).toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const commissionPercent = offer.pricing.commissionRate
    ? Math.round(offer.pricing.commissionRate * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[var(--color-border)] pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-[var(--color-heading)] tracking-tight">
                {offer.scope.planType} Plan
              </h2>
              <OfferStatusBadge status={offer.status} />
            </div>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Proposal ID: <span className="font-mono">{offer.offerId}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors p-1 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Pricing Breakdown Card */}
        <div className="p-4 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
              Commercial Terms
            </h4>
            {commissionPercent > 0 && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                {commissionPercent}% Platform Fee
              </span>
            )}
          </div>

          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-[var(--color-text-secondary)] text-xs">
              <span>Trainer Coaching Fee</span>
              <span className="font-semibold text-[var(--color-text-primary)]">
                {offer.pricing.currency} {offer.pricing.trainerFee.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between text-[var(--color-text-secondary)] text-xs">
              <span>Platform Service Fee</span>
              <span className="font-semibold text-[var(--color-text-secondary)]">
                {offer.pricing.currency} {offer.pricing.platformFee.toLocaleString()}
              </span>
            </div>

            <div className="border-t border-[var(--color-border)] pt-2 flex justify-between font-black text-base text-[var(--color-heading)]">
              <span>Total Investment</span>
              <span className="text-[var(--color-primary)] font-mono">
                {offer.pricing.currency} {offer.pricing.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Scope & Deliverables */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <span className="block text-[var(--color-text-muted)] mb-1 text-[10px] font-bold uppercase">
                Coaching Cycle
              </span>
              <span className="font-extrabold text-[var(--color-text-primary)] text-sm">
                {offer.scope.durationDays} Days (1 Month)
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <span className="block text-[var(--color-text-muted)] mb-1 text-[10px] font-bold uppercase">
                Offer Expiration
              </span>
              <span className="font-extrabold text-[var(--color-text-primary)] text-sm">
                {formattedExpiresAt}
              </span>
            </div>
          </div>

          {offer.scope.includedFeatures && offer.scope.includedFeatures.length > 0 && (
            <div className="space-y-2 p-3.5 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]">
              <span className="text-xs font-bold text-[var(--color-text-primary)] block">
                Included Deliverables & Entitlements:
              </span>
              <ul className="grid grid-cols-1 gap-1.5 text-xs text-[var(--color-text-secondary)]">
                {offer.scope.includedFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {offer.scope.trainerNotes && (
            <div className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs space-y-1">
              <span className="font-bold text-[var(--color-text-primary)]">Trainer Notes:</span>
              <p className="text-[var(--color-text-secondary)] italic">
                &ldquo;{offer.scope.trainerNotes}&rdquo;
              </p>
            </div>
          )}

          {offer.declineReason && (
            <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-200 text-xs space-y-1 dark:bg-rose-950/20 dark:border-rose-900/40">
              <span className="font-bold text-rose-700 dark:text-rose-400">Decline Reason:</span>
              <p className="text-rose-600 dark:text-rose-300">{offer.declineReason}</p>
            </div>
          )}
        </div>

        {/* Decline Reason Input (Client) */}
        {showDeclineReason && (
          <div className="space-y-2 p-3 bg-rose-50/30 border border-rose-200 rounded-xl">
            <label className="block text-xs font-bold text-rose-800">
              Reason for declining (optional):
            </label>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="e.g. Budget constraints, schedule conflicts..."
              rows={2}
              className="w-full text-xs p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] focus:outline-hidden"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeclineReason(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleDecline} isLoading={isSubmitting}>
                Confirm Decline
              </Button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--color-border)]">
          <Button variant="outline" size="md" onClick={onClose} disabled={isSubmitting}>
            Close
          </Button>

          {isClient && offer.status === CoachingOfferStatus.SENT && !showDeclineReason && (
            <>
              <Button
                variant="danger"
                size="md"
                onClick={() => setShowDeclineReason(true)}
                disabled={isSubmitting}
              >
                Decline
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleAccept}
                isLoading={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 font-bold"
              >
                Accept & Proceed to Payment
              </Button>
            </>
          )}

          {!isClient && offer.status === CoachingOfferStatus.DRAFT && (
            <Button
              variant="primary"
              size="md"
              onClick={handleSend}
              isLoading={isSubmitting}
              className="bg-amber-600 hover:bg-amber-700 font-bold"
            >
              Send Offer to Client
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
