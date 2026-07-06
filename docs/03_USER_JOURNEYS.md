# **03\_USER\_JOURNEYS**

# **KIZUNAFIT USER JOURNEYS**

---

# **Introduction**

This document defines the complete user journeys for every actor inside KIZUNAFIT.

The purpose of this document is to describe:

How Users Interact With The Platform

What Actions Users Can Perform

How Users Progress Through The System

What Business Outcomes Are Created

How Coaching Relationships Are Established And Completed

This document describes business flows.

It does not define:

Database Structures

API Endpoints

Internal Implementation Details

---

# **User Types**

KIZUNAFIT supports four actor types:

Guest

Client

Trainer

Admin

Each actor has different responsibilities and platform capabilities.

---

# **GUEST JOURNEY**

## **Purpose**

A Guest is an unauthenticated visitor.

Guests can explore the platform before creating an account.

---

## **Guest Capabilities**

Guests may:

View Landing Pages

Browse Trainers

Search Trainers

View Public Trainer Profiles

View Trainer Credentials

View Showcase Content

View Ratings

View Reviews

Guests cannot:

Send Trainer Requests

Book Consultations

Purchase Coaching

Access Coaching Features

Send Messages

---

## **Guest Journey Flow**

Visit Platform  
↓  
Browse Trainers  
↓  
View Trainer Profiles  
↓  
View Reviews & Showcase Content  
↓  
Interested In Coaching  
↓  
Create Account  
↓  
Become Client

---

# **CLIENT JOURNEY**

## **Overview**

The Client Journey represents the complete coaching acquisition and coaching experience.

The journey contains:

Registration  
↓  
Profile Setup  
↓  
Trainer Discovery  
↓  
Trainer Request  
↓  
Consultation  
↓  
Offer Review  
↓  
Payment  
↓  
Active Coaching  
↓  
Completion  
↓  
Review

---

# **Stage 1**

## **Registration**

Flow:

Visit Platform  
↓  
Create Account  
↓  
Verify Email  
↓  
Select Client Role  
↓  
Account Created

Result:

Client Account Created

---

# **Stage 2**

## **Client Profile Setup**

The client completes their profile.

Profile information includes:

Name

Age

Gender

Height

Weight

Fitness Goals

Activity Level

Experience Level

Dietary Preferences

Medical Notes

Result:

Client Profile Completed

---

# **Stage 3**

## **Trainer Discovery**

The client enters the marketplace.

Client may:

Browse Trainers

Search Trainers

Filter Trainers

View Trainer Profiles

View Credentials

View Showcase Content

View Ratings

View Reviews

Goal:

Find The Most Suitable Trainer

---

# **Stage 4**

## **Trainer Request**

The client selects a trainer.

### **Business Constraint**

A client may create a trainer request only when no active acquisition pipeline exists.

Flow:

View Trainer  
↓  
Send Trainer Request  
↓  
Request Pending

---

## **Request Outcome**

The trainer may:

Accept

or

Reject

---

### **Rejected Flow**

Request Rejected  
↓  
View Rejection Reason  
↓  
Return To Marketplace  
↓  
Choose Another Trainer

---

### **Accepted Flow**

Request Accepted  
↓  
Consultation Created

---

# **Stage 5**

## **Consultation**

The client receives consultation availability.

Flow:

Select Consultation Slot  
↓  
Book Slot  
↓  
Attend Consultation

During consultation:

The trainer evaluates:

Goals

Lifestyle

Experience

Expectations

Suitability

---

## **Consultation Completion**

Consultation Completed  
↓  
Trainer Creates Offer

---

# **Stage 6**

## **Offer Review**

The client receives a coaching offer.

Offer contains:

Trainer Fee

Platform Fee

Total Amount

Duration

Coaching Scope

Notes

---

## **Offer Decision**

The client may:

Accept Offer

or

Decline Offer

---

### **Declined Flow**

Offer Declined  
↓  
Acquisition Closed  
↓  
Return To Marketplace

---

### **Accepted Flow**

Offer Accepted  
↓  
Proceed To Payment

---

# **Stage 7**

## **Payment**

The client pays through Razorpay.

Flow:

Create Payment  
↓  
Complete Payment  
↓  
Payment Verified  
↓  
Subscription Activated  
↓  
Coaching Relationship Created

Result:

Client Becomes Active Coaching Client

---

# **Stage 8**

## **Active Coaching**

The client gains access to:

Workout Programs

Nutrition Plans

Progress Tracking

Messaging

Coaching Dashboard

### **Coaching Ownership**

All coaching functionality is unlocked through the active CoachingRelationship.

Without an active CoachingRelationship, coaching features remain unavailable.

---

## **Workout Journey**

Client may:

View Workouts

Complete Workouts

Track Completion

---

## **Nutrition Journey**

Client may:

View Nutrition Plan

Track Compliance

---

## **Progress Journey**

Client may:

Submit Check-ins

Upload Progress Photos

Track Weight

Track Measurements

---

## **Communication Journey**

Client may:

Send Messages

Receive Feedback

Share Updates

---

# **Stage 9**

## **Coaching Completion**

After the coaching period ends:

Relationship Completed  
↓  
Review Eligible

---

# **Stage 10**

