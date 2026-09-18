# KIZUNAFIT — PROJECT CONTEXT & PROGRESS DOMAIN HANDOFF

> **Authoritative Handoff Document for Phase 10: Progress Domain**  
> **Repository:** `KIZUNAFIT`  
> **Current Branch:** `feature/phase-10-progress`  
> **Base Integration Branch:** `dev`  
> **Status:** Nutrition Domain (Phase 9) Completed & Merged into `dev`. Progress Domain (Phase 10) Ready for Architecture Analysis.

---

## 1. Executive Summary & KIZUNAFIT Overview

**KIZUNAFIT** is a production-grade, full-stack MERN platform built for high-touch personal fitness and nutrition coaching. It connects clients seeking structured health transformations with verified professional fitness trainers. The Japanese concept *"Kizuna"* (絆) represents deep, enduring bonds and connection—the platform is engineered to foster accountable, high-engagement, one-on-one coaching relationships rather than impersonal, automated generic plans.

The platform provides an end-to-end coaching ecosystem:
1. **Discovery & Acquisition**: Clients discover certified trainers, submit consultation requests, and conduct WebRTC video calls.
2. **Contracting & Payment**: Trainers issue tailored coaching proposals (duration, deliverables, pricing), and clients pay securely via Razorpay subscriptions.
3. **Structured Delivery**: Upon payment, an active `CoachingRelationship` is formed, unlocking trainer-prescribed 7-day master weekly workout programs and client-approved 7-day master weekly nutrition plans.
4. **Accountability & Execution**: Clients record daily workouts and meal/hydration completions. Daily nutritional snapshots, food-level alternative selections, and scheduled meal windows are preserved immutably.
5. **Measurable Transformation (Phase 10 — Next)**: Structured progress check-ins, weight trend tracking, body metrics, progress photos, and formal trainer feedback/evaluations.

---

## 2. Business Vision & Core Philosophy

1. **Trainer-Led, Client-Validated**: Plans are designed by qualified coaches with deep domain expertise. However, client consent and feasibility are mandatory—clients must explicitly review and accept nutrition proposals before they become active.
2. **Accountability Through Precision**: The platform eliminates ambiguity. Workouts have set-level tracking with target loads and reps; nutrition plans have food-level macros, prescribed alternatives, hydration goals, and scheduled meal timings.
3. **Immutability of History**: Active and historical execution logs are tamper-proof. Once a day's nutrition or workout is recorded, its snapshot is preserved for coaching auditability.
4. **Event-Driven Realtime Collaboration**: Actions taken by clients (e.g., meal tracked, workout logged, proposal accepted) immediately reflect on the trainer's workspace via isolated WebSocket event channels without manual page refreshes.
5. **Architectural Integrity First**: Clean Architecture and Domain-Driven Design (DDD) govern all modules. Business rules live purely in the Domain layer, completely decoupled from databases, HTTP frameworks, or UI components.

---

## 3. User Roles & Access Boundaries

| Role | Description | Access Boundaries & Permissions |
| :--- | :--- | :--- |
| **Client** | Individual seeking fitness coaching | - Browse trainer marketplace & view public trainer profiles<br>- Request consultations & attend WebRTC video rooms<br>- Accept/decline coaching offers & make subscription payments<br>- Review, accept, or reject proposed nutrition plans<br>- Execute active workouts & record meal/hydration completions<br>- Submit progress check-ins (body metrics, weight, photos)<br>- Message assigned active trainer |
| **Trainer** | Certified professional fitness coach | - Manage trainer profile, certifications, bio, and availability<br>- Accept/reject acquisition requests & conduct consultations<br>- Issue formal coaching offers with custom pricing/durations<br>- Manage client roster for active coaching relationships<br>- Build & assign 7-day master workout programs<br>- Build & submit 7-day master nutrition plans (DRAFT → PENDING)<br>- Monitor client daily workout/nutrition completion logs in realtime<br>- Review client progress check-ins and submit coaching evaluations |
| **Admin** | Platform operator / compliance | - Platform governance & system configuration<br>- User account suspension / ban<br>- Review and resolve refund requests and coaching disputes<br>- Payout approvals and audit logging |

