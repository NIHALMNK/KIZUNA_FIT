'use client';

import React, { useState } from 'react';
import { NutritionFeedback } from '../../domain/types/nutrition.types';
import { Button } from '../../../../shared/components/ui/Button';
import { Label } from '../../../../shared/components/ui/Label';
import { Textarea } from '../../../../shared/components/ui/Textarea';
import { Star, Zap, ThumbsUp, X, Sparkles } from 'lucide-react';

interface NutritionFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: NutritionFeedback) => Promise<void>;
  isLoading?: boolean;
}

export const NutritionFeedbackModal: React.FC<NutritionFeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [energyLevel, setEnergyLevel] = useState<number>(4);
  const [adherenceConfidence, setAdherenceConfidence] = useState<number>(5);
  const [digestionNotes, setDigestionNotes] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const feedback: NutritionFeedback = {
      rating,
      energyLevel,
      adherenceConfidence,
      digestionNotes: digestionNotes.trim() || undefined,
      notes: notes.trim() || undefined,
    };
    await onSubmit(feedback);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl p-6 space-y-5 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--color-primary)]" />
            <h3 className="text-base font-bold text-[var(--color-heading)]">
              Complete Daily Nutrition Log
            </h3>
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
          Record your daily nutrition experience and submit your final daily log. Once completed,
          this log becomes read-only.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center justify-between">
              <span>Overall Day Rating</span>
              <span className="text-[var(--color-primary)] font-bold">{rating} / 5</span>
            </Label>
            <div className="flex items-center gap-2 justify-center py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={`star-${star}`}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1.5 rounded-lg transition-transform hover:scale-110 ${
                    rating >= star ? 'text-amber-400' : 'text-[var(--color-text-muted)]'
                  }`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
            </div>
          </div>

          {/* Energy Level */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Energy Level Today
              </span>
              <span className="text-[var(--color-heading)] font-bold">{energyLevel} / 5</span>
            </Label>
            <input
              type="range"
              min={1}
              max={5}
              value={energyLevel}
              onChange={(e) => setEnergyLevel(Number(e.target.value))}
              className="w-full accent-[var(--color-primary)] cursor-pointer"
            />
          </div>

          {/* Adherence Confidence */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ThumbsUp className="w-3.5 h-3.5 text-blue-500" />
                Plan Adherence Feeling
              </span>
              <span className="text-[var(--color-heading)] font-bold">
                {adherenceConfidence} / 5
              </span>
            </Label>
            <input
              type="range"
              min={1}
              max={5}
              value={adherenceConfidence}
              onChange={(e) => setAdherenceConfidence(Number(e.target.value))}
              className="w-full accent-[var(--color-primary)] cursor-pointer"
            />
          </div>

          {/* Digestion Notes */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Digestion / Gut Notes</Label>
            <Textarea
              value={digestionNotes}
              onChange={(e) => setDigestionNotes(e.target.value)}
              placeholder="Bloating, hunger levels, water retention..."
              rows={2}
              className="rounded-xl text-xs"
            />
          </div>

          {/* General Notes */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">General Daily Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Cravings, meal timings, supplements taken..."
              rows={2}
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
              {isLoading ? 'Completing Day...' : 'Finish & Complete Day'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
