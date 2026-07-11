import { AwilixContainer, asClass, asValue } from 'awilix';

// Infrastructure (Persistence)
import { MongoUserRepository } from './infrastructure/persistence/mongoose/repositories/MongoUserRepository';
import { MongoRefreshTokenSessionRepository } from './infrastructure/persistence/mongoose/repositories/MongoRefreshTokenSessionRepository';
import { UserModel } from './infrastructure/persistence/mongoose/models/UserModel';
import { RefreshTokenSessionModel } from './infrastructure/persistence/mongoose/models/RefreshTokenSessionModel';

// Infrastructure (Shared)
import { MongooseUnitOfWork } from '../../shared/infrastructure/persistence/mongoose/MongooseUnitOfWork';
import { InMemoryEventBus } from '../../shared/infrastructure/events/InMemoryEventBus';
import { ConsoleEmailProvider } from '../../shared/infrastructure/email/ConsoleEmailProvider';
import { JwtConfiguration } from '../../config/JwtConfiguration';

// Infrastructure (Adapters)
import { SystemClock } from './infrastructure/adapters/time/SystemClock';
import { Argon2PasswordHasher } from './infrastructure/adapters/security/Argon2PasswordHasher';
import { JwtTokenProvider } from './infrastructure/adapters/security/JwtTokenProvider';
import { IdentityEmailService } from './infrastructure/adapters/email/IdentityEmailService';
import { GoogleIdentityProvider } from './infrastructure/adapters/security/GoogleIdentityProvider';

// Application Use Cases
import { RegisterUserUseCase } from './application/use-cases/RegisterUserUseCase';
import { LoginUseCase } from './application/use-cases/LoginUseCase';
import { GoogleLoginUseCase } from './application/use-cases/GoogleLoginUseCase';
import { RefreshTokenUseCase } from './application/use-cases/RefreshTokenUseCase';
import { VerifyEmailUseCase } from './application/use-cases/VerifyEmailUseCase';
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
    emailProvider: asClass(ConsoleEmailProvider).singleton(),
  });

  // Identity Adapters (Singletons)
  container.register({
    clock: asClass(SystemClock).singleton(),
    passwordHasher: asClass(Argon2PasswordHasher).singleton(),
    tokenProvider: asClass(JwtTokenProvider).singleton(),
    emailService: asClass(IdentityEmailService).singleton(),
    googleIdentityProvider: asValue(new GoogleIdentityProvider(process.env.GOOGLE_CLIENT_ID || 'fallback_client_id')),
  });

  // Persistence (Scoped to share transactions if needed, but for now we can just use scoped)
  // Mongoose models are singletons (passed as values or factory) but we can just use them directly in the repositories or register them
  container.register({
    userModel: asValue(UserModel),
    refreshTokenSessionModel: asValue(RefreshTokenSessionModel),
    
    unitOfWork: asClass(MongooseUnitOfWork).scoped(),
    userRepository: asClass(MongoUserRepository).scoped(),
    sessionRepository: asClass(MongoRefreshTokenSessionRepository).scoped(),
  });

  // Application Use Cases (Scoped because they depend on Scoped UnitOfWork)
  container.register({
    registerUserUseCase: asClass(RegisterUserUseCase).scoped(),
    loginUseCase: asClass(LoginUseCase).scoped(),
    googleLoginUseCase: asClass(GoogleLoginUseCase).scoped(),
    refreshTokenUseCase: asClass(RefreshTokenUseCase).scoped(),
    verifyEmailUseCase: asClass(VerifyEmailUseCase).scoped(),
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
