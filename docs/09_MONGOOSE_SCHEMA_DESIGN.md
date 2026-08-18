# **09\_MONGOOSE\_SCHEMA\_DESIGN**

## **Relationship with Clean Architecture**

## 

## **The Mongoose Schema Design document defines only the persistence implementation of the approved Entity Modeling.**

## 

## **Domain Entities remain framework-independent and are implemented separately within the Domain Layer.**

## 

## **Mongoose Schemas belong exclusively to the Infrastructure Layer and are responsible only for persistence mapping.**

## 

## **Business rules, state transitions, and domain behavior must not depend on Mongoose or any other persistence technology.**

## **00\. Introduction**

### **1\. Purpose**

### **2\. Objectives**

### **3\. Scope**

### **4\. Out of Scope**

### **5\. Target Audience**

### **6\. Relationship with Previous Documents**

### **7\. Mongoose Design Philosophy**

### **8\. Architecture Principles**

### **9\. Implementation Principles**

### **10\. Design Goals**

### **11\. Document Structure**

### **12\. Expected Outcome**

### **13\. Status**

---

# **01\. Project Standards**

## **1\. Schema Design Standards**

### **PS-1 Architecture First**

### **PS-2 Database Design Is Authoritative**

### **PS-3 One Collection \= One Aggregate Root**

### **PS-4 One Schema File \= One Collection**

### **PS-5 One Model per Collection**

---

## **2\. TypeScript Standards**

### **PS-6 Interface Standards**

### **PS-7 Document Interface Standards**

### **PS-8 HydratedDocument Standards**

### **PS-9 Enum Standards**

### **PS-10 Type Alias Standards**

---

## **3\. Mongoose Standards**

### **PS-11 Required Schema Options**

### **PS-12 Collection Naming**

### **PS-13 Model Naming**

### **PS-14 Schema Naming**

### **PS-15 Embedded Schema Standards**

### **PS-16 Reference Standards**

### **PS-17 ObjectId Standards**

### **PS-18 Timestamps**

### **PS-19 Version Key**

### **PS-20 Strict Mode**

### **PS-21 Optimistic Concurrency**

### **PS-22 Minimize Option**

### **PS-23 Auto Index Policy**

---

## **4\. Implementation Standards**

### **PS-24 Validation Standards**

### **PS-25 Index Standards**

### **PS-26 Middleware Standards**

### **PS-27 Virtual Standards**

### **PS-28 Plugin Standards**

### **PS-29 Serialization Standards**

### **PS-30 Performance Standards**

### **PS-31 Security Standards**

### **PS-32 Documentation Standards**

---

# **02\. Common Conventions**

## **1\. Naming Conventions**

### **Collection Naming**

### **Model Naming**

### **Schema Naming**

### **Interface Naming**

### **Enum Naming**

### **Embedded Schema Naming**

---

## **2\. Field Naming Conventions**

### **Primary Key**

### **Foreign Keys**

### **Reference Fields**

### **Snapshot Fields**

### **Status Fields**

### **Boolean Fields**

### **Date Fields**

### **Audit Fields**

---

## **3\. Schema Conventions**

### **Embedded Entities**

### **Embedded Value Objects**

### **Aggregate References**

### **Immutable Fields**

### **Historical Snapshots**

---

## **4\. Code Conventions**

### **Export Order**

### **Import Order**

### **Schema Declaration Order**

### **Index Declaration Order**

### **Plugin Registration Order**

### **Middleware Registration Order**

---

## **5\. Serialization Conventions**

### **Hidden Fields**

### **Exposed Fields**

### **Virtual Fields**

### **JSON Transform Rules**

---

## **6\. Error Message Conventions**

---

# **03\. Shared Validators**

## **1\. Introduction**

## **2\. String Validators**

### **Required String**

### **Optional String**

### **Trimmed String**

### **Length Validator**

---

## **3\. Identity Validators**

### **Email**

### **Password**

### **Phone Number**

### **Username**

---

## **4\. Number Validators**

### **Positive Number**

### **Rating**

### **Percentage**

### **Currency**

### **Duration**

---

## **5\. Date Validators**

### **Future Date**

### **Past Date**

### **Date Range**

### **Expiration Date**

---

## **6\. Object Validators**

### **ObjectId**

### **Enum**

### **URL**

### **Array**

### **Unique Array**

---

## **7\. Business Validators**

### **Snapshot Validation**

### **Immutable Validation**

### **Status Transition Validation**

### **Ownership Validation**

---

## **8\. Validator Usage Guidelines**

---

# **04\. Shared Plugins**

## **1\. Introduction**

## **2\. Serialization Plugin**

## **3\. Pagination Plugin**

## **4\. Audit Plugin**

## **5\. Soft Delete Plugin**

## **6\. Search Plugin**

## **7\. History Plugin**

## **8\. Ownership Plugin**

## **9\. Optimistic Concurrency Plugin**

## **10\. Slug Plugin**

## **11\. Plugin Registration Order**

## **12\. Plugin Usage Guidelines**

---

# **05\. Shared Schema Helpers**

## **1\. Introduction**

## **2\. Common Field Helpers**

### **ObjectId Field**

### **Enum Field**

### **String Field**

### **Number Field**

### **Boolean Field**

### **Date Field**

---

## **3\. Reference Helpers**

### **User Reference**

### **Trainer Reference**

### **Client Reference**

### **Payment Reference**

### **Relationship Reference**

---

## **4\. Snapshot Helpers**

### **Trainer Snapshot**

### **Pricing Snapshot**

### **Scope Snapshot**

### **Exercise Snapshot**

### **Nutrition Snapshot**

---

## **5\. Audit Helpers**

### **createdBy**

### **updatedBy**

### **approvedBy**

### **reviewedBy**

---

## **6\. Timestamp Helpers**

### **createdAt**

### **updatedAt**

---

## **7\. Schema Option Helpers**

### **Default Options**

### **Strict Options**

### **Serialization Options**

---

## **8\. Reusable Embedded Schemas**

## **9\. Helper Usage Guidelines**

---

# **06\. Collection Schemas**

## **01\. Identity**

### **01\_User.schema.ts**

### **02\_RefreshTokenSession.schema.ts**

### **03\_EmailVerification.schema.ts**

### **04\_PasswordReset.schema.ts**

---

## **02\. Profile**

### **01\_ClientProfile.schema.ts**

### **02\_TrainerProfile.schema.ts**

---

## **03\. Marketplace**

### **01\_AcquisitionPipeline.schema.ts**

---

## **04\. Consultation**

### **01\_Consultation.schema.ts**

---

## **05\. Offer**

### **01\_CoachingOffer.schema.ts**

---

## **06\. Payment**

### **01\_Payment.schema.ts**

---

## **07\. Coaching**

### **01\_CoachingRelationship.schema.ts**

---

## **08\. Workout**

### **01\_Exercise.schema.ts**

### **02\_WorkoutProgram.schema.ts**

### **03\_WorkoutCompletion.schema.ts**

---

## **09\. Nutrition**

### **01\_NutritionPlan.schema.ts**

### **02\_NutritionCompletion.schema.ts**

---

## **10\. Progress**

### **01\_CoachingEvaluation.schema.ts**

---

## **11\. Communication**

### **01\_Message.schema.ts**

### **02\_MessageReport.schema.ts**

---

## **12\. Video Session**

### **01\_VideoSession.schema.ts**

---

## **13\. Review**

### **01\_Review.schema.ts**

---

## **14\. Administration**

### **01\_AdministrativeAction.schema.ts**

### **02\_PlatformConfiguration.schema.ts**

---

---

Excellent. We'll start with the foundation of the entire platform.

Since **User** is the root aggregate of the Identity Domain, every other authentication-related collection depends on it. This schema must be designed carefully because changing it later affects almost every domain. Fortunately, software has a long tradition of teaching this lesson the painful way.

---

# **01\_Identity/**

# **User.schema.ts**

# **1\. Purpose**

The **User** collection is the Aggregate Root of the **Identity Domain**.

It stores the authentication identity of every platform account, regardless of whether the user is a Client, Trainer, or Administrator.

The collection is responsible for:

* User authentication  
* Account ownership  
* Authorization role  
* Authentication providers  
* Account lifecycle  
* Email verification status  
* Password management (LOCAL accounts)  
* Login tracking

Business profile information (ClientProfile, TrainerProfile) is intentionally excluded and belongs to the Profile Domain. This separation preserves clear domain ownership.

---

# **2\. Collection**

| Property | Value |
| ----- | ----- |
| Collection Name | `users` |
| Aggregate Root | User |
| Owner Domain | Identity |
| MongoDB Collection | users |
| Soft Delete | Yes |
| Historical Records | Preserved |
| Parent Aggregate | None |

---

# **3\. Mongoose Model Name**

User

Export

export const UserModel

---

# **4\. TypeScript Interfaces**

## **Enums**

UserRole  
UserStatus  
AuthProvider

---

## **Base Interface**

User

Represents the business entity.

---

## **Document Interface**

UserDocument

Extends

HydratedDocument\<User\>

---

## **Model Interface**

UserModel

Extends

Model\<User\>

Contains custom statics.

---

## **Query Helper Interface**

UserQueryHelpers

Contains reusable query helpers.

---

# **5\. Enums**

## **UserRole**

CLIENT  
TRAINER  
ADMIN

---

## **UserStatus**

Derived from the approved Identity State Machine.

ACTIVE  
SUSPENDED  
BANNED  
DELETED

---

## **AuthProvider**

LOCAL  
GOOGLE

Future extensibility:

APPLE  
FACEBOOK  
GITHUB

without schema redesign.

---

# **6\. Embedded Schemas**

The User aggregate contains **no embedded entities**.

Reason:

Every field belongs directly to the authentication identity.

No child object has its own dependent lifecycle.

Embedded Schemas:

None

---

# **7\. Main Schema**

## **Fields**

| Field | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| \_id | ObjectId | ✓ | MongoDB Primary Key |
| fullName | String | ✓ | Display name |
| email | String | ✓ | Login email |
| authProviders | AuthProvider\[\] | ✓ | Authentication providers |
| passwordHash | String | null | Conditional | Required only for LOCAL |
| role | UserRole | ✓ | System role |
| status | UserStatus | ✓ | Account lifecycle |
| emailVerified | Boolean | ✓ | Email verification flag |
| lastLoginAt | Date | null | No | Last successful login |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

---

# **8\. Validation**

## **Required**

* fullName  
* email  
* authProviders  
* role  
* status  
* emailVerified

---

## **Email**

* Required  
* Lowercase  
* Trimmed  
* RFC compliant  
* Unique

---

## **Password**

Required only when

LOCAL ∈ authProviders

Must be absent for Google-only accounts.

---

## **Role**

Allowed values

CLIENT  
TRAINER  
ADMIN

Immutable after registration.

---

## **Status**

Must follow approved Identity State Machine.

Invalid transitions are rejected by business logic.

---

## **Email Verification**

LOCAL

Requires

emailVerified \= true

before platform access.

---

# **9\. Indexes**

## **Unique**

email

---

## **Single Indexes**

role  
status  
emailVerified  
lastLoginAt

---

## **Compound Indexes**

role \+ status  
status \+ emailVerified

Useful for

* Admin dashboards  
* User management  
* Moderation

---

# **10\. Virtuals**

## **id**

Maps

\_id

to

id

---

## **hasPassword**

Returns

passwordHash \!= null

---

## **isActive**

Returns

status \=== ACTIVE

---

## **isOAuthUser**

Returns

authProviders.length \> 1

or

LOCAL not included

depending on implementation.

---

# **11\. Middleware**

## **Pre Validate**

* Normalize email  
* Trim strings  
* Remove duplicate auth providers

---

## **Pre Save**

* Prevent duplicate providers  
* Validate password requirements  
* Prevent role modification

---

## **Post Save**

None

User creation events belong in the service layer.

---

# **12\. Instance Methods**

hasProvider(provider)

isActive()

isSuspended()

isBanned()

verifyEmail()

markLogin()

hasPassword()

canAuthenticateWith(provider)

---

# **13\. Static Methods**

findByEmail()

findActiveUser()

emailExists()

findByProvider()

findTrainerAccounts()

findClientAccounts()

findAdminAccounts()

---

# **14\. Query Helpers**

.active()

.deleted()

.byRole()

.byStatus()

.emailVerified()

.withProvider()

.recentlyLoggedIn()

Allows expressive queries such as:

UserModel.find().active().byRole(UserRole.TRAINER)

---

# **15\. Immutable Fields**

The following fields become immutable after creation:

email  
role  
createdAt

Additionally:

* `passwordHash` is only changed through the password reset flow.  
* `authProviders` may only grow (e.g., linking Google to an existing LOCAL account), never silently remove the only authentication method.

---

# **16\. Serialization**

Hide from API responses:

passwordHash  
\_\_v

Expose:

id  
fullName  
email  
role  
status  
emailVerified  
authProviders  
lastLoginAt  
createdAt  
updatedAt

Convert:

\_id → id

Remove:

\_\_v

---

# **17\. Plugins**

Recommended plugins:

Serialization Plugin

Audit Plugin

Ownership Plugin (optional)

Optimistic Concurrency Plugin

Do **not** use:

Soft Delete Plugin

Reason:

The platform manages deletion through the `status` field (`DELETED`) rather than document deletion, matching the approved database design.

---

# **18\. Performance Notes**

### **Read Patterns**

Most common lookups:

* email  
* \_id  
* role  
* status

---

### **Write Frequency**

Low

Mostly during:

* Registration  
* Login  
* Password reset  
* Account management

---

### **Expected Growth**

One document per platform user.

Designed to scale to millions of users using indexed email lookups.

---

### **Document Size**

Very small (\<2 KB).

Ideal for MongoDB.

---

### **Design Decisions**

* No profile information stored here.  
* Authentication separated from business profiles.  
* Role is immutable.  
* Supports multiple authentication providers.  
* Minimal document size for high-frequency authentication operations.

---

# **19\. Example Document**

{  
  "\_id": "68652b7f5c4e8f12ab345678",  
  "fullName": "Mohammed Nihal K",  
  "email": "nihal@example.com",  
  "authProviders": \["LOCAL", "GOOGLE"\],  
  "passwordHash": "$2b$12$\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*",  
  "role": "TRAINER",  
  "status": "ACTIVE",  
  "emailVerified": true,  
  "lastLoginAt": "2026-07-02T07:35:11.000Z",  
  "createdAt": "2026-06-15T09:12:41.000Z",  
  "updatedAt": "2026-07-02T07:35:11.000Z"  
}

## **Design Review**

This design is fully aligned with your Business Vision, Business Rules, Entity Modeling, Database Design, and the current schema draft, while incorporating Mongoose best practices such as immutable fields, query helpers, virtuals, serialization rules, and plugin strategy. It keeps the `User` aggregate focused solely on authentication and identity, ensuring that profile, marketplace, coaching, and payment concerns remain in their respective domains, exactly as prescribed by the architecture.

---

 

# **RefreshTokenSession**

---

# **1\. Purpose**

The **RefreshTokenSession** collection manages authenticated login sessions for the platform.

Each successful login creates a separate session, allowing secure multi-device authentication and refresh token rotation.

This collection is responsible for:

* Refresh Token Rotation  
* Multi-device authentication  
* Session expiration  
* Device tracking  
* Login history  
* Session revocation  
* Automatic cleanup using MongoDB TTL indexes

The collection belongs to the **Identity Domain** and is a child aggregate associated with a single User.

---

# **2\. Collection**

| Property | Value |
| ----- | ----- |
| Collection Name | `refreshTokenSessions` |
| Aggregate Root | RefreshTokenSession |
| Owner Domain | Identity |
| Parent Aggregate | User |
| MongoDB Collection | refreshTokenSessions |
| Soft Delete | No |
| Historical Records | Temporary |
| TTL Enabled | Yes |

---

# **3\. Mongoose Model Name**

RefreshTokenSession

Export

export const RefreshTokenSessionModel

---

# **4\. TypeScript Interfaces**

## **Base Interface**

RefreshTokenSession

Represents the business entity.

---

## **Embedded Interfaces**

DeviceInfo

---

## **Document Interface**

RefreshTokenSessionDocument

Extends

HydratedDocument\<RefreshTokenSession\>

---

## **Model Interface**

RefreshTokenSessionModel

Extends

Model\<RefreshTokenSession\>

---

## **Query Helper Interface**

RefreshTokenSessionQueryHelpers

---

# **5\. Enums**

This collection contains **no business enums**.

Instead, session lifecycle is represented through timestamps:

* `expiresAt`  
* `revokedAt`

A session is interpreted as:

| State | Rule |
| ----- | ----- |
| ACTIVE | revokedAt \= null AND expiresAt \> now |
| REVOKED | revokedAt \!= null |
| EXPIRED | expiresAt \<= now |

This follows the approved Identity lifecycle without storing redundant status values.

---

# **6\. Embedded Schemas**

## **DeviceInfo**

Purpose

Stores metadata about the device used during authentication.

Fields

| Field | Type |
| ----- | ----- |
| browser | String |
| browserVersion | String |
| operatingSystem | String |
| platform | String |
| deviceName | String |
| userAgent | String |

Reason

Device information has no independent lifecycle and exists only within a session.

---

# **7\. Main Schema**

| Field | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| \_id | ObjectId | ✓ | Primary Key |
| userId | ObjectId | ✓ | Reference → User |
| refreshTokenHash | String | ✓ | Hashed Refresh Token |
| deviceInfo | DeviceInfo | ✓ | Embedded Device Metadata |
| ipAddress | String | No | Client IP |
| expiresAt | Date | ✓ | Session Expiration |
| lastUsedAt | Date | ✓ | Last Token Rotation |
| revokedAt | Date | null | No | Revocation Timestamp |
| createdAt | Date | Auto | Created Timestamp |
| updatedAt | Date | Auto | Updated Timestamp |

---

# **8\. Validation**

## **Required**

* userId  
* refreshTokenHash  
* deviceInfo  
* expiresAt  
* lastUsedAt

---

## **Refresh Token**

* Required  
* Hashed  
* Never stored in plain text  
* Unique

---

## **User Reference**

* Must reference an existing User  
* Cascade deletion is **not** allowed

---

## **Expiration**

* Must always be greater than `createdAt`

---

## **IP Address**

* IPv4 / IPv6 validation

---

## **DeviceInfo**

* Embedded only  
* Cannot exist independently

---

# **9\. Indexes**

## **Unique**

refreshTokenHash

---

## **Single Indexes**

userId  
expiresAt (TTL)  
lastUsedAt  
createdAt

---

## **Compound Indexes**

userId \+ lastUsedAt

userId \+ createdAt

Useful for:

* Active session listing  
* Logout All Devices  
* Security auditing

TTL Index

expiresAt

Automatically removes expired sessions.

---

# **10\. Virtuals**

## **id**

\_id → id

---

## **isExpired**

Returns

expiresAt \<= now

---

## **isRevoked**

Returns

revokedAt \!= null

---

## **isActive**

Returns

revokedAt \== null

AND

expiresAt \> now

---

# **11\. Middleware**

## **Pre Validate**

* Normalize IP address  
* Trim device strings

---

## **Pre Save**

* Ensure refresh token is hashed  
* Validate expiration date

---

## **Post Save**

None

Session events belong to the service layer.

---

# **12\. Instance Methods**

isExpired()

isRevoked()

isActive()

markUsed()

revoke()

belongsTo(userId)

---

# **13\. Static Methods**

findActiveSessions(userId)

findByRefreshTokenHash()

revokeAllUserSessions()

deleteExpiredSessions()

findRecentSessions()

---

# **14\. Query Helpers**

.active()

.expired()

.revoked()

.byUser(userId)

.recent()

.device(platform)

Example

RefreshTokenSessionModel.find()  
    .active()  
    .byUser(userId);

---

# **15\. Immutable Fields**

The following fields become immutable after creation:

userId

refreshTokenHash

deviceInfo

createdAt

Mutable fields

lastUsedAt

revokedAt

updatedAt

Reason

A session represents one authenticated login event and should never change ownership or identity.

---

# **16\. Serialization**

Hide

refreshTokenHash

\_\_v

Expose

id

userId

deviceInfo

ipAddress

expiresAt

lastUsedAt

revokedAt

createdAt

updatedAt

Convert

\_id → id

Remove

\_\_v

---

# **17\. Plugins**

Recommended Plugins

Serialization Plugin

Audit Plugin

Optimistic Concurrency Plugin

Do **not** use

Soft Delete Plugin

Reason

Expired sessions are automatically deleted using MongoDB TTL indexes, as defined in the database design.

---

# **18\. Performance Notes**

## **Read Patterns**

Most common lookups

* refreshTokenHash  
* userId  
* active sessions  
* recent sessions

---

## **Write Frequency**

Very High

Occurs during

* Login  
* Refresh Token Rotation  
* Logout  
* Logout All Devices

---

## **Expected Growth**

Potentially millions of temporary documents.

TTL cleanup prevents unbounded growth.

---

## **Document Size**

Small (\<1 KB)

Optimized for authentication workloads.

---

## **Design Decisions**

* One document per login device.  
* Tokens stored only as hashes.  
* Device metadata embedded.  
* TTL-based automatic cleanup.  
* Multi-device authentication supported.  
* Refresh token rotation supported.  
* No session status field; lifecycle derived from timestamps.

---

# **19\. Example Document**

{  
  "\_id": "6865a9d9b91ef8d243987654",  
  "userId": "68652b7f5c4e8f12ab345678",  
  "refreshTokenHash": "$argon2id$v=19$m=65536,t=3,p=4$\*\*\*\*\*\*\*\*",  
  "deviceInfo": {  
    "browser": "Chrome",  
    "browserVersion": "138.0",  
    "operatingSystem": "Windows 11",  
    "platform": "Desktop",  
    "deviceName": "Nihal-PC",  
    "userAgent": "Mozilla/5.0..."  
  },  
  "ipAddress": "103.xxx.xxx.xxx",  
  "expiresAt": "2026-08-02T10:00:00.000Z",  
  "lastUsedAt": "2026-07-02T09:45:00.000Z",  
  "revokedAt": null,  
  "createdAt": "2026-07-02T09:00:00.000Z",  
  "updatedAt": "2026-07-02T09:45:00.000Z"  
}

## **Design Review**

This schema aligns with the Identity Domain by treating each login as an independent session while maintaining the `User` aggregate as the owner. It follows the approved database principles by embedding only lifecycle-dependent `DeviceInfo`, using hashed refresh tokens, and relying on MongoDB TTL indexes for automatic cleanup instead of soft deletion. The design supports secure refresh token rotation, multi-device authentication, efficient session management, and long-term scalability without violating aggregate boundaries.

---

   
**EmailVerification**  
---

# **1\. Purpose**

The **EmailVerification** collection manages the email verification lifecycle for user accounts.

It exists to securely verify ownership of an email address before granting full access to the platform.

This collection is responsible for:

* Email verification requests  
* Verification token management  
* Token expiration  
* Verification history  
* Protection against replay attacks

The collection belongs to the **Identity Domain** and supports the User aggregate without storing business profile information. Once verification is complete, the User document becomes the source of truth through the `emailVerified` flag.

---

# **2\. Collection**

| Property | Value |
| ----- | ----- |
| Collection Name | `emailVerifications` |
| Aggregate Root | EmailVerification |
| Owner Domain | Identity |
| Parent Aggregate | User |
| MongoDB Collection | emailVerifications |
| Soft Delete | No |
| Historical Records | Temporary |
| TTL Enabled | Yes |

---

# **3\. Mongoose Model Name**

EmailVerification

Export

export const EmailVerificationModel

---

# **4\. TypeScript Interfaces**

## **Base Interface**

EmailVerification

Represents an email verification request.

---

## **Document Interface**

EmailVerificationDocument

Extends

HydratedDocument\<EmailVerification\>

---

## **Model Interface**

EmailVerificationModel

Extends

Model\<EmailVerification\>

---

## **Query Helper Interface**

EmailVerificationQueryHelpers

---

# **5\. Enums**

This collection contains **no enums**.

The verification lifecycle is derived from timestamps.

| State | Rule |
| ----- | ----- |
| PENDING | verifiedAt \= null AND expiresAt \> now |
| VERIFIED | verifiedAt \!= null |
| EXPIRED | expiresAt \<= now |

A separate status field would duplicate information already available from the timestamps.

---

# **6\. Embedded Schemas**

This collection contains **no embedded schemas**.

Reason:

Each verification request is a simple, independent document with no nested value objects.

---

# **7\. Main Schema**

| Field | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| \_id | ObjectId | ✓ | Primary Key |
| userId | ObjectId | ✓ | Reference → User |
| email | String | ✓ | Email being verified |
| verificationTokenHash | String | ✓ | Hashed verification token |
| expiresAt | Date | ✓ | Token expiration |
| verifiedAt | Date | null | No | Verification completion time |
| createdAt | Date | Auto | Created Timestamp |
| updatedAt | Date | Auto | Updated Timestamp |

---

# **8\. Validation**

## **Required**

* userId  
* email  
* verificationTokenHash  
* expiresAt

---

## **Email**

* Required  
* Lowercase  
* Trimmed  
* Must match the User email  
* RFC-compliant email validation

---

## **Verification Token**

* Required  
* Stored only as a hash  
* Never stored in plain text  
* Unique

---

## **Expiration**

* Must be later than `createdAt`  
* Cannot already be expired

---

## **Verification**

`verifiedAt`

* Must be greater than `createdAt`  
* Cannot be set after expiration

---

# **9\. Indexes**

## **Unique**

verificationTokenHash

---

## **Single Indexes**

userId

email

expiresAt (TTL)

createdAt

---

## **Compound Indexes**

userId \+ email

userId \+ createdAt

Useful for

* Resend verification  
* Verification history  
* Latest verification lookup

TTL Index

expiresAt

Automatically removes expired verification requests.

---

# **10\. Virtuals**

## **id**

\_id → id

---

## **isVerified**

Returns

verifiedAt \!= null

---

## **isExpired**

Returns

expiresAt \<= now

---

## **isPending**

Returns

verifiedAt \== null

AND

expiresAt \> now

---

# **11\. Middleware**

## **Pre Validate**

* Normalize email  
* Trim strings

---

## **Pre Save**

* Ensure token is hashed  
* Validate expiration  
* Prevent changing `userId`

---

## **Post Save**

None

Updating the User's `emailVerified` field should occur in the service layer after successful verification.

---

# **12\. Instance Methods**

isVerified()

isExpired()

