import { AggregateRoot } from '../../../../shared/core/AggregateRoot';
import { Result } from '../../../../shared/result/Result';
import { RefreshTokenId } from '../value-objects/RefreshTokenId';
import { TokenFamily } from '../value-objects/TokenFamily';
import { UserId } from '../value-objects/UserId';
import { RefreshTokenFamilyCompromisedEvent } from '../events/RefreshTokenFamilyCompromisedEvent';

export interface RefreshTokenSessionProps {
  userId: UserId;
  tokenId: RefreshTokenId;
  family: TokenFamily;
  deviceId: string;
  ipAddress: string;
  expiresAt: Date;
  isRevoked: boolean;
  createdAt: Date;
}

export class RefreshTokenSession extends AggregateRoot<RefreshTokenSessionProps> {
  get userId(): UserId {
    return this.props.userId;
  }

  get tokenId(): RefreshTokenId {
    return this.props.tokenId;
  }

  get family(): TokenFamily {
    return this.props.family;
  }

  get isRevoked(): boolean {
    return this.props.isRevoked;
  }

  public get isExpired(): boolean {
    return new Date() > this.props.expiresAt;
  }

  private constructor(props: RefreshTokenSessionProps, id?: string) {
    super(props, id || crypto.randomUUID());
  }

  public static create(
    userId: UserId,
    deviceId: string,
    ipAddress: string,
    expiresInMs: number = 7 * 24 * 60 * 60 * 1000 // default 7 days
  ): Result<RefreshTokenSession> {
    
    const tokenIdResult = RefreshTokenId.create(crypto.randomUUID());
    const familyResult = TokenFamily.create(crypto.randomUUID());

    if (tokenIdResult.isFailure) return Result.fail<RefreshTokenSession>(tokenIdResult.error);
    if (familyResult.isFailure) return Result.fail<RefreshTokenSession>(familyResult.error);

    const session = new RefreshTokenSession({
      userId,
      tokenId: tokenIdResult.getValue(),
      family: familyResult.getValue(),
      deviceId,
      ipAddress,
      expiresAt: new Date(Date.now() + expiresInMs),
      isRevoked: false,
      createdAt: new Date()
    });

    return Result.ok<RefreshTokenSession>(session);
  }

  public rotate(newTokenId: RefreshTokenId, newExpiresAt?: Date): Result<void> {
    if (this.isRevoked) {
      this.flagAsCompromised();
      return Result.fail<void>('Cannot rotate a revoked token. Family compromised.');
    }

    if (this.isExpired) {
      return Result.fail<void>('Cannot rotate an expired token');
    }

    this.props.tokenId = newTokenId;
    if (newExpiresAt) {
      this.props.expiresAt = newExpiresAt;
    }
    
    return Result.ok<void>();
  }

  public revoke(): void {
    this.props.isRevoked = true;
  }

  public flagAsCompromised(): void {
    this.revoke();
    this.addDomainEvent(new RefreshTokenFamilyCompromisedEvent({
      id: this.tokenId,
      family: this.family,
      userId: this.userId
    }));
  }
}
