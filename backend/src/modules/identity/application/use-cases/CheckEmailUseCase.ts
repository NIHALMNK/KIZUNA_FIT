import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { Result } from '../../../../shared/result/Result';

export class CheckEmailUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(email: string): Promise<Result<{ available: boolean }>> {
    // 11_API_SPECIFICATION: returns 200 OK regardless, data.available = true if not found
    const exists = await this.userRepository.existsByEmail(email);
    return Result.ok<{ available: boolean }>({ available: !exists });
  }
}
