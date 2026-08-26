'use client';

import React from 'react';
import { usePayment } from '../../application/queries/usePayment';
import { usePayoutEligibility } from '../../application/queries/usePayoutEligibility';
import { useSettlement } from '../../application/queries/useSettlement';
import { PaymentDetailsView } from '../components/PaymentDetails';
import { PaymentLoading } from '../components/PaymentLoading';
import { PaymentError } from '../components/PaymentError';
import { PayoutStatus } from '../../domain/types/payout.types';

interface TrainerPaymentDetailsProps {
  paymentId: string;
  onRaiseDispute?: () => void;
  className?: string;
}

export const TrainerPaymentDetails: React.FC<TrainerPaymentDetailsProps> = ({
  paymentId,
  onRaiseDispute,
  className = '',
}) => {
  const { data: payment, isLoading, error, refetch } = usePayment(paymentId);
  const { data: eligibility } = usePayoutEligibility(paymentId);
  const { data: settlement } = useSettlement(paymentId, {
    enabled: payment?.payout?.status === PayoutStatus.PAID,
  });

  if (isLoading) {
    return <PaymentLoading message="Loading payment and payout details..." className={className} />;
  }

  if (error || !payment) {
    return (
      <PaymentError
        error={error || new Error('Payment not found')}
        onRetry={() => refetch()}
        className={className}
      />
    );
  }

  return (
    <div className={`space-y-6 ${className}`} data-testid="trainer-payment-details">
      <PaymentDetailsView payment={payment} onRaiseDispute={onRaiseDispute} userRole="TRAINER" />
    </div>
  );
};
