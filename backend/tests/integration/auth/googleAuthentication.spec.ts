import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { asValue } from 'awilix';
import { getApp, getContainer } from '../helpers/app';
import { Result } from '../../../src/shared/result/Result';
import { AuthProvider } from '../../../src/modules/identity/domain/value-objects/AuthProvider';
import { UserStatus } from '../../../src/modules/identity/domain/entities/UserStatus';

describe('Google Authentication Integration Tests', () => {
  let mockVerifyResult: any;

  beforeEach(async () => {
    mockVerifyResult = null;
    await getApp();
    const container = getContainer();
    container.register({
      googleIdentityProvider: asValue({
        verifyIdToken: async (idToken: string) => {
          if (mockVerifyResult) {
            return mockVerifyResult;
          }
          return Result.fail('Mocked verifyIdToken failure');
        }
      })
    });
  });

  it('should register and authenticate a new user when no account exists', async () => {
    const app = await getApp();
    
    mockVerifyResult = Result.ok({
      provider: AuthProvider.GOOGLE,
      providerUserId: 'google-user-123',
      email: 'newgoogle@example.com',
      emailVerified: true,
      displayName: 'Google User',
      avatarUrl: 'http://avatar.url'
    });

    const res = await request(app)
      .post('/api/v1/identity/google')
      .send({ idToken: 'valid-google-token' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.headers['set-cookie']).toBeDefined();

    // Verify user was created in DB
    const users = mongoose.connection.collection('users');
    const userDoc = await users.findOne({ email: 'newgoogle@example.com' });
    expect(userDoc).toBeDefined();
    expect(userDoc?.status).toBe(UserStatus.Active);
    expect(userDoc?.externalIdentities).toHaveLength(1);
    expect(userDoc?.externalIdentities[0].provider).toBe(AuthProvider.GOOGLE);
    expect(userDoc?.externalIdentities[0].providerUserId).toBe('google-user-123');
  });

  it('should automatically link and authenticate when a verified local user exists', async () => {
    const app = await getApp();
    const email = 'existinglocal@example.com';

    // Seed local verified user
    const users = mongoose.connection.collection('users');
    await users.insertOne({
      _id: crypto.randomUUID(),
      email,
      status: UserStatus.Active,
      passwordHash: 'somehash',
      failedLoginAttempts: 0,
      externalIdentities: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    mockVerifyResult = Result.ok({
      provider: AuthProvider.GOOGLE,
      providerUserId: 'google-user-456',
      email,
      emailVerified: true
    });

    const res = await request(app)
      .post('/api/v1/identity/google')
      .send({ idToken: 'valid-google-token' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();

    // Verify external identity is linked
    const userDoc = await users.findOne({ email });
    expect(userDoc?.externalIdentities).toHaveLength(1);
    expect(userDoc?.externalIdentities[0].provider).toBe(AuthProvider.GOOGLE);
    expect(userDoc?.externalIdentities[0].providerUserId).toBe('google-user-456');
  });

  it('should verify and link when an unverified local user exists', async () => {
    const app = await getApp();
    const email = 'unverifiedlocal@example.com';

    // Seed unverified local user
    const users = mongoose.connection.collection('users');
    await users.insertOne({
      _id: crypto.randomUUID(),
      email,
      status: UserStatus.PendingVerification,
      passwordHash: 'somehash',
      failedLoginAttempts: 0,
      externalIdentities: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    mockVerifyResult = Result.ok({
      provider: AuthProvider.GOOGLE,
      providerUserId: 'google-user-789',
      email,
      emailVerified: true
    });

    const res = await request(app)
      .post('/api/v1/identity/google')
      .send({ idToken: 'valid-google-token' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify user is verified and linked
    const userDoc = await users.findOne({ email });
    expect(userDoc?.status).toBe(UserStatus.Active);
    expect(userDoc?.externalIdentities).toHaveLength(1);
    expect(userDoc?.externalIdentities[0].provider).toBe(AuthProvider.GOOGLE);
  });

  it('should log in directly when Google user already exists', async () => {
    const app = await getApp();
    const email = 'existinggoogle@example.com';

    const users = mongoose.connection.collection('users');
    await users.insertOne({
      _id: crypto.randomUUID(),
      email,
      status: UserStatus.Active,
      failedLoginAttempts: 0,
      externalIdentities: [{
        provider: AuthProvider.GOOGLE,
        providerUserId: 'google-user-999'
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    mockVerifyResult = Result.ok({
      provider: AuthProvider.GOOGLE,
      providerUserId: 'google-user-999',
      email,
      emailVerified: true
    });

    const res = await request(app)
      .post('/api/v1/identity/google')
      .send({ idToken: 'valid-google-token' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('should reject when the Google email is not verified', async () => {
    const app = await getApp();

    mockVerifyResult = Result.fail('Google email is not verified');

    const res = await request(app)
      .post('/api/v1/identity/google')
      .send({ idToken: 'invalid-token' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should reject when user account is deleted or locked', async () => {
    const app = await getApp();
    const email = 'lockedgoogle@example.com';

    const users = mongoose.connection.collection('users');
    await users.insertOne({
      _id: crypto.randomUUID(),
      email,
      status: UserStatus.Locked,
      failedLoginAttempts: 5,
      externalIdentities: [{
        provider: AuthProvider.GOOGLE,
        providerUserId: 'google-user-locked'
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    mockVerifyResult = Result.ok({
      provider: AuthProvider.GOOGLE,
      providerUserId: 'google-user-locked',
      email,
      emailVerified: true
    });

    const res = await request(app)
      .post('/api/v1/identity/google')
      .send({ idToken: 'valid-token' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should throw 500 AUTHENTICATION_INTEGRITY_ERROR when findByExternalIdentity and findByEmail resolve to different users', async () => {
    const app = await getApp();
    const users = mongoose.connection.collection('users');

    // User A has Google ID linked
    await users.insertOne({
      _id: 'user-a-id',
      email: 'usera@example.com',
      status: UserStatus.Active,
      failedLoginAttempts: 0,
      externalIdentities: [{
        provider: AuthProvider.GOOGLE,
        providerUserId: 'google-user-conflict'
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // User B has the email address matching Google account
    await users.insertOne({
      _id: 'user-b-id',
      email: 'userb@example.com',
      status: UserStatus.Active,
      failedLoginAttempts: 0,
      externalIdentities: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    mockVerifyResult = Result.ok({
      provider: AuthProvider.GOOGLE,
      providerUserId: 'google-user-conflict',
      email: 'userb@example.com',
      emailVerified: true
    });

    const res = await request(app)
      .post('/api/v1/identity/google')
      .send({ idToken: 'valid-conflict-token' });

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('AUTHENTICATION_INTEGRITY_ERROR');
  });
});
