import { Result } from '../../../../shared/result/Result';
import { IGoogleIdentityProvider } from '../ports/IGoogleIdentityProvider';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IRefreshTokenSessionRepository } from '../../domain/repositories/IRefreshTokenSessionRepository';
import { ITokenProvider } from '../ports/ITokenProvider';
import { IUnitOfWork } from '../ports/IUnitOfWork';
import { IEventBus } from '../ports/IEventBus';
import { IClock } from '../ports/IClock';
import { AuthProvider } from '../../domain/value-objects/AuthProvider';
import { User, UserProps } from '../../domain/entities/User';
import { EmailAddress } from '../../domain/value-objects/EmailAddress';
import { UserStatus } from '../../domain/entities/UserStatus';
import { UserRole } from '../../domain/value-objects/UserRole';
import { RefreshTokenSession } from '../../domain/entities/RefreshTokenSession';
import { UserId } from '../../domain/value-objects/UserId';
import { DeviceInfo } from '../../domain/value-objects/DeviceInfo';
import { ExternalAuthenticationSucceededEvent } from '../events/ExternalAuthenticationSucceededEvent';
import { ExternalAuthenticationFailedEvent } from '../events/ExternalAuthenticationFailedEvent';

interface Request {
  idToken: string;
  ipAddress: string;
  deviceInfo: {
    browser?: string;
    browserVersion?: string;
    operatingSystem?: string;
    platform?: string;
    deviceName?: string;
    userAgent: string;
  };
}

interface Response {
  accessToken: string;
  refreshToken: string;
}

export class GoogleLoginUseCase {
  constructor(
    private readonly googleIdentityProvider: IGoogleIdentityProvider,
    private readonly userRepository: IUserRepository,
    private readonly sessionRepository: IRefreshTokenSessionRepository,
    private readonly tokenProvider: ITokenProvider,
    private readonly unitOfWork: IUnitOfWork,
    private readonly eventBus: IEventBus,
    private readonly clock: IClock
  ) {}