---

## 4. Official V1 Use Cases (25 Approved Use Cases)

KIZUNAFIT is formally specified by 25 locked Version 1 use cases (`docs/04_USE_CASES.md`):

### Client Use Cases (UC-001 to UC-010)
- **UC-001: Client Registration** (Account creation, verification email)
- **UC-002: Complete Client Profile** (Fitness goals, body metrics, dietary preferences)
- **UC-003: Browse Trainers** (Filter marketplace by specialization, rating, price)
- **UC-004: Request Trainer Consultation** (Submit consultation request with intake note)
- **UC-005: Attend Consultation** (Join secure WebRTC video room with trainer)
- **UC-006: Accept Or Decline Coaching Offer** (Review terms, deliverables, pricing)
- **UC-007: Complete Payment** (Razorpay checkout, subscription activation, relationship creation)
- **UC-008: Submit Progress Check-In** *(Core for Phase 10)*: Submit weight, body measurements, photos
- **UC-009: Send Coaching Message** (1-on-1 realtime messaging with assigned trainer)
- **UC-010: Leave Review** (Rate and review trainer post-relationship)

### Trainer Use Cases (UC-011 to UC-021)
- **UC-011: Trainer Registration** (Account creation, initial credentials)
- **UC-012: Complete Trainer Profile** (Bio, experience, specializations, languages)
- **UC-013: Upload Showcase Content** (Transformations, client testimonials, media)
- **UC-014: Respond To Trainer Request** (Accept/reject client consultation requests)
- **UC-015: Conduct Consultation** (Host WebRTC video consultation)
- **UC-016: Send Coaching Offer** (Formal package proposal with price, weeks, terms)
- **UC-017: Manage Client Workouts** (Create, assign, modify 7-day master workout programs)
- **UC-018: Manage Client Nutrition** (Create, submit 7-day master nutrition plans)
- **UC-019: Review Client Progress** *(Core for Phase 10)*: Review metrics, photos, trends, feedback
- **UC-020: Respond To Coaching Message** (Realtime coaching communication)
- **UC-021: Manage Availability** (Define consultation and coaching schedule slots)

### Admin Use Cases (UC-022 to UC-025)
- **UC-022: Manage Users** (Search, review, suspend, or ban platform accounts)
- **UC-023: Review Refund Request** (Review evidence, process refund decisions)
- **UC-024: Resolve Dispute** (Mediate coaching conflicts, examine chat/execution logs)
- **UC-025: Manage Platform Settings** (Configuration parameters, platform commission rate)

---

## 5. The 13 Documented Business Domains

KIZUNAFIT is partitioned into 13 explicit bounded contexts (`docs/05_DOMAIN_ARCHITECTURE.md`):

1. **Identity Domain**: User authentication, password reset, token issuance, account status.
2. **Profile Domain**: Client personal fitness profile and trainer professional profile/certifications.
3. **Marketplace Domain**: Trainer discovery, search, filtering, and client acquisition pipelines.
4. **Consultation Domain**: Intake consultations, booking schedules, and WebRTC video sessions.
5. **Offer Domain**: Formal coaching proposals created by trainers for prospective clients.
6. **Payment Domain**: Subscriptions, Razorpay payment processing, webhook idempotency, refunds, disputes.
7. **Coaching Domain**: Active `CoachingRelationship` lifecycle, client roster, suspension, cancellation.
8. **Workout Domain**: Exercise catalog, 7-day weekly master workout programs, client daily execution logging.
9. **Nutrition Domain**: 7-day weekly master nutrition plans, client approval lifecycle, daily meal execution & hydration logging.
10. **Progress Domain (PHASE 10 - UPCOMING)**: Client body metrics, weight logs, check-in photos, trainer evaluations/feedback.
11. **Communication Domain**: Realtime 1-on-1 coaching messaging and media attachments.
12. **Review Domain**: Post-coaching trainer ratings, written reviews, and reputation scores.
13. **Admin Domain**: Platform moderation, dispute resolution, financial payouts, system audits.

---

## 6. Core End-to-End Business Flow

