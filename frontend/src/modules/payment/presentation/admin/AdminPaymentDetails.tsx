'use client';

import React, { useState } from 'react';
import { usePayment } from '../../application/queries/usePayment';
import { PaymentDetailsView } from '../components/PaymentDetails';
import { PaymentLoading } from '../components/PaymentLoading';
import { PaymentError } from '../components/PaymentError';
import { AdminRefundActionModal } from './AdminRefundActionModal';
import { AdminDisputeActionModal } from './AdminDisputeActionModal';
import { AdminPayoutActionModal } from './AdminPayoutActionModal';

interface AdminPaymentDetailsProps {
  paymentId: string;
  onBack?: () => void;
  className?: string;
}

export const AdminPaymentDetails: React.FC<AdminPaymentDetailsProps> = ({
  paymentId,
  onBack,
  className = '',
}) => {
  const { data: payment, isLoading, error, refetch } = usePayment(paymentId);

  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);

  if (isLoading) {
    return <PaymentLoading message="Loading full payment audit details..." className={className} />;
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
    <div className={`space-y-6 ${className}`} data-testid="admin-payment-details">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
        >
          ← Back to Payments
        </button>
      )}

      <PaymentDetailsView
        payment={payment}
        userRole="ADMIN"
        onRequestRefund={payment.refunds.length > 0 ? () => setIsRefundModalOpen(true) : undefined}
        onRaiseDispute={payment.disputes.length > 0 ? () => setIsDisputeModalOpen(true) : undefined}
        onProcessPayout={() => setIsPayoutModalOpen(true)}
      />

      {/* Admin Action Modals */}
      {payment.refunds.length > 0 && (
        <AdminRefundActionModal
          paymentId={payment.paymentId}
          refund={payment.refunds[0]}
          isOpen={isRefundModalOpen}
          onClose={() => setIsRefundModalOpen(false)}
          onSuccess={() => refetch()}
        />
      )}

      {payment.disputes.length > 0 && (
        <AdminDisputeActionModal
          paymentId={payment.paymentId}
          dispute={payment.disputes[0]}
          isOpen={isDisputeModalOpen}
          onClose={() => setIsDisputeModalOpen(false)}
          onSuccess={() => refetch()}
        />
      )}

      <AdminPayoutActionModal
        payment={payment}
        isOpen={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
};
