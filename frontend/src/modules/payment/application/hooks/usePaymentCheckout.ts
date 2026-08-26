/**
 * KIZUNAFIT - Payment Checkout Orchestration Hook
 * Coordinates: Accepted Offer -> Backend Initiation -> Razorpay Modal -> Backend Verification -> Cache Invalidation.
 *
 * Security Invariants:
 * - Frontend NEVER marks payment SUCCESS based only on Razorpay client-side callback.
 * - Server verification is mandatory and authoritative.
 */

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useInitiatePayment } from '../mutations/useInitiatePayment';
import { useVerifyPayment } from '../mutations/useVerifyPayment';
import { RazorpayCheckoutAdapter } from '../../infrastructure/providers/razorpayCheckout';
import { VerifyPaymentResponseDTO } from '../../domain/types/payment.types';
import { PAYMENT_QUERY_KEYS } from '../queryKeys';

export interface CheckoutParams {
  offerId: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onDismiss?: () => void;
  onError?: (error: Error) => void;
}

export const usePaymentCheckout = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const queryClient = useQueryClient();
  const initiateMutation = useInitiatePayment();
  const verifyMutation = useVerifyPayment();

  const startCheckout = async (params: CheckoutParams): Promise<VerifyPaymentResponseDTO> => {
    setIsProcessing(true);
    setError(null);

    return new Promise<VerifyPaymentResponseDTO>(async (resolve, reject) => {
      try {
        // 1. Initiate or resolve existing payment on backend
        const initResponse = await initiateMutation.mutateAsync({
          offerId: params.offerId,
        });

        // 2. Open Razorpay Checkout modal
        await RazorpayCheckoutAdapter.openCheckout({
          keyId: initResponse.keyId,
          providerOrderId: initResponse.providerOrderId,
          amount: initResponse.amount,
          currency: initResponse.currency,
          prefill: params.prefill,
          onDismiss: () => {
            setIsProcessing(false);
            if (params.onDismiss) {
              params.onDismiss();
            }
          },
          onError: (checkoutErr) => {
            setIsProcessing(false);
            setError(checkoutErr);
            if (params.onError) {
              params.onError(checkoutErr);
            }
            reject(checkoutErr);
          },
          onSuccess: async (rzpPayload) => {
            try {
              // 3. Cryptographically verify signature on backend
              const verifyResult = await verifyMutation.mutateAsync({
                paymentId: initResponse.paymentId,
                payload: {
                  providerPaymentId: rzpPayload.providerPaymentId,
                  providerOrderId: rzpPayload.providerOrderId,
                  signature: rzpPayload.signature,
                },
              });

              setIsProcessing(false);
              resolve(verifyResult);
            } catch (verifyErr: unknown) {
              const err =
                verifyErr instanceof Error
                  ? verifyErr
                  : new Error('Payment verification failed on server.');
              setIsProcessing(false);
              setError(err);
              if (params.onError) {
                params.onError(err);
              }
              reject(err);
            }
          },
        });
      } catch (initErr: unknown) {
        const err = initErr instanceof Error ? initErr : new Error('Payment initiation failed.');

        if (
          err.message.includes('already exists') ||
          err.message.includes('succeeded') ||
          err.message.includes('409')
        ) {
          // If payment was already completed or exists, refresh authoritative offer and coaching state
          queryClient.invalidateQueries({ queryKey: ['offers'] });
          queryClient.invalidateQueries({ queryKey: ['client-dashboard'] });
          queryClient.invalidateQueries({ queryKey: PAYMENT_QUERY_KEYS.all });
        }

        setIsProcessing(false);
        setError(err);
        if (params.onError) {
          params.onError(err);
        }
        reject(err);
      }
    });
  };

  return {
    startCheckout,
    isProcessing: isProcessing || initiateMutation.isPending || verifyMutation.isPending,
    error: error || initiateMutation.error || verifyMutation.error,
  };
};
