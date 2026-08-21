import { describe, it, expect } from 'vitest';
import { ScopeSnapshot } from '../../../../src/modules/offer/domain/value-objects/scope-snapshot.value-object';
import { CoachingPlanType } from '../../../../src/modules/offer/domain/enums/coaching-plan-type.enum';

describe('ScopeSnapshot Value Object & Platform Plan Rules', () => {
  it('should correctly snapshot BASIC plan with 30-day duration and canonical features', () => {
    const result = ScopeSnapshot.createForPlan(CoachingPlanType.BASIC, 'Focus on basic diet');

    expect(result.isSuccess).toBe(true);
    const vo = result.getValue();
    expect(vo.planType).toBe('BASIC');
    expect(vo.durationDays).toBe(30); // 30-day cycle
    expect(vo.includedFeatures).toContain('Chat Support');
    expect(vo.includedFeatures).toContain('Custom Workout Plan');
    expect(vo.includedFeatures).toContain('Custom Diet Plan');
    expect(vo.includedFeatures).not.toContain('Live Video Sessions');
    expect(vo.trainerNotes).toBe('Focus on basic diet');
  });

  it('should correctly snapshot PRO plan with 30-day duration and 3 live sessions/week', () => {
    const result = ScopeSnapshot.createForPlan(CoachingPlanType.PRO);

    expect(result.isSuccess).toBe(true);
    const vo = result.getValue();
    expect(vo.planType).toBe('PRO');
    expect(vo.durationDays).toBe(30);
    expect(vo.includedFeatures).toContain('3 Live Sessions / Week');
    expect(vo.includedFeatures).toContain('Progress Analyzer');
    expect(vo.includedFeatures).not.toContain('Priority Support');
  });

  it('should correctly snapshot PREMIUM plan with unlimited live sessions & priority support', () => {
    const result = ScopeSnapshot.createForPlan(CoachingPlanType.PREMIUM);

    expect(result.isSuccess).toBe(true);
    const vo = result.getValue();
    expect(vo.planType).toBe('PREMIUM');
    expect(vo.durationDays).toBe(30);
    expect(vo.includedFeatures).toContain('Unlimited Live Sessions');
    expect(vo.includedFeatures).toContain('Priority Support');
    expect(vo.includedFeatures).toContain('Progress Analyzer');
  });

  it('should fail if unknown plan type is provided', () => {
    const result = ScopeSnapshot.createForPlan('UNKNOWN_PLAN');
    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('Unknown or unsupported platform plan type');
  });
});
