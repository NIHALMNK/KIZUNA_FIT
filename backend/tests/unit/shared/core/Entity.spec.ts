import { describe, it, expect } from 'vitest';
import { Entity } from '../../../../src/shared/core/Entity';

class TestEntity extends Entity<{ name: string }> {}

describe('Entity', () => {
  it('should create an entity with id and props', () => {
    const entity = new TestEntity({ name: 'test' }, 'id-1');
    expect(entity.id).toBe('id-1');
    expect(entity.props.name).toBe('test');
  });

  it('should be equal if ids match', () => {
    const entity1 = new TestEntity({ name: 'test' }, 'id-1');
    const entity2 = new TestEntity({ name: 'other' }, 'id-1');
    expect(entity1.equals(entity2)).toBe(true);
  });

  it('should not be equal if ids differ', () => {
    const entity1 = new TestEntity({ name: 'test' }, 'id-1');
    const entity2 = new TestEntity({ name: 'test' }, 'id-2');
    expect(entity1.equals(entity2)).toBe(false);
  });
});
