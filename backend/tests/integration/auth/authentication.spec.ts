import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { getApp } from '../helpers/app';
import { getAuthToken } from '../helpers/auth';

describe('Authentication Integration Tests', () => {
  describe('POST /api/v1/identity/register', () => {
    it('should register a new user successfully', async () => {
      const app = await getApp();
      const res = await request(app)
        .post('/api/v1/identity/register')
        .send({
          email: 'testauth@example.com',
          password: 'Password123!'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('should fail to register with an invalid email', async () => {
      const app = await getApp();
      const res = await request(app)
        .post('/api/v1/identity/register')
        .send({
          email: 'invalid-email',
          password: 'Password123!'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/v1/identity/login', () => {
    it('should login an existing active user successfully', async () => {
      const app = await getApp();
      const email = 'login@example.com';
      const password = 'Password123!';
      
      const token = await getAuthToken(email, password);
      expect(token).toBeDefined();
    });

    it('should fail with invalid credentials', async () => {
      const app = await getApp();
      const res = await request(app)
        .post('/api/v1/identity/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
    });
  });

  describe('POST /api/v1/identity/refresh', () => {
    it('should refresh a token successfully using a valid cookie', async () => {
      const app = await getApp();
      const email = 'refresh@example.com';
      const password = 'Password123!';
      
      // Get initial auth to get the cookie
      const loginRes = await request(app)
        .post('/api/v1/identity/login')
        .send({ email, password });
        
      if (loginRes.status === 401) {
        // Register and verify first
        const { getAuthToken } = await import('../helpers/auth');
        await getAuthToken(email, password);
      }
      
      // Re-login to get cookies directly
      const authRes = await request(app)
        .post('/api/v1/identity/login')
        .send({ email, password });
        
      const cookies = authRes.headers['set-cookie'];
      
      const res = await request(app)
        .post('/api/v1/identity/refresh')
        .set('Cookie', cookies || []);
        
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
    });
  });
});
