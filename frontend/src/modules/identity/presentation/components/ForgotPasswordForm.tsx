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
      <Card variant="default" size="lg" className="w-full max-w-md mx-auto text-center">
        <CardContent className="pt-8 space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-inner animate-pulse">
            <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold text-white">Check Your Email</CardTitle>
          <CardDescription className="text-sm text-slate-300">
            We have dispatched a secure recovery link to{' '}
            <span className="font-semibold text-cyan-400">{submittedEmail}</span>. Please click the link to reset your password.
          </CardDescription>

          <div className="pt-4 flex flex-col gap-3">
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={() => setIsSuccess(false)}
            >
              Didn't receive email? Resend
            </Button>
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              ← Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="default" size="lg" className="w-full max-w-md mx-auto">
      <CardHeader className="text-center pb-3 items-center">
        <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Reset Password<span className="text-cyan-400">.</span>
        </CardTitle>
        <CardDescription className="text-sm text-slate-400 mt-1 font-medium">
          Enter your registered email address to receive password reset instructions
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            isRequired
            error={errors.email?.message}
            leftIcon={
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
            {...register('email')}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={forgotPasswordMutation.isPending}
            className="mt-3"
          >
            Send Reset Link
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center pt-4 border-t border-slate-800/60 text-sm">
        <Link
          href="/login"
          className="font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded relative group"
        >
          <span>← Back to Sign In</span>
        </Link>
      </CardFooter>
    </Card>
  );
};
