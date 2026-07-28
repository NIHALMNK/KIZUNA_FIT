import { describe, it, expect, beforeEach, vi } from 'vitest';
import express, { Express } from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { marketplaceRouter } from '../../../src/modules/marketplace/routes';
import { AcquisitionPipelineFactory } from '../../../src/modules/marketplace/domain/factories/acquisition-pipeline.factory';
import { AcquisitionPipelineStatus } from '../../../src/modules/marketplace/domain/enums/acquisition-pipeline-status.enum';

describe('Marketplace API Endpoints (E2E)', () => {
  let app: Express;
  const testSecret = 'this_is_a_very_secure_test_secret_32_chars';

  const clientToken = jwt.sign(
    { sub: '507f1f77bcf86cd799439012', role: 'CLIENT', jti: 'jti_123' },
    testSecret,
  );

  const trainerToken = jwt.sign(
    { sub: '507f1f77bcf86cd799439011', role: 'TRAINER', jti: 'jti_456' },
    testSecret,
  );

  const sampleSnapshotProps = {
    trainerId: '507f1f77bcf86cd799439011',
    fullName: 'Trainer Alex',
    headline: 'Certified Fitness Specialist',
    profileImage: 'https://cdn.kizunafit.com/avatar.jpg',
    specializations: ['Endurance'],
    yearsOfExperience: 5,
    averageRating: 4.8,
    totalReviews: 40,
  };

  const createPipeline = () =>
    AcquisitionPipelineFactory.createNewPipeline({
      clientId: '507f1f77bcf86cd799439012',
      trainerId: '507f1f77bcf86cd799439011',
      clientGoal: 'Marathon preparation',
      clientMessage: 'Need weekly schedule',
      trainerSnapshot: sampleSnapshotProps,
    }).getValue();

  let activePipeline = createPipeline();

  const mockController = {
    create: vi.fn(async (req, res) => {
      res.status(201).json({
        success: true,
        data: {
          requestId: activePipeline.trainerRequest.requestId,
          pipelineId: activePipeline.id,
          status: AcquisitionPipelineStatus.REQUESTED,
        },
      });
    }),

    list: vi.fn(async (req, res) => {
      res.status(200).json({
        success: true,
        data: {
          requests: [
            {
              requestId: activePipeline.trainerRequest.requestId,
              status: activePipeline.status,
            },
          ],
          total: 1,
          page: 1,
          limit: 10,
        },
      });
    }),

    getPending: vi.fn(async (req, res) => {
      res.status(200).json({
        success: true,
        data: {
          requests: [{ requestId: activePipeline.trainerRequest.requestId }],
          total: 1,
        },
      });
    }),

    getHistory: vi.fn(async (req, res) => {
      res.status(200).json({
        success: true,
        data: { requests: [], total: 0 },
      });
    }),

    getById: vi.fn(async (req, res) => {
      res.status(200).json({
        success: true,
        data: {
          requestId: activePipeline.trainerRequest.requestId,
          pipelineId: activePipeline.id,
        },
      });
    }),

    accept: vi.fn(async (req, res) => {
      res.status(200).json({
        success: true,
        data: { status: AcquisitionPipelineStatus.ACCEPTED },
      });
    }),

    reject: vi.fn(async (req, res) => {
      res.status(200).json({
        success: true,
        data: { status: AcquisitionPipelineStatus.REJECTED },
      });
    }),

    withdraw: vi.fn(async (req, res) => {
      res.status(200).json({
        success: true,
        data: { status: AcquisitionPipelineStatus.WITHDRAWN },
      });
    }),

    close: vi.fn(async (req, res) => {
      res.status(200).json({
        success: true,
        data: { status: AcquisitionPipelineStatus.CLOSED },
      });
    }),
  };

  beforeEach(() => {
    activePipeline = createPipeline();
    app = express();
    app.use(express.json());

    // Inject Awilix scope resolution middleware
    app.use((req, _res, next) => {
      (req as unknown as Record<string, unknown>).scope = {
        resolve: (name: string) => {
          if (name === 'trainerRequestController') return mockController;
          throw new Error(`Unknown dependency: ${name}`);
        },
      };
      next();
    });

    app.use('/api/v1', marketplaceRouter());
  });

  it('POST /api/v1/trainer-requests — should create a new request (201 Created)', async () => {
    const response = await request(app)
      .post('/api/v1/trainer-requests')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        trainerId: '507f1f77bcf86cd799439011',
        goal: 'Marathon preparation',
        message: 'Need weekly schedule',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe(AcquisitionPipelineStatus.REQUESTED);
  });

  it('GET /api/v1/trainer-requests — should return paginated list of requests (200 OK)', async () => {
    const response = await request(app)
      .get('/api/v1/trainer-requests')
      .set('Authorization', `Bearer ${clientToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.requests.length).toBe(1);
  });

  it('GET /api/v1/trainer-requests/pending — should return pending requests (200 OK)', async () => {
    const response = await request(app)
      .get('/api/v1/trainer-requests/pending')
      .set('Authorization', `Bearer ${clientToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('GET /api/v1/trainer-requests/history — should return request history (200 OK)', async () => {
    const response = await request(app)
      .get('/api/v1/trainer-requests/history')
      .set('Authorization', `Bearer ${clientToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('GET /api/v1/trainer-requests/:requestId — should return request detail (200 OK)', async () => {
    const response = await request(app)
      .get('/api/v1/trainer-requests/req_123')
      .set('Authorization', `Bearer ${clientToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('POST /api/v1/trainer-requests/:requestId/accept — should accept request (200 OK)', async () => {
    const response = await request(app)
      .post('/api/v1/trainer-requests/req_123/accept')
      .set('Authorization', `Bearer ${trainerToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe(AcquisitionPipelineStatus.ACCEPTED);
  });

  it('POST /api/v1/trainer-requests/:requestId/reject — should reject request (200 OK)', async () => {
    const response = await request(app)
      .post('/api/v1/trainer-requests/req_123/reject')
      .set('Authorization', `Bearer ${trainerToken}`)
      .send({ reason: 'Fully booked' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('POST /api/v1/trainer-requests/:requestId/withdraw — should withdraw request (200 OK)', async () => {
    const response = await request(app)
      .post('/api/v1/trainer-requests/req_123/withdraw')
      .set('Authorization', `Bearer ${clientToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('POST /api/v1/trainer-requests/:requestId/close — should close request (200 OK)', async () => {
    const response = await request(app)
      .post('/api/v1/trainer-requests/req_123/close')
      .set('Authorization', `Bearer ${trainerToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('POST /api/v1/trainer-requests — should reject unauthorized access without token (401 Unauthorized)', async () => {
    const response = await request(app)
      .post('/api/v1/trainer-requests')
      .send({ trainerId: '507f1f77bcf86cd799439011', goal: 'Valid Goal' });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it('POST /api/v1/trainer-requests/:requestId/accept — should reject client attempting trainer endpoint (403 Forbidden)', async () => {
    const response = await request(app)
      .post('/api/v1/trainer-requests/req_123/accept')
      .set('Authorization', `Bearer ${clientToken}`);

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });
});