isPending()

markVerified()

belongsTo(userId)

---

# **13\. Static Methods**

findPending(userId)

findLatest(userId)

findByTokenHash()

deleteExpired()

hasPendingVerification(userId)

---

# **14\. Query Helpers**

.pending()

.verified()

.expired()

.byUser(userId)

.byEmail(email)

.recent()

Example

EmailVerificationModel.find()  
    .pending()  
    .byUser(userId);

---

# **15\. Immutable Fields**

Immutable after creation

userId

email

verificationTokenHash

createdAt

Mutable

verifiedAt

updatedAt

Reason

A verification request represents a single verification attempt and should never change ownership, email, or token.

---

# **16\. Serialization**

Hide

verificationTokenHash

\_\_v

Expose

id

userId

email

expiresAt

verifiedAt

createdAt

updatedAt

Convert

\_id → id

Remove

\_\_v

---

# **17\. Plugins**

Recommended Plugins

Serialization Plugin

Audit Plugin

Optimistic Concurrency Plugin

Do **not** use

Soft Delete Plugin

Reason

Verification requests are temporary records automatically removed through MongoDB TTL indexes after expiration.

---

# **18\. Performance Notes**

## **Read Patterns**

Most common lookups

* verificationTokenHash  
* userId  
* email  
* pending verification

---

## **Write Frequency**

Low

Occurs during

* Registration  
* Email resend  
* Email verification

---

## **Expected Growth**

Short-lived documents.

TTL cleanup prevents long-term accumulation.

---

## **Document Size**

Very small (\<1 KB)

Optimized for fast verification lookups.

---

## **Design Decisions**

* One document per verification request.  
* Tokens stored only as hashes.  
* Lifecycle derived from timestamps.  
* Automatic expiration using TTL.  
* User document remains the source of truth for `emailVerified`.  
* Replay attacks prevented by marking requests as verified and expiring old tokens.

---

# **19\. Example Document**

{  
  "\_id": "6865c25fb91ef8d243123456",  
  "userId": "68652b7f5c4e8f12ab345678",  
  "email": "nihal@example.com",  
  "verificationTokenHash": "$argon2id$v=19$m=65536,t=3,p=4$\*\*\*\*\*\*\*\*",  
  "expiresAt": "2026-07-02T11:00:00.000Z",  
  "verifiedAt": null,  
  "createdAt": "2026-07-02T10:00:00.000Z",  
  "updatedAt": "2026-07-02T10:00:00.000Z"  
}

## **Design Review**

This schema cleanly separates temporary email verification requests from the permanent `User` aggregate. It follows the approved Identity architecture by treating verification records as short-lived documents, storing only hashed tokens, deriving lifecycle state from timestamps instead of redundant status fields, and using MongoDB TTL indexes for automatic cleanup. Successful verification updates the `User.emailVerified` flag in the service layer, preserving the `User` collection as the single source of truth for account verification status.

---

 

# **PasswordReset**

---

# **1\. Purpose**

The **PasswordReset** collection manages secure password reset requests for users authenticated through the **LOCAL** authentication provider.

It provides a secure, temporary mechanism for resetting forgotten passwords while protecting against replay attacks and unauthorized password changes.

This collection is responsible for:

* Password reset requests  
* Secure reset token management  
* Token expiration  
* One-time token usage  
* Password recovery audit trail

The collection belongs to the **Identity Domain** and supports the User aggregate without storing authentication credentials beyond the temporary reset request.

---

# **2\. Collection**

| Property | Value |
| ----- | ----- |
| Collection Name | `passwordResets` |
| Aggregate Root | PasswordReset |
| Owner Domain | Identity |
| Parent Aggregate | User |
| MongoDB Collection | passwordResets |
| Soft Delete | No |
| Historical Records | Temporary |
| TTL Enabled | Yes |

---

# **3\. Mongoose Model Name**

PasswordReset

Export

export const PasswordResetModel

---

# **4\. TypeScript Interfaces**

## **Base Interface**

PasswordReset

Represents a password reset request.

---

## **Document Interface**

PasswordResetDocument

Extends

HydratedDocument\<PasswordReset\>

---

## **Model Interface**

PasswordResetModel

Extends

Model\<PasswordReset\>

---

## **Query Helper Interface**

PasswordResetQueryHelpers

---

# **5\. Enums**

This collection contains **no enums**.

The password reset lifecycle is determined by timestamps.

| State | Rule |
| ----- | ----- |
| PENDING | usedAt \= null AND expiresAt \> now |
| USED | usedAt \!= null |
| EXPIRED | expiresAt \<= now |

Using timestamps instead of a `status` field avoids redundant state storage.

---

# **6\. Embedded Schemas**

This collection contains **no embedded schemas**.

Reason:

A password reset request is a simple document with no nested entities or value objects.

---

# **7\. Main Schema**

| Field | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| \_id | ObjectId | ✓ | Primary Key |
| userId | ObjectId | ✓ | Reference → User |
| resetTokenHash | String | ✓ | Hashed reset token |
| expiresAt | Date | ✓ | Token expiration |
| usedAt | Date | null | No | Password reset completion time |
| createdAt | Date | Auto | Created Timestamp |
| updatedAt | Date | Auto | Updated Timestamp |

---

# **8\. Validation**

## **Required**

* userId  
* resetTokenHash  
* expiresAt

---

## **User Reference**

* Must reference an existing User.  
* User must support the `LOCAL` authentication provider.  
* Password reset is not applicable to OAuth-only accounts.

---

## **Reset Token**

* Required  
* Stored only as a hash  
* Never stored in plain text  
* Must be unique

---

## **Expiration**

* Must be greater than `createdAt`  
* Cannot already be expired

---

## **Usage**

`usedAt`

* Must be greater than `createdAt`  
* Cannot be set after expiration  
* Can only be assigned once

---

# **9\. Indexes**

## **Unique**

resetTokenHash

---

## **Single Indexes**

userId

expiresAt (TTL)

createdAt

---

## **Compound Indexes**

userId \+ createdAt

userId \+ expiresAt

Useful for:

* Finding the latest reset request  
* Preventing excessive reset requests  
* Password recovery auditing

TTL Index

expiresAt

Automatically removes expired password reset requests.

---

# **10\. Virtuals**

## **id**

\_id → id

---

## **isExpired**

Returns

expiresAt \<= now

---

## **isUsed**

Returns

usedAt \!= null

---

## **isPending**

Returns

usedAt \== null

AND

expiresAt \> now

---

# **11\. Middleware**

## **Pre Validate**

* Trim strings

---

## **Pre Save**

* Ensure reset token is hashed  
* Validate expiration date  
* Prevent changing `userId`

---

## **Post Save**

None

Updating the user's password belongs to the service layer after successful token verification.

---

# **12\. Instance Methods**

isExpired()

isUsed()

isPending()

markUsed()

belongsTo(userId)

---

# **13\. Static Methods**

findPending(userId)

findLatest(userId)

findByTokenHash()

deleteExpired()

hasPendingReset(userId)

---

# **14\. Query Helpers**

.pending()

.used()

.expired()

.byUser(userId)

.recent()

Example

PasswordResetModel.find()  
    .pending()  
    .byUser(userId);

---

# **15\. Immutable Fields**

Immutable after creation

userId

resetTokenHash

createdAt

Mutable

usedAt

updatedAt

Reason

A password reset request represents a single password recovery attempt and must never change ownership or token identity after creation.

---

# **16\. Serialization**

Hide

resetTokenHash

\_\_v

Expose

id

userId

expiresAt

usedAt

createdAt

updatedAt

Convert

\_id → id

Remove

\_\_v

---

# **17\. Plugins**

Recommended Plugins

Serialization Plugin

Audit Plugin

Optimistic Concurrency Plugin

Do **not** use

Soft Delete Plugin

Reason

Password reset requests are temporary security documents and should be automatically removed through MongoDB TTL indexes rather than retained indefinitely.

---

# **18\. Performance Notes**

## **Read Patterns**

Most common lookups

* resetTokenHash  
* userId  
* pending reset requests

---

## **Write Frequency**

Low

Occurs during

* Forgot Password  
* Password Reset  
* Password Recovery

---

## **Expected Growth**

Short-lived documents.

TTL cleanup ensures automatic removal of expired requests.

---

## **Document Size**

Very small (\<1 KB)

Optimized for fast token validation.

---

## **Design Decisions**

* One document per password reset request.  
* Supports multiple reset requests over time.  
* Tokens are stored only as hashes.  
* One-time token usage enforced using `usedAt`.  
* Lifecycle derived from timestamps.  
* Automatic cleanup through MongoDB TTL indexes.  
* Password updates occur only in the User aggregate after successful validation.

---

# **19\. Example Document**

{  
  "\_id": "6865d6bcb91ef8d243654321",  
  "userId": "68652b7f5c4e8f12ab345678",  
  "resetTokenHash": "$argon2id$v=19$m=65536,t=3,p=4$\*\*\*\*\*\*\*\*",  
  "expiresAt": "2026-07-02T15:00:00.000Z",  
  "usedAt": null,  
  "createdAt": "2026-07-02T14:00:00.000Z",  
  "updatedAt": "2026-07-02T14:00:00.000Z"  
}

## **Design Review**

This schema completes the Identity Domain by providing a secure, temporary mechanism for password recovery while keeping authentication credentials centralized in the `User` aggregate. It follows the approved database design by storing only hashed reset tokens, deriving lifecycle state from timestamps instead of a redundant status field, enforcing one-time token usage, and relying on MongoDB TTL indexes for automatic cleanup. Password changes remain the responsibility of the User aggregate and the authentication service layer, preserving clear domain boundaries and maintaining a secure recovery workflow.

---

 **02\_Profile**

**ClientProfile**

---

# **1\. Purpose**

The **ClientProfile** collection stores the personal, health, and fitness profile of a client.

It extends the authentication identity stored in the **User** collection with domain-specific information required for coaching.

This collection is responsible for:

* Personal profile information  
* Body measurements  
* Fitness goals  
* Medical information  
* Lifestyle preferences  
* Client onboarding completion  
* Trainer-facing profile information

Authentication, authorization, and login information remain exclusively in the **User** aggregate. The ClientProfile only owns client-specific business data.

---

# **2\. Collection**

| Property | Value |
| ----- | ----- |
| Collection Name | `clientProfiles` |
| Aggregate Root | ClientProfile |
| Owner Domain | Profile |
| Parent Aggregate | User |
| MongoDB Collection | clientProfiles |
| Soft Delete | No |
| Historical Records | Current Snapshot |
| Ownership | One User → One ClientProfile |

---

# **3\. Mongoose Model Name**

ClientProfile

Export

export const ClientProfileModel

---

# **4\. TypeScript Interfaces**

## **Enums**

Gender  
WeightUnit  
HeightUnit  
DietaryPreference  
FitnessGoal  
ExperienceLevel  
ActivityLevel

---

## **Embedded Interfaces**

Weight  
Height

---

## **Base Interface**

ClientProfile

---

## **Document Interface**

ClientProfileDocument

Extends

HydratedDocument\<ClientProfile\>

---

## **Model Interface**

ClientProfileModel

Extends

Model\<ClientProfile\>

---

## **Query Helper Interface**

ClientProfileQueryHelpers

---

# **5\. Enums**

## **Gender**

MALE  
FEMALE  
OTHER  
PREFER\_NOT\_TO\_SAY

---

## **WeightUnit**

KG  
LB

---

## **HeightUnit**

CM  
FT

---

## **DietaryPreference**

VEG  
VEGAN  
EGGETARIAN  
HALAL  
KETO  
PALEO  
JAIN  
OTHER

---

## **FitnessGoal**

WEIGHT\_LOSS  
FAT\_LOSS  
MUSCLE\_GAIN  
STRENGTH  
ENDURANCE  
FLEXIBILITY  
GENERAL\_FITNESS

---

## **ExperienceLevel**

BEGINNER  
INTERMEDIATE  
ADVANCED

---

## **ActivityLevel**

SEDENTARY  
LIGHTLY\_ACTIVE  
MODERATELY\_ACTIVE  
VERY\_ACTIVE  
ATHLETE

---

# **6\. Embedded Schemas**

## **Weight**

| Field | Type |
| ----- | ----- |
| value | Number |
| unit | WeightUnit |

Purpose

Represents the client's current body weight.

---

## **Height**

| Field | Type |
| ----- | ----- |
| value | Number |
| unit | HeightUnit |

Purpose

Represents the client's height.

Reason for embedding

Both objects are value objects with no independent lifecycle.

---

# **7\. Main Schema**

| Field | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| \_id | ObjectId | ✓ | Primary Key |
| userId | ObjectId | ✓ | Unique Reference → User |
| fullName | String | ✓ | Client display name |
| avatarUrl | String | null | No | Profile image |
| gender | Gender | No | Gender |
| dateOfBirth | Date | null | No | Birth date |
| phoneNumber | String | null | No | Contact number |
| country | String | null | No | Country |
| state | String | null | No | State |
| city | String | null | No | City |
| timezone | String | null | No | IANA timezone |
| weight | Weight | No | Current weight |
| height | Height | No | Current height |
| medicalNotes | String | null | No | Medical conditions |
| dietaryPreferences | DietaryPreference\[\] | No | Food preferences |
| fitnessGoals | FitnessGoal\[\] | ✓ | Coaching goals |
| experienceLevel | ExperienceLevel | No | Training experience |
| activityLevel | ActivityLevel | No | Lifestyle activity |
| profileCompleted | Boolean | ✓ | Onboarding completion |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

---

# **8\. Validation**

## **Required**

* userId  
* fullName  
* fitnessGoals  
* profileCompleted

---

## **User Reference**

* Must reference an existing User.  
* User role must be `CLIENT`.  
* One profile per user.

---

## **Phone Number**

* E.164 format  
* Optional

---

## **Weight**

* Value \> 0  
* Unit required when value exists

---

## **Height**

* Value \> 0  
* Unit required when value exists

---

## **Date of Birth**

* Must be in the past.  
* Maximum age validation (configurable).

---

## **Medical Notes**

* Maximum length restriction.  
* Plain text only.

---

## **Fitness Goals**

* Cannot contain duplicates.  
* At least one goal required.

---

## **Dietary Preferences**

* Duplicate values not allowed.

---

# **9\. Indexes**

## **Unique**

userId

---

## **Single Indexes**

country

state

city

profileCompleted

---

## **Compound Indexes**

country \+ state

experienceLevel \+ activityLevel

profileCompleted \+ country

Useful for:

* Client discovery  
* Analytics  
* Administrative reporting

---

# **10\. Virtuals**

## **id**

\_id → id

---

## **age**

Calculated from

dateOfBirth

---

## **bmi**

Calculated from

weight

height

Not stored.

---

## **location**

Returns

City, State, Country

---

## **profileCompletionPercentage**

Calculated from populated profile fields.

---

# **11\. Middleware**

## **Pre Validate**

* Trim strings  
* Normalize phone number  
* Remove duplicate array values

---

## **Pre Save**

* Validate user role is CLIENT.  
* Validate BMI inputs.  
* Calculate profile completion.

---

## **Post Save**

None

Business events belong in the service layer.

---

# **12\. Instance Methods**

calculateBMI()

calculateAge()

isProfileComplete()

updateMeasurements()

hasFitnessGoal(goal)

---

# **13\. Static Methods**

findByUser()

findCompletedProfiles()

findByCountry()

findByGoal()

findBeginners()

---

# **14\. Query Helpers**

.completed()

.byCountry()

.byGoal()

.byActivityLevel()

.byExperience()

.withMedicalNotes()

Example

ClientProfileModel.find()  
    .completed()  
    .byGoal(FitnessGoal.MUSCLE\_GAIN);

---

# **15\. Immutable Fields**

Immutable

userId

createdAt

Generally immutable

dateOfBirth

(Administrative override only.)

Mutable

* Measurements  
* Goals  
* Medical notes  
* Avatar  
* Contact information

---

# **16\. Serialization**

Hide

\_\_v

Expose

id

userId

fullName

avatarUrl

gender

dateOfBirth

country

state

city

timezone

weight

height

medicalNotes

dietaryPreferences

fitnessGoals

experienceLevel

activityLevel

profileCompleted

createdAt

updatedAt

Convert

\_id → id

Remove

\_\_v

---

# **17\. Plugins**

Recommended Plugins

Serialization Plugin

Audit Plugin

Optimistic Concurrency Plugin

Do **not** use

Soft Delete Plugin

Reason

A ClientProfile is intended to exist for the lifetime of the associated User account. Profile visibility is managed through the User's account status rather than deleting or soft-deleting the profile.

---

# **18\. Performance Notes**

## **Read Patterns**

Most common lookups

* userId  
* profile  
* fitness goals  
* location

---

## **Write Frequency**

Medium

Occurs during

* Profile setup  
* Measurement updates  
* Goal changes  
* Personal information updates

---

## **Expected Growth**

One document per client.

Scales linearly with the number of client accounts.

---

## **Document Size**

Small to medium (approximately 2–5 KB).

---

## **Design Decisions**

* One profile per client.  
* Authentication data remains in the User collection.  
* Weight and Height are embedded value objects.  
* BMI and age are calculated virtually.  
* Profile completion is stored for efficient onboarding queries.  
* Historical measurements are intentionally excluded and belong in the Progress Domain rather than the Profile Domain, preserving clear domain boundaries.

---

# **19\. Example Document**

{  
  "\_id": "6867f5d75c4e8f12ab987654",  
  "userId": "68652b7f5c4e8f12ab345678",  
  "fullName": "Mohammed Nihal K",  
  "avatarUrl": "https://cdn.kizunafit.com/avatar/client-1.jpg",  
  "gender": "MALE",  
  "dateOfBirth": "2001-05-20T00:00:00.000Z",  
  "phoneNumber": "+919876543210",  
  "country": "India",  
  "state": "Kerala",  
  "city": "Palakkad",  
  "timezone": "Asia/Kolkata",  
  "weight": {  
    "value": 72,  
    "unit": "KG"  
  },  
  "height": {  
    "value": 175,  
    "unit": "CM"  
  },  
  "medicalNotes": "Mild lower back pain.",  
  "dietaryPreferences": \[  
    "HALAL"  
  \],  
  "fitnessGoals": \[  
    "MUSCLE\_GAIN",  
    "STRENGTH"  
  \],  
  "experienceLevel": "INTERMEDIATE",  
  "activityLevel": "MODERATELY\_ACTIVE",  
  "profileCompleted": true,  
  "createdAt": "2026-06-20T10:00:00.000Z",  
  "updatedAt": "2026-07-02T08:15:00.000Z"  
}

## **Design Review**

This design maintains a strict separation between identity and profile data, making the `ClientProfile` the aggregate root for client-specific business information while leaving authentication concerns to the `User` aggregate. It embeds only true value objects (`Weight` and `Height`), stores current-state profile information, and deliberately excludes historical measurements, which belong to the Progress Domain. The result is a compact, scalable profile model that aligns with the approved domain architecture and database design.

---

 

# **TrainerProfile**

---

# **1\. Purpose**

The **TrainerProfile** collection stores the professional profile of a trainer.

It extends the authentication identity stored in the **User** collection with coaching-specific information required for marketplace discovery, client acquisition, and coaching delivery.

This collection is responsible for:

* Public trainer profile  
* Professional biography  
* Coaching experience  
* Specializations  
* Certifications  
* Languages  
* Availability  
* Public rating summary  
* Marketplace visibility

Authentication, authorization, payments, coaching offers, and reviews remain in their respective domains. The TrainerProfile only owns trainer-specific business information.

---

# **2\. Collection**

| Property | Value |
| ----- | ----- |
| Collection Name | `trainerProfiles` |
| Aggregate Root | TrainerProfile |
| Owner Domain | Profile |
| Parent Aggregate | User |
| MongoDB Collection | trainerProfiles |
| Soft Delete | No |
| Historical Records | Current Snapshot |
| Ownership | One User → One TrainerProfile |

---

# **3\. Mongoose Model Name**

TrainerProfile

Export

export const TrainerProfileModel

---

# **4\. TypeScript Interfaces**

## **Enums**

TrainerAvailabilityStatus  
TrainerSpecialization

---

## **Embedded Interfaces**

TrainerLocation  
TrainerCertification

---

## **Base Interface**

TrainerProfile

---

## **Document Interface**

TrainerProfileDocument

Extends

HydratedDocument\<TrainerProfile\>

---

## **Model Interface**

TrainerProfileModel

Extends

Model\<TrainerProfile\>

---

## **Query Helper Interface**

TrainerProfileQueryHelpers

---

# **5\. Enums**

## **TrainerAvailabilityStatus**

AVAILABLE  
BUSY  
OFFLINE

---

## **TrainerSpecialization**

WEIGHT\_LOSS  
MUSCLE\_GAIN  
STRENGTH\_TRAINING  
BODYBUILDING  
CALISTHENICS  
CROSSFIT  
POWERLIFTING  
YOGA  
PILATES  
CARDIO  
REHABILITATION  
SPORTS\_PERFORMANCE  
MOBILITY  
FUNCTIONAL\_FITNESS  
NUTRITION

---

# **6\. Embedded Schemas**

## **TrainerLocation**

| Field | Type |
| ----- | ----- |
| city | String |
| state | String |
| country | String |

Purpose

Represents the trainer's primary business location.

---

## **TrainerCertification**

| Field | Type |
| ----- | ----- |
| title | String |
| organization | String |
| issuedAt | Date |
| expiresAt | Date |
| certificateUrl | String |

Purpose

Represents a professional certification earned by the trainer.

Reason for embedding

Certifications and location have no independent lifecycle outside the trainer profile.

---

# **7\. Main Schema**

| Field | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| \_id | ObjectId | ✓ | Primary Key |
| userId | ObjectId | ✓ | Unique Reference → User |
| bio | String | ✓ | Professional biography |
| headline | String | ✓ | Public headline |
| avatarUrl | String | null | No | Profile image |
| yearsOfExperience | Number | ✓ | Professional experience |
| languages | String\[\] | ✓ | Spoken languages |
| specializations | TrainerSpecialization\[\] | ✓ | Coaching expertise |
| certifications | TrainerCertification\[\] | No | Professional certifications |
| location | TrainerLocation | ✓ | Business location |
| availabilityStatus | TrainerAvailabilityStatus | ✓ | Current availability |
| totalClients | Number | ✓ | Cached client count |
| totalReviews | Number | ✓ | Cached review count |
| averageRating | Number | ✓ | Cached rating |
| profileCompleted | Boolean | ✓ | Marketplace readiness |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

---

# **8\. Validation**

## **Required**

* userId  
* bio  
* headline  
* yearsOfExperience  
* languages  
* specializations  
* location  
* availabilityStatus  
* profileCompleted

---

## **User Reference**

* Must reference an existing User.  
* User role must be `TRAINER`.  
* One profile per trainer.

---

## **Bio**

* Required  
* Trimmed  
* Maximum length (configurable)

---

## **Headline**

* Required  
* Trimmed  
* Maximum length (configurable)

---

## **Years of Experience**

* Minimum: 0  
* Maximum: configurable

---

## **Languages**

* At least one language.  
* No duplicate values.

---

## **Specializations**

* At least one specialization.  
* Duplicate values not allowed.

---

## **Rating**

* Range: **0.0 \- 5.0**  
* Read-only.  
* Updated only by the Review Domain.

---

## **Total Clients**

* Read-only.  
* Updated only by the Coaching Domain.

---

## **Certifications**

* Expiration date must be greater than issue date.  
* URL must be valid when provided.

---

# **9\. Indexes**

## **Unique**

userId

---

## **Single Indexes**

availabilityStatus

averageRating

totalClients

profileCompleted

---

## **Compound Indexes**

availabilityStatus \+ averageRating

specializations \+ availabilityStatus

location.country \+ location.state

profileCompleted \+ availabilityStatus

Useful for

* Marketplace search  
* Trainer discovery  
* Admin reporting  
* Public listing

---

# **10\. Virtuals**

## **id**

\_id → id

---

## **isAvailable**

Returns

availabilityStatus \=== AVAILABLE

---

## **hasCertifications**

Returns

certifications.length \> 0

---

## **experienceCategory**

Returns

BEGINNER

INTERMEDIATE

EXPERT

Based on years of experience.

---

## **profileCompletionPercentage**

Calculated from completed profile fields.

---

# **11\. Middleware**

## **Pre Validate**

* Trim strings.  
* Remove duplicate languages.  
* Remove duplicate specializations.

---

## **Pre Save**

* Validate User role.  
* Validate certification dates.  
* Calculate profile completion.

---

## **Post Save**

None.

Marketplace indexing and notifications belong in the service layer.

---

# **12\. Instance Methods**

isAvailable()

hasSpecialization()

hasCertification()

calculateExperienceCategory()

isProfileComplete()

---

# **13\. Static Methods**

findAvailable()

findBySpecialization()

findTopRated()

findByCountry()

findMarketplaceVisible()

---

# **14\. Query Helpers**

.available()

.byCountry()

.bySpecialization()

.topRated()

.completed()

.withMinimumRating()

Example

TrainerProfileModel.find()  
    .available()  
    .bySpecialization(TrainerSpecialization.CALISTHENICS);

---

# **15\. Immutable Fields**

Immutable

userId

createdAt

Generally immutable

yearsOfExperience

(Should only increase over time.)

Read-only (managed by other domains)

averageRating

totalReviews

totalClients

Mutable

* Bio  
* Headline  
* Languages  
* Specializations  
* Certifications  
* Availability  
* Avatar

---

# **16\. Serialization**

Hide

\_\_v

Expose

id

userId

bio

headline

avatarUrl

yearsOfExperience

languages

specializations

certifications

location

availabilityStatus

totalClients

totalReviews

averageRating

profileCompleted

createdAt

updatedAt

Convert

\_id → id

Remove

\_\_v

---

# **17\. Plugins**

Recommended Plugins

Serialization Plugin

Audit Plugin

Optimistic Concurrency Plugin

Do **not** use

Soft Delete Plugin

Reason

A TrainerProfile exists as long as the associated trainer account exists. Marketplace visibility is controlled through the User account status and `profileCompleted` flag rather than deleting the profile.

---

# **18\. Performance Notes**

## **Read Patterns**

Most common lookups

* userId  
* marketplace listings  
* specialization  
* availability  
* top-rated trainers

---

## **Write Frequency**

Medium

Occurs during

* Profile updates  
* Certification updates  
* Availability changes  
* Rating synchronization

---

## **Expected Growth**

One document per trainer.

