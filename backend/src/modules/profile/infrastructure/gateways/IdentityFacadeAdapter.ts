import { IIdentityGateway, UserAccountInfo } from '../../application/ports/IIdentityGateway';
import { UserModel } from '../../../identity/infrastructure/persistence/mongoose/models/UserModel';

export class IdentityFacadeAdapter implements IIdentityGateway {
  public async getUserAccountInfo(userId: string): Promise<UserAccountInfo | null> {
    const user = await UserModel.findById(userId).exec();
    if (!user) return null;

    return {
      userId: user._id.toString(),
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
    };
  }

  public async userExists(userId: string): Promise<boolean> {
    const count = await UserModel.countDocuments({ _id: userId }).exec();
    return count > 0;
  }
}
