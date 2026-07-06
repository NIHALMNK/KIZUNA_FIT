# **8\_DATABASE\_DESIGN**

# **1\. Introduction**

## **Purpose**

This document defines the official database design of the **KIZUNAFIT** platform. It translates the approved Entity Modeling into a practical MongoDB database structure that will be implemented using Mongoose.

The database design specifies:

* MongoDB collections  
* Collection ownership  
* Document structures  
* Embedded documents  
* Referenced documents  
* Collection relationships  
* Cardinality (One-to-One, One-to-Many, Many-to-Many)  
* Indexing strategy  
* Validation rules  
* Data integrity constraints  
* Snapshot storage  
* Audit fields  
* Soft delete strategy  
* Historical data preservation

This document is the authoritative database blueprint for the KIZUNAFIT backend.

---

## **Objective**

The primary objective of this document is to ensure that every database collection accurately represents the business architecture defined by the previous system design documents.

Every collection must:

* Belong to exactly one business domain.  
* Have a clearly defined ownership boundary.  
* Respect aggregate boundaries.  
* Preserve historical business records.  
* Support scalability and maintainability.  
* Follow the approved state machines and business rules.

No collection may introduce new business concepts or modify existing business rules.

---

## **Scope**

This document covers the complete MongoDB database design for Version 1 of KIZUNAFIT, including all approved domains.

### **Included**

* Identity Domain  
* Profile Domain  
* Marketplace Domain  
* Consultation Domain  
* Offer Domain  
* Payment Domain  
* Coaching Domain  
* Workout Domain  
* Nutrition Domain  
* Progress Domain  
* Communication Domain  
* Review Domain  
* Admin Domain

For each domain, this document defines:

* Collections  
* Relationships  
* Embedded Entities  
* Value Objects  
* References  
* Database Constraints  
* Indexes  
* Validation Requirements

---

## **Out of Scope**

This document does **not** define:

* REST APIs  
* Business Logic  
* Service Layer  
* Repository Layer  
* Authentication Logic  
* Authorization Rules  
* Controller Implementation  
* Frontend Models  
* UI Components  
* Mongoose Middleware  
* Repository Pattern Implementation

These topics are covered in later architectural documents.

---

## **Database Philosophy**

The KIZUNAFIT database follows an **Architecture-First** approach.

Business requirements drive the database design, not the other way around.

The database exists to faithfully represent the approved business architecture without introducing additional business rules or implementation-specific assumptions.

Every collection, relationship, and document structure must originate from:

1. Business Vision  
2. Business Rules  
3. User Journeys  
4. Use Cases  
5. Domain Architecture  
6. State Machines  
7. Entity Modeling

Database Design is therefore an implementation of the architecture rather than a place where architectural decisions are made.

---

## **Design Principles**

The database is designed according to the following principles:

### **Clear Ownership**

Every document belongs to exactly one aggregate root and one business domain.

Ownership ambiguity is prohibited.

---

### **Historical Accuracy**

Historical business records must remain accurate throughout the lifetime of the platform.

Where future changes could invalidate historical records, immutable snapshots are stored instead of live references.

Examples include:

* Trainer Snapshot  
* Pricing Snapshot  
* Scope Snapshot  
* Exercise Snapshot  
* Workout Day Snapshot  
* Nutrition Day Snapshot  
* Invoice Snapshot

---

### **Aggregate Integrity**

Collections are designed around Aggregate Roots.

Embedded documents remain inside their owning aggregate, while independent business entities are stored as separate collections.

Aggregate boundaries must never be violated.

---

### **Business Consistency**

The database must enforce the business constraints defined in the Business Rules document.

Examples include:

* One Active Acquisition Pipeline per Client  
* One Active Coaching Relationship per Client  
* One Consultation per Acquisition Pipeline  
* One Review per Coaching Relationship  
* Immutable Financial Records

---

### **Auditability**

The platform preserves historical business evidence.

Financial records, coaching history, communication history, reviews, and administrative actions are never physically deleted.

Historical truth is always preserved.

---

### **Scalability**

Collections are designed to support future platform growth without requiring fundamental architectural changes.

Indexes, references, and document boundaries are selected to maintain performance as the platform scales.

---

### **Maintainability**

Collection names, field naming conventions, relationships, and indexing strategies follow consistent standards throughout the system.

This ensures long-term readability and reduces implementation complexity.

---

## **Database Technology**

Version 1 of KIZUNAFIT uses:

* Database: MongoDB  
* ODM: Mongoose  
* Primary Identifier: ObjectId  
* Data Format: BSON Documents

The database design remains technology-independent wherever possible, allowing the business architecture to remain valid even if the persistence technology changes in future versions.

---

## **Relationship with Previous Documents**

This document is derived directly from the approved architectural documents.

Business Vision  
        ↓  
Business Rules  
        ↓  
User Journeys  
        ↓  
Use Cases  
        ↓  
Domain Architecture  
        ↓  
State Machines  
        ↓  
Entity Modeling  
        ↓  
Database Design

Database Design must never introduce:

* New business rules  
* New lifecycle states  
* New aggregate ownership  
* New domain responsibilities

All database structures are implementations of previously approved architectural decisions.

---

## **Expected Outcome**

Upon completion of this document, the platform will have:

* A complete MongoDB collection design  
* Clearly defined collection relationships  
* Consistent embed/reference strategies  
* Database-level validation requirements  
* Indexing strategy  
* Query optimization guidelines  
* Immutable historical storage strategy

This document serves as the foundation for generating all Mongoose schemas, repositories, APIs, and backend implementations.

---

## **Status**

**08\_DATABASE\_DESIGN**

✅ Database Architecture Approved (Pending Completion)

✅ Based on Approved Entity Modeling

✅ Source of Truth for MongoDB Collection Design

# **2\. Database Principles**

The KIZUNAFIT database is designed around a set of core principles that ensure consistency, maintainability, auditability, and long-term scalability. Every collection, document, relationship, and database operation must comply with these principles.

These principles are mandatory and apply across all business domains.

---

# **DB-1 Architecture First**

The database is an implementation of the approved business architecture.

Database collections must never introduce new business concepts, ownership rules, or lifecycle states.

All database structures originate from the following architectural pipeline:

Business Vision  
        ↓  
Business Rules  
        ↓  
User Journeys  
        ↓  
Use Cases  
        ↓  
Domain Architecture  
        ↓  
State Machines  
        ↓  
Entity Modeling  
        ↓  
Database Design

Database Design implements architecture.

It never defines architecture.

---

# **DB-2 Domain Ownership**

Every collection belongs to exactly one business domain.

A domain owns:

* Business Rules  
* Aggregate Root  
* Collection  
* Lifecycle  
* Data Integrity

No domain may own another domain's data.

Cross-domain collaboration must occur through references only.

Example

Payment Domain  
    Owns → payments

Workout Domain  
    References → coachingRelationshipId

Workout Domain does NOT own payments.

---

# **DB-3 Aggregate Root Ownership**

Every collection represents exactly one Aggregate Root.

The Aggregate Root is the only entry point into that collection.

Embedded documents cannot exist independently.

Example

WorkoutProgram  
│  
├── Week  
│  
├── Day  
│  
└── ExercisePrescription

Only **WorkoutProgram** is a collection.

The remaining objects exist only within the aggregate.

---

# **DB-4 One Owner Per Data**

Every piece of data has exactly one owner.

Ownership ambiguity is prohibited.

Example

Correct

Payment  
owns

Refund

Incorrect

Payment

and

Admin

both own Refund

The Admin Domain governs refunds but does not own them.

Ownership always remains inside the Payment Domain.

---

# **DB-5 Reference Does Not Mean Ownership**

Referencing another collection never transfers ownership.

Example

WorkoutProgram

references

coachingRelationshipId

This does not mean the Coaching Domain owns Workout Programs.

Ownership remains:

Workout Domain

---

# **DB-6 Embed When Lifecycle Is Dependent**

Objects that cannot exist independently must be embedded.

Embedded documents:

* Have no independent identity  
* Have no independent lifecycle  
* Cannot exist outside their Aggregate Root

Examples

* TrainerShowcase  
* TrainerRequest  
* PricingSnapshot  
* CoachingTimeline  
* Rating  
* WrittenFeedback  
* Week  
* Day

---

# **DB-7 Reference When Lifecycle Is Independent**

Objects with independent identity or lifecycle must exist as separate collections.

Examples

* User  
* ClientProfile  
* TrainerProfile  
* Consultation  
* CoachingOffer  
* Payment  
* CoachingRelationship  
* WorkoutProgram  
* NutritionPlan  
* Review

Each collection has its own lifecycle.

---

# **DB-8 Historical Records Are Immutable**

Historical business records must never be modified.

This applies to:

* Payments  
* Transactions  
* Refunds  
* Payouts  
* Reviews (after lock)  
* Messages  
* Coaching History  
* Completed Workouts  
* Completed Nutrition Records  
* Administrative Actions

Corrections must create new records rather than modifying history.

---

# **DB-9 Snapshot Historical Business Facts**

Whenever future updates could invalidate historical records, immutable snapshots must be stored.

Examples include:

* TrainerSnapshot  
* PricingSnapshot  
* ScopeSnapshot  
* ExerciseSnapshot  
* WorkoutDaySnapshot  
* NutritionDaySnapshot  
* Invoice Snapshot

Snapshots preserve historical accuracy for reporting, auditing, and dispute resolution.

---

# **DB-10 Preserve Auditability**

Business history must remain traceable.

Collections representing business evidence are never physically deleted.

Examples

* Payments  
* Coaching Relationships  
* Reviews  
* Messages  
* Administrative Actions  
* Acquisition Pipelines

Historical business truth must always be preserved.

---

# **DB-11 Collection Independence**

Each collection is responsible only for its own business responsibility.

Collections should not duplicate ownership of business data.

Each collection must remain cohesive and focused on a single aggregate.

---

# **DB-12 State Machines Are Authoritative**

Every lifecycle stored in the database must match the approved State Machines.

Database collections may not introduce additional lifecycle states.

If a state transition is not explicitly defined, it is considered invalid.

---

# **DB-13 Relationships Must Be Explicit**

Every relationship between collections must be explicitly defined.

Relationship types include:

* One-to-One  
* One-to-Many  
* Many-to-Many  
* Embedded Entity  
* Embedded Value Object  
* Reference

Implicit relationships are prohibited.

---

# **DB-14 Data Integrity Before Performance**

Correctness always takes priority over optimization.

Indexes may improve query performance, but they must never compromise business integrity.

Business constraints always override implementation convenience.

---

# **DB-15 Consistent Naming**

All collections, fields, indexes, and references follow consistent naming conventions.

Examples

Collections

users  
trainerProfiles  
payments  
reviews

Reference Fields

userId  
trainerId  
clientId  
paymentId  
coachingRelationshipId

Consistency improves readability and maintainability.

---

# **DB-16 Scalability by Design**

Collections are designed to support future growth without fundamental structural changes.

Scalability considerations include:

* Proper document boundaries  
* Appropriate embedding  
* Controlled referencing  
* Efficient indexing  
* Query optimization  
* Immutable history

---

# **DB-17 Database Is Technology Independent**

Although Version 1 uses MongoDB and Mongoose, the database design remains based on business architecture rather than ODM-specific features.

Business concepts should remain valid regardless of the persistence technology used in future versions.

---

# **DB-18 Source of Truth**

This document serves as the official database blueprint for KIZUNAFIT.

All future implementation layers—including Mongoose Schemas, Repositories, Services, APIs, and Backend Architecture—must follow the database principles defined in this document.

If implementation conflicts with these principles, the implementation must be revised.

The database principles are considered authoritative for all persistence-related decisions.

# **3\. Collection Standards**

This section defines the official standards for designing MongoDB collections within the KIZUNAFIT platform.

Every collection must follow these standards to ensure consistency, maintainability, auditability, and scalability across all business domains.

These standards apply to every collection in the system unless explicitly stated otherwise.

---

# **3.1 Collection Naming Convention**

All MongoDB collections must use:

* **Plural names**  
* **camelCase**  
* **Meaningful business terminology**  
* **Lowercase first letter**

Examples

users  
clientProfiles  
trainerProfiles  
acquisitionPipelines  
consultations  
coachingOffers  
payments  
coachingRelationships  
workoutPrograms  
nutritionPlans  
reviews

Avoid:

User  
tbl\_users  
user\_table  
USERS  
client\_profile

---

# **3.2 Aggregate Root \= Collection**

Each Aggregate Root defined in Entity Modeling becomes exactly one MongoDB collection.

Rule

One Aggregate Root  
        \=  
One MongoDB Collection

Example

| Aggregate Root | Collection |
| ----- | ----- |
| User | users |
| ClientProfile | clientProfiles |
| TrainerProfile | trainerProfiles |
| AcquisitionPipeline | acquisitionPipelines |
| Payment | payments |

Embedded entities do **not** become collections.

---

# **3.3 Collection Ownership**

Every collection belongs to exactly one business domain.

No collection may have multiple owners.

Example

| Collection | Owner Domain |
| ----- | ----- |
| users | Identity |
| trainerProfiles | Profile |
| payments | Payment |
| coachingRelationships | Coaching |
| reviews | Review |

Ownership ambiguity is prohibited.

---

# **3.4 Primary Identifier**

Every collection uses MongoDB's **ObjectId** as its primary identifier.

Standard

\_id : ObjectId

No custom numeric IDs or UUIDs are used as primary keys in Version 1\.

