'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordFormValues } from '../validation/authSchemas';
import { useForgotPassword } from '../../application/hooks/useForgotPassword';
import { Button } from '../../../../shared/components/ui/Button';
import { Input } from '../../../../shared/components/ui/Input';
import { toast } from 'sonner';
import { useState } from 'react';
import Link from 'next/link';
import { getFriendlyMessage, handleValidationErrors } from '../utils/errorMapper';

export const ForgotPasswordForm = () => {
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, setError, formState: { errors } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const forgotPasswordMutation = useForgotPassword();

  const onSubmit = (data: ForgotPasswordFormValues) => {
    forgotPasswordMutation.mutate(data.email, {
      onSuccess: () => {
        setIsSuccess(true);
      },
      onError: (error: Error) => {
        const isValidation = handleValidationErrors(error, setError);
        if (!isValidation) {
          toast.error(getFriendlyMessage(error, 'Failed to send reset link.'));
        }
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold text-green-600">Check your email</h3>
        <p className="text-gray-600">We have sent a password reset link to your email address.</p>
        <div className="pt-4">
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

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
      <Button type="submit" className="w-full" isLoading={forgotPasswordMutation.isPending}>
        Send Reset Link
      </Button>
      
    </form>
  );
};
