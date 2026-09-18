import { describe, it, expect } from 'vitest';
import { EligibleTrainerSpecification } from '../../../../src/modules/marketplace/domain/specifications/eligible-trainer.specification';
import { PipelineOwnershipSpecification } from '../../../../src/modules/marketplace/domain/specifications/pipeline-ownership.specification';
import { ActivePipelineSpecification } from '../../../../src/modules/marketplace/domain/specifications/active-pipeline.specification';
import { AcquisitionPipelineStatus } from '../../../../src/modules/marketplace/domain/enums/acquisition-pipeline-status.enum';

describe('Marketplace Domain Specifications', () => {
  describe('EligibleTrainerSpecification', () => {
    const spec = new EligibleTrainerSpecification();

    it('should return true for APPROVED and AVAILABLE trainer candidate', () => {
      const candidate = { verificationStatus: 'APPROVED', availabilityStatus: 'AVAILABLE' };
      expect(spec.isSatisfiedBy(candidate)).toBe(true);
    });

    it('should return false if verificationStatus is not APPROVED', () => {
      const candidate = { verificationStatus: 'PENDING', availabilityStatus: 'AVAILABLE' };
      expect(spec.isSatisfiedBy(candidate)).toBe(false);
    });

    it('should return false if availabilityStatus is not AVAILABLE', () => {
      const candidate = { verificationStatus: 'APPROVED', availabilityStatus: 'UNAVAILABLE' };
      expect(spec.isSatisfiedBy(candidate)).toBe(false);
    });
  });

  describe('PipelineOwnershipSpecification', () => {
    const spec = new PipelineOwnershipSpecification();
    const pipeline = { clientId: 'client_123', trainerId: 'trainer_456' };

    it('should return true if user is client or trainer participant', () => {
      expect(spec.isSatisfiedBy(pipeline, 'client_123')).toBe(true);
      expect(spec.isSatisfiedBy(pipeline, 'trainer_456')).toBe(true);
    });

    it('should return false if user is an outsider', () => {
      expect(spec.isSatisfiedBy(pipeline, 'outsider_789')).toBe(false);
    });

    it('should correctly identify client and trainer roles', () => {
      expect(spec.isClient(pipeline, 'client_123')).toBe(true);
      expect(spec.isClient(pipeline, 'trainer_456')).toBe(false);

      expect(spec.isTrainer(pipeline, 'trainer_456')).toBe(true);
      expect(spec.isTrainer(pipeline, 'client_123')).toBe(false);
    });
  });

  describe('ActivePipelineSpecification', () => {
    const spec = new ActivePipelineSpecification();

    it('should return true for active non-terminal statuses', () => {
      expect(spec.isSatisfiedBy({ status: AcquisitionPipelineStatus.REQUESTED })).toBe(true);
      expect(spec.isSatisfiedBy({ status: AcquisitionPipelineStatus.ACCEPTED })).toBe(true);
      expect(spec.isSatisfiedBy({ status: AcquisitionPipelineStatus.CONSULTATION_SCHEDULED })).toBe(
        true,
      );
      expect(spec.isSatisfiedBy({ status: AcquisitionPipelineStatus.OFFER_SENT })).toBe(true);
    });

    it('should return false for terminal statuses', () => {
      expect(spec.isSatisfiedBy({ status: AcquisitionPipelineStatus.REJECTED })).toBe(false);
      expect(spec.isSatisfiedBy({ status: AcquisitionPipelineStatus.WITHDRAWN })).toBe(false);
      expect(spec.isSatisfiedBy({ status: AcquisitionPipelineStatus.OFFER_DECLINED })).toBe(false);
      expect(spec.isSatisfiedBy({ status: AcquisitionPipelineStatus.CONVERTED })).toBe(false);
      expect(spec.isSatisfiedBy({ status: AcquisitionPipelineStatus.CLOSED })).toBe(false);
    });
  });
});