  public async execute(request: Request): Promise<Result<Response>> {
    const payloadResult = await this.googleIdentityProvider.verifyIdToken(request.idToken);
    
    if (payloadResult.isFailure) {
      const reason = payloadResult.error || 'Invalid Google Token';
      try {
        await this.eventBus.publish([
          new ExternalAuthenticationFailedEvent('', AuthProvider.GOOGLE, '', reason)
        ]);
      } catch (err) {
        console.error('Failed to publish failure event', err);
      }
      return Result.fail<Response>(reason);
    }

    const payload = payloadResult.getValue();

    await this.unitOfWork.start();

    try {
      const emailResult = EmailAddress.create(payload.email);
      if (emailResult.isFailure) {
        await this.unitOfWork.rollback();
        const reason = emailResult.error || 'Invalid email';
        try {
          await this.eventBus.publish([
            new ExternalAuthenticationFailedEvent(payload.email, AuthProvider.GOOGLE, payload.providerUserId, reason)
          ]);
        } catch (err) {
          console.error('Failed to publish failure event', err);
        }
        return Result.fail<Response>(reason);
      }
      
      const email = emailResult.getValue();
      const userByEmail = await this.userRepository.findByEmail(email.value);

      let user: User;
      
      if (userByEmail) {
        user = userByEmail;
        if (
          user.status === UserStatus.Deleted || 
          user.status === UserStatus.Suspended || 
          user.status === UserStatus.Banned
        ) {
          await this.unitOfWork.rollback();
          const reason = `Account is ${user.status.toLowerCase()}.`;
          try {
            await this.eventBus.publish([
              new ExternalAuthenticationFailedEvent(payload.email, AuthProvider.GOOGLE, payload.providerUserId, reason)
            ]);
          } catch (err) {
            console.error('Failed to publish failure event', err);
          }
          return Result.fail<Response>(reason);
        }

        // Email verification + linking
        if (!user.emailVerified) {
          const verifyResult = user.markEmailAsVerified();
          if (verifyResult.isFailure) {
             await this.unitOfWork.rollback();
             const reason = verifyResult.error || 'Could not verify email';
             try {
               await this.eventBus.publish([
                 new ExternalAuthenticationFailedEvent(payload.email, AuthProvider.GOOGLE, payload.providerUserId, reason)
               ]);
             } catch (err) {
               console.error('Failed to publish failure event', err);
             }
             return Result.fail<Response>(reason);
          }
        }

        if (!user.hasExternalIdentity(AuthProvider.GOOGLE)) {
          const linkResult = user.linkExternalIdentity(AuthProvider.GOOGLE);
          if (linkResult.isFailure) {
            await this.unitOfWork.rollback();
            const reason = linkResult.error || 'Failed to link account';
            try {
              await this.eventBus.publish([
                new ExternalAuthenticationFailedEvent(payload.email, AuthProvider.GOOGLE, payload.providerUserId, reason)
              ]);
            } catch (err) {
              console.error('Failed to publish failure event', err);
            }
            return Result.fail<Response>(reason);
          }
        }
      } else {
        // Create user
        const newUserProps: UserProps = {
          fullName: payload.displayName || payload.email.split('@')[0],
          email: email,
          role: UserRole.CLIENT,
          status: UserStatus.Active,
          emailVerified: true,
          authProviders: [AuthProvider.GOOGLE]
        };

        const userResult = User.create(newUserProps);
        
        if (userResult.isFailure) {
          await this.unitOfWork.rollback();
          const reason = userResult.error || 'Failed to create user';
          try {
            await this.eventBus.publish([
              new ExternalAuthenticationFailedEvent(payload.email, AuthProvider.GOOGLE, payload.providerUserId, reason)
            ]);
          } catch (err) {
            console.error('Failed to publish failure event', err);
          }
          return Result.fail<Response>(reason);
        }

        user = userResult.getValue();
      }

      const now = this.clock.now();
      user.recordLogin(now);
      await this.userRepository.save(user, this.unitOfWork.session);

      const userIdResult = UserId.create(user.id);
      if (userIdResult.isFailure) {
        await this.unitOfWork.rollback();
        return Result.fail<Response>(userIdResult.error);
      }
      const userId = userIdResult.getValue();

      const deviceInfoResult = DeviceInfo.create(request.deviceInfo);
      if (deviceInfoResult.isFailure) {
        await this.unitOfWork.rollback();
        return Result.fail<Response>(deviceInfoResult.error);
      }

      const { token: rawRefreshToken, hash: refreshTokenHash } = await this.tokenProvider.generateRefreshToken();
      const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

      const sessionResult = RefreshTokenSession.create(
        userId,
        refreshTokenHash,
        deviceInfoResult.getValue(),
        expiresAt,
        now,
        request.ipAddress
      );

      if (sessionResult.isFailure) {
        await this.unitOfWork.rollback();
        const reason = sessionResult.error || 'Failed to create session';
        try {
          await this.eventBus.publish([
            new ExternalAuthenticationFailedEvent(payload.email, AuthProvider.GOOGLE, payload.providerUserId, reason)
          ]);
        } catch (err) {
          console.error('Failed to publish failure event', err);
        }
        return Result.fail<Response>(reason);
      }

      const session = sessionResult.getValue();
      await this.sessionRepository.save(session, this.unitOfWork.session);

      const events = [...user.domainEvents, ...session.domainEvents];
      user.clearEvents();
      session.clearEvents();

      await this.unitOfWork.commit();

      const accessToken = await this.tokenProvider.generateAccessToken(user);

      try {
        const succeededEvent = new ExternalAuthenticationSucceededEvent(
          user.id,
          AuthProvider.GOOGLE,
          payload.providerUserId
        );
        await this.eventBus.publish([...events, succeededEvent]);
      } catch (err) {
        console.error('Audit Event publication failed (best-effort policy)', err);
      }

      return Result.ok<Response>({
        accessToken,
        refreshToken: rawRefreshToken
      });
    } catch (error: unknown) {
      await this.unitOfWork.rollback();
      const reason = `Login failed: ${(error as Error).message}`;
      try {
        await this.eventBus.publish([
          new ExternalAuthenticationFailedEvent(payload.email, AuthProvider.GOOGLE, payload.providerUserId, reason)
        ]);
      } catch (err) {
        console.error('Failed to publish failure event', err);
      }
      return Result.fail<Response>(reason);
    }
  }
}
