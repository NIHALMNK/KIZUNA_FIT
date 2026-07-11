import { Result } from '../../../../shared/result/Result';
import { IGoogleIdentityProvider } from '../ports/IGoogleIdentityProvider';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IRefreshTokenSessionRepository } from '../../domain/repositories/IRefreshTokenSessionRepository';
import { ITokenProvider } from '../ports/ITokenProvider';
import { IUnitOfWork } from '../ports/IUnitOfWork';
import { IEventBus } from '../ports/IEventBus';
import { IClock } from '../ports/IClock';
import { AuthProvider } from '../../domain/value-objects/AuthProvider';
import { ExternalIdentity } from '../../domain/value-objects/ExternalIdentity';
import { User, UserProps } from '../../domain/entities/User';
import { EmailAddress } from '../../domain/value-objects/EmailAddress';
import { UserStatus } from '../../domain/entities/UserStatus';
import { RefreshTokenSession } from '../../domain/entities/RefreshTokenSession';
import { UserId } from '../../domain/value-objects/UserId';
import { AuthenticationIntegrityException } from '../../../../shared/exceptions/AppError';
import { ExternalAuthenticationSucceededEvent } from '../events/ExternalAuthenticationSucceededEvent';
import { ExternalAuthenticationFailedEvent } from '../events/ExternalAuthenticationFailedEvent';

interface Request {
  idToken: string;
  ipAddress: string;
  userAgent: string;
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

    const extIdentityResult = ExternalIdentity.create({
      provider: AuthProvider.GOOGLE,
      providerUserId: payload.providerUserId,
    });

    if (extIdentityResult.isFailure) {
      const reason = extIdentityResult.error || 'Invalid identity payload';
      try {
        await this.eventBus.publish([
          new ExternalAuthenticationFailedEvent(payload.email, AuthProvider.GOOGLE, payload.providerUserId, reason)
        ]);
      } catch (err) {
        console.error('Failed to publish failure event', err);
      }
      return Result.fail<Response>(reason);
    }

    const extIdentity = extIdentityResult.getValue();

    await this.unitOfWork.start();

    try {
      const userByExternalId = await this.userRepository.findByExternalIdentity(AuthProvider.GOOGLE, payload.providerUserId);
      
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
      const emailVal = emailResult.getValue();
      const userByEmail = await this.userRepository.findByEmail(emailVal);

      // Defense-in-depth: Integrity check
      if (userByExternalId && userByEmail && userByExternalId.id !== userByEmail.id) {
        const integrityErrorMsg = `Security Conflict: Google Login resolved to different entities. ExternalId User: ${userByExternalId.id}, Email User: ${userByEmail.id}`;
        console.error(`[SECURITY ALERT] ${integrityErrorMsg}`);

        try {
          await this.eventBus.publish([
            new ExternalAuthenticationFailedEvent(payload.email, AuthProvider.GOOGLE, payload.providerUserId, 'Database integrity conflict')
          ]);
        } catch (err) {
          console.error('Failed to publish failure event', err);
        }

        throw new AuthenticationIntegrityException('Authentication conflict detected. Please contact support.');
      }

      let user: User;
      
      if (userByExternalId) {
        user = userByExternalId;
        if (user.status === UserStatus.Deleted || user.status === UserStatus.Locked) {
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
      } else if (userByEmail) {
        user = userByEmail;
        if (user.status === UserStatus.Deleted || user.status === UserStatus.Locked) {
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
        if (user.status === UserStatus.PendingVerification) {
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

        const linkResult = user.linkExternalIdentity(extIdentity);
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
      } else {
        // Create user
        const newUserProps: UserProps = {
          email: emailVal,
          status: UserStatus.Active, 
          failedLoginAttempts: 0,
          externalIdentities: [extIdentity]
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

      await this.userRepository.save(user, this.unitOfWork.session);

      const userIdResult = UserId.create(user.id);
      if (userIdResult.isFailure) {
        await this.unitOfWork.rollback();
        return Result.fail<Response>(userIdResult.error);
      }
      const userId = userIdResult.getValue();

      const expiresAt = new Date(this.clock.now().getTime() + 7 * 24 * 60 * 60 * 1000);
      const sessionResult = RefreshTokenSession.create(
        userId,
        request.userAgent,
        request.ipAddress,
        expiresAt
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
      const refreshToken = await this.tokenProvider.generateRefreshToken(session);

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
        refreshToken
      });
    } catch (error: unknown) {
      await this.unitOfWork.rollback();
      if (error instanceof AuthenticationIntegrityException) {
        throw error;
      }
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
