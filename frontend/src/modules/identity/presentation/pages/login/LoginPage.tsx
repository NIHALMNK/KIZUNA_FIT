'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormValues } from '../../validation/authSchemas';
import { useLogin } from '../../../application/hooks/useLogin';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../../../shared/components/ui/Card';
import { Input } from '../../../../../shared/components/ui/Input';
import { Button } from '../../../../../shared/components/ui/Button';
import { Label } from '../../../../../shared/components/ui/Label';
import { Checkbox } from '../../../../../shared/components/ui/Checkbox';
import { GoogleAuthButton } from '../../../../../shared/components/ui/GoogleAuthButton';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../application/store/authStore';
import Link from 'next/link';
import { getFriendlyMessage, handleValidationErrors } from '../../utils/errorMapper';

/**
 * 2026 World-Class Premium SaaS Login Interface for KIZUNAFIT.
 * Consumes Frosted Glass Primitives (Card, Input, Button, Label, Checkbox) and Identity Domain Logic.
 */
export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Welcome back! Initializing secure workspace...');
        const user = useAuthStore.getState().user;
        if (user && user.role) {
          router.push(`/${user.role.toLowerCase()}`);
        } else {
          router.push('/');
        }
      },
      onError: (error: Error) => {
        const isValidation = handleValidationErrors(error, setError);
        if (!isValidation) {
          toast.error(getFriendlyMessage(error, 'Login failed. Please check your credentials.'));
        }
      },
    });
  };

  return (
    <div className="w-full max-w-[440px] mx-auto bg-white rounded-2xl border border-slate-200/90 shadow-2xl p-7 sm:p-9 text-slate-900 transition-all duration-200">
      {/* Header Landmark */}
      <div className="text-center mb-6 space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Welcome Back<span className="text-cyan-600">.</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
          Sign in to your KIZUNAFIT workspace to manage your training
        </p>
      </div>

      {/* Main Content Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Email Address Field */}
        <div className="space-y-1.5">
          <label htmlFor="email-input" className="block text-xs font-bold uppercase tracking-wider text-slate-800">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              id="email-input"
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

        {/* Password Field with Custom Header & Toggle */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label htmlFor="password-input" className="block text-xs font-bold uppercase tracking-wider text-slate-800">
              Password <span className="text-rose-500">*</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 transition-colors focus:outline-none focus:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="relative flex items-center">
            <div className="absolute left-3.5 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              id="password-input"
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
              className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a9.04 9.04 0 012.122-.363c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs font-medium text-rose-600 mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Remember Me Controls */}
        <div className="flex items-center pt-1">
          <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-cyan-600 border-slate-300 rounded focus:ring-cyan-500"
            />
            <span>Remember this device</span>
          </label>
        </div>

        {/* Primary Action Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={loginMutation.isPending}
          className="mt-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold h-11 rounded-xl shadow-md shadow-cyan-500/20"
        >
          Sign In to Workspace
        </Button>

        {/* Crisp Divider */}
        <div className="relative my-5 flex items-center justify-center text-xs uppercase tracking-wider font-semibold text-slate-400 before:content-[''] before:flex-1 before:border-t before:border-slate-200 after:content-[''] after:flex-1 after:border-t after:border-slate-200 before:mr-3 after:ml-3">
          Or continue with
        </div>

        {/* Third Party Auth */}
        <GoogleAuthButton />
      </form>

      {/* Footer Section */}
      <div className="mt-6 pt-5 border-t border-slate-200 flex justify-center items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600">
        <span>Don't have an account?</span>
        <Link
          href="/register"
          className="font-bold text-cyan-600 hover:text-cyan-700 transition-colors focus:outline-none focus:underline"
        >
          Create Account →
        </Link>
      </div>
    </div>
  );
};
