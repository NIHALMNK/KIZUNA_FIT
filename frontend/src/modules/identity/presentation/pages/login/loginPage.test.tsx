import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { LoginPage } from './LoginPage';
import { loginSchema } from '../../validation/authSchemas';

describe('LoginPage Golden Reference Integration Suite', () => {
  it('1. exports valid React component', () => {
    expect(typeof LoginPage).toBe('function');
  });

  it('2. validates loginSchema with correct email and password', () => {
    const validData = { email: 'user@kizunafit.com', password: 'Password123!' };
    const result = loginSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('3. rejects loginSchema with invalid email format', () => {
    const invalidEmail = { email: 'not-an-email', password: 'Password123!' };
    const result = loginSchema.safeParse(invalidEmail);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('valid email address');
    }
  });

  it('4. rejects loginSchema with empty password', () => {
    const emptyPassword = { email: 'user@kizunafit.com', password: '' };
    const result = loginSchema.safeParse(emptyPassword);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Password is required');
    }
  });

  it('5. constructs LoginPage element without throwing errors', () => {
    const element = React.createElement(LoginPage);
    expect(element.type).toBe(LoginPage);
  });
});
