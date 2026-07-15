'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormValues } from '../validation/authSchemas';
import { useRegister } from '../../application/hooks/useRegister';
import { Button } from '../../../../shared/components/ui/Button';
import { Input } from '../../../../shared/components/ui/Input';
import { toast } from 'sonner';
import Link from 'next/link';
import { GoogleAuthButton } from '../../../../shared/components/ui/GoogleAuthButton';
import { getFriendlyMessage, handleValidationErrors } from '../utils/errorMapper';

export const RegisterForm = () => {
  const { register, handleSubmit, setError, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      role: 'CLIENT',
    },
  });

  const registerMutation = useRegister();

  const onSubmit = (data: RegisterFormValues) => {
    const payload = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      role: data.role
    };
    
    registerMutation.mutate(payload as any, {
      onSuccess: () => {
        toast.success('Registration successful! Please verify your email.');
      },
      onError: (error: Error) => {
        const isValidation = handleValidationErrors(error, setError);
        if (!isValidation) {
          toast.error(getFriendlyMessage(error, 'Registration failed.'));
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Full Name</label>
        <Input 
          type="text" 
          placeholder="Enter your full name" 
          {...register('fullName')} 
        />
        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
      </div>
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
        <label className="block text-sm font-medium mb-1">Password</label>
        <Input 
          type="password" 
          placeholder="Create a password" 
          {...register('password')} 
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Confirm Password</label>
        <Input 
          type="password" 
          placeholder="Confirm your password" 
          {...register('confirmPassword')} 
        />
        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">I am registering as a:</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" value="CLIENT" {...register('role')} /> Client
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" value="TRAINER" {...register('role')} /> Trainer
          </label>
        </div>
      </div>
      
      <div className="flex items-start gap-2 pt-2">
        <input type="checkbox" id="terms" className="mt-1" {...register('termsChecked')} />
        <label htmlFor="terms" className="text-sm text-gray-600">
          I agree to the Terms & Conditions and Privacy Policy
        </label>
      </div>
      {errors.termsChecked && <p className="text-red-500 text-sm">{errors.termsChecked.message}</p>}
      <Button type="submit" className="w-full" isLoading={registerMutation.isPending}>
        Register
      </Button>
      

    </form>
  );
};
