import React, { useState } from 'react';
import { TrainerAvailability, DaySchedule, TimeSlot } from '../../domain/types/profile.types';
import { TrainerAvailabilityStatus } from '../../domain/enums/profile.enums';
import { DAYS_OF_WEEK, AVAILABILITY_STATUS_OPTIONS } from '../constants/profile.constants';

interface AvailabilityEditorProps {
  initialAvailability: TrainerAvailability;
  onSave: (availability: { status: TrainerAvailabilityStatus; timezone: string; weeklySchedule: DaySchedule[] }) => Promise<void>;
  isLoading?: boolean;
}

export const AvailabilityEditor: React.FC<AvailabilityEditorProps> = ({
  initialAvailability,
  onSave,
  isLoading = false,
}) => {
  const [status, setStatus] = useState<TrainerAvailabilityStatus>(initialAvailability.status);
  const [timezone, setTimezone] = useState<string>(initialAvailability.timezone || 'UTC');
  const [schedule, setSchedule] = useState<DaySchedule[]>(
    DAYS_OF_WEEK.map((d) => {
      const existing = initialAvailability.weeklySchedule.find((s) => s.dayOfWeek === d.dayOfWeek);
      return {
        dayOfWeek: d.dayOfWeek,
        slots: existing ? [...existing.slots] : [],
      };
    }),
  );

  const handleAddSlot = (dayOfWeek: number) => {
    setSchedule((prev) =>
      prev.map((item) => {
        if (item.dayOfWeek === dayOfWeek) {
          return {
            ...item,
            slots: [...item.slots, { startTime: '09:00', endTime: '17:00' }],
          };
        }
        return item;
      }),
    );
  };

  const handleRemoveSlot = (dayOfWeek: number, index: number) => {
    setSchedule((prev) =>
      prev.map((item) => {
        if (item.dayOfWeek === dayOfWeek) {
          const updated = [...item.slots];
          updated.splice(index, 1);
          return { ...item, slots: updated };
        }
        return item;
      }),
    );
  };

  const handleSlotChange = (dayOfWeek: number, index: number, field: keyof TimeSlot, value: string) => {
    setSchedule((prev) =>
      prev.map((item) => {
        if (item.dayOfWeek === dayOfWeek) {
          const updated = [...item.slots];
          updated[index] = { ...updated[index], [field]: value };
          return { ...item, slots: updated };
        }
        return item;
      }),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      status,
      timezone,
      weeklySchedule: schedule.filter((s) => s.slots.length > 0),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Availability Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TrainerAvailabilityStatus)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          >
            {AVAILABILITY_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Timezone</label>
          <input
            type="text"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            placeholder="e.g. America/New_York or UTC"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Weekly Schedule Slots</h4>
        {DAYS_OF_WEEK.map((day) => {
          const dayData = schedule.find((s) => s.dayOfWeek === day.dayOfWeek);
          const slots = dayData?.slots || [];

          return (
            <div key={day.dayOfWeek} className="bg-white border border-gray-200 rounded-md p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-gray-900">{day.label}</span>
                <button
                  type="button"
                  onClick={() => handleAddSlot(day.dayOfWeek)}
                  className="px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200"
                >
                  + Add Slot
                </button>
              </div>

              {slots.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No available slots set for this day</p>
              ) : (
                <div className="space-y-2">
                  {slots.map((slot, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">From</span>
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => handleSlotChange(day.dayOfWeek, idx, 'startTime', e.target.value)}
                          className="px-2 py-1 text-xs border border-gray-300 rounded"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">To</span>
                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => handleSlotChange(day.dayOfWeek, idx, 'endTime', e.target.value)}
                          className="px-2 py-1 text-xs border border-gray-300 rounded"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSlot(day.dayOfWeek, idx)}
                        className="text-xs text-red-600 hover:text-red-800 font-medium ml-auto"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="pt-4 border-t border-gray-200 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md disabled:opacity-50"
        >
          {isLoading ? 'Saving Availability...' : 'Save Availability Schedule'}
        </button>
      </div>
    </form>
  );
};