Business identifiers (Invoice Number, Session ID, etc.) may exist as additional fields where required.

---

# **3.5 Reference Field Naming**

All references to other collections must follow the same naming convention.

Pattern

\<collectionNameSingular\>Id

Examples

userId

clientId

trainerId

paymentId

offerId

consultationId

coachingRelationshipId

acquisitionPipelineId

Never use

uid

user

trainer

coachId

paymentRef

Consistency is mandatory.

---

# **3.6 Timestamp Fields**

Every collection must contain timestamp fields.

Standard

createdAt

updatedAt

These timestamps are automatically maintained by Mongoose.

Historical timestamps may also exist depending on business requirements.

Examples

completedAt

acceptedAt

paidAt

processedAt

activatedAt

---

# **3.7 Status Field**

Collections with business lifecycles must include a status field.

The status must follow the approved State Machine.

Example

status

Allowed values depend on the collection.

Examples

Payment

CREATED

PROCESSING

SUCCESS

FAILED

REFUNDED

Review

DRAFT

PUBLISHED

LOCKED

REMOVED

No additional states may be introduced.

---

# **3.8 Embedded Documents**

Objects without independent identity or lifecycle must be embedded.

Examples

TrainerShowcase

TrainerRequest

PricingSnapshot

ScopeSnapshot

Week

Day

ExercisePrescription

Rating

WrittenFeedback

Embedded documents always belong to their Aggregate Root.

They never exist as standalone collections.

---

# **3.9 Referenced Collections**

Objects with independent business identity must be referenced using ObjectId.

Examples

User

ClientProfile

Consultation

Payment

CoachingRelationship

WorkoutProgram

Review

References preserve aggregate boundaries while enabling collaboration across domains.

---

# **3.10 Snapshot Objects**

Historical snapshots are embedded within their owning collection.

Snapshots preserve historical accuracy and must never be modified after creation.

Examples

TrainerSnapshot

PricingSnapshot

ScopeSnapshot

ExerciseSnapshot

WorkoutDaySnapshot

NutritionDaySnapshot

Invoice

Snapshots are immutable.

---

# **3.11 Immutable Collections**

Certain collections represent historical business evidence.

These collections must never be physically deleted or modified after completion.

Examples

payments

reviews (after locked)

messages

administrativeActions

coachingRelationships

workoutCompletions

nutritionCompletions

Corrections create new records.

Existing history remains unchanged.

---

# **3.12 Soft Delete Policy**

Collections that represent active business objects should use soft deletion where applicable.

Typical implementation

status \= DELETED

or

deletedAt

Examples

* Users  
* Profiles

Financial and historical collections are never soft deleted because they are never deleted.

---

# **3.13 Audit Fields**

Collections requiring business accountability should record audit information.

Examples

createdBy

updatedBy

approvedBy

processedBy

reviewedBy

Audit fields are included only where they have business meaning.

---

# **3.14 Index Strategy**

Indexes must support:

* Business constraints  
* Frequently executed queries  
* Relationship lookups  
* Unique validations

Examples

users.email  
UNIQUE

trainerProfiles.availabilityStatus

payments.status

coachingRelationships.clientId

reviews.trainerId

Indexes should be defined explicitly rather than added reactively.

---

# **3.15 Validation Strategy**

Collections must enforce database-level validation.

Validation includes:

* Required fields  
* Enum values  
* Numeric ranges  
* String length  
* Unique constraints  
* Relationship constraints

Example

rating

Minimum : 1

Maximum : 5

Validation complements business logic but does not replace it.

---

# **3.16 Relationship Consistency**

Relationships between collections must always match the approved Entity Modeling.

Supported relationship types

* One-to-One  
* One-to-Many  
* Many-to-Many  
* Embedded Entity  
* Embedded Value Object  
* Reference

Relationship definitions must never be inferred during implementation.

---

# **3.17 Collection Independence**

Each collection is responsible for one business concept only.

Collections must remain cohesive.

Example

Correct

payments

Owns

Refund

Transaction

Subscription

Incorrect

payments

Owns

WorkoutProgram

Business responsibilities must remain within their owning domain.

---

# **3.18 Database Consistency**

Every collection in the platform must satisfy the following checklist.

* Belongs to one domain  
* Has one Aggregate Root  
* Uses ObjectId as the primary key  
* Follows collection naming standards  
* Uses standard reference naming  
* Defines lifecycle status where required  
* Preserves historical records  
* Uses snapshots where necessary  
* Defines indexes  
* Defines validation rules  
* Respects ownership boundaries  
* Supports auditability  
* Maintains business consistency

Only collections satisfying all of these standards are considered compliant with the KIZUNAFIT database architecture.

# **4\. Identity Domain**

The Identity Domain is responsible for authentication, authorization, account ownership, and account security.

This domain manages the complete identity lifecycle of every platform user while remaining completely independent from business profiles, marketplace operations, coaching, and financial data.

The Identity Domain owns the following collections:

* `users`  
* `refreshTokenSessions`  
* `emailVerifications`  
* `passwordResets`

---

# **4.1 User Collection**

## **Collection Name**

users

---

## **Purpose**

Stores every authenticated account in the platform.

Every Client, Trainer, and Admin originates from a single User document.

The User collection is the root of the Identity Domain.

---

## **Aggregate Root**

User

---

## **Owner Domain**

Identity

---

## **Relationships**

| Relationship | Target | Type | Storage |
| ----- | ----- | ----- | ----- |
| User → ClientProfile | clientProfiles | One-to-One | Reference |
| User → TrainerProfile | trainerProfiles | One-to-One | Reference |
| User → RefreshTokenSession | refreshTokenSessions | One-to-Many | Reference |
| User → EmailVerification | emailVerifications | One-to-Many | Reference |
| User → PasswordReset | passwordResets | One-to-Many | Reference |
| User → AcquisitionPipeline (Client) | acquisitionPipelines | One-to-Many | Reference |
| User → AcquisitionPipeline (Trainer) | acquisitionPipelines | One-to-Many | Reference |
| User → Consultation | consultations | One-to-Many | Reference |
| User → CoachingOffer | coachingOffers | One-to-Many | Reference |
| User → Payment | payments | One-to-Many | Reference |
| User → CoachingRelationship | coachingRelationships | One-to-Many | Reference |
| User → Message | messages | One-to-Many | Reference |
| User → Review | reviews | One-to-Many | Reference |

---

## **Main Fields**

\_id  
fullName  
email  
passwordHash  
role  
status  
providers  
emailVerified  
lastLoginAt  
createdAt  
updatedAt

---

## **Indexes**

| Field | Type |
| ----- | ----- |
| email | UNIQUE |
| role | INDEX |
| status | INDEX |
| emailVerified | INDEX |

---

## **Validation Rules**

* Email must be unique.  
* One account \= One role.  
* Role cannot change after registration.  
* Email verification is mandatory for LOCAL authentication.  
* Password is required only for LOCAL provider.

---

## **Lifecycle**

ACTIVE  
SUSPENDED  
BANNED  
DELETED

---

## **Query Patterns**

Frequently queried by:

* email  
* role  
* status  
* \_id

---

## **Soft Delete**

Yes

Users are never physically deleted.

Account removal changes status to **DELETED**.

---

# **4.2 Refresh Token Session Collection**

## **Collection Name**

refreshTokenSessions

---

## **Purpose**

Stores authenticated login sessions for Refresh Token Rotation and Multi-Device Authentication.

Each login device creates one session.

---

## **Owner Domain**

Identity

---

## **Parent Aggregate**

User

---

## **Relationships**

| Relationship | Target | Type |
| ----- | ----- | ----- |
| RefreshTokenSession → User | users | Many-to-One |

---

## **Main Fields**

\_id  
userId  
refreshTokenHash  
deviceInfo  
ipAddress  
expiresAt  
lastUsedAt  
createdAt

---

## **Indexes**

| Field | Type |
| ----- | ----- |
| userId | INDEX |
| refreshTokenHash | UNIQUE |
| expiresAt | TTL INDEX |

---

## **Validation Rules**

* Session belongs to one User.  
* Refresh Token Hash must be unique.  
* Expired sessions are automatically removed.

---

## **Lifecycle**

ACTIVE

↓

EXPIRED

↓

DELETED (TTL)

---

## **Soft Delete**

No

Expired sessions are automatically deleted using MongoDB TTL indexes.

---

# **4.3 Email Verification Collection**

## **Collection Name**

emailVerifications

---

## **Purpose**

Stores temporary email verification records used during account activation.

---

## **Owner Domain**

Identity

---

## **Parent Aggregate**

User

---

## **Relationships**

| Relationship | Target | Type |
| ----- | ----- | ----- |
| EmailVerification → User | users | Many-to-One |

---

## **Main Fields**

\_id  
userId  
otpCodeHash  
expiresAt  
verifiedAt  
createdAt

---

## **Indexes**

| Field | Type |
| ----- | ----- |
| userId | INDEX |
| expiresAt | TTL INDEX |

---

## **Validation Rules**

* OTP is hashed before storage.  
* Verification expires automatically.  
* Verification becomes invalid after successful confirmation.

---

## **Lifecycle**

PENDING

↓

VERIFIED

or

EXPIRED

---

## **Soft Delete**

No

Expired verification records are automatically removed using MongoDB TTL indexes.

---

# **4.4 Password Reset Collection**

## **Collection Name**

passwordResets

---

## **Purpose**

Stores password reset requests and secure reset tokens.

---

## **Owner Domain**

Identity

---

## **Parent Aggregate**

User

---

## **Relationships**

| Relationship | Target | Type |
| ----- | ----- | ----- |
| PasswordReset → User | users | Many-to-One |

---

## **Main Fields**

\_id  
userId  
resetTokenHash  
expiresAt  
usedAt  
createdAt

---

## **Indexes**

| Field | Type |
| ----- | ----- |
| userId | INDEX |
| resetTokenHash | UNIQUE |
| expiresAt | TTL INDEX |

---

## **Validation Rules**

* Reset token must be hashed.  
* Each reset token is single-use.  
* Expired tokens are invalid.  
* Used tokens cannot be reused.

---

## **Lifecycle**

PENDING

↓

USED

or

EXPIRED

---

## **Soft Delete**

No

Expired password reset records are automatically removed using MongoDB TTL indexes.

---

# **Identity Domain Summary**

| Collection | Aggregate | Owner | Relationships |
| ----- | ----- | ----- | ----- |
| users | User | Identity | 1:1 Profiles, 1:N Sessions, 1:N Verification, 1:N Password Reset |
| refreshTokenSessions | RefreshTokenSession | Identity | N:1 User |
| emailVerifications | EmailVerification | Identity | N:1 User |
| passwordResets | PasswordReset | Identity | N:1 User |

---

## **Collection Count**

4 Collections

users

refreshTokenSessions

emailVerifications

passwordResets

The Identity Domain serves as the authentication foundation of KIZUNAFIT. It owns account security, session management, email verification, and password recovery while remaining isolated from business profile and coaching data.

# **5\. Profile Domain**

The Profile Domain manages the business profiles of platform users.

While the Identity Domain owns authentication and account security, the Profile Domain owns all user profile information used throughout the KIZUNAFIT platform.

The Profile Domain contains two independent aggregate roots:

* `clientProfiles`  
* `trainerProfiles`

The Profile Domain does **not** manage authentication, payments, marketplace operations, coaching relationships, or reviews. Those responsibilities belong to their respective domains.

---

# **5.1 Client Profile Collection**

## **Collection Name**

clientProfiles

---

## **Purpose**

Stores the coaching profile of a client.

The Client Profile contains the information required by trainers to understand the client's physical condition, coaching goals, preferences, and health considerations before and during a coaching relationship.

Each client account owns exactly one Client Profile.

---

## **Aggregate Root**

ClientProfile

---

## **Owner Domain**

Profile

---

## **Relationships**

| Relationship | Target | Type | Storage |
| ----- | ----- | ----- | ----- |
| ClientProfile → User | users | One-to-One | Reference |
| ClientProfile → AcquisitionPipeline | acquisitionPipelines | One-to-Many | Reference |
| ClientProfile → Consultation | consultations | One-to-Many | Reference |
| ClientProfile → CoachingOffer | coachingOffers | One-to-Many | Reference |
| ClientProfile → Payment | payments | One-to-Many | Reference |
| ClientProfile → CoachingRelationship | coachingRelationships | One-to-Many | Reference |
| ClientProfile → WorkoutCompletion | workoutCompletions | One-to-Many | Reference |
| ClientProfile → NutritionCompletion | nutritionCompletions | One-to-Many | Reference |
| ClientProfile → CoachingEvaluation | coachingEvaluations | One-to-Many | Reference |
| ClientProfile → Message | messages | One-to-Many | Reference |
| ClientProfile → Review | reviews | One-to-Many | Reference |

---

## **Main Fields**

\_id  
userId  
fullName  
dateOfBirth  
gender  
height  
weight  
activityLevel  
experienceLevel  
fitnessGoals  
dietaryPreferences  
medicalNotes  
profileCompleted  
createdAt  
updatedAt

---

## **Indexes**

| Field | Type |
| ----- | ----- |
| userId | UNIQUE |
| profileCompleted | INDEX |
| fitnessGoals | INDEX |

---

## **Validation Rules**

* One User owns exactly one Client Profile.  
* userId must be unique.  
* Profile cannot exist without a User.  
* Height and Weight must be positive.  
* Profile completion is system-managed.

---

