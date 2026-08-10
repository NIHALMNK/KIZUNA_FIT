   
   
   
   
**KIZUNAFIT**

**07 — ENTITY MODELING**

Domain Aggregate Reference

| ✅ Synchronized With 05\_DOMAIN\_ARCHITECTURE ✅ Synchronized With 06\_STATE\_MACHINES Version 1.0  |  KIZUNAFIT Platform |
| :---: |

 

# **Introduction**

This document defines the official entity models of KIZUNAFIT. Entity Modeling is the architectural layer that bridges Domain Architecture and Database Design.

 

## **Purpose of Entity Modeling**

Entity Modeling defines the following for each frozen domain:

•        Aggregate Roots

•        Entities

•        Value Objects

•        Ownership Boundaries

•        Aggregate Composition

•        Embed vs Reference Strategy

 

## **Architectural Position**

| Domain Architecture    	↓ State Machines    	↓ Entity Modeling   ← THIS DOCUMENT    	↓ Database Design |
| :---- |

 

Entity Modeling is performed one domain at a time. Only frozen domains may be modeled. Domains that have not completed discovery and state machine analysis must not be modeled.

 

# **Entity Modeling Principles**

 

| P-1 | Every entity must belong to exactly one aggregate. |
| :---: | :---- |

 

| P-2 | Every aggregate must have exactly one aggregate root. |
| :---: | :---- |

 

| P-3 | Ownership must be explicit. Ownership ambiguity is prohibited. |
| :---: | :---- |

 

| P-4 | Entities that cannot exist independently should be embedded. |
| :---: | :---- |

 

| P-5 | Entities with independent lifecycles should be referenced. |
| :---: | :---- |

 

| P-6 | Historical records must remain immutable. |
| :---: | :---- |

 

# **Domain Status Overview**

 

| Domain | Status |
| :---- | :---- |
| Identity Domain | ✅ FROZEN |
| Profile Domain | ✅ FROZEN |
| Marketplace Domain | ✅ FROZEN |
| Consultation Domain | ✅ FROZEN |
| Offer Domain | ✅ FROZEN |
| Payment Domain | ✅ FROZEN |
| Coaching Domain | ✅ FROZEN |
| Workout Domain | ✅ FROZEN |
| Nutrition Domain | ✅ FROZEN |
| Progress Domain | ✅ FROZEN |
| Communication Domain | ✅ FROZEN |
| Review Domain | ⏳ Discovery Pending |
| Admin Domain | ⏳ Discovery Pending |

 

| DOMAIN 1 IDENTITY DOMAIN ✅ FROZEN |
| :---- |

 

## **Purpose**

Manage authentication, authorization, account ownership, and account security.

The Identity Domain is responsible for: User Accounts, Authentication, Authorization, Email Verification, Password Management, Session Management, and Account Security.

The Identity Domain does NOT manage: Client Profiles, Trainer Profiles, Trainer Showcase Content, Marketplace Operations, or Coaching Operations. Those belong to their respective domains.

 

## **Aggregate Structure**

| User                      	(Aggregate Root) ├── RefreshTokenSession    	(Referenced Entity) ├── EmailVerification      	(Referenced Entity) └── PasswordReset          	(Referenced Entity) |
| :---- |

 

## **Aggregate Root: User**

| Purpose | Represents a platform account. Every authenticated actor inside KIZUNAFIT originates from a User account. |
| :---- | :---- |
| **Lifecycle** | Independent |
| **Ownership** | Aggregate Root — Identity Domain |
| **Supported Roles** | CLIENT | TRAINER | ADMIN |
| **Status Values** | ACTIVE | SUSPENDED | BANNED | DELETED |
| **Auth Providers** | LOCAL | GOOGLE |

 

### **Required Fields**

| \_id | fullName | email | passwordHash | role | status providers | emailVerified | lastLoginAt | createdAt | updatedAt |
| :---- |

 

### **Business Rules**

| ID-1 | One account may have only one role (CLIENT, TRAINER, or ADMIN). Role switching is prohibited. |
| :---: | :---- |

 

| ID-2 | Email addresses must be unique. Duplicate registrations are prohibited. |
| :---: | :---- |

 

| ID-3 | A trainer cannot act as a client. A client cannot act as a trainer. Separate accounts are required. |
| :---: | :---- |

 

| ID-4 | Authentication data may only be modified by the Identity Domain. |
| :---: | :---- |

 

## **Entity: RefreshTokenSession**

Represents an authenticated device/session. Supports Refresh Token Rotation, Multi Device Login, Logout, and Logout All Devices.

| Ownership | Owned By: User |
| :---- | :---- |
| **Lifecycle** | Dependent |
| **Storage Strategy** | Referenced Entity |
| **Fields** | sessionId | userId | refreshTokenHash | deviceInfo | ipAddress | expiresAt | lastUsedAt | createdAt |
| **Why Entity?** | ✅ Independent Identity  ✅ Independent Revocation  ✅ Independent Querying  ✅ Security Tracking |

 

## **Entity: EmailVerification**

Manages the email verification process. Supports Account Verification, OTP Verification, and Resend Verification.

| Ownership | Owned By: User |
| :---- | :---- |
| **Lifecycle** | Dependent |
| **Storage Strategy** | Referenced Entity |
| **Fields** | verificationId | userId | otpCodeHash | expiresAt | verifiedAt | createdAt |
| **Why Entity?** | ✅ Independent Identity  ✅ Temporary Lifecycle  ✅ Security Tracking |

 

## **Entity: PasswordReset**

Manages password recovery. Supports Forgot Password, Reset Password, and Reset Validation.

| Ownership | Owned By: User |
| :---- | :---- |
| **Lifecycle** | Dependent |
| **Storage Strategy** | Referenced Entity |
| **Fields** | resetId | userId | resetTokenHash | expiresAt | usedAt | createdAt |
| **Why Entity?** | ✅ Independent Identity  ✅ Temporary Lifecycle |

 

## **Embed vs Reference**

| Component | Strategy |
| :---- | :---- |
| RefreshTokenSession | Reference |
| EmailVerification | Reference |
| PasswordReset | Reference |

 

## **Aggregate Rules**

| AR-1 | All identity operations must begin through: User |
| :---: | :---- |

 

| AR-2 | User is the only aggregate root of the Identity Domain. |
| :---: | :---- |

 

| AR-3 | Authentication records may never be owned by another domain. |
| :---: | :---- |

 

| AR-4 | Profile information belongs to the Profile Domain. Identity Domain stores only authentication-related information. |
| :---: | :---- |

**✅ IDENTITY DOMAIN — FROZEN**

 

| DOMAIN 2 PROFILE DOMAIN ✅ FROZEN |
| :---- |

 

## **Purpose**

Manages business profiles for platform users. Responsible for: Client Profiles, Trainer Profiles, Trainer Showcase Content, Profile Visibility, and Profile Completion.

Does NOT manage: Authentication, Authorization, Payments, Coaching Relationships, or Reviews.

 

## **Aggregate Structure**

| ClientProfile             	(Aggregate Root) └── No Child Entities   TrainerProfile            	(Aggregate Root) └── TrainerShowcase        	(Embedded Entity) |
| :---- |

 

## **Aggregate Root: ClientProfile**

| Purpose | Represents the coaching profile of a client. Contains Fitness Goals, Current Condition, Preferences, Coaching Requirements. |
| :---- | :---- |
| **Lifecycle** | Independent |
| **Ownership** | Aggregate Root — Profile Domain |
| **References** | userId → User |
| **Fields** | \_id | userId | fullName | dateOfBirth | gender | height | weight | activityLevel | experienceLevel | fitnessGoals | dietaryPreferences | medicalNotes | profileCompleted | createdAt | updatedAt |

 

### **Business Rules**

| CP-1 | Each client account may have exactly one client profile. One User → One ClientProfile. |
| :---: | :---- |

 

| CP-2 | Client profiles are private. Visible only to: Client, Assigned Trainer, Admin. |
| :---: | :---- |

 

