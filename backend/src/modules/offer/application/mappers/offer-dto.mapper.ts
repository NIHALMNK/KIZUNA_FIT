import { CoachingOffer } from '../../domain/aggregates/coaching-offer.aggregate';
import { CoachingOfferResponseDTO, PaginatedOffersResponseDTO } from '../dtos/offer-response.dto';

export class OfferDTOMapper {
  public static toDTO(offer: CoachingOffer): CoachingOfferResponseDTO {
    const pricing = offer.pricingSnapshot.toPrimitives();
    const scope = offer.scopeSnapshot.toPrimitives();

    return {
      offerId: offer.offerId,
      acquisitionPipelineId: offer.acquisitionPipelineId,
      consultationId: offer.consultationId,
      clientId: offer.clientId,
      trainerId: offer.trainerId,
      pricing: {
        trainerFee: pricing.trainerFee,
        platformFee: pricing.platformFee,
        totalAmount: pricing.totalAmount,
        currency: pricing.currency,
        commissionRate: pricing.commissionRate,
      },
      scope: {
        durationDays: scope.durationDays,
        planType: scope.planType,
        includedFeatures: scope.includedFeatures,
        trainerNotes: scope.trainerNotes,
      },
      status: offer.status,
      expiresAt: offer.expiresAt.toISOString(),
      acceptedAt: offer.acceptedAt ? offer.acceptedAt.toISOString() : null,
      declinedAt: offer.declinedAt ? offer.declinedAt.toISOString() : null,
      declineReason: offer.declineReason,
      createdAt: offer.createdAt.toISOString(),
      updatedAt: offer.updatedAt.toISOString(),
    };
  }

  public static toPaginatedDTO(
    offers: CoachingOffer[],
    totalRecords: number,
    page: number,
    limit: number,
  ): PaginatedOffersResponseDTO {
    const totalPages = Math.ceil(totalRecords / (limit > 0 ? limit : 10)) || 1;
    return {
      offers: offers.map((offer) => OfferDTOMapper.toDTO(offer)),
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages,
      },
    };
  }
}