## **Lifecycle**

CREATED

↓

PROFILE\_COMPLETED

↓

UPDATED

Client profiles remain editable throughout the coaching journey.

Historical coaching records always use snapshots when historical accuracy is required.

---

## **Soft Delete**

No

The Client Profile follows the lifecycle of its User account.

---

# **5.2 Trainer Profile Collection**

## **Collection Name**

trainerProfiles

---

## **Purpose**

Stores the trainer's professional marketplace profile.

Trainer Profiles are publicly visible and are used for trainer discovery, evaluation, and selection.

This collection represents the trainer's public identity within the KIZUNAFIT marketplace.

---

## **Aggregate Root**

TrainerProfile

---

## **Owner Domain**

Profile

---

## **Embedded Components**

| Component | Classification |
| ----- | ----- |
| TrainerShowcase | Embedded Entity |

---

## **Relationships**

| Relationship | Target | Type | Storage |
| ----- | ----- | ----- | ----- |
| TrainerProfile → User | users | One-to-One | Reference |
| TrainerProfile → TrainerShowcase | Embedded | One-to-Many | Embedded |
| TrainerProfile → AcquisitionPipeline | acquisitionPipelines | One-to-Many | Reference |
| TrainerProfile → Consultation | consultations | One-to-Many | Reference |
| TrainerProfile → CoachingOffer | coachingOffers | One-to-Many | Reference |
| TrainerProfile → Payment | payments | One-to-Many | Reference |
| TrainerProfile → CoachingRelationship | coachingRelationships | One-to-Many | Reference |
| TrainerProfile → WorkoutProgram | workoutPrograms | One-to-Many | Reference |
| TrainerProfile → NutritionPlan | nutritionPlans | One-to-Many | Reference |
| TrainerProfile → CoachingEvaluation | coachingEvaluations | One-to-Many | Reference |
| TrainerProfile → Message | messages | One-to-Many | Reference |
| TrainerProfile → Review | reviews | One-to-Many | Reference |

---

## **Main Fields**

\_id  
userId  
headline  
bio  
yearsOfExperience  
specializations  
languages  
location  
profileImage  
averageRating  
totalReviews  
totalClients  
availabilityStatus  
profileCompleted  
trainerShowcase  
createdAt  
updatedAt

---

## **Embedded Entity**

### **TrainerShowcase**

Purpose

Represents public evidence of trainer credibility.

Examples

* Certificates  
* Achievements  
* Client Transformations  
* Workshops  
* Events

---

### **TrainerShowcase Fields**

showcaseId  
type  
title  
description  
mediaUrl  
issuedBy  
achievedAt  
createdAt

---

## **Indexes**

| Field | Type |
| ----- | ----- |
| userId | UNIQUE |
| availabilityStatus | INDEX |
| specializations | MULTIKEY |
| languages | MULTIKEY |
| location | INDEX |
| averageRating | INDEX |
| totalReviews | INDEX |
| totalClients | INDEX |

---

## **Validation Rules**

* One User owns exactly one Trainer Profile.  
* userId must be unique.  
* Reputation fields are system-managed.  
* Only AVAILABLE trainers can receive new trainer requests.  
* Showcase items exist only inside the Trainer Profile.

---

## **Availability Status**

AVAILABLE

PAUSED

VACATION

SUSPENDED

BANNED

---

## **Lifecycle**

CREATED

↓

PROFILE\_COMPLETED

↓

AVAILABLE

↓

UPDATED

Trainer profiles remain editable.

Historical marketplace, offer, payment, and coaching records always preserve snapshots where required.

---

## **Soft Delete**

No

The Trainer Profile follows the lifecycle of its User account.

Inactive trainers are managed through **availabilityStatus** rather than deletion.

---

# **Profile Domain Summary**

| Collection | Aggregate | Owner | Relationships |
| ----- | ----- | ----- | ----- |
| clientProfiles | ClientProfile | Profile | 1:1 User, 1:N Acquisition Pipelines, Coaching Relationships, Reviews, Messages |
| trainerProfiles | TrainerProfile | Profile | 1:1 User, 1:N Showcase (Embedded), Acquisition Pipelines, Workout Programs, Nutrition Plans, Reviews |

---

## **Collection Count**

2 Collections

clientProfiles

trainerProfiles

---

## **Embedded Documents**

TrainerShowcase

The Profile Domain provides the business identity of every client and trainer. It bridges authenticated users with the marketplace and coaching ecosystem while maintaining clear ownership boundaries between authentication and profile information.

# **6\. Marketplace Domain**

The Marketplace Domain manages the client acquisition process that connects clients with trainers before coaching begins.

This domain is responsible for tracking the complete acquisition journey, starting from the trainer request and ending when the client successfully enters an active coaching relationship or the acquisition process is terminated.

The Marketplace Domain does **not** own consultations, coaching offers, payments, subscriptions, or coaching relationships. It only coordinates the acquisition lifecycle until ownership is transferred to the next domain.

The Marketplace Domain contains one aggregate root:

* `acquisitionPipelines`

---

# **6.1 Acquisition Pipeline Collection**

## **Collection Name**

acquisitionPipelines

---

## **Purpose**

Represents the complete acquisition journey between one client and one trainer.

Every time a client requests coaching from a trainer, a new Acquisition Pipeline is created.

The pipeline tracks the complete business flow from:

Trainer Request  
        ↓  
Consultation  
        ↓  
Coaching Offer  
        ↓  
Payment  
        ↓  
Active Coaching Relationship

Each acquisition is independent.

Previous acquisition history is never reused.

---

## **Aggregate Root**

AcquisitionPipeline

---

## **Owner Domain**

Marketplace

---

## **Embedded Components**

| Component | Classification |
| ----- | ----- |
| TrainerRequest | Embedded Entity |
| TrainerSnapshot | Embedded Value Object |

---

## **Relationships**

| Relationship | Target | Type | Storage |
| ----- | ----- | ----- | ----- |
| AcquisitionPipeline → ClientProfile | clientProfiles | Many-to-One | Reference |
| AcquisitionPipeline → TrainerProfile | trainerProfiles | Many-to-One | Reference |
| AcquisitionPipeline → User (Client) | users | Many-to-One | Reference |
| AcquisitionPipeline → User (Trainer) | users | Many-to-One | Reference |
| AcquisitionPipeline → Consultation | consultations | One-to-One | Reference |
| AcquisitionPipeline → CoachingOffer | coachingOffers | One-to-One | Reference |
| AcquisitionPipeline → Payment | payments | One-to-One | Reference |
| AcquisitionPipeline → CoachingRelationship | coachingRelationships | One-to-One | Reference |

---

## **Main Fields**

\_id  
clientId  
trainerId  
trainerRequest  
trainerSnapshot  
status  
createdAt  
updatedAt

---

## **Embedded Entity**

### **TrainerRequest**

Represents the client's initial request to receive coaching from a trainer.

The Trainer Request exists only inside an Acquisition Pipeline and cannot exist independently.

---

### **TrainerRequest Fields**

requestId  
clientMessage  
status  
submittedAt  
respondedAt  
responseReason

---

### **TrainerRequest Status**

REQUEST\_PENDING

REQUEST\_ACCEPTED

REQUEST\_REJECTED

REQUEST\_CANCELLED

---

## **Embedded Value Object**

### **TrainerSnapshot**

Stores immutable trainer information at the moment the acquisition begins.

This protects historical acquisition records from future Trainer Profile updates.

---

### **TrainerSnapshot Fields**

trainerId  
fullName  
headline  
profileImage  
specializations  
yearsOfExperience  
averageRating

---

## **Indexes**

| Field | Type |
| ----- | ----- |
| clientId | INDEX |
| trainerId | INDEX |
| status | INDEX |
| createdAt | INDEX |
| clientId \+ status | COMPOUND |
| trainerId \+ status | COMPOUND |
| clientId \+ trainerId | COMPOUND |

---

## **Validation Rules**

* Every Acquisition Pipeline must reference exactly one Client.  
* Every Acquisition Pipeline must reference exactly one Trainer.  
* One client may have only one active Acquisition Pipeline at a time.  
* Every new trainer request creates a new Acquisition Pipeline.  
* Completed or cancelled pipelines are never reused.  
* TrainerSnapshot is immutable after creation.  
* TrainerRequest exists only within the Acquisition Pipeline.

---

## **Lifecycle**

REQUEST\_PENDING

↓

REQUEST\_ACCEPTED

↓

CONSULTATION\_PENDING

↓

CONSULTATION\_BOOKED

↓

CONSULTATION\_COMPLETED

↓

OFFER\_SENT

↓

PAYMENT\_PENDING

↓

SUBSCRIPTION\_ACTIVE

↓

SUBSCRIPTION\_COMPLETED

Possible terminal states

REJECTED

CANCELLED

EXPIRED

PAYMENT\_FAILED

The lifecycle follows the approved Marketplace State Machine exactly.

---

## **Query Patterns**

Frequently queried by:

* clientId  
* trainerId  
* status  
* acquisitionPipelineId  
* createdAt

Typical queries include:

* Active acquisition for a client  
* Pending trainer requests  
* Trainer acquisition history  
* Marketplace reporting  
* Conversion funnel analysis

---

## **Soft Delete**

No

Acquisition Pipelines are permanent historical business records.

Pipelines are never physically deleted because they provide:

* Business audit history  
* Acquisition analytics  
* Conversion metrics  
* Customer journey tracking  
* Dispute investigation

---

# **Marketplace Domain Summary**

| Collection | Aggregate | Owner | Relationships |
| ----- | ----- | ----- | ----- |
| acquisitionPipelines | AcquisitionPipeline | Marketplace | N:1 Client, N:1 Trainer, 1:1 Consultation, 1:1 CoachingOffer, 1:1 Payment, 1:1 CoachingRelationship |

---

## **Embedded Documents**

TrainerRequest

TrainerSnapshot

---

## **Collection Count**

1 Collection

acquisitionPipelines

The Marketplace Domain serves as the bridge between platform discovery and active coaching. It owns the complete client acquisition lifecycle while maintaining clear ownership boundaries with the Consultation, Offer, Payment, and Coaching domains. It preserves every acquisition journey as immutable historical business evidence.

# **7\. Consultation Domain**

The Consultation Domain manages the consultation process between clients and trainers before a coaching relationship begins.

A consultation allows both parties to evaluate coaching suitability, discuss goals, clarify expectations, and determine whether to proceed with a coaching offer.

The Consultation Domain owns scheduling, meeting coordination, consultation history, and consultation lifecycle.

It does **not** own coaching offers, payments, subscriptions, or coaching relationships.

The Consultation Domain contains one aggregate root:

* `consultations`

---

# **7.1 Consultation Collection**

## **Collection Name**

consultations

---

## **Purpose**

Represents a consultation session between one client and one trainer within an Acquisition Pipeline.

Each consultation belongs to exactly one acquisition process.

A consultation exists only to support the pre-sale coaching evaluation process.

Successful consultations may lead to a Coaching Offer.

---

## **Aggregate Root**

Consultation

---

## **Owner Domain**

Consultation

---

## **Embedded Components**

| Component | Classification |
| ----- | ----- |
| ConsultationSlot | Embedded Entity |
| MeetingDetails | Embedded Value Object |

---

## **Relationships**

| Relationship | Target | Type | Storage |
| ----- | ----- | ----- | ----- |
| Consultation → AcquisitionPipeline | acquisitionPipelines | One-to-One | Reference |
| Consultation → ClientProfile | clientProfiles | Many-to-One | Reference |
| Consultation → TrainerProfile | trainerProfiles | Many-to-One | Reference |
| Consultation → User (Client) | users | Many-to-One | Reference |
| Consultation → User (Trainer) | users | Many-to-One | Reference |
| Consultation → CoachingOffer | coachingOffers | One-to-One | Reference |

---

## **Main Fields**

\_id  
acquisitionPipelineId  
clientId  
trainerId  
slot  
meetingDetails  
status  
scheduledAt  
completedAt  
createdAt  
updatedAt

---

## **Embedded Entity**

### **ConsultationSlot**

Represents the reserved consultation time slot.

The slot belongs exclusively to the Consultation aggregate and cannot exist independently.

---

### **ConsultationSlot Fields**

slotId  
startTime  
endTime  
timezone  
bookedAt

---

## **Embedded Value Object**

### **MeetingDetails**

Stores the meeting information required for the consultation session.

Meeting details describe the consultation but do not possess independent identity.

---

### **MeetingDetails Fields**

platform  
meetingUrl  
meetingCode  
meetingInstructions

---

### **Supported Meeting Platforms**

GOOGLE\_MEET

ZOOM

MICROSOFT\_TEAMS

CUSTOM

---

## **Indexes**

| Field | Type |
| ----- | ----- |
| acquisitionPipelineId | UNIQUE |
| clientId | INDEX |
| trainerId | INDEX |
| status | INDEX |
| scheduledAt | INDEX |
| trainerId \+ scheduledAt | COMPOUND |
| clientId \+ scheduledAt | COMPOUND |

---

## **Validation Rules**

* Every Consultation belongs to exactly one Acquisition Pipeline.  
* One Acquisition Pipeline may contain only one Consultation.  
* Consultation cannot exist before a Trainer Request is accepted.  
* ConsultationSlot exists only within the Consultation aggregate.  
* MeetingDetails are embedded and cannot exist independently.  
* Consultation records are never reused.

---

## **Lifecycle**

CREATED

↓

SLOT\_BOOKED

