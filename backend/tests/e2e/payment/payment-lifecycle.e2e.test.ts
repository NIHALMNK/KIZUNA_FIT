import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import express, { Express } from 'express';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { createApp } from '../../../src/bootstrap/http/app';
import { configureContainer } from '../../../src/bootstrap/dependency-injection/container';
import { CoachingOffer } from '../../../src/modules/offer/domain/aggregates/coaching-offer.aggregate';
import { CoachingOfferStatus } from '../../../src/modules/offer/domain/enums/coaching-offer-status.enum';
import { PricingSnapshot } from '../../../src/modules/offer/domain/value-objects/pricing-snapshot.value-object';
import { ScopeSnapshot } from '../../../src/modules/offer/domain/value-objects/scope-snapshot.value-object';
import { CoachingPlanType } from '../../../src/modules/offer/domain/enums/coaching-plan-type.enum';
import { ICoachingOfferRepository } from '../../../src/modules/offer/domain/repositories/coaching-offer.repository';
import { IAcquisitionPipelineRepository } from '../../../src/modules/marketplace/domain/repositories/acquisition-pipeline.repository';
import { AcquisitionPipeline } from '../../../src/modules/marketplace/domain/aggregates/acquisition-pipeline.aggregate';
import { TrainerRequest } from '../../../src/modules/marketplace/domain/entities/trainer-request.entity';
import { TrainerSnapshot } from '../../../src/modules/marketplace/domain/value-objects/trainer-snapshot.value-object';
import { AcquisitionPipelineStatus } from '../../../src/modules/marketplace/domain/enums/acquisition-pipeline-status.enum';
import { IPaymentRepository } from '../../../src/modules/payment/domain/repositories/payment.repository';
import { PaymentStatus } from '../../../src/modules/payment/domain/enums/payment-status.enum';
import { PayoutStatus } from '../../../src/modules/payment/domain/enums/payout-status.enum';
import { asValue } from 'awilix';
import { env } from '../../../src/config/env.config';

