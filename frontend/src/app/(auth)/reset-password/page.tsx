import React, { Suspense } from 'react';
import { ResetPasswordForm } from '../../../modules/identity/presentation/components/ResetPasswordForm';

export const metadata = {
  title: 'Reset Password | KIZUNAFIT',
  description: 'Update your KIZUNAFIT account password.',
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center text-slate-400 p-8">Loading password reset...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
