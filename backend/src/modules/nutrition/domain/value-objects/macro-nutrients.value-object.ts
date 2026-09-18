import { ValueObject } from '../../../../shared/value-objects/ValueObject';
import { Result } from '../../../../shared/result/Result';

export interface MacroNutrientsProps {
  calories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
}

export interface MacroNutrientsPrimitives {
  calories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
}

export class MacroNutrients extends ValueObject<MacroNutrientsProps> {
  private constructor(props: MacroNutrientsProps) {
    super(props);
  }

  get calories(): number {
    return this.props.calories;
  }

  get protein(): number {
    return this.props.protein;
  }

  get carbohydrates(): number {
    return this.props.carbohydrates;
  }

  get fats(): number {
    return this.props.fats;
  }

  public toPrimitives(): MacroNutrientsPrimitives {
    return {
      calories: this.props.calories,
      protein: this.props.protein,
      carbohydrates: this.props.carbohydrates,
      fats: this.props.fats,
    };
  }

  public static create(props: MacroNutrientsProps): Result<MacroNutrients> {
    if (props.calories < 0) {
      return Result.fail<MacroNutrients>('Calories cannot be negative.');
    }
    if (props.protein < 0) {
      return Result.fail<MacroNutrients>('Protein cannot be negative.');
    }
    if (props.carbohydrates < 0) {
      return Result.fail<MacroNutrients>('Carbohydrates cannot be negative.');
    }
    if (props.fats < 0) {
      return Result.fail<MacroNutrients>('Fats cannot be negative.');
    }

    return Result.ok<MacroNutrients>(new MacroNutrients(props));
  }
}
