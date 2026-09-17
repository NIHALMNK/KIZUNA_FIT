import { ValueObject } from '../../../../shared/value-objects/ValueObject';
import { Result } from '../../../../shared/result/Result';

export interface DailyMacroSummaryProps {
  totalCalories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
}

export interface DailyMacroSummaryPrimitives {
  totalCalories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
}

export class DailyMacroSummary extends ValueObject<DailyMacroSummaryProps> {
  private constructor(props: DailyMacroSummaryProps) {
    super(props);
  }

  get totalCalories(): number {
    return this.props.totalCalories;
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

  public toPrimitives(): DailyMacroSummaryPrimitives {
    return {
      totalCalories: this.props.totalCalories,
      protein: this.props.protein,
      carbohydrates: this.props.carbohydrates,
      fats: this.props.fats,
    };
  }

  public static create(props: DailyMacroSummaryProps): Result<DailyMacroSummary> {
    if (props.totalCalories < 0) {
      return Result.fail<DailyMacroSummary>('Total calories cannot be negative.');
    }
    if (props.protein < 0) {
      return Result.fail<DailyMacroSummary>('Protein cannot be negative.');
    }
    if (props.carbohydrates < 0) {
      return Result.fail<DailyMacroSummary>('Carbohydrates cannot be negative.');
    }
    if (props.fats < 0) {
      return Result.fail<DailyMacroSummary>('Fats cannot be negative.');
    }

    return Result.ok<DailyMacroSummary>(new DailyMacroSummary(props));
  }
}

export interface NutritionFeedbackProps {
  rating?: number | null;
  energyLevel?: number | null;
  digestionNotes?: string | null;
  notes?: string | null;
  adherenceConfidence?: number | null;
}

export interface NutritionFeedbackPrimitives {
  rating?: number | null;
  energyLevel?: number | null;
  digestionNotes?: string | null;
  notes?: string | null;
  adherenceConfidence?: number | null;
}

export class NutritionFeedback extends ValueObject<NutritionFeedbackProps> {
  private constructor(props: NutritionFeedbackProps) {
    super(props);
  }

  get rating(): number | null | undefined {
    return this.props.rating;
  }

  get energyLevel(): number | null | undefined {
    return this.props.energyLevel;
  }

  get digestionNotes(): string | null | undefined {
    return this.props.digestionNotes;
  }

  get notes(): string | null | undefined {
    return this.props.notes;
  }

  get adherenceConfidence(): number | null | undefined {
    return this.props.adherenceConfidence;
  }

  public toPrimitives(): NutritionFeedbackPrimitives {
    return {
      rating: this.props.rating ?? null,
      energyLevel: this.props.energyLevel ?? null,
      digestionNotes: this.props.digestionNotes ?? null,
      notes: this.props.notes ?? null,
      adherenceConfidence: this.props.adherenceConfidence ?? null,
    };
  }

  public static create(props: NutritionFeedbackProps): Result<NutritionFeedback> {
    if (
      props.rating !== undefined &&
      props.rating !== null &&
      (props.rating < 1 || props.rating > 5)
    ) {
      return Result.fail<NutritionFeedback>('Rating must be between 1 and 5.');
    }
    if (
      props.energyLevel !== undefined &&
      props.energyLevel !== null &&
      (props.energyLevel < 1 || props.energyLevel > 5)
    ) {
      return Result.fail<NutritionFeedback>('Energy level must be between 1 and 5.');
    }
    if (
      props.adherenceConfidence !== undefined &&
      props.adherenceConfidence !== null &&
      (props.adherenceConfidence < 1 || props.adherenceConfidence > 5)
    ) {
      return Result.fail<NutritionFeedback>('Adherence confidence must be between 1 and 5.');
    }

    return Result.ok<NutritionFeedback>(
      new NutritionFeedback({
        rating: props.rating ?? null,
        energyLevel: props.energyLevel ?? null,
        digestionNotes: props.digestionNotes ? props.digestionNotes.trim() : null,
        notes: props.notes ? props.notes.trim() : null,
        adherenceConfidence: props.adherenceConfidence ?? null,
      }),
    );
  }
}
