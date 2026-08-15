'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormValues } from '../validation/authSchemas';
import { useRegister } from '../../application/hooks/useRegister';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../../shared/components/ui/Card';
import { Input } from '../../../../shared/components/ui/Input';
import { Button } from '../../../../shared/components/ui/Button';
import { Label } from '../../../../shared/components/ui/Label';
import { Checkbox } from '../../../../shared/components/ui/Checkbox';
import { toast } from 'sonner';
import Link from 'next/link';
import { getFriendlyMessage, handleValidationErrors } from '../utils/errorMapper';

export const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      role: 'CLIENT',
      termsChecked: false,
    },
  });

  const selectedRole = watch('role');
  const registerMutation = useRegister();

  const onSubmit = (data: RegisterFormValues) => {
    const payload = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      role: data.role,
    };

    registerMutation.mutate(payload as any, {
      onSuccess: () => {
        toast.success('Registration successful! Please check your email to verify your account.');
      },
      onError: (error: Error) => {
        const isValidation = handleValidationErrors(error, setError);
        if (!isValidation) {
          toast.error(getFriendlyMessage(error, 'Registration failed. Please try again.'));
        }
      },
    });
  };

  return (
    <div className="w-full max-w-[440px] mx-auto bg-white rounded-2xl border border-slate-200/90 shadow-2xl p-7 sm:p-9 text-slate-900 transition-all duration-200">
      {/* Card Header */}
      <div className="text-center mb-6 space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Create Account<span className="text-cyan-600">.</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
          Join KIZUNAFIT to unlock 1-on-1 personal training
        </p>
      </div>

      {/* Main Content Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Role Selection Segmented Pill */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
            Account Type <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => setValue('role', 'CLIENT', { shouldValidate: true })}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                selectedRole === 'CLIENT'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <span>🏋️ Client</span>
            </button>
            <button
              type="button"
              onClick={() => setValue('role', 'TRAINER', { shouldValidate: true })}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                selectedRole === 'TRAINER'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <span>⚡ Trainer</span>
            </button>
          </div>
        </div>

        {/* Full Name Field */}
        <div className="space-y-1.5">
          <label htmlFor="fullname-input" className="block text-xs font-bold uppercase tracking-wider text-slate-800">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              id="fullname-input"
              type="text"
              placeholder="John Doe"
              className={`w-full h-11 pl-10 pr-3.5 bg-slate-50 border rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:bg-white transition-all ${
                errors.fullName
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-300 hover:border-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20'
              }`}
              {...register('fullName')}
            />
          </div>
          {errors.fullName && (
            <p className="text-xs font-medium text-rose-600 mt-1">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email Address Field */}
        <div className="space-y-1.5">
          <label htmlFor="reg-email-input" className="block text-xs font-bold uppercase tracking-wider text-slate-800">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              id="reg-email-input"
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

        {/* Password Field */}
        <div className="space-y-1.5">
          <label htmlFor="reg-password-input" className="block text-xs font-bold uppercase tracking-wider text-slate-800">
            Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              id="reg-password-input"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              className={`w-full h-11 pl-10 pr-10 bg-slate-50 border rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:bg-white transition-all ${
                errors.password
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-300 hover:border-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20'
              }`}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-slate-400 hover:text-slate-600 text-xs font-semibold focus:outline-none"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs font-medium text-rose-600 mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1.5">
          <label htmlFor="confirm-password-input" className="block text-xs font-bold uppercase tracking-wider text-slate-800">
            Confirm Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <input
              id="confirm-password-input"
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

        {/* Terms Checkbox */}
        <div className="pt-1">
          <label className="inline-flex items-start gap-2 cursor-pointer text-xs font-medium text-slate-700 select-none">
            <input
              type="checkbox"
              className="w-4 h-4 mt-0.5 text-cyan-600 border-slate-300 rounded focus:ring-cyan-500"
              {...register('termsChecked')}
            />
            <span>
              I agree to the{' '}
              <Link href="/terms" className="text-cyan-600 font-semibold hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-cyan-600 font-semibold hover:underline">
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.termsChecked && (
            <p className="text-xs text-rose-600 font-medium mt-1">
              {errors.termsChecked.message}
            </p>
          )}
        </div>

        {/* Email-Only Submit Action Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={registerMutation.isPending}
          className="mt-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold h-11 rounded-xl shadow-md shadow-cyan-500/20"
        >
          Create Account
        </Button>
      </form>

      {/* Footer Link */}
      <div className="mt-6 pt-5 border-t border-slate-200 flex justify-center items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600">
        <span>Already have an account?</span>
        <Link
          href="/login"
          className="font-bold text-cyan-600 hover:text-cyan-700 transition-colors focus:outline-none focus:underline"
        >
          Sign in →
        </Link>
      </div>
    </div>
  );
};
