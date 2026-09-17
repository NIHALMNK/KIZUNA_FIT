import { Entity } from '../../../../shared/core/Entity';
import { Result } from '../../../../shared/result/Result';
import { MealType } from '../enums';
import { FoodEntry, FoodEntryPrimitives } from '../value-objects/food-entry.value-object';
import {
  MacroNutrients,
  MacroNutrientsPrimitives,
} from '../value-objects/macro-nutrients.value-object';

export interface MealProps {
  mealType: MealType;
  name: string;
  timeOfDay?: string | null;
  targetCalories?: number | null;
  targetMacros?: MacroNutrients | null;
  foodEntries: FoodEntry[];
  notes?: string | null;
}

export interface MealPrimitives {
  id: string;
  mealType: MealType;
  name: string;
  timeOfDay?: string | null;
  targetCalories?: number | null;
  targetMacros?: MacroNutrientsPrimitives | null;
  foodEntries: FoodEntryPrimitives[];
  notes?: string | null;
}

export class Meal extends Entity<MealProps> {
  private constructor(props: MealProps, id: string) {
    super(props, id);
  }

  get mealType(): MealType {
    return this.props.mealType;
  }

  get name(): string {
    return this.props.name;
  }

  get timeOfDay(): string | null | undefined {
    return this.props.timeOfDay;
  }

  get targetCalories(): number | null | undefined {
    return this.props.targetCalories;
  }

  get targetMacros(): MacroNutrients | null | undefined {
    return this.props.targetMacros;
  }

  get foodEntries(): FoodEntry[] {
    return [...this.props.foodEntries];
  }

  get notes(): string | null | undefined {
    return this.props.notes;
  }

  public toPrimitives(): MealPrimitives {
    return {
      id: this._id,
      mealType: this.props.mealType,
      name: this.props.name,
      timeOfDay: this.props.timeOfDay ?? null,
      targetCalories: this.props.targetCalories ?? null,
      targetMacros: this.props.targetMacros ? this.props.targetMacros.toPrimitives() : null,
      foodEntries: this.props.foodEntries.map((fe) => fe.toPrimitives()),
      notes: this.props.notes ?? null,
    };
  }

  public static create(props: MealProps, id?: string): Result<Meal> {
    if (!props.mealType || !Object.values(MealType).includes(props.mealType)) {
      return Result.fail<Meal>(`Invalid meal type '${props.mealType}'.`);
    }
    if (!props.name || props.name.trim().length === 0) {
      return Result.fail<Meal>('Meal name is required.');
    }
    if (
      props.targetCalories !== undefined &&
      props.targetCalories !== null &&
      props.targetCalories < 0
    ) {
      return Result.fail<Meal>('Target calories cannot be negative.');
    }

    const mealId = id || crypto.randomUUID();
    return Result.ok<Meal>(
      new Meal(
        {
          mealType: props.mealType,
          name: props.name.trim(),
          timeOfDay: props.timeOfDay ? props.timeOfDay.trim() : null,
          targetCalories: props.targetCalories ?? null,
          targetMacros: props.targetMacros ?? null,
          foodEntries: props.foodEntries || [],
          notes: props.notes ? props.notes.trim() : null,
        },
        mealId,
      ),
    );
  }
}
