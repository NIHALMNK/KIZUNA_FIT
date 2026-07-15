'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, ResetPasswordFormValues } from '../validation/authSchemas';
import { useResetPassword } from '../../application/hooks/useResetPassword';
import { Button } from '../../../../shared/components/ui/Button';
import { Input } from '../../../../shared/components/ui/Input';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { getFriendlyMessage, handleValidationErrors } from '../utils/errorMapper';

export const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { register, handleSubmit, setError, formState: { errors } } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const resetPasswordMutation = useResetPassword();

  const onSubmit = (data: ResetPasswordFormValues) => {
    if (!token) {
      toast.error('Invalid or missing reset token.');
      return;
    }

    resetPasswordMutation.mutate({ token, newPassword: data.newPassword }, {
      onSuccess: () => {
        toast.success('Password reset successful! You can now log in.');
        router.push('/login');
      },
      onError: (error: Error) => {
        const isValidation = handleValidationErrors(error, setError);
        if (!isValidation) {
          toast.error(getFriendlyMessage(error, 'Failed to reset password.'));
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">New Password</label>
        <Input 
          type="password" 
          placeholder="Enter new password" 
          {...register('newPassword')} 
        />
        {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Confirm Password</label>
        <Input 
          type="password" 
          placeholder="Confirm new password" 
          {...register('confirmPassword')} 
        />
        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
      </div>
      <Button type="submit" className="w-full" isLoading={resetPasswordMutation.isPending}>
        Reset Password
      </Button>
    </form>
  );
};
