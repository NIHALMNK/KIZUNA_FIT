import { ValueObject } from '../../../../shared/value-objects/ValueObject';
import { Result } from '../../../../shared/result/Result';
import { MealType, Weekday } from '../enums';
import { FoodEntryPrimitives } from './food-entry.value-object';
import { MacroNutrientsPrimitives } from './macro-nutrients.value-object';
import { HydrationGoalPrimitives } from './hydration.value-object';
import { NutritionDay, ORDER_TO_WEEKDAY, WEEKDAY_ORDER } from '../entities/nutrition-day.entity';

export interface PrescribedMealSnapshot {
  mealId: string;
  mealType: MealType;
  name: string;
  timeOfDay?: string | null;
  targetCalories?: number | null;
  targetMacros?: MacroNutrientsPrimitives | null;
  foodEntries: FoodEntryPrimitives[];
  notes?: string | null;
}

export interface NutritionDaySnapshotProps {
  weekday?: Weekday;
  dayNumber: number;
  name?: string | null;
  targetCalories?: number | null;
  dailyMacroTargets?: MacroNutrientsPrimitives | null;
  hydrationGoal?: HydrationGoalPrimitives | null;
  meals: PrescribedMealSnapshot[];
  notes?: string | null;
}

export interface NutritionDaySnapshotPrimitives {
  weekday: Weekday;
  dayNumber: number;
  name?: string | null;
  targetCalories?: number | null;
  dailyMacroTargets?: MacroNutrientsPrimitives | null;
  hydrationGoal?: HydrationGoalPrimitives | null;
  meals: PrescribedMealSnapshot[];
  notes?: string | null;
}

export class NutritionDaySnapshot extends ValueObject<NutritionDaySnapshotProps> {
  private constructor(props: NutritionDaySnapshotProps) {
    super(props);
  }

  get weekday(): Weekday {
    return (
      this.props.weekday ||
      (this.props.dayNumber && ORDER_TO_WEEKDAY[this.props.dayNumber]) ||
      Weekday.MONDAY
    );
  }

  get dayNumber(): number {
    return this.props.dayNumber || WEEKDAY_ORDER[this.weekday] || 1;
  }

  get name(): string | null | undefined {
    return this.props.name;
  }

  get targetCalories(): number | null | undefined {
    return this.props.targetCalories;
  }

  get dailyMacroTargets(): MacroNutrientsPrimitives | null | undefined {
    return this.props.dailyMacroTargets;
  }

  get hydrationGoal(): HydrationGoalPrimitives | null | undefined {
    return this.props.hydrationGoal;
  }

  get meals(): PrescribedMealSnapshot[] {
    return [...this.props.meals];
  }

  get notes(): string | null | undefined {
    return this.props.notes;
  }

  public toPrimitives(): NutritionDaySnapshotPrimitives {
    return {
      weekday: this.weekday,
      dayNumber: this.dayNumber,
      name: this.props.name ?? null,
      targetCalories: this.props.targetCalories ?? null,
      dailyMacroTargets: this.props.dailyMacroTargets ?? null,
      hydrationGoal: this.props.hydrationGoal ?? null,
      meals: [...this.props.meals],
      notes: this.props.notes ?? null,
    };
  }

  public static fromNutritionDay(day: NutritionDay): NutritionDaySnapshot {
    const primitives = day.toPrimitives();
    return new NutritionDaySnapshot({
      weekday: primitives.weekday,
      dayNumber: primitives.dayNumber,
      name: primitives.name ?? null,
      targetCalories: primitives.targetCalories ?? null,
      dailyMacroTargets: primitives.dailyMacroTargets ?? null,
      hydrationGoal: primitives.hydrationGoal ?? null,
      meals: primitives.meals.map((m) => ({
        mealId: m.id,
        mealType: m.mealType,
        name: m.name,
        timeOfDay: m.timeOfDay ?? null,
        targetCalories: m.targetCalories ?? null,
        targetMacros: m.targetMacros ?? null,
        foodEntries: m.foodEntries,
        notes: m.notes ?? null,
      })),
      notes: primitives.notes ?? null,
    });
  }

  public static create(props: NutritionDaySnapshotProps): Result<NutritionDaySnapshot> {
    const resolvedWeekday =
      props.weekday || (props.dayNumber && ORDER_TO_WEEKDAY[props.dayNumber]) || Weekday.MONDAY;
    const resolvedDayNumber =
      props.dayNumber && props.dayNumber >= 1 ? props.dayNumber : WEEKDAY_ORDER[resolvedWeekday];

    if (!props.meals || props.meals.length === 0) {
      return Result.fail<NutritionDaySnapshot>(
        'Snapshot must contain at least one prescribed meal.',
      );
    }

    return Result.ok<NutritionDaySnapshot>(
      new NutritionDaySnapshot({
        weekday: resolvedWeekday,
        dayNumber: resolvedDayNumber,
        name: props.name ?? null,
        targetCalories: props.targetCalories ?? null,
        dailyMacroTargets: props.dailyMacroTargets ?? null,
        hydrationGoal: props.hydrationGoal ?? null,
        meals: [...props.meals],
        notes: props.notes ?? null,
      }),
    );
  }
}
