import { Result } from '../../../../shared/result/Result';
import { HeightUnit } from '../enums/Units';

export interface HeightProps {
  value: number;
  unit: HeightUnit;
}

export class Height {
  private readonly props: HeightProps;

  private constructor(props: HeightProps) {
    this.props = Object.freeze(props);
  }

  get value(): number {
    return this.props.value;
  }

  get unit(): HeightUnit {
    return this.props.unit;
  }

  public static create(value: number, unit: HeightUnit): Result<Height> {
    if (value <= 0) {
      return Result.fail<Height>('Height must be greater than 0');
    }
    if (unit === HeightUnit.CM && value > 300) {
      return Result.fail<Height>('Height in CM exceeds maximum allowed threshold');
    }
    if (unit === HeightUnit.FT && value > 10) {
      return Result.fail<Height>('Height in FT exceeds maximum allowed threshold');
    }
    return Result.ok<Height>(new Height({ value, unit }));
  }

  public toMeters(): number {
    if (this.props.unit === HeightUnit.CM) {
      return Number((this.props.value / 100).toFixed(2));
    }
    // FT to meters
    return Number((this.props.value * 0.3048).toFixed(2));
  }

  public equals(other?: Height): boolean {
    if (!other) return false;
    return this.value === other.value && this.unit === other.unit;
  }
}
