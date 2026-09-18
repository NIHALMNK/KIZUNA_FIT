import React from 'react';
import { PublicLayout } from '../../shared/layouts/PublicLayout';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}
