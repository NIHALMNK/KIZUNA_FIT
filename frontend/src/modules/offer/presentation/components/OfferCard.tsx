'use client';

import React from 'react';
import Link from 'next/link';
import { CoachingOfferResponseDTO, CoachingOfferStatus } from '../../domain/types/offer.types';
import { PaymentSummary, PaymentStatus } from '../../../payment/domain/types/payment.types';
import { OfferStatusBadge } from './OfferStatusBadge';
import { Button } from '../../../../shared/components/ui/Button';
import { PayNowButton } from '../../../payment/presentation/components/PayNowButton';
import { CheckCircle2, Sparkles, Loader2, AlertCircle } from 'lucide-react';

interface OfferCardProps {
  offer: CoachingOfferResponseDTO;
  payment?: PaymentSummary | null;
  onSelect: (offer: CoachingOfferResponseDTO) => void;
  onAccept?: (offerId: string) => Promise<void>;
  onDecline?: (offerId: string) => void;
  onSend?: (offerId: string) => Promise<void>;
  isClient?: boolean;
}

export const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  payment,
  onSelect,
  onAccept,
  onDecline,
  onSend,
  isClient = false,
}) => {
  const isExpiringSoon =
    offer.status === CoachingOfferStatus.SENT &&
    new Date(offer.expiresAt).getTime() - Date.now() < 24 * 60 * 60 * 1000;

  const commissionPercent = offer.pricing.commissionRate
    ? Math.round(offer.pricing.commissionRate * 100)
    : null;

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-xs space-y-4 hover:border-[var(--color-primary)]/50 transition-all duration-200">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)] font-mono">
              {offer.offerId.slice(-8)}
            </span>
            <OfferStatusBadge status={offer.status} />
          </div>
          <h3 className="text-base font-extrabold text-[var(--color-heading)] tracking-tight">
            {offer.scope.planType} Plan
          </h3>
        </div>

        <div className="text-right">
          <span className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase">
            Total Investment
          </span>
          <span className="text-base font-extrabold text-[var(--color-primary)] font-mono">
            {offer.pricing.currency} {offer.pricing.totalAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Info bar */}
      <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
        <div>
          <span className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase">
            Cycle Duration
          </span>
          <span className="font-semibold text-[var(--color-text-primary)]">
            {offer.scope.durationDays} Days (1 Mo)
          </span>
        </div>

        {commissionPercent !== null && !isClient && (
          <div>
            <span className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase">
              Platform Fee
            </span>
            <span className="font-semibold text-[var(--color-text-secondary)]">
              {commissionPercent}%
            </span>
          </div>
        )}

        <div className="text-right">
          <span className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase">
            Valid Until
          </span>
          <span
            className={`font-semibold ${
              isExpiringSoon
                ? 'text-rose-500 font-bold animate-pulse'
                : 'text-[var(--color-text-primary)]'
            }`}
          >
            {new Date(offer.expiresAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Feature tags */}
      {offer.scope.includedFeatures && offer.scope.includedFeatures.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {offer.scope.includedFeatures.slice(0, 3).map((feat, idx) => (
            <span
              key={idx}
              className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-text-secondary)] font-medium"
            >
              ✓ {feat}
            </span>
          ))}
          {offer.scope.includedFeatures.length > 3 && (
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] font-medium">
              +{offer.scope.includedFeatures.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Payment Success & Coaching Status Banner */}
      {isClient &&
        offer.status === CoachingOfferStatus.ACCEPTED &&
        payment?.status === PaymentStatus.SUCCESS && (
          <div
            className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
            data-testid="payment-success-state"
          >
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
              data-testid="payment-successful-badge"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Payment Successful</span>
            </span>
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-700 dark:text-teal-300"
              data-testid="coaching-activated-badge"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Coaching Activated</span>
            </span>
          </div>
        )}

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--color-border)]">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSelect(offer)}
          className="text-xs font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          View Full Offer
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          {isClient && offer.status === CoachingOfferStatus.ACCEPTED && (
            <>
              {/* NO PAYMENT: show Pay & Activate */}
              {!payment && (
                <PayNowButton
                  offerId={offer.offerId}
                  label="Pay & Activate"
                  className="!w-auto !py-1.5 !px-3.5 !text-xs !bg-emerald-600 hover:!bg-emerald-500 !text-white font-bold"
                />
              )}

              {/* PAYMENT CREATED: show Continue Payment */}
              {payment?.status === PaymentStatus.CREATED && (
                <PayNowButton
                  offerId={offer.offerId}
                  label="Continue Payment"
                  className="!w-auto !py-1.5 !px-3.5 !text-xs !bg-amber-600 hover:!bg-amber-500 !text-white font-bold"
                />
              )}

              {/* PAYMENT PROCESSING: show Payment Processing indicator and hide Pay button */}
              {payment?.status === PaymentStatus.PROCESSING && (
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold"
                  data-testid="payment-processing-state"
                >
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Payment Processing</span>
                </div>
              )}

              {/* PAYMENT SUCCESS: Action buttons */}
              {payment?.status === PaymentStatus.SUCCESS && (
                <div className="flex flex-wrap items-center gap-2">
                  <Link href="/client/payments">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs font-bold !py-1.5 !px-3"
                      data-testid="view-payment-action"
                    >
                      View Payment
                    </Button>
                  </Link>
                  <Link href="/client/coaching">
                    <Button
                      variant="primary"
                      size="sm"
                      className="text-xs font-bold !py-1.5 !px-3 bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                      Go to Coaching &rarr;
                    </Button>
                  </Link>
                </div>
              )}

              {/* PAYMENT FAILED: show Payment Failed with Retry action */}
              {payment?.status === PaymentStatus.FAILED && (
                <div className="flex items-center gap-2" data-testid="payment-failed-state">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Failed</span>
                  </span>
                  <PayNowButton
                    offerId={offer.offerId}
                    label="Retry Payment"
                    className="!w-auto !py-1.5 !px-3.5 !text-xs !bg-rose-600 hover:!bg-rose-500 !text-white font-bold"
                  />
                </div>
              )}

              {/* PAYMENT REFUNDED: hide Pay button, show Payment Refunded */}
              {payment?.status === PaymentStatus.REFUNDED && (
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400"
                  data-testid="payment-refunded-state"
                >
                  <span>Payment Refunded</span>
                </span>
              )}
            </>
          )}

          {isClient && offer.status === CoachingOfferStatus.SENT && (
            <>
              {onDecline && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDecline(offer.offerId)}
                  className="text-xs text-rose-600 hover:bg-rose-50 border-rose-200"
                >
                  Decline
                </Button>
              )}
              {onAccept && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onAccept(offer.offerId)}
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 font-bold"
                >
                  Accept
                </Button>
              )}
            </>
          )}

          {!isClient && offer.status === CoachingOfferStatus.DRAFT && onSend && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onSend(offer.offerId)}
              className="text-xs bg-amber-600 hover:bg-amber-700 font-bold"
            >
              Send Proposal
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
