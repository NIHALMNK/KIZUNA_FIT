import { describe, it, expect } from 'vitest';
import { ValidationError, NotFoundError, UnauthorizedError } from '../../../../src/shared/exceptions/AppError';

describe('AppError Hierarchy', () => {
  it('ValidationError should have correct code and message', () => {
    const error = new ValidationError('Invalid input');
    expect(error.message).toBe('Invalid input');
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.isOperational).toBe(true);
  });

  it('NotFoundError should have correct code', () => {
    const error = new NotFoundError('Not found');
    expect(error.code).toBe('NOT_FOUND_ERROR');
  });

  it('UnauthorizedError should have correct code', () => {
    const error = new UnauthorizedError('Unauthorized');
    expect(error.code).toBe('UNAUTHORIZED_ERROR');
  });
});
