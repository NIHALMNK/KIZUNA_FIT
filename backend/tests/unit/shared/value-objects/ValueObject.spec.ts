import { describe, it, expect } from 'vitest';
import { ValueObject } from '../../../../src/shared/value-objects/ValueObject';

class TestValueObject extends ValueObject<{ value: string }> {}

describe('ValueObject', () => {
  it('should be equal if properties match structurally', () => {
    const vo1 = new TestValueObject({ value: 'test' });
    const vo2 = new TestValueObject({ value: 'test' });
    expect(vo1.equals(vo2)).toBe(true);
  });

  it('should not be equal if properties differ', () => {
    const vo1 = new TestValueObject({ value: 'test1' });
    const vo2 = new TestValueObject({ value: 'test2' });
    expect(vo1.equals(vo2)).toBe(false);
  });
});
