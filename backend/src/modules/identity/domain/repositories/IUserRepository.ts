import { User } from '../entities/User';
import { EmailAddress } from '../value-objects/EmailAddress';

export interface IUserRepository {
  save(user: User, session?: unknown): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: EmailAddress): Promise<User | null>;
  exists(email: EmailAddress): Promise<boolean>;
}
