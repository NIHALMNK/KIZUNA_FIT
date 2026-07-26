import { ClientProfile } from '../aggregates/ClientProfile';

export interface IClientProfileRepository {
  findById(id: string): Promise<ClientProfile | null>;
  findByUserId(userId: string): Promise<ClientProfile | null>;
  existsByUserId(userId: string): Promise<boolean>;
  save(profile: ClientProfile): Promise<void>;
  delete(id: string): Promise<void>;
}