| CP-3 | Client profiles may be updated throughout the coaching journey. Historical coaching records must not be modified. |
| :---: | :---- |

 

## **Aggregate Root: TrainerProfile**

| Purpose | Represents a trainer's marketplace presence. Used for Trainer Discovery, Trainer Evaluation, and Trainer Selection. |
| :---- | :---- |
| **Lifecycle** | Independent |
| **Ownership** | Aggregate Root — Profile Domain |
| **References** | userId → User |
| **Fields** | \_id | userId | headline | bio | yearsOfExperience | specializations | languages | location | profileImage | averageRating | totalReviews | totalClients | profileCompleted | availabilityStatus | createdAt | updatedAt |
| **Availability Status** | AVAILABLE | PAUSED | VACATION | SUSPENDED | BANNED |

 

### **Business Rules**

| TP-1 | Each trainer account may have exactly one trainer profile. One User → One TrainerProfile. |
| :---: | :---- |

 

| TP-2 | Trainer profiles are public. Visible to Guests, Clients, Trainers, and Admins. |
| :---: | :---- |

 

| TP-3 | Only trainers with status AVAILABLE may receive new trainer requests. |
| :---: | :---- |

 

| TP-4 | Trainer reputation metrics (averageRating, totalReviews, totalClients) are system-managed and must never be manually edited. |
| :---: | :---- |

 

## **Entity: TrainerShowcase**

| Purpose | Represents public evidence of trainer credibility: Certificates, Achievements, Client Transformations, Events, Workshops. |
| :---- | :---- |
| **Ownership** | Owned By: TrainerProfile |
| **Lifecycle** | Dependent |
| **Storage Strategy** | Embedded Entity |
| **Why Embedded?** | ✅ Always Viewed With Profile  ❌ No Independent Lifecycle  ❌ No Independent Ownership  ❌ No Cross-Domain Usage |
| **Fields** | showcaseId | type | title | description | mediaUrl | issuedBy | achievedAt | createdAt |
| **Supported Types** | CERTIFICATE | ACHIEVEMENT | TRANSFORMATION | EVENT | WORKSHOP |

 

## **Embed vs Reference**

| Component | Strategy |
| :---- | :---- |
| TrainerShowcase | Embed |

 

## **Aggregate Rules**

| AR-1 | Profile Domain owns all profile information. Authentication information belongs to Identity Domain. |
| :---: | :---- |

 

| AR-2 | User is referenced but never owned. userId → User. |
| :---: | :---- |

 

| AR-3 | ClientProfile and TrainerProfile are separate aggregates. Neither aggregate owns the other. |
| :---: | :---- |

 

| AR-4 | Profile data may be updated. Historical coaching, payment, review, and marketplace records must use snapshots where historical accuracy is required. |
| :---: | :---- |

**✅ PROFILE DOMAIN — FROZEN**

 

| DOMAIN 3 MARKETPLACE DOMAIN ✅ FROZEN |
| :---- |

 

## **Purpose**

Manages trainer discovery and client acquisition. Responsible for Trainer Discovery, Trainer Requests, Acquisition Tracking, and Acquisition Lifecycle.

The Marketplace Domain exists to connect Client → Trainer before consultation, offer, payment, and coaching begin.

 

## **Aggregate Structure**

| AcquisitionPipeline        	(Aggregate Root) ├── TrainerRequest         	(Embedded Entity) └── TrainerSnapshot        	(Embedded Value Object) |
| :---- |

 

## **Aggregate Root: AcquisitionPipeline**

| Purpose | Represents the complete acquisition journey between one client and one trainer. |
| :---- | :---- |
| **Lifecycle** | Independent |
| **Ownership** | Aggregate Root — Marketplace Domain |
| **References** | clientId → User | trainerId → User |
| **Fields** | \_id | clientId | trainerId | trainerRequest | trainerSnapshot | status | createdAt | updatedAt |
| **Lifecycle States** | REQUEST\_PENDING | REQUEST\_ACCEPTED | CONSULTATION\_PENDING | CONSULTATION\_BOOKED | CONSULTATION\_COMPLETED | OFFER\_SENT | PAYMENT\_PENDING | SUBSCRIPTION\_ACTIVE | REJECTED | CANCELLED | EXPIRED | PAYMENT\_FAILED | SUBSCRIPTION\_COMPLETED |

 

### **Business Rules**

| AP-1 | A client may have only one active acquisition pipeline at a time. |
| :---: | :---- |

 

| AP-2 | A new acquisition pipeline is created when a Client sends a Trainer Request. |
| :---: | :---- |

 

| AP-3 | Acquisition pipelines are never reused. Each coaching purchase creates a completely new acquisition process. |
| :---: | :---- |

 

| AP-4 | Acquisition pipelines are never deleted. Purpose: Auditability, Historical Accuracy, Reporting, Dispute Investigation. |
| :---: | :---- |

 

| AP-5 | Acquisition lifecycle must match 06\_STATE\_MACHINES exactly. Entity Modeling may not redefine lifecycle states. |
| :---: | :---- |

 

## **Entity: TrainerRequest**

| Purpose | Represents the trainer request submitted by a client — the entry point into the acquisition pipeline. |
| :---- | :---- |
| **Ownership** | Owned By: AcquisitionPipeline |
| **Storage Strategy** | Embedded Entity |
| **Fields** | requestId | clientGoal | clientMessage | status | submittedAt | respondedAt | responseReason |
| **Lifecycle States** | REQUEST\_PENDING | REQUEST\_ACCEPTED | REQUEST\_REJECTED | REQUEST\_CANCELLED |

 

## **Value Object: TrainerSnapshot**

| Purpose | Preserves trainer information at the moment acquisition begins. Protects historical acquisition records from future trainer profile changes. |
| :---- | :---- |
| **Ownership** | Owned By: AcquisitionPipeline |
| **Storage Strategy** | Embedded Value Object |
| **Why Value Object?** | ❌ No Independent Identity  ❌ No Independent Lifecycle  ❌ No Independent Querying  ✅ Historical Snapshot |
| **Fields** | trainerId | fullName | headline | profileImage | specializations | yearsOfExperience | averageRating |

 

## **Embed vs Reference**

| Component | Strategy |
| :---- | :---- |
| TrainerRequest | Embed |
| TrainerSnapshot | Embed |

 

## **Aggregate Rules**

| AR-1 | All marketplace operations must begin through: AcquisitionPipeline |
| :---: | :---- |

 

| AR-3 | Marketplace Domain does not own Consultations, Offers, Payments, Subscriptions, or Coaching Relationships. It only tracks acquisition progression until handoff. |
| :---: | :---- |

 

| AR-5 | Marketplace records are historical business records and must never be physically deleted. |
| :---: | :---- |

**✅ MARKETPLACE DOMAIN — FROZEN**

 

| DOMAIN 4 CONSULTATION DOMAIN ✅ FROZEN |
| :---- |

 

## **Purpose**

Manages pre-sale consultations between clients and trainers. Responsible for Consultation Scheduling, Slot Booking, Meeting Coordination, Consultation Lifecycle, and Consultation History.

The Consultation Domain supports Trainer Evaluation, Client Assessment, and Coaching Suitability Analysis before offers and payments occur.

 

## **Aggregate Structure**

| Consultation              	(Aggregate Root) ├── ConsultationSlot      	(Embedded Entity) └── MeetingDetails        	(Embedded Value Object) |
| :---- |

 

## **Aggregate Root: Consultation**

| Purpose | Represents a consultation between one client and one trainer during an acquisition process. Consultations are NOT coaching sessions. |
| :---- | :---- |
| **Lifecycle** | Independent |
| **Ownership** | Aggregate Root — Consultation Domain |
| **References** | acquisitionPipelineId → AcquisitionPipeline | clientId → User | trainerId → User |
| **Fields** | \_id | acquisitionPipelineId | clientId | trainerId | slot | meetingDetails | status | scheduledAt | completedAt | createdAt | updatedAt |
| **Lifecycle States** | CREATED | SLOT\_BOOKED | SCHEDULED | COMPLETED | CANCELLED | NO\_SHOW |

 