Scales linearly with the number of trainer accounts.

---

## **Document Size**

Medium (approximately 3–8 KB).

---

## **Design Decisions**

* One profile per trainer.  
* Authentication remains in the User aggregate.  
* Public marketplace data is centralized here.  
* Ratings and client counts are cached for fast marketplace queries and synchronized by the Review and Coaching domains.  
* Certifications are embedded value objects because they have no independent lifecycle.  
* Historical coaching statistics are intentionally excluded and belong to their respective domains, keeping the profile focused on the trainer's current public identity.

---

# **19\. Example Document**

{  
  "\_id": "686805275c4e8f12ab112233",  
  "userId": "68652b7f5c4e8f12ab345678",  
  "bio": "Certified strength and calisthenics coach helping clients build functional muscle and mobility.",  
  "headline": "Strength & Calisthenics Coach",  
  "avatarUrl": "https://cdn.kizunafit.com/avatar/trainer-1.jpg",  
  "yearsOfExperience": 6,  
  "languages": \[  
    "English",  
    "Malayalam"  
  \],  
  "specializations": \[  
    "CALISTHENICS",  
    "STRENGTH\_TRAINING"  
  \],  
  "certifications": \[  
    {  
      "title": "Certified Personal Trainer",  
      "organization": "ACE",  
      "issuedAt": "2023-01-15T00:00:00.000Z",  
      "expiresAt": "2028-01-15T00:00:00.000Z",  
      "certificateUrl": "https://cdn.kizunafit.com/certificates/ace-cpt.pdf"  
    }  
  \],  
  "location": {  
    "city": "Palakkad",  
    "state": "Kerala",  
    "country": "India"  
  },  
  "availabilityStatus": "AVAILABLE",  
  "totalClients": 42,  
  "totalReviews": 38,  
  "averageRating": 4.9,  
  "profileCompleted": true,  
  "createdAt": "2026-06-20T09:00:00.000Z",  
  "updatedAt": "2026-07-02T10:30:00.000Z"  
}

## **Design Review**

This design keeps the `TrainerProfile` focused on the trainer's professional identity while leaving authentication, coaching relationships, reviews, payments, and marketplace workflow to their respective domains. Cached fields such as `averageRating`, `totalReviews`, and `totalClients` are optimized for marketplace performance and treated as read-only projections maintained by other domains. The result is a scalable, read-optimized aggregate that aligns with the approved domain architecture and database design.

---

 

# **AcquisitionPipeline**

---

# **1\. Purpose**

The **AcquisitionPipeline** collection manages the complete client acquisition journey from the moment a client requests coaching until the client either becomes an active coaching relationship or the acquisition process is closed.

It acts as the central workflow aggregate for converting marketplace interest into a paid coaching relationship.

This collection is responsible for:

* Coaching requests  
* Client-trainer matching  
* Acquisition workflow  
* Trainer snapshot preservation  
* Consultation progression  
* Offer progression  
* Conversion tracking  
* Sales pipeline lifecycle

It intentionally does **not** store consultation details, offers, payments, or coaching data. Those belong to their respective domains and are linked through references. The AcquisitionPipeline only owns the acquisition workflow.

---

# **2\. Collection**

| Property | Value |
| ----- | ----- |
| Collection Name | `acquisitionPipelines` |
| Aggregate Root | AcquisitionPipeline |
| Owner Domain | Marketplace |
| Parent Aggregate | None |
| MongoDB Collection | acquisitionPipelines |
| Soft Delete | No |
| Historical Records | Permanent |
| Ownership | One Client ↔ One Trainer per acquisition |

---

# **3\. Mongoose Model Name**

AcquisitionPipeline

Export

export const AcquisitionPipelineModel

---

# **4\. TypeScript Interfaces**

## **Enums**

AcquisitionPipelineStatus

---

## **Embedded Interfaces**

TrainerRequest  
TrainerSnapshot

---

## **Base Interface**

AcquisitionPipeline

---

## **Document Interface**

AcquisitionPipelineDocument

Extends

HydratedDocument\<AcquisitionPipeline\>

---

## **Model Interface**

AcquisitionPipelineModel

Extends

Model\<AcquisitionPipeline\>

---

## **Query Helper Interface**

AcquisitionPipelineQueryHelpers

---

# **5\. Enums**

## **AcquisitionPipelineStatus**

REQUESTED

ACCEPTED

REJECTED

CONSULTATION\_SCHEDULED

CONSULTATION\_COMPLETED

OFFER\_SENT

OFFER\_ACCEPTED

OFFER\_DECLINED

PAYMENT\_COMPLETED

CONVERTED

CLOSED

The status values follow the approved Marketplace state machine and represent the complete acquisition lifecycle.

---

# **6\. Embedded Schemas**

## **TrainerRequest**

| Field | Type |
| ----- | ----- |
| message | String |
| requestedAt | Date |

Purpose

Captures the client's initial coaching request.

---

## **TrainerSnapshot**

| Field | Type |
| ----- | ----- |
| fullName | String |
| headline | String |
| profileImage | String |
| yearsOfExperience | Number |
| averageRating | Number |
| totalReviews | Number |
| specializations | String\[\] |

Purpose

Stores an immutable snapshot of the trainer's public profile at the time the coaching request is created.

Reason for embedding

This snapshot preserves historical accuracy even if the trainer later updates their profile.

---

# **7\. Main Schema**

| Field | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| \_id | ObjectId | ✓ | Primary Key |
| clientId | ObjectId | ✓ | Reference → User |
| trainerId | ObjectId | ✓ | Reference → User |
| trainerRequest | TrainerRequest | ✓ | Initial coaching request |
| trainerSnapshot | TrainerSnapshot | ✓ | Immutable trainer snapshot |
| status | AcquisitionPipelineStatus | ✓ | Current acquisition state |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

---

# **8\. Validation**

## **Required**

* clientId  
* trainerId  
* trainerRequest  
* trainerSnapshot  
* status

---

## **Client Reference**

* Must reference an existing User.  
* User role must be `CLIENT`.

---

## **Trainer Reference**

* Must reference an existing User.  
* User role must be `TRAINER`.

---

## **Trainer Snapshot**

* Required.  
* Immutable after creation.  
* Represents historical data.

---

## **Status**

* Must follow the approved Marketplace state machine.  
* Invalid transitions are rejected by the service layer.

---

## **Request Message**

* Optional.  
* Maximum length (configurable).  
* Trimmed before storage.

---

# **9\. Indexes**

## **Single Indexes**

clientId

trainerId

status

createdAt

---

## **Compound Indexes**

clientId \+ status

trainerId \+ status

status \+ createdAt

clientId \+ trainerId

Useful for

* Client dashboard  
* Trainer dashboard  
* Marketplace analytics  
* Pipeline reporting

---

# **10\. Virtuals**

## **id**

\_id → id

---

## **isOpen**

Returns

status \!== CONVERTED

AND

status \!== CLOSED

---

## **isConverted**

Returns

status \=== CONVERTED

---

## **canScheduleConsultation**

Returns

status \=== ACCEPTED

---

## **canSendOffer**

Returns

status \=== CONSULTATION\_COMPLETED

---

# **11\. Middleware**

## **Pre Validate**

* Trim request message.  
* Validate embedded snapshot.

---

## **Pre Save**

* Validate client and trainer are different users.  
* Validate state transition.  
* Prevent modification of `trainerSnapshot`.

---

## **Post Save**

None.

Creating consultations, offers, or coaching relationships belongs to the service layer.

---

# **12\. Instance Methods**

accept()

reject()

scheduleConsultation()

completeConsultation()

sendOffer()

acceptOffer()

declineOffer()

markPaymentCompleted()

convert()

close()

isOpen()

---

# **13\. Static Methods**

findByClient()

findByTrainer()

findActive()

findConverted()

findPendingRequests()

findByStatus()

---

# **14\. Query Helpers**

.open()

.converted()

.byClient()

.byTrainer()

.byStatus()

.recent()

Example

AcquisitionPipelineModel.find()  
    .open()  
    .byTrainer(trainerId);

---

# **15\. Immutable Fields**

Immutable

clientId

trainerId

trainerSnapshot

createdAt

Mutable

status

updatedAt

Reason

The participants and historical trainer snapshot must never change once the acquisition process begins.

---

# **16\. Serialization**

Hide

\_\_v

Expose

id

clientId

trainerId

trainerRequest

trainerSnapshot

status

createdAt

updatedAt

Convert

\_id → id

Remove

\_\_v

---

# **17\. Plugins**

Recommended Plugins

Serialization Plugin

Audit Plugin

Optimistic Concurrency Plugin

Do **not** use

Soft Delete Plugin

Reason

Acquisition history is valuable for business analytics and reporting. Pipelines should transition to `CLOSED` rather than being deleted, preserving the complete customer acquisition history.

---

# **18\. Performance Notes**

## **Read Patterns**

Most common lookups

* Trainer dashboard  
* Client dashboard  
* Active pipelines  
* Pipeline status  
* Conversion analytics

---

## **Write Frequency**

Medium

Occurs during

* Coaching requests  
* Consultation scheduling  
* Offer progression  
* Payment completion  
* Pipeline conversion

---

## **Expected Growth**

One document per coaching acquisition.

The collection grows with every client acquisition attempt and serves as a historical record.

---

## **Document Size**

Small to medium (approximately 2–4 KB).

---

## **Design Decisions**

* One acquisition pipeline per coaching journey.  
* Trainer snapshot is embedded to preserve historical accuracy.  
* Consultations, offers, payments, and coaching relationships remain in separate aggregates.  
* Status follows the Marketplace state machine.  
* Historical records are never deleted and provide valuable conversion analytics.  
* The pipeline acts as the orchestration aggregate for the entire acquisition workflow without owning downstream domain data.

---

# **19\. Example Document**

{  
  "\_id": "68682df75c4e8f12ab123456",  
  "clientId": "68652b7f5c4e8f12ab111111",  
  "trainerId": "68652b7f5c4e8f12ab222222",  
  "trainerRequest": {  
    "message": "I want a 12-week muscle-building program with weekly check-ins.",  
    "requestedAt": "2026-07-02T09:30:00.000Z"  
  },  
  "trainerSnapshot": {  
    "fullName": "John Doe",  
    "headline": "Strength & Nutrition Coach",  
    "profileImage": "https://cdn.kizunafit.com/trainers/john.jpg",  
    "yearsOfExperience": 8,  
    "averageRating": 4.9,  
    "totalReviews": 124,  
    "specializations": \[  
      "MUSCLE\_GAIN",  
      "STRENGTH\_TRAINING"  
    \]  
  },  
  "status": "CONSULTATION\_SCHEDULED",  
  "createdAt": "2026-07-02T09:30:00.000Z",  
  "updatedAt": "2026-07-02T10:15:00.000Z"  
}

## **Design Review**

This design establishes `AcquisitionPipeline` as the orchestration aggregate for the Marketplace Domain. It owns only the acquisition workflow while delegating consultations, offers, payments, and coaching relationships to their respective aggregates. The embedded `TrainerSnapshot` preserves historical accuracy, ensuring that future profile changes do not alter past acquisition records. The lifecycle is driven by the approved Marketplace state machine, making the collection both operationally efficient and suitable for long-term business analytics.

---

 

# **Consultation**

---

# **1\. Purpose**

The **Consultation** collection represents the scheduled consultation session between a client and a trainer during the acquisition process.

It serves as the official record of a consultation from scheduling until completion or cancellation.

This collection is responsible for:

* Consultation scheduling  
* Meeting information  
* Session lifecycle  
* Cancellation tracking  
* Attendance tracking  
* Consultation completion

It does **not** contain coaching offers, payments, coaching plans, or video recordings. Those belong to their respective domains. The Consultation aggregate owns only the consultation session.

---

# **2\. Collection**

| Property | Value |
| ----- | ----- |
| Collection Name | `consultations` |
| Aggregate Root | Consultation |
| Owner Domain | Consultation |
| Parent Aggregate | AcquisitionPipeline |
| MongoDB Collection | consultations |
| Soft Delete | No |
| Historical Records | Permanent |
| Ownership | One AcquisitionPipeline → One Consultation |

---

# **3\. Mongoose Model Name**

Consultation

Export

export const ConsultationModel

---

# **4\. TypeScript Interfaces**

## **Enums**

ConsultationPlatform  
ConsultationStatus  
CancellationActor

---

## **Embedded Interfaces**

ConsultationSlot  
ConsultationCancellation  
MeetingDetails

---

## **Base Interface**

Consultation

---

## **Document Interface**

ConsultationDocument

Extends

HydratedDocument\<Consultation\>

---

## **Model Interface**

ConsultationModel

Extends

Model\<Consultation\>

---

## **Query Helper Interface**

ConsultationQueryHelpers

---

# **5\. Enums**

## **ConsultationPlatform**

WEBRTC

Future supported values

GOOGLE\_MEET  
ZOOM  
MICROSOFT\_TEAMS

---

## **ConsultationStatus**

SCHEDULED

WAITING

LIVE

COMPLETED

CANCELLED

NO\_SHOW

---

## **CancellationActor**

CLIENT

TRAINER

ADMIN

SYSTEM

---

# **6\. Embedded Schemas**

## **ConsultationSlot**

| Field | Type |
| ----- | ----- |
| scheduledStartAt | Date |
| scheduledEndAt | Date |
| timezone | String |

Purpose

Stores the official consultation schedule.

---

## **ConsultationCancellation**

| Field | Type |
| ----- | ----- |
| cancelledAt | Date |
| cancelledBy | CancellationActor |
| reason | String |

Purpose

Stores cancellation information.

---

## **MeetingDetails**

Represents provider-specific metadata.

Example

* Session ID  
* Join timestamps  
* Recording ID  
* Connection statistics

Reason

Meeting metadata belongs exclusively to this consultation.

---

# **7\. Main Schema**

| Field | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| \_id | ObjectId | ✓ | Primary Key |
| acquisitionPipelineId | ObjectId | ✓ | Unique Reference → AcquisitionPipeline |
| clientId | ObjectId | ✓ | Reference → User |
| trainerId | ObjectId | ✓ | Reference → User |
| slot | ConsultationSlot | ✓ | Scheduled slot |
| platform | ConsultationPlatform | ✓ | Meeting provider |
| roomId | String | ✓ | Internal room identifier |
| meetingUrl | String | null | No | Join URL |
| meetingDetails | MeetingDetails | No | Provider metadata |
| status | ConsultationStatus | ✓ | Consultation lifecycle |
| completedAt | Date | null | No | Completion timestamp |
| cancellation | ConsultationCancellation | null | No | Cancellation details |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

---

# **8\. Validation**

## **Required**

* acquisitionPipelineId  
* clientId  
* trainerId  
* slot  
* platform  
* roomId  
* status

---

## **Acquisition Pipeline**

* Must reference an existing pipeline.  
* One consultation per acquisition pipeline.

---

## **Participants**

* Client must have role `CLIENT`.  
* Trainer must have role `TRAINER`.  
* Client and Trainer cannot be the same user.

---

## **Slot**

* Start must be before End.  
* Start must be in the future when scheduled.  
* Timezone must be a valid IANA timezone.

---

## **Room ID**

* Required.  
* Unique.  
* Immutable.

---

## **Meeting URL**

* Valid HTTPS URL.  
* Optional until generated.

---

## **Status**

Must follow the approved Consultation state machine.

Invalid transitions are rejected.

---

## **Completion**

`completedAt`

* Can only be set when status becomes `COMPLETED`.

---

# **9\. Indexes**

## **Unique**

acquisitionPipelineId

roomId

---

## **Single Indexes**

clientId

trainerId

status

slot.scheduledStartAt

---

## **Compound Indexes**

trainerId \+ status

clientId \+ status

status \+ slot.scheduledStartAt

trainerId \+ slot.scheduledStartAt

Useful for

* Upcoming consultations  
* Calendar views  
* Trainer schedule  
* Client schedule

---

# **10\. Virtuals**

## **id**

\_id → id

---

## **isUpcoming**

Returns

status \=== SCHEDULED

AND

slot.scheduledStartAt \> now

---

## **isLive**

Returns

status \=== LIVE

---

## **duration**

Calculated from

scheduledEndAt \- scheduledStartAt

---

## **isCompleted**

Returns

status \=== COMPLETED

---

# **11\. Middleware**

## **Pre Validate**

* Validate slot.  
* Normalize timezone.  
* Trim cancellation reason.

---

## **Pre Save**

* Validate state transition.  
* Prevent modification of `roomId`.  
* Validate participant roles.

---

## **Post Save**

None.

Creating video sessions, notifications, or coaching offers belongs to the service layer.

---

# **12\. Instance Methods**

start()

complete()

cancel()

markNoShow()

isUpcoming()

isLive()

getDuration()

---

# **13\. Static Methods**

findUpcoming()

findByTrainer()

findByClient()

findLive()

findToday()

findByRoom()

---

# **14\. Query Helpers**

.upcoming()

.live()

.completed()

.cancelled()

.byTrainer()

.byClient()

.today()

Example

ConsultationModel.find()  
    .upcoming()  
    .byTrainer(trainerId);

---

# **15\. Immutable Fields**

Immutable

acquisitionPipelineId

clientId

trainerId

roomId

createdAt

Mutable

status

meetingUrl

meetingDetails

completedAt

cancellation

updatedAt

Reason

The consultation participants and associated acquisition pipeline must never change after scheduling.

---

# **16\. Serialization**

Hide

\_\_v

Expose

id

acquisitionPipelineId

clientId

trainerId

slot

platform

roomId

meetingUrl

meetingDetails

status

completedAt

cancellation

createdAt

updatedAt

Convert

\_id → id

Remove

\_\_v

---

# **17\. Plugins**

Recommended Plugins

Serialization Plugin

Audit Plugin

Optimistic Concurrency Plugin

Do **not** use

Soft Delete Plugin

Reason

Consultations are permanent business records and should remain available for auditing, reporting, dispute resolution, and coaching history. Cancelled consultations remain in the collection with their final lifecycle state.

---

# **18\. Performance Notes**

## **Read Patterns**

Most common lookups

* Upcoming consultations  
* Trainer calendar  
* Client calendar  
* Live consultations  
* Completed consultations

---

## **Write Frequency**

Medium

Occurs during

* Scheduling  
* Rescheduling  
* Session start  
* Session completion  
* Cancellation

---

## **Expected Growth**

One document per consultation.

The collection grows with every consultation conducted on the platform.

---

## **Document Size**

Small to medium (approximately 2–4 KB).

---

## **Design Decisions**

* One consultation per acquisition pipeline.  
* Scheduling information is embedded as a value object.  
* Cancellation details are embedded because they have no independent lifecycle.  
* Meeting provider metadata is isolated inside `meetingDetails`.  
* Consultation lifecycle is independent from the Video Session domain.  
* Consultation acts as the business record, while the Video Session domain manages the actual WebRTC session and technical connection details.

---

# **19\. Example Document**

{  
  "\_id": "68684af75c4e8f12ab123456",  
  "acquisitionPipelineId": "68682df75c4e8f12ab987654",  
  "clientId": "68652b7f5c4e8f12ab111111",  
  "trainerId": "68652b7f5c4e8f12ab222222",  
  "slot": {  
    "scheduledStartAt": "2026-07-05T09:00:00.000Z",  
    "scheduledEndAt": "2026-07-05T09:45:00.000Z",  
    "timezone": "Asia/Kolkata"  
  },  
  "platform": "WEBRTC",  
  "roomId": "consultation\_room\_9F4D72",  
  "meetingUrl": "https://app.kizunafit.com/consultation/consultation\_room\_9F4D72",  
  "meetingDetails": {},  
  "status": "SCHEDULED",  
  "completedAt": null,  
  "cancellation": null,  
  "createdAt": "2026-07-02T10:15:00.000Z",  
  "updatedAt": "2026-07-02T10:15:00.000Z"  
}

## **Design Review**

The `Consultation` aggregate is designed as the authoritative business record for scheduled meetings within the acquisition workflow. It maintains immutable participant relationships, encapsulates scheduling and cancellation as value objects, and cleanly separates business concerns from the technical WebRTC implementation, which belongs to the Video Session domain. This design aligns with the approved acquisition lifecycle and preserves historical consultation records for reporting, auditing, and downstream coaching processes.

---

 

# **CoachingOffer**

---

# **1\. Purpose**

The **CoachingOffer** collection represents the official coaching proposal sent by a trainer to a client after a successful consultation.

It acts as a contractual proposal before payment and defines exactly what coaching services will be delivered if accepted.

This collection is responsible for:

* Coaching proposal creation  
* Scope definition  
* Pricing  
* Duration  
* Offer expiration  
* Client acceptance or rejection  
* Offer version history

It does **not** manage payments, coaching relationships, workout plans, or nutrition plans. Those belong to their respective domains. The CoachingOffer aggregate owns only the commercial proposal.

---

# **2\. Collection**

| Property | Value |
| ----- | ----- |
| Collection Name | `coachingOffers` |
| Aggregate Root | CoachingOffer |
| Owner Domain | Offer |
| Parent Aggregate | AcquisitionPipeline |
| MongoDB Collection | coachingOffers |
| Soft Delete | No |
| Historical Records | Permanent |
| Ownership | One AcquisitionPipeline → Multiple Offer Versions |

---

# **3\. Mongoose Model Name**

CoachingOffer

Export

export const CoachingOfferModel

---

# **4\. TypeScript Interfaces**

## **Enums**

CoachingOfferStatus  
Currency  
BillingCycle

---

## **Embedded Interfaces**

Pricing  
CoachingScope  
OfferValidity

---

## **Base Interface**

CoachingOffer

---

## **Document Interface**

CoachingOfferDocument

Extends

HydratedDocument\<CoachingOffer\>

---

## **Model Interface**

CoachingOfferModel

Extends

Model\<CoachingOffer\>

---

## **Query Helper Interface**

CoachingOfferQueryHelpers

---

# **5\. Enums**

## **CoachingOfferStatus**

DRAFT

SENT

ACCEPTED

DECLINED

EXPIRED

CANCELLED

---

## **Currency**

INR

USD

EUR

GBP

---

## **BillingCycle**

ONE\_TIME

MONTHLY

QUARTERLY

---

# **6\. Embedded Schemas**

## **Pricing**

| Field | Type |
| ----- | ----- |
| amount | Number |
| currency | Currency |
| billingCycle | BillingCycle |

Purpose

Defines the commercial pricing of the coaching offer.

---

## **CoachingScope**

| Field | Type |
| ----- | ----- |
| workoutIncluded | Boolean |
| nutritionIncluded | Boolean |
| chatSupport | Boolean |
| videoConsultations | Number |
| progressReviews | Number |

Purpose

Defines exactly what services are included.

---

## **OfferValidity**

| Field | Type |
| ----- | ----- |
| validFrom | Date |
| expiresAt | Date |

Purpose

Defines the period during which the offer can be accepted.

Reason for embedding

Pricing, scope, and validity are value objects with no independent lifecycle.

---

# **7\. Main Schema**

| Field | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| \_id | ObjectId | ✓ | Primary Key |
| acquisitionPipelineId | ObjectId | ✓ | Reference → AcquisitionPipeline |
| consultationId | ObjectId | ✓ | Reference → Consultation |
| trainerId | ObjectId | ✓ | Reference → User |
| clientId | ObjectId | ✓ | Reference → User |
| version | Number | ✓ | Offer version |
| title | String | ✓ | Offer title |
| description | String | ✓ | Offer description |
| durationWeeks | Number | ✓ | Coaching duration |
| pricing | Pricing | ✓ | Pricing information |
| scope | CoachingScope | ✓ | Included services |
| validity | OfferValidity | ✓ | Offer validity |
| status | CoachingOfferStatus | ✓ | Offer lifecycle |
| acceptedAt | Date | null | No | Acceptance timestamp |
| declinedAt | Date | null | No | Decline timestamp |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

---

# **8\. Validation**

## **Required**

* acquisitionPipelineId  
* consultationId  
* trainerId  
* clientId  
* version  
* title  
* description  
* durationWeeks  
* pricing  
* scope  
* validity  
* status

---

## **Participants**

* Trainer must have role `TRAINER`.  
* Client must have role `CLIENT`.

---

## **Version**

* Starts at **1**.  
* Must increase sequentially.  
* Immutable after creation.

---

## **Duration**

* Greater than zero.  
* Maximum configurable.

---

## **Pricing**

* Amount must be positive.  
* Currency required.  
* Billing cycle required.

---

## **Validity**

* `validFrom < expiresAt`  
* Cannot already be expired when sent.

---

## **Status**

Must follow the approved Offer state machine.

---

# **9\. Indexes**

## **Single Indexes**

trainerId

clientId

status

createdAt

---

## **Compound Indexes**

acquisitionPipelineId \+ version

trainerId \+ status

clientId \+ status

status \+ validity.expiresAt

Useful for

* Offer history  
* Pending offers  
* Expiring offers  
* Client dashboard

---

# **10\. Virtuals**

## **id**

\_id → id

---

## **isExpired**

Returns

validity.expiresAt \<= now

---

## **isPending**

Returns

status \=== SENT

---

## **totalPrice**

Returns

pricing.amount

---

## **canBeAccepted**

Returns

status \=== SENT

AND

validity.expiresAt \> now

---

# **11\. Middleware**

## **Pre Validate**

* Trim strings.  
* Validate pricing.  
* Validate validity period.

---

## **Pre Save**

* Validate version sequence.  
* Prevent modification of version.  
* Validate state transition.

---

## **Post Save**

None.

Creating payments or coaching relationships belongs to the service layer.

---

# **12\. Instance Methods**

send()

accept()

decline()

cancel()

expire()

isExpired()

canBeAccepted()

---

# **13\. Static Methods**

findLatest()

findPending()

findAccepted()

findExpired()

findByPipeline()

findOfferHistory()

---

# **14\. Query Helpers**

.pending()

.accepted()

.expired()

.byTrainer()

.byClient()

.latest()

Example

CoachingOfferModel.find()  
    .pending()  
    .byClient(clientId);

---

# **15\. Immutable Fields**

Immutable

acquisitionPipelineId

consultationId

trainerId

clientId

version

createdAt

Mutable

status

acceptedAt

declinedAt

updatedAt

Reason

Each offer version represents a historical proposal and must never change after being issued.

---

# **16\. Serialization**

Hide

\_\_v

Expose

id

acquisitionPipelineId

consultationId

trainerId

clientId

version

title

description

durationWeeks

pricing

scope

validity

status

