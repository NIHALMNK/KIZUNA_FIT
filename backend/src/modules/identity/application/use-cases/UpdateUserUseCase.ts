import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { Result } from '../../../../shared/result/Result';
import { UserApplicationModel } from '../models/UserApplicationModel';
import { UserApplicationMapper } from '../models/UserApplicationMapper';

export interface UpdateUserCommand {
  userId: string;
  fullName?: string;
  phoneNumber?: string | null;
}

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(command: UpdateUserCommand): Promise<Result<UserApplicationModel>> {
    const user = await this.userRepository.findById(command.userId);
    if (!user) {
      return Result.fail<UserApplicationModel>('User not found');
    }

    user.updateProfileInfo(command.fullName, command.phoneNumber);
    await this.userRepository.save(user);

    return Result.ok<UserApplicationModel>(UserApplicationMapper.toModel(user));
  }
}
