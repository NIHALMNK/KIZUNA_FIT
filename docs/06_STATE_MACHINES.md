# **06\_STATE\_MACHINES**

# **KIZUNAFIT STATE MACHINES**

---

# **Introduction**

This document defines the official state machines of KIZUNAFIT.

The purpose of this document is to establish:

Valid States

Allowed Transitions

Forbidden Transitions

Lifecycle Ownership

Business Consistency

Every stateful business object in the platform must follow a defined state machine.

No business object may transition to a state that is not explicitly allowed.

---

# **State Machine Principles**

## **Principle 1**

States are business concepts.

States must represent meaningful business conditions.

---

## **Principle 2**

State transitions must be explicit.

Transitions never happen implicitly.

---

## **Principle 3**

Historical states are immutable.

State history must be preserved.

---

## **Principle 4**

Forbidden transitions must remain forbidden.

Developers may not bypass lifecycle rules.

---

# **STATE MACHINE 1**

# **Trainer Request**

## **Domain**

Marketplace

---

## **Purpose**

Manage trainer request lifecycle.

---

## **States**

REQUEST\_PENDING

REQUEST\_ACCEPTED

REQUEST\_REJECTED

REQUEST\_CANCELLED

---

## **Lifecycle**

REQUEST\_PENDING  
├── ACCEPT  
│   ↓  
│ REQUEST\_ACCEPTED  
│  
├── REJECT  
│   ↓  
│ REQUEST\_REJECTED  
│  
└── CANCEL  
    ↓  
REQUEST\_CANCELLED

---

## **Terminal States**

REQUEST\_ACCEPTED

REQUEST\_REJECTED

REQUEST\_CANCELLED

---

## **Forbidden Transitions**

REQUEST\_ACCEPTED  
→ REQUEST\_PENDING

REQUEST\_REJECTED  
→ REQUEST\_PENDING

REQUEST\_CANCELLED  
→ REQUEST\_PENDING

---

# **STATE MACHINE 2**

# **Acquisition Pipeline**

## **Domain**

Marketplace

---

## **Purpose**

Track complete client acquisition lifecycle.

---

## **Important Ownership Rule**

During the request phase, AcquisitionPipeline status is derived from the TrainerRequest lifecycle.

TrainerRequest remains the owner of request-level decisions.

AcquisitionPipeline remains the owner of acquisition progression.

---

## **States**

REQUEST\_PENDING

REQUEST\_ACCEPTED

CONSULTATION\_PENDING

CONSULTATION\_BOOKED

CONSULTATION\_COMPLETED

OFFER\_SENT

PAYMENT\_PENDING

SUBSCRIPTION\_ACTIVE

REJECTED

CANCELLED

EXPIRED

PAYMENT\_FAILED

SUBSCRIPTION\_COMPLETED

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

---

## **Alternative Paths**

REQUEST\_PENDING  
↓  
REJECTED

REQUEST\_PENDING  
↓  
CANCELLED

OFFER\_SENT  
↓  
EXPIRED

PAYMENT\_PENDING  
↓  
PAYMENT\_FAILED

---

## **Terminal States**

REJECTED

CANCELLED

EXPIRED

PAYMENT\_FAILED

SUBSCRIPTION\_COMPLETED

---

# **STATE MACHINE 3**

# **Consultation**

## **Domain**

Consultation

---

## **Purpose**

Manage consultation lifecycle.

---

## **States**

CREATED

SLOT\_BOOKED

SCHEDULED

COMPLETED

CANCELLED

NO\_SHOW

---

## **Lifecycle**

CREATED  
↓  
SLOT\_BOOKED  
↓  
SCHEDULED  
↓  
COMPLETED

---

## **Alternative Paths**

CREATED  
↓  
CANCELLED

SCHEDULED  
↓  
NO\_SHOW

---

## **Terminal States**

COMPLETED

CANCELLED

NO\_SHOW

---

# **STATE MACHINE 4**

# **Coaching Offer**

## **Domain**

Offer

---

## **Purpose**

Manage offer lifecycle.

---

## **States**

DRAFT

SENT

ACCEPTED

DECLINED

EXPIRED

---

## **Lifecycle**

DRAFT  
↓  
SENT  
↓  
ACCEPTED

---

## **Alternative Paths**

SENT  
↓  
DECLINED

SENT  
↓  
EXPIRED

---

## **Terminal States**

ACCEPTED

DECLINED

EXPIRED

---

## **Core Rule**

Accepted Offers Become Immutable

---

# **STATE MACHINE 5**

# **Payment**

## **Domain**

Payment

---

## **Purpose**

Manage payment processing lifecycle.

---

## **States**

CREATED

PROCESSING

SUCCESS

FAILED

PARTIALLY\_REFUNDED

REFUNDED

---

## **Lifecycle**

CREATED  
↓  
PROCESSING  
↓  
SUCCESS

---

## **Alternative Paths**

PROCESSING  
↓  
FAILED

SUCCESS  
↓  
PARTIALLY\_REFUNDED

SUCCESS  
↓  
REFUNDED

PARTIALLY\_REFUNDED  
↓  
REFUNDED

---

## **Terminal States**

FAILED

REFUNDED

---

# **STATE MACHINE 6**

# **Subscription**

## **Domain**

Payment

---