### **Business Rules**

| C-1 | A consultation may only be created after: Trainer Request Accepted. |
| :---: | :---- |

 

| C-2 | One acquisition pipeline may contain only one consultation. One AcquisitionPipeline → One Consultation. |
| :---: | :---- |

 

| C-3 | Consultations are never reused. Each acquisition process owns its own consultation. |
| :---: | :---- |

 

| C-5 | Consultation records are never physically deleted. Purpose: Auditability, Reporting, Historical Accuracy, Dispute Investigation. |
| :---: | :---- |

 

## **Entity: ConsultationSlot**

| Purpose | Represents the selected consultation time slot. Supports Slot Selection, Slot Reservation, and Consultation Scheduling. |
| :---- | :---- |
| **Storage Strategy** | Embedded Entity |
| **Fields** | slotId | startTime | endTime | timezone | bookedAt |

 

## **Value Object: MeetingDetails**

| Purpose | Stores meeting coordination information: Meeting Link, Meeting Platform, Access Instructions. |
| :---- | :---- |
| **Storage Strategy** | Embedded Value Object |
| **Supported Platforms** | GOOGLE\_MEET | ZOOM | MICROSOFT\_TEAMS | CUSTOM |
| **Fields** | platform | meetingUrl | meetingCode | meetingInstructions |

 

## **Embed vs Reference**

| Component | Strategy |
| :---- | :---- |
| ConsultationSlot | Embed |
| MeetingDetails | Embed |

**✅ CONSULTATION DOMAIN — FROZEN**

 

| DOMAIN 5 OFFER DOMAIN ✅ FROZEN |
| :---- |

 

## **Purpose**

Manages coaching offers created after consultations and before payments. Converts Consultation → Coaching Proposal → Payment Opportunity.

Responsible for: Offer Creation, Offer Delivery, Offer Expiration, Offer Acceptance, Offer Rejection, Historical Offer Preservation.

 

## **Aggregate Structure**

| CoachingOffer             	(Aggregate Root) ├── PricingSnapshot       	(Embedded Value Object) └── ScopeSnapshot         	(Embedded Value Object) |
| :---- |

 

## **Aggregate Root: CoachingOffer**

| Purpose | Represents a coaching proposal created by a trainer for a client after a completed consultation. Defines Pricing, Duration, Coaching Scope, and Terms. |
| :---- | :---- |
| **Lifecycle** | Independent |
| **Ownership** | Aggregate Root — Offer Domain |
| **References** | acquisitionPipelineId → AcquisitionPipeline | consultationId → Consultation | clientId → User | trainerId → User |
| **Fields** | \_id | acquisitionPipelineId | consultationId | clientId | trainerId | pricingSnapshot | scopeSnapshot | status | expiresAt | acceptedAt | declinedAt | createdAt | updatedAt |
| **Lifecycle States** | DRAFT | SENT | ACCEPTED | DECLINED | EXPIRED |

 

### **Business Rules**

| CO-1 | Offers may only be created after: Consultation Completed. |
| :---: | :---- |

 

| CO-3 | Accepted offers become immutable. After ACCEPTED, the offer may never be modified. |
| :---: | :---- |

 

| CO-4 | Offers automatically expire after 7 days unless accepted or declined earlier. |
| :---: | :---- |

 

| CO-6 | Offers are never physically deleted. Purpose: Auditability, Historical Accuracy, Financial Verification, Dispute Investigation. |
| :---: | :---- |

 

## **Value Object: PricingSnapshot**

| Purpose | Preserves pricing information exactly as it existed when the offer was created. Protects historical records from future pricing changes. |
| :---- | :---- |
| **Storage Strategy** | Embedded Value Object |
| **Fields** | trainerFee | platformFee | totalAmount | currency |
| **Rule PS-1** | Pricing snapshots are immutable. After creation: Never Updated. |

 

## **Value Object: ScopeSnapshot**

| Purpose | Preserves the coaching scope agreed upon during offer creation. Protects historical agreements from future trainer service changes. |
| :---- | :---- |
| **Storage Strategy** | Embedded Value Object |
| **Fields** | durationDays | planType | includedFeatures | trainerNotes |
| **Rule SS-1** | Scope snapshots are immutable. After creation: Never Updated. |

**✅ OFFER DOMAIN — FROZEN**

 

| DOMAIN 6 PAYMENT DOMAIN ✅ FROZEN |
| :---- |

 

## **Purpose**

Manages all financial operations of KIZUNAFIT. Responsible for: Payments, Transactions, Subscriptions, Escrow Management, Refunds, Disputes, Payouts, Invoices, Revenue Tracking.

The Payment Domain is the sole owner of financial data. No other domain may modify financial records.

 

## **Core Financial Principle**

| Client → KIZUNAFIT → Escrow Hold → Trainer All money flows through the platform. Direct trainer-client payments are prohibited. |
| :---- |

 

## **Aggregate Structure**

| Payment                   	(Aggregate Root) ├── Transaction           	(Embedded Entity) ├── Subscription          	(Embedded Entity) ├── Refund                	(Embedded Entity) ├── Dispute               	(Embedded Entity) ├── Payout                	(Embedded Entity) ├── Invoice               	(Embedded Value Object) └── Settlement            	(Embedded Value Object) |
| :---- |

 

## **Aggregate Root: Payment**

| Purpose | Represents a coaching purchase and acts as the financial ownership root for all financial operations. |
| :---- | :---- |
| **Lifecycle** | Independent |
| **Ownership** | Aggregate Root — Payment Domain |
| **References** | acquisitionPipelineId → AcquisitionPipeline | offerId → CoachingOffer | clientId → User | trainerId → User |
| **Fields** | \_id | acquisitionPipelineId | offerId | clientId | trainerId | status | amount | currency | paymentProvider | providerPaymentId | invoice | settlement | createdAt | updatedAt |
| **Lifecycle States** | CREATED | PROCESSING | SUCCESS | PARTIALLY\_REFUNDED | REFUNDED | FAILED |

 

### **Business Rules**

| P-2 | Payment success must be verified through Razorpay Webhook Verification. Frontend responses are never trusted. |
| :---: | :---- |

 

| P-3 | Financial records are immutable. Historical financial data may never be modified. Adjustments must create new records. |
| :---: | :---- |

 

## **Entity: Transaction**

| Purpose | Represents a payment gateway transaction. Tracks all payment-provider interactions. |
| :---- | :---- |
| **Storage** | Embedded Entity |
| **Fields** | transactionId | providerTransactionId | type | amount | currency | status | processedAt |
| **Supported Types** | PAYMENT | REFUND | PAYOUT |
| **Rule T-1** | Transactions are immutable. |
| **Rule T-2** | Every financial movement must create a transaction record. |

 

## **Entity: Subscription**

| Purpose | Represents purchased coaching access. Created only after successful payment. |
| :---- | :---- |
| **Storage** | Embedded Entity |
| **References** | coachingRelationshipId → CoachingRelationship |
| **Fields** | subscriptionId | coachingRelationshipId | startDate | endDate | status | activatedAt | completedAt |
| **Lifecycle States** | PENDING | ACTIVE | COMPLETED | CANCELLED | REFUNDED | EXPIRED |

 

## **Entity: Refund**

| Purpose | Represents a refund request and its resolution. |
| :---- | :---- |
| **Fields** | refundId | requestedBy | refundType | reason | amount | status | requestedAt | processedAt |
| **Types** | FULL\_REFUND | PARTIAL\_REFUND |
| **Lifecycle States** | PENDING | UNDER\_REVIEW | APPROVED | PARTIALLY\_APPROVED | REJECTED | PROCESSED | CANCELLED |
| **Rules** | R-1: Refunds are never automatic.  R-2: Every refund requires administrative review.  R-3: Refund history is immutable. |

 

