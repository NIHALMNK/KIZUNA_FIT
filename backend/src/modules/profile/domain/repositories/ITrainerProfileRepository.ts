import { TrainerProfile } from '../aggregates/TrainerProfile';
import { SearchTrainerQuery } from '../../application/dto/public/search-trainer.query';

export interface ITrainerProfileRepository {
  findById(id: string): Promise<TrainerProfile | null>;
  findByUserId(userId: string): Promise<TrainerProfile | null>;
  existsByUserId(userId: string): Promise<boolean>;
  save(profile: TrainerProfile): Promise<void>;
  searchTrainers(query: SearchTrainerQuery): Promise<{ profiles: TrainerProfile[]; total: number }>;
  delete(id: string): Promise<void>;
}
