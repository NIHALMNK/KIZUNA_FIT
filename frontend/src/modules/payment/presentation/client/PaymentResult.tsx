'use client';

import React from 'react';
import { VerifyPaymentResponseDTO } from '../../domain/types/payment.types';
import { CheckCircle2, ArrowRight, FileText } from 'lucide-react';
import Link from 'next/link';

interface PaymentResultProps {
  result: VerifyPaymentResponseDTO;
  dashboardHref?: string;
  className?: string;
}

export const PaymentResult: React.FC<PaymentResultProps> = ({
  result,
  dashboardHref = '/client/dashboard',
  className = '',
}) => {
  return (
    <div
      className={`max-w-md mx-auto bg-[var(--color-card)] border border-emerald-500/30 rounded-3xl p-8 text-center space-y-6 shadow-xl ${className}`}
      data-testid="payment-result"
    >
      <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Payment Verified & Confirmed
        </span>
        <h2 className="text-2xl font-extrabold text-[var(--color-text-primary)]">
          Welcome to Your Program!
        </h2>
        <p className="text-xs text-[var(--color-text-secondary)]">
          Your coaching package is now active. Your coach has been notified and will initialize your
          personalized program.
        </p>
      </div>

      <div className="bg-[var(--color-surface-subtle)] p-4 rounded-xl text-xs space-y-1.5 border border-[var(--color-border)] text-left">
        <div className="flex justify-between">
          <span className="text-[var(--color-text-secondary)]">Payment Reference</span>
          <span className="font-mono text-[var(--color-text-primary)]">{result.paymentId}</span>
        </div>
        {result.providerPaymentId && (
          <div className="flex justify-between">
            <span className="text-[var(--color-text-secondary)]">Gateway ID</span>
            <span className="font-mono text-[var(--color-text-primary)]">
              {result.providerPaymentId}
            </span>
          </div>
        )}
      </div>

      <Link
        href={dashboardHref}
        className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg transition-all"
        data-testid="dashboard-link"
      >
        <span>Go to Coaching Dashboard</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};
