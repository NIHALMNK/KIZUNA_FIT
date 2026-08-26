'use client';

import React, { useState } from 'react';
import { TrainerPaymentHistory } from '../../../../modules/payment/presentation/trainer/TrainerPaymentHistory';
import { TrainerPaymentDetails } from '../../../../modules/payment/presentation/trainer/TrainerPaymentDetails';
import { PaymentEarningsSummary } from '../../../../modules/payment/presentation/trainer/PaymentEarningsSummary';
import { usePayments } from '../../../../modules/payment/application/queries/usePayments';
import { PageHeader } from '../../../../shared/components/ui/PageHeader';
import { RaiseDisputeModal } from '../../../../modules/payment/presentation/client/RaiseDisputeModal';

export default function TrainerPaymentsPage() {
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);

  const { data: paymentsData } = usePayments({ page: 1, limit: 100 });
  const payments = paymentsData?.data || [];

  // Compute summary metrics purely from server-provided payment properties
  const totalSettled = payments
    .filter((p) => p.status === 'SUCCESS' && p.payout?.status === 'PAID' && !p.hasActiveDispute)
    .reduce((sum, p) => sum + (p.settlement?.trainerAmount ?? p.pricing.trainerFee), 0);

  const escrowPending = payments
    .filter((p) => p.status === 'SUCCESS' && p.payout?.status !== 'PAID' && !p.hasActiveDispute)
    .reduce((sum, p) => sum + p.pricing.trainerFee, 0);

  const disputeLocked = payments
    .filter((p) => p.hasActiveDispute)
    .reduce((sum, p) => sum + p.pricing.trainerFee, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Coaching Earnings & Payouts"
        subtitle="Review your earned coaching revenue, 3-day escrow clearance periods, and bank transfer settlements."
      />

      <PaymentEarningsSummary
        totalSettled={totalSettled}
        escrowPending={escrowPending}
        disputeLocked={disputeLocked}
        currency="INR"
      />

      {selectedPaymentId ? (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setSelectedPaymentId(null)}
            className="text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            ← Back to All Payments
          </button>

          <TrainerPaymentDetails
            paymentId={selectedPaymentId}
            onRaiseDispute={() => setIsDisputeModalOpen(true)}
          />

          <RaiseDisputeModal
            paymentId={selectedPaymentId}
            isOpen={isDisputeModalOpen}
            onClose={() => setIsDisputeModalOpen(false)}
          />
        </div>
      ) : (
        <TrainerPaymentHistory onSelectPayment={(paymentId) => setSelectedPaymentId(paymentId)} />
      )}
    </div>
  );
}
