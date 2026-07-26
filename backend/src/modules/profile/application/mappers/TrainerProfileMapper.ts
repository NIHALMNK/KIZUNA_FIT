import { TrainerProfile } from '../../domain/aggregates/TrainerProfile';
import {
  TrainerProfileResponseDTO,
  PublicTrainerProfileResponseDTO,
} from '../dto/trainer/trainer-profile.dto';
import { CertificationStatus } from '../../domain/enums/TrainerEnums';

export class TrainerProfileMapper {
  public static toDTO(profile: TrainerProfile): TrainerProfileResponseDTO {
    return {
      id: profile.id,
      userId: profile.userId,
      headline: profile.headline,
      bio: profile.bio,
      avatarUrl: profile.avatarUrl || null,
      yearsOfExperience: profile.yearsOfExperience,
      languages: profile.languages,
      specializations: profile.specializations,
      certifications: profile.certifications.map((c) => ({
        certificationId: c.certificationId,
        title: c.title,
        organization: c.organization,
        issuedAt: c.issuedAt.toISOString(),
        expiresAt: c.expiresAt ? c.expiresAt.toISOString() : null,
        certificateUrl: c.certificateUrl,
        status: c.status,
        rejectionReason: c.rejectionReason || null,
        verifiedAt: c.verifiedAt ? c.verifiedAt.toISOString() : null,
      })),
      location: {
        city: profile.location.city,
        state: profile.location.state,
        country: profile.location.country,
      },
      availability: {
        status: profile.availability.status,
        timezone: profile.availability.timezone,
        weeklySchedule: profile.availability.weeklySchedule,
      },
      totalClients: profile.totalClients,
      totalReviews: profile.totalReviews,
      averageRating: profile.averageRating,
      profileCompleted: profile.profileCompleted,
      showcase: profile.showcase.map((s) => ({
        showcaseId: s.showcaseId,
        type: s.type,
        title: s.title,
        description: s.description,
        mediaUrl: s.mediaUrl || null,
        issuedBy: s.issuedBy || null,
        achievedAt: s.achievedAt ? s.achievedAt.toISOString() : null,
      })),
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }

  public static toPublicDTO(profile: TrainerProfile): PublicTrainerProfileResponseDTO {
    return {
      id: profile.id,
      userId: profile.userId,
      fullName: (profile as any).fullName || null,
      headline: profile.headline,
      bio: profile.bio,
      avatarUrl: profile.avatarUrl || null,
      yearsOfExperience: profile.yearsOfExperience,
      languages: profile.languages,
      specializations: profile.specializations,
      certifications: profile.certifications
        .filter((c) => c.status === CertificationStatus.APPROVED)
        .map((c) => ({
          title: c.title,
          organization: c.organization,
          issuedAt: c.issuedAt.toISOString(),
        })),
      location: {
        city: profile.location.city,
        state: profile.location.state,
        country: profile.location.country,
      },
      availabilityStatus: profile.availability.status,
      totalReviews: profile.totalReviews,
      averageRating: profile.averageRating,
      showcase: profile.showcase.map((s) => ({
        showcaseId: s.showcaseId,
        type: s.type,
        title: s.title,
        description: s.description,
        mediaUrl: s.mediaUrl || null,
        issuedBy: s.issuedBy || null,
        achievedAt: s.achievedAt ? s.achievedAt.toISOString() : null,
      })),
    };
  }
}
