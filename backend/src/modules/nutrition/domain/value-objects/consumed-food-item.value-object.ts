import { ValueObject } from '../../../../shared/value-objects/ValueObject';
import { Result } from '../../../../shared/result/Result';

export enum ConsumedFoodType {
  PRESCRIBED = 'PRESCRIBED',
  ALTERNATIVE = 'ALTERNATIVE',
}

export interface ConsumedFoodItemProps {
  prescribedFoodId?: string | null;
  prescribedFoodName: string;
  consumedType: ConsumedFoodType;
  consumedFoodId?: string | null;
  consumedFoodName: string;
  quantity: number;
  unit: string;
  calories?: number | null;
  protein?: number | null;
  carbohydrates?: number | null;
  fats?: number | null;
}

export interface ConsumedFoodItemPrimitives {
  prescribedFoodId?: string | null;
  prescribedFoodName: string;
  consumedType: ConsumedFoodType;
  consumedFoodId?: string | null;
  consumedFoodName: string;
  quantity: number;
  unit: string;
  calories?: number | null;
  protein?: number | null;
  carbohydrates?: number | null;
  fats?: number | null;
}

export class ConsumedFoodItem extends ValueObject<ConsumedFoodItemProps> {
  private constructor(props: ConsumedFoodItemProps) {
    super(props);
  }

  get prescribedFoodId(): string | null | undefined {
    return this.props.prescribedFoodId;
  }

  get prescribedFoodName(): string {
    return this.props.prescribedFoodName;
  }

  get consumedType(): ConsumedFoodType {
    return this.props.consumedType;
  }

  get consumedFoodId(): string | null | undefined {
    return this.props.consumedFoodId;
  }

  get consumedFoodName(): string {
    return this.props.consumedFoodName;
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

  public toPrimitives(): ConsumedFoodItemPrimitives {
    return {
      prescribedFoodId: this.props.prescribedFoodId ?? null,
      prescribedFoodName: this.props.prescribedFoodName,
      consumedType: this.props.consumedType,
      consumedFoodId: this.props.consumedFoodId ?? null,
      consumedFoodName: this.props.consumedFoodName,
      quantity: this.props.quantity,
      unit: this.props.unit,
      calories: this.props.calories ?? null,
      protein: this.props.protein ?? null,
      carbohydrates: this.props.carbohydrates ?? null,
      fats: this.props.fats ?? null,
    };
  }

  public static create(props: ConsumedFoodItemProps): Result<ConsumedFoodItem> {
    if (!props.prescribedFoodName || props.prescribedFoodName.trim().length === 0) {
      return Result.fail<ConsumedFoodItem>('Prescribed food name is required.');
    }
    if (!props.consumedFoodName || props.consumedFoodName.trim().length === 0) {
      return Result.fail<ConsumedFoodItem>('Consumed food name is required.');
    }
    if (!props.consumedType || !Object.values(ConsumedFoodType).includes(props.consumedType)) {
      return Result.fail<ConsumedFoodItem>(`Invalid consumed type '${props.consumedType}'.`);
    }
    if (props.quantity <= 0) {
      return Result.fail<ConsumedFoodItem>('Quantity must be greater than zero.');
    }
    if (!props.unit || props.unit.trim().length === 0) {
      return Result.fail<ConsumedFoodItem>('Unit is required.');
    }
    if (props.calories !== undefined && props.calories !== null && props.calories < 0) {
      return Result.fail<ConsumedFoodItem>('Calories cannot be negative.');
    }
    if (props.protein !== undefined && props.protein !== null && props.protein < 0) {
      return Result.fail<ConsumedFoodItem>('Protein cannot be negative.');
    }
    if (
      props.carbohydrates !== undefined &&
      props.carbohydrates !== null &&
      props.carbohydrates < 0
    ) {
      return Result.fail<ConsumedFoodItem>('Carbohydrates cannot be negative.');
    }
    if (props.fats !== undefined && props.fats !== null && props.fats < 0) {
      return Result.fail<ConsumedFoodItem>('Fats cannot be negative.');
    }

    return Result.ok<ConsumedFoodItem>(
      new ConsumedFoodItem({
        prescribedFoodId: props.prescribedFoodId ? props.prescribedFoodId.trim() : null,
        prescribedFoodName: props.prescribedFoodName.trim(),
        consumedType: props.consumedType,
        consumedFoodId: props.consumedFoodId ? props.consumedFoodId.trim() : null,
        consumedFoodName: props.consumedFoodName.trim(),
        quantity: props.quantity,
        unit: props.unit.trim(),
        calories: props.calories ?? null,
        protein: props.protein ?? null,
        carbohydrates: props.carbohydrates ?? null,
        fats: props.fats ?? null,
      }),
    );
  }
}