↓

SCHEDULED

↓

COMPLETED

Possible terminal states

CANCELLED

NO\_SHOW

The lifecycle must follow the approved Consultation State Machine.

---

## **Query Patterns**

Frequently queried by:

* acquisitionPipelineId  
* clientId  
* trainerId  
* status  
* scheduledAt

Typical queries include:

* Upcoming consultations  
* Trainer consultation schedule  
* Client consultation history  
* Daily consultation calendar  
* Completed consultation history

---

## **Soft Delete**

No

Consultation records are permanent business records.

Completed, cancelled, and missed consultations are preserved for:

* Coaching history  
* Business reporting  
* Trainer performance metrics  
* Customer support  
* Audit trails

Consultation documents are never physically deleted.

---

# **Consultation Domain Summary**

| Collection | Aggregate | Owner | Relationships |
| ----- | ----- | ----- | ----- |
| consultations | Consultation | Consultation | 1:1 AcquisitionPipeline, N:1 Client, N:1 Trainer, 1:1 CoachingOffer |

---

## **Embedded Documents**

ConsultationSlot

MeetingDetails

---

## **Collection Count**

1 Collection

consultations

The Consultation Domain bridges the Marketplace and Offer domains by managing the complete consultation process before a coaching proposal is created. It preserves consultation scheduling, meeting coordination, and consultation history while maintaining clear ownership boundaries with Acquisition Pipelines and Coaching Offers.

# **8\. Offer Domain**

The Offer Domain manages coaching proposals created by trainers after a successful consultation.

A Coaching Offer represents the official business proposal sent from a trainer to a client. It defines the coaching scope, pricing, duration, included services, and offer validity before payment is made.

The Offer Domain acts as the bridge between the Consultation Domain and the Payment Domain.

The Offer Domain owns one aggregate root:

* `coachingOffers`

The Offer Domain does **not** own payments, subscriptions, coaching relationships, or financial transactions. Those responsibilities belong to the Payment Domain.

---

# **8.1 Coaching Offer Collection**

## **Collection Name**

coachingOffers

---

## **Purpose**

Represents a coaching proposal created by a trainer for a client after a completed consultation.

Each offer preserves the exact agreement that existed at the time it was created, including pricing and coaching scope.

Accepted offers become immutable and serve as the foundation for payment processing.

---

## **Aggregate Root**

CoachingOffer

---

## **Owner Domain**

Offer

---

## **Embedded Components**

| Component | Classification |
| ----- | ----- |
| PricingSnapshot | Embedded Value Object |
| ScopeSnapshot | Embedded Value Object |

---

## **Relationships**

| Relationship | Target | Type | Storage |
| ----- | ----- | ----- | ----- |
| CoachingOffer → AcquisitionPipeline | acquisitionPipelines | One-to-One | Reference |
| CoachingOffer → Consultation | consultations | One-to-One | Reference |
| CoachingOffer → ClientProfile | clientProfiles | Many-to-One | Reference |
| CoachingOffer → TrainerProfile | trainerProfiles | Many-to-One | Reference |
| CoachingOffer → User (Client) | users | Many-to-One | Reference |
| CoachingOffer → User (Trainer) | users | Many-to-One | Reference |
| CoachingOffer → Payment | payments | One-to-One | Reference |

---

## **Main Fields**

\_id  
acquisitionPipelineId  
consultationId  
clientId  
trainerId  
pricingSnapshot  
scopeSnapshot  
status  
expiresAt  
acceptedAt  
declinedAt  
createdAt  
updatedAt

---

## **Embedded Value Object**

### **PricingSnapshot**

Represents the immutable pricing agreed upon when the offer was created.

Pricing information is permanently preserved even if the trainer changes future pricing.

---

### **PricingSnapshot Fields**

trainerFee  
platformFee  
totalAmount  
currency

---

## **Embedded Value Object**

### **ScopeSnapshot**

Represents the exact coaching scope offered to the client.

The scope remains permanently attached to the offer regardless of future trainer service updates.

---

### **ScopeSnapshot Fields**

durationDays  
planType  
includedFeatures  
trainerNotes

---

## **Indexes**

| Field | Type |
| ----- | ----- |
| acquisitionPipelineId | UNIQUE |
| consultationId | UNIQUE |
| clientId | INDEX |
| trainerId | INDEX |
| status | INDEX |
| expiresAt | INDEX |
| createdAt | INDEX |
| trainerId \+ status | COMPOUND |
| clientId \+ status | COMPOUND |

---

## **Validation Rules**

* Every Coaching Offer belongs to exactly one Acquisition Pipeline.  
* Every Coaching Offer belongs to exactly one Consultation.  
* A Consultation may create only one Coaching Offer.  
* Offers can only be created after a completed Consultation.  
* PricingSnapshot is immutable after creation.  
* ScopeSnapshot is immutable after creation.  
* Accepted offers cannot be modified.  
* Expired offers cannot be accepted.

---

## **Lifecycle**

DRAFT

↓

SENT

↓

ACCEPTED

Possible terminal states

DECLINED

EXPIRED

Accepted offers proceed to the Payment Domain.

The lifecycle must follow the approved Offer State Machine.

---

## **Query Patterns**

Frequently queried by:

* acquisitionPipelineId  
* consultationId  
* clientId  
* trainerId  
* status  
* expiresAt

Typical queries include:

* Active offers for a client  
* Pending trainer offers  
* Expired offers  
* Accepted offers awaiting payment  
* Historical offer records

---

## **Soft Delete**

No

Coaching Offers are permanent business records.

Offers are never physically deleted because they serve as legal and financial evidence of the agreement proposed between trainer and client.

Accepted, declined, and expired offers are preserved for:

* Financial verification  
* Audit trails  
* Dispute resolution  
* Business reporting  
* Coaching history

---

# **Offer Domain Summary**

| Collection | Aggregate | Owner | Relationships |
| ----- | ----- | ----- | ----- |
| coachingOffers | CoachingOffer | Offer | 1:1 AcquisitionPipeline, 1:1 Consultation, N:1 Client, N:1 Trainer, 1:1 Payment |

---

## **Embedded Documents**

PricingSnapshot

ScopeSnapshot

---

## **Collection Count**

1 Collection

coachingOffers

The Offer Domain formalizes the coaching agreement between trainer and client before payment occurs. By preserving immutable pricing and coaching scope snapshots, it ensures that every accepted proposal remains historically accurate and provides a reliable foundation for payment processing, dispute resolution, and future auditing.

# **9\. Payment Domain**

The Payment Domain manages the complete financial lifecycle of coaching subscriptions within the KIZUNAFIT platform.

It is responsible for payment processing, subscription management, invoices, refunds, disputes, trainer payouts, and financial settlements.

The Payment Domain serves as the financial source of truth for the platform. Every financial event is immutable, auditable, and historically preserved.

Unlike most domains, the Payment aggregate intentionally contains several embedded financial records because they share the same lifecycle and ownership.

The Payment Domain contains one aggregate root:

* `payments`

---

# **9.1 Payment Collection**

## **Collection Name**

payments

---

## **Purpose**

Represents the complete financial lifecycle of one coaching purchase.

A Payment begins when a client decides to purchase a Coaching Offer and continues until the subscription is completed or permanently terminated.

Rather than scattering financial information across multiple collections, all financial events related to one purchase are stored within a single aggregate.

This guarantees consistency, transactional integrity, and simplified auditing.

---

## **Aggregate Root**

Payment

---

## **Owner Domain**

Payment

---

## **Embedded Components**

| Component | Classification |
| ----- | ----- |
| Transaction | Embedded Entity |
| Subscription | Embedded Entity |
| Invoice | Embedded Entity |
| Refund | Embedded Entity |
| Dispute | Embedded Entity |
| Payout | Embedded Entity |
| Settlement | Embedded Entity |

---

## **Relationships**

| Relationship | Target | Type | Storage |
| ----- | ----- | ----- | ----- |
| Payment → CoachingOffer | coachingOffers | One-to-One | Reference |
| Payment → AcquisitionPipeline | acquisitionPipelines | One-to-One | Reference |
| Payment → ClientProfile | clientProfiles | Many-to-One | Reference |
| Payment → TrainerProfile | trainerProfiles | Many-to-One | Reference |
| Payment → User (Client) | users | Many-to-One | Reference |
| Payment → User (Trainer) | users | Many-to-One | Reference |
| Payment → CoachingRelationship | coachingRelationships | One-to-One | Reference |

---

## **Main Fields**

\_id  
acquisitionPipelineId  
coachingOfferId  
clientId  
trainerId  
transaction  
subscription  
invoice  
refund  
dispute  
payout  
settlement  
status  
paymentGateway  
gatewayReference  
createdAt  
updatedAt

---

# **Embedded Entity**

## **Transaction**

Represents the actual payment transaction executed through the payment gateway.

Each Payment has exactly one primary transaction.

---

### **Transaction Fields**

transactionId  
gatewayTransactionId  
amount  
currency  
paymentMethod  
gateway  
gatewayStatus  
paidAt

---

# **Embedded Entity**

## **Subscription**

Represents the purchased coaching subscription.

This determines the active coaching period after successful payment.

---

### **Subscription Fields**

subscriptionId  
planName  
startDate  
endDate  
durationDays  
status  
activatedAt  
completedAt

---

### **Subscription Status**

ACTIVE

PAUSED

EXPIRED

COMPLETED

CANCELLED

---

# **Embedded Entity**

## **Invoice**

Represents the official financial invoice generated for the payment.

Invoices are immutable legal records.

---

### **Invoice Fields**

invoiceNumber  
subtotal  
platformFee  
trainerAmount  
taxAmount  
totalAmount  
currency  
generatedAt

---

# **Embedded Entity**

## **Refund**

Represents refund information if money is returned to the client.

Refund records are optional.

---

### **Refund Fields**

refundId  
refundAmount  
reason  
gatewayReference  
processedAt  
status

---

# **Embedded Entity**

## **Dispute**

Represents financial disputes raised by either the client or the trainer.

Disputes remain permanently attached to the payment.

---

### **Dispute Fields**

disputeId  
raisedBy  
reason  
status  
openedAt  
resolvedAt  
resolution

---

# **Embedded Entity**

## **Payout**

Represents trainer earnings generated from this payment.

Payout processing is independent from payment processing but belongs to the same financial record.

---

### **Payout Fields**

payoutId  
trainerAmount  
platformCommission  
scheduledAt  
paidAt  
status

---

# **Embedded Entity**

## **Settlement**

Represents the final financial reconciliation for this payment.

Settlement confirms that all financial obligations have been completed.

---

### **Settlement Fields**

settlementId  
status  
settledAmount  
settledAt  
remarks

---

## **Indexes**

| Field | Type |
| ----- | ----- |
| coachingOfferId | UNIQUE |
| acquisitionPipelineId | UNIQUE |
| clientId | INDEX |
| trainerId | INDEX |
| status | INDEX |
| paymentGateway | INDEX |
| transaction.gatewayTransactionId | UNIQUE |
| invoice.invoiceNumber | UNIQUE |
| subscription.status | INDEX |
| createdAt | INDEX |
| trainerId \+ status | COMPOUND |
| clientId \+ status | COMPOUND |

---

## **Validation Rules**

* Every Payment belongs to exactly one Coaching Offer.  
* Every Coaching Offer can generate only one Payment.  
* Every Payment belongs to one Acquisition Pipeline.  
* Transaction data becomes immutable after successful payment.  
* Invoice cannot be modified after generation.  
* Subscription starts only after successful payment.  
* Refund cannot exceed the original payment amount.  
* Settlement occurs only after payout completion.  
* Financial records are immutable.

---

## **Lifecycle**

PAYMENT\_PENDING

↓

PAYMENT\_PROCESSING

↓

PAYMENT\_SUCCESS

↓

SUBSCRIPTION\_ACTIVE

↓

SUBSCRIPTION\_COMPLETED

↓

SETTLED

Possible terminal states

PAYMENT\_FAILED

PAYMENT\_CANCELLED

REFUNDED

DISPUTED

The lifecycle must follow the approved Payment State Machine.

---

## **Query Patterns**

Frequently queried by:

* coachingOfferId  
* acquisitionPipelineId  
* clientId  
* trainerId  
* transaction.gatewayTransactionId  
* invoice.invoiceNumber  
* subscription.status  
* status  
* createdAt

Typical queries include:

* Client payment history  
* Trainer revenue  
* Active subscriptions  
* Invoice lookup  
* Refund history  
* Payout processing  
* Financial reports  
* Monthly settlements

---

## **Soft Delete**

**No**

Payments are permanent financial records.

No payment document is ever physically deleted.

Financial history must always remain available for:

* Legal compliance  
* Accounting  
* Tax reporting  
* Audit trails  
* Customer support  
* Dispute resolution  
* Revenue analytics

Corrections are recorded through additional financial events (refunds, disputes, adjustments) rather than modifying existing records.

---

# **Payment Domain Summary**

| Collection | Aggregate | Owner | Relationships |
| ----- | ----- | ----- | ----- |
| payments | Payment | Payment | 1:1 CoachingOffer, 1:1 AcquisitionPipeline, N:1 Client, N:1 Trainer, 1:1 CoachingRelationship |

---

## **Embedded Documents**

Transaction

Subscription

Invoice

Refund

Dispute

Payout

Settlement

---

## **Collection Count**

1 Collection

payments