```
[Identity & Profile]
Client & Trainer register, verify emails, and complete detailed profiles.
       ↓
[Marketplace & Acquisition]
Client browses trainers → sends Acquisition Request → Trainer accepts.
       ↓
[Consultation]
Scheduled intake consultation conducted via built-in WebRTC video room.
       ↓
[Offer & Payment]
Trainer sends Coaching Offer → Client accepts → Completes Razorpay Payment.
       ↓
[Coaching Relationship Activation]
Webhook verifies payment → CoachingRelationship created in ACTIVE state.
       ↓
[Prescription & Delivery]
Trainer builds 7-day master WorkoutProgram (assigned directly).
Trainer builds 7-day master NutritionPlan (DRAFT) → Submits (PENDING_APPROVAL).
Client reviews proposed meals/macros → Client ACCEPTS → NutritionPlan becomes ACTIVE.
       ↓
[Daily Client Execution & Realtime Visibility]
Client logs daily workouts & meals/hydration against active plans.
Trainer observes completion status in realtime on client management workspace.
       ↓
[Progress Tracking & Feedback — PHASE 10]
Client submits weekly progress check-ins (weight, body tape measurements, photos).
Trainer analyzes trend charts, evaluates consistency, and delivers structured feedback.
       ↓
[Completion / Renewal / Review]
At end of package duration: Relationship completes → Client leaves Review & Rating.
```

---

## 7. Clean Architecture & Domain-Driven Design (DDD)

Both Backend and Frontend adhere strictly to Clean Architecture and DDD principles:

### Backend Structure (`backend/src/modules/<domain>/`)
```
modules/<domain>/
├── domain/
│   ├── aggregates/         # Aggregate roots with encapsulated invariants & private state
│   ├── entities/           # Sub-entities within the aggregate boundary
│   ├── value-objects/      # Immutable value objects (equality by value, validation on construct)
│   ├── events/             # Domain events (e.g., NutritionPlanAcceptedEvent)
│   ├── enums/              # Domain-specific status and type enums
│   └── repositories/       # Pure repository interfaces (zero DB/ORM dependencies)
├── application/
│   ├── use-cases/          # Application orchestration use cases (one file per use case)
│   ├── dtos/               # Input/output data transfer objects
│   └── services/           # Application service interfaces (e.g. gateways, token generators)
├── infrastructure/
│   ├── persistence/
│   │   └── mongoose/
│   │       ├── schemas/    # Mongoose schema definitions and compound indexes
│   │       ├── models/     # Mongoose models
│   │       ├── mappers/    # Bidirectional Domain <-> Persistence Mappers
│   │       └── repositories/# Concrete repository implementations
│   ├── realtime/           # Socket.IO event subscribers & room dispatchers
│   └── gateways/           # External service adapters & cross-domain adapters
└── presentation/
    ├── controllers/        # Express HTTP controllers (extract params, call use case, format response)
    ├── routes/             # Express router definitions with auth & role middleware
    └── validation/         # Request validation schemas (Zod or custom sanitizers)
```

### Frontend Structure (`frontend/src/modules/<domain>/`)
```
modules/<domain>/
├── domain/
│   ├── types/              # Frontend domain models, value structures, enums
│   └── repositories/       # Client-side repository interfaces
├── application/
│   ├── queries/            # TanStack Query hooks (`useQuery`)
│   ├── mutations/          # TanStack Mutation hooks (`useMutation`)
│   └── queryKeys.ts        # Centralized, type-safe query key factories
├── infrastructure/
│   ├── api/                # HTTP API client adapters calling backend endpoints
│   ├── repositories/       # Concrete API repositories
│   └── realtime/           # Domain-specific Socket.IO event invalidation bridges
└── presentation/
    ├── client/             # Client-facing pages, views, cards, and modal components
    ├── trainer/            # Trainer-facing builder, roster, and workspace components
    └── components/         # Reusable domain-specific presentation widgets & badges
```

---

## 8. Technology Stack

