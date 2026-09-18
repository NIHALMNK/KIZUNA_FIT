import { describe, it, expect } from 'vitest';
import { NutritionPlan } from '../../../../src/modules/nutrition/domain/aggregates/nutrition-plan.aggregate';
import { NutritionDay } from '../../../../src/modules/nutrition/domain/entities/nutrition-day.entity';
import { Meal } from '../../../../src/modules/nutrition/domain/entities/meal.entity';
import { FoodEntry } from '../../../../src/modules/nutrition/domain/value-objects/food-entry.value-object';
import { MacroNutrients } from '../../../../src/modules/nutrition/domain/value-objects/macro-nutrients.value-object';
import { HydrationGoal } from '../../../../src/modules/nutrition/domain/value-objects/hydration.value-object';
import {
  MealType,
  NutritionPlanStatus,
  Weekday,
} from '../../../../src/modules/nutrition/domain/enums';
import {
  ActiveNutritionPlanImmutableException,
  CompletedNutritionPlanImmutableException,
  InvalidNutritionDurationException,
  InvalidNutritionPlanTransitionException,
} from '../../../../src/modules/nutrition/domain/exceptions/nutrition-domain.exceptions';

describe('NutritionPlan Aggregate Domain Tests', () => {
  const ALL_WEEKDAYS = [
    Weekday.MONDAY,
    Weekday.TUESDAY,
    Weekday.WEDNESDAY,
    Weekday.THURSDAY,
    Weekday.FRIDAY,
    Weekday.SATURDAY,
    Weekday.SUNDAY,
  ];

  const createMockMeal = (name = 'Oatmeal & Eggs', mealType = MealType.BREAKFAST): Meal => {
    const food = FoodEntry.create({
      name: 'Rolled Oats',
      quantity: 80,
      unit: 'g',
      calories: 300,
      protein: 10,
      carbohydrates: 54,
      fats: 5,
    }).getValue();

    const macros = MacroNutrients.create({
      calories: 450,
      protein: 25,
      carbohydrates: 55,
      fats: 12,
    }).getValue();

    return Meal.create({
      mealType,
      name,
      timeOfDay: '08:00 AM',
      targetCalories: 450,
      targetMacros: macros,
      foodEntries: [food],
    }).getValue();
  };

  const createMockDay = (
    weekday = Weekday.MONDAY,
    dayNumber = 1,
    meals = [createMockMeal()],
  ): NutritionDay => {
    const hydration = HydrationGoal.create({ targetMl: 3000 }).getValue();
    const macros = MacroNutrients.create({
      calories: 2200,
      protein: 160,
      carbohydrates: 240,
      fats: 65,
    }).getValue();

    return NutritionDay.create({
      weekday,
      dayNumber,
      name: `${weekday} - High Carb`,
      targetCalories: 2200,
      dailyMacroTargets: macros,
      hydrationGoal: hydration,
      meals,
    }).getValue();
  };

  const createMockPlan = (
    status: NutritionPlanStatus = NutritionPlanStatus.DRAFT,
    durationWeeks = 4,
    daysCount = 7,
  ): NutritionPlan => {
    const days = ALL_WEEKDAYS.slice(0, daysCount).map((wd, i) => createMockDay(wd, i + 1));
    return NutritionPlan.create({
      coachingRelationshipId: 'rel_123',
      trainerId: 'trainer_123',
      clientId: 'client_123',
      version: 1,
      title: 'Hypertrophy Cutting Phase 1',
      description: 'Strict macro targeting with timed carbs',
      durationWeeks,
      nutritionDays: days,
      status,
    }).getValue();
  };

  describe('Creation and Invariants', () => {
    it('should create a valid NutritionPlan in DRAFT status by default', () => {
      const plan = createMockPlan();

      expect(plan.id).toBeDefined();
      expect(plan.status).toBe(NutritionPlanStatus.DRAFT);
      expect(plan.version).toBe(1);
      expect(plan.durationWeeks).toBe(4);
      expect(plan.nutritionDays.length).toBe(7);
      expect(plan.activatedAt).toBeUndefined();
      expect(plan.completedAt).toBeUndefined();
      expect(plan.domainEvents.length).toBe(1);
      expect(plan.domainEvents[0].constructor.name).toBe('NutritionPlanCreatedEvent');
    });

    it('should reject plan creation with durationWeeks < 1', () => {
      const result = NutritionPlan.create({
        coachingRelationshipId: 'rel_123',
        trainerId: 'trainer_123',
        clientId: 'client_123',
        version: 1,
        title: 'Plan Title',
        durationWeeks: 0,
        nutritionDays: [createMockDay(Weekday.MONDAY)],
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Duration must be between 1 and 52 weeks');
    });

    it('should reject plan creation with durationWeeks > 52', () => {
      const result = NutritionPlan.create({
        coachingRelationshipId: 'rel_123',
        trainerId: 'trainer_123',
        clientId: 'client_123',
        version: 1,
        title: 'Plan Title',
        durationWeeks: 53,
        nutritionDays: [createMockDay(Weekday.MONDAY)],
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Duration must be between 1 and 52 weeks');
    });

    it('should reject plan creation with empty title', () => {
      const result = NutritionPlan.create({
        coachingRelationshipId: 'rel_123',
        trainerId: 'trainer_123',
        clientId: 'client_123',
        version: 1,
        title: '   ',
        durationWeeks: 4,
        nutritionDays: [createMockDay(Weekday.MONDAY)],
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('title is required');
    });

    it('should reject duplicate weekdays', () => {
      const day1a = createMockDay(Weekday.MONDAY);
      const day1b = createMockDay(Weekday.MONDAY);

      const result = NutritionPlan.create({
        coachingRelationshipId: 'rel_123',
        trainerId: 'trainer_123',
        clientId: 'client_123',
        version: 1,
        title: 'Duplicate Day Plan',
        durationWeeks: 4,
        nutritionDays: [day1a, day1b],
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("Duplicate nutrition day for weekday 'MONDAY' detected.");
    });

    it('should reject plan creation with more than 7 weekday prescriptions', () => {
      const days = [
        createMockDay(Weekday.MONDAY),
        createMockDay(Weekday.TUESDAY),
        createMockDay(Weekday.WEDNESDAY),
        createMockDay(Weekday.THURSDAY),
        createMockDay(Weekday.FRIDAY),
        createMockDay(Weekday.SATURDAY),
        createMockDay(Weekday.SUNDAY),
        createMockDay(Weekday.MONDAY), // 8th day
      ];

      const result = NutritionPlan.create({
        coachingRelationshipId: 'rel_123',
        trainerId: 'trainer_123',
        clientId: 'client_123',
        version: 1,
        title: 'Overcrowded Plan',
        durationWeeks: 1,
        nutritionDays: days,
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('cannot contain more than 7 weekday prescriptions');
    });
  });

  describe('Lifecycle State Transitions', () => {
    it('should reject direct activation from DRAFT to ACTIVE', () => {
      const plan = createMockPlan(NutritionPlanStatus.DRAFT);
      expect(() => plan.activate()).toThrow(InvalidNutritionPlanTransitionException);
    });

    it('should transition from DRAFT to PENDING_APPROVAL via submit() and emit NutritionPlanSubmittedEvent', () => {
      const plan = createMockPlan(NutritionPlanStatus.DRAFT);
      plan.clearEvents();

      const submitResult = plan.submit();
      expect(submitResult.isSuccess).toBe(true);
      expect(plan.status).toBe(NutritionPlanStatus.PENDING_APPROVAL);
      expect(plan.submittedAt).toBeDefined();
      expect(plan.domainEvents.length).toBe(1);
      expect(plan.domainEvents[0].constructor.name).toBe('NutritionPlanSubmittedEvent');
    });

    it('should transition from PENDING_APPROVAL to ACTIVE via accept() and emit NutritionPlanAcceptedEvent and NutritionPlanActivatedEvent', () => {
      const plan = createMockPlan(NutritionPlanStatus.DRAFT);
      plan.submit();
      plan.clearEvents();

      const acceptResult = plan.accept();
      expect(acceptResult.isSuccess).toBe(true);
      expect(plan.status).toBe(NutritionPlanStatus.ACTIVE);
      expect(plan.acceptedAt).toBeDefined();
      expect(plan.activatedAt).toBeDefined();
      expect(plan.domainEvents.length).toBe(2);
      expect(plan.domainEvents[0].constructor.name).toBe('NutritionPlanAcceptedEvent');
      expect(plan.domainEvents[1].constructor.name).toBe('NutritionPlanActivatedEvent');
    });

    it('should transition from PENDING_APPROVAL to DRAFT via reject() and emit NutritionPlanRejectedEvent', () => {
      const plan = createMockPlan(NutritionPlanStatus.DRAFT);
      plan.submit();
      plan.clearEvents();

      const rejectResult = plan.reject('Need more calories');
      expect(rejectResult.isSuccess).toBe(true);
      expect(plan.status).toBe(NutritionPlanStatus.DRAFT);
      expect(plan.rejectionReason).toBe('Need more calories');
      expect(plan.domainEvents.length).toBe(1);
      expect(plan.domainEvents[0].constructor.name).toBe('NutritionPlanRejectedEvent');
    });

    it('should transition from ACTIVE to COMPLETED and emit NutritionPlanCompletedEvent', () => {
      const plan = createMockPlan(NutritionPlanStatus.DRAFT);
      plan.submit();
      plan.accept();
      plan.clearEvents();

      const completeResult = plan.complete();
      expect(completeResult.isSuccess).toBe(true);
      expect(plan.status).toBe(NutritionPlanStatus.COMPLETED);
      expect(plan.completedAt).toBeDefined();
      expect(plan.domainEvents.length).toBe(1);
      expect(plan.domainEvents[0].constructor.name).toBe('NutritionPlanCompletedEvent');
    });

    it('should reject direct transition from DRAFT to COMPLETED', () => {
      const plan = createMockPlan(NutritionPlanStatus.DRAFT);
      expect(() => plan.complete()).toThrow(InvalidNutritionPlanTransitionException);
    });

    it('should reject direct transition from PENDING_APPROVAL to COMPLETED', () => {
      const plan = createMockPlan(NutritionPlanStatus.DRAFT);
      plan.submit();
      expect(() => plan.complete()).toThrow(InvalidNutritionPlanTransitionException);
    });

    it('should reject transition from ACTIVE to DRAFT', () => {
      const plan = createMockPlan(NutritionPlanStatus.DRAFT);
      plan.submit();
      plan.accept();
      expect(() => plan.reject()).toThrow(InvalidNutritionPlanTransitionException);
      expect(() => plan.recall()).toThrow(InvalidNutritionPlanTransitionException);
    });

    it('should reject transition from ACTIVE to PENDING_APPROVAL directly', () => {
      const plan = createMockPlan(NutritionPlanStatus.DRAFT);
      plan.submit();
      plan.accept();
      expect(() => plan.submit()).toThrow(InvalidNutritionPlanTransitionException);
    });

    it('should reject transition from COMPLETED to ACTIVE', () => {
      const plan = createMockPlan(NutritionPlanStatus.DRAFT);
      plan.submit();
      plan.accept();
      plan.complete();
      expect(() => plan.activate()).toThrow(InvalidNutritionPlanTransitionException);
    });

    it('should reject submission of a plan with no prescribed nutrition days', () => {
      const plan = NutritionPlan.create({
        coachingRelationshipId: 'rel_123',
        trainerId: 'trainer_123',
        clientId: 'client_123',
        version: 1,
        title: 'Empty Days Draft',
        durationWeeks: 4,
        nutritionDays: [],
      }).getValue();

      const submitResult = plan.submit();
      expect(submitResult.isFailure).toBe(true);
      expect(submitResult.error).toContain('no prescribed nutrition days');
    });
  });

  describe('Immutability and Modification Invariants', () => {
    it('should allow draft modification on DRAFT plans', () => {
      const plan = createMockPlan(NutritionPlanStatus.DRAFT);
      const newDay = createMockDay(Weekday.MONDAY);

      const updateResult = plan.updateDraft({
        title: 'Updated Draft Title',
        description: 'New Description',
        durationWeeks: 8,
        nutritionDays: [newDay],
      });

      expect(updateResult.isSuccess).toBe(true);
      expect(plan.title).toBe('Updated Draft Title');
      expect(plan.description).toBe('New Description');
      expect(plan.durationWeeks).toBe(8);
      expect(plan.nutritionDays.length).toBe(1);
    });

    it('should reject draft modification on ACTIVE plans (Rule ND-2)', () => {
      const plan = createMockPlan(NutritionPlanStatus.ACTIVE);
      expect(() =>
        plan.updateDraft({
          title: 'Illegal Active Modification',
        }),
      ).toThrow(ActiveNutritionPlanImmutableException);
    });

    it('should reject draft modification on COMPLETED plans', () => {
      const plan = createMockPlan(NutritionPlanStatus.COMPLETED);
      expect(() =>
        plan.updateDraft({
          title: 'Illegal Completed Modification',
        }),
      ).toThrow(CompletedNutritionPlanImmutableException);
    });

    it('should create a new sequential DRAFT version from an existing plan', () => {
      const activePlan = createMockPlan(NutritionPlanStatus.ACTIVE);
      const v2Plan = activePlan.createNewVersion({
        title: 'Hypertrophy Cutting Phase 2',
      });

      expect(v2Plan.version).toBe(2);
      expect(v2Plan.status).toBe(NutritionPlanStatus.DRAFT);
      expect(v2Plan.title).toBe('Hypertrophy Cutting Phase 2');
      expect(v2Plan.coachingRelationshipId).toBe(activePlan.coachingRelationshipId);
      expect(v2Plan.trainerId).toBe(activePlan.trainerId);
      expect(v2Plan.clientId).toBe(activePlan.clientId);
      expect(v2Plan.domainEvents.length).toBe(1);
      expect(v2Plan.domainEvents[0].constructor.name).toBe('NutritionPlanCreatedEvent');
    });
  });
});
