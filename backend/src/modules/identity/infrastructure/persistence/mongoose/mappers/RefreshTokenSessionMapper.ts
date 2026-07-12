import { RefreshTokenSession } from '../../../../domain/entities/RefreshTokenSession';
import { UserId } from '../../../../domain/value-objects/UserId';
import { DeviceInfo } from '../../../../domain/value-objects/DeviceInfo';
import { RefreshTokenSessionDocument } from '../models/RefreshTokenSessionModel';
import mongoose from 'mongoose';

export class RefreshTokenSessionMapper {
  public static toDomain(raw: RefreshTokenSessionDocument): RefreshTokenSession {
    const deviceInfoResult = DeviceInfo.create({
      browser: raw.deviceInfo.browser,
      browserVersion: raw.deviceInfo.browserVersion,
      operatingSystem: raw.deviceInfo.operatingSystem,
      platform: raw.deviceInfo.platform,
      deviceName: raw.deviceInfo.deviceName,
      userAgent: raw.deviceInfo.userAgent
    });

    const sessionResult = RefreshTokenSession.create(
      UserId.create(raw.userId.toString()).getValue(),
      raw.refreshTokenHash,
      deviceInfoResult.getValue(),
      raw.expiresAt,
      raw.lastUsedAt,
      raw.ipAddress,
      raw._id.toString()
    );

    const session = sessionResult.getValue();
    if (raw.revokedAt) {
      session.revoke(raw.revokedAt);
    }
    
    // Set audit fields if we had them exposed, but usually we just care about them in persistence.
    return session;
  }

  public static toPersistence(session: RefreshTokenSession): Partial<RefreshTokenSessionDocument> {
    const raw: Partial<RefreshTokenSessionDocument> = {
      _id: new mongoose.Types.ObjectId(session.id),
      userId: new mongoose.Types.ObjectId(session.userId.value),
      refreshTokenHash: session.refreshTokenHash,
      deviceInfo: {
        browser: session.deviceInfo.browser,
        browserVersion: session.deviceInfo.browserVersion,
        operatingSystem: session.deviceInfo.operatingSystem,
        platform: session.deviceInfo.platform,
        deviceName: session.deviceInfo.deviceName,
        userAgent: session.deviceInfo.userAgent
      },
      expiresAt: session.expiresAt,
      lastUsedAt: session.lastUsedAt
    };

    if (session.ipAddress) {
      raw.ipAddress = session.ipAddress;
    }

    if (session.revokedAt) {
      raw.revokedAt = session.revokedAt;
    }

    return raw;
  }
}
