import { Entity } from '../../../../shared/core/Entity';
import { Result } from '../../../../shared/result/Result';
import { Weekday } from '../enums';
import { Meal, MealPrimitives } from './meal.entity';
import { FoodEntry } from '../value-objects/food-entry.value-object';
import {
  MacroNutrients,
  MacroNutrientsPrimitives,
} from '../value-objects/macro-nutrients.value-object';
import { HydrationGoal, HydrationGoalPrimitives } from '../value-objects/hydration.value-object';

export const WEEKDAY_ORDER: Record<Weekday, number> = {
  [Weekday.MONDAY]: 1,
  [Weekday.TUESDAY]: 2,
  [Weekday.WEDNESDAY]: 3,
  [Weekday.THURSDAY]: 4,
  [Weekday.FRIDAY]: 5,
  [Weekday.SATURDAY]: 6,
  [Weekday.SUNDAY]: 7,
};

export const ORDER_TO_WEEKDAY: Record<number, Weekday> = {
  1: Weekday.MONDAY,
  2: Weekday.TUESDAY,
  3: Weekday.WEDNESDAY,
  4: Weekday.THURSDAY,
  5: Weekday.FRIDAY,
  6: Weekday.SATURDAY,
  7: Weekday.SUNDAY,
};

export interface NutritionDayProps {
  weekday: Weekday;
  dayNumber?: number;
  name?: string | null;
  targetCalories?: number | null;
  dailyMacroTargets?: MacroNutrients | null;
  hydrationGoal?: HydrationGoal | null;
  meals: Meal[];
  notes?: string | null;
}

export interface NutritionDayPrimitives {
  id: string;
  weekday: Weekday;
  dayNumber: number;
  name?: string | null;
  targetCalories?: number | null;
  dailyMacroTargets?: MacroNutrientsPrimitives | null;
  hydrationGoal?: HydrationGoalPrimitives | null;
  meals: MealPrimitives[];
  notes?: string | null;
}

export class NutritionDay extends Entity<NutritionDayProps> {
  public static readonly WEEKDAY_ORDER = WEEKDAY_ORDER;
  public static readonly ORDER_TO_WEEKDAY = ORDER_TO_WEEKDAY;

  private constructor(props: NutritionDayProps, id: string) {
    super(props, id);
  }

  get weekday(): Weekday {
    return this.props.weekday;
  }

  get dayNumber(): number {
    return this.props.dayNumber ?? WEEKDAY_ORDER[this.props.weekday] ?? 1;
  }

  get name(): string | null | undefined {
    return this.props.name;
  }

  get targetCalories(): number | null | undefined {
    return this.props.targetCalories;
  }

  get dailyMacroTargets(): MacroNutrients | null | undefined {
    return this.props.dailyMacroTargets;
  }

  get hydrationGoal(): HydrationGoal | null | undefined {
    return this.props.hydrationGoal;
  }

  get meals(): Meal[] {
    return [...this.props.meals];
  }

  get notes(): string | null | undefined {
    return this.props.notes;
  }

  public cloneForWeekday(targetWeekday: Weekday): Result<NutritionDay> {
    const clonedMeals = this.props.meals.map((meal) => {
      const mealProps = meal.toPrimitives();
      const foodEntries = (mealProps.foodEntries || []).map((fe) =>
        FoodEntry.create({
          name: fe.name,
          quantity: fe.quantity,
          unit: fe.unit,
          calories: fe.calories,
          protein: fe.protein,
          carbohydrates: fe.carbohydrates,
          fats: fe.fats,
          notes: fe.notes,
        }).getValue(),
      );

      return Meal.create({
        mealType: meal.mealType,
        name: meal.name,
        timeOfDay: meal.timeOfDay,
        targetCalories: meal.targetCalories,
        targetMacros: meal.targetMacros,
        foodEntries,
        notes: meal.notes,
      }).getValue();
    });

    return NutritionDay.create({
      weekday: targetWeekday,
      dayNumber: WEEKDAY_ORDER[targetWeekday],
      name: this.props.name ? `${this.props.name} (Copy)` : null,
      targetCalories: this.props.targetCalories,
      dailyMacroTargets: this.props.dailyMacroTargets,
      hydrationGoal: this.props.hydrationGoal,
      meals: clonedMeals,
      notes: this.props.notes,
    });
  }

  public toPrimitives(): NutritionDayPrimitives {
    return {
      id: this._id,
      weekday: this.props.weekday,
      dayNumber: this.dayNumber,
      name: this.props.name ?? null,
      targetCalories: this.props.targetCalories ?? null,
      dailyMacroTargets: this.props.dailyMacroTargets
        ? this.props.dailyMacroTargets.toPrimitives()
        : null,
      hydrationGoal: this.props.hydrationGoal ? this.props.hydrationGoal.toPrimitives() : null,
      meals: this.props.meals.map((m) => m.toPrimitives()),
      notes: this.props.notes ?? null,
    };
  }

  public static create(
    props: {
      weekday?: Weekday;
      dayNumber?: number;
      name?: string | null;
      targetCalories?: number | null;
      dailyMacroTargets?: MacroNutrients | null;
      hydrationGoal?: HydrationGoal | null;
      meals: Meal[];
      notes?: string | null;
    },
    id?: string,
  ): Result<NutritionDay> {
    const resolvedWeekday =
      props.weekday || (props.dayNumber && ORDER_TO_WEEKDAY[props.dayNumber]) || Weekday.MONDAY;

    if (!Object.values(Weekday).includes(resolvedWeekday)) {
      return Result.fail<NutritionDay>(`Invalid weekday '${resolvedWeekday}'.`);
    }

    const resolvedDayNumber =
      props.dayNumber && props.dayNumber >= 1 ? props.dayNumber : WEEKDAY_ORDER[resolvedWeekday];

    if (!props.meals || props.meals.length === 0) {
      return Result.fail<NutritionDay>(
        `NutritionDay for ${resolvedWeekday} must contain at least one prescribed meal.`,
      );
    }
    if (
      props.targetCalories !== undefined &&
      props.targetCalories !== null &&
      props.targetCalories < 0
    ) {
      return Result.fail<NutritionDay>('Target calories cannot be negative.');
    }

    const dayId = id || crypto.randomUUID();
    return Result.ok<NutritionDay>(
      new NutritionDay(
        {
          weekday: resolvedWeekday,
          dayNumber: resolvedDayNumber,
          name: props.name ? props.name.trim() : null,
          targetCalories: props.targetCalories ?? null,
          dailyMacroTargets: props.dailyMacroTargets ?? null,
          hydrationGoal: props.hydrationGoal ?? null,
          meals: [...props.meals],
          notes: props.notes ? props.notes.trim() : null,
        },
        dayId,
      ),
    );
  }
}
