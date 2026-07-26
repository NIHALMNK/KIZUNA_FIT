import { TrainerProfile } from '../../../../domain/aggregates/TrainerProfile';
import { ITrainerProfileDocument } from '../models/TrainerProfileModel';
import { TrainerLocation } from '../../../../domain/value-objects/TrainerLocation';
import { TrainerAvailability } from '../../../../domain/value-objects/TrainerAvailability';
import { TrainerCertification } from '../../../../domain/entities/TrainerCertification';
import { TrainerShowcase } from '../../../../domain/entities/TrainerShowcase';

export class TrainerProfilePersistenceMapper {
  public static toDomain(doc: ITrainerProfileDocument): TrainerProfile {
    const locationResult = TrainerLocation.create(
      doc.location.city,
      doc.location.state,
      doc.location.country,
    );
    if (locationResult.isFailure) {
      throw new Error(`Invalid location in document: ${locationResult.error}`);
    }

    const availabilityResult = TrainerAvailability.create(
      doc.availability.status,
      doc.availability.timezone,
      doc.availability.weeklySchedule || [],
    );
    if (availabilityResult.isFailure) {
      throw new Error(`Invalid availability in document: ${availabilityResult.error}`);
    }

    const certifications: TrainerCertification[] = (doc.certifications || []).map((c) => {
      const certRes = TrainerCertification.create(
        {
          title: c.title,
          organization: c.organization,
          issuedAt: c.issuedAt,
          expiresAt: c.expiresAt || undefined,
          certificateUrl: c.certificateUrl,
          status: c.status,
          rejectionReason: c.rejectionReason || undefined,
          verifiedAt: c.verifiedAt || undefined,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
        },
        c._id,
      );
      if (certRes.isFailure) {
        throw new Error(`Invalid certification subdocument: ${certRes.error}`);
      }
      return certRes.getValue();
    });

    const showcaseItems: TrainerShowcase[] = (doc.showcase || []).map((s) => {
      const showRes = TrainerShowcase.create(
        {
          type: s.type,
          title: s.title,
          description: s.description,
          mediaUrl: s.mediaUrl || undefined,
          issuedBy: s.issuedBy || undefined,
          achievedAt: s.achievedAt || undefined,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
        },
        s._id,
      );
      if (showRes.isFailure) {
        throw new Error(`Invalid showcase subdocument: ${showRes.error}`);
      }
      return showRes.getValue();
    });

    const profileResult = TrainerProfile.create(
      {
        userId: doc.userId,
        headline: doc.headline,
        bio: doc.bio,
        avatarUrl: doc.avatarUrl,
        yearsOfExperience: doc.yearsOfExperience,
        languages: doc.languages || [],
        specializations: doc.specializations || [],
        certifications,
        location: locationResult.getValue(),
        availability: availabilityResult.getValue(),
        totalClients: doc.totalClients,
        totalReviews: doc.totalReviews,
        averageRating: doc.averageRating,
        profileCompleted: doc.profileCompleted,
        showcase: showcaseItems,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      },
      doc._id.toString(),
    );

    if (profileResult.isFailure) {
      throw new Error(`Failed to map TrainerProfile document to Domain: ${profileResult.error}`);
    }

    return profileResult.getValue();
  }

  public static toPersistence(profile: TrainerProfile): Record<string, unknown> {
    return {
      _id: profile.id,
      userId: profile.userId,
      headline: profile.headline,
      bio: profile.bio,
      avatarUrl: profile.avatarUrl || null,
      yearsOfExperience: profile.yearsOfExperience,
      languages: profile.languages,
      specializations: profile.specializations,
      certifications: profile.certifications.map((c) => ({
        _id: c.certificationId,
        title: c.title,
        organization: c.organization,
        issuedAt: c.issuedAt,
        expiresAt: c.expiresAt || null,
        certificateUrl: c.certificateUrl,
        status: c.status,
        rejectionReason: c.rejectionReason || null,
        verifiedAt: c.verifiedAt || null,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
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
        _id: s.showcaseId,
        type: s.type,
        title: s.title,
        description: s.description,
        mediaUrl: s.mediaUrl || null,
        issuedBy: s.issuedBy || null,
        achievedAt: s.achievedAt || null,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      })),
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}
