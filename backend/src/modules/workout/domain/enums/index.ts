export enum ExerciseStatus {
  ACTIVE = 'ACTIVE',
  DEPRECATED = 'DEPRECATED',
}

export enum ExerciseOrigin {
  PLATFORM = 'PLATFORM',
  TRAINER = 'TRAINER',
}

export enum WorkoutProgramStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export enum WorkoutCompletionStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  MISSED = 'MISSED',
}

export enum WorkoutGoal {
  MUSCLE_GAIN = 'MUSCLE_GAIN',
  FAT_LOSS = 'FAT_LOSS',
  STRENGTH = 'STRENGTH',
  ENDURANCE = 'ENDURANCE',
  GENERAL_FITNESS = 'GENERAL_FITNESS',
  MOBILITY = 'MOBILITY',
}

export enum ExerciseType {
  MAIN = 'MAIN',
  ACCESSORY = 'ACCESSORY',
  WARM_UP = 'WARM_UP',
  COOL_DOWN = 'COOL_DOWN',
  CARDIO = 'CARDIO',
}

export enum EquipmentType {
  BODYWEIGHT = 'BODYWEIGHT',
  BARBELL = 'BARBELL',
  DUMBBELL = 'DUMBBELL',
  KETTLEBELL = 'KETTLEBELL',
  MACHINE = 'MACHINE',
  CABLE = 'CABLE',
  RESISTANCE_BAND = 'RESISTANCE_BAND',
  MEDICINE_BALL = 'MEDICINE_BALL',
  OTHER = 'OTHER',
}

export enum DifficultyLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export enum PrimaryMuscleGroup {
  CHEST = 'CHEST',
  BACK = 'BACK',
  SHOULDERS = 'SHOULDERS',
  BICEPS = 'BICEPS',
  TRICEPS = 'TRICEPS',
  LEGS = 'LEGS',
  GLUTES = 'GLUTES',
  CORE = 'CORE',
  FULL_BODY = 'FULL_BODY',
}

export enum CompletionSource {
  CLIENT = 'CLIENT',
  TRAINER = 'TRAINER',
  SYSTEM = 'SYSTEM',
}

export enum WorkoutDifficulty {
  VERY_EASY = 'VERY_EASY',
  EASY = 'EASY',
  MODERATE = 'MODERATE',
  HARD = 'HARD',
  VERY_HARD = 'VERY_HARD',
}