## **Purpose**

Manage coaching subscription lifecycle.

---

## **States**

PENDING

ACTIVE

COMPLETED

CANCELLED

REFUNDED

EXPIRED

---

## **Lifecycle**

PENDING  
↓  
ACTIVE  
↓  
COMPLETED

---

## **Alternative Paths**

ACTIVE  
↓  
CANCELLED

ACTIVE  
↓  
REFUNDED

ACTIVE  
↓  
EXPIRED

---

## **Terminal States**

COMPLETED

CANCELLED

REFUNDED

EXPIRED

---

# **STATE MACHINE 7**

# **Coaching Relationship**

## **Domain**

Coaching

---

## **Purpose**

Manage coaching engagement lifecycle.

---

## **States**

PENDING

ACTIVE

COMPLETED

CANCELLED

REFUNDED

DISPUTED

EXPIRED

---

## **Lifecycle**

PENDING  
↓  
ACTIVE  
↓  
COMPLETED

---

## **Alternative Paths**

ACTIVE  
↓  
CANCELLED

ACTIVE  
↓  
REFUNDED

ACTIVE  
↓  
DISPUTED

ACTIVE  
↓  
EXPIRED

---

## **Dispute Flow**

ACTIVE  
↓  
DISPUTED  
↓  
ACTIVE

or

ACTIVE  
↓  
DISPUTED  
↓  
REFUNDED

---

## **Terminal States**

COMPLETED

CANCELLED

REFUNDED

EXPIRED

---

# **STATE MACHINE 8**

# **Refund Request**

## **Domain**

Payment

---

## **Purpose**

Manage refund lifecycle.

---

## **States**

PENDING

UNDER\_REVIEW

APPROVED

PARTIALLY\_APPROVED

REJECTED

PROCESSED

CANCELLED

---

## **Lifecycle**

PENDING  
↓  
UNDER\_REVIEW

---

## **Outcomes**

UNDER\_REVIEW  
↓  
APPROVED  
↓  
PROCESSED

UNDER\_REVIEW  
↓  
PARTIALLY\_APPROVED  
↓  
PROCESSED

UNDER\_REVIEW  
↓  
REJECTED

UNDER\_REVIEW  
↓  
CANCELLED

---

## **Terminal States**

PROCESSED

REJECTED

CANCELLED

---

# **STATE MACHINE 9**

# **Dispute**

## **Domain**

Payment

---

## **Purpose**

Manage dispute lifecycle.

---

## **States**

OPEN

UNDER\_INVESTIGATION

RESOLVED

CLOSED

---

## **Lifecycle**

OPEN  
↓  
UNDER\_INVESTIGATION  
↓  
RESOLVED  
↓  
CLOSED

---

## **Terminal States**

CLOSED

---

# **STATE MACHINE 10**

# **Trainer Payout**

## **Domain**

Payment

---

## **Purpose**

Manage payout lifecycle.

---

## **States**

PENDING

ON\_HOLD

PROCESSING

PAID

FAILED

---

## **Lifecycle**

PENDING  
↓  
ON\_HOLD  
↓  
PROCESSING  
↓  
PAID

---

## **Alternative Path**

PROCESSING  
↓  
FAILED

---

## **Terminal States**

PAID

FAILED

---

# **STATE MACHINE 11**

# **Review**

## **Domain**

Review

---

## **Purpose**

Manage review lifecycle.

---

## **States**

DRAFT

PUBLISHED

LOCKED

REMOVED

---

## **Lifecycle**

DRAFT  
↓  
PUBLISHED  
↓  
LOCKED

---

## **Alternative Paths**

PUBLISHED  
↓  
REMOVED

LOCKED  
↓  
REMOVED

---

## **Rules**

Review Editable For 7 Days

After 7 Days  
↓  
LOCKED

---

## **Terminal States**

LOCKED

REMOVED

---

# **STATE MACHINE 12**

# **Trainer Status**

## **Domain**

Profile

---

## **Purpose**

Manage trainer marketplace availability.

---

## **States**

AVAILABLE

PAUSED

VACATION

SUSPENDED

BANNED

---

## **Allowed Transitions**

AVAILABLE  
↔  
PAUSED

AVAILABLE  
↔  
VACATION

AVAILABLE  
→  
SUSPENDED

PAUSED  
→  
SUSPENDED

VACATION  
→  
SUSPENDED

SUSPENDED  
→  
AVAILABLE

SUSPENDED  
→  
BANNED

---

## **Terminal State**

BANNED

---

## **Core Rule**

Only:

AVAILABLE

trainers may receive new coaching requests.

---

# **State Machine Summary**

Trainer Request

Acquisition Pipeline

Consultation

Coaching Offer

Payment

Subscription

Coaching Relationship

Refund Request

Dispute

Trainer Payout

Review

Trainer Status

---

## **Total State Machines**

12

---

# **Final Statement**

This document defines the official lifecycle rules of KIZUNAFIT.

Every service, API endpoint, database entity, workflow, and business process must respect the state transitions defined in this document.

If a transition is not explicitly allowed, it is considered forbidden.

State machines are the enforcement layer of the business rules and serve as the foundation for Entity Modeling and Database Design.

---

# **Status**

06\_STATE\_MACHINES

✅ APPROVED  
✅ LOCKED

