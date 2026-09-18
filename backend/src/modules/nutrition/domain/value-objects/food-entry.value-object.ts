import { ValueObject } from '../../../../shared/value-objects/ValueObject';
import { Result } from '../../../../shared/result/Result';
import {
  FoodAlternative,
  FoodAlternativePrimitives,
  FoodAlternativeProps,
} from './food-alternative.value-object';

export interface FoodEntryProps {
  id?: string | null;
  name: string;
  quantity: number;
  unit: string;
  calories?: number | null;
  protein?: number | null;
  carbohydrates?: number | null;
  fats?: number | null;
  notes?: string | null;
  alternatives?: FoodAlternative[];
}

export interface FoodEntryPrimitives {
  id?: string | null;
  name: string;
  quantity: number;
  unit: string;
  calories?: number | null;
  protein?: number | null;
  carbohydrates?: number | null;
  fats?: number | null;
  notes?: string | null;
  alternatives?: FoodAlternativePrimitives[];
}

export class FoodEntry extends ValueObject<FoodEntryProps> {
  private constructor(props: FoodEntryProps) {
    super(props);
  }

  get id(): string | null | undefined {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get unit(): string {
    return this.props.unit;
  }

  get calories(): number | null | undefined {
    return this.props.calories;
  }

  get protein(): number | null | undefined {
    return this.props.protein;
  }

  get carbohydrates(): number | null | undefined {
    return this.props.carbohydrates;
  }

  get fats(): number | null | undefined {
    return this.props.fats;
  }

  get notes(): string | null | undefined {
    return this.props.notes;
  }

  get alternatives(): FoodAlternative[] {
    return [...(this.props.alternatives || [])];
  }

  public toPrimitives(): FoodEntryPrimitives {
    return {
      id: this.props.id ?? null,
      name: this.props.name,
      quantity: this.props.quantity,
      unit: this.props.unit,
      calories: this.props.calories ?? null,
      protein: this.props.protein ?? null,
      carbohydrates: this.props.carbohydrates ?? null,
      fats: this.props.fats ?? null,
      notes: this.props.notes ?? null,
      alternatives: (this.props.alternatives || []).map((a) => a.toPrimitives()),
    };
  }

  public static create(
    props: Omit<FoodEntryProps, 'alternatives'> & {
      alternatives?: (
        FoodAlternative | (Omit<FoodAlternativeProps, 'id'> & { id?: string | null })
      )[];
    },
  ): Result<FoodEntry> {
    if (!props.name || props.name.trim().length === 0) {
      return Result.fail<FoodEntry>('Food name is required.');
    }
    if (props.quantity <= 0) {
      return Result.fail<FoodEntry>('Food quantity must be greater than zero.');
    }
    if (!props.unit || props.unit.trim().length === 0) {
      return Result.fail<FoodEntry>('Serving unit is required.');
    }
    if (props.calories !== undefined && props.calories !== null && props.calories < 0) {
      return Result.fail<FoodEntry>('Calories cannot be negative.');
    }
    if (props.protein !== undefined && props.protein !== null && props.protein < 0) {
      return Result.fail<FoodEntry>('Protein cannot be negative.');
    }
    if (
      props.carbohydrates !== undefined &&
      props.carbohydrates !== null &&
      props.carbohydrates < 0
    ) {
      return Result.fail<FoodEntry>('Carbohydrates cannot be negative.');
    }
    if (props.fats !== undefined && props.fats !== null && props.fats < 0) {
      return Result.fail<FoodEntry>('Fats cannot be negative.');
    }

    const domainAlternatives: FoodAlternative[] = [];
    if (props.alternatives && props.alternatives.length > 0) {
      for (const alt of props.alternatives) {
        if (alt instanceof FoodAlternative) {
          domainAlternatives.push(alt);
        } else {
          const res = FoodAlternative.create({
            ...alt,
            id: alt.id || undefined,
          });
          if (res.isFailure) {
            return Result.fail<FoodEntry>(res.error || 'Invalid food alternative.');
          }
          domainAlternatives.push(res.getValue());
        }
      }
    }

    return Result.ok<FoodEntry>(
      new FoodEntry({
        id: props.id ? props.id.trim() : null,
        name: props.name.trim(),
        quantity: props.quantity,
        unit: props.unit.trim(),
        calories: props.calories ?? null,
        protein: props.protein ?? null,
        carbohydrates: props.carbohydrates ?? null,
        fats: props.fats ?? null,
        notes: props.notes ? props.notes.trim() : null,
        alternatives: domainAlternatives,
      }),
    );
  }
}
