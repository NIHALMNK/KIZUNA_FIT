'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, ResetPasswordFormValues } from '../validation/authSchemas';
import { useResetPassword } from '../../application/hooks/useResetPassword';
import { Button } from '../../../../shared/components/ui/Button';
import { Input } from '../../../../shared/components/ui/Input';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getFriendlyMessage, handleValidationErrors } from '../utils/errorMapper';
import { ApiError } from '../../../../shared/exceptions/ApiError';

export const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);

  const { register, handleSubmit, setError, formState: { errors } } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const resetPasswordMutation = useResetPassword();

  if (!token) {
    return (
      <div className="text-center space-y-4 py-4">
        <h3 className="text-xl font-semibold text-red-600">Invalid Reset Link</h3>
        <p className="text-gray-600 text-sm">The password reset link is invalid or missing a token.</p>
        <div className="pt-4">
          <Button onClick={() => router.push('/forgot-password')} className="w-full">
            Request New Reset Link
          </Button>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl">
          ✓
        </div>
        <h3 className="text-xl font-semibold text-green-600">Password Reset Successful</h3>
        <p className="text-gray-600 text-sm">Your password has been updated successfully. Please sign in using your new password.</p>
        <div className="pt-4">
          <Button onClick={() => router.push('/login')} className="w-full">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="text-center space-y-4 py-4">
        <h3 className="text-xl font-semibold text-red-600">Link Expired or Invalid</h3>
        <p className="text-gray-600 text-sm">{tokenError}</p>
        <div className="pt-4">
          <Button onClick={() => router.push('/forgot-password')} className="w-full">
            Request New Reset Link
          </Button>
        </div>
      </div>
    );
  }

  const onSubmit = (data: ResetPasswordFormValues) => {
    resetPasswordMutation.mutate({ token, newPassword: data.newPassword }, {
      onSuccess: () => {
        setIsSuccess(true);
      },
      onError: (error: Error) => {
        if (error instanceof ApiError) {
          if (
            error.code === 'INVALID_RESET_TOKEN' ||
            error.code === 'RESET_TOKEN_EXPIRED' ||
            error.code === 'RESET_TOKEN_ALREADY_USED'
          ) {
            setTokenError(getFriendlyMessage(error, 'This password reset link is invalid or has expired.'));
            return;
          }

          if (error.code === 'PASSWORD_MATCHES_CURRENT') {
            setError('newPassword', {
              type: 'server',
              message: 'The new password cannot be the same as your current password.'
            });
            return;
          }
        }

        const isValidation = handleValidationErrors(error, setError);
        if (!isValidation) {
          toast.error(getFriendlyMessage(error, 'Failed to reset password.'));
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium mb-1">New Password</label>
        <Input 
          id="newPassword"
          type="password" 
          autoComplete="new-password"
          placeholder="Enter new password" 
          {...register('newPassword')} 
        />
        {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>}
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirm Password</label>
        <Input 
          id="confirmPassword"
          type="password" 
          autoComplete="new-password"
          placeholder="Confirm new password" 
          {...register('confirmPassword')} 
        />
        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
      </div>
      <Button type="submit" className="w-full" isLoading={resetPasswordMutation.isPending}>
        Reset Password
      </Button>
    </form>
  );
};
