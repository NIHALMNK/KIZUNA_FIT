/**
 * KIZUNAFIT - Razorpay Checkout Adapter
 * Pure TypeScript adapter for dynamically loading and invoking Razorpay Checkout Modal.
 *
 * Security Invariants:
 * - NO server secrets (RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET) are ever imported or referenced.
 * - Dynamic script loading on-demand with singleton script guard.
 * - Client receives callback data and delegates verification authority to backend.
 */

export interface RazorpayCheckoutOptions {
  keyId: string;
  providerOrderId: string;
  amount: number; // in major unit (INR) or minor unit
  currency: string;
  name?: string;
  description?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  themeColor?: string;
  onSuccess: (response: {
    providerPaymentId: string;
    providerOrderId: string;
    signature: string;
  }) => void;
  onDismiss?: () => void;
  onError?: (error: Error) => void;
}

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export class RazorpayCheckoutAdapter {
  private static scriptLoadingPromise: Promise<boolean> | null = null;
  private static readonly RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

  /**
   * Dynamically loads the Razorpay checkout script with singleton caching.
   */
  public static async loadScript(): Promise<boolean> {
    if (typeof window === 'undefined') {
      return false;
    }

    if (window.Razorpay) {
      return true;
    }

    if (this.scriptLoadingPromise) {
      return this.scriptLoadingPromise;
    }

    this.scriptLoadingPromise = new Promise<boolean>((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${this.RAZORPAY_SCRIPT_URL}"]`);

      if (existingScript) {
        if (window.Razorpay) {
          resolve(true);
          return;
        }
        existingScript.addEventListener('load', () => resolve(true));
        existingScript.addEventListener('error', () =>
          reject(new Error('Failed to load Razorpay SDK.')),
        );
        return;
      }

      const script = document.createElement('script');
      script.src = this.RAZORPAY_SCRIPT_URL;
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => {
        RazorpayCheckoutAdapter.scriptLoadingPromise = null;
        reject(new Error('Failed to load Razorpay checkout script from CDN.'));
      };

      document.body.appendChild(script);
    });

    return this.scriptLoadingPromise;
  }

  /**
   * Opens the Razorpay Checkout modal with the provided server-generated order parameters.
   */
  public static async openCheckout(options: RazorpayCheckoutOptions): Promise<void> {
    try {
      const isLoaded = await this.loadScript();
      if (!isLoaded || !window.Razorpay) {
        throw new Error('Razorpay SDK is not available.');
      }

      // Razorpay expects amount in paise for INR if major unit is provided
      const amountInPaise =
        options.currency.toUpperCase() === 'INR' && options.amount < 100000
          ? Math.round(options.amount * 100)
          : options.amount;

      const rzpOptions = {
        key: options.keyId,
        amount: amountInPaise,
        currency: options.currency.toUpperCase(),
        name: options.name || 'KIZUNAFIT',
        description: options.description || 'Monthly Coaching Package',
        order_id: options.providerOrderId,
        prefill: options.prefill || {},
        theme: {
          color: options.themeColor || '#10B981', // Emerald primary
        },
        modal: {
          ondismiss: () => {
            if (options.onDismiss) {
              options.onDismiss();
            }
          },
        },
        handler: (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          options.onSuccess({
            providerPaymentId: response.razorpay_payment_id,
            providerOrderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
          });
        },
      };

      const rzp = new window.Razorpay(rzpOptions);

      if (options.onError) {
        rzp.on('payment.failed', (response: any) => {
          options.onError!(new Error(response.error?.description || 'Payment failed at gateway.'));
        });
      }

      rzp.open();
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Unable to open checkout modal.');
      if (options.onError) {
        options.onError(error);
      } else {
        throw error;
      }
    }
  }
}
