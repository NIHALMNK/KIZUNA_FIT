import { INutritionCompletionRepository } from '../../../domain/repositories/INutritionCompletionRepository';
import { INutritionPlanRepository } from '../../../domain/repositories/INutritionPlanRepository';
import {
  StartNutritionCompletionDto,
  NutritionCompletionResponseDto,
} from '../../dtos/nutrition-completion.dto';
import { NutritionDay } from '../../../domain/entities/nutrition-day.entity';
import { NutritionCompletion } from '../../../domain/aggregates/nutrition-completion.aggregate';
import { NutritionDaySnapshot } from '../../../domain/value-objects/nutrition-day-snapshot.value-object';
import { MealCompletionRecord } from '../../../domain/value-objects/meal-completion-record.value-object';
import {
  MealCompletionStatus,
  NutritionCompletionStatus,
  NutritionPlanStatus,
} from '../../../domain/enums';
import { NutritionDtoMapper } from '../../mappers/nutrition-dto.mapper';
import {
  DuplicateNutritionCompletionException,
  NutritionPlanNotFoundException,
  UnauthorizedNutritionActionException,
} from '../../../domain/exceptions/nutrition-domain.exceptions';
import { ValidationError } from '../../../../../shared/exceptions/AppError';

export class StartNutritionCompletionUseCase {
  constructor(
    private readonly nutritionCompletionRepository: INutritionCompletionRepository,
    private readonly nutritionPlanRepository: INutritionPlanRepository,
  ) {}

  async execute(
    dto: StartNutritionCompletionDto,
    requestingClientId: string,
  ): Promise<NutritionCompletionResponseDto> {
    let plan = dto.nutritionPlanId
      ? await this.nutritionPlanRepository.findById(dto.nutritionPlanId)
      : await this.nutritionPlanRepository.findActiveByClientId(requestingClientId);

    if (!plan) {
      throw new NutritionPlanNotFoundException(dto.nutritionPlanId || 'active-plan');
    }

    if (plan.clientId !== requestingClientId) {
      throw new UnauthorizedNutritionActionException(
        'start-completion',
        'Client does not own this nutrition plan.',
      );
    }

    if (plan.status !== NutritionPlanStatus.ACTIVE) {
      throw new ValidationError(
        `Cannot start completion on plan '${plan.id}' because it is not ACTIVE (current status: ${plan.status}).`,
      );
    }

    // Determine calendar date and normalize
    let rawDate: Date;
    if (dto.completionDate) {
      rawDate = new Date(dto.completionDate);
      if (isNaN(rawDate.getTime())) {
        throw new ValidationError(`Invalid completion date: '${dto.completionDate}'`);
      }
    } else {
      rawDate = new Date();
    }
    const normalizedDate = NutritionCompletion.normalizeCalendarDate(rawDate);

    // Validate date is within effective plan period: startDate <= completionDate < endDate
    const startDate = NutritionCompletion.normalizeCalendarDate(plan.activatedAt || plan.createdAt);
    const endDate = new Date(startDate.getTime() + plan.durationWeeks * 7 * 24 * 60 * 60 * 1000);

    if (normalizedDate < startDate || normalizedDate >= endDate) {
      throw new ValidationError(
        `Completion date ${normalizedDate.toISOString().split('T')[0]} is outside the active plan period (${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}).`,
      );
    }

    // Determine weekday and find matching prescribed day
    const derivedWeekday = NutritionCompletion.getWeekdayFromDate(normalizedDate);
    const prescribedDay = plan.nutritionDays.find(
      (d) =>
        d.weekday === derivedWeekday ||
        (!d.weekday && d.dayNumber === NutritionDay.WEEKDAY_ORDER[derivedWeekday]),
    );

    if (!prescribedDay) {
      throw new ValidationError(
        `No prescribed nutrition day configured for ${derivedWeekday} in plan '${plan.id}'.`,
      );
    }

    // Check uniqueness for this calendar date
    const existing = await this.nutritionCompletionRepository.findByPlanClientAndDate(
      plan.id,
      plan.clientId,
      normalizedDate,
    );
    if (existing) {
      throw new DuplicateNutritionCompletionException(
        plan.id,
        normalizedDate.toISOString().split('T')[0],
      );
    }

    const snapshot = NutritionDaySnapshot.fromNutritionDay(prescribedDay);

    const mealCompletions: MealCompletionRecord[] = prescribedDay.meals.map((m) =>
      MealCompletionRecord.create({
        mealId: m.id,
        mealType: m.mealType,
        name: m.name,
        isCompleted: false,
        state: MealCompletionStatus.NOT_TRACKED,
        consumedItems: [],
        consumedCalories: null,
        consumedMacros: null,
      }).getValue(),
    );

    const diffMs = normalizedDate.getTime() - startDate.getTime();
    const calendarDaysDiff = Math.round(diffMs / (24 * 60 * 60 * 1000));
    const calculatedWeekNumber = Math.floor(calendarDaysDiff / 7) + 1;
    const resolvedWeekNumber = Math.max(1, Math.min(plan.durationWeeks, calculatedWeekNumber));

    const completionResult = NutritionCompletion.create({
      coachingRelationshipId: plan.coachingRelationshipId,
      nutritionPlanId: plan.id,
      clientId: plan.clientId,
      trainerId: plan.trainerId,
      completionDate: normalizedDate,
      weekday: derivedWeekday,
      dayNumber: prescribedDay.dayNumber,
      weekNumber: resolvedWeekNumber,
      nutritionDaySnapshot: snapshot,
      mealCompletions,
      status: NutritionCompletionStatus.IN_PROGRESS,
    });

    if (completionResult.isFailure) {
      throw new ValidationError(
        completionResult.error || 'Failed to start daily nutrition completion.',
      );
    }

    const completion = completionResult.getValue();
    await this.nutritionCompletionRepository.save(completion);

    return NutritionDtoMapper.toNutritionCompletionResponseDto(completion);
  }
}
