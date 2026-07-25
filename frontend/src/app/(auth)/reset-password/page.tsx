import React, { Suspense } from 'react';
import { ResetPasswordForm } from '../../../modules/identity/presentation/components/ResetPasswordForm';
import { Card } from '../../../shared/components/ui/Card';
import { Spinner } from '../../../shared/components/ui/Spinner';

export default function ResetPasswordPage() {
  return (
    <Card className="p-8 shadow-lg rounded-xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Set New Password</h1>
        <p className="text-gray-500 mt-2 text-sm">Please choose a secure new password</p>
      </div>
      <Suspense fallback={<div className="flex justify-center"><Spinner /></div>}>
        <ResetPasswordForm />
      </Suspense>
    </Card>
  );
}
