import { Result } from '../../../../shared/result/Result';
import { ClientProfile, ClientProfileProps } from '../aggregates/ClientProfile';

export class ClientProfileFactory {
  public static createNew(props: { userId: string; fullName: string }): Result<ClientProfile> {
    const fullProps: ClientProfileProps = {
      userId: props.userId,
      fullName: props.fullName,
      avatarUrl: null,
      dietaryPreferences: [],
      fitnessGoals: [],
      profileCompleted: false,
    };

    return ClientProfile.create(fullProps);
  }
}