## **Entity: Dispute**

| Purpose | Represents a financial dispute used when coaching or payment disagreements occur. |
| :---- | :---- |
| **Fields** | disputeId | openedBy | reason | evidence | status | openedAt | resolvedAt |
| **Lifecycle States** | OPEN | UNDER\_INVESTIGATION | RESOLVED | CLOSED |
| **Rule D-1** | Disputes freeze Refund Processing and Payout Release until resolution. |
| **Rule D-2** | Dispute records are immutable. |

 

## **Entity: Payout**

| Purpose | Represents trainer earnings release. |
| :---- | :---- |
| **Fields** | payoutId | trainerId | amount | currency | status | scheduledAt | paidAt |
| **Lifecycle States** | PENDING | ON\_HOLD | PROCESSING | PAID | FAILED |
| **Rule PO-1** | Payouts occur only after: Subscription Completed → 3-Day Review Window → No Active Dispute. |

 

## **Value Objects: Invoice & Settlement**

| Invoice | Settlement |
| :---- | :---- |
| invoiceNumber | trainerFee | platformFee | totalAmount | currency | issuedAt | trainerAmount | platformAmount | settledAt |
| Rule I-1: Immutable snapshot | Rule ST-1: Immutable record |

**✅ PAYMENT DOMAIN — FROZEN**

 

| DOMAIN 7 COACHING DOMAIN ✅ FROZEN |
| :---- |

 

## **Purpose**

Manages active coaching engagements between trainers and clients after successful payment.

The Coaching Domain does NOT own: Workout Programs, Nutrition Plans, Progress Entries, Conversations, or Reviews. Those belong to their respective domains and attach to coachingRelationshipId.

 

## **Aggregate Structure**

| CoachingRelationship      	(Aggregate Root) └── CoachingTimeline      	(Embedded Value Object) |
| :---- |

 

## **Aggregate Root: CoachingRelationship**

| Purpose | Represents an active or historical coaching engagement. Becomes the ownership anchor for all coaching-related operations after successful payment. |
| :---- | :---- |
| **Lifecycle** | Independent |
| **Ownership** | Aggregate Root — Coaching Domain |
| **References** | acquisitionPipelineId → AcquisitionPipeline | paymentId → Payment | subscriptionId → Subscription | clientId → User | trainerId → User |
| **Fields** | \_id | acquisitionPipelineId | paymentId | subscriptionId | clientId | trainerId | status | timeline | createdAt | updatedAt |
| **Lifecycle States** | PENDING | ACTIVE | COMPLETED | CANCELLED | REFUNDED | DISPUTED | EXPIRED |

 

### **Business Rules**

| CR-1 | A CoachingRelationship may only be created after: Payment Success → Subscription Activated → CoachingRelationship Created. |
| :---: | :---- |

 

| CR-2 | All coaching-related data (Workout Programs, Nutrition Plans, Progress Entries, Conversations, Reviews) must attach to coachingRelationshipId. |
| :---: | :---- |

 

| CR-3 | CoachingRelationships are never reused. Renewals create New Payment, New Subscription, New CoachingRelationship. |
| :---: | :---- |

 

| CR-6 | A client may have only one active CoachingRelationship at a time, as defined by 02\_BUSINESS\_RULES One Active Trainer rule. |
| :---: | :---- |

 

## **Value Object: CoachingTimeline**

| Purpose | Stores important lifecycle timestamps. Preserves historical coaching facts that cannot be derived from current relationship status. |
| :---- | :---- |
| **Storage** | Embedded Value Object |
| **Fields** | activatedAt | completedAt | cancelledAt | refundedAt | disputedAt | expiredAt |
| **Rule CT-1** | Timeline fields are historical facts. Once recorded: Never Modified. |
| **Rule CT-2** | Timeline exists solely to preserve lifecycle history. Current status is always determined by CoachingRelationship.status. |

 

## **Aggregate Rules**

| AR-5 | The Coaching Domain owns only the coaching engagement itself. It does not own coaching deliverables (Workout Programs, Nutrition Plans, Progress Entries, Messages, Reviews). |
| :---: | :---- |

 

| AR-6 | All coaching functionality exists because a CoachingRelationship exists. No CoachingRelationship → No Coaching Features. |
| :---: | :---- |

**✅ COACHING DOMAIN — FROZEN**

 

| DOMAIN 8 WORKOUT DOMAIN ✅ FROZEN |
| :---- |

 

## **Purpose**

Manages workout coaching delivery throughout an active CoachingRelationship. Responsible for Exercise Catalog, Workout Programs, Workout Delivery, Workout Tracking, Workout History, and Workout Compliance.

NOT responsible for: Coaching Lifecycle, Nutrition, Messaging, Payments, or Progress Analytics.

 

## **Aggregate Structure**

| Exercise                  	(Aggregate Root)   WorkoutProgram            	(Aggregate Root) ├── Week                  	(Embedded Entity) │   └── Day               	(Embedded Entity) │       └── ExercisePrescription  (Embedded Value Object)   WorkoutCompletion         	(Aggregate Root) ├── WorkoutDaySnapshot    	(Embedded Value Object) └── ExercisePerformance   	(Embedded Value Object) |
| :---- |

 

## **Aggregate Root: Exercise**

| Purpose | Represents a reusable workout exercise. Examples: Push Up, Pull Up, Squat, Bench Press, Deadlift. |
| :---- | :---- |
| **Origins** | Platform Catalog | Trainer Custom Exercises |
| **Lifecycle** | Independent |
| **State Machine** | ACTIVE → DEPRECATED |
| **EX-1** | ACTIVE exercises may be used in new WorkoutPrograms. |
| **EX-2** | DEPRECATED exercises may not be used in new WorkoutPrograms. |
| **EX-3** | Exercise updates must never modify historical WorkoutPrograms (protected via ExerciseSnapshot). |

 

## **Aggregate Root: WorkoutProgram**

| Purpose | Represents a structured workout plan delivered during a CoachingRelationship. Owns Weeks, Days, Exercise Prescriptions, Program Lifecycle, and Program Versioning. |
| :---- | :---- |
| **Reference** | coachingRelationshipId → CoachingRelationship |
| **State Machine** | DRAFT → ACTIVE → COMPLETED |
| **WP-3** | Only one WorkoutProgram may be ACTIVE at a time. |
| **WP-4** | ACTIVE WorkoutPrograms are immutable. Changes require a New Program Version. |
| **WP-6** | WorkoutPrograms store ExerciseSnapshots. Workout execution must never depend on current Exercise catalog state. |

 

## **Embedded Entities & Value Objects**

| Component | Classification |
| :---- | :---- |
| Week | Embedded Entity — Identity Inside Aggregate ✅ |
| Day | Embedded Entity — Identity Inside Aggregate ✅ |
| ExercisePrescription | Embedded Value Object — Historical Snapshot ✅ |

ExercisePrescription contains: ExerciseSnapshot | Sets | Reps | Rest | Tempo | Notes

 

## **Aggregate Root: WorkoutCompletion**

| Purpose | Represents completion results for a single workout day. Stores WorkoutDaySnapshot, ExercisePerformance, and Completion Outcome. |
| :---- | :---- |
| **Completion Unit** | Workout Day (not Program or Week) |
| **State Machine** | NOT\_STARTED (derived) | COMPLETED (stored) | MISSED (stored) |
| **WC-1** | NOT\_STARTED is derived: Workout Day Exists \+ No Completion Record Exists \= NOT\_STARTED. |
| **WC-2 / WC-3** | COMPLETED and MISSED records are immutable. |
| **WC-5** | WorkoutCompletion preserves coaching evidence forever. |

 

## **Snapshot Strategy**

| Snapshot | Purpose |
| :---- | :---- |
| ExerciseSnapshot (inside ExercisePrescription) | Protect WorkoutPrograms from Exercise Catalog changes |
| WorkoutDaySnapshot (inside WorkoutCompletion) | Protect Workout History from WorkoutProgram changes |

 