The Payment Domain is the financial backbone of KIZUNAFIT. It centralizes every monetary event related to a coaching purchase into a single immutable aggregate, ensuring historical accuracy, auditability, and consistency across payments, subscriptions, invoices, refunds, disputes, payouts, and settlements. Humans tend to scatter financial records across half a dozen collections and then wonder why reconciliation takes three days. Keeping one purchase inside one aggregate saves both database queries and future headaches.

# **10\. Coaching Domain**

The Coaching Domain manages the active coaching relationship between a trainer and a client after a successful payment.

A Coaching Relationship represents the official business contract between both parties. It becomes the central hub for all coaching activities, including workout programs, nutrition plans, progress evaluations, messaging, and reviews.

Unlike the Marketplace Domain, which manages customer acquisition, the Coaching Domain manages the actual coaching lifecycle.

The Coaching Domain contains one aggregate root:

* `coachingRelationships`

The Coaching Domain does **not** own workout programs, nutrition plans, evaluations, messages, or reviews. Those domains reference the Coaching Relationship as their parent business context.

---

# **10.1 Coaching Relationship Collection**

## **Collection Name**

coachingRelationships

---

## **Purpose**

Represents an active coaching agreement between one trainer and one client.

A Coaching Relationship is created only after a successful payment and remains the primary business context throughout the coaching journey.

Every workout program, nutrition plan, evaluation, message, and review belongs to exactly one Coaching Relationship.

---

## **Aggregate Root**

CoachingRelationship

---

## **Owner Domain**

Coaching

---

## **Embedded Components**

| Component | Classification |
| ----- | ----- |
| CoachingTimeline | Embedded Entity |

---

## **Relationships**

| Relationship | Target | Type | Storage |
| ----- | ----- | ----- | ----- |
| CoachingRelationship → Payment | payments | One-to-One | Reference |
| CoachingRelationship → AcquisitionPipeline | acquisitionPipelines | One-to-One | Reference |
| CoachingRelationship → ClientProfile | clientProfiles | Many-to-One | Reference |
| CoachingRelationship → TrainerProfile | trainerProfiles | Many-to-One | Reference |
| CoachingRelationship → User (Client) | users | Many-to-One | Reference |
| CoachingRelationship → User (Trainer) | users | Many-to-One | Reference |
| CoachingRelationship → WorkoutProgram | workoutPrograms | One-to-Many | Reference |
| CoachingRelationship → NutritionPlan | nutritionPlans | One-to-Many | Reference |
| CoachingRelationship → CoachingEvaluation | coachingEvaluations | One-to-Many | Reference |
| CoachingRelationship → Message | messages | One-to-Many | Reference |
| CoachingRelationship → Review | reviews | One-to-One | Reference |

---

## **Main Fields**

\_id  
paymentId  
acquisitionPipelineId  
clientId  
trainerId  
timeline  
status  
startedAt  
endedAt  
createdAt  
updatedAt

---

# **Embedded Entity**

## **CoachingTimeline**

Represents important milestones throughout the coaching journey.

The timeline exists only within a Coaching Relationship and provides a chronological business history.

---

### **CoachingTimeline Fields**

activatedAt  
firstWorkoutAssignedAt  
firstNutritionPlanAssignedAt  
lastEvaluationAt  
completedAt  
cancelledAt

---

## **Indexes**

| Field | Type |
| ----- | ----- |
| paymentId | UNIQUE |
| acquisitionPipelineId | UNIQUE |
| clientId | INDEX |
| trainerId | INDEX |
| status | INDEX |
| startedAt | INDEX |
| endedAt | INDEX |
| trainerId \+ status | COMPOUND |
| clientId \+ status | COMPOUND |

---

## **Validation Rules**

* Every Coaching Relationship belongs to exactly one Payment.  
* Every successful Payment creates only one Coaching Relationship.  
* One Payment cannot generate multiple Coaching Relationships.  
* Workout Programs, Nutrition Plans, Messages, Evaluations, and Reviews must reference an existing Coaching Relationship.  
* CoachingTimeline exists only within the Coaching Relationship.  
* The relationship becomes immutable after completion except for administrative actions.

---

## **Lifecycle**

CREATED

↓

ACTIVE

↓

PAUSED

↓

RESUMED

↓

COMPLETED

Possible terminal states

CANCELLED

TERMINATED

The lifecycle must follow the approved Coaching State Machine.

---

## **Query Patterns**

Frequently queried by:

* paymentId  
* acquisitionPipelineId  
* clientId  
* trainerId  
* status  
* startedAt

Typical queries include:

* Active coaching relationships  
* Trainer's active clients  
* Client's current coach  
* Coaching history  
* Completed coaching relationships  
* Dashboard statistics

---

## **Soft Delete**

**No**

Coaching Relationships are permanent business records.

They are never physically deleted because they preserve:

* Coaching history  
* Client progress history  
* Trainer performance history  
* Payment linkage  
* Audit trails  
* Business reporting

Completed or terminated coaching relationships remain available for historical reporting and future analytics.

---

# **Coaching Domain Summary**

| Collection | Aggregate | Owner | Relationships |
| ----- | ----- | ----- | ----- |
| coachingRelationships | CoachingRelationship | Coaching | 1:1 Payment, 1:1 AcquisitionPipeline, N:1 Client, N:1 Trainer, 1:N Workout Programs, 1:N Nutrition Plans, 1:N Evaluations, 1:N Messages, 1:1 Review |

---

## **Embedded Documents**

CoachingTimeline

---

## **Collection Count**

1 Collection

coachingRelationships

The Coaching Domain is the operational core of KIZUNAFIT. Once a client purchases coaching, the Coaching Relationship becomes the central business context that connects every coaching activity across the platform. It acts as the parent reference for workout programming, nutrition planning, progress tracking, communication, and feedback, while preserving a complete and immutable history of the coaching journey. It is essentially the project's gravitational center. Everything else orbits around it, which is refreshingly orderly for software built by humans.

# **11\. Workout Domain**

The Workout Domain manages exercise definitions, workout programming, and workout completion tracking throughout the coaching lifecycle.

It is responsible for creating structured workout plans, assigning exercises, tracking workout execution, and preserving historical workout performance.

The Workout Domain intentionally separates **Exercise Library**, **Workout Programs**, and **Workout Completions** because each has an independent lifecycle and business responsibility.

The Workout Domain contains three aggregate roots:

* `exercises`  
* `workoutPrograms`  
* `workoutCompletions`

The Workout Domain references the Coaching Domain but does not own coaching relationships.

---

# **11.1 Exercise Collection**

## **Collection Name**

exercises

---

## **Purpose**

Stores the master exercise library used throughout the platform.

Exercises are reusable templates and contain only exercise definitions. They never store client-specific prescription or performance data.

An Exercise may be used in thousands of Workout Programs.

---

## **Aggregate Root**

Exercise

---

## **Owner Domain**

Workout

---

## **Relationships**

| Relationship | Target | Type | Storage |
| ----- | ----- | ----- | ----- |
| Exercise ← WorkoutProgram | workoutPrograms | One-to-Many | Reference |

---

## **Main Fields**

\_id  
name  
slug  
category  
primaryMuscles  
secondaryMuscles  
equipment  
difficulty  
exerciseType  
instructions  
tips  
videoUrl  
thumbnailUrl  
status  
createdAt  
updatedAt

---

## **Indexes**

| Field | Type |
| ----- | ----- |
| slug | UNIQUE |
| category | INDEX |
| equipment | INDEX |
| difficulty | INDEX |
| primaryMuscles | MULTIKEY |
| exerciseType | INDEX |

---

## **Validation Rules**

* Exercise name must be unique.  
* Slug must be unique.  
* Exercise library entries are reusable.  
* Exercise definitions remain independent of client programs.

---

## **Lifecycle**

ACTIVE

↓

ARCHIVED

---

## **Soft Delete**

No

Exercises are archived instead of deleted to preserve historical workout references.

---

# **11.2 Workout Program Collection**

## **Collection Name**

workoutPrograms

---

## **Purpose**

Represents a structured workout plan assigned by a trainer to a client.

A Workout Program belongs to one Coaching Relationship and may contain multiple weeks, days, and exercise prescriptions.

The program remains editable until published. Historical versions are preserved through snapshots.

---

## **Aggregate Root**

WorkoutProgram

---

## **Owner Domain**

Workout

---

## **Embedded Components**

| Component | Classification |
| ----- | ----- |
| Week | Embedded Entity |
| Day | Embedded Entity |
| ExercisePrescription | Embedded Entity |
| ExerciseSnapshot | Embedded Value Object |

---

## **Relationships**

| Relationship | Target | Type | Storage |
| ----- | ----- | ----- | ----- |
| WorkoutProgram → CoachingRelationship | coachingRelationships | Many-to-One | Reference |
| WorkoutProgram → TrainerProfile | trainerProfiles | Many-to-One | Reference |
| WorkoutProgram → ClientProfile | clientProfiles | Many-to-One | Reference |
| WorkoutProgram → Exercise | exercises | One-to-Many | Reference (Snapshot Stored) |
| WorkoutProgram ← WorkoutCompletion | workoutCompletions | One-to-Many | Reference |

---

## **Main Fields**

\_id  
coachingRelationshipId  
trainerId  
clientId  
title  
description  
weeks  
status  
publishedAt  
createdAt  
updatedAt

---

## **Embedded Entity**

### **Week**

weekNumber  
title  
days

---

### **Day**

dayNumber  
title  
exercisePrescriptions

---

### **ExercisePrescription**

Represents how a particular exercise should be performed.

exerciseId  
exerciseSnapshot  
sets  
reps  
weight  
restTime  
tempo  
notes  
order

---

### **ExerciseSnapshot**

Stores immutable exercise information at the time the workout was published.

exerciseId  
exerciseName  
category  
equipment  
difficulty

---

## **Indexes**

| Field | Type |
| ----- | ----- |
| coachingRelationshipId | INDEX |
| trainerId | INDEX |
| clientId | INDEX |
| status | INDEX |
| publishedAt | INDEX |

---

## **Validation Rules**

* Every Workout Program belongs to one Coaching Relationship.  
* Only one ACTIVE Workout Program per Coaching Relationship.  
* ExerciseSnapshot becomes immutable after publication.  
* Embedded entities cannot exist independently.

---

## **Lifecycle**

DRAFT

↓

PUBLISHED

↓

ACTIVE

↓

COMPLETED

Possible terminal states

ARCHIVED

---

## **Query Patterns**

Frequently queried by:

* coachingRelationshipId  
* trainerId  
* clientId  
* status

---

## **Soft Delete**

No

Workout Programs are archived to preserve coaching history.

---

# **11.3 Workout Completion Collection**

## **Collection Name**

workoutCompletions

---

## **Purpose**

Stores the actual workout performed by the client.

Each completion record captures exactly what happened during a workout session, preserving historical performance regardless of future program changes.

---

## **Aggregate Root**

WorkoutCompletion

---

## **Owner Domain**

Workout

---

## **Embedded Components**

| Component | Classification |
| ----- | ----- |
| WorkoutDaySnapshot | Embedded Value Object |
| ExercisePerformance | Embedded Entity |

---

## **Relationships**

| Relationship | Target | Type | Storage |
| ----- | ----- | ----- | ----- |
| WorkoutCompletion → WorkoutProgram | workoutPrograms | Many-to-One | Reference |
| WorkoutCompletion → CoachingRelationship | coachingRelationships | Many-to-One | Reference |
| WorkoutCompletion → ClientProfile | clientProfiles | Many-to-One | Reference |

---

## **Main Fields**

\_id  
workoutProgramId  
coachingRelationshipId  
clientId  
workoutDaySnapshot  
exercisePerformances  
completedAt  
duration  
status  
createdAt

---

## **Embedded Value Object**

### **WorkoutDaySnapshot**

weekNumber  
dayNumber  
title  
plannedExercises

---

## **Embedded Entity**

### **ExercisePerformance**

exerciseId  
exerciseName  
completedSets  
completedReps  
completedWeight  
duration  
caloriesBurned  
notes  
completed

---

## **Indexes**

| Field | Type |
| ----- | ----- |
| workoutProgramId | INDEX |
| coachingRelationshipId | INDEX |
| clientId | INDEX |
| completedAt | INDEX |
| status | INDEX |
| clientId \+ completedAt | COMPOUND |

---

## **Validation Rules**

* Completion belongs to one Workout Program.  
* Completion belongs to one Coaching Relationship.  
* WorkoutDaySnapshot is immutable.  
* Exercise performances cannot be modified after submission.

---

## **Lifecycle**

IN\_PROGRESS

↓

COMPLETED

Possible terminal state

MISSED

---

## **Query Patterns**

Frequently queried by:

* clientId  
* coachingRelationshipId  
* workoutProgramId  
* completedAt

Typical queries include:

* Workout history  
* Client progress  
* Weekly completion rate  
* Exercise performance trends  
* Trainer dashboard

---

## **Soft Delete**

**No**

Workout completion records are permanent historical evidence.

They are never deleted because they represent the client's actual training history.

---

# **Workout Domain Summary**

| Collection | Aggregate | Owner | Relationships |
| ----- | ----- | ----- | ----- |
| exercises | Exercise | Workout | Referenced by Workout Programs |
| workoutPrograms | WorkoutProgram | Workout | N:1 CoachingRelationship, 1:N Workout Completions |
| workoutCompletions | WorkoutCompletion | Workout | N:1 WorkoutProgram, N:1 CoachingRelationship |

---

## **Embedded Documents**

Week

Day

