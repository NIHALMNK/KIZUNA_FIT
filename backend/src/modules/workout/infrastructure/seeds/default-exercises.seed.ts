import {
  DifficultyLevel,
  EquipmentType,
  ExerciseStatus,
  PrimaryMuscleGroup,
} from '../../domain/enums';
import { ExerciseProps } from '../../domain/aggregates/exercise.aggregate';

export const DEFAULT_EXERCISES_SEED: Omit<
  ExerciseProps,
  'slug' | 'origin' | 'createdByTrainerId' | 'createdAt' | 'updatedAt'
>[] = [
  {
    name: 'Barbell Bench Press',
    category: 'Chest',
    primaryMuscleGroup: PrimaryMuscleGroup.CHEST,
    secondaryMuscleGroups: [PrimaryMuscleGroup.TRICEPS, PrimaryMuscleGroup.SHOULDERS],
    equipment: EquipmentType.BARBELL,
    difficulty: DifficultyLevel.INTERMEDIATE,
    instructions: [
      { step: 1, instruction: 'Lie flat on the bench with eyes under the barbell.' },
      {
        step: 2,
        instruction: 'Grip the bar slightly wider than shoulder-width, plant feet firmly.',
      },
      {
        step: 3,
        instruction: 'Lower the bar with control to mid-chest while tucking elbows slightly.',
      },
      { step: 4, instruction: 'Press forcefully back up to full lockout over chest.' },
    ],
    media: {
      thumbnailUrl:
        'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&auto=format&fit=crop&q=60',
      images: [],
    },
    caloriesPerMinute: 7,
    status: ExerciseStatus.ACTIVE,
  },
  {
    name: 'Barbell Back Squat',
    category: 'Legs',
    primaryMuscleGroup: PrimaryMuscleGroup.LEGS,
    secondaryMuscleGroups: [PrimaryMuscleGroup.GLUTES, PrimaryMuscleGroup.CORE],
    equipment: EquipmentType.BARBELL,
    difficulty: DifficultyLevel.INTERMEDIATE,
    instructions: [
      { step: 1, instruction: 'Place barbell across upper traps, brace core and unrack.' },
      { step: 2, instruction: 'Set feet shoulder-width apart with toes flared out 15-30 degrees.' },
      {
        step: 3,
        instruction:
          'Hinge hips and bend knees simultaneously, descending until thighs are parallel to floor.',
      },
      { step: 4, instruction: 'Drive through mid-foot to return to standing lockout.' },
    ],
    media: {
      thumbnailUrl:
        'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&auto=format&fit=crop&q=60',
      images: [],
    },
    caloriesPerMinute: 9,
    status: ExerciseStatus.ACTIVE,
  },
  {
    name: 'Conventional Barbell Deadlift',
    category: 'Back',
    primaryMuscleGroup: PrimaryMuscleGroup.BACK,
    secondaryMuscleGroups: [
      PrimaryMuscleGroup.LEGS,
      PrimaryMuscleGroup.GLUTES,
      PrimaryMuscleGroup.CORE,
    ],
    equipment: EquipmentType.BARBELL,
    difficulty: DifficultyLevel.ADVANCED,
    instructions: [
      { step: 1, instruction: 'Stand with mid-foot directly under the bar, feet hip-width apart.' },
      { step: 2, instruction: 'Hinge hips and grip the bar just outside your shins.' },
      { step: 3, instruction: 'Pull chest up, flatten spine, and pull slack out of the bar.' },
      {
        step: 4,
        instruction: 'Drive through floor, extending hips and knees together into full lockout.',
      },
    ],
    media: {
      thumbnailUrl:
        'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=500&auto=format&fit=crop&q=60',
      images: [],
    },
    caloriesPerMinute: 10,
    status: ExerciseStatus.ACTIVE,
  },
  {
    name: 'Overhead Barbell Shoulder Press',
    category: 'Shoulders',
    primaryMuscleGroup: PrimaryMuscleGroup.SHOULDERS,
    secondaryMuscleGroups: [PrimaryMuscleGroup.TRICEPS, PrimaryMuscleGroup.CORE],
    equipment: EquipmentType.BARBELL,
    difficulty: DifficultyLevel.INTERMEDIATE,
    instructions: [
      { step: 1, instruction: 'Hold barbell at clavicle level with forearms vertical.' },
      { step: 2, instruction: 'Squeeze glutes and brace core tightly.' },
      {
        step: 3,
        instruction: 'Press bar straight upward, clearing your head by tilting chin back slightly.',
      },
      { step: 4, instruction: 'Lock out overhead with head pushed forward through arms.' },
    ],
    media: {
      thumbnailUrl:
        'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=500&auto=format&fit=crop&q=60',
      images: [],
    },
    caloriesPerMinute: 6,
    status: ExerciseStatus.ACTIVE,
  },
  {
    name: 'Pull-Up',
    category: 'Back',
    primaryMuscleGroup: PrimaryMuscleGroup.BACK,
    secondaryMuscleGroups: [PrimaryMuscleGroup.BICEPS, PrimaryMuscleGroup.CORE],
    equipment: EquipmentType.BODYWEIGHT,
    difficulty: DifficultyLevel.INTERMEDIATE,
    instructions: [
      { step: 1, instruction: 'Grip pull-up bar with overhand grip wider than shoulder-width.' },
      { step: 2, instruction: 'Hang with arms fully extended and engage scapula.' },
      { step: 3, instruction: 'Pull elbows down toward ribs until chin clears the bar.' },
      { step: 4, instruction: 'Lower slowly back down to full dead hang.' },
    ],
    media: {
      thumbnailUrl:
        'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=500&auto=format&fit=crop&q=60',
      images: [],
    },
    caloriesPerMinute: 8,
    status: ExerciseStatus.ACTIVE,
  },
  {
    name: 'Dumbbell Romanian Deadlift',
    category: 'Legs',
    primaryMuscleGroup: PrimaryMuscleGroup.LEGS,
    secondaryMuscleGroups: [PrimaryMuscleGroup.GLUTES, PrimaryMuscleGroup.BACK],
    equipment: EquipmentType.DUMBBELL,
    difficulty: DifficultyLevel.BEGINNER,
    instructions: [
      { step: 1, instruction: 'Hold a dumbbell in each hand in front of your thighs.' },
      { step: 2, instruction: 'Maintain soft knee bend and push hips straight backward.' },
      { step: 3, instruction: 'Lower dumbbells along shins until hamstring stretch is felt.' },
      { step: 4, instruction: 'Squeeze glutes and drive hips forward to return to standing.' },
    ],
    media: {
      thumbnailUrl:
        'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&auto=format&fit=crop&q=60',
      images: [],
    },
    caloriesPerMinute: 6,
    status: ExerciseStatus.ACTIVE,
  },
  {
    name: 'Dumbbell Lateral Raise',
    category: 'Shoulders',
    primaryMuscleGroup: PrimaryMuscleGroup.SHOULDERS,
    secondaryMuscleGroups: [],
    equipment: EquipmentType.DUMBBELL,
    difficulty: DifficultyLevel.BEGINNER,
    instructions: [
      { step: 1, instruction: 'Stand tall holding light dumbbells at sides with neutral grip.' },
      {
        step: 2,
        instruction: 'Raise arms out to sides in scaption plane until parallel with floor.',
      },
      { step: 3, instruction: 'Pause momentarily at shoulder height without shrugging traps.' },
      { step: 4, instruction: 'Lower dumbbells slowly back to starting position.' },
    ],
    media: {
      thumbnailUrl:
        'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&auto=format&fit=crop&q=60',
      images: [],
    },
    caloriesPerMinute: 5,
    status: ExerciseStatus.ACTIVE,
  },
  {
    name: 'Incline Dumbbell Bicep Curl',
    category: 'Arms',
    primaryMuscleGroup: PrimaryMuscleGroup.BICEPS,
    secondaryMuscleGroups: [],
    equipment: EquipmentType.DUMBBELL,
    difficulty: DifficultyLevel.BEGINNER,
    instructions: [
      { step: 1, instruction: 'Sit on an incline bench set to 45-60 degrees holding dumbbells.' },
      { step: 2, instruction: 'Let arms hang straight down with palms facing forward.' },
      { step: 3, instruction: 'Curl weights up while keeping upper arms fixed in place.' },
      { step: 4, instruction: 'Squeeze biceps at top and lower under control.' },
    ],
    media: {
      thumbnailUrl:
        'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&auto=format&fit=crop&q=60',
      images: [],
    },
    caloriesPerMinute: 5,
    status: ExerciseStatus.ACTIVE,
  },
  {
    name: 'Cable Tricep Pushdown',
    category: 'Arms',
    primaryMuscleGroup: PrimaryMuscleGroup.TRICEPS,
    secondaryMuscleGroups: [],
    equipment: EquipmentType.CABLE,
    difficulty: DifficultyLevel.BEGINNER,
    instructions: [
      { step: 1, instruction: 'Attach straight bar or rope to high cable pulley.' },
      { step: 2, instruction: 'Tuck elbows to ribs and grip attachment firmly.' },
      { step: 3, instruction: 'Extend arms downwards until triceps are fully contracted.' },
      { step: 4, instruction: 'Allow attachment to rise back up to chest height with control.' },
    ],
    media: {
      thumbnailUrl:
        'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&auto=format&fit=crop&q=60',
      images: [],
    },
    caloriesPerMinute: 5,
    status: ExerciseStatus.ACTIVE,
  },
  {
    name: 'Plank',
    category: 'Core',
    primaryMuscleGroup: PrimaryMuscleGroup.CORE,
    secondaryMuscleGroups: [PrimaryMuscleGroup.SHOULDERS, PrimaryMuscleGroup.GLUTES],
    equipment: EquipmentType.BODYWEIGHT,
    difficulty: DifficultyLevel.BEGINNER,
    instructions: [
      { step: 1, instruction: 'Place forearms on floor with elbows directly under shoulders.' },
      {
        step: 2,
        instruction: 'Extend legs back onto toes, creating a straight line from head to heels.',
      },
      { step: 3, instruction: 'Brace abs, squeeze glutes, and avoid sagging or arching hips.' },
      { step: 4, instruction: 'Hold position steadily while breathing normally.' },
    ],
    media: {
      thumbnailUrl:
        'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=500&auto=format&fit=crop&q=60',
      images: [],
    },
    caloriesPerMinute: 4,
    status: ExerciseStatus.ACTIVE,
  },
];