## **Aggregate Rules**

| AR-9 | WorkoutPrograms are versioned. Example: Program V1 COMPLETED → Program V2 ACTIVE. |
| :---: | :---- |

 

| AR-10 | Workout history must never be modified retroactively. |
| :---: | :---- |

**✅ WORKOUT DOMAIN — FROZEN**

 

| DOMAIN 9 NUTRITION DOMAIN ✅ FROZEN |
| :---- |

 

## **Purpose**

Manages nutrition coaching within an active Coaching Relationship. Enables trainers to prescribe nutrition plans, monitor execution, and evaluate compliance.

KIZUNAFIT is a Coaching Relationship Platform. The Nutrition Domain exists to support the Coaching Relationship — NOT to manage food databases or calorie-tracking products.

 

## **Domain Principles**

| NDP-1 | Client Reporting ≠ Trainer Evaluation. Meal Completion ≠ Meal Compliance. Progress Submission ≠ Progress Assessment. |
| :---: | :---- |

 

| NDP-2 | Nutrition Plans define intent. Nutrition Completions record execution. NutritionPlan \= What trainer prescribed. NutritionCompletion \= What client executed. |
| :---: | :---- |

 

## **Aggregate Structure**

| NutritionPlan             	(Aggregate Root) └── NutritionDay          	(Embedded Entity) 	└── Meal              	(Embedded Entity)         └── FoodEntry     	(Embedded Value Object)   NutritionCompletion       	(Aggregate Root) ├── NutritionDaySnapshot  	(Embedded Value Object) └── MealCompletionRecord  	(Embedded Value Object) |
| :---- |

 

## **NutritionPlan State Machine**

| Lifecycle | DRAFT → ACTIVE → COMPLETED |
| :---- | :---- |
| **Allowed Transitions** | DRAFT → ACTIVE | ACTIVE → COMPLETED |
| **Forbidden Transitions** | ACTIVE → DRAFT | COMPLETED → ACTIVE | COMPLETED → DRAFT |
| **ND-7** | One CoachingRelationship may have many NutritionPlans. Only one NutritionPlan may be ACTIVE at a time. |
| **ND-2** | Nutrition Plans are immutable after activation. Changes require a new plan version. |
| **ND-11/12** | Nutrition Plans are finite programs (7/14/30/60/90 days). Infinite Nutrition Plans are rejected. |

 

## **Plan Structure Rules**

| ND-13 | NutritionDay must contain at least one Meal. |
| :---: | :---- |

 

| ND-14 | FoodEntry is optional. Supports Meal Coaching, Macro Coaching, and Hybrid Coaching. |
| :---: | :---- |

 

| ND-19 | Meal contains mealType and displayName. Supported Types: BREAKFAST | LUNCH | DINNER | SNACK | CUSTOM. |
| :---: | :---- |

 

## **Food Strategy**

| ND-27 | KIZUNAFIT does not own Food as a core business concept. |
| :---: | :---- |

 

| ND-28 | FoodEntry is the coaching unit: name | quantity | unit | notes. |
| :---: | :---- |

 

| ND-29 | FoodCatalog is supporting infrastructure for Search, Autocomplete, and Consistency. Nutrition Plans must not depend on FoodCatalog existence. |
| :---: | :---- |

 

## **Completion Rules**

| ND-23 | Meal Completion ≠ Meal Compliance. Completed ✅ and Compliant ❌ may both exist simultaneously. |
| :---: | :---- |

 

| ND-24 | Compliance Status: NOT\_REVIEWED | COMPLIANT | PARTIALLY\_COMPLIANT | NON\_COMPLIANT. |
| :---: | :---- |

 

| ND-25 | A Meal may be completed at most once within a NutritionCompletion. |
| :---: | :---- |

 

| ND-17 | NutritionCompletion must contain a NutritionDaySnapshot (Meals, Food Entries, Macro Targets, Day Metadata). |
| :---: | :---- |

**✅ NUTRITION DOMAIN — FROZEN**

 

| DOMAIN 10 PROGRESS DOMAIN ✅ FROZEN |
| :---- |

 

## **Entity Modeling Decisions**

 

### **EM-1: Coaching Evaluation → Entity**

Coaching Evaluation \#12 and Evaluation \#13 remain different business objects even when Objective Snapshot, Evidence Scope, Interpretation, and Outcome are identical. Business still recognizes two different evaluations.

Business language: "Evaluation \#13 supersedes Evaluation \#12" — this requires independent identity for both. A Coaching Evaluation moves through Draft → In Progress → Completed.

| EMF-1 | Coaching Evaluation \= Entity  ✅ FROZEN |
| :---- | :---- |

 

### **EM-2: Interpretation → Value Object**

Business sees "Same Interpretation Value" not "Interpretation \#12 vs Interpretation \#13". Interpretation cannot exist without Evaluation (no independent business meaning). No independent lifecycle.

| EMF-2 | Interpretation \= Value Object  ✅ FROZEN |
| :---- | :---- |

 

### **EM-3: Outcome → Value Object**

Business never asks "Show Outcome \#145" — it asks "Show Evaluation \#145". Outcome is context-dependent and participates in Evaluation Lifecycle but owns none.

| EMF-3 | Outcome \= Value Object  ✅ FROZEN |
| :---- | :---- |

 

### **EM-4: Objective Snapshot → Historical Snapshot Value Object**

If objective changes from "Fat Loss" (January) to "Muscle Gain" (June), Evaluation \#12 must still display "Fat Loss". Identity does not matter — business cares about what objective existed when evaluation occurred.

| EMF-4 | Objective Snapshot \= Historical Snapshot Value Object  ✅ FROZEN |
| :---- | :---- |

 

### **EM-5: Evidence Scope → Historical Context Value Object**

Evaluation \#12 reviewed Weight Logs, Photos, and Measurements for Weeks 1-4. Future evidence must not alter Evaluation \#12. No independent lifecycle.

| EMF-5 | Evidence Scope \= Historical Context Value Object  ✅ FROZEN |
| :---- | :---- |

 

### **EM-6: Reasoning → Optional Supporting Information**

Historical Coaching Truth remains valid without Reasoning. Reasoning improves Auditability, Explainability, Coach Handover, and Knowledge Transfer. A Completed Evaluation without Reasoning is VALID.

| EMF-6 | Reasoning \= Optional Supporting Information  ✅ FROZEN |
| :---- | :---- |

**✅ PROGRESS DOMAIN — FROZEN**

 

| DOMAIN 11 COMMUNICATION DOMAIN ✅ FROZEN |
| :---- |

 

## **Purpose**

Manages coaching communication between trainers and clients throughout an active Coaching Relationship.

Responsible for: Conversation History, Message Recording, Communication Preservation, Message Attachments, Read Acknowledgements, and Communication Reporting.

The Communication Domain exists to preserve truthful historical communication between authorized coaching participants.

Does NOT manage: Coaching Relationships, Moderation Decisions, User Preferences, Notifications, or Authentication. Those belong to their respective domains.

 

## **Aggregate Structure**

| Message                   	(Aggregate Root) ├── Attachment            	(Embedded Value Object) ├── ReadAcknowledgement   	(Embedded Value Object) └── Reaction              	(Embedded Value Object)   Report                    	(Aggregate Root) |
| :---- |

 

## **Aggregate Root: Message**

| Purpose | Represents a single historical communication exchanged between two authorized coaching participants. Owns the preservation of complete communication facts throughout the lifetime of a coaching relationship. |
| :---- | :---- |
| **Lifecycle** | Independent |
| **Ownership** | Aggregate Root — Communication Domain |
| **References** | coachingRelationshipId → CoachingRelationship | senderId → User | recipientId → User |
| **Fields** | \_id | coachingRelationshipId | senderId | recipientId | messageType | content | attachments | readAcknowledgements | reactions | sentAt | createdAt |
| **Lifecycle** | Does Not Exist → Recorded Historical Communication (permanent — no meaningful post-creation business states) |

 

