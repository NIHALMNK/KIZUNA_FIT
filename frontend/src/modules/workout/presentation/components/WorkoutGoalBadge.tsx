import React from 'react';
import { WorkoutGoal } from '../../domain/types/workout.types';
import { Badge } from '../../../../shared/components/ui/Badge';

interface WorkoutGoalBadgeProps {
  goal: WorkoutGoal | string;
  className?: string;
}

export const WorkoutGoalBadge: React.FC<WorkoutGoalBadgeProps> = ({ goal, className }) => {
  const formatLabel = (g: string) => {
    return g
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  switch (goal) {
    case WorkoutGoal.MUSCLE_GAIN:
      return (
        <Badge variant="primary" className={className}>
          {formatLabel(goal)}
        </Badge>
      );
    case WorkoutGoal.STRENGTH:
      return (
        <Badge variant="secondary" className={className}>
          {formatLabel(goal)}
        </Badge>
      );
    case WorkoutGoal.FAT_LOSS:
      return (
        <Badge variant="warning" className={className}>
          {formatLabel(goal)}
        </Badge>
      );
    case WorkoutGoal.ENDURANCE:
      return (
        <Badge variant="secondary" className={className}>
          {formatLabel(goal)}
        </Badge>
      );
    case WorkoutGoal.MOBILITY:
      return (
        <Badge variant="success" className={className}>
          {formatLabel(goal)}
        </Badge>
      );
    default:
      return (
        <Badge variant="default" className={className}>
          {formatLabel(goal || 'General Fitness')}
        </Badge>
      );
  }
};
