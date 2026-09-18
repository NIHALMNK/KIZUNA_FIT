'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  NutritionCompletion,
  NutritionCompletionStatus,
  MealCompletionRecord,
  MealCompletionStatus,
  DailyMacroSummary,
  HydrationSummary,
  NutritionFeedback,
} from '../../domain/types/nutrition.types';
import {
  useUpdateNutritionCompletion,
  useCompleteNutritionCompletion,
} from '../../application/mutations/useNutritionCompletionMutations';
import {
  getClientTodayDateString,
  isDateToday,
  formatReadableDate,
} from '../../utils/nutritionDateUtils';
import { MealCompletionEditor } from './MealCompletionEditor';
import { NutritionFeedbackModal } from './NutritionFeedbackModal';
import { NutritionCompletionStatusBadge } from '../components/NutritionCompletionStatusBadge';
import { MacroTargetDisplay } from '../components/MacroTargetDisplay';
import { HydrationGoalDisplay } from '../components/HydrationGoalDisplay';
import { Button } from '../../../../shared/components/ui/Button';
import {
  ArrowLeft,
  CheckCircle2,
  Droplets,
  Plus,
  Save,
  Sparkles,
  AlertCircle,
  Calendar,
  Lock,
  Check,
} from 'lucide-react';

interface ClientNutritionDayTrackerProps {
  initialCompletion: NutritionCompletion;
  onBack: () => void;
  onCompleted: (completion: NutritionCompletion) => void;
}