acceptedAt

declinedAt

createdAt

updatedAt

Convert

\_id → id

Remove

\_\_v

---

# **17\. Plugins**

Recommended Plugins

Serialization Plugin

Audit Plugin

Optimistic Concurrency Plugin

Do **not** use

Soft Delete Plugin

Reason

Offers are legal/commercial records. Even declined or expired offers should remain available for auditing, reporting, and historical pricing analysis.

---

# **18\. Performance Notes**

## **Read Patterns**

Most common lookups

* Client offers  
* Trainer offers  
* Pending offers  
* Offer history  
* Latest offer version

---

## **Write Frequency**

Low

Occurs during

* Offer creation  
* Offer revision  
* Offer acceptance  
* Offer expiration

---

## **Expected Growth**

Multiple offers may exist for one acquisition pipeline due to revisions.

---

## **Document Size**

Medium (approximately 2–5 KB).

---

## **Design Decisions**

* Supports versioned commercial proposals.  
* Pricing and scope are embedded immutable value objects.  
* Historical offer versions are preserved.  
* Acceptance creates a Payment, not a CoachingRelationship directly.  
* Commercial negotiations remain independent of coaching execution.  
* The offer becomes the pricing snapshot for the Payment and Coaching Relationship domains after acceptance.

---

# **19\. Example Document**

{  
  "\_id": "68685ff75c4e8f12ab123456",  
  "acquisitionPipelineId": "68682df75c4e8f12ab987654",  
  "consultationId": "68684af75c4e8f12ab654321",  
  "trainerId": "68652b7f5c4e8f12ab222222",  
  "clientId": "68652b7f5c4e8f12ab111111",  
  "version": 1,  
  "title": "12 Week Muscle Building Program",  
  "description": "Personalized workout, nutrition guidance, weekly progress reviews, and unlimited chat support.",  
  "durationWeeks": 12,  
  "pricing": {  
    "amount": 12000,  
    "currency": "INR",  
    "billingCycle": "ONE\_TIME"  
  },  
  "scope": {  
    "workoutIncluded": true,  
    "nutritionIncluded": true,  
    "chatSupport": true,  
    "videoConsultations": 4,  
    "progressReviews": 12  
  },  
  "validity": {  
    "validFrom": "2026-07-02T12:00:00.000Z",  
    "expiresAt": "2026-07-09T12:00:00.000Z"  
  },  
  "status": "SENT",  
  "acceptedAt": null,  
  "declinedAt": null,  
  "createdAt": "2026-07-02T12:00:00.000Z",  
  "updatedAt": "2026-07-02T12:00:00.000Z"  
}

## **Design Review**

The `CoachingOffer` aggregate serves as the commercial contract proposal within the acquisition workflow. It encapsulates pricing, scope, and validity as immutable value objects while preserving every offer version for historical accuracy. By separating commercial negotiations from payments and coaching execution, this design maintains clear domain boundaries and provides immutable pricing snapshots for downstream Payment and Coaching Relationship aggregates.

---

 

# **Payment**

---

# **1\. Purpose**

The **Payment** collection records every financial transaction made by a client for a coaching offer.

It acts as the financial source of truth between an accepted coaching offer and the creation of a coaching relationship.

This collection is responsible for:

* Payment processing  
* Payment verification  
* Payment status tracking  
* Transaction history  
* Gateway response storage  
* Financial audit trail  
* Payment snapshot preservation

It does **not** manage coaching services, subscriptions, invoices, or refunds. Those belong to their respective domains. The Payment aggregate owns only the payment transaction.

---

# **2\. Collection**

| Property | Value |
| ----- | ----- |
| Collection Name | `payments` |
| Aggregate Root | Payment |
| Owner Domain | Payment |
| Parent Aggregate | CoachingOffer |
| MongoDB Collection | payments |
| Soft Delete | No |
| Historical Records | Permanent |
| Ownership | One CoachingOffer → One Successful Payment |

---

# **3\. Mongoose Model Name**

Payment

Export

export const PaymentModel

---

# **4\. TypeScript Interfaces**

## **Enums**

PaymentStatus  
PaymentMethod  
PaymentGateway  
Currency

---

## **Embedded Interfaces**

PaymentSnapshot  
GatewayTransaction

---

## **Base Interface**

Payment

---

## **Document Interface**

PaymentDocument

Extends

HydratedDocument\<Payment\>

---

## **Model Interface**

PaymentModel

Extends

Model\<Payment\>

---

## **Query Helper Interface**

PaymentQueryHelpers

---

# **5\. Enums**

## **PaymentStatus**

PENDING

PROCESSING

SUCCESS

FAILED

CANCELLED

REFUNDED

---

## **PaymentMethod**

UPI

CARD

NET\_BANKING

WALLET

BANK\_TRANSFER

---

## **PaymentGateway**

RAZORPAY

STRIPE

---

## **Currency**

INR

USD

EUR

GBP

---

# **6\. Embedded Schemas**

## **PaymentSnapshot**

| Field | Type |
| ----- | ----- |
| offerTitle | String |
| trainerName | String |
| durationWeeks | Number |
| amount | Number |
| currency | Currency |

Purpose

Stores an immutable snapshot of the accepted coaching offer.

---

## **GatewayTransaction**

| Field | Type |
| ----- | ----- |
| gatewayOrderId | String |
| gatewayPaymentId | String |
| gatewaySignature | String |
| paidAt | Date |
| gatewayResponse | Mixed |

Purpose

Stores payment gateway metadata required for verification and auditing.

Reason for embedding

Gateway data belongs exclusively to the payment transaction and has no independent lifecycle.

---

# **7\. Main Schema**

| Field | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| \_id | ObjectId | ✓ | Primary Key |
| coachingOfferId | ObjectId | ✓ | Reference → CoachingOffer |
| acquisitionPipelineId | ObjectId | ✓ | Reference → AcquisitionPipeline |
| clientId | ObjectId | ✓ | Reference → User |
| trainerId | ObjectId | ✓ | Reference → User |
| paymentSnapshot | PaymentSnapshot | ✓ | Immutable offer snapshot |
| paymentMethod | PaymentMethod | ✓ | Payment method |
| paymentGateway | PaymentGateway | ✓ | Gateway provider |
| gatewayTransaction | GatewayTransaction | ✓ | Gateway metadata |
| status | PaymentStatus | ✓ | Payment lifecycle |
| amount | Number | ✓ | Paid amount |
| currency | Currency | ✓ | Transaction currency |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

---

# **8\. Validation**

## **Required**

* coachingOfferId  
* acquisitionPipelineId  
* clientId  
* trainerId  
* paymentSnapshot  
* paymentMethod  
* paymentGateway  
* gatewayTransaction  
* status  
* amount  
* currency

---

## **Amount**

* Greater than zero.  
* Must exactly match the accepted offer.

---

## **Currency**

* Must match the offer currency.

---

## **Gateway IDs**

* Required after payment initiation.  
* Must be unique.

---

## **Payment Snapshot**

* Immutable.  
* Represents the accepted commercial agreement.

---

## **Status**

Must follow the approved Payment state machine.

Only verified gateway callbacks may transition a payment to `SUCCESS`.

---

# **9\. Indexes**

## **Unique**

gatewayTransaction.gatewayOrderId

gatewayTransaction.gatewayPaymentId

---

## **Single Indexes**

clientId

trainerId

status

createdAt

---

## **Compound Indexes**

coachingOfferId \+ status

clientId \+ status

trainerId \+ status

status \+ createdAt

Useful for

* Payment history  
* Revenue reports  
* Financial auditing  
* Dashboard summaries

---

# **10\. Virtuals**

## **id**

\_id → id

---

## **isSuccessful**

Returns

status \=== SUCCESS

---

## **isPending**

Returns

status \=== PENDING

---

## **isRefunded**

Returns

status \=== REFUNDED

---

## **isCompleted**

Returns

status \=== SUCCESS || status \=== REFUNDED

---

# **11\. Middleware**

## **Pre Validate**

* Validate payment amount.  
* Validate gateway metadata.

---

## **Pre Save**

* Prevent modification of payment snapshot.  
* Validate payment status transitions.  
* Validate gateway identifiers.

---

## **Post Save**

None.

Creating the CoachingRelationship after successful payment belongs to the service layer.

---

# **12\. Instance Methods**

markProcessing()

markSuccessful()

markFailed()

markCancelled()

markRefunded()

isSuccessful()

verifyGatewaySignature()

---

# **13\. Static Methods**

findSuccessful()

findPending()

findFailed()

findByGatewayOrderId()

findRevenue()

findByTrainer()

---

# **14\. Query Helpers**

.successful()

.pending()

.failed()

.byClient()

.byTrainer()

.byStatus()

Example

PaymentModel.find()  
    .successful()  
    .byTrainer(trainerId);

---

# **15\. Immutable Fields**

Immutable

coachingOfferId

acquisitionPipelineId

clientId

trainerId

paymentSnapshot

amount

currency

paymentMethod

paymentGateway

createdAt

Mutable

status

gatewayTransaction

updatedAt

Reason

A completed financial transaction must remain historically accurate and legally auditable.

---

# **16\. Serialization**

Hide

gatewayTransaction.gatewaySignature

\_\_v

Expose

id

coachingOfferId

acquisitionPipelineId

clientId

trainerId

paymentSnapshot

paymentMethod

paymentGateway

gatewayTransaction

status

amount

currency

createdAt

updatedAt

Convert

\_id → id

Remove

\_\_v

---

# **17\. Plugins**

Recommended Plugins

Serialization Plugin

Audit Plugin

Optimistic Concurrency Plugin

Do **not** use

Soft Delete Plugin

Reason

Financial transactions are permanent legal records. Even failed, cancelled, or refunded payments must remain available for compliance, auditing, accounting, and dispute resolution.

---

# **18\. Performance Notes**

## **Read Patterns**

Most common lookups

* Client payment history  
* Trainer earnings  
* Revenue reports  
* Successful payments  
* Gateway reconciliation

---

## **Write Frequency**

Medium

Occurs during

* Payment initiation  
* Gateway callbacks  
* Verification  
* Refund processing

---

## **Expected Growth**

One document per payment transaction.

The collection grows continuously and serves as the permanent financial ledger of the platform.

---

## **Document Size**

Medium (approximately 3–6 KB).

---

## **Design Decisions**

* One payment per accepted coaching offer.  
* Immutable payment snapshot preserves the commercial agreement at the time of purchase.  
* Gateway metadata is embedded because it belongs exclusively to the payment.  
* Successful payments trigger the creation of a CoachingRelationship.  
* Financial records are never modified except for lifecycle transitions such as refunds.  
* This aggregate is the financial source of truth for all downstream coaching operations.

---

# **19\. Example Document**

{  
  "\_id": "686874aa5c4e8f12ab123456",  
  "coachingOfferId": "68685ff75c4e8f12ab987654",  
  "acquisitionPipelineId": "68682df75c4e8f12ab654321",  
  "clientId": "68652b7f5c4e8f12ab111111",  
  "trainerId": "68652b7f5c4e8f12ab222222",  
  "paymentSnapshot": {  
    "offerTitle": "12 Week Muscle Building Program",  
    "trainerName": "John Doe",  
    "durationWeeks": 12,  
    "amount": 12000,  
    "currency": "INR"  
  },  
  "paymentMethod": "UPI",  
  "paymentGateway": "RAZORPAY",  
  "gatewayTransaction": {  
    "gatewayOrderId": "order\_Q8J2L9XXXX",  
    "gatewayPaymentId": "pay\_Q8J3F1XXXX",  
    "gatewaySignature": "\*\*\*\*\*\*",  
    "paidAt": "2026-07-02T14:15:00.000Z",  
    "gatewayResponse": {}  
  },  
  "status": "SUCCESS",  
  "amount": 12000,  
  "currency": "INR",  
  "createdAt": "2026-07-02T14:10:00.000Z",  
  "updatedAt": "2026-07-02T14:15:00.000Z"  
}

## **Design Review**

The `Payment` aggregate is the financial authority of the platform, bridging commercial offers and active coaching relationships. By preserving immutable snapshots of the accepted offer and embedding gateway transaction metadata, it guarantees financial consistency, auditability, and legal traceability. The design cleanly separates payment processing from coaching execution, allowing downstream domains to rely on verified payment records without coupling business logic to external payment gateways.

---

 

# **CoachingRelationship**

---

# **1\. Purpose**

The **CoachingRelationship** collection represents the official coaching engagement between a trainer and a client after a successful payment.

It is the central aggregate of the **Coaching Domain**, serving as the foundation for all coaching activities such as workout programs, nutrition plans, progress evaluations, messaging, reviews, and video sessions.

This collection is responsible for:

* Active coaching relationship  
* Coaching lifecycle  
* Coaching duration  
* Client assignment  
* Trainer assignment  
* Coaching status  
* Relationship snapshots  
* Coaching termination

It does **not** store workouts, nutrition plans, progress logs, messages, or reviews. Those belong to their respective domains. The CoachingRelationship aggregate owns only the coaching contract.

---

# **2\. Collection**

| Property | Value |
| ----- | ----- |
| Collection Name | `coachingRelationships` |
| Aggregate Root | CoachingRelationship |
| Owner Domain | Coaching |
| Parent Aggregate | Payment |
| MongoDB Collection | coachingRelationships |
| Soft Delete | No |
| Historical Records | Permanent |
| Ownership | One Successful Payment → One CoachingRelationship |

---

# **3\. Mongoose Model Name**

CoachingRelationship

Export

export const CoachingRelationshipModel

---

# **4\. TypeScript Interfaces**

## **Enums**

CoachingRelationshipStatus  
RelationshipTerminationReason

---

## **Embedded Interfaces**

TrainerSnapshot  
ClientSnapshot  
CoachingDuration  
PricingSnapshot  
RelationshipTermination

---

## **Base Interface**

CoachingRelationship

---

## **Document Interface**

CoachingRelationshipDocument

Extends

HydratedDocument\<CoachingRelationship\>

---

## **Model Interface**

CoachingRelationshipModel

Extends

Model\<CoachingRelationship\>

---

## **Query Helper Interface**

CoachingRelationshipQueryHelpers

---

# **5\. Enums**

## **CoachingRelationshipStatus**

ACTIVE

PAUSED

COMPLETED

CANCELLED

EXPIRED

---

## **RelationshipTerminationReason**

PROGRAM\_COMPLETED

CLIENT\_CANCELLED

TRAINER\_CANCELLED

ADMIN\_TERMINATED

PAYMENT\_REFUNDED

POLICY\_VIOLATION

OTHER

---

# **6\. Embedded Schemas**

## **CoachingDuration**

| Field | Type |
| ----- | ----- |
| startsAt | Date |
| endsAt | Date |

Purpose

Defines the official coaching period.

---

## **TrainerSnapshot**

| Field | Type |
| ----- | ----- |
| trainerId | ObjectId |
| fullName | String |
| headline | String |

Purpose

Preserves trainer information at the time coaching begins.

---

## **ClientSnapshot**

| Field | Type |
| ----- | ----- |
| clientId | ObjectId |
| fullName | String |

Purpose

Preserves client identity at coaching start.

---

## **PricingSnapshot**

| Field | Type |
| ----- | ----- |
| amount | Number |
| currency | String |
| durationWeeks | Number |

Purpose

Stores the accepted commercial agreement.

---

## **RelationshipTermination**

| Field | Type |
| ----- | ----- |
| terminatedAt | Date |
| reason | RelationshipTerminationReason |
| notes | String |

Purpose

Stores termination details.

Reason for embedding

These are immutable value objects that exist only within the coaching relationship.

---

# **7\. Main Schema**

| Field | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| \_id | ObjectId | ✓ | Primary Key |
| paymentId | ObjectId | ✓ | Reference → Payment |
| coachingOfferId | ObjectId | ✓ | Reference → CoachingOffer |
| acquisitionPipelineId | ObjectId | ✓ | Reference → AcquisitionPipeline |
| trainerId | ObjectId | ✓ | Reference → User |
| clientId | ObjectId | ✓ | Reference → User |
| trainerSnapshot | TrainerSnapshot | ✓ | Immutable trainer snapshot |
| clientSnapshot | ClientSnapshot | ✓ | Immutable client snapshot |
| pricingSnapshot | PricingSnapshot | ✓ | Immutable pricing snapshot |
| duration | CoachingDuration | ✓ | Coaching period |
| status | CoachingRelationshipStatus | ✓ | Coaching lifecycle |
| termination | RelationshipTermination | null | No | Termination details |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

---

# **8\. Validation**

## **Required**

* paymentId  
* coachingOfferId  
* acquisitionPipelineId  
* trainerId  
* clientId  
* trainerSnapshot  
* clientSnapshot  
* pricingSnapshot  
* duration  
* status

---

## **References**

* Payment must be `SUCCESS`.  
* CoachingOffer must be `ACCEPTED`.  
* Client role must be `CLIENT`.  
* Trainer role must be `TRAINER`.

---

## **Duration**

* `startsAt < endsAt`  
* Cannot overlap another active relationship between the same client and trainer unless explicitly allowed.

---

## **Snapshots**

* Immutable after creation.  
* Represent the coaching agreement at activation.

---

## **Status**

Must follow the approved Coaching state machine.

---

# **9\. Indexes**

## **Unique**

paymentId

---

## **Single Indexes**

trainerId

clientId

status

duration.endsAt

---

## **Compound Indexes**

trainerId \+ status

clientId \+ status

status \+ duration.endsAt

trainerId \+ clientId

Useful for

* Active coaching dashboard  
* Trainer client list  
* Client active coach  
* Expiring coaching relationships

---

# **10\. Virtuals**

## **id**

\_id → id

---

## **isActive**

Returns

status \=== ACTIVE

---

## **isExpired**

Returns

duration.endsAt \< now

---

## **remainingDays**

Calculated from

duration.endsAt

---

## **canReceivePrograms**

Returns

status \=== ACTIVE

---

# **11\. Middleware**

## **Pre Validate**

* Validate duration.  
* Validate snapshots.

---

## **Pre Save**

* Validate successful payment.  
* Validate status transitions.  
* Prevent snapshot modification.

---

## **Post Save**

None.

Workout creation, nutrition plans, messaging, and evaluations belong to their own domains.

---

# **12\. Instance Methods**

activate()

pause()

resume()

complete()

cancel()

expire()

terminate()

isActive()

---

# **13\. Static Methods**

findActive()

findByTrainer()

findByClient()

findExpiring()

findCompleted()

findByPayment()

---

# **14\. Query Helpers**

.active()

.completed()

.expired()

.byTrainer()

.byClient()

.expiringSoon()

Example

CoachingRelationshipModel.find()  
    .active()  
    .byTrainer(trainerId);

---

# **15\. Immutable Fields**

Immutable

paymentId

coachingOfferId

acquisitionPipelineId

trainerId

clientId

trainerSnapshot

clientSnapshot

pricingSnapshot

createdAt

Mutable

status

termination

duration

updatedAt

Reason

The commercial agreement and participating users must never change once coaching begins.

---

# **16\. Serialization**

Hide

\_\_v

Expose

id

paymentId

coachingOfferId

acquisitionPipelineId

trainerId

clientId

trainerSnapshot

clientSnapshot

pricingSnapshot

duration

status

termination

createdAt

updatedAt

Convert

\_id → id

Remove

\_\_v

---

# **17\. Plugins**

Recommended Plugins

Serialization Plugin

Audit Plugin

Optimistic Concurrency Plugin

Do **not** use

Soft Delete Plugin

Reason

A coaching relationship represents a permanent business agreement. Even after completion or cancellation, it remains part of the client's coaching history and serves as the parent aggregate for workouts, nutrition plans, progress evaluations, reviews, and messages. Deleting it would break historical consistency.

---

# **18\. Performance Notes**

## **Read Patterns**

Most common lookups

* Active clients  
* Active trainers  
* Coaching dashboard  
* Expiring relationships  
* Coaching history

---

## **Write Frequency**

Low

Occurs during

* Relationship creation  
* Pause/resume  
* Completion  
* Cancellation

---

## **Expected Growth**

One document per completed coaching purchase.

This collection becomes one of the core business aggregates and grows steadily throughout the platform's lifetime.

---

## **Document Size**

Medium (approximately 3–5 KB).

---

## **Design Decisions**

* One coaching relationship per successful payment.  
* Immutable trainer, client, and pricing snapshots preserve historical accuracy.  
* Serves as the parent aggregate for Workout, Nutrition, Progress, Communication, Review, and Video Session domains.  
* Financial information is referenced through Payment while preserving essential pricing details as snapshots.  
* Designed for long-term historical reporting and analytics.

---

# **19\. Example Document**

{  
  "\_id": "686892aa5c4e8f12ab123456",  
  "paymentId": "686874aa5c4e8f12ab654321",  
  "coachingOfferId": "68685ff75c4e8f12ab987654",  
  "acquisitionPipelineId": "68682df75c4e8f12ab111111",  
  "trainerId": "68652b7f5c4e8f12ab222222",  
  "clientId": "68652b7f5c4e8f12ab333333",  
  "trainerSnapshot": {  
    "trainerId": "68652b7f5c4e8f12ab222222",  
    "fullName": "John Doe",  
    "headline": "Strength Coach"  
  },  
  "clientSnapshot": {  
    "clientId": "68652b7f5c4e8f12ab333333",  
    "fullName": "Mohammed Nihal K"  
  },  
  "pricingSnapshot": {  
    "amount": 12000,  
    "currency": "INR",  
    "durationWeeks": 12  
  },  
  "duration": {  
    "startsAt": "2026-07-03T00:00:00.000Z",  
    "endsAt": "2026-09-25T23:59:59.000Z"  
  },  
  "status": "ACTIVE",  
  "termination": null,  
  "createdAt": "2026-07-03T00:00:00.000Z",  
  "updatedAt": "2026-07-03T00:00:00.000Z"  
}

## **Design Review**

The `CoachingRelationship` aggregate is the cornerstone of the Coaching Domain. It establishes the official contractual relationship between a trainer and a client after verified payment, while preserving immutable snapshots of the participants and commercial agreement. By acting as the parent aggregate for workouts, nutrition plans, progress evaluations, communication, reviews, and video sessions, it provides a stable foundation for the entire coaching lifecycle without coupling those domains into a single document. This aligns with the approved domain architecture and long-term scalability goals.

---

 

# **Exercise**

---

# **1\. Purpose**

The **Exercise** collection is the master catalog of all exercises available on the platform.

It serves as the canonical source of exercise definitions that trainers use when creating workout programs.

This collection is responsible for:

* Exercise library  
* Exercise metadata  
* Muscle group classification  
* Equipment classification  
* Difficulty classification  
* Exercise instructions  
* Media references  
* Exercise search and filtering

It does **not** store workout prescriptions, repetitions, sets, client progress, or completion data. Those belong to the Workout Domain. The Exercise aggregate owns only the reusable exercise definition.

---

# **2\. Collection**

| Property | Value |
| ----- | ----- |
| Collection Name | `exercises` |
| Aggregate Root | Exercise |
| Owner Domain | Workout |
| Parent Aggregate | None |
| MongoDB Collection | exercises |
| Soft Delete | No |
| Historical Records | Permanent |
| Ownership | Platform-owned |

---

# **3\. Mongoose Model Name**

Exercise

Export

export const ExerciseModel

---

# **4\. TypeScript Interfaces**

## **Enums**

ExerciseCategory  
PrimaryMuscleGroup  
SecondaryMuscleGroup  
EquipmentType  
DifficultyLevel  
ExerciseStatus

---

## **Embedded Interfaces**

ExerciseInstruction  
ExerciseMedia

---

## **Base Interface**

Exercise

---

## **Document Interface**

ExerciseDocument

Extends

HydratedDocument\<Exercise\>

---

## **Model Interface**

ExerciseModel

Extends

Model\<Exercise\>

---

## **Query Helper Interface**

ExerciseQueryHelpers

---

# **5\. Enums**

## **ExerciseCategory**

STRENGTH

CARDIO

FLEXIBILITY

MOBILITY

BALANCE

PLYOMETRIC

---

## **PrimaryMuscleGroup**

CHEST

BACK

SHOULDERS

BICEPS

TRICEPS

LEGS

GLUTES

CORE

FULL\_BODY

---

## **SecondaryMuscleGroup**

Uses the same values as **PrimaryMuscleGroup**.

---

## **EquipmentType**

BODYWEIGHT

DUMBBELL

BARBELL

KETTLEBELL

MACHINE

CABLE

RESISTANCE\_BAND

MEDICINE\_BALL

OTHER

---

## **DifficultyLevel**

BEGINNER

INTERMEDIATE

ADVANCED

---

## **ExerciseStatus**

ACTIVE

DEPRECATED

---

# **6\. Embedded Schemas**

## **ExerciseInstruction**

| Field | Type |
| ----- | ----- |
| stepNumber | Number |
| instruction | String |

Purpose

Stores ordered execution steps.

---

## **ExerciseMedia**

| Field | Type |
| ----- | ----- |
| thumbnailUrl | String |
| imageUrls | String\[\] |
| videoUrl | String |

Purpose

Stores exercise media.

Reason for embedding

Instructions and media belong exclusively to the exercise definition.

---

# **7\. Main Schema**

| Field | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| \_id | ObjectId | ✓ | Primary Key |
| name | String | ✓ | Exercise name |
| slug | String | ✓ | URL-friendly identifier |
| category | ExerciseCategory | ✓ | Exercise type |
| primaryMuscleGroup | PrimaryMuscleGroup | ✓ | Main muscle |
| secondaryMuscleGroups | SecondaryMuscleGroup\[\] | No | Supporting muscles |
| equipment | EquipmentType | ✓ | Required equipment |
| difficulty | DifficultyLevel | ✓ | Difficulty |
| instructions | ExerciseInstruction\[\] | ✓ | Execution guide |
| media | ExerciseMedia | No | Images and videos |
| caloriesPerMinute | Number | No | Estimated calories |
| status | ExerciseStatus | ✓ | Availability |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

---

# **8\. Validation**

## **Required**

* name  
* slug  
* category  
* primaryMuscleGroup  
* equipment  
* difficulty  
* instructions  
* status

---

## **Name**

* Unique  
* Trimmed  
* Maximum length configurable

---

## **Slug**

* Unique  
* Lowercase  
* URL-safe  
* Immutable

---

## **Instructions**

* Minimum one step  
* Ordered sequentially

---

## **Media URLs**

* HTTPS URLs only

---

## **Calories**

* Greater than or equal to zero

---