ExercisePrescription

ExerciseSnapshot

WorkoutDaySnapshot

ExercisePerformance

---

## **Collection Count**

3 Collections

exercises

workoutPrograms

workoutCompletions

The Workout Domain transforms coaching plans into measurable execution. The Exercise library defines *what* can be performed, Workout Programs define *what should* be performed, and Workout Completions record *what actually* happened. Keeping those three responsibilities separate prevents historical workout data from changing every time a trainer edits a program, which is exactly the sort of chaos databases quietly resent but faithfully preserve forever.

# **12\. Nutrition Domain**

The Nutrition Domain manages personalized nutrition planning and nutrition adherence tracking throughout the coaching lifecycle.

It is responsible for creating structured meal plans, assigning daily nutrition schedules, and recording the client's actual food consumption and adherence.

Like the Workout Domain, the Nutrition Domain separates **Nutrition Plans** from **Nutrition Completions** because planning and execution have different business responsibilities and lifecycles.

The Nutrition Domain contains two aggregate roots:

* `nutritionPlans`  
* `nutritionCompletions`

The Nutrition Domain references the Coaching Domain but does not own coaching relationships.

---

# **12.1 Nutrition Plan Collection**

## **Collection Name**

nutritionPlans

---

## **Purpose**

Represents a personalized nutrition plan created by a trainer for a client.

A Nutrition Plan belongs to one Coaching Relationship and contains structured meal plans organized by day.

The plan remains editable until published. Once published, assigned nutrition data is preserved using immutable snapshots.

---

## **Aggregate Root**

NutritionPlan

---

## **Owner Domain**

Nutrition

---

## **Embedded Components**

| Component | Classification |
| ----- | ----- |
| NutritionDay | Embedded Entity |
| Meal | Embedded Entity |
| FoodEntry | Embedded Entity |
| NutritionDaySnapshot | Embedded Value Object |

---

## **Relationships**

| Relationship | Target | Type | Storage |
| ----- | ----- | ----- | ----- |
| NutritionPlan → CoachingRelationship | coachingRelationships | Many-to-One | Reference |
| NutritionPlan → TrainerProfile | trainerProfiles | Many-to-One | Reference |
| NutritionPlan → ClientProfile | clientProfiles | Many-to-One | Reference |
| NutritionPlan ← NutritionCompletion | nutritionCompletions | One-to-Many | Reference |

---

## **Main Fields**

\_id  
coachingRelationshipId  
trainerId  
clientId  
title  
description  
nutritionDays  
dailyCalories  
dailyProtein  
dailyCarbohydrates  
dailyFat  
status  
publishedAt  
createdAt  
updatedAt

---

## **Embedded Entity**

### **NutritionDay**

Represents one day's nutrition schedule.

dayNumber  
title  
meals  
dailyNotes

---

### **Meal**

Represents one planned meal.

mealId  
mealType  
mealTime  
foodEntries  
mealNotes

---

### **FoodEntry**

Represents an individual food item assigned to a meal.

foodName  
quantity  
unit  
calories  
protein  
carbohydrates  
fat  
notes

---

### **NutritionDaySnapshot**

Stores immutable nutrition information after publication.

The snapshot guarantees that future edits never affect historical nutrition records.

dayNumber  
mealCount  
dailyCalories  
dailyProtein  
dailyCarbohydrates  
dailyFat

---

## **Indexes**

| Field | Type |
| ----- | ----- |
| coachingRelationshipId | INDEX |
| trainerId | INDEX |
| clientId | INDEX |
| status | INDEX |
| publishedAt | INDEX |

---

## **Validation Rules**

* Every Nutrition Plan belongs to exactly one Coaching Relationship.  
* Only one ACTIVE Nutrition Plan is allowed per Coaching Relationship.  
* Published nutrition plans become read-only.  
* Embedded entities cannot exist independently.  
* Nutrition snapshots become immutable after publication.

---

## **Lifecycle**

DRAFT

↓

PUBLISHED

↓

ACTIVE

↓

COMPLETED

Possible terminal state

ARCHIVED

---

## **Query Patterns**

Frequently queried by:

* coachingRelationshipId  
* trainerId  
* clientId  
* status

Typical queries include:

* Active nutrition plan  
* Client nutrition plan  
* Trainer assigned plans  
* Archived nutrition plans

---

## **Soft Delete**

**No**

Nutrition Plans are archived instead of deleted to preserve coaching history.

---

# **12.2 Nutrition Completion Collection**

## **Collection Name**

nutritionCompletions

---

## **Purpose**

Stores the client's actual nutrition adherence.

Each Nutrition Completion records what the client actually consumed compared to the assigned nutrition plan.

These records become permanent progress evidence for trainers and future evaluations.

---

## **Aggregate Root**

NutritionCompletion

---

## **Owner Domain**

Nutrition

---

## **Embedded Components**

| Component | Classification |
| ----- | ----- |
| NutritionDaySnapshot | Embedded Value Object |
| MealCompletionRecord | Embedded Entity |

---

## **Relationships**

| Relationship | Target | Type | Storage |
| ----- | ----- | ----- | ----- |
| NutritionCompletion → NutritionPlan | nutritionPlans | Many-to-One | Reference |
| NutritionCompletion → CoachingRelationship | coachingRelationships | Many-to-One | Reference |
| NutritionCompletion → ClientProfile | clientProfiles | Many-to-One | Reference |

---

## **Main Fields**

\_id  
nutritionPlanId  
coachingRelationshipId  
clientId  
nutritionDaySnapshot  
mealCompletionRecords  
completedAt  
status  
createdAt

---

## **Embedded Value Object**

### **NutritionDaySnapshot**

Represents the assigned nutrition plan for the completed day.

dayNumber  
plannedMeals  
dailyCalories  
dailyProtein  
dailyCarbohydrates  
dailyFat

---

## **Embedded Entity**

### **MealCompletionRecord**

Represents what the client actually consumed.

mealId  
mealType  
completed  
completedAt  
actualCalories  
actualProtein  
actualCarbohydrates  
actualFat  
notes

---

## **Indexes**

| Field | Type |
| ----- | ----- |
| nutritionPlanId | INDEX |
| coachingRelationshipId | INDEX |
| clientId | INDEX |
| completedAt | INDEX |
| status | INDEX |
| clientId \+ completedAt | COMPOUND |

---

## **Validation Rules**

* Every Nutrition Completion belongs to one Nutrition Plan.  
* Every Nutrition Completion belongs to one Coaching Relationship.  
* NutritionDaySnapshot becomes immutable after submission.  
* Completed nutrition records cannot be modified.  
* Meal completion records cannot exist independently.

---

## **Lifecycle**

IN\_PROGRESS

↓

COMPLETED

Possible terminal state

MISSED

---

## **Query Patterns**

Frequently queried by:

* clientId  
* nutritionPlanId  
* coachingRelationshipId  
* completedAt

Typical queries include:

* Daily nutrition history  
* Nutrition adherence  
* Weekly nutrition compliance  
* Trainer dashboard  
* Client progress timeline

---

## **Soft Delete**

**No**

Nutrition Completion records are permanent historical records.

They are never deleted because they represent the client's actual nutritional adherence and are required for:

* Progress tracking  
* Coach evaluations  
* Historical reporting  
* Audit history  
* Long-term analytics

---

# **Nutrition Domain Summary**

| Collection | Aggregate | Owner | Relationships |
| ----- | ----- | ----- | ----- |
| nutritionPlans | NutritionPlan | Nutrition | N:1 CoachingRelationship, 1:N Nutrition Completions |
| nutritionCompletions | NutritionCompletion | Nutrition | N:1 NutritionPlan, N:1 CoachingRelationship |

---

## **Embedded Documents**

NutritionDay

Meal

FoodEntry

NutritionDaySnapshot

MealCompletionRecord

---

## **Collection Count**

2 Collections

nutritionPlans

nutritionCompletions

The Nutrition Domain complements the Workout Domain by managing dietary planning and real-world adherence. Nutrition Plans define **what the client should eat**, while Nutrition Completions record **what the client actually consumed**. Separating planning from execution preserves historical accuracy and allows trainers to evaluate compliance without losing the original prescribed nutrition plan, which is a surprisingly difficult concept for spreadsheets pretending to be databases.

# **13\. Progress Domain**

The Progress Domain manages periodic coaching evaluations throughout an active coaching relationship.

Its primary responsibility is to measure, document, and preserve the client's progress over time using objective metrics, trainer observations, goal tracking, and recommendations.

Unlike the Workout and Nutrition domains, which record daily execution, the Progress Domain records **periodic assessments** that evaluate overall coaching effectiveness.

The Progress Domain contains one aggregate root:

* `coachingEvaluations`

The Progress Domain references the Coaching Domain but does not own coaching relationships.

---

# **13.1 Coaching Evaluation Collection**

## **Collection Name**

coachingEvaluations

---

## **Purpose**

Represents a formal progress evaluation conducted by a trainer during an active coaching relationship.

Each evaluation captures the client's physical progress, body measurements, performance improvements, goal achievement, trainer observations, and recommendations at a specific point in time.

Evaluations create a historical timeline of coaching progress that remains permanently preserved.

---

## **Aggregate Root**

CoachingEvaluation

---

## **Owner Domain**

Progress

---

## **Relationships**

| Relationship | Target | Type | Storage |
| ----- | ----- | ----- | ----- |
| CoachingEvaluation → CoachingRelationship | coachingRelationships | Many-to-One | Reference |
| CoachingEvaluation → TrainerProfile | trainerProfiles | Many-to-One | Reference |
| CoachingEvaluation → ClientProfile | clientProfiles | Many-to-One | Reference |
| CoachingEvaluation → User (Trainer) | users | Many-to-One | Reference |
| CoachingEvaluation → User (Client) | users | Many-to-One | Reference |

---

## **Main Fields**

\_id  
coachingRelationshipId  
trainerId  
clientId  
evaluationDate  
evaluationPeriod  
bodyMeasurements  
performanceMetrics  
goalProgress  
trainerAssessment  
trainerRecommendations  
overallProgress  
nextEvaluationDate  
status  
createdAt  
updatedAt

---

## **Embedded Value Object**

### **BodyMeasurements**

Represents the client's physical measurements during the evaluation.

height  
weight  
bodyFatPercentage  
chest  
waist  
hips  
leftArm  
rightArm  
leftThigh  
rightThigh  
leftCalf  
rightCalf

---

## **Embedded Value Object**

### **PerformanceMetrics**

Represents measurable physical performance improvements.

strengthScore  
enduranceScore  
flexibilityScore  
mobilityScore  
cardioScore  
overallFitnessScore

---

## **Embedded Entity**

### **GoalProgress**

Tracks the progress of coaching goals.

goalName  
targetValue  
currentValue  
completionPercentage  
status  
remarks

---

## **Embedded Value Object**

### **TrainerAssessment**

Represents the trainer's professional evaluation.

summary  
strengths  
weaknesses  
observations

---

## **Embedded Value Object**

### **TrainerRecommendations**

Represents recommendations for the next coaching phase.

workoutChanges  
nutritionChanges  
lifestyleAdvice  
additionalNotes

---

## **Indexes**

| Field | Type |
| ----- | ----- |
| coachingRelationshipId | INDEX |
| trainerId | INDEX |
| clientId | INDEX |
| evaluationDate | INDEX |
| nextEvaluationDate | INDEX |
| status | INDEX |
| clientId \+ evaluationDate | COMPOUND |
| coachingRelationshipId \+ evaluationDate | COMPOUND |

---

## **Validation Rules**

* Every Coaching Evaluation belongs to exactly one Coaching Relationship.  
* Evaluations can only be created for ACTIVE Coaching Relationships.  
* Historical evaluations are immutable after publication.  
* GoalProgress entries exist only within an evaluation.  
* Body measurements represent the client's state at the time of evaluation.  
* Evaluation dates cannot overlap for the same coaching period.

---

## **Lifecycle**

DRAFT

↓

PUBLISHED

Possible terminal state

ARCHIVED

Published evaluations become read-only.

---

## **Query Patterns**

Frequently queried by:

* coachingRelationshipId  
* clientId  
* trainerId  
* evaluationDate  
* nextEvaluationDate  
* status

Typical queries include:

* Client evaluation history  
* Latest progress report  
* Monthly coaching reviews  
* Upcoming evaluations  
* Trainer dashboard  
* Progress analytics

---

## **Soft Delete**

**No**

Coaching Evaluations are permanent historical records.

They are never physically deleted because they represent official coaching assessments and provide evidence of client progress throughout the coaching journey.

Historical evaluations are preserved for:

* Progress tracking  
* Trainer accountability  
* Coaching analytics  
* Client history  
* Business reporting  
* Audit trails

---

# **Progress Domain Summary**

| Collection | Aggregate | Owner | Relationships |
| ----- | ----- | ----- | ----- |
| coachingEvaluations | CoachingEvaluation | Progress | N:1 CoachingRelationship, N:1 Trainer, N:1 Client |

---

## **Embedded Documents**

BodyMeasurements

PerformanceMetrics

GoalProgress

TrainerAssessment

TrainerRecommendations

---

## **Collection Count**

1 Collection

coachingEvaluations

The Progress Domain serves as the measurement system of KIZUNAFIT. While Workout Completions and Nutrition Completions record **daily execution**, Coaching Evaluations record **periodic outcomes**. This separation keeps operational data independent from assessment data, allowing trainers to measure long-term progress without mixing it with day-to-day activity logs. It also makes reporting dramatically easier because you're comparing structured evaluations instead of trying to reconstruct months of progress from hundreds of workout and meal records, which is the sort of task that convinces databases to develop trust issues.

