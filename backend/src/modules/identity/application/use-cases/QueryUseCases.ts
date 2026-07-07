import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IRefreshTokenSessionRepository } from '../../domain/repositories/IRefreshTokenSessionRepository';
import { GetCurrentUserQuery, GetSessionsQuery, CheckEmailQuery } from '../queries/Queries';
import { Result } from '../../../../shared/result/Result';
import { UserApplicationModel } from '../models/UserApplicationModel';
import { SessionListResult } from '../models/SessionListResult';
import { UserApplicationMapper } from '../models/UserApplicationMapper';
import { SessionApplicationMapper } from '../models/SessionApplicationMapper';
import { UserId } from '../../domain/value-objects/UserId';
import { EmailAddress } from '../../domain/value-objects/EmailAddress';

export class GetCurrentUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(query: GetCurrentUserQuery): Promise<Result<UserApplicationModel>> {
    const user = await this.userRepository.findById(query.userId);
    if (!user) return Result.fail<UserApplicationModel>('User not found');
    
    return Result.ok<UserApplicationModel>(UserApplicationMapper.toModel(user));
  }
}

export class GetSessionsUseCase {
  constructor(private readonly sessionRepository: IRefreshTokenSessionRepository) {}

  public async execute(query: GetSessionsQuery): Promise<Result<SessionListResult>> {
    const userIdResult = UserId.create(query.userId);
    if (userIdResult.isFailure) return Result.fail<SessionListResult>(userIdResult.error);

    const sessions = await this.sessionRepository.findActiveSessionsForUser(userIdResult.getValue());
    
    return Result.ok<SessionListResult>({
      sessions: sessions.map(SessionApplicationMapper.toModel)
    });
  }
}

export class CheckEmailUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(query: CheckEmailQuery): Promise<Result<boolean>> {
    const emailResult = EmailAddress.create(query.email);
    if (emailResult.isFailure) return Result.fail<boolean>(emailResult.error);

    const exists = await this.userRepository.exists(emailResult.getValue());
    return Result.ok<boolean>(exists);
  }
}
