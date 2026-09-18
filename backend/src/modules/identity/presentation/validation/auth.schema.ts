import { z } from 'zod';

export const CheckEmailSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email('Invalid email address format'),
  }),
});

export const RegisterUserSchema = z.object({
  body: z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().trim().toLowerCase().email('Invalid email address format'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    role: z.enum(['ADMIN', 'CLIENT', 'TRAINER']).optional().default('CLIENT'),
  }),
});

export const LoginSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email('Invalid email address format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const GoogleLoginSchema = z.object({
  body: z.object({
    idToken: z.string().min(1, 'idToken is required'),
  }),
});

export const VerifyEmailSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Verification token is required'),
  }),
});

export const ResendVerificationSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email('Invalid email address format'),
  }),
});

export const ForgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email('Invalid email address format'),
  }),
});

export const ResetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
  }),
});

export const ChangePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
  }),
});

export const DeleteAccountSchema = z.object({
  body: z.object({
    password: z.string().optional(),
  }),
});

export const UpdateUserSchema = z.object({
  body: z.object({
    fullName: z.string().min(1).optional(),
    phoneNumber: z.string().nullable().optional(),
  }),
});