# **9\. Indexes**

## **Unique**

name

slug

---

## **Single Indexes**

category

primaryMuscleGroup

equipment

difficulty

status

---

## **Compound Indexes**

category \+ difficulty

primaryMuscleGroup \+ difficulty

equipment \+ difficulty

status \+ category

Useful for

* Exercise search  
* Workout builder  
* Marketplace filtering

---

# **10\. Virtuals**

## **id**

\_id → id

---

## **hasVideo**

Returns

media.videoUrl \!= null

---

## **isBodyweight**

Returns

equipment \=== BODYWEIGHT

---

## **isActive**

Returns

status \=== ACTIVE

---

# **11\. Middleware**

## **Pre Validate**

* Trim strings  
* Generate slug if missing

---

## **Pre Save**

* Ensure slug uniqueness  
* Validate instruction order

---

## **Post Save**

None.

Search indexing belongs to the service layer.

---

# **12\. Instance Methods**

isActive()

hasVideo()

generateSlug()

addInstruction()

removeInstruction()

---

# **13\. Static Methods**

findBySlug()

findByCategory()

findByMuscleGroup()

findBodyweight()

findActive()

---

# **14\. Query Helpers**

.active()

.byCategory()

.byDifficulty()

.byEquipment()

.byMuscleGroup()

Example

ExerciseModel.find()  
    .active()  
    .byCategory(ExerciseCategory.STRENGTH);

---

# **15\. Immutable Fields**

Immutable

slug

createdAt

Mutable

* Instructions  
* Media  
* Status  
* Calories

Reason

The exercise identity should remain stable while educational content can evolve.

---

# **16\. Serialization**

Hide

\_\_v

Expose

id

name

slug

category

primaryMuscleGroup

secondaryMuscleGroups

equipment

difficulty

instructions

media

caloriesPerMinute

status

createdAt

updatedAt

Convert

\_id → id

Remove

\_\_v

---

# **17\. Plugins**

Recommended Plugins

Serialization Plugin

Slug Plugin

Audit Plugin

Optimistic Concurrency Plugin

Do **not** use

Soft Delete Plugin

Reason

Exercises form the platform's master reference library. Instead of deleting exercises that may already be referenced by workout programs, they should transition to the `DEPRECATED` status to preserve referential integrity and historical workout data.

---

# **18\. Performance Notes**

## **Read Patterns**

Most common lookups

* Workout builder  
* Exercise search  
* Muscle group filtering  
* Equipment filtering

---

## **Write Frequency**

Very Low

Occurs during

* Admin exercise creation  
* Exercise updates  
* Library maintenance

---

## **Expected Growth**

A few hundred to a few thousand documents.

Designed as a reusable reference collection.

---

## **Document Size**

Small to medium (approximately 2–6 KB).

---

## **Design Decisions**

* Platform-managed exercise library.  
* Workout programs reference exercises instead of embedding complete exercise definitions.  
* Instructions and media are embedded because they are intrinsic to the exercise.  
* Deprecated exercises remain available for historical workout programs.  
* Optimized for read-heavy workloads with extensive filtering capabilities.

---

# **19\. Example Document**

{  
  "\_id": "6868b6aa5c4e8f12ab123456",  
  "name": "Push-Up",  
  "slug": "push-up",  
  "category": "STRENGTH",  
  "primaryMuscleGroup": "CHEST",  
  "secondaryMuscleGroups": \[  
    "TRICEPS",  
    "SHOULDERS",  
    "CORE"  
  \],  
  "equipment": "BODYWEIGHT",  
  "difficulty": "BEGINNER",  
  "instructions": \[  
    {  
      "stepNumber": 1,  
      "instruction": "Place your hands shoulder-width apart."  
    },  
    {  
      "stepNumber": 2,  
      "instruction": "Lower your body until your chest nearly touches the floor."  
    },  
    {  
      "stepNumber": 3,  
      "instruction": "Push back up to the starting position."  
    }  
  \],  
  "media": {  
    "thumbnailUrl": "https://cdn.kizunafit.com/exercises/push-up/thumb.jpg",  
    "imageUrls": \[  
      "https://cdn.kizunafit.com/exercises/push-up/1.jpg"  
    \],  
    "videoUrl": "https://cdn.kizunafit.com/exercises/push-up/demo.mp4"  
  },  
  "caloriesPerMinute": 8,  
  "status": "ACTIVE",  
  "createdAt": "2026-07-03T09:00:00.000Z",  
  "updatedAt": "2026-07-03T09:00:00.000Z"  
}

## **Design Review**

The `Exercise` aggregate functions as the platform's canonical exercise catalog, providing reusable definitions that can be referenced by countless workout programs without duplication. By separating exercise definitions from workout prescriptions and completion records, the design maintains clear aggregate boundaries, improves consistency, and allows the exercise library to evolve independently while preserving historical workout integrity.

---

 

# **WorkoutProgram**

---

# **1\. Purpose**

The **WorkoutProgram** collection represents a trainer-prescribed workout program created for a specific coaching relationship.

It serves as the authoritative prescription of exercises, training schedule, progression, and workout structure that the client is expected to follow during the coaching period.

This collection is responsible for:

* Workout prescription  
* Program versioning  
* Weekly workout schedule  
* Exercise prescriptions  
* Progression planning  
* Trainer notes  
* Program lifecycle

It does **not** store workout completion or performance data. Those belong to the **WorkoutCompletion** aggregate. The WorkoutProgram owns only the prescribed workout plan.

---

# **2\. Collection**

| Property | Value |
| ----- | ----- |
| Collection Name | `workoutPrograms` |
| Aggregate Root | WorkoutProgram |
| Owner Domain | Workout |
| Parent Aggregate | CoachingRelationship |
| MongoDB Collection | workoutPrograms |
| Soft Delete | No |
| Historical Records | Versioned |
| Ownership | One CoachingRelationship → Multiple Program Versions |

---

# **3\. Mongoose Model Name**

WorkoutProgram

Export

export const WorkoutProgramModel

---

# **4\. TypeScript Interfaces**

## **Enums**

WorkoutProgramStatus  
WorkoutGoal  
ExerciseType

---

## **Embedded Interfaces**

WorkoutDay

ExercisePrescription

ExerciseSnapshot

WorkoutSchedule

---

## **Base Interface**

WorkoutProgram

---

## **Document Interface**

WorkoutProgramDocument

Extends

HydratedDocument\<WorkoutProgram\>

---

## **Model Interface**

WorkoutProgramModel

Extends

Model\<WorkoutProgram\>

---

## **Query Helper Interface**

WorkoutProgramQueryHelpers

---

# **5\. Enums**

## **WorkoutProgramStatus**

DRAFT

ACTIVE

COMPLETED

ARCHIVED

---

## **WorkoutGoal**

MUSCLE\_GAIN

FAT\_LOSS

STRENGTH

ENDURANCE

GENERAL\_FITNESS

MOBILITY

---

## **ExerciseType**

MAIN

ACCESSORY

WARM\_UP

COOL\_DOWN

CARDIO

---

# **6\. Embedded Schemas**

## **ExerciseSnapshot**

| Field | Type |
| ----- | ----- |
| exerciseId | ObjectId |
| exerciseName | String |
| primaryMuscleGroup | String |
| equipment | String |

Purpose

Preserves the exercise definition at the time the workout program is created.

---

## **ExercisePrescription**

| Field | Type |
| ----- | ----- |
| order | Number |
| exercise | ExerciseSnapshot |
| type | ExerciseType |
| sets | Number |
| reps | String |
| durationSeconds | Number |
| restSeconds | Number |
| notes | String |

Purpose

Defines how an exercise should be performed.

---

## **WorkoutDay**

| Field | Type |
| ----- | ----- |
| dayNumber | Number |
| title | String |
| exercises | ExercisePrescription\[\] |

Purpose

Represents one training day.

---

## **WorkoutSchedule**

| Field | Type |
| ----- | ----- |
| weeks | Number |
| sessionsPerWeek | Number |

Purpose

Represents the overall workout schedule.

Reason for embedding

Workout days and exercise prescriptions cannot exist independently of a workout program.

---

# **7\. Main Schema**

| Field | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| \_id | ObjectId | ✓ | Primary Key |
| coachingRelationshipId | ObjectId | ✓ | Reference → CoachingRelationship |
| trainerId | ObjectId | ✓ | Reference → User |
| clientId | ObjectId | ✓ | Reference → User |
| version | Number | ✓ | Program version |
| title | String | ✓ | Program title |
| description | String | No | Program description |
| goal | WorkoutGoal | ✓ | Primary training goal |
| schedule | WorkoutSchedule | ✓ | Weekly schedule |
| workoutDays | WorkoutDay\[\] | ✓ | Prescribed workouts |
| status | WorkoutProgramStatus | ✓ | Program lifecycle |
| activatedAt | Date | No | Activation timestamp |
| completedAt | Date | No | Completion timestamp |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

---

# **8\. Validation**

## **Required**

* coachingRelationshipId  
* trainerId  
* clientId  
* version  
* title  
* goal  
* schedule  
* workoutDays  
* status

---

## **Version**

* Starts at **1**  
* Sequential  
* Immutable

---

## **Workout Days**

* At least one workout day  
* Day numbers must be unique  
* Ordered sequentially

---

## **Exercise Prescription**

* At least one exercise  
* Exercise snapshot required  
* Sets \> 0  
* Rest ≥ 0

---

## **Status**

Must follow the Workout Program state machine.

---

# **9\. Indexes**

## **Single Indexes**

trainerId

clientId

status

createdAt

---

## **Compound Indexes**

coachingRelationshipId \+ version

clientId \+ status

trainerId \+ status

status \+ activatedAt

Useful for

* Active programs  
* Program history  
* Trainer dashboard  
* Client dashboard

---

# **10\. Virtuals**

## **id**

\_id → id

---

## **totalWorkoutDays**

Returns

workoutDays.length

---

## **totalExercises**

Calculated from

All workoutDays.exercises

---

## **isActive**

Returns

status \=== ACTIVE

---

## **currentWeek**

Calculated from

activatedAt

---

# **11\. Middleware**

## **Pre Validate**

* Validate workout day ordering.  
* Validate exercise snapshots.

---

## **Pre Save**

* Prevent version modification.  
* Validate program structure.  
* Validate duplicate exercise ordering.

---

## **Post Save**

None.

Notifications belong to the service layer.

---

# **12\. Instance Methods**

activate()

archive()

complete()

calculateTotalExercises()

calculateWorkoutDays()

isActive()

---

# **13\. Static Methods**

findLatest()

findActive()

findByRelationship()

findByTrainer()

findHistory()

---

# **14\. Query Helpers**

.active()

.archived()

.byTrainer()

.byClient()

.latestVersion()

Example

WorkoutProgramModel.find()  
    .active()  
    .byClient(clientId);

---

# **15\. Immutable Fields**

Immutable

coachingRelationshipId

trainerId

clientId

version

createdAt

Mutable

status

activatedAt

completedAt

updatedAt

Reason

Each version represents a historical workout prescription and should never change after publication.

---

# **16\. Serialization**

Hide

\_\_v

Expose

id

coachingRelationshipId

trainerId

clientId

version

title

description

goal

schedule

workoutDays

status

activatedAt

completedAt

createdAt

updatedAt

Convert

\_id → id

Remove

\_\_v

---

# **17\. Plugins**

Recommended Plugins

Serialization Plugin

Audit Plugin

Optimistic Concurrency Plugin

Do **not** use

Soft Delete Plugin

Reason

Workout programs are permanent coaching prescriptions. Even after revisions or completion, previous versions must remain available for historical progress analysis, coaching audits, and client reference.

---

# **18\. Performance Notes**

## **Read Patterns**

Most common lookups

* Current active workout  
* Workout history  
* Client dashboard  
* Trainer dashboard

---

## **Write Frequency**

Low

Occurs during

* Program creation  
* Program revision  
* Program activation  
* Program completion

---

## **Expected Growth**

Multiple versions may exist for a single coaching relationship.

---

## **Document Size**

Medium to Large (approximately **10–50 KB** depending on the number of workout days and exercises).

---

## **Design Decisions**

* One program contains the complete workout prescription.  
* Exercise snapshots preserve historical accuracy even if the master Exercise changes.  
* Program versioning prevents overwriting historical prescriptions.  
* Workout completion data is intentionally excluded and stored in the `WorkoutCompletion` aggregate.  
* Read operations are optimized because the client typically loads the entire active program at once, making embedding workout days and exercise prescriptions the appropriate design choice.

---

# **19\. Example Document**

{  
  "\_id": "6868d5aa5c4e8f12ab123456",  
  "coachingRelationshipId": "686892aa5c4e8f12ab654321",  
  "trainerId": "68652b7f5c4e8f12ab222222",  
  "clientId": "68652b7f5c4e8f12ab333333",  
  "version": 1,  
  "title": "12 Week Muscle Gain Program",  
  "description": "Progressive overload focused hypertrophy program.",  
  "goal": "MUSCLE\_GAIN",  
  "schedule": {  
    "weeks": 12,  
    "sessionsPerWeek": 5  
  },  
  "workoutDays": \[  
    {  
      "dayNumber": 1,  
      "title": "Push Day",  
      "exercises": \[  
        {  
          "order": 1,  
          "exercise": {  
            "exerciseId": "6868b6aa5c4e8f12ab777777",  
            "exerciseName": "Push-Up",  
            "primaryMuscleGroup": "CHEST",  
            "equipment": "BODYWEIGHT"  
          },  
          "type": "MAIN",  
          "sets": 4,  
          "reps": "10-12",  
          "durationSeconds": null,  
          "restSeconds": 90,  
          "notes": "Control the eccentric phase."  
        }  
      \]  
    }  
  \],  
  "status": "ACTIVE",  
  "activatedAt": "2026-07-03T10:00:00.000Z",  
  "completedAt": null,  
  "createdAt": "2026-07-03T10:00:00.000Z",  
  "updatedAt": "2026-07-03T10:00:00.000Z"  
}

## **Design Review**

The `WorkoutProgram` aggregate is the authoritative workout prescription within the Coaching Domain. It embeds workout days and exercise prescriptions because they have no independent lifecycle outside the program, while preserving immutable exercise snapshots to ensure historical consistency. Versioning allows trainers to revise future programs without altering past prescriptions, and separating execution data into the `WorkoutCompletion` aggregate keeps prescription and observation concerns cleanly isolated. This follows the domain architecture and database design established for KizunaFit.

---

 

# **WorkoutCompletion**

---

# **1\. Purpose**

The **WorkoutCompletion** collection records a client's execution of a prescribed workout.

It represents the **observation layer** of the Workout Domain by capturing what the client actually completed, independent of the prescribed workout.

This collection is responsible for:

* Workout completion tracking  
* Exercise performance logging  
* Workout adherence  
* Completion history  
* Trainer review  
* Workout analytics

It does **not** modify the prescribed workout program. The WorkoutProgram remains immutable, while WorkoutCompletion records what actually happened during execution.

---

# **2\. Collection**

| Property | Value |
| ----- | ----- |
| Collection Name | `workoutCompletions` |
| Aggregate Root | WorkoutCompletion |
| Owner Domain | Workout |
| Parent Aggregate | CoachingRelationship |
| MongoDB Collection | workoutCompletions |
| Soft Delete | No |
| Historical Records | Permanent |
| Ownership | One CoachingRelationship → Many WorkoutCompletions |

---

# **3\. Mongoose Model Name**

WorkoutCompletion

Export

export const WorkoutCompletionModel

---

# **4\. TypeScript Interfaces**

## **Enums**

WorkoutCompletionStatus

WorkoutDifficulty

CompletionSource

---

## **Embedded Interfaces**

CompletedExercise

CompletedSet

WorkoutFeedback

---

## **Base Interface**

WorkoutCompletion

---

## **Document Interface**

WorkoutCompletionDocument

Extends

HydratedDocument\<WorkoutCompletion\>

---

## **Model Interface**

WorkoutCompletionModel

Extends

Model\<WorkoutCompletion\>

---

## **Query Helper Interface**

WorkoutCompletionQueryHelpers

---

# **5\. Enums**

## **WorkoutCompletionStatus**

IN\_PROGRESS

COMPLETED

SKIPPED

PARTIALLY\_COMPLETED

---

## **WorkoutDifficulty**

VERY\_EASY

EASY

MODERATE

HARD

VERY\_HARD

---

## **CompletionSource**

CLIENT

TRAINER

SYSTEM

---

# **6\. Embedded Schemas**

## **CompletedSet**

| Field | Type |
| ----- | ----- |
| setNumber | Number |
| plannedReps | String |
| completedReps | Number |
| weight | Number |
| completed | Boolean |

Purpose

Stores the performance of one set.

---

## **CompletedExercise**

| Field | Type |
| ----- | ----- |
| exerciseId | ObjectId |
| exerciseName | String |
| completedSets | CompletedSet\[\] |
| notes | String |

Purpose

Stores the completed performance for one prescribed exercise.

---

## **WorkoutFeedback**

| Field | Type |
| ----- | ----- |
| difficulty | WorkoutDifficulty |
| energyLevel | Number |
| notes | String |

Purpose

Stores the client's subjective feedback.

Reason for embedding

Completed sets, exercises, and feedback have no independent lifecycle outside a workout completion.

---

# **7\. Main Schema**

| Field | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| \_id | ObjectId | ✓ | Primary Key |
| coachingRelationshipId | ObjectId | ✓ | Reference → CoachingRelationship |
| workoutProgramId | ObjectId | ✓ | Reference → WorkoutProgram |
| clientId | ObjectId | ✓ | Reference → User |
| trainerId | ObjectId | ✓ | Reference → User |
| workoutDay | Number | ✓ | Prescribed workout day |
| completedExercises | CompletedExercise\[\] | ✓ | Logged exercises |
| feedback | WorkoutFeedback | No | Client feedback |
| status | WorkoutCompletionStatus | ✓ | Completion status |
| startedAt | Date | ✓ | Workout start time |
| completedAt | Date | No | Workout finish time |
| completedBy | CompletionSource | ✓ | Completion source |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

---

# **8\. Validation**

## **Required**

* coachingRelationshipId  
* workoutProgramId  
* clientId  
* trainerId  
* workoutDay  
* completedExercises  
* status  
* startedAt  
* completedBy

---

## **Workout Program**

* Must reference an ACTIVE WorkoutProgram.

---

## **Workout Day**

* Must exist within the referenced WorkoutProgram.

---

## **Completed Sets**

* Set numbers must be sequential.  
* Completed reps ≥ 0\.  
* Weight ≥ 0\.

---

## **Feedback**

* Energy level between **1–10**.  
* Notes maximum length configurable.

---

## **Status**

Must follow the approved Workout Completion lifecycle.

---

# **9\. Indexes**

## **Single Indexes**

clientId

trainerId

status

completedAt

---

## **Compound Indexes**

coachingRelationshipId \+ completedAt

workoutProgramId \+ workoutDay

clientId \+ completedAt

trainerId \+ completedAt

Useful for

* Workout history  
* Progress charts  
* Trainer monitoring  
* Client analytics

---

# **10\. Virtuals**

## **id**

\_id → id

---

## **completionPercentage**

Calculated from

Completed exercises ÷ Prescribed exercises

---

## **workoutDuration**

Calculated from

completedAt \- startedAt

---

## **isCompleted**

Returns

status \=== COMPLETED

---

## **totalVolume**

Calculated from

Σ(weight × completedReps)

---

# **11\. Middleware**

## **Pre Validate**

* Validate completed sets.  
* Validate feedback values.

---

## **Pre Save**

* Validate workout day.  
* Calculate completion percentage.  
* Validate state transition.

---

## **Post Save**

None.

Progress analytics and achievements belong to the Progress Domain.

---

# **12\. Instance Methods**

complete()

skip()

calculateVolume()

calculateDuration()

calculateCompletionPercentage()

isCompleted()

---

# **13\. Static Methods**

findCompleted()

findByClient()

findByTrainer()

findByProgram()

findRecent()

---

# **14\. Query Helpers**

.completed()

.skipped()

.byClient()

.byTrainer()

.recent()

Example

WorkoutCompletionModel.find()  
    .completed()  
    .byClient(clientId);

---

# **15\. Immutable Fields**

Immutable

coachingRelationshipId

workoutProgramId

clientId

trainerId

workoutDay

startedAt

createdAt

Mutable

completedExercises

feedback

status

completedAt

updatedAt

Reason

The prescribed workout context must never change after the workout begins.

---

# **16\. Serialization**

Hide

\_\_v

Expose

id

coachingRelationshipId

workoutProgramId

clientId

trainerId

workoutDay

completedExercises

feedback

status

startedAt

completedAt

completedBy

createdAt

updatedAt

Convert

\_id → id

Remove

\_\_v

---

# **17\. Plugins**

Recommended Plugins

Serialization Plugin

Audit Plugin

Optimistic Concurrency Plugin

Do **not** use

Soft Delete Plugin

Reason

Workout completions are permanent observational records that contribute to progress tracking, coaching evaluations, and long-term analytics. They should never be deleted because they represent actual client activity.

---

# **18\. Performance Notes**

## **Read Patterns**

Most common lookups

* Workout history  
* Client progress  
* Trainer dashboard  
* Weekly adherence  
* Exercise performance

---

## **Write Frequency**

High

Occurs during

* Every workout session  
* Client logging  
* Trainer review

---

## **Expected Growth**

Potentially thousands of documents per active client over time.

---

## **Document Size**

Medium (approximately **3–15 KB**, depending on the number of exercises and logged sets).

---

## **Design Decisions**

* One document represents one completed workout session.  
* Exercise performance is embedded because it belongs exclusively to that workout session.  
* Workout prescriptions remain immutable in `WorkoutProgram`.  
* Completion data captures actual client performance without modifying the prescription.  
* This aggregate serves as the primary source for workout adherence, performance trends, and coaching analytics while maintaining a clear separation between prescription and observation.

---

# **19\. Example Document**

{  
  "\_id": "6868f7aa5c4e8f12ab123456",  
  "coachingRelationshipId": "686892aa5c4e8f12ab654321",  
  "workoutProgramId": "6868d5aa5c4e8f12ab987654",  
  "clientId": "68652b7f5c4e8f12ab333333",  
  "trainerId": "68652b7f5c4e8f12ab222222",  
  "workoutDay": 1,  
  "completedExercises": \[  
    {  
      "exerciseId": "6868b6aa5c4e8f12ab777777",  
      "exerciseName": "Push-Up",  
      "completedSets": \[  
        {  
          "setNumber": 1,  
          "plannedReps": "12",  
          "completedReps": 12,  
          "weight": 0,  
          "completed": true  
        }  
      \],  
      "notes": "Last set was challenging."  
    }  
  \],  
  "feedback": {  
    "difficulty": "MODERATE",  
    "energyLevel": 8,  
    "notes": "Felt strong throughout the workout."  
  },  
  "status": "COMPLETED",  
  "startedAt": "2026-07-04T07:00:00.000Z",  
  "completedAt": "2026-07-04T07:48:00.000Z",  
  "completedBy": "CLIENT",  
  "createdAt": "2026-07-04T07:48:00.000Z",  
  "updatedAt": "2026-07-04T07:48:00.000Z"  
}

## **Design Review**

The `WorkoutCompletion` aggregate represents the observation side of the Workout Domain, recording what the client actually performed rather than what was prescribed. By embedding completed sets, exercises, and subjective feedback, it captures a complete snapshot of each workout session while preserving the immutability of the associated `WorkoutProgram`. This separation between prescription and execution aligns with the KizunaFit domain architecture, enabling accurate progress tracking, coaching evaluations, and long-term performance analytics without compromising historical integrity.

---

 

# **NutritionPlan**

---

# **1\. Purpose**

The **NutritionPlan** collection represents a trainer-prescribed nutrition program created for a specific coaching relationship.

It serves as the authoritative prescription of meals, calorie targets, macronutrient goals, hydration, and nutritional guidance that the client is expected to follow during the coaching period.

This collection is responsible for:

* Nutrition prescription  
* Meal planning  
* Daily calorie targets  
* Macronutrient targets  
* Meal scheduling  
* Nutrition versioning  
* Nutrition lifecycle

It does **not** store meal completion or dietary adherence. Those belong to the **NutritionCompletion** aggregate. The NutritionPlan owns only the prescribed nutrition plan.

---

# **2\. Collection**

| Property | Value |
| ----- | ----- |
| Collection Name | `nutritionPlans` |
| Aggregate Root | NutritionPlan |
| Owner Domain | Nutrition |
| Parent Aggregate | CoachingRelationship |
| MongoDB Collection | nutritionPlans |
| Soft Delete | No |
| Historical Records | Versioned |
| Ownership | One CoachingRelationship → Multiple Nutrition Plan Versions |

---

# **3\. Mongoose Model Name**

NutritionPlan

Export

export const NutritionPlanModel

---

# **4\. TypeScript Interfaces**

## **Enums**

NutritionPlanStatus

MealType

---

## **Embedded Interfaces**

NutritionDay

Meal

MacroTargets

HydrationGoal

---

## **Base Interface**

NutritionPlan

---

## **Document Interface**

NutritionPlanDocument

Extends

HydratedDocument\<NutritionPlan\>

---

## **Model Interface**

NutritionPlanModel

Extends

Model\<NutritionPlan\>

---

## **Query Helper Interface**

NutritionPlanQueryHelpers

---

# **5\. Enums**

## **NutritionPlanStatus**

DRAFT

ACTIVE

COMPLETED

ARCHIVED

---

## **MealType**

BREAKFAST

MORNING\_SNACK

LUNCH

EVENING\_SNACK

DINNER

PRE\_WORKOUT

POST\_WORKOUT

OTHER

---

# **6\. Embedded Schemas**

## **MacroTargets**

| Field | Type |
| ----- | ----- |
| calories | Number |
| protein | Number |
| carbohydrates | Number |
| fats | Number |

Purpose

Defines the nutritional targets.

---

## **Meal**

| Field | Type |
| ----- | ----- |
| mealType | MealType |
| title | String |
| description | String |
| macroTargets | MacroTargets |
| notes | String |

Purpose

Represents one prescribed meal.

---

## **HydrationGoal**

| Field | Type |
| ----- | ----- |
| litersPerDay | Number |

Purpose

Defines the daily hydration target.

---

## **NutritionDay**

| Field | Type |
| ----- | ----- |
| dayNumber | Number |
| meals | Meal\[\] |
| dailyMacroTargets | MacroTargets |
| hydrationGoal | HydrationGoal |

