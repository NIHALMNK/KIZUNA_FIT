import { CoachingOffer } from '../../../../domain/aggregates/coaching-offer.aggregate';
import { PricingSnapshot } from '../../../../domain/value-objects/pricing-snapshot.value-object';
import { ScopeSnapshot } from '../../../../domain/value-objects/scope-snapshot.value-object';
import { ICoachingOfferDocument } from '../documents/coaching-offer.document';

export class CoachingOfferPersistenceMapper {
  public static toDomain(doc: ICoachingOfferDocument): CoachingOffer {
    const pricingResult = PricingSnapshot.create({
      trainerFee: doc.pricingSnapshot.trainerFee,
      platformFee: doc.pricingSnapshot.platformFee,
      totalAmount: doc.pricingSnapshot.totalAmount,
      currency: doc.pricingSnapshot.currency,
      commissionRate: doc.pricingSnapshot.commissionRate ?? 0,
    });

    if (pricingResult.isFailure) {
      throw new Error(
        `Failed to reconstruct PricingSnapshot value object from document: ${pricingResult.error}`,
      );
    }

    const scopeResult = ScopeSnapshot.create({
      durationDays: doc.scopeSnapshot.durationDays,
      planType: doc.scopeSnapshot.planType,
      includedFeatures: doc.scopeSnapshot.includedFeatures,
      trainerNotes: doc.scopeSnapshot.trainerNotes || undefined,
    });

    if (scopeResult.isFailure) {
      throw new Error(
        `Failed to reconstruct ScopeSnapshot value object from document: ${scopeResult.error}`,
      );
    }

    const offerResult = CoachingOffer.create(
      {
        acquisitionPipelineId: doc.acquisitionPipelineId,
        consultationId: doc.consultationId,
        clientId: doc.clientId,
        trainerId: doc.trainerId,
        pricingSnapshot: pricingResult.getValue(),
        scopeSnapshot: scopeResult.getValue(),
        status: doc.status,
        expiresAt: doc.expiresAt,
        acceptedAt: doc.acceptedAt || null,
        declinedAt: doc.declinedAt || null,
        declineReason: doc.declineReason || null,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      },
      doc._id,
    );

    if (offerResult.isFailure) {
      throw new Error(
        `Failed to reconstruct CoachingOffer aggregate root from document: ${offerResult.error}`,
      );
    }

    return offerResult.getValue();
  }

  public static toPersistence(aggregate: CoachingOffer): Record<string, unknown> {
    const pricing = aggregate.pricingSnapshot.toPrimitives();
    const scope = aggregate.scopeSnapshot.toPrimitives();

    return {
      _id: aggregate.offerId,
      acquisitionPipelineId: aggregate.acquisitionPipelineId,
      consultationId: aggregate.consultationId,
      clientId: aggregate.clientId,
      trainerId: aggregate.trainerId,
      pricingSnapshot: {
        trainerFee: pricing.trainerFee,
        platformFee: pricing.platformFee,
        totalAmount: pricing.totalAmount,
        currency: pricing.currency,
        commissionRate: pricing.commissionRate,
      },
      scopeSnapshot: {
        durationDays: scope.durationDays,
        planType: scope.planType,
        includedFeatures: scope.includedFeatures,
        trainerNotes: scope.trainerNotes || null,
      },
      status: aggregate.status,
      expiresAt: aggregate.expiresAt,
      acceptedAt: aggregate.acceptedAt || null,
      declinedAt: aggregate.declinedAt || null,
      declineReason: aggregate.declineReason || null,
      createdAt: aggregate.createdAt,
      updatedAt: aggregate.updatedAt,
    };
  }
}
