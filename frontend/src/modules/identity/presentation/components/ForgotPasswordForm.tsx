'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordFormValues } from '../validation/authSchemas';
import { useForgotPassword } from '../../application/hooks/useForgotPassword';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../../shared/components/ui/Card';
import { Input } from '../../../../shared/components/ui/Input';
import { Button } from '../../../../shared/components/ui/Button';
import { toast } from 'sonner';
import Link from 'next/link';
import { getFriendlyMessage, handleValidationErrors } from '../utils/errorMapper';

export const ForgotPasswordForm = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const forgotPasswordMutation = useForgotPassword();

  const onSubmit = (data: ForgotPasswordFormValues) => {
    setSubmittedEmail(data.email);
    forgotPasswordMutation.mutate(data.email, {
      onSuccess: () => {
        setIsSuccess(true);
        toast.success('Password reset link sent to your inbox!');
      },
      onError: (error: Error) => {
        const isValidation = handleValidationErrors(error, setError);
        if (!isValidation) {
          toast.error(getFriendlyMessage(error, 'Failed to send password reset link.'));
        }
      },
    });
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-[440px] mx-auto bg-white rounded-2xl border border-slate-200/90 shadow-2xl p-7 sm:p-9 text-slate-900 text-center transition-all">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center mb-4">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Check Your Email</h1>
        <p className="text-xs sm:text-sm text-slate-600 font-normal mt-2 leading-relaxed">
          We dispatched a secure recovery link to{' '}
          <span className="font-semibold text-slate-900">{submittedEmail}</span>. Please check your inbox.
        </p>

        <div className="pt-6 flex flex-col gap-3">
          <Button
            variant="outline"
            size="md"
            fullWidth
            onClick={() => setIsSuccess(false)}
            className="border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
          >
            Didn't receive email? Resend
          </Button>
          <Link
            href="/login"
            className="text-xs font-bold text-cyan-600 hover:text-cyan-700 transition-colors"
          >
            ← Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[440px] mx-auto bg-white rounded-2xl border border-slate-200/90 shadow-2xl p-7 sm:p-9 text-slate-900 transition-all duration-200">
      <div className="text-center mb-6 space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Reset Password<span className="text-cyan-600">.</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
          Enter your registered email address to receive password reset instructions
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <label htmlFor="forgot-email" className="block text-xs font-bold uppercase tracking-wider text-slate-800">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              id="forgot-email"
              type="email"
              placeholder="name@example.com"
              className={`w-full h-11 pl-10 pr-3.5 bg-slate-50 border rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:bg-white transition-all ${
                errors.email
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-300 hover:border-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20'
              }`}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="text-xs font-medium text-rose-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={forgotPasswordMutation.isPending}
          className="mt-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold h-11 rounded-xl shadow-md shadow-cyan-500/20"
        >
          Send Reset Link
        </Button>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-200 flex justify-center text-xs sm:text-sm font-semibold">
        <Link
          href="/login"
          className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5 focus:outline-none focus:underline"
        >
          <span>← Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
};
