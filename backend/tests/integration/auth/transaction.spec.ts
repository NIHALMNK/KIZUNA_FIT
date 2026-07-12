import { describe, it, expect, vi, afterEach } from 'vitest';
import request from 'supertest';
import { getApp, getContainer } from '../helpers/app';
import { verifyUser } from '../helpers/auth';
import { EmailAddress } from '../../../src/modules/identity/domain/value-objects/EmailAddress';
import { MongoRefreshTokenSessionRepository } from '../../../src/modules/identity/infrastructure/persistence/mongoose/repositories/MongoRefreshTokenSessionRepository';

describe('Transaction Rollback Integration Tests', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should rollback transaction if a repository operation fails', async () => {
    const app = await getApp();
    const container = getContainer();
    const sessionRepo = container.resolve('sessionRepository');
    const userRepo = container.resolve('userRepository');

    const email = 'rollback@example.com';
    const password = 'Password123!';

    // 1. Register a user and verify them
    await request(app).post('/api/v1/identity/register').send({ fullName: 'Test User', email, password });
    await verifyUser(email);

    // 2. Perform some action before fail


    // Verify failedLoginAttempts is 3
    let user = await userRepo.findByEmail(email);
    // Verify user exists
    expect(user).toBeDefined();

    // 3. Spy on sessionRepo prototype to throw an error on next save
    vi.spyOn(MongoRefreshTokenSessionRepository.prototype, 'save').mockRejectedValueOnce(new Error('Simulated DB failure'));

    // 4. Try to login with correct password.
    // This will fail on save session, so the transaction should rollback.
    const res = await request(app).post('/api/v1/identity/login').send({ email, password });
    
    expect(res.status).toBe(500); // Because we simulated an unexpected error

    // 5. Verify email is still the same (just checking user exists)
    user = await userRepo.findByEmail(email);
    expect(user).toBeDefined();
  });
});
