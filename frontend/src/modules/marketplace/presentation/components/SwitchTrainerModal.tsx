import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogFooter } from '../../../../shared/components/ui/Dialog';
import { Button } from '../../../../shared/components/ui/Button';
import { Textarea } from '../../../../shared/components/ui/Textarea';
import { useSwitchTrainer } from '../../application/useMarketplace';
import { ROUTES } from '../../../../shared/constants/routes';

interface SwitchTrainerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SwitchTrainerModal: React.FC<SwitchTrainerModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [reason, setReason] = useState<string>('');
  const switchTrainerMutation = useSwitchTrainer();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    switchTrainerMutation.mutate(
      { reason: reason.trim() || undefined },
      {
        onSuccess: () => {
          onClose();
          router.push(ROUTES.PUBLIC_TRAINERS);
        },
      },
    );
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Switch Coach?"
      description="Are you sure you want to switch coaches? Your current pre-coaching consultation session and acquisition pipeline with this coach will be terminated. Historical request records remain permanently preserved. You can discover and select a new coach immediately."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 text-xs rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-1">
          <p className="font-bold">Important Information:</p>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-200/80">
            <li>Your active consultation with this coach will be cancelled.</li>
            <li>Historical request records remain preserved for audit compliance.</li>
            <li>You will be redirected to the Find Coaches marketplace to choose a new coach.</li>
          </ul>
        </div>

        <div className="space-y-1.5 w-full">
          <label className="block text-xs font-medium text-[var(--color-text-secondary)]">
            Reason for Switching (Optional)
          </label>
          <Textarea
            placeholder="Help us understand why you are switching coaches..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={500}
            rows={3}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Keep Coach
          </Button>
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="text-white bg-amber-600 hover:bg-amber-700 border-amber-600 font-bold"
            isLoading={switchTrainerMutation.isPending}
          >
            Confirm Switch Coach
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};
