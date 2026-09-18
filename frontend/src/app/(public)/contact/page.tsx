'use client';

import React, { useState } from 'react';
import { Heading, Paragraph, Text } from '@/shared/components/ui/Typography';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/components/ui/Card';
import { Input } from '@/shared/components/ui/Input';
import { Textarea } from '@/shared/components/ui/Textarea';
import { Button } from '@/shared/components/ui/Button';
import { Label } from '@/shared/components/ui/Label';
import { Alert } from '@/shared/components/ui/Alert';
import { Mail, MapPin, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <Heading level={1} className="text-3xl sm:text-4xl font-extrabold">
          Contact KIZUNAFIT Support
        </Heading>
        <Paragraph size="md" variant="secondary" className="max-w-xl mx-auto">
          Have questions about finding a coach, platform accounts, or trainer verification? We are here to help.
        </Paragraph>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Sidebar */}
        <div className="space-y-4 md:col-span-1">
          <Card>
            <CardContent className="p-5 space-y-5">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-[var(--color-primary)] shrink-0 mt-0.5" />
                <div>
                  <Text weight="bold" size="sm" className="block">Email Support</Text>
                  <Text size="xs" variant="secondary">support@kizunafit.com</Text>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-[var(--color-accent)] shrink-0 mt-0.5" />
                <div>
                  <Text weight="bold" size="sm" className="block">Trainer Relations</Text>
                  <Text size="xs" variant="secondary">trainers@kizunafit.com</Text>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[var(--color-success)] shrink-0 mt-0.5" />
                <div>
                  <Text weight="bold" size="sm" className="block">Location</Text>
                  <Text size="xs" variant="secondary">San Francisco, CA</Text>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>Fill out the form below and our team will get back to you shortly.</CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <Alert variant="success" title="Message Received">
                  Thank you for reaching out! We have received your inquiry and our support team will respond to {formData.email} within 24 hours.
                </Alert>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="contact-name" isRequired>Your Name</Label>
                    <Input
                      id="contact-name"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact-email" isRequired>Email Address</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact-message" isRequired>Message</Label>
                    <Textarea
                      id="contact-message"
                      required
                      rows={4}
                      placeholder="How can we help you?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <Button type="submit" variant="primary" fullWidth size="md">
                    Send Message
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