describe('Payment Domain Complete End-to-End (E2E) Integration Tests', () => {
  let mongoServer: MongoMemoryReplSet;
  let app: Express;
  let container: any;

  const testSecret = env.JWT_ACCESS_SECRET;
  const webhookSecret =
    process.env.RAZORPAY_WEBHOOK_SECRET ||
    env.RAZORPAY_WEBHOOK_SECRET ||
    'test_webhook_secret_12345';
  process.env.RAZORPAY_WEBHOOK_SECRET = webhookSecret;
  process.env.RAZORPAY_KEY_ID = 'rzp_test_mock_key';
  process.env.RAZORPAY_KEY_SECRET = 'rzp_test_mock_secret';

  const clientId = '507f1f77bcf86cd799439012';
  const trainerId = '507f1f77bcf86cd799439011';
  const adminId = '507f1f77bcf86cd799439099';

  const clientToken = jwt.sign({ sub: clientId, role: 'CLIENT', jti: 'jti_c1' }, testSecret);
  const trainerToken = jwt.sign({ sub: trainerId, role: 'TRAINER', jti: 'jti_t1' }, testSecret);
  const adminToken = jwt.sign({ sub: adminId, role: 'ADMIN', jti: 'jti_a1' }, testSecret);

  beforeAll(async () => {
    mongoServer = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
    const mongoUri = mongoServer.getUri();

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }

    container = configureContainer();

    const mockGateway: any = {
      createOrder: vi.fn().mockImplementation(async (params: any) => ({
        providerOrderId: `order_rzp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        amount: params.amount,
        currency: params.currency,
        keyId: 'rzp_test_mock_key',
      })),
      verifyPayment: vi.fn().mockImplementation(async (params: any) => ({
        isValid: true,
        providerPaymentId: params.providerPaymentId,
        providerOrderId: params.providerOrderId,
        amount: 10000,
        currency: 'INR',
        status: 'captured',
      })),
      fetchPayment: vi.fn().mockResolvedValue({
        providerPaymentId: 'pay_rzp_mock_999',
        providerOrderId: 'order_rzp_mock_123',
        amount: 10000,
        currency: 'INR',
        status: 'captured',
      }),
      processRefund: vi.fn().mockResolvedValue({
        gatewayRefundId: 'rfnd_rzp_mock_123',
        amount: 8000,
        currency: 'INR',
        status: 'processed',
      }),
      processPayout: vi.fn().mockResolvedValue({
        gatewayPayoutId: 'trf_rzp_mock_777',
        amount: 8000,
        currency: 'INR',
        status: 'processed',
      }),
    };
    container.register('paymentGateway', asValue(mockGateway));
    container.register('gatewayPort', asValue(mockGateway));

    app = createApp(container) as Express;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    if (mongoose.connection.readyState !== 0) {
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        await collections[key].deleteMany({});
      }
    }
  });

  const createHelperOffer = async (
    offerId: string,
    pipelineId: string,
    status: CoachingOfferStatus = CoachingOfferStatus.ACCEPTED,
    total = 10000,
  ) => {
    const offerRepo = container.resolve('offerRepo') as ICoachingOfferRepository;
    const pipelineRepo = container.resolve('pipelineRepo') as IAcquisitionPipelineRepository;

    const validPipelineId = new mongoose.Types.ObjectId().toHexString();

    const requestResult = TrainerRequest.create({
      clientGoal: 'Marathon preparation',
      clientMessage: 'Let us start coaching',
    });

    const snapshotResult = TrainerSnapshot.create({
      trainerId,
      fullName: 'Trainer Alex',
      headline: 'Elite Coach',
      profileImage: 'https://cdn.kizunafit.com/avatar.jpg',
      specializations: ['Running'],
      yearsOfExperience: 5,
      averageRating: 4.9,
      totalReviews: 20,
    });

    const pipeline = AcquisitionPipeline.create(
      {
        clientId,
        trainerId,
        trainerRequest: requestResult.getValue()!,
        trainerSnapshot: snapshotResult.getValue()!,
      },
      validPipelineId,
    ).getValue()!;

    pipeline.accept();
    pipeline.scheduleConsultation();
    pipeline.completeConsultation();
    pipeline.sendOffer();
    if (status === CoachingOfferStatus.ACCEPTED) {
      pipeline.acceptOffer();
    }
    await pipelineRepo.save(pipeline);

    // Create & save offer
    const pricingSnapshot = PricingSnapshot.create({
      trainerFee: total * 0.8, // 8,000
      platformFee: total * 0.2, // 2,000
      totalAmount: total,
      currency: 'INR',
      commissionRate: 0.25,
    }).getValue()!;

    const scopeSnapshot = ScopeSnapshot.create({
      durationDays: 30,
      planType: CoachingPlanType.PRO,
      includedFeatures: ['Custom Workout', 'Weekly Check-in'],
      trainerNotes: 'Personalized marathon plan',
    }).getValue()!;

    const offer = CoachingOffer.create(
      {
        acquisitionPipelineId: pipeline.id,
        consultationId: 'cons_123',
        clientId,
        trainerId,
        pricingSnapshot,
        scopeSnapshot,
        status,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      offerId,
    ).getValue()!;

    await offerRepo.save(offer);
    return { offer, pipeline };
  };

  const generateSignature = (payload: object | string): string => {
    const data = typeof payload === 'string' ? payload : JSON.stringify(payload);
    return crypto.createHmac('sha256', webhookSecret).update(data).digest('hex');
  };

  describe('1. Full End-to-End Payment & Payout Lifecycle', () => {
    it('should complete the entire multi-domain lifecycle: Offer -> Payment -> Webhook -> Conversion -> Payout -> Settlement', async () => {
      const offerId = 'off_e2e_001';
      const { pipeline } = await createHelperOffer(
        offerId,
        'pipe_e2e_001',
        CoachingOfferStatus.ACCEPTED,
        10000,
      );

      // --- Step 1: Client Initiates Payment ---
      const initRes = await request(app)
        .post('/api/v1/payments')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({ offerId })
        .expect(201);

      expect(initRes.body.status).toBe('ok');
      const paymentData = initRes.body.data;
      expect(paymentData.paymentId).toBeDefined();
      expect(paymentData.offerId).toBe(offerId);
      expect(paymentData.totalAmount).toBe(10000);
      expect(paymentData.status).toBe(PaymentStatus.PROCESSING);
      expect(paymentData.providerOrderId).toBeDefined();

      const paymentId = paymentData.paymentId;
      const providerOrderId = paymentData.providerOrderId;

      // --- Step 2: Webhook payment.captured arrives from Razorpay ---
      const webhookPayload = {
        event: 'payment.captured',
        id: 'evt_pay_cap_001',
        payload: {
          payment: {
            entity: {
              id: 'pay_rzp_mock_999',
              order_id: providerOrderId,
              amount: 1000000, // in paise = ₹10,000
              currency: 'INR',
              status: 'captured',
            },
          },
        },
      };

      const webhookBody = JSON.stringify(webhookPayload);
      const signature = generateSignature(webhookBody);

      const webhookRes = await request(app)
        .post('/api/v1/payments/webhook/razorpay')
        .set('x-razorpay-signature', signature)
        .set('Content-Type', 'application/json')
        .send(webhookBody)
        .expect(200);

      expect(webhookRes.body.status).toBe('ok');
      expect(webhookRes.body.data.status).toBe('success');

      // --- Step 3: Verify Payment Aggregate is SUCCESS ---
      const getPaymentRes = await request(app)
        .get(`/api/v1/payments/${paymentId}`)
        .set('Authorization', `Bearer ${clientToken}`)
        .expect(200);

      expect(getPaymentRes.body.data.status).toBe(PaymentStatus.SUCCESS);
      expect(getPaymentRes.body.data.providerPaymentId).toBe('pay_rzp_mock_999');

      // --- Step 4: Verify Cross-Domain Marketplace Conversion ---
      const pipelineRepo = container.resolve('pipelineRepo') as IAcquisitionPipelineRepository;
      const updatedPipeline = await pipelineRepo.findById(pipeline.id);
      expect(updatedPipeline).not.toBeNull();
      expect(updatedPipeline!.status).toBe(AcquisitionPipelineStatus.CONVERTED);

      // --- Step 5: Check Payout Eligibility Before Review Window (0 days) ---
      const paymentRepo = container.resolve('paymentRepo') as IPaymentRepository;
      const paymentAgg = await paymentRepo.findById(paymentId);
      expect(paymentAgg).not.toBeNull();

      // Activate and complete subscription today
      paymentAgg!.subscription.activate(
        new Date(),
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      );
      paymentAgg!.completeSubscription(new Date());
      await paymentRepo.save(paymentAgg!);

      const earlyEligRes = await request(app)
        .get(`/api/v1/payments/${paymentId}/payout/eligibility`)
        .set('Authorization', `Bearer ${trainerToken}`)
        .expect(200);

      expect(earlyEligRes.body.data.isEligible).toBe(false);

      // Simulate 4 days elapsed past completion
      paymentAgg!.payout.markEligible(new Date(Date.now() - 1000));
      await paymentRepo.save(paymentAgg!);

      const matureEligRes = await request(app)
        .get(`/api/v1/payments/${paymentId}/payout/eligibility`)
        .set('Authorization', `Bearer ${trainerToken}`)
        .expect(200);

      expect(matureEligRes.body.data.isEligible).toBe(true);
      expect(matureEligRes.body.data.eligibleAmount).toBe(8000);

      // --- Step 6: Admin Processes Payout ---
      const processPayoutRes = await request(app)
        .post(`/api/v1/payments/${paymentId}/payout/process`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ idempotencyKey: 'idemp_e2e_payout_1' })
        .expect(200);

      expect(processPayoutRes.body.data.status).toBe(PayoutStatus.PAID);

      // --- Step 7: Webhook transfer.processed arrives from Razorpay Route ---
      const transferWebhookPayload = {
        event: 'transfer.processed',
        id: 'evt_trf_proc_001',
        payload: {
          transfer: {
            entity: {
              id: 'trf_rzp_mock_777',
              payment_id: 'pay_rzp_mock_999',
              amount: 800000,
              currency: 'INR',
              status: 'processed',
            },
          },
        },
      };

      const transferBody = JSON.stringify(transferWebhookPayload);
      const transferSig = generateSignature(transferBody);

      await request(app)
        .post('/api/v1/payments/webhook/razorpay')
        .set('x-razorpay-signature', transferSig)
        .set('Content-Type', 'application/json')
        .send(transferBody)
        .expect(200);

      // --- Step 8: Retrieve Settlement Snapshot ---
      const settlementRes = await request(app)
        .get(`/api/v1/payments/${paymentId}/settlement`)
        .set('Authorization', `Bearer ${trainerToken}`)
        .expect(200);

      expect(settlementRes.body.data.trainerAmount).toBe(8000);
      expect(settlementRes.body.data.platformAmount).toBe(2000);
      expect(settlementRes.body.data.currency).toBe('INR');
      expect(settlementRes.body.data.settledAt).toBeDefined();

      // --- Step 9: Replay duplicate transfer webhook -> idempotent no duplicate ---
      const replayRes = await request(app)
        .post('/api/v1/payments/webhook/razorpay')
        .set('x-razorpay-signature', transferSig)
        .set('Content-Type', 'application/json')
        .send(transferBody)
        .expect(200);

      expect(replayRes.body.data.status).toBe('ignored');
    });
  });

  describe('2. Failure Cases & Invariant Protections', () => {
    it('A. Should reject payment initiation for an Offer that is not ACCEPTED', async () => {
      const offerId = 'off_draft_001';
      await createHelperOffer(offerId, 'pipe_draft_001', CoachingOfferStatus.SENT, 10000);

      const res = await request(app)
        .post('/api/v1/payments')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({ offerId })
        .expect(400);

      expect(res.body.error).toContain('ACCEPTED');
    });

    it('B. Should reject duplicate payment initiation for the same Offer with HTTP 409', async () => {
      const offerId = 'off_dup_001';
      await createHelperOffer(offerId, 'pipe_dup_001', CoachingOfferStatus.ACCEPTED, 10000);

      // First initiation
      await request(app)
        .post('/api/v1/payments')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({ offerId })
        .expect(201);

      // Duplicate initiation
      const dupRes = await request(app)
        .post('/api/v1/payments')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({ offerId })
        .expect(409);

      expect(dupRes.body.error).toContain('already exists');
    });

    it('C. Should strictly reject Razorpay webhook with invalid signature with HTTP 400', async () => {
      const fakePayload = { event: 'payment.captured', id: 'evt_fake_001' };

      const res = await request(app)
        .post('/api/v1/payments/webhook/razorpay')
        .set('x-razorpay-signature', 'invalid_cryptographic_signature')
        .set('Content-Type', 'application/json')
        .send(fakePayload)
        .expect(400);

      expect(res.body.error).toContain('signature');
    });

    it('D. Should block payout processing while an active dispute exists', async () => {
      const offerId = 'off_disp_001';
      await createHelperOffer(offerId, 'pipe_disp_001', CoachingOfferStatus.ACCEPTED, 10000);

      const initRes = await request(app)
        .post('/api/v1/payments')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({ offerId });
      const paymentId = initRes.body.data.paymentId;

      // Mark success & mature review window
      const paymentRepo = container.resolve('paymentRepo') as IPaymentRepository;
      const payment = await paymentRepo.findById(paymentId);
      payment!.markSuccess('pay_rzp_disp_1', initRes.body.data.providerOrderId);
      payment!.subscription.activate(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
      payment!.completeSubscription(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000));
      await paymentRepo.save(payment!);

      // Raise dispute
      await request(app)
        .post(`/api/v1/payments/${paymentId}/disputes`)
        .set('Authorization', `Bearer ${clientToken}`)
        .send({ reason: 'Trainer did not deliver scheduled sessions' })
        .expect(201);

      // Attempt to process payout -> Blocked
      const payoutRes = await request(app)
        .post(`/api/v1/payments/${paymentId}/payout/process`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ idempotencyKey: 'idemp_disp_payout' })
        .expect(400);

      expect(payoutRes.body.error).toContain('ON_HOLD');
    });

    it('E. Should block payout processing after an exceptional refund is approved', async () => {
      const offerId = 'off_ref_001';
      await createHelperOffer(offerId, 'pipe_ref_001', CoachingOfferStatus.ACCEPTED, 10000);

      const initRes = await request(app)
        .post('/api/v1/payments')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({ offerId });
      const paymentId = initRes.body.data.paymentId;

      const paymentRepo = container.resolve('paymentRepo') as IPaymentRepository;
      const payment = await paymentRepo.findById(paymentId);
      payment!.markSuccess('pay_rzp_ref_1', initRes.body.data.providerOrderId);
      payment!.subscription.activate(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
      payment!.completeSubscription(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000));
      await paymentRepo.save(payment!);

      // Client requests exceptional refund (trainer fee = 8,000)
      const refReqRes = await request(app)
        .post(`/api/v1/payments/${paymentId}/refunds`)
        .set('Authorization', `Bearer ${clientToken}`)
        .send({ reason: 'Trainer abandoned coaching service' })
        .expect(201);

      const refundId = refReqRes.body.data.refundId;

      // Admin approves refund
      await request(app)
        .patch(`/api/v1/payments/${paymentId}/refunds/${refundId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ notes: 'Verified abandonment' })
        .expect(200);

      // Admin processes refund via gateway
      await request(app)
        .post(`/api/v1/payments/${paymentId}/refunds/${refundId}/process`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      // Payout eligibility is now 0 and processing is blocked
      const eligRes = await request(app)
        .get(`/api/v1/payments/${paymentId}/payout/eligibility`)
        .set('Authorization', `Bearer ${trainerToken}`)
        .expect(200);

      expect(eligRes.body.data.isEligible).toBe(false);
      expect(eligRes.body.data.eligibleAmount).toBe(0);

      const payoutRes = await request(app)
        .post(`/api/v1/payments/${paymentId}/payout/process`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ idempotencyKey: 'idemp_ref_payout' })
        .expect(400);

      expect(payoutRes.body.error).toContain('Payout is not eligible');
    });

    it('F. Should deny Client from listing trainer payouts with HTTP 403', async () => {
      await request(app)
        .get('/api/v1/payments/payouts')
        .set('Authorization', `Bearer ${clientToken}`)
        .expect(403);
    });
  });
});
