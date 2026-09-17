'use client';

import React, { useState } from 'react';
import {
  MealCompletionRecord,
  MealCompletionStatus,
  FoodEntry,
  FoodAlternative,
  PrescribedMealSnapshot,
  SelectedAlternative,
  ConsumedFoodItem,
} from '../../domain/types/nutrition.types';
import { MealCompletionStatusBadge } from '../components/NutritionCompletionStatusBadge';
import { Button } from '../../../../shared/components/ui/Button';
import { Input } from '../../../../shared/components/ui/Input';
import { Label } from '../../../../shared/components/ui/Label';
import { isMealTimeAvailable } from '../../utils/nutritionDateUtils';
import {
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Repeat,
  Check,
  ChevronDown,
  Sparkles,
  Lock,
} from 'lucide-react';

interface MealCompletionEditorProps {
  record: MealCompletionRecord;
  prescribedMeal?: PrescribedMealSnapshot;
  onChange: (updated: MealCompletionRecord) => void;
  isReadOnly?: boolean;
}

export const MealCompletionEditor: React.FC<MealCompletionEditorProps> = ({
  record,
  prescribedMeal,
  onChange,
  isReadOnly = false,
}) => {
  const [activeAlternativeSelectorForFoodId, setActiveAlternativeSelectorForFoodId] = useState<
    string | null
  >(null);

  const prescribedFoods = prescribedMeal?.foodEntries || [];

  // Check if today's meal is locked because scheduled time has not arrived yet
  const timeAvailable = isMealTimeAvailable(prescribedMeal?.timeOfDay);
  const isTimeLocked = !isReadOnly && !timeAvailable;
  const isEffectiveReadOnly = isReadOnly || isTimeLocked;

  // Find the execution outcome for a specific prescribed food
  const getConsumedItemForFood = (food: FoodEntry): ConsumedFoodItem | undefined => {
    return (record.consumedItems || []).find(
      (ci) =>
        (food.id && ci.prescribedFoodId === food.id) ||
        (ci.prescribedFoodName &&
          ci.prescribedFoodName.trim().toLowerCase() === food.name.trim().toLowerCase()),
    );
  };

  // Recalculate totals and deterministic state
  const recalculateAndEmit = (
    nextConsumedItems: ConsumedFoodItem[],
    forcedState?: MealCompletionStatus,
  ) => {
    // Calculate actual consumed macros strictly from consumedItems
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fats = 0;

    if (forcedState !== MealCompletionStatus.SKIPPED) {
      for (const item of nextConsumedItems) {
        calories += item.calories || 0;
        protein += item.protein || 0;
        carbs += item.carbohydrates || 0;
        fats += item.fats || 0;
      }
    }

    // Deterministic state derivation (Directive 3)
    let state: MealCompletionStatus;
    let isCompleted = false;

    if (forcedState === MealCompletionStatus.SKIPPED) {
      state = MealCompletionStatus.SKIPPED;
      isCompleted = false;
    } else if (forcedState === MealCompletionStatus.COMPLETED) {
      state = MealCompletionStatus.COMPLETED;
      isCompleted = true;
    } else if (forcedState === MealCompletionStatus.PARTIALLY_COMPLETED) {
      state = MealCompletionStatus.PARTIALLY_COMPLETED;
      isCompleted = false;
    } else {
      const totalPrescribed = prescribedFoods.length;
      let executedCount = 0;

      for (const pfe of prescribedFoods) {
        const item = nextConsumedItems.find(
          (ci) =>
            (pfe.id && ci.prescribedFoodId === pfe.id) ||
            (ci.prescribedFoodName &&
              ci.prescribedFoodName.trim().toLowerCase() === pfe.name.trim().toLowerCase()),
        );
        if (item) {
          executedCount++;
        }
      }

      if (executedCount === 0) {
        state = MealCompletionStatus.NOT_TRACKED;
        isCompleted = false;
      } else if (executedCount >= totalPrescribed || (totalPrescribed === 0 && executedCount > 0)) {
        state = MealCompletionStatus.COMPLETED;
        isCompleted = true;
      } else {
        state = MealCompletionStatus.PARTIALLY_COMPLETED;
        isCompleted = false;
      }
    }

    // Legacy compatibility for selectedAlternative (points to first alternative if any)
    const firstAltItem = nextConsumedItems.find((ci) => ci.consumedType === 'ALTERNATIVE');
    const legacySelectedAlternative: SelectedAlternative | null = firstAltItem
      ? {
          prescribedFoodId: firstAltItem.prescribedFoodId,
          prescribedFoodName: firstAltItem.prescribedFoodName,
          alternativeId: firstAltItem.consumedFoodId,
          alternativeName: firstAltItem.consumedFoodName,
          quantity: firstAltItem.quantity,
          unit: firstAltItem.unit,
          calories: firstAltItem.calories ?? null,
          protein: firstAltItem.protein ?? null,
          carbohydrates: firstAltItem.carbohydrates ?? null,
          fats: firstAltItem.fats ?? null,
        }
      : null;

    onChange({
      ...record,
      state,
      isCompleted,
      consumedItems: state === MealCompletionStatus.SKIPPED ? [] : nextConsumedItems,
      selectedAlternative:
        state === MealCompletionStatus.SKIPPED ? null : legacySelectedAlternative,
      consumedCalories: state === MealCompletionStatus.SKIPPED ? null : calories,
      consumedMacros:
        state === MealCompletionStatus.SKIPPED ||
        (calories === 0 && protein === 0 && carbs === 0 && fats === 0)
          ? null
          : {
              calories,
              protein,
              carbohydrates: carbs,
              fats,
            },
    });
  };

  // Toggle consumed status of a prescribed food item (PRESCRIBED or untracked)
  const handleTogglePrescribedFood = (food: FoodEntry) => {
    if (isEffectiveReadOnly) return;

    const existing = getConsumedItemForFood(food);
    const currentItems = record.consumedItems || [];

    if (existing) {
      // Uncheck it (remove execution outcome)
      const nextItems = currentItems.filter(
        (ci) =>
          !(
            (food.id && ci.prescribedFoodId === food.id) ||
            ci.prescribedFoodName.trim().toLowerCase() === food.name.trim().toLowerCase()
          ),
      );
      recalculateAndEmit(nextItems);
    } else {
      // Check it as PRESCRIBED
      const newConsumedItem: ConsumedFoodItem = {
        prescribedFoodId: food.id || `food-${Math.random().toString(36).slice(2, 9)}`,
        prescribedFoodName: food.name,
        consumedType: 'PRESCRIBED',
        consumedFoodId: food.id || `food-${Math.random().toString(36).slice(2, 9)}`,
        consumedFoodName: food.name,
        quantity: food.quantity,
        unit: food.unit,
        calories: food.calories ?? null,
        protein: food.protein ?? null,
        carbohydrates: food.carbohydrates ?? null,
        fats: food.fats ?? null,
      };
      recalculateAndEmit([...currentItems, newConsumedItem]);
    }
  };

  // Select alternative for a specific prescribed food item
  const handleSelectAlternative = (prescribedFood: FoodEntry, alternative: FoodAlternative) => {
    if (isEffectiveReadOnly) return;

    const currentItems = record.consumedItems || [];
    // Remove any existing execution outcome for this prescribed food (enforce one outcome per food)
    const filteredItems = currentItems.filter(
      (ci) =>
        !(
          (prescribedFood.id && ci.prescribedFoodId === prescribedFood.id) ||
          ci.prescribedFoodName.trim().toLowerCase() === prescribedFood.name.trim().toLowerCase()
        ),
    );

    const newConsumedItem: ConsumedFoodItem = {
      prescribedFoodId: prescribedFood.id || `food-${Math.random().toString(36).slice(2, 9)}`,
      prescribedFoodName: prescribedFood.name,
      consumedType: 'ALTERNATIVE',
      consumedFoodId: alternative.id,
      consumedFoodName: alternative.name,
      quantity: alternative.quantity,
      unit: alternative.unit,
      calories: alternative.calories ?? null,
      protein: alternative.protein ?? null,
      carbohydrates: alternative.carbohydrates ?? null,
      fats: alternative.fats ?? null,
    };

    setActiveAlternativeSelectorForFoodId(null);
    recalculateAndEmit([...filteredItems, newConsumedItem]);
  };

  // Revert alternative back to prescribed item
  const handleRevertAlternative = (prescribedFood: FoodEntry) => {
    if (isEffectiveReadOnly) return;

    const currentItems = record.consumedItems || [];
    const filteredItems = currentItems.filter(
      (ci) =>
        !(
          (prescribedFood.id && ci.prescribedFoodId === prescribedFood.id) ||
          ci.prescribedFoodName.trim().toLowerCase() === prescribedFood.name.trim().toLowerCase()
        ),
    );

    const newConsumedItem: ConsumedFoodItem = {
      prescribedFoodId: prescribedFood.id || `food-${Math.random().toString(36).slice(2, 9)}`,
      prescribedFoodName: prescribedFood.name,
      consumedType: 'PRESCRIBED',
      consumedFoodId: prescribedFood.id || `food-${Math.random().toString(36).slice(2, 9)}`,
      consumedFoodName: prescribedFood.name,
      quantity: prescribedFood.quantity,
      unit: prescribedFood.unit,
      calories: prescribedFood.calories ?? null,
      protein: prescribedFood.protein ?? null,
      carbohydrates: prescribedFood.carbohydrates ?? null,
      fats: prescribedFood.fats ?? null,
    };

    recalculateAndEmit([...filteredItems, newConsumedItem]);
  };

  // Mark all prescribed foods done
  const handleMarkAllDone = () => {
    if (isEffectiveReadOnly) return;
    const allConsumed: ConsumedFoodItem[] = prescribedFoods.map((pf) => {
      // Preserve alternative if one was already chosen for this food
      const existing = getConsumedItemForFood(pf);
      if (existing && existing.consumedType === 'ALTERNATIVE') {
        return existing;
      }
      return {
        prescribedFoodId: pf.id || `food-${Math.random().toString(36).slice(2, 9)}`,
        prescribedFoodName: pf.name,
        consumedType: 'PRESCRIBED',
        consumedFoodId: pf.id || `food-${Math.random().toString(36).slice(2, 9)}`,
        consumedFoodName: pf.name,
        quantity: pf.quantity,
        unit: pf.unit,
        calories: pf.calories ?? null,
        protein: pf.protein ?? null,
        carbohydrates: pf.carbohydrates ?? null,
        fats: pf.fats ?? null,
      };
    });
    recalculateAndEmit(allConsumed, MealCompletionStatus.COMPLETED);
  };

  // Explicit user action: Skip meal
  const handleSkipMeal = () => {
    if (isEffectiveReadOnly) return;
    recalculateAndEmit([], MealCompletionStatus.SKIPPED);
  };

  // Reset to not tracked
  const handleResetMeal = () => {
    if (isEffectiveReadOnly) return;
    recalculateAndEmit([], MealCompletionStatus.NOT_TRACKED);
  };

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
      {/* Time availability warning if meal time has not arrived */}
      {isTimeLocked && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            This meal is scheduled for <strong>{prescribedMeal?.timeOfDay}</strong>. Tracking
            unlocks once the scheduled time arrives.
          </span>
        </div>
      )}

      {/* Meal Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase bg-slate-100 text-slate-800 border border-slate-200">
              {record.mealType}
            </span>
            <h4 className="text-sm sm:text-base font-bold text-slate-900">{record.name}</h4>
            {prescribedMeal?.timeOfDay && (
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {prescribedMeal.timeOfDay}
              </span>
            )}
          </div>
          {prescribedMeal?.targetCalories && (
            <p className="text-xs text-slate-500 font-medium">
              Target: {prescribedMeal.targetCalories} kcal
              {prescribedMeal.targetMacros &&
                ` • P: ${prescribedMeal.targetMacros.protein}g | C: ${prescribedMeal.targetMacros.carbohydrates}g | F: ${prescribedMeal.targetMacros.fats}g`}
            </p>
          )}
        </div>

        {/* Status Badge & Quick Action Bar */}
        <div className="flex items-center gap-2">
          {!isEffectiveReadOnly ? (
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={handleMarkAllDone}
                title="Mark all items consumed"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  record.state === MealCompletionStatus.COMPLETED
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Done
              </button>

              <button
                type="button"
                onClick={handleSkipMeal}
                title="Explicitly mark meal as skipped"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  record.state === MealCompletionStatus.SKIPPED
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-white'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                Skip Meal
              </button>

              <button
                type="button"
                onClick={handleResetMeal}
                title="Reset to not tracked"
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <MealCompletionStatusBadge status={record.state} />
          )}
        </div>
      </div>

      {/* Actual Logged Consumption Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900">Actual Logged:</span>
          <span className="font-black text-emerald-700">{record.consumedCalories || 0} kcal</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-700 font-semibold">
            P: {record.consumedMacros?.protein || 0}g • C:{' '}
            {record.consumedMacros?.carbohydrates || 0}g • F: {record.consumedMacros?.fats || 0}g
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-medium text-[11px]">Execution Status:</span>
          <MealCompletionStatusBadge status={record.state} size="sm" />
        </div>
      </div>

      {/* Prescribed Food Items Checklist with Independent Alternative Support */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Prescribed Items & Alternatives ({prescribedFoods.length})
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            {isEffectiveReadOnly
              ? 'Read-only execution facts'
              : 'Check items consumed or choose an alternative'}
          </span>
        </div>

        {prescribedFoods.length === 0 ? (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs font-medium text-slate-500">
            No specific prescribed items.
          </div>
        ) : (
          <div className="space-y-2">
            {prescribedFoods.map((food, idx) => {
              const consumedItem = getConsumedItemForFood(food);
              const isExecuted = !!consumedItem;
              const isAlternative = consumedItem?.consumedType === 'ALTERNATIVE';
              const hasAlternatives = food.alternatives && food.alternatives.length > 0;
              const foodKey = food.id || `prescribed-food-${idx}`;
              const isSelectorOpen = activeAlternativeSelectorForFoodId === foodKey;

              return (
                <div
                  key={foodKey}
                  className={`p-3 rounded-xl border transition-all ${
                    isExecuted
                      ? isAlternative
                        ? 'bg-purple-50/50 border-purple-200'
                        : 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {/* Checkbox and Food Details */}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        aria-label={`Toggle ${food.name}`}
                        onClick={() => handleTogglePrescribedFood(food)}
                        disabled={isEffectiveReadOnly}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                          isExecuted
                            ? isAlternative
                              ? 'bg-purple-700 border-purple-700 text-white'
                              : 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 bg-white hover:border-emerald-500'
                        } ${isEffectiveReadOnly ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                      >
                        {isExecuted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold ${
                              isExecuted ? 'text-slate-900' : 'text-slate-700'
                            }`}
                          >
                            {food.name}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            ({food.quantity} {food.unit})
                          </span>
                          {food.calories && (
                            <span className="text-[11px] font-semibold text-emerald-700">
                              {food.calories} kcal
                            </span>
                          )}
                        </div>

                        {food.protein !== undefined && food.protein !== null && (
                          <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                            P: {food.protein}g • C: {food.carbohydrates || 0}g • F: {food.fats || 0}
                            g
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Alternative Actions / Badges */}
                    <div className="flex items-center gap-2">
                      {isAlternative ? (
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-purple-700" />
                            Alternative Active
                          </span>
                          {!isEffectiveReadOnly && (
                            <button
                              type="button"
                              onClick={() => handleRevertAlternative(food)}
                              className="text-[11px] text-slate-500 hover:text-slate-900 underline font-semibold cursor-pointer"
                            >
                              Revert
                            </button>
                          )}
                        </div>
                      ) : (
                        hasAlternatives &&
                        !isEffectiveReadOnly && (
                          <button
                            type="button"
                            onClick={() =>
                              setActiveAlternativeSelectorForFoodId(isSelectorOpen ? null : foodKey)
                            }
                            className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-[11px] font-bold text-slate-700 flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <Repeat className="w-3 h-3 text-emerald-600" />
                            Choose Alternative
                            <ChevronDown
                              className={`w-3 h-3 text-slate-400 transition-transform ${
                                isSelectorOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Alternative Selected Callout Banner */}
                  {isAlternative && consumedItem && (
                    <div className="mt-2.5 p-2.5 rounded-lg bg-purple-50/80 border border-purple-200 text-xs text-purple-950 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-700">Prescribed: {food.name}</span>
                        <span className="text-slate-400">→</span>
                        <span className="font-bold text-purple-900">
                          Consumed instead: {consumedItem.consumedFoodName}
                        </span>{' '}
                        ({consumedItem.quantity} {consumedItem.unit})
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
                          ALTERNATIVE
                        </span>
                        {consumedItem.calories && (
                          <span className="ml-1 font-bold text-emerald-800">
                            • {consumedItem.calories} kcal
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-semibold text-purple-800">
                        P: {consumedItem.protein || 0}g • C: {consumedItem.carbohydrates || 0}g • F:{' '}
                        {consumedItem.fats || 0}g
                      </div>
                    </div>
                  )}

                  {/* Alternative Selector Dropdown */}
                  {isSelectorOpen && hasAlternatives && !isEffectiveReadOnly && (
                    <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                        <span>Available Prescribed Alternatives:</span>
                        <button
                          type="button"
                          onClick={() => setActiveAlternativeSelectorForFoodId(null)}
                          className="text-slate-400 hover:text-slate-600 text-[10px] cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        {food.alternatives!.map((alt) => (
                          <div
                            key={alt.id}
                            className="p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between gap-2 hover:border-emerald-500/80 transition-colors"
                          >
                            <div>
                              <div className="text-xs font-bold text-slate-900">{alt.name}</div>
                              <div className="text-[10px] text-slate-500">
                                {alt.quantity} {alt.unit} • {alt.calories || 0} kcal (P:{' '}
                                {alt.protein || 0}g, C: {alt.carbohydrates || 0}g, F:{' '}
                                {alt.fats || 0}g)
                              </div>
                            </div>

                            <Button
                              variant="primary"
                              size="sm"
                              aria-label={`Select ${alt.name}`}
                              data-testid={`select-alt-${alt.name.toLowerCase()}`}
                              onClick={() => handleSelectAlternative(food, alt)}
                              className="rounded-lg text-[11px] h-7 px-2.5 font-bold"
                            >
                              Select
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Notes & Time */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
        <div className="space-y-1">
          <Label className="text-xs font-bold text-slate-900">Time Consumed</Label>
          <Input
            value={record.timeConsumed || ''}
            onChange={(e) => onChange({ ...record, timeConsumed: e.target.value })}
            placeholder="e.g. 8:30 AM"
            disabled={isEffectiveReadOnly}
            className="rounded-xl text-xs h-8 bg-white font-medium border-slate-200"
          />
        </div>

        <div className="sm:col-span-2 space-y-1">
          <Label className="text-xs font-bold text-slate-900">
            Meal Notes / Execution Deviations
          </Label>
          <Input
            value={record.notes || ''}
            onChange={(e) => onChange({ ...record, notes: e.target.value })}
            placeholder="Substituted whey flavor, ate post-workout, etc."
            disabled={isEffectiveReadOnly}
            className="rounded-xl text-xs h-8 bg-white font-medium border-slate-200"
          />
        </div>
      </div>
    </div>
  );
};
