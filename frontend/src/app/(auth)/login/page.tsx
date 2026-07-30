import React from 'react';
import { LoginPage } from '../../../modules/identity/presentation/pages/login';

export const metadata = {
  title: 'Sign In | KIZUNAFIT',
  description: 'Access your KIZUNAFIT client or trainer workspace.',
};

export default function Page() {
  return <LoginPage />;
}