# **14\. Communication Domain**

The Communication Domain manages all real-time and asynchronous text-based communication between clients and trainers throughout an active coaching relationship.

Its primary responsibility is to provide secure, persistent, and auditable communication while supporting moderation through message reporting.

The Communication Domain is intentionally limited to messaging functionality. Video calls, voice sessions, push notifications, emails, and system announcements belong to separate domains because they have independent business responsibilities and lifecycles.

The Communication Domain contains two aggregate roots:

* `messages`  
* `messageReports`

---

# **14.1 Message Collection**

## **Collection Name**

messages

---

## **Purpose**

Stores all chat messages exchanged between a trainer and a client during an active coaching relationship.

Every message belongs to exactly one Coaching Relationship and represents a permanent communication record.

Messages support text, media attachments, reactions, and read acknowledgements.

---

## **Aggregate Root**

Message

---

## **Owner Domain**

Communication

---

## **Embedded Components**

| Component | Classification |
| ----- | ----- |
| Attachment | Embedded Entity |
| Reaction | Embedded Entity |
| ReadAcknowledgement | Embedded Entity |

---

## **Relationships**

| Relationship | Target | Type | Storage |
| ----- | ----- | ----- | ----- |
| Message → CoachingRelationship | coachingRelationships | Many-to-One | Reference |
| Message → User (Sender) | users | Many-to-One | Reference |
| Message → User (Receiver) | users | Many-to-One | Reference |
| Message ← MessageReport | messageReports | One-to-Many | Reference |

---

## **Main Fields**

\_id  
coachingRelationshipId  
senderId  
receiverId  
messageType  
content  
attachments  
reactions  
readAcknowledgements  
status  
sentAt  
editedAt  
createdAt  
updatedAt

---

## **Embedded Entity**

### **Attachment**

Represents media attached to a message.

attachmentId  
fileName  
fileType  
fileSize  
fileUrl  
uploadedAt

---

## **Embedded Entity**

### **Reaction**

Represents emoji reactions added to a message.

userId  
emoji  
reactedAt

---

## **Embedded Entity**

### **ReadAcknowledgement**

Tracks when a recipient has viewed the message.

userId  
readAt

---

## **Supported Message Types**

TEXT

IMAGE

VIDEO

AUDIO

FILE

SYSTEM

---

## **Indexes**

| Field | Type |
| ----- | ----- |
| coachingRelationshipId | INDEX |
| senderId | INDEX |
| receiverId | INDEX |
| sentAt | INDEX |
| status | INDEX |
| coachingRelationshipId \+ sentAt | COMPOUND |
| senderId \+ sentAt | COMPOUND |

---

## **Validation Rules**

* Every Message belongs to exactly one Coaching Relationship.  
* Every Message has one sender.  
* Every Message has one receiver.  
* Attachments exist only within Messages.  
* Reactions exist only within Messages.  
* Read acknowledgements exist only within Messages.  
* Messages become immutable after delivery except for permitted edits.  
* Deleted messages are soft deleted, not physically removed.

---

## **Lifecycle**

DRAFT

↓

SENT

↓

DELIVERED

↓

READ

Possible terminal states

EDITED

DELETED

---

## **Query Patterns**

Frequently queried by:

* coachingRelationshipId  
* senderId  
* receiverId  
* sentAt  
* status

Typical queries include:

* Conversation history  
* Latest messages  
* Unread messages  
* Chat synchronization  
* Media messages

---

## **Soft Delete**

**Yes**

Messages use soft deletion to preserve conversation history while hiding deleted content from users.

Message metadata remains available for moderation and auditing.

---

# **14.2 Message Report Collection**

## **Collection Name**

messageReports

---

## **Purpose**

Stores reports submitted against messages that violate platform guidelines.

Reports support moderation, dispute resolution, and administrative review without modifying the original message.

Each report references one Message.

A single message may receive multiple reports.

---

## **Aggregate Root**

MessageReport

---

## **Owner Domain**

Communication

---

## **Relationships**

| Relationship | Target | Type | Storage |
| ----- | ----- | ----- | ----- |
| MessageReport → Message | messages | Many-to-One | Reference |
| MessageReport → CoachingRelationship | coachingRelationships | Many-to-One | Reference |
| MessageReport → User (Reporter) | users | Many-to-One | Reference |
| MessageReport → User (Reported User) | users | Many-to-One | Reference |
| MessageReport → AdministrativeAction | administrativeActions | One-to-One | Reference (Optional) |

---

## **Main Fields**

\_id  
messageId  
coachingRelationshipId  
reporterId  
reportedUserId  
reason  
description  
status  
resolvedBy  
resolvedAt  
createdAt  
updatedAt

---

## **Supported Report Reasons**

SPAM

HARASSMENT

ABUSE

INAPPROPRIATE\_CONTENT

MISINFORMATION

OTHER

---

## **Indexes**

| Field | Type |
| ----- | ----- |
| messageId | INDEX |
| reporterId | INDEX |
| reportedUserId | INDEX |
| status | INDEX |
| createdAt | INDEX |
| messageId \+ status | COMPOUND |

---

## **Validation Rules**

* Every Message Report references one Message.  
* A report cannot exist without a Message.  
* A reporter cannot report the same message multiple times.  
* Reports never modify the original Message.  
* Administrative actions are optional until moderation begins.

---

## **Lifecycle**

PENDING

↓

UNDER\_REVIEW

↓

RESOLVED

Possible terminal states

REJECTED

DISMISSED

---

## **Query Patterns**

Frequently queried by:

* messageId  
* reporterId  
* reportedUserId  
* status  
* createdAt

Typical queries include:

* Pending moderation queue  
* User report history  
* Message report history  
* Abuse analytics  
* Admin dashboard

---

## **Soft Delete**

**No**

Message Reports are permanent moderation records.

They are never physically deleted because they provide evidence for moderation decisions, appeals, platform safety, and audit history.

---

# **Communication Domain Summary**

| Collection | Aggregate | Owner | Relationships |
| ----- | ----- | ----- | ----- |
| messages | Message | Communication | N:1 CoachingRelationship, N:1 Sender, N:1 Receiver, 1:N MessageReports |
| messageReports | MessageReport | Communication | N:1 Message, N:1 Reporter, N:1 Reported User |

---

## **Embedded Documents**

Attachment

Reaction

ReadAcknowledgement

---

## **Collection Count**

2 Collections

messages

messageReports

The Communication Domain provides the complete messaging infrastructure for KIZUNAFIT. It preserves conversation history, supports media sharing and read tracking, and enables platform moderation through Message Reports. By separating communication from video sessions, notifications, and administrative actions, the domain remains cohesive, scalable, and easier to evolve without coupling unrelated communication features together.

# **15\. Video Session Domain**

The Video Session Domain manages all online coaching sessions conducted through video conferencing.

It is responsible for scheduling, hosting, joining, monitoring, and recording video sessions between trainers and clients throughout the coaching lifecycle.

Unlike the Communication Domain, which manages text-based messaging, the Video Session Domain manages real-time interactive coaching sessions.

The same Video Session infrastructure supports:

* Pre-sales consultations  
* Weekly coaching sessions  
* Progress review meetings  
* Form correction sessions  
* Nutrition consultations  
* Emergency coaching sessions

The Video Session Domain contains one aggregate root:

* `videoSessions`

---

# **15\. Video Session Domain**

The Video Session Domain manages all online coaching sessions conducted through video conferencing.

It is responsible for scheduling, hosting, joining, monitoring, recording, and auditing video sessions between trainers and clients throughout the coaching lifecycle.

Unlike the Communication Domain, which manages text-based messaging, the Video Session Domain manages real-time interactive coaching sessions.

The same Video Session infrastructure supports:

* Pre-sales consultations  
* Weekly coaching sessions  
* Progress review meetings  
* Form correction sessions  
* Nutrition consultations  
* Follow-up sessions  
* Emergency coaching sessions

The Video Session Domain contains one aggregate root:

videoSessions

---

# **15.1 Video Session Collection**

## **Collection Name**

videoSessions

---

## **Purpose**

Represents a scheduled, live, or completed video meeting between a trainer and a client.

A Video Session may belong to either:

* A Consultation (before purchase)  
* A Coaching Relationship (after purchase)

This enables a single, unified video meeting system across the entire platform while preserving complete historical records.

Each Video Session maintains its own lifecycle, scheduling, attendance, meeting metadata, recording metadata, and audit history.

---

## **Aggregate Root**

VideoSession

---

## **Owner Domain**

Video Session

---

# **Embedded Components**

| Component | Classification |
| ----- | ----- |
| Participant | Embedded Entity |
| Attendance | Embedded Entity |
| Recording | Embedded Entity |
| MeetingSettings | Embedded Value Object |
| ProviderMetadata | Embedded Value Object |

---

# **Relationships**

| Relationship | Target | Type | Storage |
| ----- | ----- | ----- | ----- |
| VideoSession → Consultation | consultations | Many-to-One (Optional) | Reference |
| VideoSession → CoachingRelationship | coachingRelationships | Many-to-One (Optional) | Reference |
| VideoSession → TrainerProfile | trainerProfiles | Many-to-One | Reference |
| VideoSession → ClientProfile | clientProfiles | Many-to-One | Reference |
| VideoSession → User (Trainer) | users | Many-to-One | Reference |
| VideoSession → User (Client) | users | Many-to-One | Reference |

---

## **Business Rules**

* A Video Session must belong to **either** a Consultation **or** a Coaching Relationship.  
* Both `consultationId` and `coachingRelationshipId` cannot be populated simultaneously.  
* Every Video Session has exactly one trainer and one client.  
* Every participant must reference a valid User.  
* Provider-specific identifiers become immutable once the meeting is ready.  
* Attendance records are created automatically when participants join.  
* Meeting duration is calculated automatically after completion.

---

# **Main Fields**

\_id

consultationId

coachingRelationshipId

trainerId

clientId

title

purpose

provider

roomId

providerSessionId

meetingUrl

scheduledStartTime

scheduledEndTime

actualStartTime

actualEndTime

duration

participants

attendance

meetingSettings

providerMetadata

recording

status

createdBy

createdAt

updatedAt

---

# **Embedded Entity**

## **Participant**

Represents a participant invited to the meeting.

participantId

userId

role

joinedAt

leftAt

connectionStatus

deviceType

cameraEnabled

microphoneEnabled

networkQuality

---

## **Supported Roles**

TRAINER

CLIENT

---

# **Embedded Entity**

## **Attendance**

Represents actual participant attendance.

userId

joinedAt

leftAt

totalDuration

attendanceStatus

---

## **Attendance Status**

JOINED

LEFT

NO\_SHOW

---

# **Embedded Entity**

## **Recording**

Represents recording metadata when recording is enabled.

recordingId

providerRecordingId

recordingUrl

thumbnailUrl

duration

fileSize

status

recordedAt

---

# **Embedded Value Object**

## **Meeting Settings**

Represents configurable meeting behavior.

recordingEnabled

waitingRoomEnabled

cameraRequired

microphoneRequired

screenShareEnabled

chatEnabled

---

# **Embedded Value Object**

## **Provider Metadata**

Stores provider-specific technical information.

providerVersion

region

maxParticipants

providerData

`providerData` may contain provider-specific metadata returned by LiveKit, Agora, Daily, or future providers.

---

# **Supported Providers**

LIVEKIT

AGORA

DAILY

ZOOM

GOOGLE\_MEET

CUSTOM

---

# **Supported Session Purposes**

CONSULTATION

WEEKLY\_CHECKIN

PROGRESS\_REVIEW

WORKOUT\_REVIEW

NUTRITION\_REVIEW

FORM\_CORRECTION

FOLLOW\_UP

EMERGENCY\_SESSION

---

# **Indexes**

| Field | Type |
| ----- | ----- |
| consultationId | INDEX |
| coachingRelationshipId | INDEX |
| trainerId | INDEX |
| clientId | INDEX |
| provider | INDEX |
| providerSessionId | INDEX |
| roomId | UNIQUE |
| status | INDEX |
| scheduledStartTime | INDEX |
| trainerId \+ scheduledStartTime | COMPOUND |
| clientId \+ scheduledStartTime | COMPOUND |

---

# **Validation Rules**

* Every Video Session belongs to either a Consultation or a Coaching Relationship.  
* Both `consultationId` and `coachingRelationshipId` cannot exist simultaneously.  
* Every session has exactly one trainer and one client.  
* Participants must reference valid Users.  
* Recording metadata is optional.  
* Meeting duration is calculated automatically.  
* Provider cannot change after the session reaches **READY**.  
* Room ID cannot change after the session reaches **READY**.  
* Provider Session ID cannot change after the session reaches **READY**.  
* Meeting URL cannot change after the session reaches **READY**.

---

# **Lifecycle**

CREATED

↓

SCHEDULED

↓

READY

↓

WAITING

↓

LIVE

↓

ENDED

---

## **Possible Terminal States**

CANCELLED

FAILED

NO\_SHOW

The lifecycle follows the approved Video Session State Machine.

---

# **Query Patterns**

Frequently queried by:

* consultationId  
* coachingRelationshipId  
* trainerId  
* clientId  
* scheduledStartTime  
* provider  
* status

Typical queries include:

