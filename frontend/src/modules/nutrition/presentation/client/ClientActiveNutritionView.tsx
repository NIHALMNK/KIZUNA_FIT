'use client';

import React, { useState } from 'react';
import {
  NutritionPlan,
  Weekday,
  MealCompletionRecord,
  MealCompletionStatus,
  PrescribedMealSnapshot,
  NutritionCompletion,
} from '../../domain/types/nutrition.types';
import { MealCompletionEditor } from './MealCompletionEditor';
import { MealCard } from '../components/MealCard';
import { Button } from '../../../../shared/components/ui/Button';
import { useNutritionCompletions } from '../../application/queries/useNutritionCompletions';
import {
  useStartNutritionCompletion,
  useUpdateNutritionCompletion,
} from '../../application/mutations/useNutritionCompletionMutations';
import {
  getClientTodayWeekday,
  getClientTodayDateString,
  WEEKDAY_NAMES,
  WEEKDAY_SHORT,
  WEEKDAY_ORDER_MAP,
  isDateToday,
} from '../../utils/nutritionDateUtils';
import {
  Apple,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  Droplets,
  Plus,
  Lock,
  Utensils,
  AlertCircle,
} from 'lucide-react';

const ALL_WEEKDAYS: Weekday[] = [
  Weekday.MONDAY,
  Weekday.TUESDAY,
  Weekday.WEDNESDAY,
  Weekday.THURSDAY,
  Weekday.FRIDAY,
  Weekday.SATURDAY,
  Weekday.SUNDAY,
];

interface ClientActiveNutritionViewProps {
  plan: NutritionPlan;
}

