import React from 'react';
import { Metadata } from 'next';
import { TrainerOffersView } from '../../../../modules/offer/presentation/components/TrainerOffersView';
import { PageHeader } from '../../../../shared/components/ui/PageHeader';

export const metadata: Metadata = {
  title: 'Coaching Offers & Proposals | KIZUNAFIT Trainer',
  description: 'Manage customized client package proposals, pricing, and active offers.',
};

export default function TrainerOffersPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Client Package Proposals"
        subtitle="Create, review, and deliver customized coaching offers for clients with completed consultations."
      />
      <TrainerOffersView />
    </div>
  );
}
