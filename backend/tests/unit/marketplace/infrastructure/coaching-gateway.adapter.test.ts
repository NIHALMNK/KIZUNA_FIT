import { describe, it, expect, vi } from 'vitest';
import { CoachingGatewayAdapter } from '../../../../src/modules/marketplace/infrastructure/gateways/coaching-gateway.adapter';
import { ICoachingRelationshipRepository } from '../../../../src/modules/coaching/application/ports/coaching-relationship.repository.interface';
import { CoachingRelationship } from '../../../../src/modules/coaching/domain/aggregates/coaching-relationship.aggregate';
import { CoachingRelationshipStatus } from '../../../../src/modules/coaching/domain/enums/coaching-relationship-status.enum';
import { configureContainer } from '../../../../src/bootstrap/dependency-injection/container';
import { CreateTrainerRequestUseCase } from '../../../../src/modules/marketplace/application/use-cases/create-trainer-request/create-trainer-request.use-case';
import { CreateWorkoutProgramUseCase } from '../../../../src/modules/workout/application/use-cases/program/create-workout-program.use-case';

describe('Marketplace CoachingGatewayAdapter & DI Resolution Tests', () => {
  const mockCoachingRepo: ICoachingRelationshipRepository = {
    findById: vi.fn(),
    findByPaymentId: vi.fn(),
    findByAcquisitionPipelineId: vi.fn(),
    findActiveByClientId: vi.fn(),
    findActiveByTrainerId: vi.fn(),
    findAll: vi.fn(),
    save: vi.fn(),
  };

  const adapter = new CoachingGatewayAdapter(mockCoachingRepo);

  it('1. should return false when client has no active coaching relationship', async () => {
    vi.mocked(mockCoachingRepo.findActiveByClientId).mockResolvedValueOnce(null);

    const hasRel = await adapter.hasActiveRelationship('client_1', 'trainer_1');
    expect(hasRel).toBe(false);
    expect(mockCoachingRepo.findActiveByClientId).toHaveBeenCalledWith('client_1');
  });

  it('2. should return true when client has an active relationship with the target trainer', async () => {
    const activeRel = CoachingRelationship.createDirectActive(
      {
        acquisitionPipelineId: 'pipe_1',
        paymentId: 'pay_1',
        subscriptionId: 'sub_1',
        clientId: 'client_1',
        trainerId: 'trainer_1',
      },
      'rel_1',
    ).getValue();

    vi.mocked(mockCoachingRepo.findActiveByClientId).mockResolvedValueOnce(activeRel);

    const hasRel = await adapter.hasActiveRelationship('client_1', 'trainer_1');
    expect(hasRel).toBe(true);
  });

  it('3. should return false when client has active relationship with a different trainer if target trainer specified', async () => {
    const activeRelWithOther = CoachingRelationship.createDirectActive(
      {
        acquisitionPipelineId: 'pipe_2',
        paymentId: 'pay_2',
        subscriptionId: 'sub_2',
        clientId: 'client_1',
        trainerId: 'trainer_other',
      },
      'rel_2',
    ).getValue();

    vi.mocked(mockCoachingRepo.findActiveByClientId).mockResolvedValueOnce(activeRelWithOther);

    const hasRel = await adapter.hasActiveRelationship('client_1', 'trainer_1');
    expect(hasRel).toBe(false);
  });

  it('4. allows same trainer to have relationships with multiple distinct clients', async () => {
    // Client A with Trainer 1
    const relA = CoachingRelationship.createDirectActive(
      {
        acquisitionPipelineId: 'pipe_a',
        paymentId: 'pay_a',
        subscriptionId: 'sub_a',
        clientId: 'client_a',
        trainerId: 'trainer_1',
      },
      'rel_a',
    ).getValue();

    // Client B with Trainer 1
    const relB = CoachingRelationship.createDirectActive(
      {
        acquisitionPipelineId: 'pipe_b',
        paymentId: 'pay_b',
        subscriptionId: 'sub_b',
        clientId: 'client_b',
        trainerId: 'trainer_1',
      },
      'rel_b',
    ).getValue();

    vi.mocked(mockCoachingRepo.findActiveByClientId).mockImplementation(
      async (clientId: string) => {
        if (clientId === 'client_a') return relA;
        if (clientId === 'client_b') return relB;
        return null;
      },
    );

    // Client A with Trainer 1 -> has active
    expect(await adapter.hasActiveRelationship('client_a', 'trainer_1')).toBe(true);
    // Client B with Trainer 1 -> has active
    expect(await adapter.hasActiveRelationship('client_b', 'trainer_1')).toBe(true);
    // Client C with Trainer 1 -> no active
    expect(await adapter.hasActiveRelationship('client_c', 'trainer_1')).toBe(false);
  });

  it('5. handles empty clientId gracefully without crashing', async () => {
    const hasRel = await adapter.hasActiveRelationship('');
    expect(hasRel).toBe(false);
  });

  it('6. verifies DI container correctly resolves CreateTrainerRequestUseCase and CreateWorkoutProgramUseCase without token collision', () => {
    const container = configureContainer();

    const trainerRequestUseCase = container.resolve<CreateTrainerRequestUseCase>(
      'createTrainerRequestUseCase',
    );
    expect(trainerRequestUseCase).toBeDefined();
    expect((trainerRequestUseCase as any).coachingGateway).toBeDefined();
    expect(typeof (trainerRequestUseCase as any).coachingGateway.hasActiveRelationship).toBe(
      'function',
    );

    const workoutProgramUseCase = container.resolve<CreateWorkoutProgramUseCase>(
      'createWorkoutProgramUseCase',
    );
    expect(workoutProgramUseCase).toBeDefined();
    expect((workoutProgramUseCase as any).workoutCoachingGateway).toBeDefined();
    expect(typeof (workoutProgramUseCase as any).workoutCoachingGateway.getRelationshipAccess).toBe(
      'function',
    );
  });
});