export const ClientNutritionDayTracker: React.FC<ClientNutritionDayTrackerProps> = ({
  initialCompletion,
  onBack,
  onCompleted,
}) => {
  const [completion, setCompletion] = useState<NutritionCompletion>(initialCompletion);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | null>(null);

  const isCompleted = completion.status === NutritionCompletionStatus.COMPLETED;
  const isToday = isDateToday(completion.completionDate || completion.startedAt);
  const isReadOnly = isCompleted || !isToday;

  const updateCompletionMutation = useUpdateNutritionCompletion();
  const completeMutation = useCompleteNutritionCompletion();

  // Local state for hydration
  const [loggedMl, setLoggedMl] = useState<number>(completion.hydrationSummary?.loggedMl || 0);

  // Debounce & Queue Refs
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingPayloadRef = useRef<{
    mealCompletions: MealCompletionRecord[];
    macroSummary: DailyMacroSummary;
    hydrationSummary: HydrationSummary;
  } | null>(null);
  const isMutatingRef = useRef<boolean>(false);

  // Recalculate macro summary from meal completions
  const calculateTotalMacros = (records: MealCompletionRecord[]): DailyMacroSummary => {
    let totalCalories = 0;
    let protein = 0;
    let carbs = 0;
    let fats = 0;

    for (const rec of records) {
      if (rec.state !== MealCompletionStatus.SKIPPED) {
        totalCalories += rec.consumedCalories || 0;
        protein += rec.consumedMacros?.protein || 0;
        carbs += rec.consumedMacros?.carbohydrates || 0;
        fats += rec.consumedMacros?.fats || 0;
      }
    }

    return {
      totalCalories,
      protein,
      carbohydrates: carbs,
      fats,
    };
  };

  // Process queued mutation
  const flushMutation = async () => {
    if (!pendingPayloadRef.current || isMutatingRef.current || isReadOnly) return;

    const payloadToSave = pendingPayloadRef.current;
    pendingPayloadRef.current = null;
    isMutatingRef.current = true;
    setSaveStatus('saving');

    try {
      await updateCompletionMutation.mutateAsync({
        completionId: completion.id,
        payload: {
          ...payloadToSave,
          clientToday: getClientTodayDateString(),
        },
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to autosave nutrition changes.');
      setSaveStatus(null);
    } finally {
      isMutatingRef.current = false;
      // If a new update was queued while mutating, flush it
      if (pendingPayloadRef.current) {
        flushMutation();
      }
    }
  };

  // Schedule debounced autosave (~350ms)
  const scheduleAutosave = (
    updatedMeals: MealCompletionRecord[],
    newMacroSummary: DailyMacroSummary,
    newHydration: HydrationSummary,
  ) => {
    pendingPayloadRef.current = {
      mealCompletions: updatedMeals,
      macroSummary: newMacroSummary,
      hydrationSummary: newHydration,
    };

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      flushMutation();
    }, 350);
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleUpdateMealRecord = (index: number, updatedRecord: MealCompletionRecord) => {
    if (isReadOnly) return;
    const updatedMeals = [...completion.mealCompletions];
    updatedMeals[index] = updatedRecord;

    const macroSummary = calculateTotalMacros(updatedMeals);
    const hydrationSummary: HydrationSummary = {
      loggedMl,
      targetMl: completion.nutritionDaySnapshot.hydrationGoal?.targetMl || null,
    };

    setCompletion((prev) => ({
      ...prev,
      mealCompletions: updatedMeals,
      macroSummary,
      hydrationSummary,
    }));

    scheduleAutosave(updatedMeals, macroSummary, hydrationSummary);
  };

  const handleAddHydration = (amountMl: number) => {
    if (isReadOnly) return;
    const newLogged = Math.max(0, loggedMl + amountMl);
    setLoggedMl(newLogged);

    const hydrationSummary: HydrationSummary = {
      loggedMl: newLogged,
      targetMl: completion.nutritionDaySnapshot.hydrationGoal?.targetMl || null,
    };

    setCompletion((prev) => ({
      ...prev,
      hydrationSummary,
    }));

    scheduleAutosave(
      completion.mealCompletions,
      completion.macroSummary || calculateTotalMacros(completion.mealCompletions),
      hydrationSummary,
    );
  };

  const handleCompleteDay = async (feedback: NutritionFeedback) => {
    setErrorMessage(null);
    try {
      const finished = await completeMutation.mutateAsync({
        completionId: completion.id,
        payload: {
          mealCompletions: completion.mealCompletions,
          macroSummary: completion.macroSummary,
          hydrationSummary: {
            loggedMl,
            targetMl: completion.nutritionDaySnapshot.hydrationGoal?.targetMl || null,
          },
          feedback,
          clientToday: getClientTodayDateString(),
        },
      });
      setCompletion(finished);
      setIsFeedbackModalOpen(false);
      onCompleted(finished);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to complete daily nutrition log.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Tracker Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Weekly Overview
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  {completion.weekday
                    ? `${completion.weekday.charAt(0) + completion.weekday.slice(1).toLowerCase()} Execution Tracker`
                    : `Day ${completion.dayNumber} Tracker`}
                </h2>
                <NutritionCompletionStatusBadge status={completion.status} />
              </div>
              <p className="text-xs font-medium text-slate-500">
                {formatReadableDate(completion.completionDate || completion.startedAt)}
                {completion.nutritionDaySnapshot.name &&
                  ` • ${completion.nutritionDaySnapshot.name}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {saveStatus === 'saving' && (
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                Saving...
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}

            {!isReadOnly && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsFeedbackModalOpen(true)}
                disabled={completeMutation.isPending}
                className="rounded-xl font-bold text-xs shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                Finish & Complete Day
              </Button>
            )}
          </div>
        </div>

        {/* Read-Only Notices */}
        {isCompleted ? (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-950 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" />
            <span>
              This day was completed on {new Date(completion.completedAt!).toLocaleString()}. All
              meal logs are preserved read-only.
            </span>
          </div>
        ) : !isToday ? (
          <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-2">
            <Lock className="w-4 h-4 shrink-0 text-slate-600" />
            <span>
              Viewing historical execution for {formatReadableDate(completion.completionDate)}. Only
              Today&apos;s execution is editable.
            </span>
          </div>
        ) : null}

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-700" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Target vs Consumed Comparison Bar */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Actual Daily Caloric & Macro Consumption
        </h3>

        <MacroTargetDisplay
          targetCalories={completion.nutritionDaySnapshot.targetCalories}
          macros={
            completion.nutritionDaySnapshot.dailyMacroTargets
              ? {
                  calories: completion.nutritionDaySnapshot.dailyMacroTargets.calories,
                  protein: completion.nutritionDaySnapshot.dailyMacroTargets.protein,
                  carbohydrates: completion.nutritionDaySnapshot.dailyMacroTargets.carbohydrates,
                  fats: completion.nutritionDaySnapshot.dailyMacroTargets.fats,
                }
              : null
          }
          consumedCalories={completion.macroSummary?.totalCalories}
          consumedMacros={
            completion.macroSummary
              ? {
                  calories: completion.macroSummary.totalCalories,
                  protein: completion.macroSummary.protein,
                  carbohydrates: completion.macroSummary.carbohydrates,
                  fats: completion.macroSummary.fats,
                }
              : null
          }
          size="lg"
        />
      </div>

      {/* Hydration Logging Section */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Hydration Tracking</h3>
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-900">{loggedMl} ml</span>
        </div>

        <HydrationGoalDisplay
          targetMl={completion.nutritionDaySnapshot.hydrationGoal?.targetMl}
          loggedMl={loggedMl}
          notes={completion.nutritionDaySnapshot.hydrationGoal?.notes}
        />

        {!isReadOnly && (
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddHydration(250)}
              className="rounded-xl text-xs font-bold border-slate-200 hover:bg-slate-50 text-slate-800"
            >
              <Plus className="w-3.5 h-3.5 mr-1 text-blue-600" /> +250 ml (Glass)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddHydration(500)}
              className="rounded-xl text-xs font-bold border-slate-200 hover:bg-slate-50 text-slate-800"
            >
              <Plus className="w-3.5 h-3.5 mr-1 text-blue-600" /> +500 ml (Bottle)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddHydration(1000)}
              className="rounded-xl text-xs font-bold border-slate-200 hover:bg-slate-50 text-slate-800"
            >
              <Plus className="w-3.5 h-3.5 mr-1 text-blue-600" /> +1000 ml (Shaker)
            </Button>
          </div>
        )}
      </div>

      {/* Meals Logging Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Meal Execution ({completion.mealCompletions.length} Prescribed Meals)
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">
            Changes autosave automatically
          </span>
        </div>

        <div className="space-y-4">
          {completion.mealCompletions.map((mealRecord, idx) => {
            const prescribed = completion.nutritionDaySnapshot.meals.find(
              (m) => m.mealId === mealRecord.mealId,
            );
            return (
              <MealCompletionEditor
                key={mealRecord.mealId || `meal-rec-${idx}`}
                record={mealRecord}
                prescribedMeal={prescribed}
                onChange={(updated) => handleUpdateMealRecord(idx, updated)}
                isReadOnly={isReadOnly}
              />
            );
          })}
        </div>
      </div>

      {/* Feedback Summary (if completed) */}
      {completion.feedback && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Client Daily Feedback</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 font-medium">Rating:</span>
              <span className="font-bold text-slate-900 ml-1">
                {completion.feedback.rating ?? 'N/A'} / 5
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 font-medium">Energy:</span>
              <span className="font-bold text-slate-900 ml-1">
                {completion.feedback.energyLevel ?? 'N/A'} / 5
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 font-medium">Adherence Confidence:</span>
              <span className="font-bold text-slate-900 ml-1">
                {completion.feedback.adherenceConfidence ?? 'N/A'} / 5
              </span>
            </div>
          </div>

          {completion.feedback.digestionNotes && (
            <div className="text-xs space-y-1 pt-1">
              <span className="font-bold text-slate-900">Digestion:</span>
              <p className="text-slate-600 font-medium italic">
                {completion.feedback.digestionNotes}
              </p>
            </div>
          )}

          {completion.feedback.notes && (
            <div className="text-xs space-y-1 pt-1">
              <span className="font-bold text-slate-900">Notes:</span>
              <p className="text-slate-600 font-medium italic">{completion.feedback.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Completion Feedback Modal */}
      <NutritionFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmit={handleCompleteDay}
        isLoading={completeMutation.isPending}
      />
    </div>
  );
};