- **Runtime & Language**: Node.js (v20+ LTS), TypeScript 5.9+ (strict mode enabled across backend and frontend).
- **Backend Framework**: Express.js with modular routing and dependency injection.
- **Database**: MongoDB (Atlas) using Mongoose ODM with custom persistence mappers and multi-document transactions.
- **Cache & Realtime**: Redis (pub/sub & caching), Socket.IO (room-based bidirectional event distribution).
- **Frontend Framework**: Next.js 16 (App Router, Turbopack) with React 19.
- **Styling**: Tailwind CSS with custom CSS design tokens (light-theme only; dark mode is strictly disabled by design rules).
- **Icons**: Lucide React.
- **Testing**: Vitest across both backend (unit + integration) and frontend (component + hook + integration tests).
- **Payment Gateway**: Razorpay (API + Webhook signature verification).
- **Media & RTC**: Simple-Peer / native WebRTC with Socket.IO signaling.

---

## 9. Completed Phases & Current Status

| Phase | Domain | Status | Key Deliverables |
| :--- | :--- | :--- | :--- |
| **Phase 0** | Foundation | ✅ Completed | Clean Architecture scaffolding, Redis, Logger, Database connection, Shared UI design system tokens |
| **Phase 1** | Identity | ✅ Completed | JWT auth, Refresh tokens, Email verification, Password reset, Role-based guards |
| **Phase 2** | Profile | ✅ Completed | Client fitness profile, Trainer certifications/bio/specializations, Showcase media |
| **Phase 3** | Marketplace | ✅ Completed | Trainer catalog, Search & filtering, Client acquisition pipeline |
| **Phase 4** | Communication | ✅ Completed | 1-on-1 Consultation requests, WebRTC video calling rooms, Signaling |
| **Phase 5** | Offer | ✅ Completed | Structured coaching offer creation, proposal negotiation, offer statuses |
| **Phase 6** | Payment | ✅ Completed | Razorpay checkout, Webhook reconciliation, Subscription lifecycle, Escrow rules |
| **Phase 7** | Coaching | ✅ Completed | `CoachingRelationship` aggregate, Client roster, Relationship cancellation/suspension |
| **Phase 8** | Workout | ✅ Completed | Exercise catalog, 7-day weekly master WorkoutProgram, Day/Exercise/Set completion logging |
| **Phase 9** | Nutrition | ✅ Completed | 7-day master NutritionPlan, Mandatory client approval lifecycle, Alternative food tracking, Hydration |
| **Phase 10** | **Progress** | 🟡 **STARTING** | **Client check-ins (weight, measurements, photos), Trainer evaluations, Trend analytics** |
| **Phase 11** | Chat Messaging | ⚪ Pending | In-app 1-on-1 coaching messaging during active relationship |
| **Phase 12** | Review | ⚪ Pending | Client review & star rating submission post-relationship |
| **Phase 13** | Admin & Payouts| ⚪ Pending | Trainer payout calculations, Platform audits, Dispute arbitration |

---

## 10. Workout Domain Baseline (Phase 8 Summary)

- **Aggregate Roots**: `Exercise`, `WorkoutProgram`, `WorkoutCompletion`.
- **7-Day Weekly Master Template**: The trainer defines ONE master weekly routine (Monday to Sunday) specifying workout days, rest days, exercise sequences, target sets, target load (kg), and reps.
- **Multi-Week Derivation**: For any arbitrary program duration (e.g., 4, 8, 12 weeks), every calendar date derives its day of the week (Monday–Sunday) from this master plan.
- **Daily Execution**: Client executes workouts on their daily tracker. The system creates a `WorkoutCompletion` record for that specific date with exercise and set logs.
- **Immutability**: Completed workouts are locked and snapshot-preserved.

---

## 11. Nutrition Domain Baseline (Phase 9 Summary — Authoritative Lifecycle)

The Nutrition Domain was refined and verified with a strict **client-approval** requirement:

### Authoritative Nutrition State Machine
```
      [Trainer Creates Plan]
               ↓
             DRAFT
               ↓ (Trainer Submits: POST /nutrition-plans/:planId/submit)
        PENDING_APPROVAL
        ↙              ↘
(Client Rejects)        (Client Accepts: POST /nutrition-plans/:planId/accept)
      ↓                         ↓
    DRAFT                     ACTIVE
                                ↓ (When V2 is accepted)
                              COMPLETED
```

