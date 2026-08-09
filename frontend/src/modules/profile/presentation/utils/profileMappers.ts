export const formatGender = (gender?: string | null): string => {
  if (!gender) return 'Not specified';
  const g = gender.toUpperCase();
  if (g === 'MALE') return 'Male';
  if (g === 'FEMALE') return 'Female';
  if (g === 'OTHER') return 'Other';
  if (g === 'PREFER_NOT_TO_SAY') return 'Prefer not to say';
  return gender;
};

export const formatActivityLevel = (level?: string | null): string => {
  if (!level) return 'Not specified';
  const l = level.toUpperCase();
  if (l === 'SEDENTARY') return 'Sedentary (Little or no exercise)';
  if (l === 'LIGHTLY_ACTIVE') return 'Lightly Active (1-3 days/week)';
  if (l === 'MODERATELY_ACTIVE') return 'Moderately Active (3-5 days/week)';
  if (l === 'VERY_ACTIVE') return 'Very Active (6-7 days/week)';
  if (l === 'EXTREMELY_ACTIVE') return 'Extremely Active (Physical job & training)';
  return level;
};

export const formatExperienceLevel = (level?: string | null): string => {
  if (!level) return 'Not specified';
  const l = level.toUpperCase();
  if (l === 'BEGINNER') return 'Beginner (< 1 year)';
  if (l === 'INTERMEDIATE') return 'Intermediate (1-3 years)';
  if (l === 'ADVANCED') return 'Advanced (3+ years)';
  return level;
};

export const formatFitnessGoal = (goal?: string | null): string => {
  if (!goal) return 'Not specified';
  const g = goal.toUpperCase();
  if (g === 'WEIGHT_LOSS') return 'Weight Loss';
  if (g === 'MUSCLE_GAIN') return 'Muscle Gain';
  if (g === 'ENDURANCE') return 'Endurance Training';
  if (g === 'STRENGTH') return 'Strength & Power';
  if (g === 'GENERAL_FITNESS') return 'General Health & Fitness';
  if (g === 'FLEXIBILITY') return 'Flexibility & Mobility';
  return goal;
};
