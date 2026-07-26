import { Result } from '../../../../shared/result/Result';

export interface TrainerLocationProps {
  city: string;
  state: string;
  country: string;
}

export class TrainerLocation {
  private readonly props: TrainerLocationProps;

  private constructor(props: TrainerLocationProps) {
    this.props = Object.freeze(props);
  }

  get city(): string {
    return this.props.city;
  }

  get state(): string {
    return this.props.state;
  }

  get country(): string {
    return this.props.country;
  }

  public static create(city: string, state: string, country: string): Result<TrainerLocation> {
    const trimmedCity = city ? city.trim() : '';
    const trimmedState = state ? state.trim() : '';
    const trimmedCountry = country ? country.trim() : '';

    if (!trimmedCity) return Result.fail<TrainerLocation>('City is required');
    if (!trimmedState) return Result.fail<TrainerLocation>('State is required');
    if (!trimmedCountry) return Result.fail<TrainerLocation>('Country is required');

    return Result.ok<TrainerLocation>(
      new TrainerLocation({
        city: trimmedCity,
        state: trimmedState,
        country: trimmedCountry,
      }),
    );
  }

  public toString(): string {
    return `${this.city}, ${this.state}, ${this.country}`;
  }

  public equals(other?: TrainerLocation): boolean {
    if (!other) return false;
    return this.city === other.city && this.state === other.state && this.country === other.country;
  }
}