### Critical Nutrition Invariants
1. **Mandatory Client Approval**: No plan (neither V1 nor V2+) can ever be directly activated by a trainer. The path `DRAFT → ACTIVE` is strictly forbidden.
2. **Review & Proposal**: When trainer submits a plan, it moves from `DRAFT → PENDING_APPROVAL`. The client sees a prominent proposal banner with "Review Plan", "Accept", and "Reject" options.
3. **Rejection Safety**: If client rejects a proposed plan, it returns to `DRAFT` for trainer revision. If a V2 revision is rejected, the active V1 remains completely unaffected and active.
4. **Transactional Replacement**: When a client accepts a V2 plan, V2 becomes `ACTIVE` and V1 is atomically retired to `COMPLETED` within a Mongoose transaction.
5. **Execution Gating**: A `NutritionCompletion` record can **ONLY** be initiated against an `ACTIVE` nutrition plan. Plans in `DRAFT` or `PENDING_APPROVAL` strictly reject execution attempts.
6. **7-Day Master Template**: Similar to workouts, nutrition plans are configured as a 7-day weekly template (Monday through Sunday) containing meals, prescribed foods, portion quantities, macro targets, and hydration goals.
7. **Food-Level Alternatives**: Each prescribed food item can define specific alternatives (e.g., Appam → Idli, Dosa). The client can independently substitute prescribed foods with configured alternatives. The server validates that chosen alternatives exist in the trainer's prescription.
8. **Multi-Week Occurrence Identity**: Nutrition completions are identified uniquely by:
   `nutritionPlanId + clientId + completionDate` (where `completionDate` is normalized to `YYYY-MM-DD`).

---

## 12. Cross-Domain Ownership & Data Reference Rules

1. **Reference by ID Only**: Aggregates never contain direct object references or Mongoose `populate()` across domain boundaries. For example, `NutritionPlan` stores `clientId`, `trainerId`, and `coachingRelationshipId` as plain strings/UUIDs.
2. **CoachingRelationship is the Authoritative Anchor**:
   - Workouts, Nutrition, and Progress **require** an active `CoachingRelationship`.
   - If a relationship is suspended or cancelled, active prescriptions freeze and execution is blocked.
3. **IDOR & Multi-Tenant Security**:
   - Every read and write validates ownership.
   - Client can only access records where `clientId === req.user.id`.
   - Trainer can only access records for clients with whom they have an active `CoachingRelationship`.
4. **Realtime Isolation**:
   - WebSocket events are published strictly to authenticated private user rooms (`user:<userId>`).
   - Global broadcasts are strictly forbidden.

---

## 13. Progress Domain (Phase 10): Detailed Discovery & Handover Brief

### What is Documented in the Authoritative Specs?
1. **Use Cases (`04_USE_CASES.md`)**:
   - **UC-008: Submit Progress Check-In (Client)**
     - Primary Actor: Client.
     - Preconditions: Active `CoachingRelationship`.
     - Main Flow: Open progress section → enter body measurements → enter weight → upload progress photos → submit check-in.
     - Postconditions: Progress entry recorded.
   - **UC-019: Review Client Progress (Trainer)**
     - Primary Actor: Trainer.
     - Preconditions: Progress entries exist for active client.
     - Main Flow: Open client progress view → review metrics → review photos → analyze trend charts → provide structured coaching evaluation/feedback.
     - Postconditions: Feedback recorded and visible to client.
2. **Domain Architecture (`05_DOMAIN_ARCHITECTURE.md`)**:
   - Domain 10: Progress Domain.
   - Purpose: Track measurable client progress over time.
   - Responsibilities: Progress Entries, Progress Photos, Trainer Feedback, Analytics.
   - Candidate Concepts: `ProgressEntry`, `ProgressPhoto`, `TrainerFeedback`, `ProgressAnalytics`.
   - Status: Discovery Pending.
3. **Entity Modeling Summary (`07_ENTITY_MODELING.md`)**:
   - Candidate Aggregate Root listed: `CoachingEvaluation` or `ProgressCheckIn`.
   - Not yet frozen or modeled in detail.
