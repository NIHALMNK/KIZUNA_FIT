import React, { Suspense } from 'react';
import { ChangePasswordForm } from '../../../modules/identity/presentation/components/ChangePasswordForm';
import { Card } from '../../../shared/components/ui/Card';
import { Spinner } from '../../../shared/components/ui/Spinner';

export default function ChangePasswordPage() {
  return (
    <div className="p-8 max-w-md mx-auto">
      <Card className="p-8 shadow-lg rounded-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Change Password</h1>
          <p className="text-gray-500 mt-2 text-sm">Update your password securely</p>
        </div>
        <Suspense fallback={<div className="flex justify-center"><Spinner /></div>}>
          <ChangePasswordForm />
        </Suspense>
      </Card>
    </div>
  );
}
