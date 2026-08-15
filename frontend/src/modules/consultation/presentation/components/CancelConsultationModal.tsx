import React, { useState } from 'react';
import { Dialog, DialogFooter } from '../../../../shared/components/ui/Dialog';
import { Button } from '../../../../shared/components/ui/Button';
import { Textarea } from '../../../../shared/components/ui/Textarea';
import { useCancelConsultation } from '../../application/hooks/useConsultationMutations';

interface CancelConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultationId: string;
}

export const CancelConsultationModal: React.FC<CancelConsultationModalProps> = ({
  isOpen,
  onClose,
  consultationId,
}) => {
  const [reason, setReason] = useState<string>('');
  const cancelMutation = useCancelConsultation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    cancelMutation.mutate(
      {
        consultationId,
        payload: { reason: reason.trim() || undefined },
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Cancel Consultation Session"
      description="Are you sure you want to cancel this consultation? This action cannot be undone."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5 w-full">
          <label className="block text-xs font-medium text-[var(--color-text-secondary)]">
            Reason for Cancellation (Optional)
          </label>
          <Textarea
            placeholder="Please specify a brief reason for your coach..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={1000}
            rows={3}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Keep Session
          </Button>
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="text-white bg-red-600 hover:bg-red-700 border-red-600"
            isLoading={cancelMutation.isPending}
          >
            Confirm Cancellation
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};
