import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { getApp } from '../helpers/app';
import { getAuthToken, registerUser, verifyUser } from '../helpers/auth';

describe('Authorization Integration Tests', () => {
  describe('Protected Routes', () => {
    it('should reject requests without Authorization header', async () => {
      const app = await getApp();
      const res = await request(app).delete('/api/v1/identity/account');
      
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should reject requests with invalid token', async () => {
      const app = await getApp();
      const res = await request(app)
        .delete('/api/v1/identity/account')
        .set('Authorization', 'Bearer invalid_token_here');
      
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should allow requests with valid token', async () => {
      const app = await getApp();
      const email = 'authz@example.com';
      const password = 'Password123!';
      
      const token = await getAuthToken(email, password);
      
      const res = await request(app)
        .delete('/api/v1/identity/account')
        .set('Authorization', `Bearer ${token}`)
        .send({ password });
        
      expect(res.status).toBe(204);
    });
  });
});
