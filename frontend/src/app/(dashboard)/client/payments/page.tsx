'use client';

import React, { useState } from 'react';
import { PaymentHistory } from '../../../../modules/payment/presentation/client/PaymentHistory';
import { PaymentDetailsView } from '../../../../modules/payment/presentation/components/PaymentDetails';
import { usePayment } from '../../../../modules/payment/application/queries/usePayment';
import { ExceptionalRefundModal } from '../../../../modules/payment/presentation/client/ExceptionalRefundModal';
import { RaiseDisputeModal } from '../../../../modules/payment/presentation/client/RaiseDisputeModal';
import { PageHeader } from '../../../../shared/components/ui/PageHeader';
import { PaymentLoading } from '../../../../modules/payment/presentation/components/PaymentLoading';
import { PaymentError } from '../../../../modules/payment/presentation/components/PaymentError';

export default function ClientPaymentsPage() {
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);

  const {
    data: payment,
    isLoading,
    error,
    refetch,
  } = usePayment(selectedPaymentId || '', {
    enabled: Boolean(selectedPaymentId),
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Payment & Billing"
        subtitle="Manage your coaching package payments, escrow guarantees, tax invoices, and service-failure protections."
      />

      {selectedPaymentId ? (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setSelectedPaymentId(null)}
            className="text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            ← Back to Payment History
          </button>

          {isLoading ? (
            <PaymentLoading message="Loading payment details..." />
          ) : error || !payment ? (
            <PaymentError
              error={error || new Error('Payment not found')}
              onRetry={() => refetch()}
            />
          ) : (
            <>
              <PaymentDetailsView
                payment={payment}
                userRole="CLIENT"
                onRequestRefund={() => setIsRefundModalOpen(true)}
                onRaiseDispute={() => setIsDisputeModalOpen(true)}
              />

              <ExceptionalRefundModal
                paymentId={payment.paymentId}
                isOpen={isRefundModalOpen}
                onClose={() => setIsRefundModalOpen(false)}
                onSuccess={() => refetch()}
              />

              <RaiseDisputeModal
                paymentId={payment.paymentId}
                isOpen={isDisputeModalOpen}
                onClose={() => setIsDisputeModalOpen(false)}
                onSuccess={() => refetch()}
              />
            </>
          )}
        </div>
      ) : (
        <PaymentHistory onSelectPayment={(paymentId) => setSelectedPaymentId(paymentId)} />
      )}
    </div>
  );
}
