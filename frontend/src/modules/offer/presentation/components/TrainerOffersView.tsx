'use client';

import React, { useState } from 'react';
import { useSentOffers } from '../../application/hooks/useOffers';
import { useOfferActions } from '../../application/hooks/useOfferActions';
import {
  CoachingOfferResponseDTO,
  CoachingOfferStatus,
  CreateOfferPayload,
} from '../../domain/types/offer.types';
import { OfferCard } from './OfferCard';
import { OfferDetailsModal } from './OfferDetailsModal';
import { CreateOfferModal } from './CreateOfferModal';
import { Button } from '../../../../shared/components/ui/Button';

export const TrainerOffersView: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<CoachingOfferStatus | 'ALL'>('ALL');
  const [activeOffer, setActiveOffer] = useState<CoachingOfferResponseDTO | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const queryParams = selectedStatus === 'ALL' ? undefined : { status: selectedStatus };
  const { data, isLoading, error, refetch } = useSentOffers(queryParams);
  const { createOffer, sendOffer } = useOfferActions();

  const offers = data?.offers || [];

  const handleOpenDetails = (offer: CoachingOfferResponseDTO) => {
    setActiveOffer(offer);
    setIsDetailsOpen(true);
  };

  const handleCreateOffer = async (payload: CreateOfferPayload) => {
    await createOffer(payload);
    refetch();
  };

  const handleSendOffer = async (offerId: string) => {
    await sendOffer(offerId);
    refetch();
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4">
        {/* Filter tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {(
            [
              'ALL',
              CoachingOfferStatus.DRAFT,
              CoachingOfferStatus.SENT,
              CoachingOfferStatus.ACCEPTED,
              CoachingOfferStatus.DECLINED,
              CoachingOfferStatus.EXPIRED,
            ] as const
          ).map((statusKey) => (
            <button
              key={statusKey}
              onClick={() => setSelectedStatus(statusKey)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                selectedStatus === statusKey
                  ? 'bg-[var(--color-primary)] text-white shadow-xs'
                  : 'bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {statusKey === 'ALL'
                ? 'All Offers'
                : statusKey === CoachingOfferStatus.DRAFT
                  ? 'Drafts'
                  : statusKey === CoachingOfferStatus.SENT
                    ? 'Sent'
                    : statusKey === CoachingOfferStatus.ACCEPTED
                      ? 'Accepted'
                      : statusKey === CoachingOfferStatus.DECLINED
                        ? 'Declined'
                        : 'Expired'}
            </button>
          ))}
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsCreateOpen(true)}
          className="bg-amber-600 hover:bg-amber-700 font-bold whitespace-nowrap"
        >
          + Create Offer
        </Button>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs dark:bg-rose-950/30 dark:border-rose-800 dark:text-rose-300">
          Failed to load coaching proposals. Please try again.
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] animate-pulse space-y-4"
            >
              <div className="h-4 bg-[var(--color-surface-hover)] rounded-md w-1/3" />
              <div className="h-6 bg-[var(--color-surface-hover)] rounded-md w-2/3" />
              <div className="h-12 bg-[var(--color-surface-hover)] rounded-md w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && offers.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-[var(--color-surface)] border border-dashed border-[var(--color-border)] space-y-3">
          <div className="w-12 h-12 rounded-full bg-[var(--color-surface-hover)] flex items-center justify-center mx-auto text-xl">
            📝
          </div>
          <h3 className="text-base font-extrabold text-[var(--color-heading)]">
            No Coaching Proposals Yet
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto">
            After completing a client consultation, create a formal coaching package offer to start
            the client relationship.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="mt-2 text-xs"
          >
            Create Your First Offer
          </Button>
        </div>
      )}

      {/* Offers Grid */}
      {!isLoading && offers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {offers.map((offer) => (
            <OfferCard
              key={offer.offerId}
              offer={offer}
              onSelect={handleOpenDetails}
              onSend={handleSendOffer}
              isClient={false}
            />
          ))}
        </div>
      )}

      {/* Details Modal */}
      <OfferDetailsModal
        offer={activeOffer}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setActiveOffer(null);
        }}
        onSend={handleSendOffer}
        isClient={false}
      />

      {/* Create Modal */}
      <CreateOfferModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateOffer}
      />
    </div>
  );
};
