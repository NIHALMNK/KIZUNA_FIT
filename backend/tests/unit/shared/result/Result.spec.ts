import { describe, it, expect } from 'vitest';
import { Result } from '../../../../src/shared/result/Result';

describe('Result', () => {
  it('should create a successful result', () => {
    const result = Result.ok('success');
    expect(result.isSuccess).toBe(true);
    expect(result.isFailure).toBe(false);
    expect(result.getValue()).toBe('success');
  });

  it('should create a failing result', () => {
    const result = Result.fail('error message');
    expect(result.isSuccess).toBe(false);
    expect(result.isFailure).toBe(true);
    expect(result.error).toBe('error message');
  });

  it('should throw when getting value of a failing result', () => {
    const result = Result.fail('error message');
    expect(() => result.getValue()).toThrow();
  });
});
