import React from 'react';
import { RegisterForm } from '../../../modules/identity/presentation/components/RegisterForm';
import { Card } from '../../../shared/components/ui/Card';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <Card className="p-8 shadow-lg rounded-xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Create an Account</h1>
        <p className="text-gray-500 mt-2 text-sm">Join KIZUNAFIT today</p>
      </div>
      <RegisterForm />
      <div className="mt-6 text-center text-sm">
        <span className="text-gray-500">Already have an account? </span>
        <Link href="/login" className="text-blue-600 font-medium hover:underline">
          Sign in
        </Link>
      </div>
    </Card>
  );
}
