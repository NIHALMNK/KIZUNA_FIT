import { ValueObject } from '../../../../shared/value-objects/ValueObject';
import { Result } from '../../../../shared/result/Result';
import { MealCompletionStatus, MealType } from '../enums';
import { MacroNutrients, MacroNutrientsPrimitives } from './macro-nutrients.value-object';
import { ConsumedFoodItem, ConsumedFoodItemPrimitives } from './consumed-food-item.value-object';

export interface MealCompletionRecordProps {
  mealId: string;
  mealType: MealType;
  name: string;
  isCompleted: boolean;
  state: MealCompletionStatus;
  consumedItems: ConsumedFoodItem[];
  consumedMacros?: MacroNutrients | null;
  consumedCalories?: number | null;
  timeConsumed?: Date | null;
  notes?: string | null;
}

export interface MealCompletionRecordPrimitives {
  mealId: string;
  mealType: MealType;
  name: string;
  isCompleted: boolean;
  state: MealCompletionStatus;
  consumedItems: ConsumedFoodItemPrimitives[];
  consumedMacros?: MacroNutrientsPrimitives | null;
  consumedCalories?: number | null;
  timeConsumed?: Date | null;
  notes?: string | null;
}

export class MealCompletionRecord extends ValueObject<MealCompletionRecordProps> {
  private constructor(props: MealCompletionRecordProps) {
    super(props);
  }

  get mealId(): string {
    return this.props.mealId;
  }

  get mealType(): MealType {
    return this.props.mealType;
  }

  get name(): string {
    return this.props.name;
  }

  get isCompleted(): boolean {
    return this.props.isCompleted;
  }

  get state(): MealCompletionStatus {
    return this.props.state;
  }

  get consumedItems(): ConsumedFoodItem[] {
    return [...this.props.consumedItems];
  }

  get consumedMacros(): MacroNutrients | null | undefined {
    return this.props.consumedMacros;
  }

  get consumedCalories(): number | null | undefined {
    return this.props.consumedCalories;
  }

  get timeConsumed(): Date | null | undefined {
    return this.props.timeConsumed;
  }

  get notes(): string | null | undefined {
    return this.props.notes;
  }

  public toPrimitives(): MealCompletionRecordPrimitives {
    return {
      mealId: this.props.mealId,
      mealType: this.props.mealType,
      name: this.props.name,
      isCompleted: this.props.isCompleted,
      state: this.props.state,
      consumedItems: this.props.consumedItems.map((ci) => ci.toPrimitives()),
      consumedMacros: this.props.consumedMacros ? this.props.consumedMacros.toPrimitives() : null,
      consumedCalories: this.props.consumedCalories ?? null,
      timeConsumed: this.props.timeConsumed ?? null,
      notes: this.props.notes ?? null,
    };
  }

  public static create(props: MealCompletionRecordProps): Result<MealCompletionRecord> {
    if (!props.mealId || props.mealId.trim().length === 0) {
      return Result.fail<MealCompletionRecord>('Meal ID is required.');
    }
    if (!props.mealType || !Object.values(MealType).includes(props.mealType)) {
      return Result.fail<MealCompletionRecord>(`Invalid meal type '${props.mealType}'.`);
    }
    if (!props.name || props.name.trim().length === 0) {
      return Result.fail<MealCompletionRecord>('Meal name is required.');
    }
    if (
      props.consumedCalories !== undefined &&
      props.consumedCalories !== null &&
      props.consumedCalories < 0
    ) {
      return Result.fail<MealCompletionRecord>('Consumed calories cannot be negative.');
    }

    const state = props.state || MealCompletionStatus.NOT_TRACKED;

    return Result.ok<MealCompletionRecord>(
      new MealCompletionRecord({
        mealId: props.mealId.trim(),
        mealType: props.mealType,
        name: props.name.trim(),
        isCompleted: state === MealCompletionStatus.COMPLETED,
        state,
        consumedItems: props.consumedItems || [],
        consumedMacros: props.consumedMacros ?? null,
        consumedCalories: props.consumedCalories ?? null,
        timeConsumed: props.timeConsumed ?? null,
        notes: props.notes ? props.notes.trim() : null,
      }),
    );
  }
}
