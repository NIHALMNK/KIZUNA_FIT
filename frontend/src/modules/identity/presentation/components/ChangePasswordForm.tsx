'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, ChangePasswordFormValues } from '../validation/authSchemas';
import { useChangePassword } from '../../application/hooks/useChangePassword';
import { Button } from '../../../../shared/components/ui/Button';
import { Input } from '../../../../shared/components/ui/Input';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { getFriendlyMessage, handleValidationErrors } from '../utils/errorMapper';
import { ApiError } from '../../../../shared/exceptions/ApiError';
import { useAuthStore } from '../../application/store/authStore';
import { Eye, EyeOff } from 'lucide-react';

export const ChangePasswordForm = () => {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, setError, formState: { errors } } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const changePasswordMutation = useChangePassword();

  const handleGoToLogin = () => {
    // Clear in-memory access token & local auth store without calling backend /logout endpoint
    useAuthStore.getState().logout();
    router.push('/login');
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl">
          ✓
        </div>
        <h3 className="text-xl font-semibold text-green-600">Password Changed Successfully</h3>
        <p className="text-gray-600 text-sm">For your security, please log in again with your new password.</p>
        <div className="pt-4">
          <Button onClick={handleGoToLogin} className="w-full">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const onSubmit = (data: ChangePasswordFormValues) => {
    changePasswordMutation.mutate(
      { oldPassword: data.oldPassword, newPassword: data.newPassword },
      {
        onSuccess: () => {
          setIsSuccess(true);
        },
        onError: (error: Error) => {
          if (error instanceof ApiError) {
            if (error.code === 'INVALID_CREDENTIALS') {
              setError('oldPassword', {
                type: 'server',
                message: 'Incorrect current password.',
              });
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
            toast.error(getFriendlyMessage(error, 'Failed to change password.'));
          }
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label htmlFor="oldPassword" className="block text-sm font-medium mb-1">
          Current Password
        </label>
        <div className="relative">
          <Input
            id="oldPassword"
            type={showOldPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Enter current password"
            className="pr-10"
            {...register('oldPassword')}
          />
          <button
            type="button"
            onClick={() => setShowOldPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={showOldPassword ? 'Hide current password' : 'Show current password'}
          >
            {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.oldPassword && <p className="text-red-500 text-sm mt-1">{errors.oldPassword.message}</p>}
      </div>

      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
          New Password
        </label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showNewPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Enter new password"
            className="pr-10"
            {...register('newPassword')}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
          >
            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
          Confirm New Password
        </label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Confirm new password"
            className="pr-10"
            {...register('confirmPassword')}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
      </div>

      <Button type="submit" className="w-full" isLoading={changePasswordMutation.isPending}>
        Change Password
      </Button>
    </form>
  );
};
