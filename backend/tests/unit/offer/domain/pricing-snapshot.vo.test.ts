import { describe, it, expect } from 'vitest';
import { PricingSnapshot } from '../../../../src/modules/offer/domain/value-objects/pricing-snapshot.value-object';

describe('PricingSnapshot Value Object & Platform Commission Rules', () => {
  it('should correctly calculate BASIC plan pricing with 10% platform commission', () => {
    // BASIC: 10% commission on 10,000 INR
    const result = PricingSnapshot.calculate(10000, 0.1, 'INR');

    expect(result.isSuccess).toBe(true);
    const vo = result.getValue();
    expect(vo.trainerFee).toBe(10000);
    expect(vo.commissionRate).toBe(0.1);
    expect(vo.platformFee).toBe(1000); // 10000 * 0.10
    expect(vo.totalAmount).toBe(11000); // 10000 + 1000
    expect(vo.currency).toBe('INR');
  });

  it('should correctly calculate PRO plan pricing with 15% platform commission', () => {
    // PRO: 15% commission on 10,000 INR
    const result = PricingSnapshot.calculate(10000, 0.15, 'INR');

    expect(result.isSuccess).toBe(true);
    const vo = result.getValue();
    expect(vo.trainerFee).toBe(10000);
    expect(vo.commissionRate).toBe(0.15);
    expect(vo.platformFee).toBe(1500); // 10000 * 0.15
    expect(vo.totalAmount).toBe(11500); // 10000 + 1500
  });

  it('should correctly calculate PREMIUM plan pricing with 20% platform commission', () => {
    // PREMIUM: 20% commission on 10,000 INR
    const result = PricingSnapshot.calculate(10000, 0.2, 'INR');

    expect(result.isSuccess).toBe(true);
    const vo = result.getValue();
    expect(vo.trainerFee).toBe(10000);
    expect(vo.commissionRate).toBe(0.2);
    expect(vo.platformFee).toBe(2000); // 10000 * 0.20
    expect(vo.totalAmount).toBe(12000); // 10000 + 2000
  });

  it('should fail if trainerFee is zero or negative', () => {
    const zeroResult = PricingSnapshot.calculate(0, 0.1);
    expect(zeroResult.isFailure).toBe(true);
    expect(zeroResult.error).toContain('trainerFee must be a positive number');

    const negResult = PricingSnapshot.calculate(-500, 0.1);
    expect(negResult.isFailure).toBe(true);
  });

  it('should fail if commissionRate is invalid', () => {
    const negRate = PricingSnapshot.calculate(10000, -0.05);
    expect(negRate.isFailure).toBe(true);

    const overRate = PricingSnapshot.calculate(10000, 1.5);
    expect(overRate.isFailure).toBe(true);
  });

  it('should validate totalAmount match if reconstructed via create()', () => {
    const invalidResult = PricingSnapshot.create({
      trainerFee: 10000,
      platformFee: 1000,
      totalAmount: 15000,
      commissionRate: 0.1,
    });

    expect(invalidResult.isFailure).toBe(true);
    expect(invalidResult.error).toContain('must equal trainerFee');

    const validResult = PricingSnapshot.create({
      trainerFee: 10000,
      platformFee: 1000,
      totalAmount: 11000,
      commissionRate: 0.1,
    });

    expect(validResult.isSuccess).toBe(true);
  });
});
