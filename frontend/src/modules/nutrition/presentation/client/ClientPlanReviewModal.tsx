'use client';

import React, { useState } from 'react';
import { NutritionPlan, Weekday } from '../../domain/types/nutrition.types';
import { NutritionDayCard } from '../components/NutritionDayCard';
import { Button } from '../../../../shared/components/ui/Button';
import {
  X,
  Calendar,
  Layers,
  Flame,
  Droplets,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

interface ClientPlanReviewModalProps {
  plan: NutritionPlan;
  isOpen: boolean;
  onClose: () => void;
  onOpenAccept: () => void;
  onOpenReject: () => void;
}

const WEEKDAYS: Weekday[] = [
  Weekday.MONDAY,
  Weekday.TUESDAY,
  Weekday.WEDNESDAY,
  Weekday.THURSDAY,
  Weekday.FRIDAY,
  Weekday.SATURDAY,
  Weekday.SUNDAY,
];

export const ClientPlanReviewModal: React.FC<ClientPlanReviewModalProps> = ({
  plan,
  isOpen,
  onClose,
  onOpenAccept,
  onOpenReject,
}) => {
  const [selectedWeekday, setSelectedWeekday] = useState<Weekday | 'ALL'>('ALL');

  if (!isOpen) return null;

  const totalDays = plan.nutritionDays.length;
  const avgCalories =
    totalDays > 0
      ? Math.round(
          plan.nutritionDays.reduce((sum, d) => sum + (d.targetCalories || 0), 0) / totalDays,
        )
      : 0;

  const filteredDays =
    selectedWeekday === 'ALL'
      ? plan.nutritionDays
      : plan.nutritionDays.filter((d) => d.weekday === selectedWeekday);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">
                    Review Nutrition Plan: {plan.title}
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[11px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                    v{plan.version}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                    Awaiting Approval
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  {plan.description || 'Customized weekly nutrition prescription from your coach.'}
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {plan.durationWeeks} Weeks Duration
              </span>
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                {plan.nutritionDays.length} Prescribed Days
              </span>
              {avgCalories > 0 && (
                <span className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />~{avgCalories} kcal / day target
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            title="Close review"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Weekday Filter Tabs */}
        <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center gap-1.5 overflow-x-auto shrink-0">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2 shrink-0">
            Day:
          </span>
          <button
            type="button"
            onClick={() => setSelectedWeekday('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
              selectedWeekday === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Days ({plan.nutritionDays.length})
          </button>
          {WEEKDAYS.map((day) => {
            const hasDay = plan.nutritionDays.some((d) => d.weekday === day);
            if (!hasDay) return null;
            const isSelected = selectedWeekday === day;
            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedWeekday(day)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                  isSelected
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {day.charAt(0) + day.slice(1).toLowerCase()}
              </button>
            );
          })}
        </div>

        {/* Scrollable Prescribed Days Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-slate-50/40">
          {filteredDays.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs font-medium">
              No prescribed meal structure found for this selection.
            </div>
          ) : (
            filteredDays.map((day) => (
              <NutritionDayCard key={day.id} day={day} isEditable={false} />
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-xl text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            Close Review
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onOpenReject();
              }}
              className="rounded-xl text-xs font-bold border-rose-200 text-rose-700 hover:bg-rose-50"
            >
              <XCircle className="w-3.5 h-3.5 mr-1.5 text-rose-500" />
              Reject Plan
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onClose();
                onOpenAccept();
              }}
              className="rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
              Accept & Activate Plan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
