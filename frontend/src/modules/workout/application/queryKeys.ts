export const WORKOUT_QUERY_KEYS = {
  all: ['workout'] as const,

  // Exercises
  exercises: () => [...WORKOUT_QUERY_KEYS.all, 'exercises'] as const,
  exerciseList: (filters?: Record<string, unknown>) =>
    [...WORKOUT_QUERY_KEYS.exercises(), 'list', filters] as const,
  exerciseDetail: (id: string) => [...WORKOUT_QUERY_KEYS.exercises(), 'detail', id] as const,

  // Programs
  programs: () => [...WORKOUT_QUERY_KEYS.all, 'programs'] as const,
  programList: (filters?: Record<string, unknown>) =>
    [...WORKOUT_QUERY_KEYS.programs(), 'list', filters] as const,
  programDetail: (id: string) => [...WORKOUT_QUERY_KEYS.programs(), 'detail', id] as const,
  assignedProgram: (coachingRelationshipId?: string) =>
    [...WORKOUT_QUERY_KEYS.programs(), 'assigned', coachingRelationshipId] as const,

  // Completions
  completions: () => [...WORKOUT_QUERY_KEYS.all, 'completions'] as const,
  completionList: (filters?: Record<string, unknown>) =>
    [...WORKOUT_QUERY_KEYS.completions(), 'list', filters] as const,
  completionDetail: (id: string) => [...WORKOUT_QUERY_KEYS.completions(), 'detail', id] as const,
  workoutHistory: (clientId?: string) =>
    [...WORKOUT_QUERY_KEYS.completions(), 'history', clientId] as const,
};
