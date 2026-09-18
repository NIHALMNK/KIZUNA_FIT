import { describe, it, expect } from 'vitest';
import {
  NutritionPlanStatus,
  NutritionCompletionStatus,
  MealType,
  MealCompletionStatus,
} from '../../domain/types/nutrition.types';

describe('Nutrition Domain Types & Enums Contract Conformance', () => {
  it('strictly matches canonical NutritionPlanStatus enum values', () => {
    expect(NutritionPlanStatus.DRAFT).toBe('DRAFT');
    expect(NutritionPlanStatus.PENDING_APPROVAL).toBe('PENDING_APPROVAL');
    expect(NutritionPlanStatus.ACTIVE).toBe('ACTIVE');
    expect(NutritionPlanStatus.DELETION_PENDING).toBe('DELETION_PENDING');
    expect(NutritionPlanStatus.COMPLETED).toBe('COMPLETED');
    expect(NutritionPlanStatus.CANCELLED).toBe('CANCELLED');
    expect(Object.values(NutritionPlanStatus)).toEqual([
      'DRAFT',
      'PENDING_APPROVAL',
      'ACTIVE',
      'DELETION_PENDING',
      'COMPLETED',
      'CANCELLED',
    ]);
  });

  it('strictly matches canonical NutritionCompletionStatus aggregate enum values (only IN_PROGRESS, COMPLETED)', () => {
    expect(NutritionCompletionStatus.IN_PROGRESS).toBe('IN_PROGRESS');
    expect(NutritionCompletionStatus.COMPLETED).toBe('COMPLETED');
    expect(Object.values(NutritionCompletionStatus)).toEqual(['IN_PROGRESS', 'COMPLETED']);
  });

  it('strictly matches canonical MealType enum values', () => {
    expect(MealType.BREAKFAST).toBe('BREAKFAST');
    expect(MealType.LUNCH).toBe('LUNCH');
    expect(MealType.DINNER).toBe('DINNER');
    expect(MealType.SNACK).toBe('SNACK');
    expect(MealType.CUSTOM).toBe('CUSTOM');
  });

  it('strictly matches canonical MealCompletionStatus enum values (NOT_TRACKED, COMPLETED, SKIPPED, PARTIALLY_COMPLETED)', () => {
    expect(MealCompletionStatus.NOT_TRACKED).toBe('NOT_TRACKED');
    expect(MealCompletionStatus.COMPLETED).toBe('COMPLETED');
    expect(MealCompletionStatus.SKIPPED).toBe('SKIPPED');
    expect(MealCompletionStatus.PARTIALLY_COMPLETED).toBe('PARTIALLY_COMPLETED');
    expect(Object.values(MealCompletionStatus)).toEqual([
      'NOT_TRACKED',
      'COMPLETED',
      'SKIPPED',
      'PARTIALLY_COMPLETED',
    ]);
  });
});
