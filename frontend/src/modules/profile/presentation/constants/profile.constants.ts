import {
  Gender,
  WeightUnit,
  HeightUnit,
  DietaryPreference,
  FitnessGoal,
  ExperienceLevel,
  ActivityLevel,
  TrainerAvailabilityStatus,
  TrainerSpecialization,
  ShowcaseType,
} from '../../domain/enums/profile.enums';

export const GENDER_OPTIONS = [
  { label: 'Male', value: Gender.MALE },
  { label: 'Female', value: Gender.FEMALE },
  { label: 'Other', value: Gender.OTHER },
  { label: 'Prefer Not to Say', value: Gender.PREFER_NOT_TO_SAY },
];

export const WEIGHT_UNIT_OPTIONS = [
  { label: 'Kilograms (kg)', value: WeightUnit.KG },
  { label: 'Pounds (lbs)', value: WeightUnit.LBS },
];

export const HEIGHT_UNIT_OPTIONS = [
  { label: 'Centimeters (cm)', value: HeightUnit.CM },
  { label: 'Inches (in)', value: HeightUnit.INCHES },
  { label: 'Feet & Inches (ft/in)', value: HeightUnit.FT_IN },
];

export const DIETARY_PREFERENCE_OPTIONS = [
  { label: 'None', value: DietaryPreference.NONE },
  { label: 'Vegetarian', value: DietaryPreference.VEGETARIAN },
  { label: 'Vegan', value: DietaryPreference.VEGAN },
  { label: 'Keto', value: DietaryPreference.KETO },
  { label: 'Paleo', value: DietaryPreference.PALEO },
  { label: 'Pescatarian', value: DietaryPreference.PESCATARIAN },
  { label: 'Halal', value: DietaryPreference.HALAL },
  { label: 'Kosher', value: DietaryPreference.KOSHER },
];

export const FITNESS_GOAL_OPTIONS = [
  { label: 'Weight Loss', value: FitnessGoal.WEIGHT_LOSS },
  { label: 'Muscle Gain', value: FitnessGoal.MUSCLE_GAIN },
  { label: 'Endurance', value: FitnessGoal.ENDURANCE },
  { label: 'Flexibility', value: FitnessGoal.FLEXIBILITY },
  { label: 'General Fitness', value: FitnessGoal.GENERAL_FITNESS },
  { label: 'Strength', value: FitnessGoal.STRENGTH },
  { label: 'Rehabilitation', value: FitnessGoal.REHABILITATION },
];

export const EXPERIENCE_LEVEL_OPTIONS = [
  { label: 'Beginner', value: ExperienceLevel.BEGINNER },
  { label: 'Intermediate', value: ExperienceLevel.INTERMEDIATE },
  { label: 'Advanced', value: ExperienceLevel.ADVANCED },
];

export const ACTIVITY_LEVEL_OPTIONS = [
  { label: 'Sedentary', value: ActivityLevel.SEDENTARY },
  { label: 'Lightly Active', value: ActivityLevel.LIGHTLY_ACTIVE },
  { label: 'Moderately Active', value: ActivityLevel.MODERATELY_ACTIVE },
  { label: 'Very Active', value: ActivityLevel.VERY_ACTIVE },
  { label: 'Extra Active', value: ActivityLevel.EXTRA_ACTIVE },
];

export const AVAILABILITY_STATUS_OPTIONS = [
  { label: 'Available', value: TrainerAvailabilityStatus.AVAILABLE },
  { label: 'Busy', value: TrainerAvailabilityStatus.BUSY },
  { label: 'Offline', value: TrainerAvailabilityStatus.OFFLINE },
];

export const SPECIALIZATION_OPTIONS = [
  { label: 'Weight Loss', value: TrainerSpecialization.WEIGHT_LOSS },
  { label: 'Muscle Building', value: TrainerSpecialization.MUSCLE_BUILDING },
  { label: 'Strength Training', value: TrainerSpecialization.STRENGTH_TRAINING },
  { label: 'Yoga', value: TrainerSpecialization.YOGA },
  { label: 'Pilates', value: TrainerSpecialization.PILATES },
  { label: 'HIIT', value: TrainerSpecialization.HIIT },
  { label: 'Calisthenics', value: TrainerSpecialization.CALISTHENICS },
  { label: 'Nutrition', value: TrainerSpecialization.NUTRITION },
  { label: 'Sports Performance', value: TrainerSpecialization.SPORTS_PERFORMANCE },
  { label: 'Rehabilitation', value: TrainerSpecialization.REHABILITATION },
];

export const SHOWCASE_TYPE_OPTIONS = [
  { label: 'Certificate', value: ShowcaseType.CERTIFICATE },
  { label: 'Transformation', value: ShowcaseType.TRANSFORMATION },
  { label: 'Video', value: ShowcaseType.VIDEO },
  { label: 'Award', value: ShowcaseType.AWARD },
  { label: 'Other', value: ShowcaseType.OTHER },
];

export const DAYS_OF_WEEK = [
  { dayOfWeek: 0, label: 'Sunday' },
  { dayOfWeek: 1, label: 'Monday' },
  { dayOfWeek: 2, label: 'Tuesday' },
  { dayOfWeek: 3, label: 'Wednesday' },
  { dayOfWeek: 4, label: 'Thursday' },
  { dayOfWeek: 5, label: 'Friday' },
  { dayOfWeek: 6, label: 'Saturday' },
];

export const THEME_COLORS = {
  CLIENT: {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    primaryLight: 'bg-blue-100 text-blue-800',
    border: 'border-blue-500 focus:border-blue-600',
    ring: 'focus:ring-blue-500',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  TRAINER: {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    primaryLight: 'bg-emerald-100 text-emerald-800',
    border: 'border-emerald-500 focus:border-emerald-600',
    ring: 'focus:ring-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
};
