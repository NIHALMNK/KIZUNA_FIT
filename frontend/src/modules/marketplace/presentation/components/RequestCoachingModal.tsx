import React, { useState } from 'react';
import { Dialog, DialogFooter } from '@/shared/components/ui/Dialog';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Textarea } from '@/shared/components/ui/Textarea';
import { Avatar } from '@/shared/components/ui/Avatar';
import { useCreateTrainerRequest } from '../../application/useMarketplace';

interface RequestCoachingModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainerId: string;
  trainerName?: string;
  trainerHeadline?: string;
  avatarUrl?: string;
}

export const RequestCoachingModal: React.FC<RequestCoachingModalProps> = ({
  isOpen,
  onClose,
  trainerId,
  trainerName,
  trainerHeadline,
  avatarUrl,
}) => {
  const [goal, setGoal] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const createRequestMutation = useCreateTrainerRequest();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedGoal = goal.trim();
    if (trimmedGoal.length < 3) {
      setError('Coaching goal must be at least 3 characters.');
      return;
    }
    if (trimmedGoal.length > 100) {
      setError('Coaching goal cannot exceed 100 characters.');
      return;
    }

    createRequestMutation.mutate(
      {
        trainerId,
        goal: trimmedGoal,
        message: message.trim() || undefined,
      },
      {
        onSuccess: () => {
          setGoal('');
          setMessage('');
          onClose();
        },
      },
    );
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Request 1-on-1 Coaching"
      description="Send a proposal to start your personal training journey."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Trainer Snapshot Preview */}
        <div className="p-3.5 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)] flex items-center gap-3">
          <Avatar src={avatarUrl} fallback={trainerName?.slice(0, 2) || 'TR'} size="md" />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-[var(--color-heading)] truncate">
              {trainerName || 'Certified Trainer'}
            </h4>
            {trainerHeadline && (
              <p className="text-xs text-[var(--color-text-secondary)] truncate">
                {trainerHeadline}
              </p>
            )}
          </div>
        </div>

        {/* Goal Input */}
        <div className="space-y-1.5">
          <label
            htmlFor="coaching-goal"
            className="text-xs font-bold text-[var(--color-text-primary)]"
          >
            Primary Coaching Goal <span className="text-red-500">*</span>
          </label>
          <Input
            id="coaching-goal"
            placeholder="e.g. Weight loss, Marathon training, Muscle building"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            disabled={createRequestMutation.isPending}
            required
            maxLength={100}
          />
          <p className="text-[11px] text-[var(--color-text-muted)]">3 to 100 characters</p>
        </div>

        {/* Message Textarea */}
        <div className="space-y-1.5">
          <label
            htmlFor="coaching-message"
            className="text-xs font-bold text-[var(--color-text-primary)]"
          >
            Optional Message to Coach
          </label>
          <Textarea
            id="coaching-message"
            placeholder="Introduce yourself, share current fitness level, health conditions, or schedule preferences..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={createRequestMutation.isPending}
            maxLength={1000}
            rows={4}
          />
          <p className="text-[11px] text-[var(--color-text-muted)]">Maximum 1000 characters</p>
        </div>

        {error && (
          <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold">
            {error}
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={createRequestMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={createRequestMutation.isPending}
          >
            Submit Request
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};
