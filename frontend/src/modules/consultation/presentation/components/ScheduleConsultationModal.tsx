import React, { useState } from 'react';
import { Dialog, DialogFooter } from '../../../../shared/components/ui/Dialog';
import { Button } from '../../../../shared/components/ui/Button';
import { Input } from '../../../../shared/components/ui/Input';
import { Select } from '../../../../shared/components/ui/Select';
import { ConsultationPlatform } from '../../domain/types/consultation.types';
import { useScheduleConsultation } from '../../application/hooks/useConsultationMutations';

interface ScheduleConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultationId: string;
  initialStartAt?: string;
  initialTimezone?: string;
  initialPlatform?: ConsultationPlatform;
}

export const ScheduleConsultationModal: React.FC<ScheduleConsultationModalProps> = ({
  isOpen,
  onClose,
  consultationId,
  initialStartAt,
  initialTimezone = 'UTC',
  initialPlatform = ConsultationPlatform.WEBRTC,
}) => {
  const defaultDate = initialStartAt
    ? new Date(initialStartAt).toISOString().slice(0, 10)
    : new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const defaultTime = initialStartAt
    ? new Date(initialStartAt).toISOString().slice(11, 16)
    : '10:00';

  const [startDate, setStartDate] = useState<string>(defaultDate);
  const [startTime, setStartTime] = useState<string>(defaultTime);
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [timezone, setTimezone] = useState<string>(initialTimezone);
  const [platform, setPlatform] = useState<ConsultationPlatform>(initialPlatform);
  const [formError, setFormError] = useState<string | null>(null);

  const scheduleMutation = useScheduleConsultation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!startDate || !startTime) {
      setFormError('Please select both a date and start time.');
      return;
    }

    try {
      const startIso = new Date(`${startDate}T${startTime}:00Z`).toISOString();
      const endMs = new Date(startIso).getTime() + durationMinutes * 60 * 1000;
      const endIso = new Date(endMs).toISOString();

      scheduleMutation.mutate(
        {
          consultationId,
          payload: {
            scheduledStartAt: startIso,
            scheduledEndAt: endIso,
            timezone,
            platform,
          },
        },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    } catch {
      setFormError('Invalid date or time selected.');
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule / Request Time Change"
      description="Update proposed date, start time, and video meeting platform for this consultation session."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {formError && (
          <div className="p-3 text-xs rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
            {formError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="date"
            label="Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />

          <Input
            type="time"
            label="Start Time (UTC)"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Session Duration"
            value={String(durationMinutes)}
            onChange={(e) => setDurationMinutes(Number(e.target.value))}
            options={[
              { value: '30', label: '30 Minutes' },
              { value: '45', label: '45 Minutes' },
              { value: '60', label: '60 Minutes (1 Hour)' },
            ]}
          />

          <Select
            label="Platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value as ConsultationPlatform)}
            options={[
              {
                value: ConsultationPlatform.WEBRTC,
                label: 'KIZUNAFIT WebRTC (Built-in Live Room)',
              },
              { value: ConsultationPlatform.GOOGLE_MEET, label: 'Google Meet' },
              { value: ConsultationPlatform.ZOOM, label: 'Zoom Video Communications' },
              { value: ConsultationPlatform.MICROSOFT_TEAMS, label: 'Microsoft Teams' },
            ]}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={scheduleMutation.isPending}>
            Update Schedule
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};