Purpose

Represents one nutrition day.

Reason for embedding

Meals and nutrition days have no independent lifecycle outside the nutrition plan.

---

# **7\. Main Schema**

| Field | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| \_id | ObjectId | ✓ | Primary Key |
| coachingRelationshipId | ObjectId | ✓ | Reference → CoachingRelationship |
| trainerId | ObjectId | ✓ | Reference → User |
| clientId | ObjectId | ✓ | Reference → User |
| version | Number | ✓ | Plan version |
| title | String | ✓ | Plan title |
| description | String | No | Plan description |
| durationWeeks | Number | ✓ | Plan duration |
| nutritionDays | NutritionDay\[\] | ✓ | Daily nutrition plan |
| status | NutritionPlanStatus | ✓ | Plan lifecycle |
| activatedAt | Date | No | Activation timestamp |
| completedAt | Date | No | Completion timestamp |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

---

# **8\. Validation**

## **Required**

* coachingRelationshipId  
* trainerId  
* clientId  
* version  
* title  
* durationWeeks  
* nutritionDays  
* status

---

## **Version**

* Starts at **1**  
* Sequential  
* Immutable

---

## **Nutrition Days**

* At least one nutrition day  
* Day numbers must be unique  
* Ordered sequentially

---

## **Meals**

* At least one meal per day  
* Meal types cannot be duplicated within the same day

---

## **Macro Targets**

* Calories \> 0  
* Protein ≥ 0  
* Carbohydrates ≥ 0  
* Fats ≥ 0

---

## **Hydration**

* Greater than zero

---

## **Status**

Must follow the approved Nutrition Plan state machine.

---

# **9\. Indexes**

## **Single Indexes**

trainerId

clientId

status

createdAt

---

## **Compound Indexes**

coachingRelationshipId \+ version

trainerId \+ status

clientId \+ status

status \+ activatedAt

Useful for

* Active nutrition plans  
* Nutrition history  
* Trainer dashboard  
* Client dashboard

---

# **10\. Virtuals**

## **id**

\_id → id

---

## **totalNutritionDays**

Returns

nutritionDays.length

---

## **totalMeals**

Calculated from

All nutritionDays.meals

---

## **isActive**

Returns

status \=== ACTIVE

---

## **currentWeek**

Calculated from

activatedAt

---

# **11\. Middleware**

## **Pre Validate**

* Validate nutrition day ordering.  
* Validate meal ordering.  
* Validate macro totals.

---

## **Pre Save**

* Prevent version modification.  
* Validate duplicate meal types.  
* Validate nutrition structure.

---

## **Post Save**

None.

Notifications belong to the service layer.

---

# **12\. Instance Methods**

activate()

archive()

complete()

calculateTotalMeals()

calculateTotalCalories()

isActive()

---

# **13\. Static Methods**

findLatest()

findActive()

findByRelationship()

findByTrainer()

findHistory()

---

# **14\. Query Helpers**

.active()

.archived()

.byTrainer()

.byClient()

.latestVersion()

Example

NutritionPlanModel.find()  
    .active()  
    .byClient(clientId);

---

# **15\. Immutable Fields**

Immutable

coachingRelationshipId

trainerId

clientId

version

createdAt

Mutable

status

activatedAt

completedAt

updatedAt

Reason

Each nutrition plan version represents a historical prescription and must remain unchanged after publication.

---

# **16\. Serialization**

Hide

\_\_v

Expose

id

coachingRelationshipId

trainerId

clientId

version

title

description

durationWeeks

nutritionDays

status

activatedAt

completedAt

createdAt

updatedAt

Convert

\_id → id

Remove

\_\_v

---

# **17\. Plugins**

Recommended Plugins

Serialization Plugin

Audit Plugin

Optimistic Concurrency Plugin

Do **not** use

Soft Delete Plugin

Reason

Nutrition plans are permanent coaching prescriptions. Older versions must remain available for progress evaluation, coaching history, and future audits rather than being overwritten or deleted.

---

# **18\. Performance Notes**

## **Read Patterns**

Most common lookups

* Active nutrition plan  
* Nutrition history  
* Trainer dashboard  
* Client dashboard

---

## **Write Frequency**

Low

Occurs during

* Nutrition plan creation  
* Plan revisions  
* Plan activation  
* Plan completion

---

## **Expected Growth**

Multiple versions may exist for one coaching relationship.

---

## **Document Size**

Medium to Large (approximately **8–40 KB**, depending on the number of nutrition days and meals).

---

## **Design Decisions**

* One nutrition plan contains the complete nutritional prescription.  
* Meals and nutrition days are embedded because they have no independent lifecycle.  
* Versioning preserves historical nutrition prescriptions.  
* Nutrition completion is intentionally separated into the `NutritionCompletion` aggregate.  
* Following the KizunaFit Nutrition Domain, the **Nutrition Day** is treated as the primary completion unit rather than individual meals, simplifying adherence tracking while maintaining sufficient detail for coaching decisions.

---

# **19\. Example Document**

{  
  "\_id": "686915aa5c4e8f12ab123456",  
  "coachingRelationshipId": "686892aa5c4e8f12ab654321",  
  "trainerId": "68652b7f5c4e8f12ab222222",  
  "clientId": "68652b7f5c4e8f12ab333333",  
  "version": 1,  
  "title": "12 Week Lean Muscle Nutrition Plan",  
  "description": "High-protein nutrition program for lean muscle gain.",  
  "durationWeeks": 12,  
  "nutritionDays": \[  
    {  
      "dayNumber": 1,  
      "dailyMacroTargets": {  
        "calories": 2500,  
        "protein": 180,  
        "carbohydrates": 280,  
        "fats": 70  
      },  
      "hydrationGoal": {  
        "litersPerDay": 3.5  
      },  
      "meals": \[  
        {  
          "mealType": "BREAKFAST",  
          "title": "Oats & Eggs",  
          "description": "Rolled oats, eggs and banana.",  
          "macroTargets": {  
            "calories": 650,  
            "protein": 40,  
            "carbohydrates": 65,  
            "fats": 18  
          },  
          "notes": "Consume within one hour after waking."  
        }  
      \]  
    }  
  \],  
  "status": "ACTIVE",  
  "activatedAt": "2026-07-04T09:00:00.000Z",  
  "completedAt": null,  
  "createdAt": "2026-07-04T09:00:00.000Z",  
  "updatedAt": "2026-07-04T09:00:00.000Z"  
}

## **Design Review**

The `NutritionPlan` aggregate represents the prescription side of the Nutrition Domain. It encapsulates the complete dietary program, including nutrition days, meals, macro targets, and hydration goals, while preserving immutable version history. By treating the **Nutrition Day** as the fundamental completion unit and separating adherence into the `NutritionCompletion` aggregate, the design maintains a clean distinction between prescription and observation, consistent with the KizunaFit domain architecture and database design.

---

 

# **NutritionCompletion**

---

# **1\. Purpose**

The **NutritionCompletion** collection records a client's daily adherence to a prescribed nutrition plan.

It represents the **observation layer** of the Nutrition Domain by capturing what the client actually consumed during a nutrition day, independent of the prescribed nutrition plan.

This collection is responsible for:

* Daily nutrition tracking  
* Meal completion  
* Daily macro intake  
* Hydration tracking  
* Nutrition adherence  
* Client nutrition feedback  
* Nutrition analytics

It does **not** modify the prescribed nutrition plan. The NutritionPlan remains immutable, while NutritionCompletion records actual nutritional behavior.

---

# **2\. Collection**

| Property | Value |
| ----- | ----- |
| Collection Name | `nutritionCompletions` |
| Aggregate Root | NutritionCompletion |
| Owner Domain | Nutrition |
| Parent Aggregate | CoachingRelationship |
| MongoDB Collection | nutritionCompletions |
| Soft Delete | No |
| Historical Records | Permanent |
| Ownership | One CoachingRelationship → Many NutritionCompletions |

---

# **3\. Mongoose Model Name**

NutritionCompletion

Export

export const NutritionCompletionModel

---

# **4\. TypeScript Interfaces**

## **Enums**

NutritionCompletionStatus

MealCompletionStatus

CompletionSource

---

## **Embedded Interfaces**

CompletedMeal

DailyMacroSummary

HydrationSummary

NutritionFeedback

---

## **Base Interface**

NutritionCompletion

---

## **Document Interface**

NutritionCompletionDocument

Extends

HydratedDocument\<NutritionCompletion\>

---

## **Model Interface**

NutritionCompletionModel

Extends

Model\<NutritionCompletion\>

---

## **Query Helper Interface**

NutritionCompletionQueryHelpers

---

# **5\. Enums**

## **NutritionCompletionStatus**

IN\_PROGRESS

COMPLETED

PARTIALLY\_COMPLETED

SKIPPED

---

## **MealCompletionStatus**

COMPLETED

SKIPPED

PARTIALLY\_COMPLETED

---

## **CompletionSource**

CLIENT

TRAINER

SYSTEM

---

# **6\. Embedded Schemas**

## **CompletedMeal**

| Field | Type |
| ----- | ----- |
| mealType | String |
| status | MealCompletionStatus |
| caloriesConsumed | Number |
| notes | String |

Purpose

Stores completion details for one prescribed meal.

---

## **DailyMacroSummary**

| Field | Type |
| ----- | ----- |
| calories | Number |
| protein | Number |
| carbohydrates | Number |
| fats | Number |

Purpose

Stores the client's actual daily macro intake.

---

## **HydrationSummary**

| Field | Type |
| ----- | ----- |
| litersConsumed | Number |

Purpose

Stores the client's hydration for the day.

---

## **NutritionFeedback**

| Field | Type |
| ----- | ----- |
| hungerLevel | Number |
| energyLevel | Number |
| notes | String |

Purpose

Stores the client's subjective nutrition feedback.

Reason for embedding

Meal completion, macro summary, hydration, and feedback belong exclusively to a single nutrition day.

---

# **7\. Main Schema**

| Field | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| \_id | ObjectId | ✓ | Primary Key |
| coachingRelationshipId | ObjectId | ✓ | Reference → CoachingRelationship |
| nutritionPlanId | ObjectId | ✓ | Reference → NutritionPlan |
| clientId | ObjectId | ✓ | Reference → User |
| trainerId | ObjectId | ✓ | Reference → User |
| nutritionDay | Number | ✓ | Prescribed nutrition day |
| completedMeals | CompletedMeal\[\] | ✓ | Meal completion |
| macroSummary | DailyMacroSummary | ✓ | Actual macros |
| hydration | HydrationSummary | ✓ | Water intake |
| feedback | NutritionFeedback | No | Client feedback |
| status | NutritionCompletionStatus | ✓ | Completion status |
| completedBy | CompletionSource | ✓ | Completion source |
| completedAt | Date | No | Completion timestamp |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

---

# **8\. Validation**

## **Required**

* coachingRelationshipId  
* nutritionPlanId  
* clientId  
* trainerId  
* nutritionDay  
* completedMeals  
* macroSummary  
* hydration  
* status  
* completedBy

---

## **Nutrition Plan**

* Must reference an ACTIVE NutritionPlan.

---

## **Nutrition Day**

* Must exist within the referenced NutritionPlan.

---

## **Macro Summary**

* Calories ≥ 0  
* Protein ≥ 0  
* Carbohydrates ≥ 0  
* Fats ≥ 0

---

## **Hydration**

* Liters consumed ≥ 0

---

## **Feedback**

* Hunger level between **1–10**  
* Energy level between **1–10**

---

## **Status**

Must follow the approved Nutrition Completion lifecycle.

---

# **9\. Indexes**

## **Single Indexes**

clientId

trainerId

status

completedAt

---

## **Compound Indexes**

coachingRelationshipId \+ completedAt

nutritionPlanId \+ nutritionDay

clientId \+ completedAt

trainerId \+ completedAt

Useful for

* Nutrition history  
* Adherence analytics  
* Trainer dashboard  
* Client dashboard

---

# **10\. Virtuals**

## **id**

\_id → id

---

## **adherencePercentage**

Calculated from

Completed meals ÷ Planned meals

---

## **calorieDifference**

Calculated from

Actual calories \- Planned calories

---

## **macroAccuracy**

Calculated from

Actual macros vs Planned macros

---

## **isCompleted**

Returns

status \=== COMPLETED

---

# **11\. Middleware**

## **Pre Validate**

* Validate macro values.  
* Validate hydration values.  
* Validate meal completion.

---

## **Pre Save**

* Validate nutrition day.  
* Calculate adherence.  
* Validate state transition.

---

## **Post Save**

None.

Progress scoring belongs to the Progress Domain.

---

# **12\. Instance Methods**

complete()

skip()

calculateAdherence()

calculateMacroAccuracy()

calculateCalorieDifference()

isCompleted()

---

# **13\. Static Methods**

findCompleted()

findByClient()

findByTrainer()

findByNutritionPlan()

findRecent()

---

# **14\. Query Helpers**

.completed()

.skipped()

.byClient()

.byTrainer()

.recent()

Example

NutritionCompletionModel.find()  
    .completed()  
    .byClient(clientId);

---

# **15\. Immutable Fields**

Immutable

coachingRelationshipId

nutritionPlanId

clientId

trainerId

nutritionDay

createdAt

Mutable

completedMeals

macroSummary

hydration

feedback

status

completedAt

updatedAt

Reason

The prescribed nutrition context must never change once daily tracking begins.

---

# **16\. Serialization**

Hide

\_\_v

Expose

id

coachingRelationshipId

nutritionPlanId

clientId

trainerId

nutritionDay

completedMeals

macroSummary

hydration

feedback

status

completedBy

completedAt

createdAt

updatedAt

Convert

\_id → id

Remove

\_\_v

---

# **17\. Plugins**

Recommended Plugins

Serialization Plugin

Audit Plugin

Optimistic Concurrency Plugin

Do **not** use

Soft Delete Plugin

Reason

Nutrition completions are permanent observational records that support coaching evaluations, adherence analysis, and long-term client progress. They should never be deleted because they represent actual client behavior and historical evidence.

---

# **18\. Performance Notes**

## **Read Patterns**

Most common lookups

* Daily nutrition history  
* Nutrition adherence  
* Trainer dashboard  
* Client dashboard  
* Progress analytics

---

## **Write Frequency**

High

Occurs during

* Daily meal logging  
* End-of-day nutrition tracking  
* Trainer review

---

## **Expected Growth**

One document per nutrition day.

This collection becomes one of the largest collections on the platform because clients generate records daily throughout every coaching relationship.

---

## **Document Size**

Small to Medium (approximately **2–8 KB**).

---

## **Design Decisions**

* One document represents one completed nutrition day.  
* The **Nutrition Day** is the completion unit, matching the approved Nutrition Domain design.  
* Meals remain embedded because they belong exclusively to that nutrition day.  
* Prescribed nutrition remains immutable in `NutritionPlan`.  
* Observation data is isolated from prescription data, allowing accurate adherence tracking, macro analysis, and long-term coaching insights without altering historical nutrition plans.

---

# **19\. Example Document**

{  
  "\_id": "686931aa5c4e8f12ab123456",  
  "coachingRelationshipId": "686892aa5c4e8f12ab654321",  
  "nutritionPlanId": "686915aa5c4e8f12ab987654",  
  "clientId": "68652b7f5c4e8f12ab333333",  
  "trainerId": "68652b7f5c4e8f12ab222222",  
  "nutritionDay": 1,  
  "completedMeals": \[  
    {  
      "mealType": "BREAKFAST",  
      "status": "COMPLETED",  
      "caloriesConsumed": 640,  
      "notes": "Followed the meal exactly."  
    },  
    {  
      "mealType": "LUNCH",  
      "status": "PARTIALLY\_COMPLETED",  
      "caloriesConsumed": 520,  
      "notes": "Skipped vegetables."  
    }  
  \],  
  "macroSummary": {  
    "calories": 2380,  
    "protein": 175,  
    "carbohydrates": 265,  
    "fats": 68  
  },  
  "hydration": {  
    "litersConsumed": 3.2  
  },  
  "feedback": {  
    "hungerLevel": 3,  
    "energyLevel": 8,  
    "notes": "Good energy throughout the day."  
  },  
  "status": "COMPLETED",  
  "completedBy": "CLIENT",  
  "completedAt": "2026-07-04T22:10:00.000Z",  
  "createdAt": "2026-07-04T22:10:00.000Z",  
  "updatedAt": "2026-07-04T22:10:00.000Z"  
}

## **Design Review**

The `NutritionCompletion` aggregate represents the observation side of the Nutrition Domain by recording the client's actual daily nutrition behavior. Following the approved KizunaFit domain model, the **Nutrition Day** is treated as the primary completion unit, with meals embedded as components of that day. This design cleanly separates prescribed nutrition from actual adherence, enabling accurate macro analysis, hydration tracking, coaching evaluations, and long-term progress analytics while preserving the immutability of the original `NutritionPlan`.

---

 

# **CoachingEvaluation**

---

# **1\. Purpose**

The **CoachingEvaluation** collection records a trainer's professional assessment of a client's overall coaching progress at scheduled checkpoints.

Unlike workout and nutrition completions, which record **daily observations**, a CoachingEvaluation represents a **high-level coaching review** that summarizes the client's progress across the coaching relationship.

This collection is responsible for:

* Periodic coaching evaluations  
* Overall progress assessment  
* Trainer observations  
* Goal achievement tracking  
* Action plans  
* Client improvement history  
* Coaching recommendations

It does **not** replace workout completions or nutrition completions. Instead, it summarizes insights gathered from those observational records.

---

# **2\. Collection**

| Property | Value |
| ----- | ----- |
| Collection Name | `coachingEvaluations` |
| Aggregate Root | CoachingEvaluation |
| Owner Domain | Progress |
| Parent Aggregate | CoachingRelationship |
| MongoDB Collection | coachingEvaluations |
| Soft Delete | No |
| Historical Records | Permanent |
| Ownership | One CoachingRelationship → Many CoachingEvaluations |

---

# **3\. Mongoose Model Name**

CoachingEvaluation

Export

export const CoachingEvaluationModel

---

# **4\. TypeScript Interfaces**

## **Enums**

EvaluationStatus

ProgressTrend

GoalAchievement

---

## **Embedded Interfaces**

EvaluationPeriod

BodyMeasurementSnapshot

EvaluationScores

TrainerAssessment

ActionPlan

---

## **Base Interface**

CoachingEvaluation

---

## **Document Interface**

CoachingEvaluationDocument

Extends

HydratedDocument\<CoachingEvaluation\>

---

## **Model Interface**

CoachingEvaluationModel

Extends

Model\<CoachingEvaluation\>

---

## **Query Helper Interface**

CoachingEvaluationQueryHelpers

---

# **5\. Enums**

## **EvaluationStatus**

DRAFT

PUBLISHED

---

## **ProgressTrend**

IMPROVING

STABLE

DECLINING

---

## **GoalAchievement**

NOT\_STARTED

IN\_PROGRESS

ACHIEVED

EXCEEDED

---

# **6\. Embedded Schemas**

## **EvaluationPeriod**

| Field | Type |
| ----- | ----- |
| startDate | Date |
| endDate | Date |

Purpose

Defines the time period being evaluated.

---

## **BodyMeasurementSnapshot**

| Field | Type |
| ----- | ----- |
| weight | Number |
| bodyFatPercentage | Number |
| waist | Number |
| chest | Number |
| hips | Number |

Purpose

Stores body measurements at evaluation time.

---

## **EvaluationScores**

| Field | Type |
| ----- | ----- |
| workoutAdherence | Number |
| nutritionAdherence | Number |
| communication | Number |
| consistency | Number |
| overallScore | Number |

Purpose

Summarizes coaching metrics.

---

## **TrainerAssessment**

| Field | Type |
| ----- | ----- |
| strengths | String\[\] |
| improvements | String\[\] |
| notes | String |

Purpose

Stores qualitative coaching observations.

---

## **ActionPlan**

| Field | Type |
| ----- | ----- |
| recommendations | String\[\] |
| nextMilestones | String\[\] |

Purpose

Defines the trainer's recommendations for the next coaching period.

Reason for embedding

All evaluation data belongs exclusively to one coaching evaluation.

---

# **7\. Main Schema**

| Field | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| \_id | ObjectId | ✓ | Primary Key |
| coachingRelationshipId | ObjectId | ✓ | Reference → CoachingRelationship |
| trainerId | ObjectId | ✓ | Reference → User |
| clientId | ObjectId | ✓ | Reference → User |
| evaluationNumber | Number | ✓ | Sequential evaluation |
| evaluationPeriod | EvaluationPeriod | ✓ | Period evaluated |
| bodyMeasurements | BodyMeasurementSnapshot | No | Measurement snapshot |
| scores | EvaluationScores | ✓ | Coaching scores |
| progressTrend | ProgressTrend | ✓ | Overall progress |
| goalAchievement | GoalAchievement | ✓ | Goal status |
| assessment | TrainerAssessment | ✓ | Trainer observations |
| actionPlan | ActionPlan | ✓ | Next coaching plan |
| status | EvaluationStatus | ✓ | Evaluation lifecycle |
| publishedAt | Date | No | Publication timestamp |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

---

# **8\. Validation**

## **Required**

* coachingRelationshipId  
* trainerId  
* clientId  
* evaluationNumber  
* evaluationPeriod  
* scores  
* progressTrend  
* goalAchievement  
* assessment  
* actionPlan  
* status

---

## **Evaluation Number**

* Starts at **1**  
* Sequential  
* Immutable

---

## **Evaluation Period**

* Start \< End  
* Cannot overlap another evaluation

---

## **Scores**

Each score

* Between **0–100**

---

## **Overall Score**

Automatically calculated from component scores.

---

## **Status**

Must follow the Progress state machine.

---

# **9\. Indexes**

## **Single Indexes**

trainerId

clientId

status

publishedAt

---

## **Compound Indexes**

coachingRelationshipId \+ evaluationNumber

clientId \+ publishedAt

trainerId \+ publishedAt

status \+ publishedAt

Useful for

* Evaluation history  
* Progress timeline  
* Trainer dashboard  
* Client dashboard

---

# **10\. Virtuals**

## **id**

\_id → id

---

## **isPublished**

Returns

status \=== PUBLISHED

---

## **improvementPercentage**

Calculated from previous evaluation.

---

## **overallGrade**

Calculated from

overallScore

Returns

A

B

C

D

---

# **11\. Middleware**

## **Pre Validate**

* Validate score ranges.  
* Validate evaluation period.

---

## **Pre Save**

* Calculate overall score.  
* Validate evaluation sequence.  
* Validate state transition.

---

## **Post Save**

None.

Notifications belong to the service layer.

---

# **12\. Instance Methods**

publish()

calculateOverallScore()

calculateGrade()

isPublished()

---

# **13\. Static Methods**

findLatest()

findHistory()

findByTrainer()

findByClient()

findPublished()

---

# **14\. Query Helpers**

.published()

.byTrainer()

.byClient()

.latest()

.history()

Example

CoachingEvaluationModel.find()  
    .published()  
    .byClient(clientId);

---

# **15\. Immutable Fields**

Immutable

coachingRelationshipId

trainerId

clientId

evaluationNumber

evaluationPeriod

createdAt

Mutable

scores

assessment

actionPlan

status

publishedAt

updatedAt

Reason

Each evaluation represents a historical coaching review and should remain chronologically accurate.

---

# **16\. Serialization**

Hide

\_\_v

Expose

id

coachingRelationshipId

trainerId

clientId

evaluationNumber

evaluationPeriod

bodyMeasurements

scores

progressTrend

goalAchievement

assessment

actionPlan

status

publishedAt

createdAt

updatedAt

Convert

\_id → id

Remove

\_\_v

---

# **17\. Plugins**

Recommended Plugins

Serialization Plugin

Audit Plugin

Optimistic Concurrency Plugin

Do **not** use

Soft Delete Plugin

Reason

Coaching evaluations are permanent professional assessments that become part of the client's long-term coaching history. Removing them would compromise progress tracking, historical comparisons, and coaching accountability.

---

# **18\. Performance Notes**

## **Read Patterns**

Most common lookups

* Client progress timeline  
* Evaluation history  
* Latest evaluation  
* Trainer dashboard  
* Coaching reports

---

## **Write Frequency**

Low

Occurs during

* Weekly review  
* Bi-weekly review  
* Monthly review  
* Program completion

---

## **Expected Growth**

Typically **4–20 evaluations** per coaching relationship depending on program duration.

---

## **Document Size**

Medium (approximately **3–8 KB**).

---

## **Design Decisions**

* One document represents one professional coaching evaluation.  
* Evaluation data is embedded because it belongs exclusively to that review.  
* Historical evaluations are immutable after publication.  
* Daily workout and nutrition observations remain in their own aggregates.  
* This aggregate provides a high-level coaching summary built upon observational data from the Workout and Nutrition domains, following the KizunaFit principle that **Progress is an Observation Domain rather than a prescription domain**.

---

# **19\. Example Document**

{  
  "\_id": "68694faa5c4e8f12ab123456",  
  "coachingRelationshipId": "686892aa5c4e8f12ab654321",  
  "trainerId": "68652b7f5c4e8f12ab222222",  
  "clientId": "68652b7f5c4e8f12ab333333",  
  "evaluationNumber": 3,  
  "evaluationPeriod": {  
    "startDate": "2026-08-01T00:00:00.000Z",  
    "endDate": "2026-08-31T23:59:59.000Z"  
  },  
  "bodyMeasurements": {  
    "weight": 71.5,  
    "bodyFatPercentage": 14.2,  
    "waist": 81,  
    "chest": 103,  
    "hips": 94  
  },  
  "scores": {  
    "workoutAdherence": 95,  
    "nutritionAdherence": 90,  
    "communication": 100,  
    "consistency": 92,  
    "overallScore": 94  
  },  
  "progressTrend": "IMPROVING",  
  "goalAchievement": "IN\_PROGRESS",  
  "assessment": {  
    "strengths": \[  
      "Excellent workout consistency",  
      "Improved strength"  
    \],  
    "improvements": \[  
      "Increase protein intake"  
    \],  
    "notes": "Client is progressing steadily toward muscle gain goals."  
  },  
  "actionPlan": {  
    "recommendations": \[  
      "Increase training intensity",  
      "Maintain calorie surplus"  
    \],  
    "nextMilestones": \[  
      "Reach 73 kg body weight",  
      "Bench press 80 kg"  
    \]  
  },  
  "status": "PUBLISHED",  
  "publishedAt": "2026-09-01T09:00:00.000Z",  
  "createdAt": "2026-09-01T09:00:00.000Z",  
  "updatedAt": "2026-09-01T09:00:00.000Z"  
}

