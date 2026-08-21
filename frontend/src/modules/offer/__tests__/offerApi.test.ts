import { describe, it, expect, vi, beforeEach } from 'vitest';
import { offerApi } from '../infrastructure/api/offerApi';
import { httpClient } from '../../../../src/infrastructure/api/HttpClient';
import { CoachingOfferStatus, CoachingPlanType } from '../domain/types/offer.types';

vi.mock('../../../../src/infrastructure/api/HttpClient', () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('offerApi Client Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call POST /offers when createOffer is invoked with planType', async () => {
    const mockOffer = {
      offerId: 'offer_123',
      consultationId: 'consult_456',
      status: CoachingOfferStatus.SENT,
    };
    (httpClient.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockOffer);

    const payload = {
      consultationId: 'consult_456',
      planType: CoachingPlanType.PRO,
      trainerFee: 10000,
      currency: 'INR',
    };

    const res = await offerApi.createOffer(payload);
    expect(httpClient.post).toHaveBeenCalledWith('/offers', payload);
    expect(res).toEqual(mockOffer);
  });

  it('should call POST /offers/:id/send when sendOffer is invoked', async () => {
    (httpClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: CoachingOfferStatus.SENT,
    });

    await offerApi.sendOffer('offer_123');
    expect(httpClient.post).toHaveBeenCalledWith('/offers/offer_123/send', {});
  });

  it('should call POST /offers/:id/accept when acceptOffer is invoked', async () => {
    (httpClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: CoachingOfferStatus.ACCEPTED,
    });

    await offerApi.acceptOffer('offer_123');
    expect(httpClient.post).toHaveBeenCalledWith('/offers/offer_123/accept', {});
  });

  it('should call POST /offers/:id/decline when declineOffer is invoked', async () => {
    (httpClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: CoachingOfferStatus.DECLINED,
    });

    await offerApi.declineOffer('offer_123', { reason: 'Too expensive' });
    expect(httpClient.post).toHaveBeenCalledWith('/offers/offer_123/decline', {
      reason: 'Too expensive',
    });
  });

  it('should call GET /offers/sent when getSentOffers is invoked', async () => {
    (httpClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ offers: [], pagination: {} });

    await offerApi.getSentOffers({ page: 1, limit: 10 });
    expect(httpClient.get).toHaveBeenCalledWith('/offers/sent', {
      params: { page: 1, limit: 10 },
    });
  });

  it('should call GET /offers/received when getReceivedOffers is invoked', async () => {
    (httpClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ offers: [], pagination: {} });

    await offerApi.getReceivedOffers({ status: CoachingOfferStatus.SENT });
    expect(httpClient.get).toHaveBeenCalledWith('/offers/received', {
      params: { status: CoachingOfferStatus.SENT },
    });
  });
});
