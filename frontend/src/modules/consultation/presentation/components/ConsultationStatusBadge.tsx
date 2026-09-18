import React from 'react';
import { StatusBadge, DomainStatus } from '../../../../shared/components/ui/StatusBadge';
import { ConsultationStatus } from '../../domain/types/consultation.types';

interface ConsultationStatusBadgeProps {
  status: ConsultationStatus | string;
  showDot?: boolean;
  className?: string;
}

const statusConfigMap: Record<string, { domainStatus: DomainStatus; label: string }> = {
  [ConsultationStatus.CREATED]: { domainStatus: 'pending', label: 'Slot Pending' },
  [ConsultationStatus.SLOT_BOOKED]: { domainStatus: 'pending', label: 'Slot Booked' },
  [ConsultationStatus.SCHEDULED]: { domainStatus: 'active', label: 'Scheduled' },
  [ConsultationStatus.COMPLETED]: { domainStatus: 'completed', label: 'Completed' },
  [ConsultationStatus.NO_SHOW]: { domainStatus: 'suspended', label: 'No-Show' },
  [ConsultationStatus.CANCELLED]: { domainStatus: 'cancelled', label: 'Cancelled' },
};

export const ConsultationStatusBadge: React.FC<ConsultationStatusBadgeProps> = ({
  status,
  showDot = true,
  className,
}) => {
  const config = statusConfigMap[status] || { domainStatus: 'draft', label: status };

  return (
    <StatusBadge
      status={config.domainStatus}
      label={config.label}
      showDot={showDot}
      className={className}
    />
  );
};
