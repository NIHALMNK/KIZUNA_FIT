import { httpClient } from '../../../../infrastructure/api/HttpClient';
import { ApiError } from '../../../../shared/exceptions/ApiError';
import {
  CoachingRelationshipSummary,
  ConsultationItem,
  AssignedWorkoutProgram,
  AssignedNutritionPlan,
  PendingCoachingOffer,
  CoachingEvaluationSummary,
} from '../../domain/types/clientDashboard.types';

export class ClientDashboardApi {
  /**
   * Fetch active coaching relationships for authenticated client
   * GET /api/v1/coaching-relationships/active
   */
  public async getActiveCoaching(): Promise<CoachingRelationshipSummary[]> {
    try {
      const res = await httpClient.get<any>('/coaching-relationships/active');
      const rawList = Array.isArray(res)
        ? res
        : Array.isArray(res?.relationships)
          ? res.relationships
          : res && typeof res === 'object' && ('relationshipId' in res || 'id' in res)
            ? [res]
            : [];

      return rawList.map((r: any) => ({
        id: r.relationshipId || r.id,
        clientId: r.clientId,
        trainerId: r.trainerId,
        trainerName: r.trainer?.fullName || r.trainerName || 'Assigned Coach',
        trainerAvatarUrl: r.trainer?.avatarUrl || r.trainerAvatarUrl,
        programTitle: r.trainer?.specialization
          ? `${r.trainer.specialization} Coaching`
          : r.planType
            ? `${r.planType} Coaching Plan`
            : r.programTitle || '1-on-1 Personalized Coaching',
        status: r.status,
        startedAt: r.startedAt || r.timeline?.activatedAt || r.createdAt,
        endsAt: r.endsAt,
        createdAt: r.createdAt,
      }));
    } catch (error) {
      if (error instanceof ApiError && (error.status === 404 || error.status === 200)) {
        return [];
      }
      throw error;
    }
  }

  /**
   * Fetch upcoming consultations for authenticated client
   * GET /api/v1/consultations/upcoming
   */
  public async getUpcomingConsultations(): Promise<ConsultationItem[]> {
    try {
      const res = await httpClient.get<any>('/consultations/upcoming');
      if (Array.isArray(res)) return res;
      if (res?.consultations && Array.isArray(res.consultations)) return res.consultations;
      return [];
    } catch (error) {
      if (error instanceof ApiError && (error.status === 404 || error.status === 200)) {
        return [];
      }
      throw error;
    }
  }

  /**
   * Fetch pending coaching offers awaiting client review
   * GET /api/v1/offers/pending
   */
  public async getPendingOffers(): Promise<PendingCoachingOffer[]> {
    try {
      const res = await httpClient.get<any>('/offers/pending');
      if (Array.isArray(res)) return res;
      if (res?.offers && Array.isArray(res.offers)) return res.offers;
      return [];
    } catch (error) {
      if (error instanceof ApiError && (error.status === 404 || error.status === 200)) {
        return [];
      }
      throw error;
    }
  }

  /**
   * Fetch assigned workout programs
   * GET /api/v1/workout-programs/assigned
   */
  public async getAssignedWorkouts(): Promise<AssignedWorkoutProgram[]> {
    try {
      const res = await httpClient.get<any>('/workout-programs/assigned');
      if (Array.isArray(res)) return res;
      if (res?.programs && Array.isArray(res.programs)) return res.programs;
      return [];
    } catch (error) {
      if (error instanceof ApiError && (error.status === 404 || error.status === 200)) {
        return [];
      }
      throw error;
    }
  }

  /**
   * Fetch assigned nutrition plans
   * GET /api/v1/nutrition-plans/assigned
   */
  public async getAssignedNutrition(): Promise<AssignedNutritionPlan[]> {
    try {
      const res = await httpClient.get<any>('/nutrition-plans/assigned');
      if (Array.isArray(res)) return res;
      if (res?.plans && Array.isArray(res.plans)) return res.plans;
      return [];
    } catch (error) {
      if (error instanceof ApiError && (error.status === 404 || error.status === 200)) {
        return [];
      }
      throw error;
    }
  }

  /**
   * Fetch coaching evaluations
   * GET /api/v1/coaching-evaluations
   */
  public async getCoachingEvaluations(): Promise<CoachingEvaluationSummary[]> {
    try {
      const res = await httpClient.get<any>('/coaching-evaluations');
      if (Array.isArray(res)) return res;
      if (res?.evaluations && Array.isArray(res.evaluations)) return res.evaluations;
      return [];
    } catch (error) {
      if (error instanceof ApiError && (error.status === 404 || error.status === 200)) {
        return [];
      }
      throw error;
    }
  }
}

export const clientDashboardApi = new ClientDashboardApi();
