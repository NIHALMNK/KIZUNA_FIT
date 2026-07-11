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
    await request(app).post('/api/v1/identity/register').send({ email, password });
    await verifyUser(email);

    // 2. Fail login 3 times to increment failedLoginAttempts
    for (let i = 0; i < 3; i++) {
      await request(app).post('/api/v1/identity/login').send({ email, password: 'WrongPassword' });
    }

    // Verify failedLoginAttempts is 3
    const emailVO = EmailAddress.create(email).getValue();
    let user = await userRepo.findByEmail(emailVO);
    expect(user.failedLoginAttempts).toBe(3);

    // 3. Spy on sessionRepo prototype to throw an error on next save
    vi.spyOn(MongoRefreshTokenSessionRepository.prototype, 'save').mockRejectedValueOnce(new Error('Simulated DB failure'));

    // 4. Try to login with correct password.
    // This will reset failedLoginAttempts to 0 in memory, save user, then fail on save session.
    // The transaction should rollback.
    const res = await request(app).post('/api/v1/identity/login').send({ email, password });
    
    expect(res.status).toBe(500); // Because we simulated an unexpected error

    // 5. Verify failedLoginAttempts is STILL 3 in the DB
    user = await userRepo.findByEmail(emailVO);
    expect(user.failedLoginAttempts).toBe(3);
  });
});
