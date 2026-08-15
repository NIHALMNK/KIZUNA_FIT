'use client';

import React from 'react';
import { Heading, Paragraph, Text } from '@/shared/components/ui/Typography';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import Link from 'next/link';
import { PUBLIC_ROUTES } from '@/shared/constants/routes/public.routes';
import { ShieldCheck, Users, Target, HeartHandshake } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <Heading level={1} className="text-3xl sm:text-5xl font-extrabold">
          About KIZUNAFIT
        </Heading>
        <Paragraph size="lg" variant="secondary">
          Connecting individuals with certified personal fitness trainers for authentic, 1-on-1 physical transformation.
        </Paragraph>
      </div>

      {/* Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[var(--color-surface-alt)] text-[var(--color-primary)]">
                <Target className="h-6 w-6" />
              </div>
              <CardTitle>Our Mission</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Paragraph size="md" variant="secondary">
              To replace generic automated fitness advice with dedicated 1-on-1 human coaching, backed by verified credentials and structured progression.
            </Paragraph>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[var(--color-surface-alt)] text-[var(--color-accent)]">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <CardTitle>Our Values</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Paragraph size="md" variant="secondary">
              Trust, authenticity, and technical excellence. We empower coaches to build meaningful businesses while giving clients transparent access to certified guidance.
            </Paragraph>
          </CardContent>
        </Card>
      </div>

      {/* Pillars */}
      <Card>
        <CardHeader>
          <CardTitle>Why KIZUNAFIT Exists</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[var(--color-success)] shrink-0" />
              <Text weight="bold" size="md">Vetted Trainer Credibility</Text>
            </div>
            <Paragraph size="sm" variant="secondary">
              All personal trainers on KIZUNAFIT present verified certifications, professional background experience, and client reviews.
            </Paragraph>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[var(--color-primary)] shrink-0" />
              <Text weight="bold" size="md">Client-Coach Alignment</Text>
            </div>
            <Paragraph size="sm" variant="secondary">
              Browse specializations ranging from body re-composition and strength training to athletic mobility and injury rehabilitation.
            </Paragraph>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center pt-6 space-y-4">
        <Heading level={3}>Ready to Find Your Coach?</Heading>
        <div className="flex justify-center gap-4">
          <Link href={PUBLIC_ROUTES.FIND_TRAINERS}>
            <Button variant="primary">Explore Certified Trainers</Button>
          </Link>
          <Link href={PUBLIC_ROUTES.REGISTER}>
            <Button variant="outline">Create Account</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
