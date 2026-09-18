import { IWorkoutStorageGateway } from '../../ports/workout-storage.gateway.interface';
import { ValidationError } from '../../../../../shared/exceptions/AppError';

export class DeleteExerciseMediaUseCase {
  constructor(private readonly workoutStorageGateway: IWorkoutStorageGateway) {}

  async execute(fileUrl: string): Promise<void> {
    if (!fileUrl || typeof fileUrl !== 'string') {
      throw new ValidationError('File URL is required to delete media.');
    }
    await this.workoutStorageGateway.deleteFile(fileUrl);
  }
}
