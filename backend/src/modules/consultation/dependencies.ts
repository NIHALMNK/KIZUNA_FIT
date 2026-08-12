import { AwilixContainer, asClass } from 'awilix';

// Infrastructure Repository
import { MongoConsultationRepository } from './infrastructure/persistence/mongoose/repositories/mongo-consultation.repository';

// Application Use Cases
import { CreateConsultationUseCase } from './application/use-cases/create-consultation.use-case';
import { BookConsultationSlotUseCase } from './application/use-cases/book-consultation-slot.use-case';
import { ScheduleConsultationUseCase } from './application/use-cases/schedule-consultation.use-case';
import { ConfirmConsultationScheduleUseCase } from './application/use-cases/confirm-consultation-schedule.use-case';
import { CancelConsultationUseCase } from './application/use-cases/cancel-consultation.use-case';
import { CompleteConsultationUseCase } from './application/use-cases/complete-consultation.use-case';
import { MarkConsultationNoShowUseCase } from './application/use-cases/mark-consultation-no-show.use-case';
import { GetConsultationUseCase } from './application/use-cases/get-consultation.use-case';
import { GetConsultationByPipelineUseCase } from './application/use-cases/get-consultation-by-pipeline.use-case';
import { GetUpcomingConsultationsUseCase } from './application/use-cases/get-upcoming-consultations.use-case';
import { GetConsultationHistoryUseCase } from './application/use-cases/get-consultation-history.use-case';
import { GetConsultationByRoomIdUseCase } from './application/use-cases/get-consultation-by-room-id.use-case';

export const registerConsultationDependencies = (container: AwilixContainer): void => {
  // Repository (Scoped)
  container.register({
    consultationRepo: asClass(MongoConsultationRepository).scoped(),
  });

  // Application Use Cases (Scoped)
  container.register({
    createConsultationUseCase: asClass(CreateConsultationUseCase).scoped(),
    bookConsultationSlotUseCase: asClass(BookConsultationSlotUseCase).scoped(),
    scheduleConsultationUseCase: asClass(ScheduleConsultationUseCase).scoped(),
    confirmConsultationScheduleUseCase: asClass(ConfirmConsultationScheduleUseCase).scoped(),
    cancelConsultationUseCase: asClass(CancelConsultationUseCase).scoped(),
    completeConsultationUseCase: asClass(CompleteConsultationUseCase).scoped(),
    markConsultationNoShowUseCase: asClass(MarkConsultationNoShowUseCase).scoped(),
    getConsultationUseCase: asClass(GetConsultationUseCase).scoped(),
    getConsultationByPipelineUseCase: asClass(GetConsultationByPipelineUseCase).scoped(),
    getUpcomingConsultationsUseCase: asClass(GetUpcomingConsultationsUseCase).scoped(),
    getConsultationHistoryUseCase: asClass(GetConsultationHistoryUseCase).scoped(),
    getConsultationByRoomIdUseCase: asClass(GetConsultationByRoomIdUseCase).scoped(),
  });
};
