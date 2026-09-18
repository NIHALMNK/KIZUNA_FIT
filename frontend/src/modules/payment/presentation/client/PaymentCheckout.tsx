'use client';

import React from 'react';
import { PaymentPricing } from '../../domain/types/payment.types';
import { PaymentAmountBreakdown } from '../components/PaymentAmountBreakdown';
import { PayNowButton } from '../components/PayNowButton';
import { VerifyPaymentResponseDTO } from '../../domain/types/payment.types';
import { ShieldCheck, Lock } from 'lucide-react';

interface PaymentCheckoutProps {
  offerId: string;
  pricing: PaymentPricing;
  trainerName?: string;
  planTitle?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess: (result: VerifyPaymentResponseDTO) => void;
  onError?: (error: Error) => void;
  className?: string;
}

export const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({
  offerId,
  pricing,
  trainerName = 'Your Certified Coach',
  planTitle = '1-on-1 Monthly Coaching Transformation',
  prefill,
  onSuccess,
  onError,
  className = '',
}) => {
  return (
    <div
      className={`max-w-xl mx-auto bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl ${className}`}
      data-testid="payment-checkout"
    >
      <div className="space-y-2 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>KIZUNAFIT 3-Day Escrow Protection</span>
        </div>
        <h2 className="text-2xl font-extrabold text-[var(--color-text-primary)]">
          Complete Your Coaching Enrollment
        </h2>
        <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto">
          {planTitle} with {trainerName}
        </p>
      </div>

      <PaymentAmountBreakdown pricing={pricing} />

      <div className="space-y-4">
        <PayNowButton offerId={offerId} prefill={prefill} onSuccess={onSuccess} onError={onError} />

        <div className="flex items-center justify-center gap-2 text-xs text-[var(--color-text-tertiary)]">
          <Lock className="w-3.5 h-3.5" />
          <span>256-bit SSL encrypted • Powered by Razorpay</span>
        </div>
      </div>
    </div>
  );
};
