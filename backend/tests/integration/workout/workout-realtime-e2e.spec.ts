import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import http from 'http';
import jwt from 'jsonwebtoken';
import { io as ClientSocket, Socket as ClientSocketType } from 'socket.io-client';
import request from 'supertest';
import mongoose from 'mongoose';
import { env } from '../../../src/config/env.config';
import { configureContainer } from '../../../src/bootstrap/dependency-injection/container';
import { createApp } from '../../../src/bootstrap/http/app';
import { SocketIOManager } from '../../../src/infrastructure/websocket/SocketIOManager';
import { ExerciseModel } from '../../../src/modules/workout/infrastructure/persistence/mongoose/schemas/exercise.schema';
import { CoachingRelationshipModel } from '../../../src/modules/coaching/infrastructure/persistence/mongoose/schemas/coaching-relationship.schema';
import { WorkoutProgramModel } from '../../../src/modules/workout/infrastructure/persistence/mongoose/schemas/workout-program.schema';

describe('Workout Realtime End-to-End Propagation & Isolation Verification', () => {
  let server: http.Server;
  let app: any;
  let socketManager: SocketIOManager;
  let serverPort: number;
  let serverUrl: string;

  let trainerToken: string;
  let clientAToken: string;
  let clientBToken: string;

  let trainerSocket: ClientSocketType;
  let clientASocket: ClientSocketType;
  let clientBSocket: ClientSocketType;

  const trainerId = 'usr_trainer_realtime_01';
  const clientAId = 'usr_client_realtime_a';
  const clientBId = 'usr_client_realtime_b';

  const relAId = 'cr_realtime_trainer_client_a';
  const relBId = 'cr_realtime_trainer_client_b';

  const generateTestToken = (userId: string, role: string) => {
    return jwt.sign(
      {
        sub: userId,
        role,
        jti: `jti_${userId}_${Date.now()}`,
      },
      env.JWT_ACCESS_SECRET,
      { algorithm: 'HS256', expiresIn: '1h' },
    );
  };

  beforeAll(async () => {
    const container = configureContainer();
    app = createApp(container);
    socketManager = container.resolve<SocketIOManager>('socketIOManager');

    server = http.createServer(app);
    socketManager.initialize(server);

    await new Promise<void>((resolve) => {
      server.listen(0, () => {
        const addr = server.address() as any;
        serverPort = addr.port;
        serverUrl = `http://localhost:${serverPort}`;
        resolve();
      });
    });

    trainerToken = generateTestToken(trainerId, 'TRAINER');
    clientAToken = generateTestToken(clientAId, 'CLIENT');
    clientBToken = generateTestToken(clientBId, 'CLIENT');
  });

  afterAll(async () => {
    trainerSocket?.disconnect();
    clientASocket?.disconnect();
    clientBSocket?.disconnect();

    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  beforeEach(async () => {
    // Clear collections
    await ExerciseModel.deleteMany({});
    await CoachingRelationshipModel.deleteMany({});
    await WorkoutProgramModel.deleteMany({});

    // Seed test exercise
    await ExerciseModel.create({
      _id: 'ex_test_bench',
      name: 'Test Bench Press',
      slug: 'test-bench-press',
      category: 'Chest',
      primaryMuscleGroup: 'CHEST',
      secondaryMuscleGroups: ['TRICEPS', 'SHOULDERS'],
      equipment: 'BARBELL',
      difficulty: 'INTERMEDIATE',
      instructions: [
        { step: 1, instruction: 'Unrack barbell' },
        { step: 2, instruction: 'Lower to chest' },
        { step: 3, instruction: 'Press upward' },
      ],
      caloriesPerMinute: 6,
      status: 'ACTIVE',
      origin: 'PLATFORM',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Seed Coaching Relationships
    await CoachingRelationshipModel.create([
      {
        _id: relAId,
        trainerId,
        clientId: clientAId,
        acquisitionPipelineId: 'pipe_realtime_a',
        subscriptionId: 'sub_realtime_a',
        paymentId: 'pay_realtime_a',
        status: 'ACTIVE',
        packageType: 'MONTHLY_COACHING',
        startDate: new Date(),
        version: 1,
      },
      {
        _id: relBId,
        trainerId,
        clientId: clientBId,
        acquisitionPipelineId: 'pipe_realtime_b',
        subscriptionId: 'sub_realtime_b',
        paymentId: 'pay_realtime_b',
        status: 'ACTIVE',
        packageType: 'MONTHLY_COACHING',
        startDate: new Date(),
        version: 1,
      },
    ]);
  });

  it('verifies full realtime chain: Trainer activates program -> Client A receives event -> Client B isolated -> Client A fetches active program without refresh', async () => {
    // 1. Establish live Socket.IO connections
    clientASocket = ClientSocket(serverUrl, {
      auth: { token: `Bearer ${clientAToken}` },
      transports: ['websocket'],
    });

    clientBSocket = ClientSocket(serverUrl, {
      auth: { token: `Bearer ${clientBToken}` },
      transports: ['websocket'],
    });

    trainerSocket = ClientSocket(serverUrl, {
      auth: { token: `Bearer ${trainerToken}` },
      transports: ['websocket'],
    });

    await Promise.all([
      new Promise<void>((res) => clientASocket.on('connect', () => res())),
      new Promise<void>((res) => clientBSocket.on('connect', () => res())),
      new Promise<void>((res) => trainerSocket.on('connect', () => res())),
    ]);

    expect(clientASocket.connected).toBe(true);
    expect(clientBSocket.connected).toBe(true);
    expect(trainerSocket.connected).toBe(true);

    // Track received events
    const clientAEvents: any[] = [];
    const clientBEvents: any[] = [];
    const trainerEvents: any[] = [];

    clientASocket.on('workout:program_activated', (data) => clientAEvents.push(data));
    clientBSocket.on('workout:program_activated', (data) => clientBEvents.push(data));
    trainerSocket.on('workout:program_activated', (data) => trainerEvents.push(data));

    // 2. Trainer creates a Workout Program for Client A
    const createRes = await request(app)
      .post('/api/v1/workout-programs')
      .set('Authorization', `Bearer ${trainerToken}`)
      .send({
        coachingRelationshipId: relAId,
        title: 'Hypertrophy Block Client A',
        goal: 'MUSCLE_GAIN',
        schedule: { weeks: 4, sessionsPerWeek: 3 },
        weeks: [
          {
            weekNumber: 1,
            title: 'Week 1 Foundation',
            days: [
              {
                dayNumber: 1,
                title: 'Chest Day',
                exercises: [
                  {
                    exerciseId: 'ex_test_bench',
                    order: 1,
                    type: 'MAIN',
                    sets: 3,
                    reps: '8-10',
                    restSeconds: 90,
                  },
                ],
              },
            ],
          },
        ],
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.success).toBe(true);
    const createdProgram = createRes.body.data;
    expect(createdProgram.status).toBe('DRAFT');
    const programId = createdProgram.id;

    // 3. Trainer activates/publishes the Workout Program
    const activateRes = await request(app)
      .post(`/api/v1/workout-programs/${programId}/publish`)
      .set('Authorization', `Bearer ${trainerToken}`)
      .send();

    expect(activateRes.status).toBe(200);
    expect(activateRes.body.success).toBe(true);
    expect(activateRes.body.data.status).toBe('ACTIVE');

    // Wait 300ms for websocket event distribution
    await new Promise((res) => setTimeout(res, 300));

    // 4. Verify Realtime Event Assertions
    // Client A must receive EXACTLY ONE workout:program_activated event
    expect(clientAEvents.length).toBe(1);
    expect(clientAEvents[0].type).toBe('workout:program_activated');
    expect(clientAEvents[0].payload.programId).toBe(programId);
    expect(clientAEvents[0].payload.coachingRelationshipId).toBe(relAId);
    expect(clientAEvents[0].payload.clientId).toBe(clientAId);
    expect(clientAEvents[0].payload.trainerId).toBe(trainerId);

    // Multi-Client Isolation: Client B must receive ZERO events
    expect(clientBEvents.length).toBe(0);

    // Trainer also receives the event confirmation
    expect(trainerEvents.length).toBe(1);
    expect(trainerEvents[0].payload.programId).toBe(programId);

    // 5. Client A automatically queries active workout program (React Query cache invalidation response)
    const clientActiveRes = await request(app)
      .get('/api/v1/workout-programs/assigned')
      .set('Authorization', `Bearer ${clientAToken}`)
      .send();

    expect(clientActiveRes.status).toBe(200);
    expect(clientActiveRes.body.success).toBe(true);
    expect(clientActiveRes.body.data.id).toBe(programId);
    expect(clientActiveRes.body.data.status).toBe('ACTIVE');
    expect(clientActiveRes.body.data.title).toBe('Hypertrophy Block Client A');

    // 6. Verify Reconstitution Invariant: Loading already active workout produces 0 new activation events
    const initialClientAEventCount = clientAEvents.length;
    await request(app)
      .get('/api/v1/workout-programs/assigned')
      .set('Authorization', `Bearer ${clientAToken}`)
      .send();
    await request(app)
      .get(`/api/v1/workout-programs/${programId}`)
      .set('Authorization', `Bearer ${clientAToken}`)
      .send();

    await new Promise((res) => setTimeout(res, 200));
    expect(clientAEvents.length).toBe(initialClientAEventCount); // Still exactly 1, no spurious event on read

    // 7. Verify Idempotency: Activating already active program produces 0 duplicate activation events
    await request(app)
      .post(`/api/v1/workout-programs/${programId}/publish`)
      .set('Authorization', `Bearer ${trainerToken}`)
      .send();

    await new Promise((res) => setTimeout(res, 200));
    expect(clientAEvents.length).toBe(initialClientAEventCount); // Still exactly 1, no duplicate event
  });
});
