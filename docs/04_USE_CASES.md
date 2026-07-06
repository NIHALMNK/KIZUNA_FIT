# **04\_USE\_CASES**

# **KIZUNAFIT USE CASES**

---

# **Introduction**

This document defines the detailed use cases for KIZUNAFIT.

The purpose of this document is to describe:

Actor Responsibilities

Preconditions

Main Success Flows

Alternate Flows

Failure Scenarios

Postconditions

This document bridges the gap between User Journeys and Technical Architecture.

Every API endpoint, service method, workflow, state machine, and business process should originate from one or more use cases defined in this document.

---

# **Use Case Structure**

Each use case contains:

Use Case ID

Use Case Name

Primary Actor

Goal

Preconditions

Main Flow

Alternate Flows

Failure Flows

Postconditions

---

# **CLIENT USE CASES**

---

## **UC-001**

### **Client Registration**

**Primary Actor**

Client

**Goal**

Create a new client account.

**Preconditions**

Email Not Already Registered

**Main Flow**

1\. Open Registration Page

2\. Enter Account Details

3\. Submit Registration

4\. System Creates Account

5\. Verification Email Sent

6\. User Verifies Email

7\. Client Account Activated

**Alternate Flow**

User Requests New Verification Email

**Failure Flow**

Email Already Exists

**Postconditions**

Client Account Created

Email Verified

---

## **UC-002**

### **Complete Client Profile**

**Primary Actor**

Client

**Goal**

Create coaching profile.

**Preconditions**

Authenticated Client

**Main Flow**

1\. Open Profile Setup

2\. Enter Personal Details

3\. Enter Fitness Goals

4\. Enter Body Metrics

5\. Enter Preferences

6\. Save Profile

**Postconditions**

Client Profile Completed

---

## **UC-003**

### **Browse Trainers**

**Primary Actor**

Client

**Goal**

Discover available trainers.

**Preconditions**

None

**Main Flow**

1\. Open Marketplace

2\. Browse Trainers

3\. Apply Filters

4\. Open Trainer Profile

5\. Review Trainer Information

**Postconditions**

Trainer Information Viewed

---

## **UC-004**

### **Send Trainer Request**

**Primary Actor**

Client

**Goal**

Start acquisition pipeline.

**Preconditions**

Authenticated Client

No Active Acquisition Pipeline

Trainer Status \= AVAILABLE

**Main Flow**

1\. Open Trainer Profile

2\. Click Request Coaching

3\. Enter Optional Message

4\. Submit Request

5\. Create Acquisition Pipeline

6\. Create Initial Trainer Request

7\. Pipeline Status \= REQUEST\_PENDING

**Failure Flow**

Active Acquisition Pipeline Already Exists

Trainer Unavailable

**Postconditions**

Request Pending Trainer Decision

---

## **UC-005**

### **Book Consultation**

**Primary Actor**

Client

**Goal**

Reserve consultation slot.

**Preconditions**

Request Accepted

Consultation Created

**Main Flow**

1\. View Available Slots

2\. Select Slot

3\. Confirm Booking

4\. Consultation Scheduled

**Failure Flow**

Slot Unavailable

**Postconditions**

Consultation Booked

---

## **UC-006**

### **Review Coaching Offer**

**Primary Actor**

Client

**Goal**

Accept or reject coaching proposal.

**Preconditions**

Consultation Completed

Offer Received

**Main Flow**

1\. Open Offer

2\. Review Pricing

3\. Review Coaching Scope

4\. Accept Or Decline

**Alternate Flow**

Decline Offer

**Postconditions**

Accepted

OR

Declined

---

## **UC-007**

### **Complete Payment**

**Primary Actor**

Client

**Goal**

Purchase coaching.

**Preconditions**

Offer Accepted

**Main Flow**

1\. Initiate Payment

2\. Complete Razorpay Checkout

3\. Payment Processed

4\. Webhook Verification Succeeds

5\. Subscription Activated

6\. Coaching Relationship Created

**Failure Flow**

Payment Failed

Verification Failed

**Postconditions**

Client Becomes Active Coaching Client

---

## **UC-008**

### **Submit Progress Check-In**

**Primary Actor**

Client

**Goal**

Report coaching progress.

**Preconditions**

Active Coaching Relationship

**Main Flow**

1\. Open Progress Section

2\. Enter Measurements

3\. Enter Weight

4\. Upload Photos

5\. Submit Check-In

**Postconditions**

Progress Entry Recorded

---

## **UC-009**

### **Send Coaching Message**

**Primary Actor**

Client

**Goal**

Communicate with trainer.

**Preconditions**

Active Coaching Relationship

Conversation Exists

**Main Flow**

1\. Open Conversation

2\. Write Message

3\. Send Message

4\. Trainer Receives Message

**Postconditions**

Message Recorded

---

## **UC-010**

### **Leave Review**

**Primary Actor**

Client

**Goal**

Review trainer.

**Preconditions**

Relationship Completed

No Dispute

No Existing Review

**Main Flow**

1\. Open Review Form

2\. Enter Rating

3\. Enter Review

4\. Submit Review

**Postconditions**

Review Published

---

# **TRAINER USE CASES**

---

## **UC-011**

### **Trainer Registration**

**Primary Actor**

Trainer

**Goal**

Create trainer account.

**Preconditions**

Email Not Registered

**Main Flow**

1\. Register Account

2\. Verify Email

3\. Select Trainer Role

4\. Account Created

**Postconditions**

Trainer Account Active

---

## **UC-012**