### **Business Rules**

| CM-1 | Messages are immutable historical communication records. Previously recorded communication must never be replaced or rewritten. |
| :---: | :---- |

 

| CM-2 | Every Message belongs to exactly one Coaching Relationship. Communication cannot exist outside an active coaching context. |
| :---: | :---- |

 

| CM-3 | Historical communication must always preserve: sender, recipient, timestamp, and communication content. |
| :---: | :---- |

 

| CM-4 | Read acknowledgements, reactions, and attachments do not change the Message's business meaning. They extend the communication while preserving the same historical communication fact. |
| :---: | :---- |

 

| CM-5 | Visibility policies must never alter historical communication. Visibility governs access, not communication truth. |
| :---: | :---- |

 

| CM-6 | Reporting a Message does not modify the Message. It creates a separate moderation record. |
| :---: | :---- |

 

## **Aggregate Root: Report**

| Purpose | Represents a moderation request submitted against a Message. Preserves moderation facts independently from the communication itself. |
| :---- | :---- |
| **Lifecycle** | Independent |
| **Ownership** | Aggregate Root — Communication Domain |
| **References** | messageId → Message | reportedBy → User |
| **Fields** | \_id | messageId | reportedBy | reason | description | reportedAt | status | createdAt | updatedAt |

 

### **Business Rules**

| RP-1 | A Report must reference exactly one Message. |
| :---: | :---- |

 

| RP-2 | Reports preserve moderation requests independently of whether moderation ever occurs. |
| :---: | :---- |

 

| RP-3 | Removing or resolving a report must never alter the historical Message. |
| :---: | :---- |

 

| RP-4 | Multiple Reports may reference the same Message. Each Report represents an independent moderation fact. |
| :---: | :---- |

 

## **Value Object: Attachment**

| Purpose | Represents communication content attached to a Message. Examples: Image, Video, Document, Audio. |
| :---- | :---- |
| **Ownership** | Owned By: Message |
| **Storage Strategy** | Embedded Value Object |
| **Why Value Object?** | ❌ No Independent Identity  ❌ No Independent Lifecycle  ❌ No Independent Business Responsibility  ✅ Forms part of complete communication content |
| **Fields** | type | url | fileName | mimeType | size |

 

## **Value Object: ReadAcknowledgement**

| Purpose | Represents recipient acknowledgement that a Message has been viewed. |
| :---- | :---- |
| **Ownership** | Owned By: Message |
| **Storage Strategy** | Embedded Value Object |
| **Why Value Object?** | ❌ No Independent Identity  ❌ No Independent Lifecycle  ❌ No Independent Business Responsibility  ✅ Records recipient interaction |
| **Fields** | readerId | readAt |

 

## **Value Object: Reaction**

| Purpose | Represents a participant's reaction to a Message. Examples: 👍 ❤️ 👏 |
| :---- | :---- |
| **Ownership** | Owned By: Message |
| **Storage Strategy** | Embedded Value Object |
| **Why Value Object?** | ❌ No Independent Identity  ❌ No Independent Lifecycle  ❌ No Independent Business Responsibility  ✅ Represents interaction information |
| **Fields** | userId | reactionType | reactedAt |

 

## **Embed vs Reference**

| Component | Strategy |
| :---- | :---- |
| Attachment | Embed |
| ReadAcknowledgement | Embed |
| Reaction | Embed |

 

## **Aggregate Rules**

| AR-1 | All communication operations must begin through Message or Report depending on the business responsibility. |
| :---: | :---- |

 

| AR-2 | The Message Aggregate owns only historical communication. It does not own moderation decisions. |
| :---: | :---- |

 

| AR-3 | The Report Aggregate owns moderation requests. It does not modify historical communication. |
| :---: | :---- |

 

| AR-4 | Communication history is immutable. Visibility, reporting, and interaction must never alter historical communication facts. |
| :---: | :---- |

 

| AR-5 | All communication belongs to exactly one Coaching Relationship. Messages cannot exist independently of coaching. |
| :---: | :---- |

 

| AR-6 | Communication history must remain historically truthful regardless of: Read Status, Reactions, Visibility Policies, or Reports. |
| :---: | :---- |

 

## **Entity Modeling Decisions**

| Decision | Result |
| :---- | :---- |
| EMF-1 | Message \= Aggregate Root  ✅ |
| EMF-2 | Attachment \= Embedded Value Object  ✅ |
| EMF-3 | ReadAcknowledgement \= Embedded Value Object  ✅ |
| EMF-4 | Report \= Aggregate Root  ✅ |
| EMF-5 | Reaction \= Embedded Value Object  ✅ |

**✅ COMMUNICATION DOMAIN — FROZEN**

   
 

| DOMAIN 12 REVIEW DOMAIN ✅ FROZEN |
| :---- |

 

## **Purpose**

Records the client's official assessment of a completed coaching relationship. Provides historical business evidence of the coaching experience while protecting the authenticity, integrity, and consistency of review data.

Responsible for: Recording client reviews after eligible coaching relationships, Preserving historical review evidence, Managing the review lifecycle, Enforcing review-related business policies, Publishing business events resulting from review state changes, and Producing derived information (Reputation, Reputation Metrics) used by other domains.

Does NOT own marketplace presentation, administrative governance, or trainer reputation. Those responsibilities belong to their respective bounded contexts.

 

## **Aggregate Structure**

| Review                    	(Aggregate Root) ├── Rating                	(Embedded Value Object) └── WrittenFeedback       	(Embedded Value Object)   Business Policies         	(Govern aggregate behavior — not aggregate members) ├── Review Eligibility ├── Review Edit Window ├── Publication Visibility └── Review Integrity Protection   External Projections      	(Derived — outside transactional boundary) ├── Reputation └── Reputation Metrics |
| :---- |

 

## **Aggregate Root: Review**

| Business Meaning | Represents the client's official assessment of a completed coaching relationship. The authoritative historical business record of the coaching experience. |
| :---- | :---- |
| **Lifecycle** | Independent |
| **Ownership** | Aggregate Root — Review Domain |
| **References** | coachingRelationshipId → CoachingRelationship | clientId → User (Identity) | trainerId → TrainerProfile (Profile) |
| **Business Information** | Review identity | Coaching relationship reference | Review author | Reviewed trainer | Rating | Written feedback | Review timestamps | Review lifecycle status |

 

### **Business Responsibilities**

•        Managing the complete Review lifecycle

•        Defining the transactional consistency boundary

•        Enforcing Review business invariants

•        Coordinating all aggregate members

•        Preserving historical business truth

•        Evaluating Review-owned business policies

•        Publishing Review Domain events

 

## **Value Object: Rating**

| Business Meaning | Represents the client's quantitative assessment of the coaching experience. |
| :---- | :---- |
| **Ownership** | Owned By: Review |
| **Storage Strategy** | Embedded Value Object |
| **Why Value Object?** | ❌ No Independent Identity  ❌ No Independent Lifecycle  ❌ No Independent Transaction Boundary  ✅ Describes the Review |
| **Business Information** | Rating value |
| **Rules** | Required  |  Must remain within the valid rating range  |  Can only be modified through Review operations |

 

## **Value Object: Written Feedback**

| Business Meaning | Represents the client's qualitative explanation of the Review. |
| :---- | :---- |
| **Ownership** | Owned By: Review |
| **Storage Strategy** | Embedded Value Object |
| **Why Value Object?** | ❌ No Independent Identity  ❌ No Independent Lifecycle  ✅ Explains the Rating  ✅ Belongs entirely to the Review lifecycle |
| **Business Information** | Review text |
| **Rules** | Optional  |  Subject to maximum length restrictions  |  Editable only through Review operations |

 

## **Business Policies**

Business Policies govern aggregate behavior but are not aggregate members.

 

