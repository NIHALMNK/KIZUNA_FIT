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
import { CoachingRelationshipModel } from '../../../src/modules/coaching/infrastructure/persistence/mongoose/schemas/coaching-relationship.schema';
import { NutritionPlanModel } from '../../../src/modules/nutrition/infrastructure/persistence/mongoose/schemas/nutrition-plan.schema';
import { NutritionCompletionModel } from '../../../src/modules/nutrition/infrastructure/persistence/mongoose/schemas/nutrition-completion.schema';

describe('Nutrition Realtime End-to-End Propagation & Isolation Verification', () => {
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

  const trainerId = 'usr_trainer_nutrition_rt_01';
  const clientAId = 'usr_client_nutrition_rt_a';
  const clientBId = 'usr_client_nutrition_rt_b';

  const relAId = 'cr_nutrition_trainer_client_a';
  const relBId = 'cr_nutrition_trainer_client_b';

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

  const sampleNutritionDays = [1, 2, 3, 4, 5, 6, 7].map((d) => ({
    dayNumber: d,
    name: `Training Day ${d}`,
    targetCalories: 2500,
    dailyMacroTargets: {
      calories: 2500,
      protein: 180,
      carbohydrates: 300,
      fats: 65,
    },
    hydrationGoal: {
      targetMl: 3500,
      notes: 'Drink with electrolytes',
    },
    meals: [
      {
        id: `meal_breakfast_0${d}`,
        mealType: 'BREAKFAST',
        name: 'Power Oatmeal',
        timeOfDay: '08:00',
        targetCalories: 600,
        targetMacros: {
          calories: 600,
          protein: 40,
          carbohydrates: 80,
          fats: 12,
        },
        foodEntries: [
          {
            name: 'Rolled Oats',
            quantity: 100,
            unit: 'g',
            calories: 380,
            protein: 13,
            carbohydrates: 68,
            fats: 7,
          },
          {
            name: 'Whey Protein Isolate',
            quantity: 30,
            unit: 'g',
            calories: 120,
            protein: 27,
            carbohydrates: 1,
            fats: 1,
          },
        ],
      },
    ],
  }));

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

  afterEach(() => {
    trainerSocket?.disconnect();
    clientASocket?.disconnect();
    clientBSocket?.disconnect();
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
    await CoachingRelationshipModel.deleteMany({});
    await NutritionPlanModel.deleteMany({});
    await NutritionCompletionModel.deleteMany({});

    // Seed Coaching Relationships
    await CoachingRelationshipModel.create([
      {
        _id: relAId,
        trainerId,
        clientId: clientAId,
        acquisitionPipelineId: 'pipe_nutrition_a',
        subscriptionId: 'sub_nutrition_a',
        paymentId: 'pay_nutrition_a',
        status: 'ACTIVE',
        packageType: 'MONTHLY_COACHING',
        startDate: new Date(),
        version: 1,
      },
      {
        _id: relBId,
        trainerId,
        clientId: clientBId,
        acquisitionPipelineId: 'pipe_nutrition_b',
        subscriptionId: 'sub_nutrition_b',
        paymentId: 'pay_nutrition_b',
        status: 'ACTIVE',
        packageType: 'MONTHLY_COACHING',
        startDate: new Date(),
        version: 1,
      },
    ]);
  });

  it('verifies full realtime chain: Plan creation, activation, versioning, replacement completion & multi-client isolation', async () => {
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

    const eventNames = [
      'nutrition:plan_created',
      'nutrition:plan_activated',
      'nutrition:plan_completed',
      'nutrition:completion_started',
      'nutrition:completion_updated',
      'nutrition:completed',
    ];

    for (const evt of eventNames) {
      clientASocket.on(evt, (data) => clientAEvents.push({ event: evt, data }));
      clientBSocket.on(evt, (data) => clientBEvents.push({ event: evt, data }));
      trainerSocket.on(evt, (data) => trainerEvents.push({ event: evt, data }));
    }

    // 2. Trainer creates a NutritionPlan for Client A
    const createRes = await request(app)
      .post('/api/v1/nutrition-plans')
      .set('Authorization', `Bearer ${trainerToken}`)
      .send({
        coachingRelationshipId: relAId,
        title: 'Mass Gain Nutrition Plan V1',
        description: 'Initial bulk phase nutrition',
        durationWeeks: 4,
        nutritionDays: sampleNutritionDays,
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.success).toBe(true);
    const planV1Id = createRes.body.data.id;

    await new Promise((res) => setTimeout(res, 200));

    // nutrition:plan_created should have been emitted to Client A & Trainer
    const planCreatedClientA = clientAEvents.filter((e) => e.event === 'nutrition:plan_created');
    const planCreatedTrainer = trainerEvents.filter((e) => e.event === 'nutrition:plan_created');
    const planCreatedClientB = clientBEvents.filter((e) => e.event === 'nutrition:plan_created');

    expect(planCreatedClientA.length).toBe(1);
    expect(planCreatedClientA[0].data.payload.planId).toBe(planV1Id);
    expect(planCreatedTrainer.length).toBe(1);
    expect(planCreatedClientB.length).toBe(0); // Client B isolated

    // 3. Trainer submits V1 for approval, then Client A accepts
    const submitV1Res = await request(app)
      .post(`/api/v1/nutrition-plans/${planV1Id}/submit`)
      .set('Authorization', `Bearer ${trainerToken}`)
      .send();

    expect(submitV1Res.status).toBe(200);
    expect(submitV1Res.body.success).toBe(true);
    expect(submitV1Res.body.data.status).toBe('PENDING_APPROVAL');

    const activateRes = await request(app)
      .post(`/api/v1/nutrition-plans/${planV1Id}/accept`)
      .set('Authorization', `Bearer ${clientAToken}`)
      .send();

    expect(activateRes.status).toBe(200);
    expect(activateRes.body.success).toBe(true);
    expect(activateRes.body.data.status).toBe('ACTIVE');

    await new Promise((res) => setTimeout(res, 200));

    // nutrition:plan_activated emitted to Client A & Trainer
    const planActivatedClientA = clientAEvents.filter(
      (e) => e.event === 'nutrition:plan_activated',
    );
    const planActivatedTrainer = trainerEvents.filter(
      (e) => e.event === 'nutrition:plan_activated',
    );
    const planActivatedClientB = clientBEvents.filter(
      (e) => e.event === 'nutrition:plan_activated',
    );

    expect(planActivatedClientA.length).toBe(1);
    expect(planActivatedClientA[0].data.payload.planId).toBe(planV1Id);
    expect(planActivatedTrainer.length).toBe(1);
    expect(planActivatedClientB.length).toBe(0); // Client B isolated

    // 4. Trainer creates a Version 2 from V1
    const versionRes = await request(app)
      .post(`/api/v1/nutrition-plans/${planV1Id}/version`)
      .set('Authorization', `Bearer ${trainerToken}`)
      .send();

    expect(versionRes.status).toBe(201);
    expect(versionRes.body.success).toBe(true);
    const planV2Id = versionRes.body.data.id;
    expect(versionRes.body.data.version).toBe(2);
    expect(versionRes.body.data.status).toBe('DRAFT');

    await new Promise((res) => setTimeout(res, 200));

    const v2CreatedClientA = clientAEvents.filter(
      (e) => e.event === 'nutrition:plan_created' && e.data.payload.planId === planV2Id,
    );
    expect(v2CreatedClientA.length).toBe(1);
    expect(v2CreatedClientA[0].data.payload.version).toBe(2);

    // 5. Trainer submits V2 for review, then Client A accepts (atomic transition)
    const submitV2Res = await request(app)
      .post(`/api/v1/nutrition-plans/${planV2Id}/submit`)
      .set('Authorization', `Bearer ${trainerToken}`)
      .send();
    expect(submitV2Res.status).toBe(200);

    const acceptV2Res = await request(app)
      .post(`/api/v1/nutrition-plans/${planV2Id}/accept`)
      .set('Authorization', `Bearer ${clientAToken}`)
      .send();

    expect(acceptV2Res.status).toBe(200);
    expect(acceptV2Res.body.success).toBe(true);

    await new Promise((res) => setTimeout(res, 200));

    // V1 completion event + V2 activation event
    const v1CompletedClientA = clientAEvents.filter(
      (e) => e.event === 'nutrition:plan_completed' && e.data.payload.planId === planV1Id,
    );
    const v2ActivatedClientA = clientAEvents.filter(
      (e) => e.event === 'nutrition:plan_activated' && e.data.payload.planId === planV2Id,
    );

    expect(v1CompletedClientA.length).toBe(1);
    expect(v2ActivatedClientA.length).toBe(1);

    // Total events received by Client B throughout all of this must remain 0
    expect(clientBEvents.length).toBe(0);
  });

  it('verifies NutritionCompletion lifecycle realtime propagation (start -> update -> complete) & isolation', async () => {
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

    const clientAEvents: any[] = [];
    const clientBEvents: any[] = [];
    const trainerEvents: any[] = [];

    const eventNames = [
      'nutrition:completion_started',
      'nutrition:completion_updated',
      'nutrition:completed',
    ];

    for (const evt of eventNames) {
      clientASocket.on(evt, (data) => clientAEvents.push({ event: evt, data }));
      clientBSocket.on(evt, (data) => clientBEvents.push({ event: evt, data }));
      trainerSocket.on(evt, (data) => trainerEvents.push({ event: evt, data }));
    }

    // 2. Trainer creates and activates a plan
    const createRes = await request(app)
      .post('/api/v1/nutrition-plans')
      .set('Authorization', `Bearer ${trainerToken}`)
      .send({
        coachingRelationshipId: relAId,
        title: 'Active Plan for Completion Testing',
        durationWeeks: 4,
        nutritionDays: sampleNutritionDays,
      });

    const planId = createRes.body.data.id;

    await request(app)
      .post(`/api/v1/nutrition-plans/${planId}/submit`)
      .set('Authorization', `Bearer ${trainerToken}`)
      .send();

    await request(app)
      .post(`/api/v1/nutrition-plans/${planId}/accept`)
      .set('Authorization', `Bearer ${clientAToken}`)
      .send();

    // 3. Client A starts completion for today
    const clientToday = new Date().toISOString().split('T')[0];
    const startRes = await request(app)
      .post('/api/v1/nutrition-completions')
      .set('Authorization', `Bearer ${clientAToken}`)
      .send({
        nutritionPlanId: planId,
        completionDate: clientToday,
        weekday: 'MONDAY',
      });

    expect(startRes.status).toBe(201);
    expect(startRes.body.success).toBe(true);
    const completionId = startRes.body.data.id;
    const firstMeal = startRes.body.data.nutritionDaySnapshot.meals[0];
    const firstFood = firstMeal.foodEntries[0];

    await new Promise((res) => setTimeout(res, 200));

    const startedClientA = clientAEvents.filter((e) => e.event === 'nutrition:completion_started');
    const startedTrainer = trainerEvents.filter((e) => e.event === 'nutrition:completion_started');
    const startedClientB = clientBEvents.filter((e) => e.event === 'nutrition:completion_started');

    expect(startedClientA.length).toBe(1);
    expect(startedClientA[0].data.payload.completionId).toBe(completionId);
    expect(startedTrainer.length).toBe(1);
    expect(startedClientB.length).toBe(0);

    // 4. Client A updates completion (logs meal consumption)
    const updateRes = await request(app)
      .patch(`/api/v1/nutrition-completions/${completionId}`)
      .set('Authorization', `Bearer ${clientAToken}`)
      .send({
        clientToday,
        mealCompletions: [
          {
            mealId: firstMeal.mealId,
            mealType: firstMeal.mealType,
            name: firstMeal.name,
            isCompleted: true,
            state: 'COMPLETED',
            consumedItems: [
              {
                prescribedFoodId: firstFood.id,
                prescribedFoodName: firstFood.name,
                consumedType: 'PRESCRIBED',
                consumedFoodId: firstFood.id,
                consumedFoodName: firstFood.name,
                quantity: 100,
                unit: 'g',
                calories: 380,
                protein: 13,
                carbohydrates: 68,
                fats: 7,
              },
            ],
            consumedMacros: {
              calories: 380,
              protein: 13,
              carbohydrates: 68,
              fats: 7,
            },
            consumedCalories: 380,
            timeConsumed: new Date().toISOString(),
          },
        ],
        hydrationSummary: {
          loggedMl: 1500,
          targetMl: 3500,
        },
      });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.success).toBe(true);

    await new Promise((res) => setTimeout(res, 200));

    const updatedClientA = clientAEvents.filter((e) => e.event === 'nutrition:completion_updated');
    const updatedTrainer = trainerEvents.filter((e) => e.event === 'nutrition:completion_updated');
    const updatedClientB = clientBEvents.filter((e) => e.event === 'nutrition:completion_updated');

    expect(updatedClientA.length).toBe(1);
    expect(updatedClientA[0].data.payload.completionId).toBe(completionId);
    expect(updatedTrainer.length).toBe(1);
    expect(updatedClientB.length).toBe(0);

    // 5. Client A completes the daily completion
    const completeRes = await request(app)
      .post(`/api/v1/nutrition-completions/${completionId}/complete`)
      .set('Authorization', `Bearer ${clientAToken}`)
      .send({
        clientToday,
        feedback: {
          rating: 5,
          energyLevel: 4,
          adherenceConfidence: 5,
          notes: 'Felt energized all day!',
        },
      });

    expect(completeRes.status).toBe(200);
    expect(completeRes.body.success).toBe(true);

    await new Promise((res) => setTimeout(res, 200));

    const completedClientA = clientAEvents.filter((e) => e.event === 'nutrition:completed');
    const completedTrainer = trainerEvents.filter((e) => e.event === 'nutrition:completed');
    const completedClientB = clientBEvents.filter((e) => e.event === 'nutrition:completed');

    expect(completedClientA.length).toBe(1);
    expect(completedClientA[0].data.payload.completionId).toBe(completionId);
    expect(completedTrainer.length).toBe(1);
    expect(completedClientB.length).toBe(0); // Isolation maintained
  });
});
