import { AggregateRoot } from '../../../../shared/core/AggregateRoot';
import { Result } from '../../../../shared/result/Result';
import { UserId } from '../value-objects/UserId';
import { DeviceInfo } from '../value-objects/DeviceInfo';
import { RefreshTokenFamilyCompromisedEvent } from '../events/RefreshTokenFamilyCompromisedEvent';

export interface RefreshTokenSessionProps {
  userId: UserId;
  refreshTokenHash: string;
  deviceInfo: DeviceInfo;
  ipAddress?: string;
  expiresAt: Date;
  lastUsedAt: Date;
  revokedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class RefreshTokenSession extends AggregateRoot<RefreshTokenSessionProps> {
  get userId(): UserId {
    return this.props.userId;
  }

  get refreshTokenHash(): string {
    return this.props.refreshTokenHash;
  }

  get deviceInfo(): DeviceInfo {
    return this.props.deviceInfo;
  }

  get ipAddress(): string | undefined {
    return this.props.ipAddress;
  }
  
  get expiresAt(): Date {
    return this.props.expiresAt;
  }
  
  get lastUsedAt(): Date {
    return this.props.lastUsedAt;
  }
  
  get revokedAt(): Date | undefined {
    return this.props.revokedAt;
  }

  public isExpired(now: Date): boolean {
    return now > this.props.expiresAt;
  }

  public isRevoked(): boolean {
    return this.props.revokedAt !== undefined;
  }

  public isActive(now: Date): boolean {
    return !this.isRevoked() && !this.isExpired(now);
  }

  private constructor(props: RefreshTokenSessionProps, id?: string) {
    super(props, id || crypto.randomUUID().replace(/-/g, '').substring(0, 24));
  }

  public static create(
    userId: UserId,
    refreshTokenHash: string,
    deviceInfo: DeviceInfo,
    expiresAt: Date,
    lastUsedAt: Date,
    ipAddress?: string,
    id?: string
  ): Result<RefreshTokenSession> {
    const session = new RefreshTokenSession({
      userId,
      refreshTokenHash,
      deviceInfo,
      ipAddress,
      expiresAt,
      lastUsedAt
    }, id);

    return Result.ok<RefreshTokenSession>(session);
  }

  public rotate(newRefreshTokenHash: string, now: Date, newExpiresAt?: Date, newIpAddress?: string): Result<void> {
    if (this.isRevoked()) {
      this.flagAsCompromised();
      return Result.fail<void>('Cannot rotate a revoked token session. Session compromised.');
    }

    if (this.isExpired(now)) {
      return Result.fail<void>('Cannot rotate an expired token session');
    }

    this.props.refreshTokenHash = newRefreshTokenHash;
    this.props.lastUsedAt = now;
    if (newExpiresAt) {
      this.props.expiresAt = newExpiresAt;
    }
    if (newIpAddress) {
      this.props.ipAddress = newIpAddress;
    }
    
    return Result.ok<void>();
  }

  public revoke(now: Date): void {
    if (!this.props.revokedAt) {
      this.props.revokedAt = now;
    }
  }

  public flagAsCompromised(): void {
    this.revoke(new Date());
    this.addDomainEvent(new RefreshTokenFamilyCompromisedEvent({
      sessionId: this.id,
      userId: this.userId
    }));
  }
}
