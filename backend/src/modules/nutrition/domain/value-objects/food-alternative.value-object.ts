import { ValueObject } from '../../../../shared/value-objects/ValueObject';
import { Result } from '../../../../shared/result/Result';

export interface FoodAlternativeProps {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories?: number | null;
  protein?: number | null;
  carbohydrates?: number | null;
  fats?: number | null;
  notes?: string | null;
}

export interface FoodAlternativePrimitives {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories?: number | null;
  protein?: number | null;
  carbohydrates?: number | null;
  fats?: number | null;
  notes?: string | null;
}

export class FoodAlternative extends ValueObject<FoodAlternativeProps> {
  private constructor(props: FoodAlternativeProps) {
    super(props);
  }

  get id(): string {
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

  public toPrimitives(): FoodAlternativePrimitives {
    return {
      id: this.props.id,
      name: this.props.name,
      quantity: this.props.quantity,
      unit: this.props.unit,
      calories: this.props.calories ?? null,
      protein: this.props.protein ?? null,
      carbohydrates: this.props.carbohydrates ?? null,
      fats: this.props.fats ?? null,
      notes: this.props.notes ?? null,
    };
  }

  public static create(
    props: Omit<FoodAlternativeProps, 'id'> & { id?: string },
  ): Result<FoodAlternative> {
    const resolvedId =
      props.id && props.id.trim().length > 0 ? props.id.trim() : crypto.randomUUID();
    if (!props.name || props.name.trim().length === 0) {
      return Result.fail<FoodAlternative>('Food alternative name is required.');
    }
    if (props.quantity <= 0) {
      return Result.fail<FoodAlternative>('Food alternative quantity must be greater than zero.');
    }
    if (!props.unit || props.unit.trim().length === 0) {
      return Result.fail<FoodAlternative>('Serving unit is required.');
    }
    if (props.calories !== undefined && props.calories !== null && props.calories < 0) {
      return Result.fail<FoodAlternative>('Calories cannot be negative.');
    }
    if (props.protein !== undefined && props.protein !== null && props.protein < 0) {
      return Result.fail<FoodAlternative>('Protein cannot be negative.');
    }
    if (
      props.carbohydrates !== undefined &&
      props.carbohydrates !== null &&
      props.carbohydrates < 0
    ) {
      return Result.fail<FoodAlternative>('Carbohydrates cannot be negative.');
    }
    if (props.fats !== undefined && props.fats !== null && props.fats < 0) {
      return Result.fail<FoodAlternative>('Fats cannot be negative.');
    }

    return Result.ok<FoodAlternative>(
      new FoodAlternative({
        id: resolvedId,
        name: props.name.trim(),
        quantity: props.quantity,
        unit: props.unit.trim(),
        calories: props.calories ?? null,
        protein: props.protein ?? null,
        carbohydrates: props.carbohydrates ?? null,
        fats: props.fats ?? null,
        notes: props.notes ? props.notes.trim() : null,
      }),
    );
  }
}