* Upcoming sessions  
* Trainer calendar  
* Client calendar  
* Live sessions  
* Missed sessions  
* Session history  
* Attendance reports  
* Recording history  
* Provider analytics

---

# **WebRTC Architecture**

WebRTC signaling information is **never persisted** in MongoDB.

The following data is exchanged temporarily through Socket.IO during connection establishment:

* SDP Offer  
* SDP Answer  
* ICE Candidates  
* Connection Events

These networking objects are transient and are discarded once the peer connection is established.

MongoDB stores only permanent business information such as:

* Session metadata  
* Scheduling information  
* Attendance records  
* Recording metadata  
* Session duration  
* Session status  
* Audit history

This separation keeps the business database independent from real-time networking concerns.

---

# **Soft Delete**

**No**

Video Sessions are permanent business records.

Completed sessions are never physically deleted because they preserve:

* Coaching history  
* Consultation history  
* Attendance history  
* Recording metadata  
* Audit trails  
* Trainer activity  
* Client engagement  
* Business analytics

---

# **Video Session Domain Summary**

| Collection | Aggregate | Owner | Relationships |
| ----- | ----- | ----- | ----- |
| videoSessions | VideoSession | Video Session | N:1 Consultation (Optional), N:1 CoachingRelationship (Optional), N:1 Trainer, N:1 Client |

---

## **Embedded Documents**

Participant

Attendance

Recording

MeetingSettings

ProviderMetadata

---

## **Collection Count**

1 Collection

videoSessions

---

# **Design Notes**

* One unified Video Session model supports both consultations and coaching sessions.  
* Business data is persisted in MongoDB, while WebRTC signaling remains in memory and is exchanged through Socket.IO.  
* Provider-specific information is isolated inside `ProviderMetadata`, allowing seamless integration with LiveKit, Agora, Daily, Zoom, Google Meet, or future providers.  
* The schema is designed to support future enhancements such as recording playback, attendance analytics, automated reminders, AI meeting summaries, and multi-provider integrations without requiring structural changes.

The Video Session Domain provides a scalable and provider-agnostic foundation for real-time coaching within KIZUNAFIT. By separating business data from transient WebRTC signaling and preserving immutable session history, it supports both current requirements and future platform growth while maintaining a clean domain-driven architecture.

# **16\. Review Domain**

The Review Domain manages client feedback and trainer ratings after the completion of a coaching relationship.

Its primary responsibility is to collect authentic reviews that help future clients evaluate trainers while providing trainers with measurable reputation and performance indicators.

Reviews are considered permanent business records because they represent genuine customer experiences and directly influence marketplace credibility.

A review can only be submitted after a completed Coaching Relationship, ensuring that every review originates from a verified coaching experience.

The Review Domain contains one aggregate root:

* `reviews`

---

# **16.1 Review Collection**

## **Collection Name**

reviews

---

## **Purpose**

Represents a verified client review for a completed coaching relationship.

Each review contains both a numerical rating and written feedback describing the client's coaching experience.

Only clients may submit reviews.

Each Coaching Relationship can receive at most one review.

---

## **Aggregate Root**

Review

---

## **Owner Domain**

Review

---

## **Embedded Components**

| Component | Classification |
| ----- | ----- |
| Rating | Embedded Value Object |
| WrittenFeedback | Embedded Value Object |

---

## **Relationships**

| Relationship | Target | Type | Storage |
| ----- | ----- | ----- | ----- |
| Review → CoachingRelationship | coachingRelationships | One-to-One | Reference |
| Review → TrainerProfile | trainerProfiles | Many-to-One | Reference |
| Review → ClientProfile | clientProfiles | Many-to-One | Reference |
| Review → User (Reviewer) | users | Many-to-One | Reference |
| Review → User (Trainer) | users | Many-to-One | Reference |

---

## **Main Fields**

\_id  
coachingRelationshipId  
trainerId  
clientId  
rating  
writtenFeedback  
isAnonymous  
status  
publishedAt  
createdAt  
updatedAt

---

# **Embedded Value Object**

## **Rating**

Represents the quantitative evaluation given by the client.

overall

communication

professionalism

knowledge

support

punctuality

### **Rating Rules**

* Minimum: **1**  
* Maximum: **5**  
* Decimal ratings allowed (e.g., 4.5)

---

# **Embedded Value Object**

## **WrittenFeedback**

Represents the client's written experience.

title

comment

pros

cons

recommendation

---

## **Indexes**

| Field | Type |
| ----- | ----- |
| coachingRelationshipId | UNIQUE |
| trainerId | INDEX |
| clientId | INDEX |
| status | INDEX |
| publishedAt | INDEX |
| trainerId \+ status | COMPOUND |
| trainerId \+ publishedAt | COMPOUND |

---

## **Validation Rules**

* Every Review belongs to exactly one Coaching Relationship.  
* A Coaching Relationship may have only one Review.  
* Reviews can only be submitted after the Coaching Relationship is completed.  
* Only the client participating in the Coaching Relationship may submit the review.  
* Ratings must be between **1** and **5**.  
* Published reviews cannot change their rating.  
* Trainers cannot review themselves.  
* Reviews contribute to the trainer's average rating and total review count.

---

## **Lifecycle**

DRAFT

↓

SUBMITTED

↓

PUBLISHED

Possible terminal states

HIDDEN

REMOVED

Administrative moderation may hide or remove a review without deleting the original record.

---

## **Query Patterns**

Frequently queried by:

* trainerId  
* clientId  
* coachingRelationshipId  
* status  
* publishedAt

Typical queries include:

* Trainer public reviews  
* Trainer average rating  
* Client review history  
* Latest reviews  
* Moderation queue  
* Marketplace ranking

---

## **Soft Delete**

**No**

Reviews are permanent historical records.

Reviews are never physically deleted because they represent verified customer experiences and contribute to:

* Trainer reputation  
* Marketplace trust  
* Recommendation algorithms  
* Historical analytics  
* Audit history

If moderation is required, the review status is updated instead of deleting the document.

---

# **Review Domain Summary**

| Collection | Aggregate | Owner | Relationships |
| ----- | ----- | ----- | ----- |
| reviews | Review | Review | 1:1 CoachingRelationship, N:1 Trainer, N:1 Client |

---

## **Embedded Documents**

Rating

WrittenFeedback

---

## **Collection Count**

1 Collection

reviews

The Review Domain serves as the reputation system of KIZUNAFIT. It ensures that every review is tied to a verified coaching experience, preventing fake or duplicate feedback while preserving a trustworthy history of trainer performance. By separating reviews from coaching operations, the platform maintains a clear boundary between service delivery and customer evaluation, making reputation metrics reliable for clients, trainers, and marketplace ranking algorithms alike.

# **17\. Administration Domain**

The Administration Domain manages platform governance, moderation, operational oversight, and system-wide configuration.

Unlike the business domains that support client and trainer workflows, the Administration Domain exists to operate, maintain, secure, and govern the platform.

Administrative operations must always be auditable. Every significant administrative action is permanently recorded, while platform configuration provides centralized control over system behavior without requiring code changes.

The Administration Domain contains two aggregate roots:

* `administrativeActions`  
* `platformConfigurations`

---

# **17.1 Administrative Action Collection**

## **Collection Name**

administrativeActions

---

## **Purpose**

Stores every significant action performed by platform administrators.

Administrative Actions provide a complete audit trail of governance activities, including moderation, account management, payment interventions, configuration updates, and operational decisions.

Every administrative action is immutable once recorded.

---

## **Aggregate Root**

AdministrativeAction

---

## **Owner Domain**

Administration

---

## **Embedded Components**

| Component | Classification |
| ----- | ----- |
| AdministrativeActor | Embedded Value Object |
| GovernanceOperation | Embedded Value Object |
| AdministrativeReason | Embedded Value Object |
| ExecutionOutcome | Embedded Value Object |

---

## **Relationships**

| Relationship | Target | Type | Storage |
| ----- | ----- | ----- | ----- |
| AdministrativeAction → User (Administrator) | users | Many-to-One | Reference |
| AdministrativeAction → User (Target User) | users | Many-to-One (Optional) | Reference |
| AdministrativeAction → MessageReport | messageReports | One-to-One (Optional) | Reference |
| AdministrativeAction → Review | reviews | One-to-One (Optional) | Reference |
| AdministrativeAction → Payment | payments | One-to-One (Optional) | Reference |
| AdministrativeAction → CoachingRelationship | coachingRelationships | One-to-One (Optional) | Reference |

---

## **Main Fields**

\_id  
administratorId  
targetUserId  
entityType  
entityId  
operation  
reason  
outcome  
notes  
performedAt  
createdAt

---

## **Embedded Value Object**

### **AdministrativeActor**

Represents the administrator responsible for the action.

adminId  
name  
role

---

## **Embedded Value Object**

### **GovernanceOperation**

Represents the action performed.

operationType  
targetEntity

---

### **Supported Operations**

USER\_SUSPENDED

USER\_BANNED

USER\_REACTIVATED

MESSAGE\_REMOVED

REVIEW\_HIDDEN

PAYMENT\_REFUNDED

PAYMENT\_ADJUSTED

CONFIGURATION\_UPDATED

VIDEO\_SESSION\_CANCELLED

OTHER

---

## **Embedded Value Object**

### **AdministrativeReason**

Represents why the action was taken.

code  
description

---

## **Embedded Value Object**

### **ExecutionOutcome**

Represents the result of the administrative operation.

status  
message  
completedAt

---

## **Indexes**

| Field | Type |
| ----- | ----- |
| administratorId | INDEX |
| targetUserId | INDEX |
| entityType | INDEX |
| entityId | INDEX |
| operation | INDEX |
| performedAt | INDEX |

---

## **Validation Rules**

* Every Administrative Action must reference the administrator who performed it.  
* Administrative history is immutable.  
* Administrative actions are never modified after creation.  
* Every action must record both the operation and its outcome.  
* Optional references depend on the entity being managed.

---

## **Lifecycle**

EXECUTED

Administrative actions are immutable event records and therefore have no business state transitions.

---

## **Query Patterns**

Frequently queried by:

* administratorId  
* targetUserId  
* entityType  
* operation  
* performedAt

Typical queries include:

* Audit logs  
* Moderator activity  
* User moderation history  
* Payment interventions  
* Governance reports  
* Compliance audits

---

## **Soft Delete**

**No**

Administrative Actions are permanent audit records.

They are never physically deleted.

---

# **17.2 Platform Configuration Collection**

## **Collection Name**

platformConfigurations

---

## **Purpose**

Stores configurable platform settings that control business behavior without requiring application deployment.

Configuration values are centralized, versioned, and managed only by administrators.

Normally, this collection contains very few documents.

---

## **Aggregate Root**

PlatformConfiguration

---

## **Owner Domain**

Administration

---

## **Embedded Components**

| Component | Classification |
| ----- | ----- |
| ConfigurationVersion | Embedded Value Object |
| EffectivePeriod | Embedded Value Object |

---

## **Relationships**

| Relationship | Target | Type | Storage |
| ----- | ----- | ----- | ----- |
| PlatformConfiguration → User (Administrator) | users | Many-to-One | Reference |

---

## **Main Fields**

\_id  
configurationKey  
configurationValue  
category  
description  
version  
effectivePeriod  
updatedBy  
status  
createdAt  
updatedAt

---

## **Embedded Value Object**

### **ConfigurationVersion**

version  
changeSummary

---

## **Embedded Value Object**

### **EffectivePeriod**

effectiveFrom  
effectiveUntil

---

## **Example Configuration Categories**

PAYMENT

SUBSCRIPTION

MARKETPLACE

BOOKING

VIDEO\_SESSION

NOTIFICATION

SECURITY

FEATURE\_FLAG

SYSTEM

---

## **Indexes**

| Field | Type |
| ----- | ----- |
| configurationKey | UNIQUE |
| category | INDEX |
| status | INDEX |

---

## **Validation Rules**

* Configuration keys must be unique.  
* Only administrators may modify configurations.  
* Previous configuration versions must remain recoverable.  
* Configuration updates create a new version history.

---

## **Lifecycle**

ACTIVE

↓

DEPRECATED

↓

ARCHIVED

---

## **Query Patterns**

Frequently queried by:

* configurationKey  
* category  
* status

Typical queries include:

* System startup  
* Feature flag evaluation  
* Payment configuration  
* Subscription settings  
* Security configuration  
* Video provider configuration

---

## **Soft Delete**

**No**

Platform configurations are archived rather than deleted to preserve operational history.

---

# **Administration Domain Summary**

| Collection | Aggregate | Owner | Relationships |
| ----- | ----- | ----- | ----- |
| administrativeActions | AdministrativeAction | Administration | N:1 Administrator, Optional references to governed entities |
| platformConfigurations | PlatformConfiguration | Administration | N:1 Administrator |

---

## **Embedded Documents**

AdministrativeActor

GovernanceOperation

AdministrativeReason

ExecutionOutcome

ConfigurationVersion

EffectivePeriod

---

## **Collection Count**

2 Collections

administrativeActions

platformConfigurations

The Administration Domain provides the governance layer of KIZUNAFIT. It separates operational control from business operations by recording every administrative decision and centralizing configurable platform behavior. Administrative Actions provide an immutable audit trail for compliance and accountability, while Platform Configurations allow the platform to evolve through controlled configuration changes rather than code deployments. This separation keeps governance concerns isolated from business domains, which is considerably less painful than discovering six months later that half your business logic is hidden inside environment variables and the other half is scattered across controllers.