| Policy | Responsibility |
| :---- | :---- |
| Review Eligibility | Determines whether a client is permitted to create a Review. Consumes business facts from Coaching Domain and Payment Domain. |
| Review Edit Window | Determines whether an existing Review may still be modified. Locked Reviews become immutable historical business evidence. |
| Publication Visibility | Determines whether a Review satisfies Review Domain publication rules. Publication owned by Review Domain; Marketplace presentation owned by Marketplace Domain. |
| Review Integrity Protection | Protects historical Review evidence from unauthorized or invalid modification. Historical truth preserved even when administrative governance affects visibility. |

 

## **External References**

| Referenced Concept | Owner Domain / Purpose |
| :---- | :---- |
| CoachingRelationship | Coaching — Establishes Review ownership |
| Client | Identity — Identifies Review author |
| Trainer | Profile — Identifies reviewed trainer |

 

## **External Business Facts Consumed**

| Business Fact | Fact Owner / Consumed By |
| :---- | :---- |
| Coaching Relationship Completed | Coaching → Review Eligibility |
| Payment Successful | Payment → Review Eligibility |
| Active Dispute | Coaching (Future Dispute Domain) → Review Eligibility |

 

## **Derived Projections**

| Projection | Responsibility |
| :---- | :---- |
| Reputation | Derived from historical Review evidence. Represents marketplace trust and supports trainer evaluation. Not transactional business data. |
| Reputation Metrics | Derived measurements summarizing Review evidence and supporting marketplace decision making. Remains a projection, not an aggregate member. |

 

## **Domain Events**

| Event Type | Events |
| :---- | :---- |
| Business Operation Events | Review Created  |  Review Updated  |  Review Removed |
| Business State Transition Events | Review Published  |  Review Unpublished  |  Review Edit Window Expired |

 

## **Embed vs Reference**

| Component | Strategy |
| :---- | :---- |
| Rating | Embed — No independent identity or lifecycle |
| Written Feedback | Embed — Exists only within a Review |
| CoachingRelationship | Reference — Owned by Coaching Domain |
| Client | Reference — Owned by Identity Domain |
| Trainer | Reference — Owned by Profile Domain |

 

## **Aggregate Rules**

| RV-1 | One CoachingRelationship produces at most one Review. |
| :---: | :---- |

 

| RV-2 | A Review belongs to exactly one CoachingRelationship. |
| :---: | :---- |

 

| RV-3 | Only eligible clients may create Reviews. |
| :---: | :---- |

 

| RV-4 | Rating is mandatory. Written Feedback is optional. |
| :---: | :---- |

 

| RV-5 | Reviews may only be edited within the Review Edit Window. Locked Reviews become immutable historical business evidence. |
| :---: | :---- |

 

| RV-6 | Publication follows Review Domain publication policies. Historical truth must never be altered by administrative governance. |
| :---: | :---- |

 

## **Entity Modeling Decisions**

| Decision | Result |
| :---- | :---- |
| EMF-1 | Review \= Aggregate Root  ✅  (owns independent identity, complete lifecycle, transaction boundary, business invariants, aggregate coordination) |
| EMF-2 | Rating \= Embedded Value Object  ✅  (no independent identity, no independent lifecycle, exists only as part of a Review) |
| EMF-3 | Written Feedback \= Embedded Value Object  ✅  (no independent identity, no independent lifecycle, exists only to explain a Review) |

**✅ REVIEW DOMAIN — FROZEN**


| DOMAIN 13 ADMIN DOMAIN ✅ FROZEN |
| :---- |

 

## **Purpose**

Provides centralized governance over the KIZUNAFIT platform. Unlike operational domains, the Admin Domain does not own day-to-day business operations — it oversees them by enforcing platform governance, moderation, and configuration policies.

Responsible for: Executing administrative governance actions, Maintaining immutable administrative history, Managing platform-wide operational configuration, Activating and superseding platform configurations, Enforcing platform governance policies, Preserving administrative accountability, and Providing authoritative platform configuration for operational domains.

Does NOT own the operational business objects it governs. Operational domains retain ownership of their business concepts throughout their lifecycle. The Admin Domain collaborates through references rather than ownership transfer.

 

## **Aggregate Structure**

| AdministrativeAction      	(Aggregate Root) ├── Administrative Actor  	(Value Object) ├── Governance Operation  	(Value Object) ├── Execution Timestamp   	(Value Object) ├── Execution Outcome     	(Value Object) ├── Administrative Reason 	(Value Object) └── Target Resource Reference (Aggregate Reference)   PlatformConfiguration     	(Aggregate Root) ├── Configuration Version 	(Entity) ├── Effective Period      	(Value Object) ├── Configuration Specification (Business Policy) └── Configuration Values  	(Internal Modeling Candidate) |
| :---- |

 

## **Ownership Principle**

A governance domain owns governance concepts, not the operational business objects governed by those concepts.

| Aggregate | Responsibility |
| :---- | :---- |
| AdministrativeAction | Administrative governance actions |
| PlatformConfiguration | Platform-wide operational configuration |

 

## **Aggregate Root: AdministrativeAction**

| Purpose | Represents a single governance decision performed by the platform administration. Provides administrative accountability, immutable governance history, auditable platform moderation, and governance over operational domains. |
| :---- | :---- |
| **Lifecycle** | Independent |
| **Ownership** | Aggregate Root — Admin Domain |
| **Does Not Own** | The operational resources it governs. Operational resources remain outside the aggregate boundary. |

 

### **Protected Business Invariants**

| AI-1 | Every AdministrativeAction is performed by exactly one administrative actor. |
| :---: | :---- |

 

| AI-2 | Every AdministrativeAction governs exactly one target resource. |
| :---: | :---- |

 

| AI-3 | Every AdministrativeAction represents exactly one governance operation. |
| :---: | :---- |

 

### **Lifecycle Invariants**

| LAI-1 | Executed AdministrativeAction records exactly one execution timestamp. |
| :---: | :---- |

 

| LAI-2 | Executed AdministrativeAction records exactly one execution outcome. |
| :---: | :---- |

 

| LAI-3 | Executed AdministrativeAction becomes immutable. |
| :---: | :---- |

 

### **State Machine**

|           AdministrativeAction Executed                   	│                   	▼               ┌──────────────┐               │   Executed   │               └──────────────┘                  Terminal State |
| :---- |

Creation itself represents the lifecycle transition. No further transitions exist.

| State | Active Invariants / Business Guarantee |
| :---- | :---- |
| Executed | LAI-1, LAI-2, LAI-3 — Every executed governance action is fully recorded, immutable, and historically traceable. |

 

### **Value Objects**

| Value Object | Business Meaning / Rationale |
| :---- | :---- |
| Administrative Actor | Identifies who performed the governance action. No independent lifecycle or identity within the aggregate. |
| Governance Operation | Describes what administrative decision was executed (e.g. Suspend User, Hide Review, Approve Refund). No independent identity. |
| Execution Timestamp | Records when execution occurred. Immutable after execution. Derives lifecycle from AdministrativeAction. |
| Execution Outcome | Records the business result (e.g. Suspended, Restored, Approved, Rejected). Describes AdministrativeAction but never exists independently. |
| Administrative Reason | Explains why the governance action occurred (e.g. Fraud, Spam, Policy Violation, User Request). No identity, no lifecycle, no independent ownership. |

 

### **Cross-Domain References (Target Resource)**

| Referenced Concept | Owner Domain |
| :---- | :---- |
| User | Identity |
| TrainerProfile | Trainer / Profile |
| Review | Review |
| Refund | Payment |
| Dispute | Payment |
| PlatformConfiguration | Admin (Same-Domain Reference) |

 

### **Governance Operations**

| Operation | Target |
| :---- | :---- |
| Suspend User | Identity → User |
| Restore User | Identity → User |
| Hide Review | Review → Review |
| Restore Review | Review → Review |
| Approve Refund | Payment → Refund |
| Reject Refund | Payment → Refund |
| Activate Platform Configuration | Admin → PlatformConfiguration |
| Supersede Platform Configuration | Admin → PlatformConfiguration |

 

