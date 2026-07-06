# **02\_BUSINESS\_RULES**

# **KIZUNAFIT BUSINESS RULES**

---

# **Introduction**

This document defines the official business rules governing KIZUNAFIT.

These rules are the highest authority after the Business Vision document.

All future architecture, database models, APIs, state machines, entity models, and implementations must comply with these rules.

If implementation conflicts with a business rule:

Business Rules Win

---

# **Core Marketplace Rules**

## **Rule 1**

# **One Active Acquisition Pipeline**

A client may participate in only one active acquisition pipeline at a time.

Purpose:

Prevent Trainer Competition For The Same Client

Prevent Duplicate Consultations

Prevent Multiple Unpaid Offers

Maintain Marketplace Fairness

---

### **Active Acquisition States**

The following states are considered active:

REQUEST\_PENDING

REQUEST\_ACCEPTED

CONSULTATION\_PENDING

CONSULTATION\_BOOKED

CONSULTATION\_COMPLETED

OFFER\_SENT

PAYMENT\_PENDING

SUBSCRIPTION\_ACTIVE

During these states:

Client Cannot Create Another Trainer Request

---

### **Closed Acquisition States**

The following states close the acquisition pipeline:

REJECTED

CANCELLED

EXPIRED

PAYMENT\_FAILED

SUBSCRIPTION\_COMPLETED

After closure:

Client May Begin A New Acquisition Pipeline

---

## **Rule 2**

# **One Active Trainer**

A client may have only one active trainer at a time.

Allowed:

Client  
↓  
One Trainer  
↓  
One Active Coaching Relationship

Not Allowed:

Client  
↓  
Multiple Active Trainers

Purpose:

Maintain Coaching Focus

Simplify Coaching Management

Reduce Version 1 Complexity

---

## **Rule 3**

# **Consultation Is Mandatory**

Every coaching purchase must begin with a consultation.

Required flow:

Trainer Request  
↓  
Consultation  
↓  
Offer  
↓  
Payment  
↓  
Coaching

Payment before consultation is prohibited.

---

## **Rule 4**

# **Coaching Relationship Required**

Every successful coaching purchase must create a CoachingRelationship.

No coaching functionality may exist without a CoachingRelationship.

This relationship becomes the ownership root for all coaching operations.

---

# **User Role Rules**

## **Rule 5**

# **Single Role Per Account**

Each account may have exactly one role.

Supported roles:

CLIENT

TRAINER

ADMIN

Role switching is not supported.

---

## **Rule 6**

# **Trainers Cannot Be Clients**

Version 1 does not support dual-role accounts.

A trainer account cannot act as a client.

A client account cannot act as a trainer.

Separate accounts are required.

---

## **Rule 7**

# **Admins Cannot Participate In Coaching**

Admin accounts exist solely for platform governance.

Admins cannot:

Offer Coaching

Purchase Coaching

Receive Payments

Receive Reviews

---

## **Rule 8**

# **Unique Email Addresses**

Each account must have a unique email address.

Duplicate email registration is prohibited.

---

# **Trainer Rules**

## **Rule 9**

# **Open Trainer Registration**

Any registered user may become a trainer.

Manual trainer approval is not required in Version 1\.

Trust is established through:

Reviews

Ratings

Showcase Content

Completed Relationships

Reputation Metrics

---

## **Rule 10**

# **Trainer Availability Status**

Every trainer must have one availability status.

Supported statuses:

AVAILABLE

PAUSED

VACATION

SUSPENDED

BANNED

Only AVAILABLE trainers may receive new requests.

---

## **Rule 11**

# **No Hard Client Limit**

Version 1 does not enforce a maximum client count.

Trainers may manage any number of coaching relationships.

However:

Trainer Availability For Live Coaching Sessions  
Must Respect Schedule Availability.

Future versions may introduce automated capacity management.

---

## **Rule 11A**

# **Live Session Exclusivity**

Live coaching sessions are exclusive.

A trainer may not be scheduled for overlapping live coaching sessions.

Only one live coaching session may occupy a time slot.

Session scheduling must respect trainer availability.

Purpose:

Prevent Double Booking

Protect Coaching Quality

Preserve Trainer Availability

---

## **Rule 12**

# **Trainer Pricing Model**

Trainers define:

Coaching Fee

The platform defines:

Platform Fee

Final amount:

Trainer Fee  
\+  
Platform Fee  
\=  
Client Payment

---

# **Client Rules**

## **Rule 13**

# **Request Cancellation**

Clients may cancel requests only while:

REQUEST\_PENDING

After trainer acceptance:

Self-Service Cancellation Is Prohibited

---

## **Rule 14**

# **Trainer Switching**

Clients may switch trainers only when:

Current Relationship Completed

or

Relationship Cancelled

---

## **Rule 15**

# **Progress Photo Privacy**

Progress photos are private.

Visible only to:

Client

Assigned Trainer

Never publicly visible.

---

## **Rule 16**

# **Review Eligibility**

A client may review a trainer only when:

Relationship Completed

Payment Successful

No Existing Review

Maximum:

One Relationship  
\=  
One Review

---

# **Consultation Rules**

## **Rule 17**

# **Consultation Creation**

Consultations may only be created after:

Trainer Request Accepted

---

## **Rule 18**

# **One Consultation Per Acquisition Pipeline**

Each acquisition pipeline may contain only one consultation.

---

## **Rule 19**

# **Consultation Purpose**

