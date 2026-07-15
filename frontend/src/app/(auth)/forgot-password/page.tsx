import React from 'react';
import { ForgotPasswordForm } from '../../../modules/identity/presentation/components/ForgotPasswordForm';
import { Card } from '../../../shared/components/ui/Card';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <Card className="p-8 shadow-lg rounded-xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <p className="text-gray-500 mt-2 text-sm">Enter your email to receive a reset link</p>
      </div>
      <ForgotPasswordForm />
      <div className="mt-6 text-center text-sm">
        <span className="text-gray-500">Remember your password? </span>
        <Link href="/login" className="text-blue-600 font-medium hover:underline">
          Sign in
        </Link>
      </div>
    </Card>
  );
}
