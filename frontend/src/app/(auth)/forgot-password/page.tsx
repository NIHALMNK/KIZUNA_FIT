import React from 'react';
import { ForgotPasswordForm } from '../../../modules/identity/presentation/components/ForgotPasswordForm';

export const metadata = {
  title: 'Forgot Password | KIZUNAFIT',
  description: 'Recover your KIZUNAFIT account access.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