Consultations exist to:

Assess Goals

Evaluate Suitability

Discuss Coaching Scope

Understand Client Expectations

Consultations are not coaching sessions.

---

# **Offer Rules**

## **Rule 20**

# **Offer Creation**

Offers may be created only after:

Consultation Completed

---

## **Rule 21**

# **Offer Expiration**

Offers automatically expire after:

7 Days

unless accepted earlier.

---

## **Rule 22**

# **Immutable Offer Snapshot**

Offers must preserve:

Trainer Information

Pricing

Duration

Coaching Scope

Historical offers never change.

---

# **Payment Rules**

## **Rule 23**

# **Platform Managed Payments**

All payments must be processed through KIZUNAFIT.

Direct trainer-client payments are prohibited.

---

## **Rule 24**

# **Payment Required Before Coaching**

No coaching functionality becomes available until payment succeeds.

---

## **Rule 25**

# **Payment Verification**

Payment success must be confirmed through:

Razorpay Webhook Verification

Frontend success responses are never trusted.

---

## **Rule 26**

# **Immutable Financial Records**

The following records are immutable:

Payments

Transactions

Invoices

Payouts

Historical financial records must never be edited.

---

## **Rule 27**

# **Escrow-Based Payouts**

Money flow:

Client  
↓  
KIZUNAFIT  
↓  
Escrow Hold  
↓  
Coaching Delivered  
↓  
Trainer Paid

Trainer earnings remain held until coaching completes.

---

## **Rule 28**

# **Payout Release Window**

After coaching completion:

3 Day Review Window

must pass before payout release.

Purpose:

Refund Review

Dispute Review

Fraud Investigation

---

# **Refund Rules**

## **Rule 29**

# **Refunds Require Admin Review**

Refunds are never automatic.

Every refund requires administrative review.

---

## **Rule 30**

# **Refund Types**

Supported refund types:

FULL\_REFUND

PARTIAL\_REFUND

---

## **Rule 31**

# **Refund Lifecycle**

Supported statuses:

PENDING

UNDER\_REVIEW

APPROVED

PARTIALLY\_APPROVED

REJECTED

PROCESSED

CANCELLED

Official lifecycle transitions are defined in:

06\_STATE\_MACHINES.md

---

# **Dispute Rules**

## **Rule 32**

# **Dispute Eligibility**

Disputes may be opened by:

Client

Trainer

Requirements:

Payment Successful

Payout Not Released

---

## **Rule 33**

# **Dispute Resolution**

Administrators review:

Evidence

Communication History

Coaching Records

Payment Records

Possible outcomes:

Refund

Partial Refund

Warning

Suspension

Ban

No Action

---

## **Rule 34**

# **Dispute Freeze**

Active disputes freeze:

Refund Processing

Payout Release

until resolution.

---

# **Coaching Rules**

## **Rule 35**

# **Coaching Relationship Ownership**

All coaching data belongs to:

coachingRelationshipId

Examples:

Workout Programs

Nutrition Plans

Progress Entries

Conversations

Reviews

---

## **Rule 36**

# **No Relationship Reuse**

Renewals create:

New Payment

New Subscription

New Coaching Relationship

Existing relationships are never reused.

---

## **Rule 37**

# **Coaching Relationship Statuses**

Supported statuses:

PENDING

ACTIVE

COMPLETED

CANCELLED

REFUNDED

DISPUTED

EXPIRED

Official lifecycle transitions are defined in:

06\_STATE\_MACHINES.md

---

# **Communication Rules**

## **Rule 38**

# **Messaging Unlock**

Messaging becomes available only after:

Payment Success

---

## **Rule 39**

# **One Conversation Per Relationship**

Each coaching relationship owns exactly one conversation.

---

## **Rule 40**

# **Message Immutability**

Messages may not be edited.

Deletion must create an audit record.

---

# **Review Rules**

## **Rule 41**

# **One Review Per Relationship**

Each completed relationship may create one review.

Duplicate reviews are prohibited.

---

## **Rule 42**

# **Review Edit Window**

Reviews may be edited for:

7 Days

After that, reviews become locked.

---

## **Rule 43**

# **Disputed Relationships Cannot Be Reviewed**

Reviews remain blocked while disputes are active.

---

# **Administrative Rules**

## **Rule 44**

# **Auditability**

Every administrative action must be recorded.

Examples:

Suspensions

Bans

Refund Approvals

Dispute Decisions

---

## **Rule 45**

# **Financial History Protection**

Administrators may not modify financial history.

Adjustments must create new records.

Historical records remain immutable.

---

## **Rule 46**

# **Platform Settings Governance**

Critical settings must support versioning.

Examples:

Platform Fee

Offer Expiration

Refund Windows

Payout Delays

Historical calculations must remain accurate.

---

# **Final Business Law**

Every feature added to KIZUNAFIT must satisfy all of the following:

Supports The Business Vision

Fits Within A Domain

Preserves Ownership

Maintains Auditability

Preserves Historical Records

Does Not Violate Marketplace Fairness

If a feature violates any of these principles, it must be redesigned before implementation.

---

# **Final Statement**

This document defines the official business laws of KIZUNAFIT.

All future architecture, state machines, entity models, database designs, APIs, and implementations must comply with these rules.

Business Rules are the legal foundation of the platform.

Everything else is built on top of them.

---

# **Status**

02\_BUSINESS\_RULES

✅ APPROVED  
✅ LOCKED

