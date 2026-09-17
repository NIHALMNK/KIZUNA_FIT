'use client';

import React, { useState } from 'react';
import {
  NutritionPlan,
  NutritionPlanStatus,
  Weekday,
  MealType,
  NutritionDayInputDTO,
  MealInputDTO,
  FoodEntry,
  FoodAlternative,
  CreateNutritionPlanDTO,
  UpdateNutritionPlanDTO,
  CreateNutritionPlanVersionDTO,
} from '../../domain/types/nutrition.types';
import {
  useCreateNutritionPlan,
  useUpdateNutritionPlan,
  useCreateNutritionPlanVersion,
  useSubmitNutritionPlan,
} from '../../application/mutations/useNutritionPlanMutations';
import { NutritionPlanStatusBadge } from '../components/NutritionPlanStatusBadge';
import { Button } from '../../../../shared/components/ui/Button';
import { Input } from '../../../../shared/components/ui/Input';
import { Label } from '../../../../shared/components/ui/Label';
import { Textarea } from '../../../../shared/components/ui/Textarea';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Send,
  Utensils,
  Droplets,
  AlertCircle,
  Sparkles,
  Copy,
  CheckCircle2,
  Calendar,
  X,
  Repeat,
  ChevronDown,
  ChevronUp,
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

const WEEKDAY_LABELS: Record<Weekday, string> = {
  [Weekday.MONDAY]: 'Monday',
  [Weekday.TUESDAY]: 'Tuesday',
  [Weekday.WEDNESDAY]: 'Wednesday',
  [Weekday.THURSDAY]: 'Thursday',
  [Weekday.FRIDAY]: 'Friday',
  [Weekday.SATURDAY]: 'Saturday',
  [Weekday.SUNDAY]: 'Sunday',
};

const WEEKDAY_ORDER: Record<Weekday, number> = {
  [Weekday.MONDAY]: 1,
  [Weekday.TUESDAY]: 2,
  [Weekday.WEDNESDAY]: 3,
  [Weekday.THURSDAY]: 4,
  [Weekday.FRIDAY]: 5,
  [Weekday.SATURDAY]: 6,
  [Weekday.SUNDAY]: 7,
};

interface NutritionPlanBuilderProps {
  coachingRelationshipId: string;
  /** Existing plan being edited (must be in DRAFT status to allow edits). */
  existingPlan?: NutritionPlan | null;
  /**
   * When a relationship has nutrition history but no plan is being directly
   * edited, pass the highest-version plan here. The builder will call the
   * version-fork endpoint instead of the initial-create endpoint, preventing
   * the 409 / 400 that occurs when POST /nutrition-plans is called for a
   * relationship that already has plan history.
   */
  basePlanForVersion?: NutritionPlan | null;
  onBack: () => void;
  onSaved: (plan: NutritionPlan) => void;
  onCreateVersion?: (plan: NutritionPlan) => void;
}

