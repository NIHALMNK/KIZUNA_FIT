'use client';

import React, { useState } from 'react';
import { AdminPaymentList } from '../../../../modules/payment/presentation/admin/AdminPaymentList';
import { AdminPaymentDetails } from '../../../../modules/payment/presentation/admin/AdminPaymentDetails';
import { PageHeader } from '../../../../shared/components/ui/PageHeader';

export default function AdminPaymentsPage() {
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Payment & Payout Administration"
        subtitle="Global oversight of marketplace transactions, escrow releases, exceptional refunds, disputes, and Razorpay Route transfers."
      />

      {selectedPaymentId ? (
        <AdminPaymentDetails
          paymentId={selectedPaymentId}
          onBack={() => setSelectedPaymentId(null)}
        />
      ) : (
        <AdminPaymentList onSelectPayment={(paymentId) => setSelectedPaymentId(paymentId)} />
      )}
    </div>
  );
}
