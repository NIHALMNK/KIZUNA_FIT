import React from 'react';
import { WorkoutCompletionStatus, WorkoutProgramStatus } from '../../domain/types/workout.types';
import { Badge } from '../../../../shared/components/ui/Badge';

interface WorkoutStatusBadgeProps {
  status: WorkoutProgramStatus | WorkoutCompletionStatus | string;
  className?: string;
}

export const WorkoutStatusBadge: React.FC<WorkoutStatusBadgeProps> = ({ status, className }) => {
  switch (status) {
    case WorkoutProgramStatus.ACTIVE:
      return (
        <Badge variant="success" className={className}>
          Active Program
        </Badge>
      );
    case WorkoutProgramStatus.DRAFT:
      return (
        <Badge variant="warning" className={className}>
          Draft
        </Badge>
      );
    case WorkoutProgramStatus.COMPLETED:
    case WorkoutCompletionStatus.COMPLETED:
      return (
        <Badge variant="primary" className={className}>
          Completed
        </Badge>
      );
    case WorkoutCompletionStatus.IN_PROGRESS:
      return (
        <Badge variant="secondary" className={className}>
          In Progress
        </Badge>
      );
    case WorkoutCompletionStatus.MISSED:
      return (
        <Badge variant="danger" className={className}>
          Missed
        </Badge>
      );
    default:
      return (
        <Badge variant="default" className={className}>
          {status}
        </Badge>
      );
  }
};