export const NutritionPlanBuilder: React.FC<NutritionPlanBuilderProps> = ({
  coachingRelationshipId,
  existingPlan,
  basePlanForVersion,
  onBack,
  onSaved,
  onCreateVersion,
}) => {
  const isReadOnly: boolean = !!(
    existingPlan &&
    (existingPlan.status === NutritionPlanStatus.ACTIVE ||
      existingPlan.status === NutritionPlanStatus.COMPLETED)
  );

  const [title, setTitle] = useState(existingPlan?.title || '');
  const [description, setDescription] = useState(existingPlan?.description || '');
  const [durationWeeks, setDurationWeeks] = useState(existingPlan?.durationWeeks || 4);

  // Initialize weekly nutrition days mapped by Weekday
  const [nutritionDays, setNutritionDays] = useState<NutritionDayInputDTO[]>(() => {
    if (existingPlan && existingPlan.nutritionDays.length > 0) {
      return existingPlan.nutritionDays.map((d) => ({
        weekday: d.weekday,
        dayNumber: d.dayNumber ?? WEEKDAY_ORDER[d.weekday],
        name: d.name || `${WEEKDAY_LABELS[d.weekday]} Plan`,
        targetCalories: d.targetCalories || undefined,
        dailyMacroTargets: d.dailyMacroTargets
          ? {
              calories: d.dailyMacroTargets.calories,
              protein: d.dailyMacroTargets.protein,
              carbohydrates: d.dailyMacroTargets.carbohydrates,
              fats: d.dailyMacroTargets.fats,
            }
          : undefined,
        hydrationGoal: d.hydrationGoal
          ? { targetMl: d.hydrationGoal.targetMl, notes: d.hydrationGoal.notes || '' }
          : undefined,
        meals: d.meals.map((m) => ({
          mealType: m.mealType,
          name: m.name,
          timeOfDay: m.timeOfDay || '',
          targetCalories: m.targetCalories || undefined,
          targetMacros: m.targetMacros
            ? {
                calories: m.targetMacros.calories,
                protein: m.targetMacros.protein,
                carbohydrates: m.targetMacros.carbohydrates,
                fats: m.targetMacros.fats,
              }
            : undefined,
          foodEntries: m.foodEntries.map((fe) => ({
            id: fe.id,
            name: fe.name,
            quantity: fe.quantity,
            unit: fe.unit,
            calories: fe.calories || undefined,
            protein: fe.protein || undefined,
            carbohydrates: fe.carbohydrates || undefined,
            fats: fe.fats || undefined,
            notes: fe.notes || '',
            alternatives: fe.alternatives ? fe.alternatives.map((a) => ({ ...a })) : [],
          })),
          notes: m.notes || '',
        })),
        notes: d.notes || '',
      }));
    }

    // Default Monday configured
    return [
      {
        weekday: Weekday.MONDAY,
        dayNumber: 1,
        name: 'Monday Plan',
        targetCalories: 2200,
        dailyMacroTargets: { calories: 2200, protein: 160, carbohydrates: 220, fats: 70 },
        hydrationGoal: { targetMl: 3000, notes: 'Stay hydrated throughout the day' },
        meals: [
          {
            mealType: MealType.BREAKFAST,
            name: 'Breakfast',
            timeOfDay: '08:00',
            targetCalories: 550,
            targetMacros: { calories: 550, protein: 40, carbohydrates: 55, fats: 18 },
            foodEntries: [
              {
                name: 'Oatmeal with whey protein',
                quantity: 1,
                unit: 'bowl',
                calories: 400,
                protein: 35,
                carbohydrates: 50,
                fats: 6,
              },
              {
                name: 'Banana',
                quantity: 1,
                unit: 'medium',
                calories: 105,
                protein: 1,
                carbohydrates: 27,
                fats: 0.3,
              },
            ],
          },
          {
            mealType: MealType.LUNCH,
            name: 'Lunch',
            timeOfDay: '13:00',
            targetCalories: 700,
            targetMacros: { calories: 700, protein: 50, carbohydrates: 70, fats: 22 },
            foodEntries: [
              {
                name: 'Grilled chicken breast',
                quantity: 200,
                unit: 'g',
                calories: 330,
                protein: 62,
                carbohydrates: 0,
                fats: 7,
              },
              {
                name: 'Brown rice',
                quantity: 150,
                unit: 'g',
                calories: 170,
                protein: 4,
                carbohydrates: 35,
                fats: 1.5,
              },
            ],
          },
        ],
      },
    ];
  });

  const [selectedWeekday, setSelectedWeekday] = useState<Weekday>(Weekday.MONDAY);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Copy Day Modal state
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [copyTargetWeekday, setCopyTargetWeekday] = useState<Weekday>(Weekday.TUESDAY);

  const createPlanMutation = useCreateNutritionPlan();
  const updatePlanMutation = useUpdateNutritionPlan();
  const createVersionMutation = useCreateNutritionPlanVersion();
  const submitPlanMutation = useSubmitNutritionPlan();
  const isEditingDraft = !!(existingPlan && existingPlan.status === NutritionPlanStatus.DRAFT);
  const isPending =
    createPlanMutation.isPending ||
    updatePlanMutation.isPending ||
    createVersionMutation.isPending ||
    submitPlanMutation.isPending;

  const currentDay = nutritionDays.find((d) => d.weekday === selectedWeekday);

  // Configure a new weekday
  const handleConfigureWeekday = (weekday: Weekday) => {
    const newDay: NutritionDayInputDTO = {
      weekday,
      dayNumber: WEEKDAY_ORDER[weekday],
      name: `${WEEKDAY_LABELS[weekday]} Plan`,
      targetCalories: 2000,
      dailyMacroTargets: { calories: 2000, protein: 150, carbohydrates: 200, fats: 65 },
      hydrationGoal: { targetMl: 2500 },
      meals: [
        {
          mealType: MealType.BREAKFAST,
          name: 'Breakfast',
          timeOfDay: '08:00',
          targetCalories: 500,
          targetMacros: { calories: 500, protein: 35, carbohydrates: 50, fats: 15 },
          foodEntries: [],
        },
      ],
    };
    setNutritionDays((prev) => [...prev, newDay]);
  };

  // Remove weekday configuration
  const handleRemoveWeekday = (weekday: Weekday) => {
    if (nutritionDays.length <= 1) {
      setErrorMessage('Nutrition plan must contain at least one configured weekday.');
      return;
    }
    setNutritionDays((prev) => prev.filter((d) => d.weekday !== weekday));
  };

  // Update current day
  const handleUpdateCurrentDay = (updates: Partial<NutritionDayInputDTO>) => {
    setNutritionDays((prev) =>
      prev.map((d) => (d.weekday === selectedWeekday ? { ...d, ...updates } : d)),
    );
  };

  // Copy Day functionality (Deep clone with fresh UUIDs)
  const handleExecuteCopyDay = () => {
    if (!currentDay) return;

    // Deep clone meals and food entries with fresh IDs
    const clonedMeals: MealInputDTO[] = currentDay.meals.map((m) => ({
      mealType: m.mealType,
      name: m.name,
      timeOfDay: m.timeOfDay || '',
      targetCalories: m.targetCalories,
      targetMacros: m.targetMacros ? { ...m.targetMacros } : undefined,
      foodEntries: (m.foodEntries || []).map((fe) => ({
        id:
          typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `fe-${Math.random().toString(36).slice(2, 9)}`,
        name: fe.name,
        quantity: fe.quantity,
        unit: fe.unit,
        calories: fe.calories,
        protein: fe.protein,
        carbohydrates: fe.carbohydrates,
        fats: fe.fats,
        notes: fe.notes,
        alternatives: (fe.alternatives || []).map((alt) => ({
          id:
            typeof crypto !== 'undefined' && crypto.randomUUID
              ? crypto.randomUUID()
              : `alt-${Math.random().toString(36).slice(2, 9)}`,
          name: alt.name,
          quantity: alt.quantity,
          unit: alt.unit,
          calories: alt.calories,
          protein: alt.protein,
          carbohydrates: alt.carbohydrates,
          fats: alt.fats,
        })),
      })),
      notes: m.notes || '',
    }));

    const clonedDay: NutritionDayInputDTO = {
      weekday: copyTargetWeekday,
      dayNumber: WEEKDAY_ORDER[copyTargetWeekday],
      name: `${WEEKDAY_LABELS[copyTargetWeekday]} (Copied from ${WEEKDAY_LABELS[selectedWeekday]})`,
      targetCalories: currentDay.targetCalories,
      dailyMacroTargets: currentDay.dailyMacroTargets
        ? { ...currentDay.dailyMacroTargets }
        : undefined,
      hydrationGoal: currentDay.hydrationGoal ? { ...currentDay.hydrationGoal } : undefined,
      meals: clonedMeals,
      notes: currentDay.notes || '',
    };

    setNutritionDays((prev) => {
      const filtered = prev.filter((d) => d.weekday !== copyTargetWeekday);
      return [...filtered, clonedDay];
    });

    setIsCopyModalOpen(false);
    setSelectedWeekday(copyTargetWeekday);
  };

  // Meal Management for current weekday
  const handleAddMeal = () => {
    if (!currentDay) return;
    const currentMeals = currentDay.meals || [];
    const newMeal: MealInputDTO = {
      mealType: MealType.SNACK,
      name: 'Afternoon Snack',
      timeOfDay: '16:00',
      targetCalories: 300,
      targetMacros: { calories: 300, protein: 20, carbohydrates: 30, fats: 10 },
      foodEntries: [],
    };
    handleUpdateCurrentDay({ meals: [...currentMeals, newMeal] });
  };

  const handleRemoveMeal = (mealIndex: number) => {
    if (!currentDay) return;
    const currentMeals = currentDay.meals || [];
    const updatedMeals = currentMeals.filter((_, idx) => idx !== mealIndex);
    handleUpdateCurrentDay({ meals: updatedMeals });
  };

  const handleUpdateMeal = (mealIndex: number, updates: Partial<MealInputDTO>) => {
    if (!currentDay) return;
    const currentMeals = [...(currentDay.meals || [])];
    currentMeals[mealIndex] = { ...currentMeals[mealIndex], ...updates };
    handleUpdateCurrentDay({ meals: currentMeals });
  };

  // Food Entry Management
  const handleAddFoodEntry = (mealIndex: number) => {
    if (!currentDay) return;
    const currentMeals = [...(currentDay.meals || [])];
    const meal = currentMeals[mealIndex];
    const currentEntries = meal.foodEntries || [];
    const newEntry: FoodEntry = {
      id:
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `fe-${Math.random().toString(36).slice(2, 9)}`,
      name: '',
      quantity: 100,
      unit: 'g',
      calories: 100,
      protein: 10,
      carbohydrates: 10,
      fats: 2,
      alternatives: [],
    };
    currentMeals[mealIndex] = { ...meal, foodEntries: [...currentEntries, newEntry] };
    handleUpdateCurrentDay({ meals: currentMeals });
  };

  const handleRemoveFoodEntry = (mealIndex: number, entryIndex: number) => {
    if (!currentDay) return;
    const currentMeals = [...(currentDay.meals || [])];
    const meal = currentMeals[mealIndex];
    const updatedEntries = (meal.foodEntries || []).filter((_, idx) => idx !== entryIndex);
    currentMeals[mealIndex] = { ...meal, foodEntries: updatedEntries };
    handleUpdateCurrentDay({ meals: currentMeals });
  };

  const handleUpdateFoodEntry = (
    mealIndex: number,
    entryIndex: number,
    updates: Partial<FoodEntry>,
  ) => {
    if (!currentDay) return;
    const currentMeals = [...(currentDay.meals || [])];
    const meal = currentMeals[mealIndex];
    const updatedEntries = [...(meal.foodEntries || [])];
    updatedEntries[entryIndex] = { ...updatedEntries[entryIndex], ...updates };
    currentMeals[mealIndex] = { ...meal, foodEntries: updatedEntries };
    handleUpdateCurrentDay({ meals: currentMeals });
  };

  // Food Alternative Management
  const [expandedAlternatives, setExpandedAlternatives] = useState<Record<string, boolean>>({});

  const toggleAlternatives = (key: string) => {
    setExpandedAlternatives((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddAlternative = (mealIndex: number, entryIndex: number) => {
    if (!currentDay) return;
    const currentMeals = [...(currentDay.meals || [])];
    const meal = currentMeals[mealIndex];
    const updatedEntries = [...(meal.foodEntries || [])];
    const food = updatedEntries[entryIndex];
    const currentAlts = food.alternatives || [];
    const newAlt: FoodAlternative = {
      id:
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `alt-${Math.random().toString(36).slice(2, 9)}`,
      name: '',
      quantity: food.quantity || 100,
      unit: food.unit || 'g',
      calories: food.calories ?? 100,
      protein: food.protein ?? 10,
      carbohydrates: food.carbohydrates ?? 10,
      fats: food.fats ?? 2,
    };
    updatedEntries[entryIndex] = { ...food, alternatives: [...currentAlts, newAlt] };
    currentMeals[mealIndex] = { ...meal, foodEntries: updatedEntries };
    handleUpdateCurrentDay({ meals: currentMeals });
    setExpandedAlternatives((prev) => ({ ...prev, [`${mealIndex}-${entryIndex}`]: true }));
  };

  const handleUpdateAlternative = (
    mealIndex: number,
    entryIndex: number,
    altIndex: number,
    updates: Partial<FoodAlternative>,
  ) => {
    if (!currentDay) return;
    const currentMeals = [...(currentDay.meals || [])];
    const meal = currentMeals[mealIndex];
    const updatedEntries = [...(meal.foodEntries || [])];
    const food = updatedEntries[entryIndex];
    const updatedAlts = [...(food.alternatives || [])];
    updatedAlts[altIndex] = { ...updatedAlts[altIndex], ...updates };
    updatedEntries[entryIndex] = { ...food, alternatives: updatedAlts };
    currentMeals[mealIndex] = { ...meal, foodEntries: updatedEntries };
    handleUpdateCurrentDay({ meals: currentMeals });
  };

  const handleRemoveAlternative = (mealIndex: number, entryIndex: number, altIndex: number) => {
    if (!currentDay) return;
    const currentMeals = [...(currentDay.meals || [])];
    const meal = currentMeals[mealIndex];
    const updatedEntries = [...(meal.foodEntries || [])];
    const food = updatedEntries[entryIndex];
    const updatedAlts = (food.alternatives || []).filter((_, idx) => idx !== altIndex);
    updatedEntries[entryIndex] = { ...food, alternatives: updatedAlts };
    currentMeals[mealIndex] = { ...meal, foodEntries: updatedEntries };
    handleUpdateCurrentDay({ meals: currentMeals });
  };

  // Submit Plan
  const handleSave = async (andSubmit: boolean = false) => {
    setErrorMessage(null);
    if (!title.trim()) {
      setErrorMessage('Please provide a title for the nutrition plan.');
      return;
    }
    if (nutritionDays.length === 0) {
      setErrorMessage('Please configure at least one weekday prescription.');
      return;
    }

    // Validate and clean nutrition days
    const sanitizedNutritionDays: NutritionDayInputDTO[] = [];

    for (const d of nutritionDays) {
      if (!d.meals || d.meals.length === 0) {
        setErrorMessage(
          `Weekday ${WEEKDAY_LABELS[d.weekday]} must contain at least one prescribed meal.`,
        );
        return;
      }

      const sanitizedMeals: MealInputDTO[] = [];
      for (const m of d.meals) {
        if (!m.name || !m.name.trim()) {
          setErrorMessage(`A meal in ${WEEKDAY_LABELS[d.weekday]} is missing a name.`);
          return;
        }

        const sanitizedFoodEntries: FoodEntry[] = [];
        if (m.foodEntries) {
          for (const fe of m.foodEntries) {
            if (!fe.name || !fe.name.trim()) {
              setErrorMessage(
                `A food item in "${m.name}" (${WEEKDAY_LABELS[d.weekday]}) has an empty name. Please specify a food name or remove the empty item.`,
              );
              return;
            }
            if (fe.quantity < 0) {
              setErrorMessage(`Food item "${fe.name}" cannot have negative quantity.`);
              return;
            }

            const sanitizedAlternatives: FoodAlternative[] = [];
            if (fe.alternatives) {
              for (const alt of fe.alternatives) {
                if (alt.name && alt.name.trim()) {
                  sanitizedAlternatives.push({
                    id:
                      alt.id ||
                      (typeof crypto !== 'undefined' && crypto.randomUUID
                        ? crypto.randomUUID()
                        : `alt-${Math.random().toString(36).slice(2, 9)}`),
                    name: alt.name.trim(),
                    quantity: alt.quantity > 0 ? alt.quantity : 1,
                    unit: alt.unit ? alt.unit.trim() : 'g',
                    calories:
                      alt.calories !== undefined && alt.calories !== null
                        ? Number(alt.calories)
                        : null,
                    protein:
                      alt.protein !== undefined && alt.protein !== null
                        ? Number(alt.protein)
                        : null,
                    carbohydrates:
                      alt.carbohydrates !== undefined && alt.carbohydrates !== null
                        ? Number(alt.carbohydrates)
                        : null,
                    fats: alt.fats !== undefined && alt.fats !== null ? Number(alt.fats) : null,
                  });
                }
              }
            }

            sanitizedFoodEntries.push({
              ...fe,
              id:
                fe.id ||
                (typeof crypto !== 'undefined' && crypto.randomUUID
                  ? crypto.randomUUID()
                  : `fe-${Math.random().toString(36).slice(2, 9)}`),
              name: fe.name.trim(),
              unit: fe.unit.trim() || 'g',
              alternatives: sanitizedAlternatives,
            });
          }
        }

        sanitizedMeals.push({
          ...m,
          name: m.name.trim(),
          foodEntries: sanitizedFoodEntries,
        });
      }

      sanitizedNutritionDays.push({
        ...d,
        meals: sanitizedMeals,
      });
    }

    try {
      let savedPlan: NutritionPlan;
      if (isEditingDraft && existingPlan) {
        // Branch 1: Editing an existing DRAFT plan
        const payload: UpdateNutritionPlanDTO = {
          title: title.trim(),
          description: description.trim() || undefined,
          durationWeeks: Number(durationWeeks) || 4,
          nutritionDays: sanitizedNutritionDays,
        };

        savedPlan = await updatePlanMutation.mutateAsync({
          planId: existingPlan.id,
          payload,
        });
      } else if (basePlanForVersion) {
        // Branch 2: Relationship has history — fork a new version from basePlanForVersion.
        const payload: CreateNutritionPlanVersionDTO = {
          title: title.trim(),
          description: description.trim() || undefined,
          durationWeeks: Number(durationWeeks) || 4,
          nutritionDays: sanitizedNutritionDays,
        };

        savedPlan = await createVersionMutation.mutateAsync({
          planId: basePlanForVersion.id,
          payload,
        });
      } else {
        // Branch 3: Truly new relationship — initial plan creation
        const payload: CreateNutritionPlanDTO = {
          coachingRelationshipId,
          title: title.trim(),
          description: description.trim() || undefined,
          durationWeeks: Number(durationWeeks) || 4,
          nutritionDays: sanitizedNutritionDays,
        };

        savedPlan = await createPlanMutation.mutateAsync(payload);
      }

      if (andSubmit) {
        const submitted = await submitPlanMutation.mutateAsync(savedPlan.id);
        onSaved(submitted);
      } else {
        onSaved(savedPlan);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to save nutrition plan. Please check all fields.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="rounded-xl border-[var(--color-border)] font-bold"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[var(--color-heading)]">
                {existingPlan
                  ? isReadOnly
                    ? 'View Nutrition Plan'
                    : 'Edit Draft Plan'
                  : 'New Nutrition Plan'}
              </h2>
              {existingPlan && <NutritionPlanStatusBadge status={existingPlan.status} />}
            </div>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {isReadOnly
                ? 'This plan is active or completed and cannot be modified directly.'
                : isEditingDraft
                  ? `Edit draft version v${existingPlan?.version} and configure weekly prescriptions.`
                  : 'Configure recurring weekly weekday prescriptions, caloric intake, and meal plans.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isReadOnly && existingPlan && onCreateVersion && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onCreateVersion(existingPlan)}
              className="rounded-xl font-bold shadow-sm"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              Create New Version
            </Button>
          )}

          {!isReadOnly && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSave(false)}
                disabled={isPending}
                className="rounded-xl font-bold shadow-xs border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <Save className="w-4 h-4 mr-1.5" />
                {isPending && !submitPlanMutation.isPending
                  ? isEditingDraft
                    ? 'Updating Draft...'
                    : 'Saving Draft...'
                  : isEditingDraft
                    ? 'Save Draft'
                    : 'Save Draft'}
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSave(true)}
                disabled={isPending}
                className="rounded-xl font-bold shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Send className="w-4 h-4 mr-1.5" />
                {submitPlanMutation.isPending ? 'Submitting...' : 'Submit for Client Approval'}
              </Button>
            </>
          )}
        </div>
      </div>

      {isReadOnly && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800 space-y-1">
            <span className="font-bold">Active / Historical Prescription:</span>
            <p>
              To adjust meals or targets for an active or completed prescription, use the
              &quot;Create New Version&quot; button to fork this plan into an independent new draft.
            </p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Plan Metadata Card */}
      <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-[var(--color-heading)]">Plan Information</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <Label className="text-xs font-semibold">Plan Title *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cutting Phase 1: High Protein"
              disabled={isReadOnly}
              className="rounded-xl text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Duration (Weeks) *</Label>
            <Input
              type="number"
              min={1}
              max={52}
              value={durationWeeks}
              onChange={(e) => setDurationWeeks(Number(e.target.value))}
              disabled={isReadOnly}
              className="rounded-xl text-xs"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Description / Coaching Notes</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Key dietary principles, supplement instructions, timing tips..."
            rows={2}
            disabled={isReadOnly}
            className="rounded-xl text-xs"
          />
        </div>
      </div>

      {/* Weekday Prescription Navigation Tabs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[var(--color-heading)]">
              Weekly Weekday Prescriptions
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Configure daily nutrition for each day of the week. These repeat across the{' '}
              {durationWeeks}-week period.
            </p>
          </div>
        </div>

        {/* 7 Weekday Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {ALL_WEEKDAYS.map((wd) => {
            const isConfigured = nutritionDays.some((d) => d.weekday === wd);
            const isSelected = selectedWeekday === wd;

            return (
              <button
                key={wd}
                type="button"
                onClick={() => setSelectedWeekday(wd)}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-[72px] ${
                  isSelected
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm'
                    : isConfigured
                      ? 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-heading)] hover:border-[var(--color-primary)]/40'
                      : 'bg-[var(--color-surface-alt)]/50 border-dashed border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-xs font-bold ${isSelected ? 'text-white' : ''}`}>
                    {WEEKDAY_LABELS[wd]}
                  </span>
                  {isConfigured && (
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-500'}`}
                    />
                  )}
                </div>

                <div className="text-[10px] mt-1 font-medium">
                  {isConfigured ? (
                    <span
                      className={
                        isSelected ? 'text-white/80' : 'text-[var(--color-text-secondary)]'
                      }
                    >
                      {nutritionDays.find((d) => d.weekday === wd)?.targetCalories || 0} kcal
                    </span>
                  ) : (
                    <span className="italic opacity-60">Not set</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Weekday Detail Editor or Not Configured State */}
        {currentDay ? (
          <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs space-y-6">
            {/* Day Header Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
                <h4 className="text-base font-bold text-[var(--color-heading)]">
                  {WEEKDAY_LABELS[selectedWeekday]} Prescription
                </h4>
              </div>

              <div className="flex items-center gap-2">
                {!isReadOnly && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Set first non-selected weekday as default copy target
                        const otherWd =
                          ALL_WEEKDAYS.find((w) => w !== selectedWeekday) || Weekday.TUESDAY;
                        setCopyTargetWeekday(otherWd);
                        setIsCopyModalOpen(true);
                      }}
                      className="rounded-xl text-xs font-bold border-[var(--color-border)]"
                    >
                      <Copy className="w-3.5 h-3.5 mr-1.5 text-[var(--color-primary)]" />
                      Copy Day
                    </Button>

                    {nutritionDays.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveWeekday(selectedWeekday)}
                        className="rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border-slate-200"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                        Remove Day
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Day Target Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold">Day Label</Label>
                <Input
                  value={currentDay.name || ''}
                  onChange={(e) => handleUpdateCurrentDay({ name: e.target.value })}
                  placeholder={`e.g. ${WEEKDAY_LABELS[selectedWeekday]} - High Carb`}
                  disabled={isReadOnly}
                  className="rounded-xl text-xs h-9"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] font-semibold">Target Calories (kcal)</Label>
                <Input
                  type="number"
                  value={currentDay.targetCalories || ''}
                  onChange={(e) =>
                    handleUpdateCurrentDay({
                      targetCalories: Number(e.target.value),
                      dailyMacroTargets: {
                        calories: Number(e.target.value),
                        protein: currentDay.dailyMacroTargets?.protein || 0,
                        carbohydrates: currentDay.dailyMacroTargets?.carbohydrates || 0,
                        fats: currentDay.dailyMacroTargets?.fats || 0,
                      },
                    })
                  }
                  placeholder="2200"
                  disabled={isReadOnly}
                  className="rounded-xl text-xs h-9"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] font-semibold">Hydration Goal (ml)</Label>
                <Input
                  type="number"
                  value={currentDay.hydrationGoal?.targetMl || ''}
                  onChange={(e) =>
                    handleUpdateCurrentDay({
                      hydrationGoal: {
                        targetMl: Number(e.target.value),
                        notes: currentDay.hydrationGoal?.notes || '',
                      },
                    })
                  }
                  placeholder="3000"
                  disabled={isReadOnly}
                  className="rounded-xl text-xs h-9"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] font-semibold">Macros (P / C / F g)</Label>
                <div className="grid grid-cols-3 gap-1">
                  <Input
                    type="number"
                    placeholder="P(g)"
                    value={currentDay.dailyMacroTargets?.protein || ''}
                    onChange={(e) =>
                      handleUpdateCurrentDay({
                        dailyMacroTargets: {
                          calories: currentDay.targetCalories || 0,
                          protein: Number(e.target.value),
                          carbohydrates: currentDay.dailyMacroTargets?.carbohydrates || 0,
                          fats: currentDay.dailyMacroTargets?.fats || 0,
                        },
                      })
                    }
                    disabled={isReadOnly}
                    className="rounded-lg text-xs h-9 px-2"
                  />
                  <Input
                    type="number"
                    placeholder="C(g)"
                    value={currentDay.dailyMacroTargets?.carbohydrates || ''}
                    onChange={(e) =>
                      handleUpdateCurrentDay({
                        dailyMacroTargets: {
                          calories: currentDay.targetCalories || 0,
                          protein: currentDay.dailyMacroTargets?.protein || 0,
                          carbohydrates: Number(e.target.value),
                          fats: currentDay.dailyMacroTargets?.fats || 0,
                        },
                      })
                    }
                    disabled={isReadOnly}
                    className="rounded-lg text-xs h-9 px-2"
                  />
                  <Input
                    type="number"
                    placeholder="F(g)"
                    value={currentDay.dailyMacroTargets?.fats || ''}
                    onChange={(e) =>
                      handleUpdateCurrentDay({
                        dailyMacroTargets: {
                          calories: currentDay.targetCalories || 0,
                          protein: currentDay.dailyMacroTargets?.protein || 0,
                          carbohydrates: currentDay.dailyMacroTargets?.carbohydrates || 0,
                          fats: Number(e.target.value),
                        },
                      })
                    }
                    disabled={isReadOnly}
                    className="rounded-lg text-xs h-9 px-2"
                  />
                </div>
              </div>
            </div>

            {/* Meals Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-heading)]">
                  <Utensils className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                  <span>Prescribed Meals ({currentDay.meals?.length || 0})</span>
                </div>

                {!isReadOnly && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddMeal}
                    className="rounded-xl text-[11px] font-bold h-7 px-2.5"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Meal
                  </Button>
                )}
              </div>

              {(currentDay.meals || []).map((meal, mealIdx) => (
                <div
                  key={`meal-${mealIdx}`}
                  className="p-4 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)] space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-end">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-semibold">Meal Type</Label>
                      <select
                        value={meal.mealType}
                        onChange={(e) =>
                          handleUpdateMeal(mealIdx, {
                            mealType: e.target.value as MealType,
                          })
                        }
                        disabled={isReadOnly}
                        className="w-full rounded-lg text-xs h-8 px-2 bg-[var(--color-surface)] border border-[var(--color-border)]"
                      >
                        <option value={MealType.BREAKFAST}>Breakfast</option>
                        <option value={MealType.LUNCH}>Lunch</option>
                        <option value={MealType.DINNER}>Dinner</option>
                        <option value={MealType.SNACK}>Snack</option>
                        <option value={MealType.CUSTOM}>Custom</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[10px] font-semibold">Meal Name</Label>
                      <Input
                        value={meal.name}
                        onChange={(e) => handleUpdateMeal(mealIdx, { name: e.target.value })}
                        placeholder="e.g. Post-Workout Meal"
                        disabled={isReadOnly}
                        className="rounded-lg text-xs h-8 bg-[var(--color-surface)]"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[10px] font-semibold">Time of Day</Label>
                      <Input
                        value={meal.timeOfDay || ''}
                        onChange={(e) => handleUpdateMeal(mealIdx, { timeOfDay: e.target.value })}
                        placeholder="e.g. 08:30"
                        disabled={isReadOnly}
                        className="rounded-lg text-xs h-8 bg-[var(--color-surface)]"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="space-y-1 flex-1">
                        <Label className="text-[10px] font-semibold">Target kcal</Label>
                        <Input
                          type="number"
                          value={meal.targetCalories || ''}
                          onChange={(e) =>
                            handleUpdateMeal(mealIdx, {
                              targetCalories: Number(e.target.value),
                            })
                          }
                          placeholder="500"
                          disabled={isReadOnly}
                          className="rounded-lg text-xs h-8 bg-[var(--color-surface)]"
                        />
                      </div>

                      {!isReadOnly && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMeal(mealIdx)}
                          className="p-2 text-[var(--color-text-muted)] hover:text-red-500 rounded-lg"
                          title="Remove meal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Food Entries Rows */}
                  <div className="space-y-2 pt-1 border-t border-[var(--color-border)]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-[var(--color-text-secondary)]">
                        Food Items ({meal.foodEntries?.length || 0})
                      </span>
                      {!isReadOnly && (
                        <button
                          type="button"
                          onClick={() => handleAddFoodEntry(mealIdx)}
                          className="text-[10px] font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add Item
                        </button>
                      )}
                    </div>

                    {(meal.foodEntries || []).map((entry, entryIdx) => {
                      const altKey = `${mealIdx}-${entryIdx}`;
                      const isAltExpanded = !!expandedAlternatives[altKey];
                      const altsCount = entry.alternatives?.length || 0;

                      return (
                        <div
                          key={`food-${mealIdx}-${entryIdx}`}
                          className="space-y-2 bg-[var(--color-surface)] p-2.5 rounded-xl border border-[var(--color-border)] text-xs shadow-2xs"
                        >
                          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 items-center">
                            <div className="col-span-2 sm:col-span-2">
                              <Input
                                value={entry.name}
                                onChange={(e) =>
                                  handleUpdateFoodEntry(mealIdx, entryIdx, {
                                    name: e.target.value,
                                  })
                                }
                                placeholder="Food name (e.g. Appam)"
                                disabled={isReadOnly}
                                className="h-7 text-xs rounded-lg"
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                value={entry.quantity}
                                onChange={(e) =>
                                  handleUpdateFoodEntry(mealIdx, entryIdx, {
                                    quantity: Number(e.target.value),
                                  })
                                }
                                placeholder="Qty"
                                disabled={isReadOnly}
                                className="h-7 text-xs rounded-lg"
                              />
                            </div>
                            <div>
                              <Input
                                value={entry.unit}
                                onChange={(e) =>
                                  handleUpdateFoodEntry(mealIdx, entryIdx, {
                                    unit: e.target.value,
                                  })
                                }
                                placeholder="unit (e.g. piece, g)"
                                disabled={isReadOnly}
                                className="h-7 text-xs rounded-lg"
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                value={entry.calories || ''}
                                onChange={(e) =>
                                  handleUpdateFoodEntry(mealIdx, entryIdx, {
                                    calories: Number(e.target.value),
                                  })
                                }
                                placeholder="kcal"
                                disabled={isReadOnly}
                                className="h-7 text-xs rounded-lg"
                              />
                            </div>

                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => toggleAlternatives(altKey)}
                                title="Configure alternatives for this food"
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-1 ${
                                  altsCount > 0
                                    ? 'bg-purple-50 text-purple-800 border-purple-200'
                                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                <Repeat className="w-3 h-3 text-purple-600" />
                                <span>Alts ({altsCount})</span>
                                {isAltExpanded ? (
                                  <ChevronUp className="w-3 h-3 text-slate-400" />
                                ) : (
                                  <ChevronDown className="w-3 h-3 text-slate-400" />
                                )}
                              </button>

                              {!isReadOnly && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFoodEntry(mealIdx, entryIdx)}
                                  className="p-1 text-[var(--color-text-muted)] hover:text-red-500 rounded"
                                  title="Remove food"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Nested Alternatives Section */}
                          {isAltExpanded && (
                            <div className="mt-2 p-2.5 rounded-lg bg-purple-50/40 border border-purple-200/70 space-y-2 animate-in fade-in duration-150">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-purple-900 flex items-center gap-1">
                                  <Repeat className="w-3 h-3 text-purple-600" />
                                  Configured Alternatives for &ldquo;{entry.name || 'this food'}
                                  &rdquo;
                                </span>
                                {!isReadOnly && (
                                  <button
                                    type="button"
                                    onClick={() => handleAddAlternative(mealIdx, entryIdx)}
                                    className="text-[10px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" /> Add Alternative
                                  </button>
                                )}
                              </div>

                              {(entry.alternatives || []).length === 0 ? (
                                <p className="text-[11px] text-purple-800/70 italic py-1">
                                  No alternatives configured. Click &ldquo;Add Alternative&rdquo; to
                                  prescribe options like Idli, Dosa, etc.
                                </p>
                              ) : (
                                <div className="space-y-1.5">
                                  {(entry.alternatives || []).map((alt, altIdx) => (
                                    <div
                                      key={alt.id || altIdx}
                                      className="grid grid-cols-2 sm:grid-cols-7 gap-1.5 items-center bg-white p-2 rounded-lg border border-purple-100 text-xs shadow-2xs"
                                    >
                                      <div className="col-span-2 sm:col-span-2">
                                        <Input
                                          value={alt.name}
                                          onChange={(e) =>
                                            handleUpdateAlternative(mealIdx, entryIdx, altIdx, {
                                              name: e.target.value,
                                            })
                                          }
                                          placeholder="Alt name (e.g. Idli)"
                                          disabled={isReadOnly}
                                          className="h-6 text-xs rounded"
                                        />
                                      </div>
                                      <div>
                                        <Input
                                          type="number"
                                          value={alt.quantity}
                                          onChange={(e) =>
                                            handleUpdateAlternative(mealIdx, entryIdx, altIdx, {
                                              quantity: Number(e.target.value),
                                            })
                                          }
                                          placeholder="Qty"
                                          disabled={isReadOnly}
                                          className="h-6 text-xs rounded"
                                        />
                                      </div>
                                      <div>
                                        <Input
                                          value={alt.unit}
                                          onChange={(e) =>
                                            handleUpdateAlternative(mealIdx, entryIdx, altIdx, {
                                              unit: e.target.value,
                                            })
                                          }
                                          placeholder="Unit"
                                          disabled={isReadOnly}
                                          className="h-6 text-xs rounded"
                                        />
                                      </div>
                                      <div>
                                        <Input
                                          type="number"
                                          value={alt.calories ?? ''}
                                          onChange={(e) =>
                                            handleUpdateAlternative(mealIdx, entryIdx, altIdx, {
                                              calories: Number(e.target.value),
                                            })
                                          }
                                          placeholder="kcal"
                                          disabled={isReadOnly}
                                          className="h-6 text-xs rounded"
                                        />
                                      </div>
                                      <div>
                                        <Input
                                          type="number"
                                          value={alt.protein ?? ''}
                                          onChange={(e) =>
                                            handleUpdateAlternative(mealIdx, entryIdx, altIdx, {
                                              protein: Number(e.target.value),
                                            })
                                          }
                                          placeholder="P (g)"
                                          disabled={isReadOnly}
                                          className="h-6 text-xs rounded"
                                        />
                                      </div>
                                      <div className="flex items-center justify-end">
                                        {!isReadOnly && (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleRemoveAlternative(mealIdx, entryIdx, altIdx)
                                            }
                                            className="p-1 text-slate-400 hover:text-red-500 rounded"
                                            title="Remove alternative"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Not Configured Empty State */
          <div className="p-8 rounded-2xl bg-[var(--color-surface)] border border-dashed border-[var(--color-border)] text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[var(--color-surface-alt)] flex items-center justify-center mx-auto text-[var(--color-text-muted)]">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h4 className="text-sm font-bold text-[var(--color-heading)]">
                {WEEKDAY_LABELS[selectedWeekday]} is Not Configured
              </h4>
              <p className="text-xs text-[var(--color-text-secondary)]">
                No nutrition prescription is set for this weekday. Configure it directly or copy
                from an existing weekday.
              </p>
            </div>
            {!isReadOnly && (
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleConfigureWeekday(selectedWeekday)}
                  className="rounded-xl text-xs font-bold"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Configure {WEEKDAY_LABELS[selectedWeekday]}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Copy Day Modal */}
      {isCopyModalOpen && currentDay && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
              <div className="flex items-center gap-2">
                <Copy className="w-4 h-4 text-[var(--color-primary)]" />
                <h3 className="text-base font-bold text-[var(--color-heading)]">
                  Copy Day Prescription
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCopyModalOpen(false)}
                className="p-1 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-alt)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)] space-y-1">
                <span className="font-bold text-[var(--color-heading)]">Source Weekday:</span>
                <p className="text-[var(--color-text-secondary)]">
                  {WEEKDAY_LABELS[selectedWeekday]} ({currentDay.targetCalories || 0} kcal,{' '}
                  {currentDay.meals.length} meals)
                </p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Copy To Target Weekday:</Label>
                <select
                  value={copyTargetWeekday}
                  onChange={(e) => setCopyTargetWeekday(e.target.value as Weekday)}
                  className="w-full rounded-xl text-xs h-10 px-3 bg-[var(--color-surface)] border border-[var(--color-border)] font-medium"
                >
                  {ALL_WEEKDAYS.filter((w) => w !== selectedWeekday).map((w) => (
                    <option key={w} value={w}>
                      {WEEKDAY_LABELS[w]}{' '}
                      {nutritionDays.some((d) => d.weekday === w)
                        ? '(Will overwrite)'
                        : '(Not configured)'}
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-[11px] text-[var(--color-text-muted)]">
                This creates an independent, deep-cloned copy of all meals, macro targets, and food
                entries. Editing the target day later will not affect{' '}
                {WEEKDAY_LABELS[selectedWeekday]}.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCopyModalOpen(false)}
                className="rounded-xl text-xs font-bold"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleExecuteCopyDay}
                className="rounded-xl text-xs font-bold shadow-sm"
              >
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                Confirm Copy
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