## **Aggregate Root: PlatformConfiguration**

| Purpose | Owns the authoritative operational configuration of the platform. Guarantees that exactly one valid configuration governs platform behaviour at any point in time while preserving historical configurations. |
| :---- | :---- |
| **Lifecycle** | Independent |
| **Ownership** | Aggregate Root — Admin Domain |
| **Consumed By** | Operational domains reference configuration but never own it. |

 

### **Protected Business Invariants**

| PC-1 | Exactly one PlatformConfiguration is active at any time. |
| :---: | :---- |

 

| PC-2 | Effective periods never overlap. |
| :---: | :---- |

 

| PC-3 | Every active PlatformConfiguration satisfies the required configuration specification. |
| :---: | :---- |

 

| PC-4 | Every configuration value satisfies its business constraints. |
| :---: | :---- |

 

### **Lifecycle Invariants**

| LPC-1 | Superseded configurations become immutable. |
| :---: | :---- |

 

| LPC-2 | Activation immediately establishes exactly one active PlatformConfiguration. |
| :---: | :---- |

 

### **State Machine**

|           PlatformConfiguration Activated                   	│                   	▼               ┌─────────────┐               │   Active	│               └─────────────┘                   	│                   	│ PlatformConfiguration Superseded                   	▼               ┌─────────────┐               │ Superseded  │               └─────────────┘                  Terminal State |
| :---- |

Activation atomically guarantees: previous configuration becomes Superseded, new configuration becomes Active, effective periods remain valid, structural invariants remain satisfied.

| State | Active Invariants / Business Guarantee |
| :---- | :---- |
| Active | PC-1 through PC-4 — Exactly one valid operational configuration governs the platform. |
| Superseded | LPC-1 — Historical configurations remain immutable. |

 

### **Entity: Configuration Version**

| Classification | Entity (not Aggregate Root) |
| :---- | :---- |
| **Rationale** | Possesses business identity, has its own lifecycle, is individually recognized, and exists only within PlatformConfiguration. |

 

### **Value Object: Effective Period**

| Classification | Value Object |
| :---- | :---- |
| **Rationale** | Defines configuration validity. No identity, no independent lifecycle, immutable. |

 

### **Business Policy: Configuration Specification**

| Classification | Business Policy / Specification |
| :---- | :---- |
| **Rationale** | Defines what constitutes a valid PlatformConfiguration. Represents business rules rather than business state. |

 

### **Internal Modeling Candidate: Configuration Values**

| Classification | 🚧 Internal Modeling Candidate — Intentionally Deferred |
| :---- | :---- |
| **Rationale** | Business evidence proves Configuration Values belong inside PlatformConfiguration and are not an Aggregate or Entity. Current evidence does not determine whether they should become one Value Object, multiple Value Objects, or another internal composition. Decision deferred to prevent premature architectural constraint. |

 

## **Embed vs Reference**

| Component | Strategy / Owner |
| :---- | :---- |
| Administrative Actor | Embed — Value Object (no independent identity) |
| Governance Operation | Embed — Value Object (no independent identity) |
| Execution Timestamp | Embed — Value Object (immutable lifecycle fact) |
| Execution Outcome | Embed — Value Object (describes the action) |
| Administrative Reason | Embed — Value Object (no independent ownership) |
| Target Resource Reference | Reference — Owned by respective operational domain |
| Configuration Version | Embed — Entity within PlatformConfiguration boundary |
| Effective Period | Embed — Value Object (immutable configuration fact) |
| Configuration Specification | Embed — Business Policy (governs validation) |
| Configuration Values | Embed — Internal Modeling Candidate (deferred) |

 

## **Aggregate Rules**

| AR-1 | All administrative governance operations must begin through: AdministrativeAction. |
| :---: | :---- |

 

| AR-2 | All platform configuration operations must begin through: PlatformConfiguration. |
| :---: | :---- |

 

| AR-3 | AdministrativeAction owns only governance records. It does not own the operational resources it governs. |
| :---: | :---- |

 

| AR-4 | Executed AdministrativeActions are immutable. Governance history may never be altered. |
| :---: | :---- |

 

| AR-5 | Exactly one PlatformConfiguration may be Active at any time. Activation is an atomic operation. |
| :---: | :---- |

 

| AR-6 | Superseded PlatformConfigurations are immutable. Historical configurations may never be modified. |
| :---: | :---- |

 

| AR-7 | AdministrativeAction may reference PlatformConfiguration within the same bounded context without transferring ownership. |
| :---: | :---- |

 

| AR-8 | Cross-domain references preserve ownership. The Admin Domain collaborates through references; it never acquires ownership of operational domain concepts. |
| :---: | :---- |

 

## **Entity Modeling Decisions**

| Decision | Result |
| :---- | :---- |
| EMF-1 | AdministrativeAction \= Aggregate Root  ✅  (independent identity, complete lifecycle, transaction boundary, business invariants) |
| EMF-2 | Administrative Actor \= Value Object  ✅  (no independent lifecycle or identity — identifies who acted) |
| EMF-3 | Governance Operation \= Value Object  ✅  (no independent identity — describes what was executed) |
| EMF-4 | Execution Timestamp \= Value Object  ✅  (no identity — immutable after execution) |
| EMF-5 | Execution Outcome \= Value Object  ✅  (describes AdministrativeAction — never exists independently) |
| EMF-6 | Administrative Reason \= Value Object  ✅  (no identity, no lifecycle, no independent ownership) |
| EMF-7 | Target Resource Reference \= Aggregate Reference  ✅  (owned by another bounded context — referenced not owned) |
| EMF-8 | PlatformConfiguration \= Aggregate Root  ✅  (independent identity, complete lifecycle, transaction boundary, business invariants) |
| EMF-9 | Configuration Version \= Entity  ✅  (business identity, own lifecycle, exists within PlatformConfiguration boundary) |
| EMF-10 | Effective Period \= Value Object  ✅  (no identity, no independent lifecycle, immutable) |
| EMF-11 | Configuration Specification \= Business Policy  ✅  (defines validity rules — represents business rules not business state) |
| EMF-12 | Configuration Values \= Internal Modeling Candidate  🚧  (belongs inside boundary — composition strategy intentionally deferred) |

**✅ ADMIN DOMAIN — FROZEN**

 

# **Current Aggregate Summary**

 

| Domain | Aggregate Root(s) |
| :---- | :---- |
| Identity | User |
| Profile | ClientProfile  |  TrainerProfile |
| Marketplace | AcquisitionPipeline |
| Consultation | Consultation |
| Offer | CoachingOffer |
| Payment | Payment |
| Coaching | CoachingRelationship |
| Workout | Exercise  |  WorkoutProgram  |  WorkoutCompletion |
| Nutrition | NutritionPlan  |  NutritionCompletion |
| Progress | CoachingEvaluation |
| Communication | Message  |  Report |

 

# **Modeling Workflow**

All future domains must follow the full architectural pipeline before Entity Modeling:

| Business Rules    	↓ User Journeys    	↓ Use Cases    	↓ Domain Architecture    	↓ State Machines    	↓ Entity Modeling   ← This document |
| :---- |

Entity Modeling must never introduce concepts that do not exist in previous architectural layers.

 

# **Final Statement**

This document defines the current entity modeling status of KIZUNAFIT.

•        Only frozen domains are modeled.

•        Pending domains will be added incrementally after discovery, state machine analysis, and aggregate design are completed.

•        Database design must not begin for a domain until its entity model has been frozen.

•        Entity Modeling remains the source of truth for aggregate ownership and entity boundaries.

   
 

| Sync Status | Reference |
| :---- | :---- |
| ✅ Synchronized With 05\_DOMAIN\_ARCHITECTURE | Domain Architecture Document |
| ✅ Synchronized With 06\_STATE\_MACHINES | State Machines Document |

 

