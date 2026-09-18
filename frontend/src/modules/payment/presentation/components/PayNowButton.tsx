'use client';

import React from 'react';
import { usePaymentCheckout, CheckoutParams } from '../../application/hooks/usePaymentCheckout';
import { VerifyPaymentResponseDTO } from '../../domain/types/payment.types';
import { CreditCard, Loader2 } from 'lucide-react';

export interface PayNowButtonProps {
  offerId: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess?: (result: VerifyPaymentResponseDTO) => void;
  onError?: (error: Error) => void;
  className?: string;
  label?: string;
  disabled?: boolean;
}

export const PayNowButton: React.FC<PayNowButtonProps> = ({
  offerId,
  prefill,
  onSuccess,
  onError,
  className = '',
  label = 'Pay Now & Activate Coaching',
  disabled = false,
}) => {
  const { startCheckout, isProcessing, error } = usePaymentCheckout();

  const handleCheckout = async () => {
    if (isProcessing || disabled || !offerId) return;

    try {
      const result = await startCheckout({
        offerId,
        prefill,
        onError: (err) => {
          if (onError) onError(err);
        },
      });

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err: unknown) {
      if (onError && err instanceof Error) {
        onError(err);
      }
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={isProcessing || disabled}
        className={`w-full relative inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white text-sm tracking-wide bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20 ${className}`}
        data-testid="pay-now-button"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 text-white" />
            <span>{label}</span>
          </>
        )}
      </button>

      {error && (
        <p className="text-xs text-rose-500 font-medium mt-1 text-center" role="alert">
          {error.message || 'Payment initiation failed. Please try again.'}
        </p>
      )}
    </div>
  );
};
