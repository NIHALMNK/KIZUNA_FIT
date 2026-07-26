import { AwilixContainer, asClass } from 'awilix';

// Repositories
import { MongoClientProfileRepository } from './infrastructure/repositories/MongoClientProfileRepository';
import { MongoTrainerProfileRepository } from './infrastructure/repositories/MongoTrainerProfileRepository';

// Gateways
import { CloudinaryStorageGateway } from './infrastructure/gateways/CloudinaryStorageGateway';
import { IdentityFacadeAdapter } from './infrastructure/gateways/IdentityFacadeAdapter';

// Client Use Cases
import {
  CreateClientProfileUseCase,
  GetClientProfileUseCase,
  UpdateClientProfileUseCase,
} from './application/use-cases/client/ClientProfileUseCases';

// Trainer Use Cases
import {
  CreateTrainerProfileUseCase,
  GetTrainerProfileUseCase,
  UpdateTrainerProfileUseCase,
} from './application/use-cases/trainer/TrainerProfileUseCases';

// Avatar Use Cases
import {
  UploadClientAvatarUseCase,
  DeleteClientAvatarUseCase,
  UploadTrainerAvatarUseCase,
  DeleteTrainerAvatarUseCase,
} from './application/use-cases/avatar/AvatarUseCases';

// Availability Use Cases
import {
  GetTrainerAvailabilityUseCase,
  UpdateTrainerAvailabilityUseCase,
} from './application/use-cases/availability/AvailabilityUseCases';

// Certification Use Cases
import {
  AddTrainerCertificationUseCase,
  UpdateTrainerCertificationUseCase,
  DeleteTrainerCertificationUseCase,
} from './application/use-cases/certification/CertificationUseCases';

// Showcase Use Cases
import {
  AddShowcaseItemUseCase,
  GetShowcaseItemsUseCase,
  UpdateShowcaseItemUseCase,
  DeleteShowcaseItemUseCase,
} from './application/use-cases/showcase/ShowcaseUseCases';

// Public Use Cases
import {
  SearchTrainersUseCase,
  GetPublicTrainerProfileUseCase,
} from './application/use-cases/public/PublicProfileUseCases';

// Controllers
import { ClientProfileController } from './presentation/controllers/ClientProfileController';
import { TrainerProfileController } from './presentation/controllers/TrainerProfileController';

export const registerProfileDependencies = (container: AwilixContainer): void => {
  // Repositories & Gateways (Scoped)
  container.register({
    clientProfileRepo: asClass(MongoClientProfileRepository).scoped(),
    trainerProfileRepo: asClass(MongoTrainerProfileRepository).scoped(),
    storageGateway: asClass(CloudinaryStorageGateway).scoped(),
    identityGateway: asClass(IdentityFacadeAdapter).scoped(),
  });

  // Client Use Cases
  container.register({
    createClientProfileUseCase: asClass(CreateClientProfileUseCase).scoped(),
    getClientProfileUseCase: asClass(GetClientProfileUseCase).scoped(),
    updateClientProfileUseCase: asClass(UpdateClientProfileUseCase).scoped(),
  });

  // Trainer Use Cases
  container.register({
    createTrainerProfileUseCase: asClass(CreateTrainerProfileUseCase).scoped(),
    getTrainerProfileUseCase: asClass(GetTrainerProfileUseCase).scoped(),
    updateTrainerProfileUseCase: asClass(UpdateTrainerProfileUseCase).scoped(),
  });

  // Avatar Use Cases
  container.register({
    uploadClientAvatarUseCase: asClass(UploadClientAvatarUseCase).scoped(),
    deleteClientAvatarUseCase: asClass(DeleteClientAvatarUseCase).scoped(),
    uploadTrainerAvatarUseCase: asClass(UploadTrainerAvatarUseCase).scoped(),
    deleteTrainerAvatarUseCase: asClass(DeleteTrainerAvatarUseCase).scoped(),
  });

  // Availability Use Cases
  container.register({
    getTrainerAvailabilityUseCase: asClass(GetTrainerAvailabilityUseCase).scoped(),
    updateTrainerAvailabilityUseCase: asClass(UpdateTrainerAvailabilityUseCase).scoped(),
  });

  // Certification Use Cases
  container.register({
    addTrainerCertificationUseCase: asClass(AddTrainerCertificationUseCase).scoped(),
    updateTrainerCertificationUseCase: asClass(UpdateTrainerCertificationUseCase).scoped(),
    deleteTrainerCertificationUseCase: asClass(DeleteTrainerCertificationUseCase).scoped(),
  });

  // Showcase Use Cases
  container.register({
    addShowcaseItemUseCase: asClass(AddShowcaseItemUseCase).scoped(),
    getShowcaseItemsUseCase: asClass(GetShowcaseItemsUseCase).scoped(),
    updateShowcaseItemUseCase: asClass(UpdateShowcaseItemUseCase).scoped(),
    deleteShowcaseItemUseCase: asClass(DeleteShowcaseItemUseCase).scoped(),
  });

  // Public Use Cases
  container.register({
    searchTrainersUseCase: asClass(SearchTrainersUseCase).scoped(),
    getPublicTrainerProfileUseCase: asClass(GetPublicTrainerProfileUseCase).scoped(),
  });

  // Presentation Controllers
  container.register({
    clientProfileController: asClass(ClientProfileController).scoped(),
    trainerProfileController: asClass(TrainerProfileController).scoped(),
  });
};
