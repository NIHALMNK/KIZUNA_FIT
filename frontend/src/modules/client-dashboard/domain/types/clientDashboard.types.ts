export interface CoachingRelationshipSummary {
  id: string;
  clientId: string;
  trainerId: string;
  trainerName?: string;
  trainerAvatarUrl?: string;
  programTitle?: string;
  status: 'ACTIVE' | 'PENDING' | 'COMPLETED' | 'PAUSED' | 'CANCELLED';
  startedAt?: string;
  endsAt?: string;
  createdAt?: string;
}

export interface ActiveCoachingResponse {
  relationships: CoachingRelationshipSummary[];
}

export interface ConsultationItem {
  id: string;
  clientId: string;
  trainerId: string;
  trainerName?: string;
  scheduledAt: string;
  durationMinutes: number;
  meetingUrl?: string;
  meetingMode?: 'VIDEO' | 'AUDIO';
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}

export interface UpcomingConsultationsResponse {
  consultations: ConsultationItem[];
}

export interface AssignedWorkoutProgram {
  id: string;
  title: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  assignedAt: string;
  totalWeeks?: number;
}

export interface AssignedWorkoutsResponse {
  programs: AssignedWorkoutProgram[];
}

export interface AssignedNutritionPlan {
  id: string;
  title: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  assignedAt: string;
}

export interface AssignedNutritionResponse {
  plans: AssignedNutritionPlan[];
}

export interface PendingCoachingOffer {
  id: string;
  trainerId: string;
  trainerName?: string;
  title: string;
  price: number;
  currency?: string;
  durationWeeks: number;
  expiresAt?: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';
}

export interface PendingOffersResponse {
  offers: PendingCoachingOffer[];
}

export interface CoachingEvaluationSummary {
  id: string;
  evaluatedAt: string;
  summaryText?: string;
  nextSteps?: string;
}

export interface CoachingEvaluationsResponse {
  evaluations: CoachingEvaluationSummary[];
}
