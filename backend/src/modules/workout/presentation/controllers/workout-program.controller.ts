import { Request, Response } from 'express';
import { CreateWorkoutProgramUseCase } from '../../application/use-cases/program/create-workout-program.use-case';
import { GetWorkoutProgramUseCase } from '../../application/use-cases/program/get-workout-program.use-case';
import { ListWorkoutProgramsUseCase } from '../../application/use-cases/program/list-workout-programs.use-case';
import { GetActiveWorkoutProgramUseCase } from '../../application/use-cases/program/get-active-workout-program.use-case';
import { UpdateDraftWorkoutProgramUseCase } from '../../application/use-cases/program/update-draft-workout-program.use-case';
import { ActivateWorkoutProgramUseCase } from '../../application/use-cases/program/activate-workout-program.use-case';
import { DuplicateWorkoutProgramUseCase } from '../../application/use-cases/program/duplicate-workout-program.use-case';
import { GetOrCreateDraftProgramUseCase } from '../../application/use-cases/program/get-or-create-draft-program.use-case';
import {
  ActiveWorkoutProgramImmutableException,
  DeprecatedExerciseUsageException,
  ExerciseNotFoundException,
  UnauthorizedWorkoutActionException,
  WorkoutProgramNotFoundException,
} from '../../domain/exceptions/workout-domain.exceptions';
import { AppError } from '../../../../shared/exceptions/AppError';

export class WorkoutProgramController {
  constructor(
    private readonly createWorkoutProgramUseCase: CreateWorkoutProgramUseCase,
    private readonly getWorkoutProgramUseCase: GetWorkoutProgramUseCase,
    private readonly listWorkoutProgramsUseCase: ListWorkoutProgramsUseCase,
    private readonly getActiveWorkoutProgramUseCase: GetActiveWorkoutProgramUseCase,
    private readonly updateDraftWorkoutProgramUseCase: UpdateDraftWorkoutProgramUseCase,
    private readonly activateWorkoutProgramUseCase: ActivateWorkoutProgramUseCase,
    private readonly duplicateWorkoutProgramUseCase: DuplicateWorkoutProgramUseCase,
    private readonly getOrCreateDraftProgramUseCase: GetOrCreateDraftProgramUseCase,
  ) {}

  private handleError(error: unknown, res: Response): void {
    if (
      error instanceof WorkoutProgramNotFoundException ||
      error instanceof ExerciseNotFoundException
    ) {
      res.status(404).json({ success: false, message: error.message });
      return;
    }
    if (error instanceof UnauthorizedWorkoutActionException) {
      res.status(403).json({ success: false, message: error.message });
      return;
    }
    if (
      error instanceof ActiveWorkoutProgramImmutableException ||
      error instanceof DeprecatedExerciseUsageException
    ) {
      res.status(422).json({ success: false, message: error.message });
      return;
    }
    if (error instanceof AppError) {
      res.status(400).json({ success: false, message: error.message, code: error.code });
      return;
    }
    const message = (error as Error)?.message || 'An unexpected error occurred.';
    res.status(500).json({ success: false, message });
  }

  public createProgram = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;
      const program = await this.createWorkoutProgramUseCase.execute(
        req.body,
        user.id || user.userId,
      );
      res.status(201).json({ success: true, data: program });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getProgram = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;
      const { programId } = req.params;
      const program = await this.getWorkoutProgramUseCase.execute(
        programId,
        user.id || user.userId,
      );
      res.status(200).json({ success: true, data: program });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public listPrograms = async (req: Request, res: Response): Promise<void> => {
    try {
      const { coachingRelationshipId, trainerId, clientId, status, limit, skip } = req.query;

      const result = await this.listWorkoutProgramsUseCase.execute({
        coachingRelationshipId: coachingRelationshipId as string,
        trainerId: trainerId as string,
        clientId: clientId as string,
        status: status as any,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        skip: skip ? parseInt(skip as string, 10) : undefined,
      });

      res.status(200).json({
        success: true,
        data: result.programs,
        meta: { total: result.total },
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getAssignedProgram = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;
      const { coachingRelationshipId } = req.query;

      let program = null;
      if (coachingRelationshipId) {
        program = await this.getActiveWorkoutProgramUseCase.executeByRelationship(
          coachingRelationshipId as string,
        );
      } else {
        program = await this.getActiveWorkoutProgramUseCase.executeByClient(user.id || user.userId);
      }

      res.status(200).json({ success: true, data: program });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public updateDraftProgram = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;
      const { programId } = req.params;
      const program = await this.updateDraftWorkoutProgramUseCase.execute(
        programId,
        req.body,
        user.id || user.userId,
      );
      res.status(200).json({ success: true, data: program });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public activateProgram = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;
      const { programId } = req.params;
      const program = await this.activateWorkoutProgramUseCase.execute(
        programId,
        user.id || user.userId,
      );
      res
        .status(200)
        .json({
          success: true,
          data: program,
          message: 'Workout program published and activated.',
        });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public duplicateProgram = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;
      const { programId } = req.params;
      const { title } = req.body;
      const program = await this.duplicateWorkoutProgramUseCase.execute(
        programId,
        user.id || user.userId,
        title,
      );
      res
        .status(201)
        .json({ success: true, data: program, message: 'New program version created.' });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getOrCreateDraftProgram = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;
      const { coachingRelationshipId } = req.params;
      const program = await this.getOrCreateDraftProgramUseCase.execute(
        coachingRelationshipId,
        user.id || user.userId,
      );
      res.status(200).json({ success: true, data: program });
    } catch (error) {
      this.handleError(error, res);
    }
  };
}
