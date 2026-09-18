import { describe, it, expect } from 'vitest';
import { TrainerRequest } from '../../../../src/modules/marketplace/domain/entities/trainer-request.entity';
import { TrainerRequestStatus } from '../../../../src/modules/marketplace/domain/enums/trainer-request-status.enum';

describe('TrainerRequest Child Entity', () => {
  it('should successfully create a valid TrainerRequest', () => {
    const result = TrainerRequest.create({
      clientGoal: 'Prepare for marathon in 6 months',
      clientMessage: 'I would like personalized endurance coaching',
    });

    expect(result.isSuccess).toBe(true);
    const request = result.getValue();
    expect(request.clientGoal).toBe('Prepare for marathon in 6 months');
    expect(request.clientMessage).toBe('I would like personalized endurance coaching');
    expect(request.status).toBe(TrainerRequestStatus.PENDING);
    expect(request.submittedAt).toBeInstanceOf(Date);
    expect(request.respondedAt).toBeNull();
    expect(request.responseReason).toBeNull();
  });

  it('should fail creation if clientGoal is too short', () => {
    const result = TrainerRequest.create({ clientGoal: 'Hi' });
    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('at least 3 characters');
  });

  it('should fail creation if clientGoal exceeds 100 characters', () => {
    const longGoal = 'a'.repeat(101);
    const result = TrainerRequest.create({ clientGoal: longGoal });
    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('cannot exceed 100 characters');
  });

  it('should fail creation if clientMessage exceeds 1000 characters', () => {
    const longMessage = 'm'.repeat(1001);
    const result = TrainerRequest.create({ clientGoal: 'Valid Goal', clientMessage: longMessage });
    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('cannot exceed 1000 characters');
  });

  it('should execute markAccepted correctly', () => {
    const request = TrainerRequest.create({ clientGoal: 'Valid Goal' }).getValue();
    request.markAccepted();

    expect(request.status).toBe(TrainerRequestStatus.ACCEPTED);
    expect(request.respondedAt).toBeInstanceOf(Date);
  });

  it('should execute markRejected correctly with reason', () => {
    const request = TrainerRequest.create({ clientGoal: 'Valid Goal' }).getValue();
    request.markRejected('Schedule is currently full');

    expect(request.status).toBe(TrainerRequestStatus.REJECTED);
    expect(request.respondedAt).toBeInstanceOf(Date);
    expect(request.responseReason).toBe('Schedule is currently full');
  });

  it('should execute markWithdrawn correctly', () => {
    const request = TrainerRequest.create({ clientGoal: 'Valid Goal' }).getValue();
    request.markWithdrawn();

    expect(request.status).toBe(TrainerRequestStatus.WITHDRAWN);
  });
});
