import { describe, it, expect } from 'vitest';
import { ExceptionalTrainerFeeRefundPolicy } from '../../../../src/modules/payment/domain/policies/exceptional-trainer-fee-refund.policy';

describe('ExceptionalTrainerFeeRefundPolicy Unit Tests', () => {
  it('should derive approved refund amount strictly as trainerFee (platformFee non-refundable)', () => {
    const result = ExceptionalTrainerFeeRefundPolicy.calculateApprovedRefund(8000, 2000, 'INR');

    expect(result.approvedRefundAmount).toBe(8000);
    expect(result.eligibleTrainerPayout).toBe(0);
    expect(result.retainedPlatformCommission).toBe(2000);
    expect(result.currency).toBe('INR');
  });

  it('should calculate full trainer earnings when no refund has occurred', () => {
    const result = ExceptionalTrainerFeeRefundPolicy.calculatePayoutEligibility(
      8000,
      2000,
      false,
      'INR',
    );

    expect(result.approvedRefundAmount).toBe(0);
    expect(result.eligibleTrainerPayout).toBe(8000);
    expect(result.retainedPlatformCommission).toBe(2000);
    expect(result.currency).toBe('INR');
  });

  it('should zero trainer payout when exceptional refund has occurred and retain full platform commission', () => {
    const result = ExceptionalTrainerFeeRefundPolicy.calculatePayoutEligibility(
      8000,
      2000,
      true,
      'INR',
    );

    expect(result.approvedRefundAmount).toBe(8000);
    expect(result.eligibleTrainerPayout).toBe(0);
    expect(result.retainedPlatformCommission).toBe(2000);
    expect(result.currency).toBe('INR');
  });
});