### **Create Trainer Profile**

**Primary Actor**

Trainer

**Goal**

Publish marketplace profile.

**Preconditions**

Authenticated Trainer

**Main Flow**

1\. Enter Bio

2\. Enter Experience

3\. Enter Specializations

4\. Enter Languages

5\. Save Profile

**Postconditions**

Trainer Profile Created

---

## **UC-013**

### **Upload Showcase Content**

**Primary Actor**

Trainer

**Goal**

Build marketplace reputation.

**Preconditions**

Trainer Profile Exists

**Main Flow**

1\. Select Content Type

2\. Upload Media

3\. Enter Details

4\. Publish Showcase Item

**Postconditions**

Showcase Content Published

---

## **UC-014**

### **Respond To Trainer Request**

**Primary Actor**

Trainer

**Goal**

Accept or reject acquisition request.

**Preconditions**

Request Pending

**Main Flow**

1\. Open Request

2\. Review Client Profile

3\. Accept Or Reject

**Alternate Flow**

Reject Request

Provide Reason

**Postconditions**

Request Accepted

OR

Request Rejected

---

## **UC-015**

### **Conduct Consultation**

**Primary Actor**

Trainer

**Goal**

Evaluate coaching suitability.

**Preconditions**

Consultation Booked

**Main Flow**

1\. Attend Consultation

2\. Discuss Goals

3\. Assess Client

4\. Complete Consultation

**Postconditions**

Offer Creation Allowed

---

## **UC-016**

### **Create Coaching Offer**

**Primary Actor**

Trainer

**Goal**

Create coaching proposal.

**Preconditions**

Consultation Completed

**Main Flow**

1\. Define Coaching Fee

2\. Define Coaching Scope

3\. Add Notes

4\. Send Offer

**Postconditions**

Offer Sent

---

## **UC-017**

### **Manage Client Workouts**

**Primary Actor**

Trainer

**Goal**

Provide structured workout guidance.

**Preconditions**

Active Coaching Relationship

**Main Flow**

1\. Create Workouts

2\. Assign Workouts

3\. Modify Workouts

4\. Manage Workout Delivery

**Postconditions**

Workout Guidance Available To Client

---

## **UC-018**

### **Manage Client Nutrition**

**Primary Actor**

Trainer

**Goal**

Provide nutrition guidance.

**Preconditions**

Active Coaching Relationship

**Main Flow**

1\. Create Nutrition Guidance

2\. Assign Nutrition Guidance

3\. Modify Nutrition Guidance

4\. Manage Nutrition Delivery

**Postconditions**

Nutrition Guidance Available To Client

---

## **UC-019**

### **Review Client Progress**

**Primary Actor**

Trainer

**Goal**

Monitor client results.

**Preconditions**

Progress Entries Exist

**Main Flow**

1\. Open Client Progress

2\. Review Metrics

3\. Review Photos

4\. Analyze Trends

5\. Provide Feedback

**Postconditions**

Feedback Recorded

---

## **UC-020**

### **Receive Payout**

**Primary Actor**

Trainer

**Goal**

Receive coaching earnings.

**Preconditions**

Relationship Completed

Review Window Completed

No Dispute

**Main Flow**

1\. System Initiates Payout

2\. Funds Transferred

3\. Payout Recorded

**Postconditions**

Trainer Paid

---

## **UC-021**

### **Manage Trainer Availability**

**Primary Actor**

Trainer

**Goal**

Manage availability for live coaching sessions.

**Preconditions**

Trainer Account Active

**Main Flow**

1\. Open Availability Settings

2\. Define Available Time Slots

3\. Save Availability

4\. Availability Updated

**Postconditions**

Trainer Availability Updated

---

# **ADMIN USE CASES**

---

## **UC-022**

### **Manage Users**

**Primary Actor**

Admin

**Goal**

Moderate platform users.

**Main Flow**

1\. Search User

2\. Review Account

3\. Suspend Or Ban

4\. Record Action

**Postconditions**

User Status Updated

---

## **UC-023**

### **Review Refund Request**

**Primary Actor**

Admin

**Goal**

Resolve refund request.

**Preconditions**

Refund Request Submitted

**Main Flow**

1\. Review Evidence

2\. Review Payment History

3\. Approve Or Reject

**Postconditions**

Refund Decision Recorded

---

## **UC-024**

### **Resolve Dispute**

**Primary Actor**

Admin

**Goal**

Resolve coaching dispute.

**Preconditions**

Dispute Submitted

**Main Flow**

1\. Review Evidence

2\. Review Messages

3\. Review Coaching Records

4\. Make Decision

5\. Record Decision

**Postconditions**

Dispute Resolved

---

## **UC-025**

### **Manage Platform Settings**

**Primary Actor**

Admin

**Goal**

Govern platform configuration.

**Main Flow**

1\. Open Settings

2\. Modify Configuration

3\. Save New Version

4\. Audit Action Recorded

**Postconditions**

New Configuration Version Active

---

# **Use Case Coverage Summary**

Client Use Cases       10

Trainer Use Cases      11

Admin Use Cases         4

Total Use Cases        25

These use cases represent the complete Version 1 business interactions of KIZUNAFIT.

---

# **Final Statement**

This document defines the official use cases of KIZUNAFIT.

Every API endpoint, service method, workflow, state machine, and user interface action should trace back to one or more use cases defined here.

If a feature cannot be linked to a valid use case, its necessity should be questioned before implementation.

---

# **Status**

04\_USE\_CASES

✅ APPROVED  
✅ LOCKED