4. **Current Codebase State**:
   - Backend: No `backend/src/modules/progress` directory exists.
   - Frontend: Only two preview empty-state pages exist:
     - `frontend/src/app/(dashboard)/client/progress/page.tsx`
     - `frontend/src/app/(dashboard)/trainer/progress/page.tsx`

---

## 14. What is NOT Yet Frozen for the Progress Domain (Requires Analysis First!)

The following key architectural and business questions must be forensically investigated and resolved before writing any code:

1. **Aggregate Root Boundary**:
   - Is the primary aggregate `ProgressCheckIn` (client-submitted entry) with sub-entities for metrics, photos, and trainer evaluation?
   - OR is `ProgressCheckIn` and `CoachingEvaluation` separate aggregates linked by ID?
2. **Check-In Cadence & Frequency Rules**:
   - Are check-ins strictly weekly (e.g. Sunday/Monday), or can clients log body weight daily and photos weekly?
   - Can a client edit or delete a check-in before the coach reviews it? Once reviewed, is it immutable?
3. **Metrics Model**:
   - Core metrics: Weight (kg), Body Fat (%), Chest (cm), Waist (cm), Hips (cm), Thighs (cm), Arms (cm).
   - Are metric units configurable (Metric vs Imperial) or normalized to standard metric units in the database?
4. **Photo Storage & Privacy**:
   - Angles: Front, Side, Back.
   - Storage strategy: Presigned S3/Cloud storage URLs or local static upload endpoint with strict authorization?
5. **Trainer Feedback Structure**:
   - Rating/Evaluation score? Formatted comments? Video feedback? Actionable adjustments to workout or nutrition?
6. **Analytics & Aggregation**:
   - Are trend graphs calculated on-the-fly via MongoDB aggregation pipelines or pre-calculated in a read model?

---

## 15. Development Rules & Hard Invariants

1. **Architecture First, Implementation Second**: Never write code before producing a thorough architectural analysis, entity model, database design, and implementation plan.
2. **No Breaking Changes**: Existing passing tests (Identity, Profile, Consultation, Offer, Payment, Coaching, Workout, Nutrition) must remain 100% green.
3. **Light-Theme Only**: KIZUNAFIT UI is exclusively light-themed. Do not use dark mode classes or dark backgrounds (`bg-gray-900`, `text-white` on dark, etc.). Use design system variables (`--color-surface`, `--color-text`, `--color-primary`).
4. **Strict Atomic Commits**: Use conventional commits (`feat:`, `fix:`, `test:`, `docs:`, `chore:`). Never create giant "kitchen sink" commits.
5. **Test-Driven Verification**: Unit tests, integration tests, and typechecks must pass on both backend and frontend.

---

## 16. Instructions for Starting the Progress Domain (For the Next Session)

When opening the new conversation to implement Phase 10:

```
STEP 1: Load and review this PROJECT_CONTEXT_FOR_PROGRESS.md file.
STEP 2: Review docs/04_USE_CASES.md (UC-008 & UC-019) and docs/05_DOMAIN_ARCHITECTURE.md (Domain 10).
STEP 3: Inspect existing patterns in Workout (`backend/src/modules/workout`) and Nutrition (`backend/src/modules/nutrition`).
STEP 4: Formulate the Progress Domain Model:
        - Identify Aggregate Root(s) and Value Objects
        - Formulate State Machine & Lifecycle Transitions
        - Design Database Collection & Compound Indexes
        - Define REST API Contracts & Realtime Events
STEP 5: Create a detailed Implementation Plan and obtain user approval.
STEP 6: Implement in structured phases:
        Phase 1: Domain & Application Layers (Entities, Value Objects, Use Cases)
        Phase 2: Infrastructure & Persistence (Mongoose Schemas, Mappers, Repositories)
        Phase 3: Presentation & Realtime (Controllers, Routes, Socket.IO Events)
        Phase 4: Frontend Data Layer (API Adapters, React Query Hooks, Realtime Bridge)
        Phase 5: Frontend UI (Client Check-In Form, Photo Upload, Trainer Evaluation Workspace, Charts)
        Phase 6: Comprehensive Testing & Verification
```

---
*End of Handoff Context Document — KIZUNAFIT Phase 10 (Progress Domain)*