## **Review Process**

Flow:

Relationship Completed  
↓  
Leave Rating  
↓  
Leave Review  
↓  
Review Published

Rules:

One Relationship  
\=  
One Review

---

# **TRAINER JOURNEY**

## **Overview**

The Trainer Journey focuses on:

Client Acquisition

Coaching Delivery

Business Growth

---

# **Stage 1**

## **Registration**

Flow:

Create Account  
↓  
Verify Email  
↓  
Select Trainer Role  
↓  
Trainer Account Created

---

# **Stage 2**

## **Trainer Profile Setup**

Trainer creates profile information.

Includes:

Headline

Bio

Experience

Specializations

Languages

Location

---

# **Stage 3**

## **Showcase Setup**

Trainer uploads:

Certificates

Achievements

Transformations

Events

Workshops

Result:

Trainer Profile Published

---

# **Stage 4**

## **Marketplace Participation**

Trainer becomes visible in the marketplace.

Status:

AVAILABLE

Trainer may now receive requests.

---

# **Stage 5**

## **Request Management**

Flow:

Receive Request  
↓  
Review Client Profile  
↓  
Accept Or Reject

---

### **Reject Flow**

Reject Request  
↓  
Provide Reason  
↓  
Request Closed

---

### **Accept Flow**

Accept Request  
↓  
Consultation Created

---

# **Stage 6**

## **Consultation**

Trainer conducts consultation.

Objectives:

Understand Goals

Assess Readiness

Determine Coaching Requirements

After consultation:

Create Coaching Offer

---

# **Stage 7**

## **Offer Creation**

Trainer creates offer containing:

Coaching Fee

Coaching Scope

Duration

Notes

Offer sent to client.

---

# **Stage 8**

## **Active Coaching**

After payment:

Subscription Active  
↓  
Coaching Relationship Active

Trainer gains access to coaching tools.

---

## **Workout Management**

Trainer may:

Create Workouts

Assign Workouts

Modify Workouts

Manage Workout Delivery

---

## **Nutrition Management**

Trainer may:

Create Nutrition Plans

Assign Nutrition Plans

Modify Nutrition Plans

Manage Nutrition Delivery

---

## **Progress Management**

Trainer may:

Review Progress Entries

Review Photos

Analyze Trends

Provide Feedback

---

## **Communication**

Trainer may:

Send Messages

Answer Questions

Provide Coaching Instructions

---

# **Stage 9**

## **Coaching Completion**

Flow:

Relationship Completed  
↓  
Payout Review Window Begins

---

# **Stage 10**

## **Trainer Payout**

Flow:

3-Day Review Window  
↓  
No Active Dispute  
↓  
Automatic Payout  
↓  
Relationship Closed

Result:

Trainer Earnings Released

---

# **ADMIN JOURNEY**

## **Overview**

Admins govern platform operations.

Admins do not participate in coaching.

---

# **Stage 1**

## **Login**

Flow:

Admin Login  
↓  
Admin Dashboard

---

# **Stage 2**

## **User Management**

Admins may:

View Users

Suspend Users

Ban Users

Restore Users

Targets:

Clients

Trainers

---

# **Stage 3**

## **Marketplace Moderation**

Admins may moderate:

Profiles

Showcase Content

Reviews

Purpose:

Maintain Marketplace Quality

---

# **Stage 4**

## **Refund Management**

Flow:

Refund Request Created  
↓  
Review Refund  
↓  
Approve Or Reject

---

# **Stage 5**

## **Dispute Resolution**

Flow:

Dispute Created  
↓  
Evidence Submitted  
↓  
Investigation  
↓  
Decision Issued

Possible outcomes:

Refund

Partial Refund

Warning

Suspension

Ban

No Action

---

# **Stage 6**

## **Revenue Monitoring**

Admins monitor:

Revenue

Platform Fees

Payouts

Refunds

---

# **Stage 7**

## **Platform Governance**

Admins manage:

Platform Fees

Offer Expiration

Refund Policies

Payout Delays

---

# **COMPLETE CLIENT ACQUISITION FLOW**

Browse Trainers  
↓  
Send Request  
↓  
Request Accepted  
↓  
Consultation  
↓  
Offer  
↓  
Payment  
↓  
Subscription Active  
↓  
Coaching Relationship Active

---

# **COMPLETE COACHING FLOW**

Workout Program  
\+  
Nutrition Plan  
\+  
Progress Tracking  
\+  
Messaging  
↓  
Coaching Delivery  
↓  
Relationship Completion  
↓  
Review  
↓  
Payout

---

# **COMPLETE PLATFORM FLOW**

Guest  
↓  
Client  
↓  
Trainer Discovery  
↓  
Consultation  
↓  
Offer  
↓  
Payment  
↓  
Coaching Relationship  
↓  
Coaching Delivery  
↓  
Completion  
↓  
Review  
↓  
Payout

---

# **Final Statement**

This document defines the complete user journeys of KIZUNAFIT.

Every screen, use case, state machine, database entity, API, and business process should support one or more journeys defined in this document.

If a feature does not improve or support a documented journey, its necessity should be questioned before implementation.

---

# **Status**

03\_USER\_JOURNEYS

✅ APPROVED  
✅ LOCKED

