import { describe, it, expect } from 'vitest';
import { SingleActivePipelinePolicy } from '../../../../src/modules/marketplace/domain/policies/single-active-pipeline.policy';
import { DuplicateTrainerRequestPolicy } from '../../../../src/modules/marketplace/domain/policies/duplicate-trainer-request.policy';
import { TrainerEligibilityPolicy } from '../../../../src/modules/marketplace/domain/policies/trainer-eligibility.policy';
import { DuplicateTrainerRequestException } from '../../../../src/modules/marketplace/domain/exceptions/duplicate-trainer-request.exception';
import { TrainerNotEligibleException } from '../../../../src/modules/marketplace/domain/exceptions/trainer-not-eligible.exception';
import { AcquisitionPipelineStatus } from '../../../../src/modules/marketplace/domain/enums/acquisition-pipeline-status.enum';

describe('Marketplace Domain Policies', () => {
  describe('SingleActivePipelinePolicy', () => {
    const policy = new SingleActivePipelinePolicy();

    it('should validate successfully when no active pipeline exists for client', () => {
      expect(() => policy.validate('client_1', 'trainer_1', [])).not.toThrow();
    });

    it('should throw DuplicateTrainerRequestException when active pipeline exists for client', () => {
      const existingPipelines = [
        {
          clientId: 'client_1',
          trainerId: 'trainer_2',
          status: AcquisitionPipelineStatus.REQUESTED,
        },
      ];
      expect(() => policy.validate('client_1', 'trainer_1', existingPipelines)).toThrow(
        DuplicateTrainerRequestException,
      );
    });
  });

  describe('DuplicateTrainerRequestPolicy', () => {
    const policy = new DuplicateTrainerRequestPolicy();

    it('should validate successfully when active pipeline between pair is null', () => {
      expect(() => policy.validate('client_1', 'trainer_1', null)).not.toThrow();
    });

    it('should validate successfully when existing pipeline between pair is in terminal status', () => {
      const closedPipeline = {
        clientId: 'client_1',
        trainerId: 'trainer_1',
        status: AcquisitionPipelineStatus.CLOSED,
      };
      expect(() => policy.validate('client_1', 'trainer_1', closedPipeline)).not.toThrow();
    });

    it('should throw DuplicateTrainerRequestException when active pipeline between pair exists', () => {
      const activePipeline = {
        clientId: 'client_1',
        trainerId: 'trainer_1',
        status: AcquisitionPipelineStatus.REQUESTED,
      };
      expect(() => policy.validate('client_1', 'trainer_1', activePipeline)).toThrow(
        DuplicateTrainerRequestException,
      );
    });
  });

  describe('TrainerEligibilityPolicy', () => {
    const policy = new TrainerEligibilityPolicy();

    it('should validate successfully for APPROVED and AVAILABLE trainer candidate', () => {
      const candidate = { verificationStatus: 'APPROVED', availabilityStatus: 'AVAILABLE' };
      expect(() => policy.validate('client_1', 'trainer_1', candidate)).not.toThrow();
    });

    it('should throw TrainerNotEligibleException if candidate is missing or ineligible', () => {
      const unverifiedCandidate = {
        verificationStatus: 'PENDING',
        availabilityStatus: 'AVAILABLE',
      };
      const unavailableCandidate = {
        verificationStatus: 'APPROVED',
        availabilityStatus: 'UNAVAILABLE',
      };

      expect(() => policy.validate('client_1', 'trainer_1', null)).toThrow(
        TrainerNotEligibleException,
      );
      expect(() => policy.validate('client_1', 'trainer_1', unverifiedCandidate)).toThrow(
        TrainerNotEligibleException,
      );
      expect(() => policy.validate('client_1', 'trainer_1', unavailableCandidate)).toThrow(
        TrainerNotEligibleException,
      );
    });
  });
});
