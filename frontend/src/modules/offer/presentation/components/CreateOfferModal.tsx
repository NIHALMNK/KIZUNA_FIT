'use client';

import React, { useState } from 'react';
import {
  CoachingPlanType,
  CreateOfferPayload,
  PLATFORM_COACHING_PLANS,
} from '../../domain/types/offer.types';
import { Button } from '../../../../shared/components/ui/Button';

interface CreateOfferModalProps {
  consultationId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateOfferPayload) => Promise<void>;
}

export const CreateOfferModal: React.FC<CreateOfferModalProps> = ({
  consultationId: initialConsultationId = '',
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [consultationId, setConsultationId] = useState(initialConsultationId);
  const [selectedPlan, setSelectedPlan] = useState<CoachingPlanType>(CoachingPlanType.PRO);
  const [trainerFee, setTrainerFee] = useState<number>(10000);
  const [currency, setCurrency] = useState('INR');
  const [trainerNotes, setTrainerNotes] = useState(
    'Based on our consultation assessment, this plan is customized to achieve your body composition and strength goals.',
  );
  const [sendImmediately, setSendImmediately] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentPlanDef = PLATFORM_COACHING_PLANS[selectedPlan];
  const platformFee = Math.round((Number(trainerFee) || 0) * currentPlanDef.commissionRate);
  const totalAmount = (Number(trainerFee) || 0) + platformFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const activeConsultationId = initialConsultationId || consultationId;
    if (!activeConsultationId.trim()) {
      setFormError('Consultation ID is required.');
      return;
    }

    if (!trainerFee || trainerFee <= 0) {
      setFormError('Trainer fee must be greater than 0.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        consultationId: activeConsultationId.trim(),
        planType: selectedPlan,
        trainerFee: Number(trainerFee),
        currency: currency.trim(),
        trainerNotes: trainerNotes.trim() || undefined,
        sendImmediately,
      });
      onClose();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to create offer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[var(--color-border)] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-[var(--color-heading)] tracking-tight">
                Create Coaching Proposal
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                30-Day Coaching Cycle
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              Select an authoritative platform plan and set your coaching fee for the client.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors p-1 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {formError &&
          (() => {
            // Parse eligibility error patterns to provide a clear, readable visual hierarchy
            const statusMatch =
              formError.match(/currently '([^']+)'/i) || formError.match(/status '([^']+)'/i);
            const isCompletionError =
              formError.includes('COMPLETED consultations') ||
              formError.toLowerCase().includes('not completed') ||
              formError.includes('SCHEDULED');

            const title = isCompletionError ? 'Cannot Create Offer' : 'Unable to Create Offer';
            const message = isCompletionError
              ? 'Coaching Offers can only be created after the consultation is completed.'
              : formError;
            const currentStatus = statusMatch
              ? statusMatch[1]
              : isCompletionError && formError.includes('SCHEDULED')
                ? 'SCHEDULED'
                : null;

            return (
              <div
                role="alert"
                aria-live="assertive"
                className="p-4 rounded-xl border border-rose-300 dark:border-rose-800/80 border-l-4 border-l-rose-500 bg-rose-50/90 dark:bg-rose-950/40 shadow-xs space-y-2.5 transition-all animate-fadeIn"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none text-rose-600 dark:text-rose-400 font-black">
                    ⚠
                  </span>
                  <h3 className="text-sm font-black text-rose-900 dark:text-rose-100 tracking-tight">
                    {title}
                  </h3>
                </div>

                <p className="text-xs text-rose-800 dark:text-rose-200 leading-relaxed font-medium">
                  {message}
                </p>

                {currentStatus && (
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-rose-200/80 dark:border-rose-900/60 text-xs">
                    <span className="text-rose-700 dark:text-rose-300 font-semibold">
                      Current consultation status:
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-200/80 dark:bg-rose-900/80 text-rose-900 dark:text-rose-100 border border-rose-300 dark:border-rose-700 tracking-wide font-mono">
                      {currentStatus}
                    </span>
                  </div>
                )}
              </div>
            );
          })()}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {!initialConsultationId && (
            <div className="space-y-1">
              <label className="block font-bold text-[var(--color-text-primary)]">
                Consultation ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={consultationId}
                onChange={(e) => setConsultationId(e.target.value)}
                placeholder="consultation_..."
                required
                className="w-full p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-hover)] text-[var(--color-text-primary)] focus:outline-hidden font-mono"
              />
            </div>
          )}

          {/* Plan Comparison & Selector */}
          <div className="space-y-2">
            <label className="block font-bold text-[var(--color-text-primary)]">
              Select Coaching Plan <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(Object.keys(PLATFORM_COACHING_PLANS) as CoachingPlanType[]).map((planKey) => {
                const plan = PLATFORM_COACHING_PLANS[planKey];
                const isSelected = selectedPlan === planKey;
                return (
                  <div
                    key={planKey}
                    onClick={() => setSelectedPlan(planKey)}
                    className={`cursor-pointer rounded-xl p-4 border transition-all relative space-y-2.5 ${
                      isSelected
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 ring-2 ring-[var(--color-primary)]/20 shadow-xs'
                        : 'border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-primary)]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm text-[var(--color-heading)]">
                        {plan.name}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                        {plan.commissionPercent}% Fee
                      </span>
                    </div>

                    <p className="text-[11px] text-[var(--color-text-secondary)] line-clamp-2">
                      {plan.tagline}
                    </p>

                    <div className="pt-1 border-t border-[var(--color-border)]/60 space-y-1 text-[11px]">
                      <div className="font-semibold text-[var(--color-text-primary)]">
                        {plan.liveSessionsDescription}
                      </div>
                      <div className="text-[var(--color-text-muted)]">
                        {plan.includedFeatures.length} Deliverables Included
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pricing Calculation Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)]">
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block font-bold text-[var(--color-text-primary)]">
                  Your Trainer Fee ({currency}) <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-24 p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] font-bold focus:outline-hidden"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                  <input
                    type="number"
                    min={1}
                    value={trainerFee}
                    onChange={(e) => setTrainerFee(Number(e.target.value))}
                    required
                    placeholder="10000"
                    className="flex-1 p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] font-black text-sm focus:outline-hidden"
                  />
                </div>
                <span className="text-[10px] text-[var(--color-text-muted)]">
                  The net coaching fee you will receive upon client settlement.
                </span>
              </div>
            </div>

            {/* Live Financial Breakdown */}
            <div className="p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2 flex flex-col justify-center">
              <div className="flex justify-between text-xs text-[var(--color-text-secondary)]">
                <span>Trainer Fee</span>
                <span className="font-semibold text-[var(--color-text-primary)]">
                  {currency} {(Number(trainerFee) || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs text-[var(--color-text-secondary)]">
                <span>Platform Commission ({currentPlanDef.commissionPercent}%)</span>
                <span className="font-semibold text-[var(--color-text-secondary)]">
                  {currency} {platformFee.toLocaleString()}
                </span>
              </div>
              <div className="border-t border-[var(--color-border)] pt-2 flex justify-between text-sm font-black text-[var(--color-heading)]">
                <span>Total Client Pays</span>
                <span className="text-[var(--color-primary)] font-mono">
                  {currency} {totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Included Features Preview */}
          <div className="space-y-2 p-3.5 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]">
            <span className="font-bold text-[var(--color-text-primary)] block">
              Included Deliverables for {currentPlanDef.name}:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {currentPlanDef.includedFeatures.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-secondary)]"
                >
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
              {currentPlanDef.omittedFeatures.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-muted)] line-through"
                >
                  <span className="text-zinc-400 font-bold">✕</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="block font-bold text-[var(--color-text-primary)]">
              Personalized Notes / Recommendations for Client
            </label>
            <textarea
              value={trainerNotes}
              onChange={(e) => setTrainerNotes(e.target.value)}
              rows={2}
              placeholder="Add tailored notes or instructions discussed in the consultation..."
              className="w-full p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-hover)] text-[var(--color-text-primary)] focus:outline-hidden"
            />
          </div>

          {/* Send Immediately Checkbox */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)]">
            <input
              type="checkbox"
              id="sendImmediately"
              checked={sendImmediately}
              onChange={(e) => setSendImmediately(e.target.checked)}
              className="rounded-sm border-[var(--color-border)] text-[var(--color-primary)]"
            />
            <label
              htmlFor="sendImmediately"
              className="text-xs font-bold text-[var(--color-text-primary)] cursor-pointer"
            >
              Send offer to client immediately (Starts 7-day validity window)
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--color-border)]">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              className="bg-amber-600 hover:bg-amber-700 font-bold"
            >
              {sendImmediately ? 'Create & Send Proposal' : 'Save Draft'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
