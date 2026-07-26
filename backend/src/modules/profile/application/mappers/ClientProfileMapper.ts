import { ClientProfile } from '../../domain/aggregates/ClientProfile';
import { ClientProfileResponseDTO } from '../dto/client/client-profile.dto';

export class ClientProfileMapper {
  public static toDTO(profile: ClientProfile): ClientProfileResponseDTO {
    return {
      id: profile.id,
      userId: profile.userId,
      fullName: profile.fullName,
      avatarUrl: profile.avatarUrl || null,
      gender: profile.gender || null,
      dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.toISOString() : null,
      phoneNumber: profile.phoneNumber || null,
      country: profile.country || null,
      state: profile.state || null,
      city: profile.city || null,
      timezone: profile.timezone || null,
      weight: profile.weight
        ? {
            value: profile.weight.value,
            unit: profile.weight.unit,
          }
        : null,
      height: profile.height
        ? {
            value: profile.height.value,
            unit: profile.height.unit,
          }
        : null,
      medicalNotes: profile.medicalNotes || null,
      dietaryPreferences: profile.dietaryPreferences,
      fitnessGoals: profile.fitnessGoals,
      experienceLevel: profile.experienceLevel || null,
      activityLevel: profile.activityLevel || null,
      profileCompleted: profile.profileCompleted,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }
}
