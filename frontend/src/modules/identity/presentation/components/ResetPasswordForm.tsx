'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, ResetPasswordFormValues } from '../validation/authSchemas';
import { useResetPassword } from '../../application/hooks/useResetPassword';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../../shared/components/ui/Card';
import { Input } from '../../../../shared/components/ui/Input';
import { Button } from '../../../../shared/components/ui/Button';
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
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const resetPasswordMutation = useResetPassword();

  if (!token) {
    return (
      <Card variant="default" size="lg" className="w-full max-w-md mx-auto text-center">
        <CardContent className="pt-6 space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold text-white">Invalid Reset Link</CardTitle>
          <CardDescription className="text-sm text-slate-300">
            The password reset link is invalid or missing a security token.
          </CardDescription>
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={() => router.push('/forgot-password')}
            className="mt-4"
          >
            Request New Reset Link
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isSuccess) {
    return (
      <Card variant="default" size="lg" className="w-full max-w-md mx-auto text-center">
        <CardContent className="pt-6 space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-bounce">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold text-white">Password Updated!</CardTitle>
          <CardDescription className="text-sm text-slate-300">
            Your password has been reset successfully. Please sign in with your new password.
          </CardDescription>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => router.push('/login')}
            className="mt-4"
          >
            Go to Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (tokenError) {
    return (
      <Card variant="default" size="lg" className="w-full max-w-md mx-auto text-center">
        <CardContent className="pt-6 space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold text-white">Link Expired or Invalid</CardTitle>
          <CardDescription className="text-sm text-slate-300">{tokenError}</CardDescription>
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={() => router.push('/forgot-password')}
            className="mt-4"
          >
            Request New Reset Link
          </Button>
        </CardContent>
      </Card>
    );
  }

  const onSubmit = (data: ResetPasswordFormValues) => {
    resetPasswordMutation.mutate(
      { token, newPassword: data.newPassword },
      {
        onSuccess: () => {
          setIsSuccess(true);
          toast.success('Password updated successfully!');
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
                message: 'The new password cannot be the same as your current password.',
              });
              return;
            }
          }

          const isValidation = handleValidationErrors(error, setError);
          if (!isValidation) {
            toast.error(getFriendlyMessage(error, 'Failed to reset password.'));
          }
        },
      }
    );
  };

  return (
    <Card variant="default" size="lg" className="w-full max-w-md mx-auto">
      <CardHeader className="text-center pb-3 items-center">
        <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Create New Password<span className="text-cyan-400">.</span>
        </CardTitle>
        <CardDescription className="text-sm text-slate-400 mt-1 font-medium">
          Choose a strong password for your KIZUNAFIT account
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••••••"
            isRequired
            error={errors.newPassword?.message}
            leftIcon={
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            }
            {...register('newPassword')}
          />

          <Input
            label="Confirm New Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••••••"
            isRequired
            error={errors.confirmPassword?.message}
            leftIcon={
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
            {...register('confirmPassword')}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={resetPasswordMutation.isPending}
            className="mt-3"
          >
            Update Password
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center pt-4 border-t border-slate-800/60 text-sm">
        <Link
          href="/login"
          className="font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded"
        >
          ← Back to Sign In
        </Link>
      </CardFooter>
    </Card>
  );
};
