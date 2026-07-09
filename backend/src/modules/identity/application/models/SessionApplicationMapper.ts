import { RefreshTokenSession } from '../../domain/entities/RefreshTokenSession';
import { SessionModel } from './SessionListResult';

export class SessionApplicationMapper {
  public static toModel(session: RefreshTokenSession): SessionModel {
    return {
      id: session.tokenId.value,
      deviceId: session.props.deviceId,
      ipAddress: session.props.ipAddress,
      expiresAt: session.props.expiresAt
    };
  }
}
