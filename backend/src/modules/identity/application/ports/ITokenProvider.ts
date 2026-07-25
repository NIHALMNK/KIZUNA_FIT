import { User } from '../../domain/entities/User';

export interface ITokenProvider {
  generateAccessToken(user: User): Promise<string>;
  generateRefreshToken(): Promise<{ token: string, hash: string }>;
}
