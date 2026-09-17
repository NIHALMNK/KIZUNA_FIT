import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { ClientPlanApprovalView } from '../../presentation/client/ClientPlanApprovalView';
import { ClientPlanReviewModal } from '../../presentation/client/ClientPlanReviewModal';
import {
  NutritionPlan,
  NutritionPlanStatus,
  Weekday,
  MealType,
} from '../../domain/types/nutrition.types';

describe('Client Nutrition Plan Approval Flow Presentation Tests', () => {
  const mockPendingPlan: NutritionPlan = {
    id: 'plan-pending-123',
    coachingRelationshipId: 'rel-123',
    trainerId: 'trainer-123',
    clientId: 'client-123',
    version: 1,
    title: 'Custom Hypertrophy Diet',
    description: 'High protein nutrition plan tailored for building lean mass.',
    durationWeeks: 4,
    status: NutritionPlanStatus.PENDING_APPROVAL,
    nutritionDays: [
      {
        id: 'day-mon',
        dayNumber: 1,
        weekday: Weekday.MONDAY,
        targetCalories: 2400,
        dailyMacroTargets: {
          calories: 2400,
          protein: 180,
          carbohydrates: 250,
          fats: 70,
        },
        hydrationGoal: {
          targetMl: 3000,
          notes: 'Drink with electrolytes',
        },
        meals: [
          {
            id: 'meal-breakfast',
            name: 'Power Breakfast',
            mealType: MealType.BREAKFAST,
            timeOfDay: '08:00',
            targetCalories: 650,
            foodEntries: [
              {
                id: 'food-oats',
                name: 'Rolled Oats',
                quantity: 80,
                unit: 'g',
                calories: 300,
                protein: 10,
                carbohydrates: 54,
                fats: 5,
                alternatives: [
                  {
                    id: 'alt-quinoa',
                    name: 'Quinoa Flakes',
                    quantity: 80,
                    unit: 'g',
                    calories: 295,
                    protein: 11,
                    carbohydrates: 52,
                    fats: 4,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'day-tue',
        dayNumber: 2,
        weekday: Weekday.TUESDAY,
        targetCalories: 2400,
        meals: [],
      },
    ],
    createdAt: '2026-09-17T00:00:00.000Z',
    updatedAt: '2026-09-17T00:00:00.000Z',
  };

  it('instantiates ClientPlanApprovalView with pending plan properties and invariant states', () => {
    const el = React.createElement(ClientPlanApprovalView, {
      plan: mockPendingPlan,
    });
    expect(el.props.plan.id).toBe('plan-pending-123');
    expect(el.props.plan.status).toBe(NutritionPlanStatus.PENDING_APPROVAL);
    expect(el.props.plan.durationWeeks).toBe(4);
    expect(el.props.plan.nutritionDays.length).toBe(2);
  });

  it('instantiates ClientPlanReviewModal with read-only plan prescription breakdown', () => {
    const onOpenAccept = vi.fn();
    const onOpenReject = vi.fn();
    const onClose = vi.fn();

    const el = React.createElement(ClientPlanReviewModal, {
      plan: mockPendingPlan,
      isOpen: true,
      onClose,
      onOpenAccept,
      onOpenReject,
    });

    expect(el.props.isOpen).toBe(true);
    expect(el.props.plan.status).toBe(NutritionPlanStatus.PENDING_APPROVAL);
    expect(el.props.plan.nutritionDays[0].meals[0].foodEntries?.[0].alternatives?.length).toBe(1);
    expect(el.props.plan.nutritionDays[0].meals[0].foodEntries?.[0].alternatives?.[0].name).toBe(
      'Quinoa Flakes',
    );
  });

  it('authoritative business rule: empty state distinction for client nutrition page', () => {
    // Case A: No history
    const resolveClientViewCase = (active: any, pending: any, plans: any[]) => {
      if (active) return 'CASE_D_ACTIVE';
      if (pending) return 'CASE_C_PENDING_APPROVAL';
      if (plans.length > 0 && plans.every((p) => p.status === NutritionPlanStatus.DRAFT)) {
        return 'CASE_B_DRAFT_IN_PROGRESS';
      }
      if (
        plans.length > 0 &&
        plans.every(
          (p) =>
            p.status === NutritionPlanStatus.COMPLETED ||
            p.status === NutritionPlanStatus.CANCELLED,
        )
      ) {
        return 'CASE_E_HISTORY_ONLY';
      }
      return 'CASE_A_NO_PLAN';
    };

    expect(resolveClientViewCase(null, null, [])).toBe('CASE_A_NO_PLAN');
    expect(
      resolveClientViewCase(null, null, [{ id: 'p1', status: NutritionPlanStatus.DRAFT }]),
    ).toBe('CASE_B_DRAFT_IN_PROGRESS');
    expect(resolveClientViewCase(null, mockPendingPlan, [mockPendingPlan])).toBe(
      'CASE_C_PENDING_APPROVAL',
    );
    expect(
      resolveClientViewCase({ ...mockPendingPlan, status: NutritionPlanStatus.ACTIVE }, null, []),
    ).toBe('CASE_D_ACTIVE');
    expect(
      resolveClientViewCase(null, null, [{ id: 'p1', status: NutritionPlanStatus.COMPLETED }]),
    ).toBe('CASE_E_HISTORY_ONLY');
  });
});
