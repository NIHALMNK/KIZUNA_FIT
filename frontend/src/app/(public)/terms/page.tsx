'use client';

import React from 'react';
import { Heading, Paragraph, Text } from '@/shared/components/ui/Typography';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <Heading level={1} className="text-3xl sm:text-4xl font-extrabold">
          Terms of Service
        </Heading>
        <Text size="xs" variant="muted" className="block">
          Last Updated: August 2026
        </Text>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>1. Platform Usage & Scope</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <Paragraph variant="secondary">
            KIZUNAFIT is a marketplace connecting independent certified personal fitness trainers with clients. By accessing the platform, users agree to abide by these terms.
          </Paragraph>
          <Paragraph variant="secondary">
            Account registration requires selecting an immutable role (Client or Trainer). Users must provide accurate, non-misleading information during registration and profile creation.
          </Paragraph>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Trainer Responsibilities & Credentials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <Paragraph variant="secondary">
            Trainers on KIZUNAFIT operate as independent professionals. Trainers are responsible for maintaining valid fitness certifications and providing professional, safe exercise guidance.
          </Paragraph>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Health & Exercise Disclaimer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <Paragraph variant="secondary">
            KIZUNAFIT does not provide medical advice. Clients should consult with a qualified healthcare physician before starting any physical fitness, workout, or nutrition program.
          </Paragraph>
        </CardContent>
      </Card>
    </div>
  );
}
