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
    <Card variant="default" size="lg" className="w-full max-w-md mx-auto">
      {/* Card Header */}
      <CardHeader className="text-center pb-3 items-center">
        <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Create Account<span className="text-teal-400">.</span>
        </CardTitle>
        <CardDescription className="text-sm text-slate-400 mt-1 font-medium">
          Join KIZUNAFIT to unlock AI-powered personal training
        </CardDescription>
      </CardHeader>

      {/* Main Content Form */}
      <CardContent className="space-y-4 pt-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Role Selection Glass Tabs */}
          <div className="space-y-1.5">
            <Label isRequired>Account Type</Label>
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setValue('role', 'CLIENT', { shouldValidate: true })}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                  selectedRole === 'CLIENT'
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <span>🏋️ Client</span>
              </button>
              <button
                type="button"
                onClick={() => setValue('role', 'TRAINER', { shouldValidate: true })}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                  selectedRole === 'TRAINER'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <span>⚡ Trainer</span>
              </button>
            </div>
          </div>

          {/* Full Name Field */}
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            isRequired
            error={errors.fullName?.message}
            leftIcon={
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
            {...register('fullName')}
          />

          {/* Email Address Field */}
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

          {/* Password Field */}
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••••••"
            isRequired
            error={errors.password?.message}
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
            {...register('password')}
          />

          {/* Confirm Password Field */}
          <Input
            label="Confirm Password"
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

          {/* Terms Checkbox */}
          <div className="pt-1">
            <Checkbox
              label={
                <span>
                  I agree to the{' '}
                  <Link href="/terms" className="text-cyan-400 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-cyan-400 hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              }
              isRequired
              isError={Boolean(errors.termsChecked)}
              {...register('termsChecked')}
            />
            {errors.termsChecked && (
              <p className="text-xs text-rose-400 font-medium mt-1 pl-7">
                {errors.termsChecked.message}
              </p>
            )}
          </div>

          {/* Email-Only Submit Action Button (Google Signup Removed per specification) */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={registerMutation.isPending}
            className="mt-3"
          >
            Create Account
          </Button>
        </form>
      </CardContent>

      {/* Footer Link */}
      <CardFooter className="flex justify-center pt-4 border-t border-slate-800/60 text-sm">
        <span className="text-slate-400">Already have an account?</span>
        <Link
          href="/login"
          className="ml-1.5 font-semibold text-cyan-400 hover:text-cyan-300 transition-colors focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded relative group"
        >
          <span>Sign in →</span>
          <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-cyan-400 group-hover:w-full transition-all duration-300" />
        </Link>
      </CardFooter>
    </Card>
  );
};
