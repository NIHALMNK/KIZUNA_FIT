import { describe, it, expect } from 'vitest';
import { ConsultationCancellation } from '../../../../src/modules/consultation/domain/value-objects/consultation-cancellation.vo';
import { CancellationActor } from '../../../../src/modules/consultation/domain/enums/cancellation-actor.enum';

describe('ConsultationCancellation Value Object', () => {
  it('should successfully create a valid ConsultationCancellation instance', () => {
    const result = ConsultationCancellation.create({
      cancelledBy: CancellationActor.CLIENT,
      reason: 'Schedule conflict',
    });

    expect(result.isSuccess).toBe(true);
    const cancellation = result.getValue();
    expect(cancellation.cancelledBy).toBe(CancellationActor.CLIENT);
    expect(cancellation.reason).toBe('Schedule conflict');
    expect(cancellation.cancelledAt).toBeInstanceOf(Date);
  });

  it('should fail if cancelledBy actor is invalid', () => {
    const result = ConsultationCancellation.create({
      cancelledBy: 'INVALID_ACTOR' as CancellationActor,
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('valid CancellationActor');
  });
});
