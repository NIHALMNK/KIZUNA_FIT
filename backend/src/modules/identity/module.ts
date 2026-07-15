import { AwilixContainer, asClass, asValue } from 'awilix';

// Infrastructure (Persistence)
import { MongoUserRepository } from './infrastructure/persistence/mongoose/repositories/MongoUserRepository';
import { MongoRefreshTokenSessionRepository } from './infrastructure/persistence/mongoose/repositories/MongoRefreshTokenSessionRepository';
import { MongoEmailVerificationRepository } from './infrastructure/persistence/mongoose/repositories/MongoEmailVerificationRepository';
import { MongoPasswordResetRepository } from './infrastructure/persistence/mongoose/repositories/MongoPasswordResetRepository';
import { UserModel } from './infrastructure/persistence/mongoose/models/UserModel';
import { RefreshTokenSessionModel } from './infrastructure/persistence/mongoose/models/RefreshTokenSessionModel';
import { EmailVerificationModel } from './infrastructure/persistence/mongoose/models/EmailVerificationModel';
import { PasswordResetModel } from './infrastructure/persistence/mongoose/models/PasswordResetModel';

// Infrastructure (Shared)
import { MongooseUnitOfWork } from '../../shared/infrastructure/persistence/mongoose/MongooseUnitOfWork';
import { InMemoryEventBus } from '../../shared/infrastructure/events/InMemoryEventBus';
import { NodemailerSmtpEmailProvider } from '../../shared/infrastructure/email/NodemailerSmtpEmailProvider';
import { MockEmailProvider } from '../../shared/infrastructure/email/MockEmailProvider';
import { SyncEmailDispatcher } from '../../shared/infrastructure/email/SyncEmailDispatcher';
import { BullMQEmailDispatcher } from '../../shared/infrastructure/email/BullMQEmailDispatcher';
import { JwtConfiguration } from '../../config/JwtConfiguration';
import { env } from '../../config/env.config';

// Event Handlers
import { SendVerificationEmailHandler } from './application/event-handlers/SendVerificationEmailHandler';
import { SendPasswordResetEmailHandler } from './application/event-handlers/SendPasswordResetEmailHandler';

// Infrastructure (Adapters)
import { SystemClock } from './infrastructure/adapters/time/SystemClock';
import { Argon2PasswordHasher } from './infrastructure/adapters/security/Argon2PasswordHasher';
import { JwtTokenProvider } from './infrastructure/adapters/security/JwtTokenProvider';
import { GoogleIdentityProvider } from './infrastructure/adapters/security/GoogleIdentityProvider';

// Application Use Cases
import { RegisterUserUseCase } from './application/use-cases/RegisterUserUseCase';
import { LoginUseCase } from './application/use-cases/LoginUseCase';
import { GoogleLoginUseCase } from './application/use-cases/GoogleLoginUseCase';
import { LinkGoogleAccountUseCase } from './application/use-cases/LinkGoogleAccountUseCase';
import { UnlinkGoogleAccountUseCase } from './application/use-cases/UnlinkGoogleAccountUseCase';
import { GetAuthProvidersUseCase } from './application/use-cases/GetAuthProvidersUseCase';
import { RefreshTokenUseCase } from './application/use-cases/RefreshTokenUseCase';
import { LogoutUseCase, LogoutAllUseCase } from './application/use-cases/LogoutUseCases';
import { CheckEmailUseCase } from './application/use-cases/CheckEmailUseCase';
import { GetSessionsUseCase } from './application/use-cases/QueryUseCases';
import { VerifyEmailUseCase } from './application/use-cases/VerifyEmailUseCase';
import { ResendVerificationUseCase } from './application/use-cases/ResendVerificationUseCase';
import { ForgotPasswordUseCase } from './application/use-cases/ForgotPasswordUseCase';
import { ResetPasswordUseCase } from './application/use-cases/ResetPasswordUseCase';
import { ChangePasswordUseCase } from './application/use-cases/ChangePasswordUseCase';
import { DeleteAccountUseCase } from './application/use-cases/DeleteAccountUseCase';
import { AuthController } from './presentation/controllers/AuthController';
import { UserController } from './presentation/controllers/UserController';