export const ClientActiveNutritionView: React.FC<ClientActiveNutritionViewProps> = ({ plan }) => {
  const todayWeekday = getClientTodayWeekday();
  const todayDateStr = getClientTodayDateString();
  const [selectedWeekday, setSelectedWeekday] = useState<Weekday>(todayWeekday);
  const [actionError, setActionError] = useState<string | null>(null);

  const isSelectedToday = selectedWeekday === todayWeekday;
  const todayOrder = WEEKDAY_ORDER_MAP[todayWeekday];
  const selectedOrder = WEEKDAY_ORDER_MAP[selectedWeekday];
  const isPastDay = selectedOrder < todayOrder;
  const isFutureDay = selectedOrder > todayOrder;

  // Completion queries and mutations
  const { data: completionsData } = useNutritionCompletions({ nutritionPlanId: plan.id });
  const startCompletionMutation = useStartNutritionCompletion();
  const updateCompletionMutation = useUpdateNutritionCompletion();

  // Find today's completion record if it already exists
  const todayCompletion = (completionsData?.completions || []).find(
    (c) => c.nutritionPlanId === plan.id && isDateToday(c.completionDate || c.startedAt),
  );

  // Find past completion for selected day if any
  const historicalCompletion = (completionsData?.completions || []).find(
    (c) =>
      c.nutritionPlanId === plan.id &&
      c.weekday === selectedWeekday &&
      !isDateToday(c.completionDate || c.startedAt),
  );

  const currentDay =
    plan.nutritionDays.find((d) => d.weekday === selectedWeekday) || plan.nutritionDays[0];

  const hydrationTarget =
    todayCompletion?.hydrationSummary?.targetMl || currentDay?.hydrationGoal?.targetMl || 3000;
  const waterLogged = todayCompletion?.hydrationSummary?.loggedMl || 0;
  const hydrationPercent = Math.min(100, Math.round((waterLogged / hydrationTarget) * 100));

  // Ensure completion aggregate exists for today on-demand
  const ensureTodayCompletion = async (): Promise<NutritionCompletion> => {
    if (todayCompletion) return todayCompletion;

    return await startCompletionMutation.mutateAsync({
      nutritionPlanId: plan.id,
      completionDate: todayDateStr,
      weekday: todayWeekday,
    });
  };

  // Handle meal execution update
  const handleMealRecordChange = async (updatedRecord: MealCompletionRecord) => {
    setActionError(null);
    try {
      const comp = await ensureTodayCompletion();
      const currentRecords = [...(comp.mealCompletions || [])];
      const matchIdx = currentRecords.findIndex((m) => m.mealId === updatedRecord.mealId);

      if (matchIdx >= 0) {
        currentRecords[matchIdx] = updatedRecord;
      } else {
        currentRecords.push(updatedRecord);
      }

      // Authoritative macro calculation across all meals
      let totalCalories = 0;
      let protein = 0;
      let carbs = 0;
      let fats = 0;

      for (const m of currentRecords) {
        if (m.state !== MealCompletionStatus.SKIPPED) {
          totalCalories += m.consumedCalories || 0;
          protein += m.consumedMacros?.protein || 0;
          carbs += m.consumedMacros?.carbohydrates || 0;
          fats += m.consumedMacros?.fats || 0;
        }
      }

      await updateCompletionMutation.mutateAsync({
        completionId: comp.id,
        payload: {
          mealCompletions: currentRecords,
          macroSummary: {
            totalCalories,
            protein,
            carbohydrates: carbs,
            fats,
          },
          hydrationSummary: comp.hydrationSummary,
          clientToday: todayDateStr,
        },
      });
    } catch (err: any) {
      setActionError(err?.message || 'Failed to record meal execution.');
    }
  };

  // Handle quick water log
  const handleLogWater = async (deltaMl: number) => {
    setActionError(null);
    try {
      const comp = await ensureTodayCompletion();
      const currentMl = comp.hydrationSummary?.loggedMl || 0;
      const newMl = currentMl + deltaMl;

      await updateCompletionMutation.mutateAsync({
        completionId: comp.id,
        payload: {
          mealCompletions: comp.mealCompletions,
          macroSummary: comp.macroSummary,
          hydrationSummary: {
            loggedMl: newMl,
            targetMl: comp.hydrationSummary?.targetMl || hydrationTarget,
          },
          clientToday: todayDateStr,
        },
      });
    } catch (err: any) {
      setActionError(err?.message || 'Failed to update hydration.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <Apple className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">My Nutrition Plan</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  v{plan.version}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {plan.title} • {plan.durationWeeks} Weeks Prescribed Schedule
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
              Today: {WEEKDAY_NAMES[todayWeekday]}
            </span>
          </div>
        </div>
      </div>

      {actionError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Weekday Strip Navigation (Mon-Sun, Today strictly highlighted) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Weekly Prescription Schedule
          </span>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span>
              Selected:&nbsp;
              <strong className="text-slate-900 font-bold">{WEEKDAY_NAMES[selectedWeekday]}</strong>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {ALL_WEEKDAYS.map((wd) => {
            const isConfigured = plan.nutritionDays.some((d) => d.weekday === wd);
            const isSelected = selectedWeekday === wd;
            const isToday = todayWeekday === wd;
            const dayConfig = plan.nutritionDays.find((d) => d.weekday === wd);
            const wdOrder = WEEKDAY_ORDER_MAP[wd];
            const isPast = wdOrder < todayOrder;

            return (
              <button
                key={wd}
                type="button"
                onClick={() => setSelectedWeekday(wd)}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col justify-between items-center cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-emerald-500/50'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}
                  >
                    {WEEKDAY_SHORT[wd]}
                  </span>
                  {isToday ? (
                    <span
                      className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                        isSelected ? 'bg-emerald-800 text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      Today
                    </span>
                  ) : isPast ? (
                    <span
                      className={`text-[9px] font-semibold ${
                        isSelected ? 'text-emerald-100' : 'text-slate-400'
                      }`}
                    >
                      Past
                    </span>
                  ) : (
                    <span
                      className={`text-[9px] font-semibold ${
                        isSelected ? 'text-emerald-100' : 'text-slate-400'
                      }`}
                    >
                      Upcoming
                    </span>
                  )}
                </div>

                <span
                  className={`text-[11px] font-semibold mt-2 ${
                    isSelected ? 'text-emerald-100' : 'text-slate-500'
                  }`}
                >
                  {isConfigured && dayConfig?.targetCalories
                    ? `${dayConfig.targetCalories} kcal`
                    : 'Rest'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Left Meals / Right Today's Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2/3 Column: Meals for Selected Day */}
        <div className="lg:col-span-2 space-y-4">
          {/* Day Status Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-white border border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {WEEKDAY_NAMES[selectedWeekday]} Prescribed Meals
                </h3>
                {isSelectedToday ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Editable Today
                  </span>
                ) : isPastDay ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-500" /> Read-Only Past Day
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-600" /> Upcoming Day (Read-Only)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentDay?.targetCalories || 0} kcal target • {currentDay?.meals?.length || 0}{' '}
                meals
              </p>
            </div>
          </div>

          {/* Meals Execution List */}
          {currentDay && currentDay.meals && currentDay.meals.length > 0 ? (
            <div className="space-y-4">
              {currentDay.meals.map((meal) => {
                const prescribedSnapshot: PrescribedMealSnapshot = {
                  mealId: meal.id,
                  mealType: meal.mealType,
                  name: meal.name,
                  timeOfDay: meal.timeOfDay,
                  targetCalories: meal.targetCalories,
                  targetMacros: meal.targetMacros,
                  foodEntries: meal.foodEntries || [],
                  notes: meal.notes,
                };

                if (isSelectedToday) {
                  // Today: Editable inline with MealCompletionEditor
                  const existingRecord = todayCompletion?.mealCompletions?.find(
                    (m) => m.mealId === meal.id,
                  ) || {
                    mealId: meal.id,
                    mealType: meal.mealType,
                    name: meal.name,
                    isCompleted: false,
                    state: MealCompletionStatus.NOT_TRACKED,
                    consumedItems: [],
                    consumedCalories: null,
                    consumedMacros: null,
                    timeConsumed: null,
                    notes: null,
                  };

                  return (
                    <MealCompletionEditor
                      key={meal.id}
                      record={existingRecord}
                      prescribedMeal={prescribedSnapshot}
                      onChange={handleMealRecordChange}
                      isReadOnly={false}
                    />
                  );
                } else if (isPastDay && historicalCompletion) {
                  // Historical Past Day with tracked completion
                  const existingRecord = historicalCompletion.mealCompletions?.find(
                    (m) => m.mealId === meal.id,
                  ) || {
                    mealId: meal.id,
                    mealType: meal.mealType,
                    name: meal.name,
                    isCompleted: false,
                    state: MealCompletionStatus.NOT_TRACKED,
                    consumedItems: [],
                    consumedCalories: null,
                    consumedMacros: null,
                    timeConsumed: null,
                    notes: null,
                  };

                  return (
                    <MealCompletionEditor
                      key={meal.id}
                      record={existingRecord}
                      prescribedMeal={prescribedSnapshot}
                      onChange={() => {}}
                      isReadOnly={true}
                    />
                  );
                } else {
                  // Future day or past day without completion: Read-only MealCard
                  return <MealCard key={meal.id} meal={meal} isEditable={false} />;
                }
              })}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-white border border-dashed border-slate-200 text-center text-xs text-slate-400">
              No specific meals prescribed for {WEEKDAY_NAMES[selectedWeekday]}.
            </div>
          )}
        </div>

        {/* Right 1/3 Column: Progress & Daily Quick Tracking Sidebar */}
        <div className="space-y-5">
          {/* Today's Target Status Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Today&apos;s Execution Status
            </h4>

            <div>
              <div className="flex justify-between items-baseline text-xs mb-1.5">
                <span className="font-bold text-slate-900">Daily Energy Intake</span>
                <span className="text-[11px] font-bold text-emerald-700">
                  {todayCompletion?.macroSummary?.totalCalories || 0} /{' '}
                  {currentDay?.targetCalories || 2000} kcal
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round(
                        ((todayCompletion?.macroSummary?.totalCalories || 0) /
                          (currentDay?.targetCalories || 2000)) *
                          100,
                      ),
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] font-semibold text-slate-500">Protein</div>
                <div className="text-xs font-bold text-slate-900">
                  {todayCompletion?.macroSummary?.protein || 0}g
                </div>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] font-semibold text-slate-500">Carbs</div>
                <div className="text-xs font-bold text-slate-900">
                  {todayCompletion?.macroSummary?.carbohydrates || 0}g
                </div>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] font-semibold text-slate-500">Fats</div>
                <div className="text-xs font-bold text-slate-900">
                  {todayCompletion?.macroSummary?.fats || 0}g
                </div>
              </div>
            </div>
          </div>

          {/* Water Intake Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Droplets className="w-4 h-4 text-blue-600" />
                <span>Water Intake</span>
              </div>
              <span className="text-xs font-bold text-slate-900">
                {waterLogged} / {hydrationTarget} ml
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${hydrationPercent}%` }}
              />
            </div>

            <div className="flex justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleLogWater(250)}
                className="flex-1 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                +250 ml
              </button>
              <button
                type="button"
                onClick={() => handleLogWater(500)}
                className="flex-1 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                +500 ml
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
