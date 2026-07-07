import { User } from '../../domain/entities/User';
import { RefreshTokenSession } from '../../domain/entities/RefreshTokenSession';

export interface ITokenProvider {
  generateAccessToken(user: User): Promise<string>;
  generateRefreshToken(session: RefreshTokenSession): Promise<string>;
}
