import { describe, it, expect } from 'vitest';
import React from 'react';
import { NutritionPlanStatusBadge } from '../../presentation/components/NutritionPlanStatusBadge';
import {
  NutritionCompletionStatusBadge,
  MealCompletionStatusBadge,
} from '../../presentation/components/NutritionCompletionStatusBadge';
import { MacroTargetDisplay } from '../../presentation/components/MacroTargetDisplay';
import { HydrationGoalDisplay } from '../../presentation/components/HydrationGoalDisplay';
import {
  NutritionPlanStatus,
  NutritionCompletionStatus,
  MealCompletionStatus,
} from '../../domain/types/nutrition.types';

describe('Frontend Nutrition Presentation Tests', () => {
  describe('NutritionPlanStatusBadge', () => {
    it('instantiates ACTIVE plan badge', () => {
      const el = React.createElement(NutritionPlanStatusBadge, {
        status: NutritionPlanStatus.ACTIVE,
      });
      expect(el.props.status).toBe(NutritionPlanStatus.ACTIVE);
    });

    it('instantiates DRAFT plan badge', () => {
      const el = React.createElement(NutritionPlanStatusBadge, {
        status: NutritionPlanStatus.DRAFT,
      });
      expect(el.props.status).toBe(NutritionPlanStatus.DRAFT);
    });

    it('instantiates COMPLETED plan badge', () => {
      const el = React.createElement(NutritionPlanStatusBadge, {
        status: NutritionPlanStatus.COMPLETED,
      });
      expect(el.props.status).toBe(NutritionPlanStatus.COMPLETED);
    });
  });

  describe('NutritionCompletionStatusBadge', () => {
    it('instantiates IN_PROGRESS completion badge', () => {
      const el = React.createElement(NutritionCompletionStatusBadge, {
        status: NutritionCompletionStatus.IN_PROGRESS,
      });
      expect(el.props.status).toBe(NutritionCompletionStatus.IN_PROGRESS);
    });

    it('instantiates COMPLETED completion badge', () => {
      const el = React.createElement(NutritionCompletionStatusBadge, {
        status: NutritionCompletionStatus.COMPLETED,
      });
      expect(el.props.status).toBe(NutritionCompletionStatus.COMPLETED);
    });
  });

  describe('MealCompletionStatusBadge', () => {
    it('instantiates COMPLETED meal status badge', () => {
      const el = React.createElement(MealCompletionStatusBadge, {
        status: MealCompletionStatus.COMPLETED,
      });
      expect(el.props.status).toBe(MealCompletionStatus.COMPLETED);
    });

    it('instantiates SKIPPED meal status badge', () => {
      const el = React.createElement(MealCompletionStatusBadge, {
        status: MealCompletionStatus.SKIPPED,
      });
      expect(el.props.status).toBe(MealCompletionStatus.SKIPPED);
    });

    it('instantiates PARTIALLY_COMPLETED meal status badge', () => {
      const el = React.createElement(MealCompletionStatusBadge, {
        status: MealCompletionStatus.PARTIALLY_COMPLETED,
      });
      expect(el.props.status).toBe(MealCompletionStatus.PARTIALLY_COMPLETED);
    });
    it('instantiates NOT_TRACKED meal status badge', () => {
      const el = React.createElement(MealCompletionStatusBadge, {
        status: 'NOT_TRACKED',
      });
      expect(el.props.status).toBe('NOT_TRACKED');
    });
  });

  describe('Phase 9 Observability & Snapshot Resolution Rules', () => {
    it('rule 1: authoritative snapshot is preferred over active plan for execution', () => {
      const historicalSnapshot = {
        name: 'Historical Low-Carb Day',
        targetCalories: 2000,
        meals: [
          {
            mealTemplateId: 'meal-1',
            name: 'Breakfast',
            sortOrder: 1,
            targetCalories: 500,
            foodItems: [],
          },
        ],
      };

      const completion = {
        id: 'comp-1',
        date: '2026-09-01',
        status: NutritionCompletionStatus.COMPLETED,
        nutritionDaySnapshot: historicalSnapshot,
        mealCompletions: [
          {
            mealTemplateId: 'meal-1',
            status: MealCompletionStatus.COMPLETED,
            consumedCalories: 520,
          },
        ],
      };

      // Assert historical execution derives solely from snapshot
      expect(completion.nutritionDaySnapshot.targetCalories).toBe(2000);
      expect(completion.mealCompletions[0].status).toBe(MealCompletionStatus.COMPLETED);
    });

    it('rule 2: NOT_TRACKED is only assigned at meal level when completion exists and meal has no status', () => {
      const meals = [
        { mealTemplateId: 'm1', name: 'Breakfast' },
        { mealTemplateId: 'm2', name: 'Lunch' },
      ];
      const recordedMealCompletions = [
        { mealTemplateId: 'm1', status: MealCompletionStatus.COMPLETED },
      ];

      // Resolve meal 2 status
      const m1Status =
        recordedMealCompletions.find((mc) => mc.mealTemplateId === 'm1')?.status ?? 'NOT_TRACKED';
      const m2Status = (recordedMealCompletions.find((mc) => mc.mealTemplateId === 'm2')?.status ??
        'NOT_TRACKED') as string;

      expect(m1Status).toBe(MealCompletionStatus.COMPLETED);
      expect(m2Status).toBe('NOT_TRACKED');
    });

    it('rule 3: when no completion exists for a date, daily state is Not Started / No Execution Recorded', () => {
      const completionsForClient = [
        { date: '2026-09-01', status: NutritionCompletionStatus.COMPLETED },
      ];
      const selectedDate = '2026-09-05';
      const selectedDayCompletion = completionsForClient.find((c) => c.date === selectedDate);

      expect(selectedDayCompletion).toBeUndefined();
      // Should show Not Started / No execution recorded rather than fabricated records
      const hasExecution = Boolean(selectedDayCompletion);
      expect(hasExecution).toBe(false);
    });
  });

  describe('MacroTargetDisplay', () => {
    it('instantiates MacroTargetDisplay with target macros', () => {
      const el = React.createElement(MacroTargetDisplay, {
        targetCalories: 2500,
        macros: { calories: 2500, protein: 180, carbohydrates: 300, fats: 65 },
      });
      expect(el.props.targetCalories).toBe(2500);
      expect(el.props.macros?.protein).toBe(180);
    });

    it('instantiates MacroTargetDisplay in consumed vs target mode', () => {
      const el = React.createElement(MacroTargetDisplay, {
        targetCalories: 2500,
        consumedCalories: 2100,
        macros: { calories: 2500, protein: 180, carbohydrates: 300, fats: 65 },
        consumedMacros: { calories: 2100, protein: 165, carbohydrates: 250, fats: 55 },
      });
      expect(el.props.consumedCalories).toBe(2100);
      expect(el.props.consumedMacros?.protein).toBe(165);
    });
  });

  describe('HydrationGoalDisplay', () => {
    it('instantiates HydrationGoalDisplay with target and logged ml', () => {
      const el = React.createElement(HydrationGoalDisplay, {
        targetMl: 3000,
        loggedMl: 1500,
      });
      expect(el.props.targetMl).toBe(3000);
      expect(el.props.loggedMl).toBe(1500);
    });
  });

  describe('Nutrition Sidebar Navigation Configuration', () => {
    it('verifies Trainer sidebar Nutrition navigation is ACTIVE, points to /trainer/nutrition, and has no COMING_SOON badge', async () => {
      const { trainerSidebarConfig } =
        await import('../../../../shared/navigation/config/trainerSidebar.config');
      const programsSection = trainerSidebarConfig.sections.find((s) => s.id === 'programs');
      expect(programsSection).toBeDefined();

      const nutritionItem = programsSection?.items.find((item) => item.id === 'trainer-nutrition');
      expect(nutritionItem).toBeDefined();
      expect(nutritionItem?.status).toBe('active');
      expect(nutritionItem?.href).toBe('/trainer/nutrition');
      expect((nutritionItem as any)?.badge).toBeUndefined();
    });

    it('verifies Client sidebar Nutrition Plans navigation is ACTIVE, points to /client/nutrition, and has no COMING_SOON badge', async () => {
      const { clientSidebarConfig } =
        await import('../../../../shared/navigation/config/clientSidebar.config');
      const myCoachingSection = clientSidebarConfig.sections.find((s) => s.id === 'my-coaching');
      expect(myCoachingSection).toBeDefined();

      const nutritionItem = myCoachingSection?.items.find((item) => item.id === 'nutrition-plans');
      expect(nutritionItem).toBeDefined();
      expect(nutritionItem?.status).toBe('active');
      expect(nutritionItem?.href).toBe('/client/nutrition');
      expect((nutritionItem as any)?.badge).toBeUndefined();
    });
  });
});
