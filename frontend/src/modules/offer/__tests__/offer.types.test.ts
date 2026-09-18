import { describe, it, expect } from 'vitest';
import {
  CoachingOfferStatus,
  CoachingPlanType,
  PLATFORM_COACHING_PLANS,
} from '../domain/types/offer.types';

describe('Coaching Offer Domain Types & Plan Rules Tests', () => {
  it('should verify all 5 canonical offer statuses exist and no prohibited statuses are present', () => {
    expect(CoachingOfferStatus.DRAFT).toBe('DRAFT');
    expect(CoachingOfferStatus.SENT).toBe('SENT');
    expect(CoachingOfferStatus.ACCEPTED).toBe('ACCEPTED');
    expect(CoachingOfferStatus.DECLINED).toBe('DECLINED');
    expect(CoachingOfferStatus.EXPIRED).toBe('EXPIRED');

    const statuses = Object.values(CoachingOfferStatus);
    expect(statuses).toHaveLength(5);
    expect(statuses).not.toContain('PENDING');
    expect(statuses).not.toContain('REJECTED');
    expect(statuses).not.toContain('CANCELLED');
  });

  it('should verify all 3 V1 platform plans and their exact commission rates and 30-day duration', () => {
    // Basic Plan
    const basic = PLATFORM_COACHING_PLANS[CoachingPlanType.BASIC];
    expect(basic.planType).toBe('BASIC');
    expect(basic.durationDays).toBe(30);
    expect(basic.commissionRate).toBe(0.1);
    expect(basic.commissionPercent).toBe(10);
    expect(basic.includedFeatures).toContain('Chat Support');

    // Pro Plan
    const pro = PLATFORM_COACHING_PLANS[CoachingPlanType.PRO];
    expect(pro.planType).toBe('PRO');
    expect(pro.durationDays).toBe(30);
    expect(pro.commissionRate).toBe(0.15);
    expect(pro.commissionPercent).toBe(15);
    expect(pro.includedFeatures).toContain('3 Live Sessions / Week');

    // Premium Plan
    const premium = PLATFORM_COACHING_PLANS[CoachingPlanType.PREMIUM];
    expect(premium.planType).toBe('PREMIUM');
    expect(premium.durationDays).toBe(30);
    expect(premium.commissionRate).toBe(0.2);
    expect(premium.commissionPercent).toBe(20);
    expect(premium.includedFeatures).toContain('Unlimited Live Sessions');
  });
});