## **Design Review**

The `CoachingEvaluation` aggregate represents the highest level of observation within the KizunaFit Progress Domain. Rather than recording daily activities, it synthesizes workout adherence, nutrition adherence, body measurements, and trainer observations into periodic professional assessments. This separation allows the Workout and Nutrition domains to capture raw observational data while the Progress Domain provides meaningful coaching insights, long-term trend analysis, and actionable recommendations without violating aggregate boundaries.

---

 

# **Message**

---

# **1\. Purpose**

The **Message** collection stores all chat messages exchanged between a trainer and a client within an active coaching relationship.

It serves as the primary communication record for coaching conversations and supports text, media, system events, delivery tracking, and moderation.

This collection is responsible for:

* Text messaging  
* Media messaging  
* Delivery status  
* Read receipts  
* Message editing  
* Message deletion  
* System notifications  
* Message moderation

It does **not** manage reports, video sessions, or coaching data. Those belong to their respective domains. The Message aggregate owns only the communication event.

---

# **2\. Collection**

| Property | Value |
| ----- | ----- |
| Collection Name | `messages` |
| Aggregate Root | Message |
| Owner Domain | Communication |
| Parent Aggregate | CoachingRelationship |
| MongoDB Collection | messages |
| Soft Delete | No |
| Historical Records | Permanent |
| Ownership | One CoachingRelationship → Many Messages |

---

# **3\. Mongoose Model Name**

Message

Export

export const MessageModel

---

# **4\. TypeScript Interfaces**

## **Enums**

MessageType

MessageStatus

SenderType

---

## **Embedded Interfaces**

MessageAttachment

DeliveryInfo

ReadReceipt

EditHistory

---

## **Base Interface**

Message

---

## **Document Interface**

MessageDocument

Extends

HydratedDocument\<Message\>

---

## **Model Interface**

MessageModel

Extends

Model\<Message\>

---

## **Query Helper Interface**

MessageQueryHelpers

---

# **5\. Enums**

## **MessageType**

TEXT

IMAGE

VIDEO

FILE

SYSTEM

---

## **MessageStatus**

SENDING

SENT

DELIVERED

READ

FAILED

DELETED

---

## **SenderType**

CLIENT

TRAINER

SYSTEM

---

# **6\. Embedded Schemas**

## **MessageAttachment**

| Field | Type |
| ----- | ----- |
| fileName | String |
| fileUrl | String |
| mimeType | String |
| fileSize | Number |

Purpose

Stores uploaded attachment metadata.

---

## **DeliveryInfo**

| Field | Type |
| ----- | ----- |
| sentAt | Date |
| deliveredAt | Date |

Purpose

Tracks message delivery.

---

## **ReadReceipt**

| Field | Type |
| ----- | ----- |
| readAt | Date |
| readerId | ObjectId |

Purpose

Tracks when the recipient reads the message.

---

## **EditHistory**

| Field | Type |
| ----- | ----- |
| editedAt | Date |
| previousContent | String |

Purpose

Maintains message edit history.

Reason for embedding

These objects exist only within a message.

---

# **7\. Main Schema**

| Field | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| \_id | ObjectId | ✓ | Primary Key |
| coachingRelationshipId | ObjectId | ✓ | Reference → CoachingRelationship |
| senderId | ObjectId | ✓ | Reference → User |
| receiverId | ObjectId | ✓ | Reference → User |
| senderType | SenderType | ✓ | Sender role |
| messageType | MessageType | ✓ | Message type |
| content | String | No | Text message |
| attachment | MessageAttachment | No | Media/File |
| delivery | DeliveryInfo | ✓ | Delivery metadata |
| readReceipt | ReadReceipt | No | Read tracking |
| editHistory | EditHistory\[\] | No | Edit log |
| status | MessageStatus | ✓ | Message lifecycle |
| deletedAt | Date | No | Soft delete timestamp (logical deletion only) |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

---

# **8\. Validation**

## **Required**

* coachingRelationshipId  
* senderId  
* receiverId  
* senderType  
* messageType  
* status

---

## **Content**

* Required for `TEXT`  
* Trimmed  
* Maximum length configurable

---

## **Attachment**

* Required for media/file messages  
* HTTPS URLs only  
* File size limit configurable

---

## **Sender**

* Must belong to the coaching relationship.

---

## **Receiver**

* Must belong to the coaching relationship.

---

## **Status**

Must follow the approved Message lifecycle.

---

# **9\. Indexes**

## **Single Indexes**

coachingRelationshipId

senderId

receiverId

createdAt

---

## **Compound Indexes**

coachingRelationshipId \+ createdAt

receiverId \+ status

senderId \+ createdAt

Useful for

* Chat history  
* Infinite scrolling  
* Unread message lookup  
* Conversation loading

---

# **10\. Virtuals**

## **id**

\_id → id

---

## **hasAttachment**

Returns

attachment \!= null

---

## **isEdited**

Returns

editHistory.length \> 0

---

## **isRead**

Returns

status \=== READ

---

# **11\. Middleware**

## **Pre Validate**

* Trim message content.  
* Validate attachment.

---

## **Pre Save**

* Validate sender belongs to coaching relationship.  
* Validate message type.  
* Prevent invalid status transitions.

---

## **Post Save**

None.

Real-time Socket.IO events belong to the service layer.

---

# **12\. Instance Methods**

markDelivered()

markRead()

edit()

delete()

hasAttachment()

isRead()

---

# **13\. Static Methods**

findConversation()

findUnread()

findBySender()

findRecent()

markConversationRead()

---

# **14\. Query Helpers**

.unread()

.byRelationship()

.bySender()

.withAttachments()

.recent()

Example

MessageModel.find()  
    .byRelationship(relationshipId)  
    .recent();

---

# **15\. Immutable Fields**

Immutable

coachingRelationshipId

senderId

receiverId

senderType

messageType

createdAt

Mutable

content

attachment

editHistory

delivery

readReceipt

status

deletedAt

updatedAt

Reason

The ownership and sender of a message must never change after creation.

---

# **16\. Serialization**

Hide

\_\_v

Expose

id

coachingRelationshipId

senderId

receiverId

senderType

messageType

content

attachment

delivery

readReceipt

editHistory

status

deletedAt

createdAt

updatedAt

Convert

\_id → id

Remove

\_\_v

---

# **17\. Plugins**

Recommended Plugins

Serialization Plugin

Audit Plugin

Optimistic Concurrency Plugin

Do **not** use

Soft Delete Plugin

Reason

Messages require **logical deletion**, not document deletion. The message remains part of the conversation history while the content can be hidden from users if necessary. This preserves moderation history, reports, and conversation integrity.

---

# **18\. Performance Notes**

## **Read Patterns**

Most common lookups

* Conversation history  
* Latest messages  
* Unread messages  
* Media messages

---

## **Write Frequency**

Very High

Occurs during

* Every chat message  
* Delivery updates  
* Read receipts  
* Message edits

---

## **Expected Growth**

Potentially millions of documents.

This is one of the highest-volume collections in the platform.

---

## **Document Size**

Small (approximately **0.5–3 KB**).

---

## **Design Decisions**

* One document represents one communication event.  
* Optimized for chronological retrieval.  
* Attachments are embedded because they belong only to the message.  
* Read receipts and delivery metadata remain within the message.  
* Message reports are separated into the `MessageReport` aggregate.  
* Designed for Socket.IO real-time messaging with efficient pagination and conversation loading.

---

# **19\. Example Document**

{  
  "\_id": "68696daa5c4e8f12ab123456",  
  "coachingRelationshipId": "686892aa5c4e8f12ab654321",  
  "senderId": "68652b7f5c4e8f12ab222222",  
  "receiverId": "68652b7f5c4e8f12ab333333",  
  "senderType": "TRAINER",  
  "messageType": "TEXT",  
  "content": "Great work on today's workout\! Increase your squat weight by 2.5 kg next session.",  
  "delivery": {  
    "sentAt": "2026-07-05T08:15:00.000Z",  
    "deliveredAt": "2026-07-05T08:15:02.000Z"  
  },  
  "readReceipt": {  
    "readerId": "68652b7f5c4e8f12ab333333",  
    "readAt": "2026-07-05T08:17:30.000Z"  
  },  
  "status": "READ",  
  "createdAt": "2026-07-05T08:15:00.000Z",  
  "updatedAt": "2026-07-05T08:17:30.000Z"  
}

## **Design Review**

The `Message` aggregate is the core communication unit of the platform, optimized for high-volume, real-time messaging. Each document represents a single immutable communication event while allowing controlled updates for delivery status, read receipts, edits, and logical deletion. By separating moderation (`MessageReport`) and real-time transport (Socket.IO) from message persistence, the design maintains clean domain boundaries, supports scalable chat history retrieval, and preserves a complete audit trail for coaching conversations.

---

 

# **MessageReport**

---

# **1\. Purpose**

The **MessageReport** collection records reports submitted by users against chat messages that violate platform policies.

It serves as the moderation aggregate for the Communication Domain, enabling administrators to investigate, review, and resolve inappropriate content while preserving an auditable moderation history.

This collection is responsible for:

* Message reporting  
* Policy violation tracking  
* Moderator review  
* Resolution history  
* Administrative actions  
* Moderation audit trail

It does **not** modify or delete messages. The reported `Message` remains the source of truth, while MessageReport records the moderation workflow.

---

# **2\. Collection**

| Property | Value |
| ----- | ----- |
| Collection Name | `messageReports` |
| Aggregate Root | MessageReport |
| Owner Domain | Communication |
| Parent Aggregate | Message |
| MongoDB Collection | messageReports |
| Soft Delete | No |
| Historical Records | Permanent |
| Ownership | One Message → Many Reports |

---

# **3\. Mongoose Model Name**

MessageReport

Export

export const MessageReportModel

---

# **4\. TypeScript Interfaces**

## **Enums**

MessageReportReason

MessageReportStatus

ModerationDecision

---

## **Embedded Interfaces**

ReporterSnapshot

ModeratorReview

---

## **Base Interface**

MessageReport

---

## **Document Interface**

MessageReportDocument

Extends

HydratedDocument\<MessageReport\>

---

## **Model Interface**

MessageReportModel

Extends

Model\<MessageReport\>

---

## **Query Helper Interface**

MessageReportQueryHelpers

---

# **5\. Enums**

## **MessageReportReason**

SPAM

HARASSMENT

HATE\_SPEECH

INAPPROPRIATE\_CONTENT

MISINFORMATION

SCAM

OTHER

---

## **MessageReportStatus**

PENDING

UNDER\_REVIEW

RESOLVED

DISMISSED

---

## **ModerationDecision**

NO\_ACTION

WARNING

MESSAGE\_REMOVED

ACCOUNT\_SUSPENDED

ACCOUNT\_BANNED

---

# **6\. Embedded Schemas**

## **ReporterSnapshot**

| Field | Type |
| ----- | ----- |
| reporterId | ObjectId |
| reporterName | String |
| reporterRole | String |

Purpose

Preserves reporter information at submission time.

---

## **ModeratorReview**

| Field | Type |
| ----- | ----- |
| moderatorId | ObjectId |
| decision | ModerationDecision |
| notes | String |
| reviewedAt | Date |

Purpose

Stores the moderator's final review.

Reason for embedding

Reporter information and moderation review belong exclusively to one report.

---

# **7\. Main Schema**

| Field | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| \_id | ObjectId | ✓ | Primary Key |
| messageId | ObjectId | ✓ | Reference → Message |
| coachingRelationshipId | ObjectId | ✓ | Reference → CoachingRelationship |
| reporterSnapshot | ReporterSnapshot | ✓ | Reporter information |
| reportedUserId | ObjectId | ✓ | Reference → User |
| reason | MessageReportReason | ✓ | Report reason |
| description | String | No | Additional explanation |
| status | MessageReportStatus | ✓ | Moderation lifecycle |
| moderatorReview | ModeratorReview | No | Review outcome |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

---

# **8\. Validation**

## **Required**

* messageId  
* coachingRelationshipId  
* reporterSnapshot  
* reportedUserId  
* reason  
* status

---

## **Message**

* Must reference an existing message.  
* Message must belong to the coaching relationship.

---

## **Reporter**

* Cannot report their own message.  
* Must belong to the coaching relationship.

---

## **Reason**

* Required.  
* Must use predefined enum values.

---

## **Description**

* Maximum length configurable.  
* Trimmed before storage.

---

## **Status**

Must follow the approved moderation workflow.

---

# **9\. Indexes**

## **Single Indexes**

messageId

reportedUserId

status

createdAt

---

## **Compound Indexes**

coachingRelationshipId \+ createdAt

status \+ createdAt

reportedUserId \+ status

messageId \+ status

Useful for

* Admin moderation queue  
* User moderation history  
* Report analytics  
* Message investigation

---

# **10\. Virtuals**

## **id**

\_id → id

---

## **isResolved**

Returns

status \=== RESOLVED

---

## **isPending**

Returns

status \=== PENDING

---

## **hasModeratorReview**

Returns

moderatorReview \!= null

---

# **11\. Middleware**

## **Pre Validate**

* Trim description.  
* Validate report reason.

---

## **Pre Save**

* Prevent duplicate active reports by the same reporter.  
* Validate moderation state transitions.

---

## **Post Save**

None.

Administrative notifications belong to the service layer.

---

# **12\. Instance Methods**

assignModerator()

resolve()

dismiss()

addReview()

isResolved()

---

# **13\. Static Methods**

findPending()

findByMessage()

findByReportedUser()

findResolved()

findModerationQueue()

---

# **14\. Query Helpers**

.pending()

.resolved()

.byMessage()

.byReportedUser()

.recent()

Example

MessageReportModel.find()  
    .pending()  
    .recent();

---

# **15\. Immutable Fields**

Immutable

messageId

coachingRelationshipId

reporterSnapshot

reportedUserId

reason

createdAt

Mutable

description

status

moderatorReview

updatedAt

Reason

A report must permanently preserve who reported whom, for which message, and why.

---

# **16\. Serialization**

Hide

\_\_v

Expose

id

messageId

coachingRelationshipId

reporterSnapshot

reportedUserId

reason

description

status

moderatorReview

createdAt

updatedAt

Convert

\_id → id

Remove

\_\_v

---

# **17\. Plugins**

Recommended Plugins

Serialization Plugin

Audit Plugin

Optimistic Concurrency Plugin

Do **not** use

Soft Delete Plugin

Reason

Moderation reports are permanent compliance records. Even dismissed reports contribute to moderation history, abuse analysis, and future investigations.

---

# **18\. Performance Notes**

## **Read Patterns**

Most common lookups

* Pending moderation queue  
* Reports for a message  
* User moderation history  
* Admin dashboard

---

## **Write Frequency**

Low

Occurs during

* User reports  
* Moderator reviews  
* Administrative actions

---

## **Expected Growth**

Generally much smaller than the `messages` collection.

---

## **Document Size**

Small (approximately **1–3 KB**).

---

## **Design Decisions**

* One document represents one user report.  
* Multiple reports may exist for the same message.  
* Reporter information is snapshotted for historical integrity.  
* Moderation decisions are embedded because they belong exclusively to the report.  
* Message persistence remains independent from moderation.  
* Designed to support future AI-assisted moderation without changing the aggregate structure.

---

# **19\. Example Document**

{  
  "\_id": "68698baa5c4e8f12ab123456",  
  "messageId": "68696daa5c4e8f12ab654321",  
  "coachingRelationshipId": "686892aa5c4e8f12ab987654",  
  "reporterSnapshot": {  
    "reporterId": "68652b7f5c4e8f12ab333333",  
    "reporterName": "Mohammed Nihal K",  
    "reporterRole": "CLIENT"  
  },  
  "reportedUserId": "68652b7f5c4e8f12ab222222",  
  "reason": "HARASSMENT",  
  "description": "The message contained abusive language.",  
  "status": "PENDING",  
  "moderatorReview": null,  
  "createdAt": "2026-07-05T12:15:00.000Z",  
  "updatedAt": "2026-07-05T12:15:00.000Z"  
}

## **Design Review**

The `MessageReport` aggregate provides a dedicated moderation workflow without coupling moderation logic to the `Message` aggregate itself. By preserving immutable reporter snapshots and embedding moderator decisions, it creates a complete audit trail while allowing multiple independent reports against the same message. This separation keeps the Communication Domain scalable, supports future moderation automation, and ensures that message history and moderation history evolve independently.

---

 

# **VideoSession**

> [!IMPORTANT]
> **Phase 4 Architecture Reconciliation (ADR-015):**
> This `VideoSession` schema definition is **DEFERRED** and **NOT implemented** for Phase 4 Marketplace Consultations. Phase 4 Marketplace Consultations rely exclusively on the `Consultation` aggregate (`Consultation.schema.ts`) for business scheduling, authorization, and room identity (`consultation:<id>`). WebRTC signaling is transient via Socket.IO without database persistence. The schema below is reserved for post-acquisition 1-on-1 coaching relationship video sessions.

---

# **1\. Purpose**

The **VideoSession** collection represents the technical video communication session between a trainer and a client during a consultation or an active coaching relationship.

Unlike the **Consultation** aggregate, which represents the business appointment, the VideoSession aggregate manages the **WebRTC session lifecycle**, connection metadata, participants, and session analytics.

This collection is responsible for:

* WebRTC session lifecycle  
* Room management  
* Participant connections  
* Session timing  
* Connection statistics  
* Session recording metadata  
* Technical audit information

It does **not** schedule consultations or manage coaching appointments. Those responsibilities belong to the Consultation Domain. The VideoSession aggregate owns only the technical communication session.

---

# **2\. Collection**

| Property | Value |
| ----- | ----- |
| Collection Name | `videoSessions` |
| Aggregate Root | VideoSession |
| Owner Domain | Video Session |
| Parent Aggregate | Consultation |
| MongoDB Collection | videoSessions |
| Soft Delete | No |
| Historical Records | Permanent |
| Ownership | One Consultation → One VideoSession |

---

# **3\. Mongoose Model Name**

VideoSession

Export

export const VideoSessionModel

---

# **4\. TypeScript Interfaces**

## **Enums**

VideoSessionStatus

ParticipantRole

RecordingStatus

---

## **Embedded Interfaces**

SessionParticipant

ConnectionStatistics

RecordingMetadata

---

## **Base Interface**

VideoSession

---

## **Document Interface**

VideoSessionDocument

Extends

HydratedDocument\<VideoSession\>

---

## **Model Interface**

VideoSessionModel

Extends

Model\<VideoSession\>

---

## **Query Helper Interface**

VideoSessionQueryHelpers

---

# **5\. Enums**

## **VideoSessionStatus**

CREATED

WAITING

ACTIVE

ENDED

FAILED

---

## **ParticipantRole**

TRAINER

CLIENT

---

## **RecordingStatus**

NOT\_RECORDED

RECORDING

AVAILABLE

FAILED

---

# **6\. Embedded Schemas**

## **SessionParticipant**

| Field | Type |
| ----- | ----- |
| userId | ObjectId |
| role | ParticipantRole |
| joinedAt | Date |
| leftAt | Date |
| connectionState | String |

Purpose

Stores each participant's session information.

---

## **ConnectionStatistics**

| Field | Type |
| ----- | ----- |
| durationSeconds | Number |
| averageLatencyMs | Number |
| reconnectCount | Number |
| networkQuality | String |

Purpose

Stores technical connection statistics.

---

## **RecordingMetadata**

| Field | Type |
| ----- | ----- |
| recordingStatus | RecordingStatus |
| recordingUrl | String |
| recordingSize | Number |
| recordingDuration | Number |

Purpose

Stores recording information if recording is enabled.

Reason for embedding

Participants, statistics, and recording metadata exist only within one video session.

---

# **7\. Main Schema**

| Field | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| \_id | ObjectId | ✓ | Primary Key |
| consultationId | ObjectId | ✓ | Reference → Consultation |
| coachingRelationshipId | ObjectId | No | Reference → CoachingRelationship |
| roomId | String | ✓ | WebRTC room identifier |
| participants | SessionParticipant\[\] | ✓ | Connected users |
| sessionStatus | VideoSessionStatus | ✓ | Session lifecycle |
| startedAt | Date | No | Session start |
| endedAt | Date | No | Session end |
| connectionStatistics | ConnectionStatistics | No | Session analytics |
| recording | RecordingMetadata | No | Recording metadata |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

---

# **8\. Validation**

## **Required**

* consultationId  
* roomId  
* participants  
* sessionStatus

---

## **Consultation**

* Must reference an existing consultation.  
* One video session per consultation.

---

## **Room ID**

* Required.  
* Unique.  
* Immutable.

---

## **Participants**

* Exactly one trainer.  
* Exactly one client.  
* Both must belong to the consultation.

---

## **Recording**

* Recording URL required only when recording is available.

---

## **Status**

Must follow the approved Video Session state machine.

---

# **9\. Indexes**

## **Unique**

consultationId

roomId

---

## **Single Indexes**

sessionStatus

startedAt

endedAt

---

## **Compound Indexes**

sessionStatus \+ startedAt

consultationId \+ sessionStatus

Useful for

* Live sessions  
* Session history  
* Analytics  
* Admin monitoring

---

# **10\. Virtuals**

## **id**

\_id → id

---

## **isLive**

Returns

sessionStatus \=== ACTIVE

---

## **duration**

Calculated from

endedAt \- startedAt

---

## **participantCount**

Returns

participants.length

---

## **isRecorded**

Returns

recording.recordingStatus \=== AVAILABLE

---

# **11\. Middleware**

## **Pre Validate**

* Validate participant roles.  
* Validate room ID.

---

## **Pre Save**

* Prevent room ID modification.  
* Validate state transitions.  
* Calculate duration.

---

## **Post Save**

None.

Notifications, WebRTC signaling, and Socket.IO events belong to the service layer.

---

# **12\. Instance Methods**

start()

end()

addParticipant()

removeParticipant()

calculateDuration()

isLive()

---

# **13\. Static Methods**

findLive()

findByConsultation()

findHistory()

findRecorded()

findActiveSessions()

---

# **14\. Query Helpers**

.live()

.recorded()

.byConsultation()

.recent()

.ended()

Example

VideoSessionModel.find()  
    .live()  
    .recent();

---

# **15\. Immutable Fields**

Immutable

consultationId

coachingRelationshipId

roomId

createdAt

Mutable

participants

sessionStatus

startedAt

endedAt

connectionStatistics

recording

updatedAt

Reason

The session identity must remain stable, while participant state and connection information naturally evolve throughout the session.

---

# **16\. Serialization**

Hide

\_\_v

Expose

id

consultationId

coachingRelationshipId

roomId

participants

sessionStatus

startedAt

endedAt

connectionStatistics

recording

createdAt

updatedAt

Convert

\_id → id

Remove

\_\_v

---

# **17\. Plugins**

Recommended Plugins

Serialization Plugin

Audit Plugin

Optimistic Concurrency Plugin

Do **not** use

Soft Delete Plugin

Reason

Video sessions form part of the platform's communication audit trail. Historical session data is valuable for troubleshooting, coaching history, analytics, and compliance. Sessions should never be deleted once created.

---

# **18\. Performance Notes**

## **Read Patterns**

Most common lookups

* Live sessions  
* Consultation history  
* Video analytics  
* Session troubleshooting

---

## **Write Frequency**

Medium

Occurs during

* Session creation  
* Participant joins/leaves  
* Connection updates  
* Session completion

---

## **Expected Growth**

One document per consultation.

---

## **Document Size**

Medium (approximately **3–10 KB**).

---

## **Design Decisions**

* Business scheduling remains in the `Consultation` aggregate.  
* Technical communication is isolated inside `VideoSession`.  
* WebRTC signaling remains outside MongoDB.  
* Connection statistics are embedded because they belong exclusively to one session.  
* Supports future recording functionality without affecting the Consultation Domain.  
* Designed specifically for WebRTC-based communication while remaining provider-independent for future expansion.

---

# **19\. Example Document**

{  
  "\_id": "6869abaa5c4e8f12ab123456",  
  "consultationId": "68684af75c4e8f12ab654321",  
  "coachingRelationshipId": "686892aa5c4e8f12ab987654",  
  "roomId": "consult\_room\_9F4D72",  
  "participants": \[  
    {  
      "userId": "68652b7f5c4e8f12ab222222",  
      "role": "TRAINER",  
      "joinedAt": "2026-07-06T09:00:02.000Z",  
      "leftAt": "2026-07-06T09:45:00.000Z",  
      "connectionState": "CONNECTED"  
    },  
    {  
      "userId": "68652b7f5c4e8f12ab333333",  
      "role": "CLIENT",  
      "joinedAt": "2026-07-06T09:00:10.000Z",  
      "leftAt": "2026-07-06T09:45:00.000Z",  
      "connectionState": "CONNECTED"  
    }  
  \],  
  "sessionStatus": "ENDED",  
  "startedAt": "2026-07-06T09:00:00.000Z",  
  "endedAt": "2026-07-06T09:45:00.000Z",  
  "connectionStatistics": {  
    "durationSeconds": 2700,  
    "averageLatencyMs": 42,  
    "reconnectCount": 1,  
    "networkQuality": "GOOD"  
  },  
  "recording": {  
    "recordingStatus": "NOT\_RECORDED",  
    "recordingUrl": null,  
    "recordingSize": null,  
    "recordingDuration": null  
  },  
  "createdAt": "2026-07-06T08:59:45.000Z",  
  "updatedAt": "2026-07-06T09:45:00.000Z"  
}

## **Design Review**

The `VideoSession` aggregate cleanly separates the **technical communication layer** from the **business scheduling layer**. While the `Consultation` aggregate governs appointment scheduling and lifecycle, the `VideoSession` aggregate manages WebRTC-specific concerns such as participants, connection quality, room management, and recording metadata. This separation follows KizunaFit's domain-driven architecture by isolating infrastructure concerns from business workflows, resulting in a scalable and provider-independent design suitable for future enhancements such as recording, analytics, and alternative video providers.

---

 

# **Review**

---

# **1\. Purpose**

The **Review** collection stores feedback submitted by clients after completing a coaching relationship.

It serves as the public reputation system for trainers while providing valuable feedback about the coaching experience.

This collection is responsible for:

* Client reviews  
* Trainer ratings  
* Written feedback  
* Category ratings  
* Public testimonials  
* Review moderation  
* Reputation scoring

