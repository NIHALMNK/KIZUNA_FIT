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
    <Card variant="default" size="lg" className="w-full max-w-md mx-auto">
      {/* Header Landmark */}
      <CardHeader className="text-center pb-4 items-center">
        <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Welcome Back<span className="text-cyan-400">.</span>
        </CardTitle>
        <CardDescription className="text-sm text-slate-400 mt-1 font-medium">
          Sign in to your KIZUNAFIT workspace to manage your training
        </CardDescription>
      </CardHeader>

      {/* Main Content Form */}
      <CardContent className="space-y-5 pt-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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

          {/* Password Field with Custom Header & Toggle */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label htmlFor="password-input" isRequired>
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded relative group"
              >
                <span>Forgot Password?</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-cyan-400 group-hover:w-full transition-all duration-300" />
              </Link>
            </div>

            <Input
              id="password-input"
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
              }
              {...register('password')}
            />
          </div>

          {/* Remember Me Controls */}
          <div className="flex items-center justify-between pt-1">
            <Checkbox
              label="Remember this device"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
          </div>

          {/* Primary Action Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={loginMutation.isPending}
            className="mt-3"
          >
            Sign In to Workspace
          </Button>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800/80" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-semibold">
              <span className="bg-slate-900/90 px-3 text-slate-500 rounded-full select-none border border-slate-800/50">
                Or continue with
              </span>
            </div>
          </div>

          {/* Third Party Auth (Google Sign In retained ONLY on Login page) */}
          <GoogleAuthButton />
        </form>
      </CardContent>

      {/* Footer Section */}
      <CardFooter className="flex justify-center pt-5 border-t border-slate-800/60 text-sm">
        <span className="text-slate-400">Don't have an account?</span>
        <Link
          href="/register"
          className="ml-1.5 font-semibold text-cyan-400 hover:text-cyan-300 transition-colors focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded relative group"
        >
          <span>Create Account →</span>
          <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-cyan-400 group-hover:w-full transition-all duration-300" />
        </Link>
      </CardFooter>
    </Card>
  );
};
