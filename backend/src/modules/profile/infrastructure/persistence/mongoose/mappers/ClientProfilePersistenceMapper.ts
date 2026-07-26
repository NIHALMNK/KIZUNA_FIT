import { ClientProfile } from '../../../../domain/aggregates/ClientProfile';
import { IClientProfileDocument } from '../models/ClientProfileModel';
import { Weight } from '../../../../domain/value-objects/Weight';
import { Height } from '../../../../domain/value-objects/Height';

export class ClientProfilePersistenceMapper {
  public static toDomain(doc: IClientProfileDocument): ClientProfile {
    const weightResult = doc.weight ? Weight.create(doc.weight.value, doc.weight.unit) : null;
    const heightResult = doc.height ? Height.create(doc.height.value, doc.height.unit) : null;

    const profileResult = ClientProfile.create(
      {
        userId: doc.userId,
        fullName: doc.fullName,
        avatarUrl: doc.avatarUrl,
        gender: doc.gender || undefined,
        dateOfBirth: doc.dateOfBirth || undefined,
        phoneNumber: doc.phoneNumber || undefined,
        country: doc.country || undefined,
        state: doc.state || undefined,
        city: doc.city || undefined,
        timezone: doc.timezone || undefined,
        weight: weightResult && weightResult.isSuccess ? weightResult.getValue() : null,
        height: heightResult && heightResult.isSuccess ? heightResult.getValue() : null,
        medicalNotes: doc.medicalNotes || undefined,
        dietaryPreferences: doc.dietaryPreferences || [],
        fitnessGoals: doc.fitnessGoals || [],
        experienceLevel: doc.experienceLevel || undefined,
        activityLevel: doc.activityLevel || undefined,
        profileCompleted: doc.profileCompleted,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      },
      doc._id.toString(),
    );

    if (profileResult.isFailure) {
      throw new Error(`Failed to map ClientProfile document to Domain: ${profileResult.error}`);
    }

    return profileResult.getValue();
  }

  public static toPersistence(profile: ClientProfile): Record<string, unknown> {
    return {
      _id: profile.id,
      userId: profile.userId,
      fullName: profile.fullName,
      avatarUrl: profile.avatarUrl || null,
      gender: profile.gender || null,
      dateOfBirth: profile.dateOfBirth || null,
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
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}
