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
    if (res.status !== 200) console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.headers['set-cookie']).toBeDefined();

    // Verify user was created in DB
    const users = mongoose.connection.collection('users');
    const userDoc = await users.findOne({ email: 'newgoogle@example.com' });
    expect(userDoc).toBeDefined();
    expect(userDoc?.status).toBe(UserStatus.Active);
    expect(userDoc?.authProviders).toContain(AuthProvider.GOOGLE);
  });

  it('should automatically link and authenticate when a verified local user exists', async () => {
    const app = await getApp();
    const email = 'existinglocal@example.com';

    // Seed local verified user
    const users = mongoose.connection.collection('users');
    await users.insertOne({
      _id: new mongoose.Types.ObjectId(),
      email,
      fullName: 'Local User',
      emailVerified: true,
      status: UserStatus.Active,
      passwordHash: 'somehash',
      authProviders: [AuthProvider.LOCAL],
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
    if (res.status !== 200) console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();

    // Verify external identity is linked
    const userDoc = await users.findOne({ email });
    expect(userDoc?.authProviders).toContain(AuthProvider.GOOGLE);
  });

  it('should verify and link when an unverified local user exists', async () => {
    const app = await getApp();
    const email = 'unverifiedlocal@example.com';

    // Seed unverified local user
    const users = mongoose.connection.collection('users');
    await users.insertOne({
      _id: new mongoose.Types.ObjectId(),
      email,
      fullName: 'Unverified Local',
      emailVerified: false,
      status: UserStatus.Active,
      passwordHash: 'somehash',
      authProviders: [AuthProvider.LOCAL],
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
    if (res.status !== 200) console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify user is verified and linked
    const userDoc = await users.findOne({ email });
    expect(userDoc?.status).toBe(UserStatus.Active);
    expect(userDoc?.authProviders).toContain(AuthProvider.GOOGLE);
  });

  it('should log in directly when Google user already exists', async () => {
    const app = await getApp();
    const email = 'existinggoogle@example.com';

    const users = mongoose.connection.collection('users');
    await users.insertOne({
      _id: new mongoose.Types.ObjectId(),
      email,
      fullName: 'Google User',
      emailVerified: true,
      status: UserStatus.Active,
      authProviders: [AuthProvider.GOOGLE],
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
    if (res.status !== 200) console.log(res.body);
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
      _id: new mongoose.Types.ObjectId(),
      email,
      fullName: 'Locked User',
      emailVerified: true,
      status: UserStatus.Suspended,
      authProviders: [AuthProvider.GOOGLE],
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

});
