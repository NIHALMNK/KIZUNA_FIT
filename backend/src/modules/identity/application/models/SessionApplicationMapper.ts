import { RefreshTokenSession } from '../../domain/entities/RefreshTokenSession';
import { SessionModel } from './SessionListResult';

export class SessionApplicationMapper {
  public static toModel(session: RefreshTokenSession): SessionModel {
    return {
      id: session.id,
      deviceInfo: {
        browser: session.deviceInfo.browser,
        operatingSystem: session.deviceInfo.operatingSystem,
        platform: session.deviceInfo.platform,
        deviceName: session.deviceInfo.deviceName,
        userAgent: session.deviceInfo.userAgent
      },
      ipAddress: session.ipAddress,
      expiresAt: session.expiresAt,
      lastUsedAt: session.lastUsedAt
    };
  }
}
