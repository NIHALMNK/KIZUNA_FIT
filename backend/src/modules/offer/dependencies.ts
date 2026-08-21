import { AwilixContainer, asClass } from 'awilix';

// Infrastructure Repository
import { MongoCoachingOfferRepository } from './infrastructure/persistence/mongoose/repositories/mongo-coaching-offer.repository';

// Application Use Cases
import { CreateOfferUseCase } from './application/use-cases/create-offer.use-case';
import { SendOfferUseCase } from './application/use-cases/send-offer.use-case';
import { AcceptOfferUseCase } from './application/use-cases/accept-offer.use-case';
import { DeclineOfferUseCase } from './application/use-cases/decline-offer.use-case';
import { ExpireOfferUseCase } from './application/use-cases/expire-offer.use-case';
import { GetOfferUseCase } from './application/use-cases/get-offer.use-case';
import { GetOfferByConsultationUseCase } from './application/use-cases/get-offer-by-consultation.use-case';
import { GetOfferByPipelineUseCase } from './application/use-cases/get-offer-by-pipeline.use-case';
import { ListSentOffersUseCase } from './application/use-cases/list-sent-offers.use-case';
import { ListReceivedOffersUseCase } from './application/use-cases/list-received-offers.use-case';

// Presentation Controller
import { OfferController } from './presentation/controllers/offer.controller';

export const registerOfferDependencies = (container: AwilixContainer): void => {
  // Repository (Scoped)
  container.register({
    offerRepo: asClass(MongoCoachingOfferRepository).scoped(),
  });

  // Application Use Cases (Scoped)
  container.register({
    createOfferUseCase: asClass(CreateOfferUseCase).scoped(),
    sendOfferUseCase: asClass(SendOfferUseCase).scoped(),
    acceptOfferUseCase: asClass(AcceptOfferUseCase).scoped(),
    declineOfferUseCase: asClass(DeclineOfferUseCase).scoped(),
    expireOfferUseCase: asClass(ExpireOfferUseCase).scoped(),
    getOfferUseCase: asClass(GetOfferUseCase).scoped(),
    getOfferByConsultationUseCase: asClass(GetOfferByConsultationUseCase).scoped(),
    getOfferByPipelineUseCase: asClass(GetOfferByPipelineUseCase).scoped(),
    listSentOffersUseCase: asClass(ListSentOffersUseCase).scoped(),
    listReceivedOffersUseCase: asClass(ListReceivedOffersUseCase).scoped(),
  });

  // Presentation Controller (Scoped)
  container.register({
    offerController: asClass(OfferController).scoped(),
  });
};
