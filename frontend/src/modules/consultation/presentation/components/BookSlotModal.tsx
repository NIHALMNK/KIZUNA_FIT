import React, { useState } from 'react';
import { Dialog, DialogFooter } from '../../../../shared/components/ui/Dialog';
import { Button } from '../../../../shared/components/ui/Button';
import { Input } from '../../../../shared/components/ui/Input';
import { Select } from '../../../../shared/components/ui/Select';
import { useBookSlot } from '../../application/hooks/useConsultationMutations';

interface BookSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultationId: string;
  initialStartAt?: string;
  initialTimezone?: string;
}

export const BookSlotModal: React.FC<BookSlotModalProps> = ({
  isOpen,
  onClose,
  consultationId,
  initialStartAt,
  initialTimezone = 'UTC',
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
  const [formError, setFormError] = useState<string | null>(null);

  const bookSlotMutation = useBookSlot();

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

      bookSlotMutation.mutate(
        {
          consultationId,
          payload: {
            scheduledStartAt: startIso,
            scheduledEndAt: endIso,
            timezone,
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
      title="Book Preferred Consultation Slot"
      description="Select your preferred start date, time, and session duration to book a slot with your coach."
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
            label="Timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            options={[
              { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
              { value: 'America/New_York', label: 'EST / EDT (Eastern Time)' },
              { value: 'America/Chicago', label: 'CST / CDT (Central Time)' },
              { value: 'America/Los_Angeles', label: 'PST / PDT (Pacific Time)' },
              { value: 'Europe/London', label: 'GMT / BST (London)' },
              { value: 'Asia/Tokyo', label: 'JST (Tokyo)' },
            ]}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={bookSlotMutation.isPending}>
            Book Slot
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};
