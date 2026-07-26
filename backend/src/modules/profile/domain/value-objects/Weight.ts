import { Result } from '../../../../shared/result/Result';
import { WeightUnit } from '../enums/Units';

export interface WeightProps {
  value: number;
  unit: WeightUnit;
}

export class Weight {
  private readonly props: WeightProps;

  private constructor(props: WeightProps) {
    this.props = Object.freeze(props);
  }

  get value(): number {
    return this.props.value;
  }

  get unit(): WeightUnit {
    return this.props.unit;
  }

  public static create(value: number, unit: WeightUnit): Result<Weight> {
    if (value <= 0) {
      return Result.fail<Weight>('Weight must be greater than 0');
    }
    if (value > 500) {
      return Result.fail<Weight>('Weight value exceeds maximum allowed threshold');
    }
    return Result.ok<Weight>(new Weight({ value, unit }));
  }

  public toKg(): number {
    if (this.props.unit === WeightUnit.KG) return this.props.value;
    return Number((this.props.value * 0.45359237).toFixed(2));
  }

  public equals(other?: Weight): boolean {
    if (!other) return false;
    return this.value === other.value && this.unit === other.unit;
  }
}
