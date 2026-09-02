import { Request, Response } from 'express';
import { StartWorkoutCompletionUseCase } from '../../application/use-cases/completion/start-workout-completion.use-case';
import { UpdateWorkoutExecutionUseCase } from '../../application/use-cases/completion/update-workout-execution.use-case';
import { CompleteWorkoutUseCase } from '../../application/use-cases/completion/complete-workout.use-case';
import { GetWorkoutCompletionUseCase } from '../../application/use-cases/completion/get-workout-completion.use-case';
import { ListWorkoutCompletionsUseCase } from '../../application/use-cases/completion/list-workout-completions.use-case';
import { GetWorkoutHistoryUseCase } from '../../application/use-cases/completion/get-workout-history.use-case';
import {
  UnauthorizedWorkoutActionException,
  WorkoutCompletionImmutableException,
  WorkoutCompletionNotFoundException,
} from '../../domain/exceptions/workout-domain.exceptions';
import { AppError } from '../../../../shared/exceptions/AppError';

export class WorkoutCompletionController {
  constructor(
    private readonly startWorkoutCompletionUseCase: StartWorkoutCompletionUseCase,
    private readonly updateWorkoutExecutionUseCase: UpdateWorkoutExecutionUseCase,
    private readonly completeWorkoutUseCase: CompleteWorkoutUseCase,
    private readonly getWorkoutCompletionUseCase: GetWorkoutCompletionUseCase,
    private readonly listWorkoutCompletionsUseCase: ListWorkoutCompletionsUseCase,
    private readonly getWorkoutHistoryUseCase: GetWorkoutHistoryUseCase,
  ) {}

  private handleError(error: unknown, res: Response): void {
    if (error instanceof WorkoutCompletionNotFoundException) {
      res.status(404).json({ success: false, message: error.message });
      return;
    }
    if (error instanceof UnauthorizedWorkoutActionException) {
      res.status(403).json({ success: false, message: error.message });
      return;
    }
    if (error instanceof WorkoutCompletionImmutableException) {
      res.status(409).json({ success: false, message: error.message });
      return;
    }
    if (error instanceof AppError) {
      res.status(400).json({ success: false, message: error.message, code: error.code });
      return;
    }
    const message = (error as Error)?.message || 'An unexpected error occurred.';
    res.status(500).json({ success: false, message });
  }

  public startCompletion = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;
      const completion = await this.startWorkoutCompletionUseCase.execute(
        req.body,
        user.id || user.userId,
      );
      res.status(201).json({ success: true, data: completion });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getCompletion = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;
      const { completionId } = req.params;
      const completion = await this.getWorkoutCompletionUseCase.execute(
        completionId,
        user.id || user.userId,
      );
      res.status(200).json({ success: true, data: completion });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public listCompletions = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        coachingRelationshipId,
        workoutProgramId,
        clientId,
        trainerId,
        workoutDay,
        status,
        limit,
        skip,
      } = req.query;

      const result = await this.listWorkoutCompletionsUseCase.execute({
        coachingRelationshipId: coachingRelationshipId as string,
        workoutProgramId: workoutProgramId as string,
        clientId: clientId as string,
        trainerId: trainerId as string,
        workoutDay: workoutDay ? parseInt(workoutDay as string, 10) : undefined,
        status: status as any,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        skip: skip ? parseInt(skip as string, 10) : undefined,
      });

      res.status(200).json({
        success: true,
        data: result.completions,
        meta: { total: result.total },
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;
      const { clientId, limit } = req.query;
      const targetClientId = (clientId as string) || user.id || user.userId;

      const history = await this.getWorkoutHistoryUseCase.execute(
        targetClientId,
        limit ? parseInt(limit as string, 10) : 30,
      );

      res.status(200).json({ success: true, data: history });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public updateExecution = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;
      const { completionId } = req.params;
      const completion = await this.updateWorkoutExecutionUseCase.execute(
        completionId,
        req.body,
        user.id || user.userId,
      );
      res.status(200).json({ success: true, data: completion });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public completeWorkout = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;
      const { completionId } = req.params;
      const completion = await this.completeWorkoutUseCase.execute(
        completionId,
        req.body,
        user.id || user.userId,
      );
      res
        .status(200)
        .json({ success: true, data: completion, message: 'Workout completed successfully!' });
    } catch (error) {
      this.handleError(error, res);
    }
  };
}
