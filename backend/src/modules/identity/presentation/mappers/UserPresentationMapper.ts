import { UserApplicationModel } from '../../application/models/UserApplicationModel';
import { UserResponseDto } from '../dtos/response/UserResponseDto';

export class UserPresentationMapper {
  static toDto(model: UserApplicationModel): UserResponseDto {
    return {
      id: model.id,
      email: model.email,
      status: model.status,
    };
  }
}