export const registerIdentityModule = (container: AwilixContainer): void => {
  // Config
  container.register({
    config: asClass(JwtConfiguration).singleton()
  });

  // Shared Infrastructure (Singletons)
  container.register({
    eventBus: asClass(InMemoryEventBus).singleton(),
    emailProvider: env.EMAIL_PROVIDER === 'mock' 
      ? asClass(MockEmailProvider).singleton() 
      : asClass(NodemailerSmtpEmailProvider).singleton(),
    emailDispatcher: env.EMAIL_DISPATCH_MODE === 'queue'
      ? asClass(BullMQEmailDispatcher).singleton()
      : asClass(SyncEmailDispatcher).singleton(),
  });

  // Application Event Handlers (Singletons)
  container.register({
    sendVerificationEmailHandler: asClass(SendVerificationEmailHandler).singleton(),
    sendPasswordResetEmailHandler: asClass(SendPasswordResetEmailHandler).singleton(),
  });

  // Wire Handlers to EventBus
  const eventBus = container.resolve('eventBus');
  eventBus.subscribe('EmailVerificationRequestedEvent', container.resolve('sendVerificationEmailHandler'));
  eventBus.subscribe('PasswordResetRequestedEvent', container.resolve('sendPasswordResetEmailHandler'));

  // Identity Adapters (Singletons)
  container.register({
    clock: asClass(SystemClock).singleton(),
    passwordHasher: asClass(Argon2PasswordHasher).singleton(),
    tokenProvider: asClass(JwtTokenProvider).singleton(),
    googleIdentityProvider: asValue(new GoogleIdentityProvider(process.env.GOOGLE_CLIENT_ID || 'fallback_client_id')),
  });

  // Persistence (Scoped to share transactions if needed, but for now we can just use scoped)
  // Mongoose models are singletons (passed as values or factory) but we can just use them directly in the repositories or register them
  container.register({
    userModel: asValue(UserModel),
    refreshTokenSessionModel: asValue(RefreshTokenSessionModel),
    emailVerificationModel: asValue(EmailVerificationModel),
    passwordResetModel: asValue(PasswordResetModel),
    
    unitOfWork: asClass(MongooseUnitOfWork).scoped(),
    userRepository: asClass(MongoUserRepository).scoped(),
    sessionRepository: asClass(MongoRefreshTokenSessionRepository).scoped(),
    emailVerificationRepo: asClass(MongoEmailVerificationRepository).scoped(),
    passwordResetRepo: asClass(MongoPasswordResetRepository).scoped(),
  });

  // Application Use Cases (Scoped because they depend on Scoped UnitOfWork)
  container.register({
    registerUserUseCase: asClass(RegisterUserUseCase).scoped(),
    loginUseCase: asClass(LoginUseCase).scoped(),
    googleLoginUseCase: asClass(GoogleLoginUseCase).scoped(),
    linkGoogleAccountUseCase: asClass(LinkGoogleAccountUseCase).scoped(),
    unlinkGoogleAccountUseCase: asClass(UnlinkGoogleAccountUseCase).scoped(),
    getAuthProvidersUseCase: asClass(GetAuthProvidersUseCase).scoped(),
    refreshTokenUseCase: asClass(RefreshTokenUseCase).scoped(),
    logoutUseCase: asClass(LogoutUseCase).scoped(),
    logoutAllUseCase: asClass(LogoutAllUseCase).scoped(),
    checkEmailUseCase: asClass(CheckEmailUseCase).scoped(),
    getSessionsUseCase: asClass(GetSessionsUseCase).scoped(),
    verifyEmailUseCase: asClass(VerifyEmailUseCase).scoped(),
    resendVerificationUseCase: asClass(ResendVerificationUseCase).scoped(),
    forgotPasswordUseCase: asClass(ForgotPasswordUseCase).scoped(),
    resetPasswordUseCase: asClass(ResetPasswordUseCase).scoped(),
    changePasswordUseCase: asClass(ChangePasswordUseCase).scoped(),
    deleteAccountUseCase: asClass(DeleteAccountUseCase).scoped(),
  });

  // Presentation Controllers (Scoped)
  container.register({
    authController: asClass(AuthController).scoped(),
    userController: asClass(UserController).scoped(),
  });
};
