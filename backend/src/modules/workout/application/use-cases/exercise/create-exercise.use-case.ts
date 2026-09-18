import { IExerciseRepository } from '../../../domain/repositories/exercise.repository.interface';
import { CreateExerciseDto, ExerciseResponseDto } from '../../dtos/exercise.dto';
import { Exercise } from '../../../domain/aggregates/exercise.aggregate';
import { ExerciseOrigin, ExerciseStatus } from '../../../domain/enums';
import { WorkoutDtoMapper } from '../../mappers/workout-dto.mapper';
import { ValidationError } from '../../../../../shared/exceptions/AppError';
import { isValidYouTubeUrl } from '../../../domain/utils/youtube.utils';

export class CreateExerciseUseCase {
  constructor(private readonly exerciseRepository: IExerciseRepository) {}

  async execute(
    dto: CreateExerciseDto,
    requestingUserId?: string,
    requestingUserRole?: string,
  ): Promise<ExerciseResponseDto> {
    if (dto.media?.videoUrl && !isValidYouTubeUrl(dto.media.videoUrl)) {
      throw new ValidationError(
        'Invalid YouTube URL. Please provide a valid YouTube video link (e.g., https://www.youtube.com/watch?v=..., https://youtu.be/..., or https://www.youtube.com/shorts/...).',
      );
    }

    const baseSlug = Exercise.generateSlug(dto.name);
    let finalSlug = baseSlug;

    const existingSlug = await this.exerciseRepository.findBySlug(finalSlug);
    if (existingSlug) {
      finalSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 8)}`;
    }

    const isPlatform = requestingUserRole === 'ADMIN' || !requestingUserId;
    const origin = isPlatform ? ExerciseOrigin.PLATFORM : ExerciseOrigin.TRAINER;
    const createdByTrainerId = isPlatform ? null : requestingUserId;

    const exerciseResult = Exercise.create({
      name: dto.name,
      slug: finalSlug,
      category: dto.category,
      primaryMuscleGroup: dto.primaryMuscleGroup,
      secondaryMuscleGroups: dto.secondaryMuscleGroups || [],
      equipment: dto.equipment,
      difficulty: dto.difficulty,
      instructions: dto.instructions || [],
      media: dto.media || { images: [] },
      caloriesPerMinute: dto.caloriesPerMinute ?? 5,
      status: ExerciseStatus.ACTIVE,
      origin,
      createdByTrainerId,
    });

    if (exerciseResult.isFailure) {
      throw new ValidationError(exerciseResult.error || 'Failed to create exercise.');
    }

    const exercise = exerciseResult.getValue();
    await this.exerciseRepository.save(exercise);

    return WorkoutDtoMapper.toExerciseResponseDto(exercise);
  }
}