It does **not** manage coaching evaluations or administrative moderation actions. Those belong to their respective domains. The Review aggregate owns only the client's feedback.

---

# **2\. Collection**

| Property | Value |
| ----- | ----- |
| Collection Name | `reviews` |
| Aggregate Root | Review |
| Owner Domain | Review |
| Parent Aggregate | CoachingRelationship |
| MongoDB Collection | reviews |
| Soft Delete | No |
| Historical Records | Permanent |
| Ownership | One CoachingRelationship → One Review |

---

# **3\. Mongoose Model Name**

Review

Export

export const ReviewModel

---

# **4\. TypeScript Interfaces**

## **Enums**

ReviewStatus

RecommendationType

---

## **Embedded Interfaces**

RatingBreakdown

ReviewerSnapshot

ModerationReview

---

## **Base Interface**

Review

---

## **Document Interface**

ReviewDocument

Extends

HydratedDocument\<Review\>

---

## **Model Interface**

ReviewModel

Extends

Model\<Review\>

---

## **Query Helper Interface**

ReviewQueryHelpers

---

# **5\. Enums**

## **ReviewStatus**

PENDING

PUBLISHED

HIDDEN

REJECTED

---

## **RecommendationType**

HIGHLY\_RECOMMEND

RECOMMEND

NOT\_RECOMMEND

---

# **6\. Embedded Schemas**

## **RatingBreakdown**

| Field | Type |
| ----- | ----- |
| communication | Number |
| professionalism | Number |
| knowledge | Number |
| punctuality | Number |
| support | Number |

Purpose

Stores category-based ratings.

---

## **ReviewerSnapshot**

| Field | Type |
| ----- | ----- |
| clientId | ObjectId |
| fullName | String |
| profileImage | String |

Purpose

Preserves reviewer information.

---

## **ModerationReview**

| Field | Type |
| ----- | ----- |
| reviewedBy | ObjectId |
| reviewedAt | Date |
| moderationNotes | String |

Purpose

Stores moderation information.

Reason for embedding

These objects belong exclusively to one review.

---

# **7\. Main Schema**

| Field | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| \_id | ObjectId | ✓ | Primary Key |
| coachingRelationshipId | ObjectId | ✓ | Reference → CoachingRelationship |
| trainerId | ObjectId | ✓ | Reference → User |
| clientId | ObjectId | ✓ | Reference → User |
| reviewerSnapshot | ReviewerSnapshot | ✓ | Client snapshot |
| overallRating | Number | ✓ | 1–5 stars |
| ratingBreakdown | RatingBreakdown | ✓ | Category ratings |
| recommendation | RecommendationType | ✓ | Recommendation level |
| title | String | ✓ | Review title |
| comment | String | ✓ | Written review |
| status | ReviewStatus | ✓ | Review lifecycle |
| moderation | ModerationReview | No | Moderation details |
| publishedAt | Date | No | Publication timestamp |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

---

# **8\. Validation**

## **Required**

* coachingRelationshipId  
* trainerId  
* clientId  
* reviewerSnapshot  
* overallRating  
* ratingBreakdown  
* recommendation  
* title  
* comment  
* status

---

## **Coaching Relationship**

* Must be `COMPLETED`.  
* Only one review per coaching relationship.

---

## **Ratings**

* Overall rating between **1–5**.  
* Category ratings between **1–5**.

---

## **Comment**

* Trimmed.  
* Maximum length configurable.  
* Cannot be empty.

---

## **Status**

Must follow the approved Review lifecycle.

---

# **9\. Indexes**

## **Unique**

coachingRelationshipId

---

## **Single Indexes**

trainerId

clientId

status

overallRating

publishedAt

---

## **Compound Indexes**

trainerId \+ status

trainerId \+ overallRating

status \+ publishedAt

Useful for

* Trainer profile  
* Public reviews  
* Rating analytics  
* Admin moderation

---

# **10\. Virtuals**

## **id**

\_id → id

---

## **isPublished**

Returns

status \=== PUBLISHED

---

## **averageCategoryRating**

Calculated from

ratingBreakdown

---

## **isPositiveReview**

Returns

overallRating \>= 4

---

# **11\. Middleware**

## **Pre Validate**

* Trim title.  
* Trim comment.  
* Validate ratings.

---

## **Pre Save**

* Prevent duplicate reviews.  
* Calculate average rating.  
* Validate status transitions.

---

## **Post Save**

None.

Updating trainer rating statistics belongs to the service layer.

---

# **12\. Instance Methods**

publish()

hide()

reject()

calculateAverageRating()

isPublished()

---

# **13\. Static Methods**

findPublished()

findByTrainer()

findLatest()

findTopRated()

calculateTrainerRating()

---

# **14\. Query Helpers**

.published()

.byTrainer()

.positive()

.recent()

.topRated()

Example

ReviewModel.find()  
    .published()  
    .byTrainer(trainerId);

---

# **15\. Immutable Fields**

Immutable

coachingRelationshipId

trainerId

clientId

reviewerSnapshot

createdAt

Mutable

title

comment

status

moderation

publishedAt

updatedAt

Reason

The participants and reviewed coaching relationship must remain historically accurate.

---

# **16\. Serialization**

Hide

\_\_v

Expose

id

coachingRelationshipId

trainerId

clientId

reviewerSnapshot

overallRating

ratingBreakdown

recommendation

title

comment

status

publishedAt

createdAt

updatedAt

Convert

\_id → id

Remove

\_\_v

---

# **17\. Plugins**

Recommended Plugins

Serialization Plugin

Audit Plugin

Optimistic Concurrency Plugin

Do **not** use

Soft Delete Plugin

Reason

Reviews contribute to the trainer's long-term reputation and platform trust. Even hidden or rejected reviews should remain available for moderation history, analytics, and dispute resolution.

---

# **18\. Performance Notes**

## **Read Patterns**

Most common lookups

* Trainer profile  
* Public reviews  
* Rating summaries  
* Latest reviews  
* Admin moderation

---

## **Write Frequency**

Low

Occurs during

* Coaching completion  
* Client feedback  
* Moderation

---

## **Expected Growth**

One review per completed coaching relationship.

---

## **Document Size**

Small to Medium (approximately **2–5 KB**).

---

## **Design Decisions**

* One review per coaching relationship.  
* Category ratings are embedded because they belong exclusively to one review.  
* Reviewer information is snapshotted to preserve historical accuracy.  
* Trainer statistics are calculated outside the aggregate.  
* Moderation remains independent from review persistence.  
* Optimized for public profile queries and reputation analytics.

---

# **19\. Example Document**

{  
  "\_id": "6869c8aa5c4e8f12ab123456",  
  "coachingRelationshipId": "686892aa5c4e8f12ab654321",  
  "trainerId": "68652b7f5c4e8f12ab222222",  
  "clientId": "68652b7f5c4e8f12ab333333",  
  "reviewerSnapshot": {  
    "clientId": "68652b7f5c4e8f12ab333333",  
    "fullName": "Mohammed Nihal K",  
    "profileImage": "https://cdn.kizunafit.com/profile/client.jpg"  
  },  
  "overallRating": 5,  
  "ratingBreakdown": {  
    "communication": 5,  
    "professionalism": 5,  
    "knowledge": 5,  
    "punctuality": 5,  
    "support": 5  
  },  
  "recommendation": "HIGHLY\_RECOMMEND",  
  "title": "Excellent Coaching Experience",  
  "comment": "The trainer was highly professional and helped me achieve my fitness goals with personalized guidance.",  
  "status": "PUBLISHED",  
  "moderation": null,  
  "publishedAt": "2026-10-01T09:00:00.000Z",  
  "createdAt": "2026-10-01T09:00:00.000Z",  
  "updatedAt": "2026-10-01T09:00:00.000Z"  
}

## **Design Review**

The `Review` aggregate provides the platform's public reputation system by capturing structured client feedback after the completion of a coaching relationship. By enforcing one review per coaching relationship, preserving immutable reviewer snapshots, and separating moderation from review persistence, the design ensures fairness, historical integrity, and efficient reputation analytics. This aggregate complements the internal `CoachingEvaluation` aggregate by exposing client feedback publicly while keeping professional coaching assessments private.

---

 

# **AdministrativeAction**

---

# **1\. Purpose**

The **AdministrativeAction** collection records every administrative action performed by platform administrators against users, content, coaching relationships, or platform resources.

It serves as the platform's official administrative audit trail, ensuring every moderation, enforcement, and management decision is permanently recorded.

This collection is responsible for:

* Administrative actions  
* User moderation  
* Content moderation  
* Account suspension  
* Account banning  
* Coaching intervention  
* Administrative audit history

It does **not** store platform settings or configurations. Those belong to the PlatformConfiguration aggregate. The AdministrativeAction aggregate owns only the administrative event.

---

# **2\. Collection**

| Property | Value |
| ----- | ----- |
| Collection Name | `administrativeActions` |
| Aggregate Root | AdministrativeAction |
| Owner Domain | Administration |
| Parent Aggregate | None |
| MongoDB Collection | administrativeActions |
| Soft Delete | No |
| Historical Records | Permanent |
| Ownership | Platform-owned |

---

# **3\. Mongoose Model Name**

AdministrativeAction

Export

export const AdministrativeActionModel

---

# **4\. TypeScript Interfaces**

## **Enums**

AdministrativeActionType

AdministrativeTargetType

AdministrativeActionStatus

---

## **Embedded Interfaces**

AdministratorSnapshot

TargetReference

AdministrativeReason

AdministrativeOutcome

---

## **Base Interface**

AdministrativeAction

---

## **Document Interface**

AdministrativeActionDocument

Extends

HydratedDocument\<AdministrativeAction\>

---

## **Model Interface**

AdministrativeActionModel

Extends

Model\<AdministrativeAction\>

---

## **Query Helper Interface**

AdministrativeActionQueryHelpers

---

# **5\. Enums**

## **AdministrativeActionType**

WARNING

ACCOUNT\_SUSPENSION

ACCOUNT\_BAN

MESSAGE\_REMOVAL

REVIEW\_REMOVAL

COACHING\_TERMINATION

TRAINER\_VERIFICATION\_APPROVAL

TRAINER\_VERIFICATION\_REJECTION

PLATFORM\_CONFIGURATION\_CHANGE

OTHER

---

## **AdministrativeTargetType**

USER

MESSAGE

REVIEW

COACHING\_RELATIONSHIP

TRAINER\_PROFILE

PLATFORM

---

## **AdministrativeActionStatus**

PENDING

EXECUTED

REVERTED

FAILED

---

# **6\. Embedded Schemas**

## **AdministratorSnapshot**

| Field | Type |
| ----- | ----- |
| adminId | ObjectId |
| fullName | String |

Purpose

Preserves administrator identity.

---

## **TargetReference**

| Field | Type |
| ----- | ----- |
| targetId | ObjectId |
| targetType | AdministrativeTargetType |

Purpose

References the affected resource.

---

## **AdministrativeReason**

| Field | Type |
| ----- | ----- |
| reason | String |
| evidence | String\[\] |

Purpose

Stores justification for the action.

---

## **AdministrativeOutcome**

| Field | Type |
| ----- | ----- |
| executedAt | Date |
| result | String |

Purpose

Stores execution result.

Reason for embedding

These objects exist only within one administrative action.

---

# **7\. Main Schema**

| Field | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| \_id | ObjectId | ✓ | Primary Key |
| administrator | AdministratorSnapshot | ✓ | Admin snapshot |
| target | TargetReference | ✓ | Action target |
| actionType | AdministrativeActionType | ✓ | Action performed |
| reason | AdministrativeReason | ✓ | Justification |
| outcome | AdministrativeOutcome | No | Execution outcome |
| status | AdministrativeActionStatus | ✓ | Action lifecycle |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

---

# **8\. Validation**

## **Required**

* administrator  
* target  
* actionType  
* reason  
* status

---

## **Target**

* Must reference an existing resource.  
* Target type must match referenced collection.

---

## **Reason**

* Required.  
* Trimmed.  
* Evidence URLs must be valid.

---

## **Status**

Must follow the approved Administrative Action lifecycle.

---

# **9\. Indexes**

## **Single Indexes**

actionType

status

createdAt

---

## **Compound Indexes**

target.targetId \+ target.targetType

administrator.adminId \+ createdAt

status \+ createdAt

Useful for

* Audit logs  
* User moderation history  
* Administrative reporting

---

# **10\. Virtuals**

## **id**

\_id → id

---

## **isExecuted**

Returns

status \=== EXECUTED

---

## **hasOutcome**

Returns

outcome \!= null

---

# **11\. Middleware**

## **Pre Validate**

* Trim reason.  
* Validate target.

---

## **Pre Save**

* Validate lifecycle transition.  
* Prevent target modification.

---

## **Post Save**

None.

Actual enforcement is handled by the service layer.

---

# **12\. Instance Methods**

execute()

revert()

fail()

isExecuted()

---

# **13\. Static Methods**

findPending()

findExecuted()

findByAdministrator()

findByTarget()

findRecent()

---

# **14\. Query Helpers**

.executed()

.pending()

.byAdministrator()

.byTarget()

.recent()

Example

AdministrativeActionModel.find()  
    .executed()  
    .recent();

---

# **15\. Immutable Fields**

Immutable

administrator

target

actionType

reason

createdAt

Mutable

status

outcome

updatedAt

Reason

Administrative actions form the platform's permanent audit trail.

---

# **16\. Serialization**

Hide

\_\_v

Expose

id

administrator

target

actionType

reason

outcome

status

createdAt

updatedAt

Convert

\_id → id

Remove

\_\_v

---

# **17\. Plugins**

Recommended Plugins

Serialization Plugin

Audit Plugin

Optimistic Concurrency Plugin

Do **not** use

Soft Delete Plugin

Reason

Administrative actions are legal and audit records that must remain permanently available for compliance, investigations, and dispute resolution.

---

# **18\. Performance Notes**

## **Read Patterns**

Most common lookups

* Admin dashboard  
* Audit logs  
* Moderation history  
* Compliance reports

---

## **Write Frequency**

Low

Occurs during

* Moderation  
* Administrative operations  
* Platform management

---

## **Expected Growth**

Moderate.

Only administrators generate records.

---

## **Document Size**

Small (approximately **1–4 KB**).

---

## **Design Decisions**

* Every administrative operation creates an immutable audit record.  
* Administrator identity is snapshotted for historical integrity.  
* Target references remain generic to support multiple platform resources.  
* Enforcement logic remains outside the aggregate.  
* Designed for compliance, traceability, and future regulatory requirements.

---

# **19\. Example Document**

{  
  "\_id": "6869f5aa5c4e8f12ab123456",  
  "administrator": {  
    "adminId": "68652b7f5c4e8f12ab999999",  
    "fullName": "Platform Admin"  
  },  
  "target": {  
    "targetId": "68696daa5c4e8f12ab654321",  
    "targetType": "MESSAGE"  
  },  
  "actionType": "MESSAGE\_REMOVAL",  
  "reason": {  
    "reason": "Violation of community guidelines.",  
    "evidence": \[  
      "https://storage.kizunafit.com/evidence/report-001.png"  
    \]  
  },  
  "outcome": {  
    "executedAt": "2026-07-06T15:30:00.000Z",  
    "result": "Message successfully removed."  
  },  
  "status": "EXECUTED",  
  "createdAt": "2026-07-06T15:29:00.000Z",  
  "updatedAt": "2026-07-06T15:30:00.000Z"  
}

## **Design Review**

The `AdministrativeAction` aggregate serves as the platform's authoritative administrative audit log. Every moderation decision, enforcement action, and management operation is captured as an immutable historical record, ensuring traceability, accountability, and compliance. By separating administrative events from the resources they affect, the design remains extensible, allowing future platform features and moderation capabilities to reuse the same audit infrastructure without altering existing aggregates.

---

 

# **PlatformConfiguration**

---

# **1\. Purpose**

The **PlatformConfiguration** collection stores global platform settings that control the behavior, limits, defaults, and feature availability across the KizunaFit platform.

It serves as the centralized configuration source for administrators, allowing platform behavior to be changed without modifying application code.

This collection is responsible for:

* Global platform settings  
* Feature flags  
* Business rule configuration  
* Platform limits  
* Payment configuration  
* Security configuration  
* Default application settings

It does **not** store user preferences or coaching data. Those belong to their respective domains. The PlatformConfiguration aggregate owns only system-wide configuration.

---

# **2\. Collection**

| Property | Value |
| ----- | ----- |
| Collection Name | `platformConfigurations` |
| Aggregate Root | PlatformConfiguration |
| Owner Domain | Administration |
| Parent Aggregate | None |
| MongoDB Collection | platformConfigurations |
| Soft Delete | No |
| Historical Records | Versioned |
| Ownership | Platform-owned |
| Expected Documents | One Active Configuration |

---

# **3\. Mongoose Model Name**

PlatformConfiguration

Export

export const PlatformConfigurationModel

---

# **4\. TypeScript Interfaces**

## **Enums**

ConfigurationStatus

Environment

ConfigurationCategory

---

## **Embedded Interfaces**

AuthenticationSettings

PaymentSettings

CommunicationSettings

WorkoutSettings

NutritionSettings

ReviewSettings

SecuritySettings

FeatureFlags

MaintenanceSettings

---

## **Base Interface**

PlatformConfiguration

---

## **Document Interface**

PlatformConfigurationDocument

Extends

HydratedDocument\<PlatformConfiguration\>

---

## **Model Interface**

PlatformConfigurationModel

Extends

Model\<PlatformConfiguration\>

---

## **Query Helper Interface**

PlatformConfigurationQueryHelpers

---

# **5\. Enums**

## **ConfigurationStatus**

ACTIVE

INACTIVE

ARCHIVED

---

## **Environment**

DEVELOPMENT

STAGING

PRODUCTION

---

## **ConfigurationCategory**

SYSTEM

SECURITY

PAYMENT

COMMUNICATION

COACHING

FEATURE\_FLAGS

---

# **6\. Embedded Schemas**

## **AuthenticationSettings**

| Field | Type |
| ----- | ----- |
| jwtExpirationMinutes | Number |
| refreshTokenDays | Number |
| otpExpirationMinutes | Number |
| maxLoginAttempts | Number |

Purpose

Stores authentication rules.

---

## **PaymentSettings**

| Field | Type |
| ----- | ----- |
| supportedCurrencies | String\[\] |
| platformFeePercentage | Number |
| defaultCurrency | String |

Purpose

Stores payment configuration.

---

## **CommunicationSettings**

| Field | Type |
| ----- | ----- |
| maxMessageLength | Number |
| maxAttachmentSizeMB | Number |
| videoCallDurationMinutes | Number |

Purpose

Stores communication limits.

---

## **WorkoutSettings**

| Field | Type |
| ----- | ----- |
| maxWorkoutDays | Number |
| maxExercisesPerWorkout | Number |

Purpose

Stores workout constraints.

---

## **NutritionSettings**

| Field | Type |
| ----- | ----- |
| maxMealsPerDay | Number |
| defaultHydrationGoalLiters | Number |

Purpose

Stores nutrition defaults.

---

## **ReviewSettings**

| Field | Type |
| ----- | ----- |
| allowReviewEditing | Boolean |
| reviewEditWindowHours | Number |

Purpose

Stores review rules.

---

## **SecuritySettings**

| Field | Type |
| ----- | ----- |
| passwordMinLength | Number |
| requireTwoFactorAuth | Boolean |

Purpose

Stores security policies.

---

## **FeatureFlags**

| Field | Type |
| ----- | ----- |
| videoSessionsEnabled | Boolean |
| trainerMarketplaceEnabled | Boolean |
| reviewsEnabled | Boolean |
| nutritionEnabled | Boolean |

Purpose

Controls feature availability.

---

## **MaintenanceSettings**

| Field | Type |
| ----- | ----- |
| maintenanceMode | Boolean |
| maintenanceMessage | String |

Purpose

Stores maintenance configuration.

Reason for embedding

These settings have no independent lifecycle and together represent one platform configuration.

---

# **7\. Main Schema**

| Field | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| \_id | ObjectId | ✓ | Primary Key |
| version | Number | ✓ | Configuration version |
| environment | Environment | ✓ | Target environment |
| authentication | AuthenticationSettings | ✓ | Authentication settings |
| payment | PaymentSettings | ✓ | Payment settings |
| communication | CommunicationSettings | ✓ | Communication settings |
| workout | WorkoutSettings | ✓ | Workout settings |
| nutrition | NutritionSettings | ✓ | Nutrition settings |
| review | ReviewSettings | ✓ | Review settings |
| security | SecuritySettings | ✓ | Security settings |
| featureFlags | FeatureFlags | ✓ | Platform features |
| maintenance | MaintenanceSettings | ✓ | Maintenance settings |
| status | ConfigurationStatus | ✓ | Configuration lifecycle |
| activatedAt | Date | No | Activation timestamp |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

---

# **8\. Validation**

## **Required**

* version  
* environment  
* authentication  
* payment  
* communication  
* workout  
* nutrition  
* review  
* security  
* featureFlags  
* maintenance  
* status

---

## **Version**

* Starts at **1**  
* Sequential  
* Immutable

---

## **Environment**

* Only one ACTIVE configuration per environment.

---

## **Percentages**

* Between **0–100**

---

## **Limits**

* All limits must be greater than zero.

---

## **Status**

Must follow the approved Platform Configuration lifecycle.

---

# **9\. Indexes**

## **Unique**

environment \+ status (ACTIVE)

version

---

## **Single Indexes**

status

environment

activatedAt

---

## **Compound Indexes**

environment \+ version

status \+ activatedAt

Useful for

* Configuration loading  
* Rollback  
* Version history

---

# **10\. Virtuals**

## **id**

\_id → id

---

## **isActive**

Returns

status \=== ACTIVE

---

## **isMaintenanceMode**

Returns

maintenance.maintenanceMode

---

## **enabledFeatureCount**

Calculated from

featureFlags

---

# **11\. Middleware**

## **Pre Validate**

* Validate limits.  
* Validate percentages.  
* Validate feature flags.

---

## **Pre Save**

* Ensure only one ACTIVE configuration per environment.  
* Prevent version modification.  
* Validate lifecycle transitions.

---

## **Post Save**

None.

Configuration cache invalidation belongs to the service layer.

---

# **12\. Instance Methods**

activate()

archive()

enableFeature()

disableFeature()

isMaintenanceMode()

---

# **13\. Static Methods**

findActive()

findByEnvironment()

findLatest()

findVersion()

rollback()

---

# **14\. Query Helpers**

.active()

.production()

.latest()

.byEnvironment()

Example

PlatformConfigurationModel.find()  
    .active()  
    .production();

---

# **15\. Immutable Fields**

Immutable

version

environment

createdAt

Mutable

authentication

payment

communication

workout

nutrition

review

security

featureFlags

maintenance

status

activatedAt

updatedAt

Reason

Each configuration version represents a historical snapshot of the platform's behavior.

---

# **16\. Serialization**

Hide

\_\_v

Expose

id

version

environment

authentication

payment

communication

workout

nutrition

review

security

featureFlags

maintenance

status

activatedAt

createdAt

updatedAt

Convert

\_id → id

Remove

\_\_v

---

# **17\. Plugins**

Recommended Plugins

Serialization Plugin

Audit Plugin

Optimistic Concurrency Plugin

Do **not** use

Soft Delete Plugin

Reason

Platform configurations define the operational history of the platform. Previous versions should always remain available for auditing, rollback, troubleshooting, and historical reference.

---

# **18\. Performance Notes**

## **Read Patterns**

Most common lookups

* Application startup  
* Feature flag checks  
* Business rule validation  
* Configuration cache refresh

---

## **Write Frequency**

Very Low

Occurs during

* Platform administration  
* Feature rollout  
* Business rule updates  
* System maintenance

---

## **Expected Growth**

Very small.

Typically only a few configuration versions are created each year.

---

## **Document Size**

Medium (approximately **5–15 KB**).

---

## **Design Decisions**

* One active configuration per environment.  
* Configuration is fully embedded for fast loading.  
* Versioning supports rollback and historical auditing.  
* Feature flags enable gradual rollout of platform capabilities.  
* Business rules are centralized to eliminate hard-coded configuration values throughout the application.  
* Optimized for read-heavy workloads by allowing the entire configuration to be loaded with a single database query and cached by the application.

---

# **19\. Example Document**

{  
  "\_id": "686a15aa5c4e8f12ab123456",  
  "version": 3,  
  "environment": "PRODUCTION",  
  "authentication": {  
    "jwtExpirationMinutes": 15,  
    "refreshTokenDays": 30,  
    "otpExpirationMinutes": 5,  
    "maxLoginAttempts": 5  
  },  
  "payment": {  
    "supportedCurrencies": \[  
      "INR",  
      "USD"  
    \],  
    "platformFeePercentage": 10,  
    "defaultCurrency": "INR"  
  },  
  "communication": {  
    "maxMessageLength": 5000,  
    "maxAttachmentSizeMB": 20,  
    "videoCallDurationMinutes": 60  
  },  
  "workout": {  
    "maxWorkoutDays": 7,  
    "maxExercisesPerWorkout": 20  
  },  
  "nutrition": {  
    "maxMealsPerDay": 8,  
    "defaultHydrationGoalLiters": 3  
  },  
  "review": {  
    "allowReviewEditing": true,  
    "reviewEditWindowHours": 24  
  },  
  "security": {  
    "passwordMinLength": 8,  
    "requireTwoFactorAuth": false  
  },  
  "featureFlags": {  
    "videoSessionsEnabled": true,  
    "trainerMarketplaceEnabled": true,  
    "reviewsEnabled": true,  
    "nutritionEnabled": true  
  },  
  "maintenance": {  
    "maintenanceMode": false,  
    "maintenanceMessage": ""  
  },  
  "status": "ACTIVE",  
  "activatedAt": "2026-07-07T00:00:00.000Z",  
  "createdAt": "2026-07-07T00:00:00.000Z",  
  "updatedAt": "2026-07-07T00:00:00.000Z"  
}

## **Design Review**

The `PlatformConfiguration` aggregate acts as the centralized operational configuration for KizunaFit, encapsulating authentication policies, business rules, feature flags, platform limits, and maintenance settings in a single versioned document. By maintaining one active configuration per environment and preserving historical versions, the design supports safe rollouts, rapid rollback, operational auditing, and efficient application startup through a single cached configuration source. It cleanly separates operational configuration from business data, ensuring flexibility without requiring application code changes.

---

   
