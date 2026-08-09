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
      <div className="w-full max-w-[440px] mx-auto bg-white rounded-2xl border border-slate-200/90 shadow-2xl p-7 sm:p-9 text-slate-900 text-center transition-all">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-4">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Invalid Reset Link</h1>
        <p className="text-xs sm:text-sm text-slate-600 font-normal mt-2 leading-relaxed">
          The password reset link is invalid or missing a security token.
        </p>
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={() => router.push('/forgot-password')}
          className="mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold h-11 rounded-xl shadow-md shadow-cyan-500/20"
        >
          Request New Reset Link
        </Button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-[440px] mx-auto bg-white rounded-2xl border border-slate-200/90 shadow-2xl p-7 sm:p-9 text-slate-900 text-center transition-all">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-4">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Password Updated!</h1>
        <p className="text-xs sm:text-sm text-slate-600 font-normal mt-2 leading-relaxed">
          Your password has been reset successfully. Please sign in with your new password.
        </p>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => router.push('/login')}
          className="mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold h-11 rounded-xl shadow-md shadow-cyan-500/20"
        >
          Go to Sign In
        </Button>
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="w-full max-w-[440px] mx-auto bg-white rounded-2xl border border-slate-200/90 shadow-2xl p-7 sm:p-9 text-slate-900 text-center transition-all">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-4">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Link Expired or Invalid</h1>
        <p className="text-xs sm:text-sm text-slate-600 font-normal mt-2 leading-relaxed">{tokenError}</p>
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={() => router.push('/forgot-password')}
          className="mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold h-11 rounded-xl shadow-md shadow-cyan-500/20"
        >
          Request New Reset Link
        </Button>
      </div>
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
    <div className="w-full max-w-[440px] mx-auto bg-white rounded-2xl border border-slate-200/90 shadow-2xl p-7 sm:p-9 text-slate-900 transition-all duration-200">
      <div className="text-center mb-6 space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Create New Password<span className="text-cyan-600">.</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
          Choose a strong password for your KIZUNAFIT account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* New Password Field */}
        <div className="space-y-1.5">
          <label htmlFor="new-password" className="block text-xs font-bold uppercase tracking-wider text-slate-800">
            New Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              id="new-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              className={`w-full h-11 pl-10 pr-10 bg-slate-50 border rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:bg-white transition-all ${
                errors.newPassword
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-300 hover:border-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20'
              }`}
              {...register('newPassword')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-slate-400 hover:text-slate-600 text-xs font-semibold focus:outline-none"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-xs font-medium text-rose-600 mt-1">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm New Password Field */}
        <div className="space-y-1.5">
          <label htmlFor="confirm-new-password" className="block text-xs font-bold uppercase tracking-wider text-slate-800">
            Confirm New Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <input
              id="confirm-new-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              className={`w-full h-11 pl-10 pr-3.5 bg-slate-50 border rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:bg-white transition-all ${
                errors.confirmPassword
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-300 hover:border-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20'
              }`}
              {...register('confirmPassword')}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs font-medium text-rose-600 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={resetPasswordMutation.isPending}
          className="mt-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold h-11 rounded-xl shadow-md shadow-cyan-500/20"
        >
          Update Password
        </Button>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-200 flex justify-center text-xs sm:text-sm font-semibold">
        <Link
          href="/login"
          className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5 focus:outline-none focus:underline"
        >
          ← Back to Sign In
        </Link>
      </div>
    </div>
  );
};
