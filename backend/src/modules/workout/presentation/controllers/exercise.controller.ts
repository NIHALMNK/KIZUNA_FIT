import { Request, Response } from 'express';
import { CreateExerciseUseCase } from '../../application/use-cases/exercise/create-exercise.use-case';
import { GetExerciseUseCase } from '../../application/use-cases/exercise/get-exercise.use-case';
import { ListExercisesUseCase } from '../../application/use-cases/exercise/list-exercises.use-case';
import { UpdateExerciseUseCase } from '../../application/use-cases/exercise/update-exercise.use-case';
import { DeprecateExerciseUseCase } from '../../application/use-cases/exercise/deprecate-exercise.use-case';
import { ReportExerciseUseCase } from '../../application/use-cases/exercise/report-exercise.use-case';
import { UploadExerciseMediaUseCase } from '../../application/use-cases/exercise/upload-exercise-media.use-case';
import { DeleteExerciseMediaUseCase } from '../../application/use-cases/exercise/delete-exercise-media.use-case';
import {
  ExerciseNotFoundException,
  DeprecatedExerciseUsageException,
  UnauthorizedWorkoutActionException,
} from '../../domain/exceptions/workout-domain.exceptions';
import { AppError } from '../../../../shared/exceptions/AppError';

export class ExerciseController {
  constructor(
    private readonly createExerciseUseCase: CreateExerciseUseCase,
    private readonly getExerciseUseCase: GetExerciseUseCase,
    private readonly listExercisesUseCase: ListExercisesUseCase,
    private readonly updateExerciseUseCase: UpdateExerciseUseCase,
    private readonly deprecateExerciseUseCase: DeprecateExerciseUseCase,
    private readonly reportExerciseUseCase: ReportExerciseUseCase,
    private readonly uploadExerciseMediaUseCase: UploadExerciseMediaUseCase,
    private readonly deleteExerciseMediaUseCase: DeleteExerciseMediaUseCase,
  ) {}

  private handleError(error: unknown, res: Response): void {
    if (error instanceof ExerciseNotFoundException) {
      res.status(404).json({ success: false, message: error.message });
      return;
    }
    if (error instanceof DeprecatedExerciseUsageException) {
      res.status(422).json({ success: false, message: error.message });
      return;
    }
    if (error instanceof UnauthorizedWorkoutActionException) {
      res.status(403).json({ success: false, message: error.message });
      return;
    }
    if (error instanceof AppError) {
      res.status(400).json({ success: false, message: error.message, code: error.code });
      return;
    }
    const message = (error as Error)?.message || 'An unexpected error occurred.';
    res.status(500).json({ success: false, message });
  }

  public createExercise = async (req: Request, res: Response): Promise<void> => {
    try {
      const requestingUserId = req.auth?.userId || (req as any).user?.id;
      const requestingUserRole = req.auth?.role || (req as any).user?.role;
      const exercise = await this.createExerciseUseCase.execute(
        req.body,
        requestingUserId,
        requestingUserRole,
      );
      res.status(201).json({ success: true, data: exercise });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getExercise = async (req: Request, res: Response): Promise<void> => {
    try {
      const { exerciseId } = req.params;
      const exercise = await this.getExerciseUseCase.execute(exerciseId);
      res.status(200).json({ success: true, data: exercise });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public listExercises = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        category,
        primaryMuscleGroup,
        equipment,
        difficulty,
        status,
        query,
        search,
        mine,
        limit,
        skip,
      } = req.query;

      const rawSearch = (search as string) || (query as string) || '';
      const searchQuery = rawSearch.trim().length > 0 ? rawSearch.trim() : undefined;
      const isMine = mine === 'true';
      const requestingUserId = req.auth?.userId || (req as any).user?.id;

      if (isMine && !requestingUserId) {
        res
          .status(401)
          .json({
            success: false,
            message: 'Authentication required to view your custom exercises.',
          });
        return;
      }

      const createdByTrainerId = isMine ? requestingUserId : undefined;

      const result = await this.listExercisesUseCase.execute({
        category: category as string,
        primaryMuscleGroup: primaryMuscleGroup as any,
        equipment: equipment as any,
        difficulty: difficulty as any,
        status: status as any,
        createdByTrainerId,
        searchQuery,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        skip: skip ? parseInt(skip as string, 10) : undefined,
      });

      res.status(200).json({
        success: true,
        data: result.exercises,
        meta: { total: result.total },
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public updateExercise = async (req: Request, res: Response): Promise<void> => {
    try {
      const { exerciseId } = req.params;
      const requestingUserId = req.auth?.userId || (req as any).user?.id;
      const requestingUserRole = req.auth?.role || (req as any).user?.role;
      const exercise = await this.updateExerciseUseCase.execute(
        exerciseId,
        req.body,
        requestingUserId,
        requestingUserRole,
      );
      res.status(200).json({ success: true, data: exercise });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public deprecateExercise = async (req: Request, res: Response): Promise<void> => {
    try {
      const { exerciseId } = req.params;
      const exercise = await this.deprecateExerciseUseCase.execute(exerciseId);
      res
        .status(200)
        .json({ success: true, data: exercise, message: 'Exercise marked as deprecated.' });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public reportExercise = async (req: Request, res: Response): Promise<void> => {
    try {
      const { exerciseId } = req.params;
      const requestingUserId = req.auth?.userId || (req as any).user?.id || 'anonymous';
      const result = await this.reportExerciseUseCase.execute(
        exerciseId,
        req.body,
        requestingUserId,
      );
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public uploadMedia = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded in request.' });
        return;
      }

      const result = await this.uploadExerciseMediaUseCase.execute({
        fileBuffer: req.file.buffer,
        mimeType: req.file.mimetype,
        sizeBytes: req.file.size,
      });

      res.status(201).json({ success: true, data: result });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public deleteMedia = async (req: Request, res: Response): Promise<void> => {
    try {
      const { fileUrl } = req.body;
      await this.deleteExerciseMediaUseCase.execute(fileUrl);
      res.status(200).json({ success: true, message: 'Media asset deleted successfully.' });
    } catch (error) {
      this.handleError(error, res);
    }
  };
}
