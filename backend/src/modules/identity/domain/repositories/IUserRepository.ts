import { User } from '../entities/User';

export interface IUserRepository {
  save(user: User, session?: unknown): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  existsByEmail(email: string): Promise<boolean>;
}
