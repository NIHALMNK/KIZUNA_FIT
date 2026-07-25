import React from 'react';
import { LoginForm } from '../../../modules/identity/presentation/components/LoginForm';
import { Card } from '../../../shared/components/ui/Card';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <Card className="p-8 shadow-lg rounded-xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="text-gray-500 mt-2 text-sm">Sign in to your KIZUNAFIT account</p>
      </div>
      <LoginForm />
      <div className="mt-6 text-center text-sm">
        <span className="text-gray-500">Don't have an account? </span>
        <Link href="/register" className="text-blue-600 font-medium hover:underline">
          Sign up
        </Link>
      </div>
    </Card>
  );
}
