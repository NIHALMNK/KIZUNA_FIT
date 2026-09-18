'use client';

import React from 'react';
import Link from 'next/link';
import { PendingCoachingOffer } from '../../domain/types/clientDashboard.types';
import { Button } from '../../../../shared/components/ui/Button';

interface ClientActionCardProps {
  offers?: PendingCoachingOffer[];
}

export const ClientActionCard: React.FC<ClientActionCardProps> = ({ offers = [] }) => {
  const pendingOffer = offers.find((o) => o.status === 'PENDING') || offers[0];

  if (!pendingOffer) return null;

  const priceText = pendingOffer.price
    ? `${pendingOffer.currency || '₹'}${pendingOffer.price.toLocaleString()}`
    : null;

  return (
    <div className="bg-[var(--color-card)] border border-amber-200/80 bg-amber-50/30 rounded-2xl p-6 shadow-xs space-y-4 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700">
          ACTION REQUIRED
        </span>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
          Pending Offer
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-extrabold text-[var(--color-heading)]">
          {pendingOffer.title || 'Coaching Offer'}
        </h3>
        <p className="text-xs text-[var(--color-text-secondary)] font-normal">
          You received a coaching proposal{pendingOffer.trainerName ? ` from ${pendingOffer.trainerName}` : ''}.
        </p>
      </div>

      <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
        <div>
          <span className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase">Duration</span>
          <span className="font-semibold text-[var(--color-text-primary)]">{pendingOffer.durationWeeks} Weeks</span>
        </div>
        {priceText && (
          <div className="text-right">
            <span className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase">Investment</span>
            <span className="font-extrabold text-[var(--color-primary)]">{priceText}</span>
          </div>
        )}
      </div>

      <Link href="/client/offers">
        <Button
          variant="primary"
          size="md"
          fullWidth
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs"
        >
          Review Offer
        </Button>
      </Link>
    </div>
  );
};
