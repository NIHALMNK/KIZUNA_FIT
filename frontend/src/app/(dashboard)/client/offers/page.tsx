import React from 'react';
import { Metadata } from 'next';
import { ClientOffersView } from '../../../../modules/offer/presentation/components/ClientOffersView';
import { PageHeader } from '../../../../shared/components/ui/PageHeader';

export const metadata: Metadata = {
  title: 'Coaching Offers | KIZUNAFIT',
  description: 'Review and accept tailored coaching proposals from your certified trainers.',
};

export default function ClientOffersPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Coaching Proposals"
        subtitle="Review personalized coaching packages created for you after your consultation sessions."
      />
      <ClientOffersView />
    </div>
  );
}
