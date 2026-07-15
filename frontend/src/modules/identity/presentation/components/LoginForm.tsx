'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormValues } from '../validation/authSchemas';
import { useLogin } from '../../application/hooks/useLogin';
import { Button } from '../../../../shared/components/ui/Button';
import { Input } from '../../../../shared/components/ui/Input';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../application/store/authStore';
import Link from 'next/link';
import { GoogleAuthButton } from '../../../../shared/components/ui/GoogleAuthButton';
import { getFriendlyMessage, handleValidationErrors } from '../utils/errorMapper';

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, setError, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const loginMutation = useLogin();

  const router = useRouter();

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Logged in successfully!');
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
          toast.error(getFriendlyMessage(error, 'Login failed.'));
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <Input 
          type="email" 
          placeholder="Enter your email" 
          {...register('email')} 
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium">Password</label>
          <Link href="/forgot-password" className="text-xs text-primary hover:underline">
            Forgot Password?
          </Link>
        </div>
        <div className="relative">
          <Input 
            type={showPassword ? 'text' : 'password'} 
            placeholder="Enter your password" 
            {...register('password')} 
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>
      <Button type="submit" className="w-full" isLoading={loginMutation.isPending}>
        Sign In
      </Button>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <GoogleAuthButton />
      <p className="text-center text-xs text-gray-500 mt-2">
        Only for accounts that have already linked Google.
      </p>

    </form>
  );
};
