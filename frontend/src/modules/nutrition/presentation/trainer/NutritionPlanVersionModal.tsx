'use client';

import React, { useState } from 'react';
import { NutritionPlan, CreateNutritionPlanVersionDTO } from '../../domain/types/nutrition.types';
import { Button } from '../../../../shared/components/ui/Button';
import { Input } from '../../../../shared/components/ui/Input';
import { Label } from '../../../../shared/components/ui/Label';
import { Textarea } from '../../../../shared/components/ui/Textarea';
import { Sparkles, X } from 'lucide-react';

interface NutritionPlanVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  basePlan: NutritionPlan | null;
  onSubmit: (payload: CreateNutritionPlanVersionDTO) => Promise<void>;
  isLoading?: boolean;
}

export const NutritionPlanVersionModal: React.FC<NutritionPlanVersionModalProps> = ({
  isOpen,
  onClose,
  basePlan,
  onSubmit,
  isLoading = false,
}) => {
  const [title, setTitle] = useState(
    basePlan ? `${basePlan.title} (v${basePlan.version + 1})` : '',
  );
  const [description, setDescription] = useState(basePlan?.description || '');
  const [durationWeeks, setDurationWeeks] = useState(basePlan?.durationWeeks || 4);

  if (!isOpen || !basePlan) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title: title.trim() || undefined,
      description: description.trim() || undefined,
      durationWeeks: Number(durationWeeks) || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl p-6 space-y-5 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--color-primary)]" />
            <h3 className="text-base font-bold text-[var(--color-heading)]">Create New Version</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-alt)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[var(--color-text-secondary)]">
          This will fork <strong>{basePlan.title}</strong> (v{basePlan.version}) into a new{' '}
          <strong>DRAFT</strong> (v{basePlan.version + 1}) preserving all configured days and meals
          for you to adjust.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">New Plan Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Hypertrophy Nutrition Phase 2"
              className="rounded-xl text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Duration (Weeks)</Label>
            <Input
              type="number"
              min={1}
              max={52}
              value={durationWeeks}
              onChange={(e) => setDurationWeeks(Number(e.target.value))}
              className="rounded-xl text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Description / Change Notes</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of caloric or macro adjustments..."
              rows={3}
              className="rounded-xl text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-xl text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isLoading}
              className="rounded-xl text-xs font-bold"
            >
              {isLoading ? 'Creating Version...' : 'Create Draft Version'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
