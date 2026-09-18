import { AwilixContainer, asClass } from 'awilix';

// Infrastructure Repositories & Gateways & Subscribers
import { MongoAcquisitionPipelineRepository } from './infrastructure/persistence/mongoose/repositories/mongo-acquisition-pipeline.repository';
import { ProfileGatewayAdapter } from './infrastructure/gateways/profile-gateway.adapter';
import { CoachingGatewayAdapter } from './infrastructure/gateways/coaching-gateway.adapter';
import { MarketplaceConsultationSubscriber } from './infrastructure/subscribers/marketplace-consultation.subscriber';
import { MarketplaceOfferSubscriber } from './infrastructure/subscribers/marketplace-offer.subscriber';
import { MarketplacePaymentSubscriber } from './infrastructure/subscribers/marketplace-payment.subscriber';

// Application Use Cases
import { CreateTrainerRequestUseCase } from './application/use-cases/create-trainer-request/create-trainer-request.use-case';
import { GetTrainerRequestsUseCase } from './application/use-cases/get-trainer-requests/get-trainer-requests.use-case';
import { GetTrainerRequestUseCase } from './application/use-cases/get-trainer-request/get-trainer-request.use-case';
import { GetPendingTrainerRequestsUseCase } from './application/use-cases/get-pending-trainer-requests/get-pending-trainer-requests.use-case';
import { GetTrainerRequestHistoryUseCase } from './application/use-cases/get-trainer-request-history/get-trainer-request-history.use-case';
import { AcceptTrainerRequestUseCase } from './application/use-cases/accept-trainer-request/accept-trainer-request.use-case';
import { RejectTrainerRequestUseCase } from './application/use-cases/reject-trainer-request/reject-trainer-request.use-case';
import { WithdrawTrainerRequestUseCase } from './application/use-cases/withdraw-trainer-request/withdraw-trainer-request.use-case';
import { CloseTrainerRequestUseCase } from './application/use-cases/close-trainer-request/close-trainer-request.use-case';
import { SwitchTrainerUseCase } from './application/use-cases/switch-trainer/switch-trainer.use-case';

// Presentation Controller
import { TrainerRequestController } from './presentation/controllers/trainer-request.controller';

export const registerMarketplaceDependencies = (container: AwilixContainer): void => {
  // Repositories & Gateways (Scoped)
  container.register({
    pipelineRepo: asClass(MongoAcquisitionPipelineRepository).scoped(),
    profileGateway: asClass(ProfileGatewayAdapter).scoped(),
    coachingGateway: asClass(CoachingGatewayAdapter).scoped(),
    marketplaceConsultationSubscriber: asClass(MarketplaceConsultationSubscriber).singleton(),
    marketplaceOfferSubscriber: asClass(MarketplaceOfferSubscriber).singleton(),
    marketplacePaymentSubscriber: asClass(MarketplacePaymentSubscriber).singleton(),
  });

  // Application Use Cases (Scoped)
  container.register({
    createTrainerRequestUseCase: asClass(CreateTrainerRequestUseCase).scoped(),
    getTrainerRequestsUseCase: asClass(GetTrainerRequestsUseCase).scoped(),
    getTrainerRequestUseCase: asClass(GetTrainerRequestUseCase).scoped(),
    getPendingTrainerRequestsUseCase: asClass(GetPendingTrainerRequestsUseCase).scoped(),
    getTrainerRequestHistoryUseCase: asClass(GetTrainerRequestHistoryUseCase).scoped(),
    acceptTrainerRequestUseCase: asClass(AcceptTrainerRequestUseCase).scoped(),
    rejectTrainerRequestUseCase: asClass(RejectTrainerRequestUseCase).scoped(),
    withdrawTrainerRequestUseCase: asClass(WithdrawTrainerRequestUseCase).scoped(),
    closeTrainerRequestUseCase: asClass(CloseTrainerRequestUseCase).scoped(),
    switchTrainerUseCase: asClass(SwitchTrainerUseCase).scoped(),
  });

  // Presentation Controller (Scoped)
  container.register({
    trainerRequestController: asClass(TrainerRequestController).scoped(),
  });
};
