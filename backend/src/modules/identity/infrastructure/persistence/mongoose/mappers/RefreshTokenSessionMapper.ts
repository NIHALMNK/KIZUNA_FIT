import { RefreshTokenSession, RefreshTokenSessionProps } from '../../../../domain/entities/RefreshTokenSession';
import { UserId } from '../../../../domain/value-objects/UserId';
import { RefreshTokenId } from '../../../../domain/value-objects/RefreshTokenId';
import { TokenFamily } from '../../../../domain/value-objects/TokenFamily';
import { RefreshTokenSessionDocument } from '../models/RefreshTokenSessionModel';

export class RefreshTokenSessionMapper {
  public static toDomain(raw: RefreshTokenSessionDocument): RefreshTokenSession {
    const props: RefreshTokenSessionProps = {
      userId: UserId.create(raw.userId).getValue(),
      tokenId: RefreshTokenId.create(raw.tokenId).getValue(),
      family: TokenFamily.create(raw.family).getValue(),
      deviceId: raw.deviceId,
      ipAddress: raw.ipAddress,
      expiresAt: raw.expiresAt,
      isRevoked: raw.isRevoked
    };

    // Hydrate by bypassing events. We need to access private constructor, 
    // but TS limits it. We use Object.create + Object.assign as a safe anti-corruption hydration 
    // pattern if standard factories emit unwanted events.
    const session = Object.create(RefreshTokenSession.prototype);
    Object.assign(session, { _id: raw._id, props: props, _domainEvents: [] });
    return session as RefreshTokenSession;
  }

  public static toPersistence(session: RefreshTokenSession): Partial<RefreshTokenSessionDocument> {
    return {
      _id: session.id,
      userId: session.userId.value,
      tokenId: session.tokenId.value,
      family: session.family.value,
      deviceId: session.props.deviceId,
      ipAddress: session.props.ipAddress,
      expiresAt: session.props.expiresAt,
      isRevoked: session.isRevoked
    };
  }
}
