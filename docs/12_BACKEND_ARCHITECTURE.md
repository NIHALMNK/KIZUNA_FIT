# **12\_BACKEND\_ARCHITECTURE**

# **00\. INTRODUCTION**

---

# **00.1 Purpose**

The purpose of this document is to define the official Backend Architecture of the **KIZUNAFIT** platform.

This document establishes the architectural standards, implementation boundaries, dependency rules, and structural organization that govern every backend component within the platform.

The Backend Architecture translates the approved Business Architecture, Domain Architecture, Database Design, API Architecture, and API Specification into an implementation blueprint while preserving complete architectural consistency.

Rather than defining business behavior, this document defines **how the approved business architecture is implemented** using a **Pure Clean Architecture** approach.

The Backend Architecture serves as the authoritative implementation guide for every backend component, including domain entities, use cases, repositories, controllers, middleware, infrastructure services, dependency injection, realtime communication, background processing, and external integrations.

Its primary responsibility is to ensure that implementation decisions never violate the architectural decisions approved in previous documents.

---

# **00.2 Objectives**

The objectives of this document are to:

* Define the official backend architecture for the KIZUNAFIT platform.  
* Adopt Pure Clean Architecture as the implementation model.  
* Preserve strict separation between business logic and implementation details.  
* Enforce the Dependency Rule throughout the codebase.  
* Define clear responsibilities for every architectural layer.  
* Define module organization based on approved business domains.  
* Establish implementation standards for Controllers, Use Cases, Domain Entities, Repositories, Presenters, DTOs, Middleware, and Infrastructure Services.  
* Define dependency injection architecture.  
* Define backend interaction patterns for REST APIs, Socket.IO, and WebRTC signaling.  
* Establish security, maintainability, scalability, and testability standards.  
* Provide the architectural foundation for backend implementation.

---

# **00.3 Scope**

This document defines the backend implementation architecture for Version 1 of the KIZUNAFIT platform.

The scope includes:

* Clean Architecture principles  
* Dependency Rule  
* Layer responsibilities  
* Domain module architecture  
* Package organization  
* Request lifecycle  
* Controller architecture  
* Application layer architecture  
* Domain layer architecture  
* Infrastructure architecture  
* Repository architecture  
* DTO architecture  
* Validation architecture  
* Mapping architecture  
* Authentication architecture  
* Authorization architecture  
* Middleware architecture  
* Error handling architecture  
* Dependency Injection  
* Domain Events  
* Socket.IO architecture  
* WebRTC signaling architecture  
* Background job architecture  
* File storage architecture  
* Logging architecture  
* Security architecture  
* Testing architecture  
* Deployment architecture  
* Coding standards  
* Implementation guidelines

These standards apply to every backend component regardless of business domain.

---

# **00.4 Out of Scope**

This document does **not** define:

* Business Vision  
* Business Rules  
* User Journeys  
* Use Cases  
* State Machines  
* Entity Modeling  
* Database Design  
* Mongoose Schema Design  
* API Specifications  
* Frontend Architecture  
* UI Components  
* Deployment Infrastructure  
* CI/CD Pipelines  
* Cloud Infrastructure Configuration  
* Infrastructure-as-Code  
* Monitoring Dashboards

These topics are defined in their respective architectural documents.

---

# **00.5 Target Audience**

This document is intended for:

* Solution Architects  
* Backend Developers  
* Technical Leads  
* Software Engineers  
* Code Reviewers  
* QA Engineers  
* DevOps Engineers  
* System Integrators

It serves as the official reference for implementing, reviewing, and maintaining the KIZUNAFIT backend.

---

# **00.6 Relationship with Previous Documents**

The Backend Architecture is derived directly from the approved architectural documentation.

The dependency chain is:

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
        ↓

Mongoose Schema Design  
        ↓

API Architecture  
        ↓

API Specification  
        ↓

Backend Architecture

The Backend Architecture consumes architectural decisions that have already been approved.

It must never introduce:

* New business rules  
* New lifecycle states  
* New aggregate ownership  
* New business domains  
* New business entities  
* New database concepts  
* New API behavior

Every implementation decision must remain consistent with the previously approved architecture.

---

# **00.7 Relationship with Future Documents**

The Backend Architecture serves as the implementation foundation for all backend development.

Future implementation artifacts derive from this document.

Backend Architecture  
        ↓

Source Code  
        ↓

Unit Tests  
        ↓

Integration Tests  
        ↓

Deployment  
        ↓

Production

Future implementation may optimize performance or improve maintainability, but it must not violate the architectural principles established by this document.

---

# **00.8 Backend Architecture Philosophy**

The KIZUNAFIT backend follows **Pure Clean Architecture** as defined by Robert C. Martin.

The architecture is built around the principle that **business rules are the most valuable part of the system and must remain independent of frameworks, databases, user interfaces, and external technologies.**

Accordingly:

* Business rules are independent of frameworks.  
* Business rules are independent of databases.  
* Business rules are independent of HTTP.  
* Business rules are independent of Express.js.  
* Business rules are independent of MongoDB.  
* Business rules are independent of Mongoose.  
* Business rules are independent of Socket.IO.  
* Business rules are independent of WebRTC.  
* Business rules are independent of Cloudinary.  
* Business rules are independent of Redis.

Frameworks are implementation details.

Technologies may change.

Business rules remain stable.

The backend therefore implements the approved business architecture without allowing external technologies to influence domain logic.

---

# **00.9 Design Goals**

The Backend Architecture is designed to achieve the following goals:

* Framework Independence  
* Database Independence  
* UI Independence  
* Testability  
* Maintainability  
* Scalability  
* High Cohesion  
* Low Coupling  
* Domain Isolation  
* Dependency Inversion  
* SOLID Compliance  
* Modular Development  
* Reusability  
* Security  
* Performance  
* Long-term Maintainability

---

# **00.10 Expected Outcome**

Upon completion of this document, the KIZUNAFIT platform will have:

* A complete backend implementation blueprint.  
* A standardized project structure.  
* Clearly defined architectural layers.  
* Strict dependency rules.  
* Consistent module organization.  
* Standardized controller architecture.  
* Standardized application services.  
* Framework-independent domain model.  
* Repository abstraction standards.  
* Infrastructure implementation standards.  
* Dependency Injection guidelines.  
* Authentication and authorization architecture.  
* Realtime communication architecture.  
* Error handling standards.  
* Logging standards.  
* Testing standards.  
* Coding standards.

This document becomes the official implementation guide for every backend component.

---

# **00.11 Status**

**12\_BACKEND\_ARCHITECTURE**

**Status**

* ✅ Backend Architecture Draft

**Derived From**

* ✅ 01 Business Vision  
* ✅ 02 Business Rules  
* ✅ 03 User Journeys  
* ✅ 04 Use Cases  
* ✅ 05 Domain Architecture  
* ✅ 06 State Machines  
* ✅ 07 Entity Modeling  
* ✅ 08 Database Design  
* ✅ 09 Mongoose Schema Design  
* ✅ 10 API Architecture  
* ✅ 11 API Specification

**Architecture Style**

* ✅ Pure Clean Architecture  
* ✅ Domain-Driven Design  
* ✅ Repository Pattern  
* ✅ Dependency Injection  
* ✅ SOLID Principles  
* ✅ Modular Monolith

**Authority**

Source of Truth for Backend Implementation Architecture.

---

# **01\. CLEAN ARCHITECTURE PRINCIPLES**

The KIZUNAFIT backend adopts **Pure Clean Architecture** as its implementation model.

These principles govern every backend component regardless of business domain, programming language, framework, or infrastructure technology.

Every implementation decision must comply with these principles unless an architectural revision formally approves an exception.

---

## **BA-1 Architecture First**

The backend is an implementation of the approved architecture.

Implementation decisions must originate from:

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

        ↓

API Architecture

        ↓

API Specification

        ↓

Backend Architecture

Implementation must never redefine business architecture.

Architecture governs implementation.

Implementation never governs architecture.

---

## **BA-2 Business Rules Are Independent**

Business rules are the most valuable asset of the system.

They must remain completely independent of:

* Express.js  
* MongoDB  
* Mongoose  
* HTTP  
* REST  
* Socket.IO  
* WebRTC  
* Redis  
* Cloudinary  
* JWT  
* Nodemailer  
* File Storage  
* Operating System  
* External APIs

Business rules must continue to function even if every framework is replaced.

---

## **BA-3 Frameworks Are Replaceable**

Frameworks are implementation details.

The backend must be designed so that replacing:

* Express → Fastify  
* MongoDB → PostgreSQL  
* Mongoose → Prisma  
* Cloudinary → AWS S3  
* Socket.IO → WebSocket  
* Redis → Valkey

does not require modifications to the Domain Layer.

Only Infrastructure implementations should change.

---

## **BA-4 The Domain Is the Core**

The Domain Layer is the center of the backend.

It contains:

* Business Entities  
* Value Objects  
* Aggregate Roots  
* Domain Services  
* Repository Contracts  
* Domain Events  
* Business Policies

The Domain Layer represents the business, not the technology.

Every other layer exists to support the Domain.

---

## **BA-5 Dependency Rule**

Source code dependencies always point inward.

Presentation

        ↓

Application

        ↓

Domain

Infrastructure

        ↑

(Implements Interfaces)

The Domain depends on nothing.

The Application depends only on the Domain.

The Presentation depends on the Application.

The Infrastructure depends on the Domain and Application through abstractions.

No dependency may point outward.

---

## **BA-6 Dependency Inversion**

High-level business policies must never depend on low-level implementation details.

Instead:

Use Case

      ↓

Repository Interface

      ↓

Repository Implementation

Never:

Use Case

      ↓

Mongoose

Implementation details depend upon abstractions.

---

## **BA-7 Layer Isolation**

Each architectural layer has a single responsibility.

A layer may communicate only through defined interfaces.

Direct access across multiple layers is prohibited.

Example:

Controller

        ↓

Use Case

        ↓

Repository Interface

        ↓

Repository Implementation

Not:

Controller

        ↓

MongoDB

---

## **BA-8 Domain Ownership**

Every business domain owns its own implementation.

Each module encapsulates:

* Domain  
* Application  
* Presentation  
* Infrastructure

No domain may modify another domain's internal state directly.

Cross-domain collaboration occurs through defined interfaces and use cases.

---

## **BA-9 Rich Domain Model**

Business behavior belongs inside the Domain Model.

Entities are responsible for protecting their own invariants.

Example responsibilities include:

* activate()  
* suspend()  
* verifyEmail()  
* acceptOffer()  
* completeConsultation()

Entities are not passive data containers.

Business rules belong to the Domain, not Controllers or Repositories.

---

## **BA-10 Use Cases Orchestrate Business Workflows**

Application Use Cases coordinate business operations.

Responsibilities include:

* Executing business workflows  
* Coordinating multiple repositories  
* Managing transactions  
* Publishing domain events  
* Calling external ports

Use Cases do not contain infrastructure logic.

---

## **BA-11 Infrastructure Implements Contracts**

Infrastructure provides technical implementations for contracts defined by the Domain or Application.

Examples include:

* MongoDB repositories  
* Cloudinary storage  
* Redis cache  
* Email providers  
* Payment gateways  
* JWT services

Infrastructure never defines business rules.

---

## **BA-12 Controllers Are Delivery Mechanisms**

Controllers translate external requests into application commands.

Controllers are responsible for:

* Receiving HTTP requests  
* Validating request DTOs  
* Invoking Use Cases  
* Returning response DTOs

Controllers must never contain business logic.

---

## **BA-13 Repository Pattern**

Repositories abstract persistence.

The Domain defines repository contracts.

Infrastructure implements repository contracts.

Repositories are responsible only for persistence operations.

Business rules must never be implemented inside repositories.

---

## **BA-14 Explicit Dependencies**

All dependencies must be explicitly injected.

No class may instantiate its own dependencies using `new` for services, repositories, or infrastructure components.

Dependency Injection ensures:

* Loose coupling  
* Testability  
* Replaceability  
* Maintainability

---

## **BA-15 Modules Are Independent**

Each business domain is implemented as an independent module.

Modules communicate through well-defined interfaces.

Shared functionality belongs in Shared Kernel only when it is truly common.

Modules must remain independently maintainable.

---

## **BA-16 Testability by Design**

Every layer must be testable in isolation.

* Domain tested without infrastructure  
* Use Cases tested without databases  
* Controllers tested without business logic  
* Infrastructure tested independently

Business rules must execute without requiring external services.

---

## **BA-17 External Systems Are Ports**

Every external dependency is treated as a port.

Examples include:

* Payment Gateway  
* Email Service  
* Cloudinary  
* Redis  
* WebRTC Signaling  
* Notification Provider

The Application communicates through interfaces.

Infrastructure supplies implementations.

---

## **BA-18 Business Before Technology**

Technology decisions must never influence business behavior.

Business workflows remain identical regardless of:

* Database  
* Framework  
* Hosting platform  
* Messaging system  
* Cloud provider

The business model is the primary source of truth.

---

## **BA-19 Consistency**

Every backend module must follow identical architectural patterns.

Consistency applies to:

* Folder structure  
* Layer organization  
* Dependency direction  
* Naming conventions  
* DTO design  
* Repository design  
* Error handling  
* Validation  
* Dependency Injection

Consistency improves maintainability and developer experience.

---

## **BA-20 Long-Term Evolution**

The backend must support future growth without requiring architectural restructuring.

The architecture is designed to support:

* Additional business domains  
* New APIs  
* New infrastructure providers  
* Background processing  
* Event-driven communication  
* Future microservice extraction if required

The architecture favors evolution through extension rather than modification.

---

## **01.1 Summary**

The Clean Architecture principles establish the immutable rules governing the KIZUNAFIT backend.

Every implementation decision must comply with these principles.

When implementation convenience conflicts with architectural integrity, **architectural integrity takes precedence**.

These principles form the foundation for all subsequent sections, beginning with the **Dependency Rule and Layered Architecture**, where the structural organization of the backend is defined in detail.

---

# **02\. DEPENDENCY RULE**

The Dependency Rule is the fundamental architectural rule governing the KIZUNAFIT backend.

It defines the only permitted direction of source code dependencies throughout the system.

Every package, module, class, interface, and implementation must comply with this rule.

Violation of the Dependency Rule constitutes an architectural violation.

---

# **02.1 Fundamental Rule**

All source code dependencies must point inward toward higher-level business policies.

The closer a component is to the center of the architecture, the less it knows about external technologies.

               ┌──────────────────────────────────────────┐

                │      Frameworks & Drivers                │

                │ Express │ MongoDB │ Redis │ Cloudinary   │

                │ Socket.IO │ WebRTC │ JWT │ Nodemailer    │

                └──────────────────────────────────────────┘

                              │

                              ▼

                ┌──────────────────────────────────────────┐

                │        Interface Adapters                │

                │ Controllers │ Presenters │ DTOs          │

                │ Validators │ Repository Adapters         │

                └──────────────────────────────────────────┘

                              │

                              ▼

                ┌──────────────────────────────────────────┐

                │          Application Layer               │

                │ Use Cases │ Ports │ Commands │ Queries   │

                └──────────────────────────────────────────┘

                              │

                              ▼

                ┌──────────────────────────────────────────┐

                │            Domain Layer                  │

                │ Entities │ Value Objects │ Policies      │

                │ Aggregates │ Events │ Interfaces         │

                └──────────────────────────────────────────┘

Dependencies always move toward the Domain Layer.

---

# **02.2 Dependency Direction**

Allowed dependency direction:

Presentation

        ↓

Application

        ↓

Domain

Infrastructure

        ↑

Implements Interfaces

This dependency direction applies uniformly across every business domain.

---

# **02.3 Domain Layer Dependencies**

The Domain Layer is completely independent.

The Domain Layer:

* depends on nothing  
* imports nothing outside itself  
* contains no framework code  
* contains no infrastructure code  
* contains no HTTP concepts  
* contains no persistence concepts

The Domain Layer represents only business knowledge.

Allowed dependencies:

* Domain Entities  
* Value Objects  
* Domain Events  
* Domain Services  
* Repository Interfaces  
* Domain Policies  
* Enumerations  
* Domain Exceptions

Forbidden dependencies:

* Express  
* MongoDB  
* Mongoose  
* Redis  
* Cloudinary  
* Socket.IO  
* JWT  
* HTTP  
* Request  
* Response  
* Controllers  
* DTOs  
* Validators  
* Routes  
* Environment Variables

---

# **02.4 Application Layer Dependencies**

The Application Layer implements business workflows.

It depends only on:

* Domain Layer  
* Application Interfaces  
* Application DTOs

The Application Layer may never depend directly on infrastructure implementations.

Allowed:

Use Case

      ↓

Repository Interface

Forbidden:

Use Case

      ↓

Mongoose Repository

---

# **02.5 Presentation Layer Dependencies**

The Presentation Layer is responsible for receiving external requests.

It may depend on:

* Application Layer  
* DTOs  
* Validators

It must never depend directly on:

* Database  
* Mongoose  
* Redis  
* External APIs

Controllers invoke Use Cases.

Controllers never execute business rules.

---

# **02.6 Infrastructure Layer Dependencies**

Infrastructure contains implementation details.

Examples include:

* MongoDB  
* Mongoose  
* Redis  
* Cloudinary  
* JWT  
* Socket.IO  
* Email Providers  
* Payment Gateways

Infrastructure implements interfaces defined by the Domain or Application.

Infrastructure may depend on every inner layer.

Inner layers never depend on Infrastructure.

---

# **02.7 Inward Dependency Principle**

Every dependency introduced into the project must answer one question:

Does this dependency move inward?

If the answer is no, the dependency is prohibited.

Example:

Controller

        ↓

Use Case

Valid.

Example:

Use Case

        ↓

Controller

Invalid.

---

# **02.8 Interface Ownership**

Interfaces are owned by higher-level policies.

Repository Interfaces belong to the Domain.

Application Ports belong to the Application.

Infrastructure implements these interfaces.

Example:

Domain

IUserRepository

↓

Infrastructure

MongoUserRepository

Never the opposite.

---

# **02.9 Framework Independence**

Frameworks remain outside the business core.

Examples include:

* Express  
* Mongoose  
* Redis  
* Socket.IO  
* Cloudinary  
* Multer  
* JWT libraries  
* Validation libraries

Replacing any framework must not require changes to:

* Entities  
* Value Objects  
* Domain Services  
* Use Cases

Framework replacement should affect Infrastructure only.

---

# **02.10 Database Independence**

The database is an implementation detail.

Business rules must not assume:

* MongoDB  
* Document Database  
* SQL Database  
* Collection names  
* ObjectIds  
* Mongoose Schemas

Repositories abstract persistence completely.

---

# **02.11 External Service Independence**

External services are accessed through Ports.

Examples:

EmailService

PaymentGateway

StorageService

CacheService

NotificationService

The Application knows only the Port.

Infrastructure supplies the implementation.

---

# **02.12 Compile-Time Dependencies**

Compile-time dependencies must always move inward.

This applies to:

* imports  
* references  
* inheritance  
* implementations  
* generic constraints

Circular dependencies are prohibited.

---

# **02.13 Runtime Dependencies**

Runtime object creation is handled through Dependency Injection.

Objects never instantiate their own dependencies.

Example:

Invalid:

const repository \= new UserRepository();

Valid:

constructor(

    private readonly userRepository: IUserRepository

) {}

Object creation belongs to the Composition Root.

---

# **02.14 Module Dependency Rules**

Business modules remain isolated.

Example:

Identity

↓

Profile

Direct dependency is prohibited.

Instead:

Identity

↓

Application Port

↓

Profile

or

Identity

↓

Shared Contract

↓

Profile

Module boundaries preserve domain ownership.

---

# **02.15 Shared Kernel Dependencies**

Shared Kernel contains only universally reusable components.

Examples:

* Result  
* Pagination  
* Base Entity  
* ValueObject Base  
* Domain Exception Base  
* Shared Constants  
* Shared Utilities

Business-specific code must never be placed inside Shared Kernel.

---

# **02.16 Dependency Violations**

The following constitute architectural violations:

* Entity importing Mongoose  
* Entity importing Express  
* Use Case importing Controller  
* Controller importing Repository Implementation  
* Repository importing Controller  
* Domain importing Infrastructure  
* Cross-module internal imports  
* Circular dependencies  
* Business rules inside Infrastructure  
* Business rules inside Controllers

Such violations must be corrected before merging into the main branch.

---

# **02.17 Architectural Compliance**

Every Pull Request must satisfy the Dependency Rule.

Code reviews should verify:

* Dependency direction  
* Layer boundaries  
* Interface ownership  
* Framework isolation  
* Module isolation

Architectural compliance is mandatory.

---

# **02.18 Summary**

The Dependency Rule is the foundation of the KIZUNAFIT backend.

It ensures:

* Framework independence  
* Database independence  
* Testability  
* Maintainability  
* Replaceability  
* Scalability  
* Domain integrity

Every implementation decision must preserve inward dependencies and protect the Domain Layer from external concerns.

---

# **03\. PROJECT STRUCTURE**

The KIZUNAFIT backend follows a **Feature-First Modular Clean Architecture**.

The project is organized around **approved business domains**, not technical layers.

Each business domain is implemented as an independent module that encapsulates its own Clean Architecture layers while remaining isolated from other modules.

This organization improves:

* Maintainability  
* Scalability  
* Domain Ownership  
* Team Collaboration  
* Discoverability  
* Testability

---

# **03.1 Architectural Organization**

The backend is organized into four major areas:

Backend  
│  
├── Shared Kernel  
├── Business Modules  
├── Global Infrastructure  
└── Application Bootstrap

Each area has a distinct architectural responsibility.

---

# **03.2 Root Directory Structure**

src  
│  
├── config/  
│  
├── shared/  
│  
├── modules/  
│  
├── infrastructure/  
│  
├── bootstrap/  
│  
├── app.ts  
│  
└── server.ts

Each directory serves a specific architectural purpose.

---

# **03.3 Root Directory Responsibilities**

| Directory | Responsibility |
| ----- | ----- |
| config | Application configuration |
| shared | Shared Kernel |
| modules | Business Domains |
| infrastructure | Global technical infrastructure |
| bootstrap | Application composition root |
| app.ts | Express application |
| server.ts | Application entry point |

The root directory contains only application-level components.

Business logic must never exist at the root level.

---

# **03.4 Shared Kernel**

The Shared Kernel contains components that are genuinely reusable across multiple business domains.

shared  
│  
├── core/  
├── kernel/  
├── contracts/  
├── exceptions/  
├── constants/  
├── types/  
├── utils/  
└── validation/

The Shared Kernel must remain technology-independent whenever possible.

Business-specific logic is prohibited.

---

# **03.5 Business Modules**

Every approved business domain becomes an independent backend module.

modules  
│  
├── identity/  
├── profile/  
├── marketplace/  
├── consultation/  
├── offer/  
├── payment/  
├── coaching/  
├── workout/  
├── nutrition/  
├── progress/  
├── communication/  
├── review/  
└── administration/

These module names are derived directly from the approved Domain Architecture.

No additional business modules may be introduced without architectural approval.

---

# **03.6 Module Independence**

Each module owns its:

* Domain  
* Application  
* Presentation  
* Infrastructure

Modules must never expose their internal implementation.

Only public interfaces may be consumed by other modules.

Example:

Identity Module

✓ exposes

RegisterUserUseCase

AuthenticateUserUseCase

────────────

✗ hides

MongoUserRepository

UserSchema

UserMapper

EmailVerificationDocument

Internal implementation remains private.

---

# **03.7 Internal Module Structure**

Every business module follows an identical structure.

module-name  
│  
├── domain/  
│  
├── application/  
│  
├── presentation/  
│  
└── infrastructure/

Consistency across modules is mandatory.

---

# **03.8 Domain Layer**

The Domain Layer represents the business.

domain  
│  
├── aggregates/  
├── entities/  
├── value-objects/  
├── repositories/  
├── services/  
├── events/  
├── policies/  
├── specifications/  
├── enums/  
└── exceptions/

The Domain Layer contains no framework dependencies.

---

# **03.9 Application Layer**

The Application Layer implements business workflows.

application  
│  
├── use-cases/  
├── dto/  
├── commands/  
├── queries/  
├── handlers/  
├── mappers/  
├── ports/  
└── services/

Application coordinates business operations.

It does not implement infrastructure.

---

# **03.10 Presentation Layer**

The Presentation Layer handles incoming requests.

presentation  
│  
├── controllers/  
├── routes/  
├── validators/  
├── presenters/  
├── middlewares/  
└── serializers/

Presentation converts external requests into application requests.

Business rules are prohibited.

---

# **03.11 Infrastructure Layer**

Infrastructure contains implementation details.

infrastructure  
│  
├── persistence/  
├── repositories/  
├── providers/  
├── cache/  
├── messaging/  
├── storage/  
├── websocket/  
└── external/

Infrastructure implements interfaces defined by inner layers.

---

# **03.12 Global Infrastructure**

Technical capabilities shared across the application are located outside business modules.

infrastructure  
│  
├── database/  
├── cache/  
├── websocket/  
├── mail/  
├── storage/  
├── queue/  
├── logger/  
├── monitoring/  
└── security/

These services support multiple modules.

They never contain business rules.

---

# **03.13 Configuration**

Configuration is centralized.

config  
│  
├── env/  
├── database/  
├── cache/  
├── cloudinary/  
├── jwt/  
├── socket/  
├── logger/  
└── application/

Configuration must not contain business logic.

---

# **03.14 Bootstrap**

Application startup is isolated.

bootstrap  
│  
├── dependency-injection/  
├── routing/  
├── middleware/  
├── websocket/  
├── scheduler/  
└── startup/

The bootstrap layer creates and wires the application.

Only the Composition Root may instantiate infrastructure implementations.

---

# **03.15 Composition Root**

Object creation occurs in exactly one location.

Responsibilities include:

* Registering dependencies  
* Building repositories  
* Building providers  
* Building controllers  
* Building middleware  
* Wiring infrastructure  
* Starting the application

Business layers never instantiate infrastructure directly.

---

# **03.16 Package Dependency Rules**

The following dependency directions are permitted:

Presentation  
        ↓  
Application  
        ↓  
Domain

Infrastructure  
        ↑

Cross-layer shortcuts are prohibited.

---

# **03.17 Naming Standards**

Directories use:

* lowercase  
* kebab-case  
* singular architectural names  
* plural collections where appropriate

Examples:

trainer-profile

value-objects

use-cases

repositories

controllers

Naming consistency improves discoverability.

---

# **03.18 Scalability**

The structure supports future growth through the addition of new business modules.

Adding a new domain requires only:

modules

new-domain

domain

application

presentation

infrastructure

No restructuring of existing modules is required.

---

# **03.19 Architectural Benefits**

The project structure provides:

* High cohesion  
* Low coupling  
* Clear ownership  
* Framework independence  
* Independent testing  
* Predictable navigation  
* Parallel team development  
* Simplified maintenance  
* Future microservice extraction

---

# **03.20 Summary**

The KIZUNAFIT backend is organized as a **Feature-First Modular Clean Architecture**.

Business domains are the primary organizational unit.

Each module encapsulates its own Clean Architecture layers while remaining isolated from other modules.

The project structure enforces architectural boundaries, preserves domain ownership, and provides a scalable foundation for long-term development.

---

# **04\. LAYER RESPONSIBILITIES**

The KIZUNAFIT backend is organized into four architectural layers following the principles of **Pure Clean Architecture**.

Each layer has a single, well-defined responsibility.

Responsibilities must never overlap.

Business logic always resides in the innermost layers, while technical implementation details remain in the outer layers.

---

# **04.1 Layer Overview**

The backend consists of four primary layers.

┌────────────────────────────────────────────┐  
│          Presentation Layer                │  
└────────────────────────────────────────────┘  
                    │  
                    ▼  
┌────────────────────────────────────────────┐  
│          Application Layer                 │  
└────────────────────────────────────────────┘  
                    │  
                    ▼  
┌────────────────────────────────────────────┐  
│             Domain Layer                   │  
└────────────────────────────────────────────┘  
                    ▲  
                    │  
┌────────────────────────────────────────────┐  
│         Infrastructure Layer               │  
└────────────────────────────────────────────┘

Dependencies always point toward the Domain.

---

# **04.2 Domain Layer**

The Domain Layer contains the enterprise business rules of the platform.

It represents the business itself and is completely independent of frameworks, databases, and external technologies.

The Domain Layer contains:

* Entities  
* Aggregate Roots  
* Value Objects  
* Domain Events  
* Domain Policies  
* Specifications  
* Repository Interfaces  
* Domain Services  
* Enumerations  
* Domain Exceptions

The Domain Layer must never import:

* Express  
* Mongoose  
* MongoDB  
* HTTP  
* Redis  
* Cloudinary  
* Socket.IO  
* JWT  
* Environment Variables

The Domain Layer must compile independently.

---

# **04.3 Domain Layer Responsibilities**

The Domain Layer is responsible for:

* Business rules  
* Business invariants  
* Aggregate consistency  
* State transitions  
* Validation of business policies  
* Domain events  
* Business calculations  
* Entity behavior

The Domain Layer is **not** responsible for:

* HTTP  
* Authentication tokens  
* Database access  
* Serialization  
* Logging  
* File uploads  
* External APIs

---

# **04.4 Application Layer**

The Application Layer coordinates business workflows.

It orchestrates the interaction between Domain objects and external interfaces without containing infrastructure logic.

The Application Layer contains:

* Use Cases  
* Commands  
* Queries  
* DTOs  
* Application Ports  
* Mappers  
* Application Exceptions

---

# **04.5 Application Layer Responsibilities**

The Application Layer is responsible for:

* Executing business use cases  
* Coordinating repositories  
* Invoking Domain behavior  
* Managing transactions  
* Publishing domain events  
* Calling external ports  
* Returning response DTOs

The Application Layer is not responsible for:

* Database implementation  
* HTTP handling  
* Framework logic  
* Persistence details  
* Business rule definitions

Business rules belong to the Domain.

Infrastructure belongs to the Infrastructure Layer.

---

# **04.6 Presentation Layer**

The Presentation Layer receives requests from external actors.

Examples include:

* REST API  
* Socket.IO Events  
* Scheduled Jobs  
* Administrative Interfaces  
* Future GraphQL APIs

The Presentation Layer translates external requests into Application requests.

---

# **04.7 Presentation Responsibilities**

The Presentation Layer is responsible for:

* Receiving requests  
* Request validation  
* Authentication  
* Authorization  
* Mapping request DTOs  
* Calling Use Cases  
* Returning response DTOs  
* HTTP status codes

It must never:

* Execute business rules  
* Access databases  
* Instantiate repositories  
* Modify domain entities directly

Controllers remain intentionally thin.

---

# **04.8 Infrastructure Layer**

Infrastructure contains all implementation details.

Examples include:

* MongoDB  
* Mongoose  
* Redis  
* Cloudinary  
* Nodemailer  
* JWT  
* Socket.IO  
* WebRTC Signaling  
* File Storage  
* Payment Gateway  
* External APIs

Infrastructure exists to support the Application and Domain layers.

---

# **04.9 Infrastructure Responsibilities**

Infrastructure is responsible for:

* Database persistence  
* External communication  
* Cache implementation  
* Email delivery  
* File storage  
* Queue processing  
* Logging  
* Monitoring  
* Third-party integrations

Infrastructure must never define business rules.

---

# **04.10 Layer Communication**

Only adjacent layers may communicate directly.

Valid:

Presentation  
        ↓  
Application  
        ↓  
Domain

Infrastructure  
        ↑

Invalid:

Presentation  
        ↓  
Infrastructure

Invalid:

Domain  
        ↓  
Infrastructure

Invalid:

Controller  
        ↓  
Mongo Repository

---

# **04.11 Layer Independence**

Each layer must be independently replaceable.

For example:

Changing Express.js should affect only the Presentation Layer.

Changing MongoDB should affect only the Infrastructure Layer.

Changing Cloudinary should affect only the Infrastructure Layer.

Changing Redis should affect only the Infrastructure Layer.

Business rules remain unchanged.

---

# **04.12 Layer Visibility**

Each layer exposes only what the next layer requires.

Internal implementation remains private.

Example:

Application

✓ RegisterUserUseCase

✓ LoginUserUseCase

✗ Internal Mapper

✗ Internal Validator

✗ Internal Helper

Only public contracts are visible.

---

# **04.13 Layer Cohesion**

Each layer groups components with similar responsibilities.

Mixing responsibilities is prohibited.

Example:

A Repository Implementation belongs only in Infrastructure.

A Controller belongs only in Presentation.

An Entity belongs only in Domain.

A Use Case belongs only in Application.

---

# **04.14 Cross-Layer Rules**

The following rules apply universally:

* Controllers invoke Use Cases.  
* Use Cases invoke Repository Interfaces.  
* Repository Implementations fulfill Repository Interfaces.  
* Entities never invoke Controllers.  
* Entities never invoke Repositories.  
* Infrastructure never owns business behavior.  
* Presentation never owns business behavior.

---

# **04.15 Summary**

The four-layer architecture ensures:

* Strict separation of concerns  
* Framework independence  
* Business rule protection  
* High testability  
* Low coupling  
* High cohesion  
* Long-term maintainability

Every backend component belongs to exactly one architectural layer.

No component may violate the responsibilities defined in this section.

---

# **05\. PACKAGE STRUCTURE**

The KIZUNAFIT backend follows a **Feature-First Modular Clean Architecture Package Structure**.

Each approved business domain is implemented as an independent package.

Every package encapsulates its own Presentation, Application, Domain, and Infrastructure layers while exposing only its public application interfaces.

The package structure mirrors the approved Domain Architecture and enforces architectural boundaries through physical code organization.

---

# **05.1 Package Philosophy**

Packages organize source code according to **business capabilities**, not technical concerns.

The primary organizational unit is the **Business Domain**.

Examples include:

* Identity  
* Profile  
* Marketplace  
* Consultation  
* Payment  
* Coaching  
* Workout  
* Nutrition  
* Communication

Every package owns its business logic, persistence, presentation, and infrastructure.

---

# **05.2 Root Package Structure**

src  
│  
├── bootstrap/  
├── config/  
├── infrastructure/  
├── modules/  
├── shared/  
│  
├── app.ts  
└── server.ts

Each root package has a clearly defined responsibility.

---

# **05.3 Modules Package**

The `modules` package contains every approved business domain.

modules  
│  
├── identity/  
├── profile/  
├── marketplace/  
├── consultation/  
├── offer/  
├── payment/  
├── coaching/  
├── workout/  
├── nutrition/  
├── progress/  
├── communication/  
├── review/  
└── administration/

Each module is independently maintainable.

Business modules must never share internal implementation details.

---

# **05.4 Internal Module Package Structure**

Every business module follows the exact same package structure.

identity  
│  
├── domain/  
├── application/  
├── presentation/  
└── infrastructure/

Architectural consistency across all modules is mandatory.

No module may introduce a different internal layout.

---

# **05.5 Domain Package**

The Domain package contains the Enterprise Business Rules.

domain  
│  
├── aggregates/  
├── entities/  
├── value-objects/  
├── repositories/  
├── services/  
├── events/  
├── specifications/  
├── policies/  
├── enums/  
├── exceptions/  
└── index.ts

Responsibilities:

* Business rules  
* Aggregate behavior  
* Business invariants  
* Repository contracts  
* Domain events

The Domain package must remain framework-independent.

---

# **05.6 Application Package**

The Application package coordinates business use cases.

application  
│  
├── use-cases/  
├── dto/  
├── commands/  
├── queries/  
├── ports/  
├── mappers/  
├── exceptions/  
└── index.ts

Responsibilities:

* Use Case orchestration  
* Repository coordination  
* Transaction boundaries  
* Port invocation  
* Response mapping

Business workflows are implemented here.

---

# **05.7 Presentation Package**

The Presentation package receives requests from external actors.

presentation  
│  
├── controllers/  
├── routes/  
├── presenters/  
├── validators/  
├── middlewares/  
└── index.ts

Responsibilities:

* HTTP Controllers  
* Route registration  
* Request validation  
* Response formatting  
* Authorization guards

Business logic is prohibited.

---

# **05.8 Infrastructure Package**

The Infrastructure package contains technical implementations.

infrastructure  
│  
├── persistence/  
├── repositories/  
├── providers/  
├── cache/  
├── messaging/  
├── storage/  
├── websocket/  
├── scheduler/  
└── index.ts

Responsibilities:

* MongoDB  
* Mongoose  
* Redis  
* Cloudinary  
* Email  
* Queue  
* External APIs

Infrastructure implements interfaces defined by inner layers.

---

# **05.9 Shared Package**

The Shared package contains reusable components shared across multiple modules.

shared  
│  
├── kernel/  
├── core/  
├── contracts/  
├── exceptions/  
├── constants/  
├── types/  
├── utils/  
├── validation/  
└── index.ts

The Shared package must not contain business logic.

Only truly generic components belong here.

---

# **05.10 Bootstrap Package**

The Bootstrap package acts as the Composition Root.

bootstrap  
│  
├── dependency-injection/  
├── routing/  
├── middleware/  
├── websocket/  
├── scheduler/  
└── startup/

Responsibilities:

* Dependency registration  
* Route initialization  
* Express startup  
* Socket.IO initialization  
* Background worker initialization

Object construction occurs only within this package.

---

# **05.11 Global Infrastructure Package**

Application-wide infrastructure resides outside business modules.

infrastructure  
│  
├── database/  
├── cache/  
├── storage/  
├── websocket/  
├── logger/  
├── monitoring/  
├── mail/  
├── queue/  
└── security/

These packages provide reusable technical capabilities to multiple modules.

They must not contain business rules.

---

# **05.12 Configuration Package**

Configuration is centralized.

config  
│  
├── application/  
├── database/  
├── jwt/  
├── redis/  
├── socket/  
├── storage/  
├── mail/  
└── environment/

Configuration packages expose typed configuration objects.

Business logic is prohibited.

---

# **05.13 Public Package Interface**

Every module exposes only its public API.

Example:

identity  
│  
├── domain/  
├── application/  
├── presentation/  
├── infrastructure/  
└── index.ts

The `index.ts` file defines the module's public exports.

Internal packages remain private.

---

# **05.14 Package Visibility**

Package visibility follows strict rules.

| Package | Accessible Outside Module |
| ----- | ----- |
| domain | ❌ No |
| application | ❌ No (except approved contracts) |
| presentation | ❌ No |
| infrastructure | ❌ No |
| index.ts | ✅ Yes |

External modules must consume only public exports.

---

# **05.15 Package Dependency Rules**

Dependencies between packages must comply with the Dependency Rule.

Allowed:

presentation  
        ↓  
application  
        ↓  
domain

infrastructure  
        ↑

Forbidden:

domain  
        ↓  
presentation

application  
        ↓  
repository implementation

controller  
        ↓  
mongoose

---

# **05.16 Naming Standards**

Package names must:

* use lowercase  
* use singular business names  
* use kebab-case where required  
* remain stable over time

Examples:

value-objects  
use-cases  
presenters  
repositories  
trainer-profile

Avoid:

UserServices  
Helpers  
CommonStuff  
Misc  
Temp  
Utils2

Packages should communicate their responsibility through their name.

---

# **05.17 Summary**

The package structure provides a **physical implementation of the approved Feature-First Modular Clean Architecture**.

It ensures:

* Consistent organization  
* Clear ownership  
* Strong encapsulation  
* Framework independence  
* Predictable navigation  
* Low coupling  
* High cohesion  
* Long-term maintainability

Every business domain follows an identical package layout, enabling developers to move between modules without learning a new structure each time.

---

# **06\. DOMAIN LAYER**

The Domain Layer represents the **Enterprise Business Rules** of the KIZUNAFIT platform.

It contains the core business knowledge, business policies, domain models, and business behavior that define how the platform operates.

The Domain Layer is the most stable part of the backend architecture.

It must remain completely independent of frameworks, databases, transport protocols, external services, and infrastructure technologies.

Every other architectural layer exists to support the Domain Layer.

---

# **06.1 Purpose**

The purpose of the Domain Layer is to encapsulate the business model of the KIZUNAFIT platform.

It defines:

* Business concepts  
* Business behavior  
* Business invariants  
* Aggregate consistency  
* Domain terminology  
* Domain policies  
* Domain events

The Domain Layer is the single source of truth for business behavior.

---

# **06.2 Domain Independence**

The Domain Layer must be completely independent.

It must not depend on:

* Express.js  
* Node.js APIs  
* HTTP  
* MongoDB  
* Mongoose  
* Redis  
* Socket.IO  
* WebRTC  
* JWT  
* Cloudinary  
* Environment Variables  
* DTOs  
* Controllers  
* Validation Libraries

The Domain Layer must compile and execute without any infrastructure.

---

# **06.3 Domain Responsibilities**

The Domain Layer is responsible for:

* Business Rules  
* Aggregate Consistency  
* Entity Behavior  
* Business Invariants  
* State Transitions  
* Business Calculations  
* Domain Policies  
* Domain Events  
* Repository Contracts  
* Value Object Validation

Nothing else.

---

# **06.4 Domain Package Structure**

Every module contains a Domain package.

domain  
│  
├── aggregates/  
├── entities/  
├── value-objects/  
├── repositories/  
├── services/  
├── events/  
├── specifications/  
├── policies/  
├── enums/  
├── exceptions/  
└── index.ts

Each package has a single responsibility.

---

# **06.5 Aggregate Roots**

Aggregate Roots are the primary consistency boundaries of the domain.

Each Aggregate Root:

* owns its child entities  
* protects business invariants  
* controls state transitions  
* exposes business behavior  
* guarantees consistency

Only Aggregate Roots may be loaded or persisted through repositories.

Examples:

User

TrainerProfile

Consultation

CoachingOffer

WorkoutProgram

NutritionPlan

CoachingRelationship

Child entities are never loaded independently.

---

# **06.6 Entities**

Entities represent business concepts with a continuous identity.

An Entity:

* possesses identity  
* encapsulates business behavior  
* protects its own invariants  
* evolves throughout its lifecycle

Example responsibilities:

User  
    verifyEmail()  
    changePassword()  
    suspend()

Offer  
    accept()  
    reject()  
    cancel()

Consultation  
    confirm()  
    cancel()  
    complete()

Entities must not expose public setters for critical business state.

State changes occur only through business methods.

---

# **06.7 Value Objects**

Value Objects represent immutable business concepts without identity.

Characteristics:

* Immutable  
* Self-validating  
* Equality by value  
* Side-effect free

Examples:

Email

PhoneNumber

Money

Duration

DateRange

WorkoutDifficulty

NutritionTarget

Once created, a Value Object cannot be modified.

---

# **06.8 Rich Domain Model**

KIZUNAFIT adopts a **Rich Domain Model**.

Business behavior belongs inside Entities and Aggregate Roots.

Example:

Correct:

Offer.accept()

WorkoutProgram.publish()

Relationship.pause()

User.verifyEmail()

Incorrect:

Offer.status \= ACCEPTED

Workout.status \= PUBLISHED

Business behavior must be expressed through domain methods.

---

# **06.9 Domain Services**

A Domain Service represents business behavior that cannot naturally belong to a single Entity or Aggregate.

A Domain Service may exist only when:

* multiple Aggregates participate  
* behavior has no natural owner  
* the logic is pure business logic

Examples:

WorkoutSchedulingService

NutritionCalculationService

TrainerMatchingService

Domain Services must never perform infrastructure operations.

---

# **06.10 Repository Interfaces**

Repository Interfaces define persistence contracts.

They belong to the Domain because persistence is required by business rules, but its implementation is not.

Example:

UserRepository

ConsultationRepository

WorkoutProgramRepository

Repository Interfaces contain only business-oriented operations.

No MongoDB-specific concepts may appear.

---

# **06.11 Domain Events**

Domain Events represent significant business occurrences.

Examples:

UserRegistered

OfferAccepted

ConsultationCompleted

PaymentVerified

WorkoutAssigned

NutritionPlanPublished

Events describe what happened.

They never describe what should happen.

---

# **06.12 Business Policies**

Business Policies encapsulate reusable business constraints.

Examples:

PasswordPolicy

TrainerVerificationPolicy

RefundEligibilityPolicy

WorkoutAssignmentPolicy

Policies are pure business rules.

They remain independent of infrastructure.

---

# **06.13 Specifications**

Specifications encapsulate reusable business predicates.

Examples:

EligibleTrainerSpecification

ActiveRelationshipSpecification

RefundablePaymentSpecification

Specifications answer business questions.

They do not perform persistence.

---

# **06.14 Enumerations**

Enumerations define closed business vocabularies.

Examples:

UserRole

AccountStatus

OfferStatus

ConsultationStatus

PaymentStatus

Enums represent approved business concepts only.

---

# **06.15 Domain Exceptions**

Domain Exceptions represent violations of business rules.

Examples:

OfferAlreadyAcceptedException

InactiveTrainerException

InvalidWorkoutStateException

RelationshipAlreadyCompletedException

Domain Exceptions express business failures, not technical failures.

---

# **06.16 Domain Purity**

The Domain Layer must remain pure.

Forbidden:

* Database Queries  
* HTTP Requests  
* Logging  
* JWT  
* Email Sending  
* Cache Access  
* File Upload  
* Cloudinary  
* Redis  
* Socket.IO

These responsibilities belong to outer layers.

---

# **06.17 Domain State Management**

All state transitions must occur through business behavior.

Example:

Correct:

consultation.complete()

Incorrect:

consultation.status \= COMPLETED

Every transition must enforce business invariants.

---

# **06.18 Domain Dependency Rules**

The Domain Layer may depend only on:

* Domain components  
* Shared Kernel (framework-independent)

The Domain Layer must never import:

* Application  
* Presentation  
* Infrastructure

This preserves the Dependency Rule.

---

# **06.19 Testing the Domain**

The Domain Layer must be fully testable without:

* MongoDB  
* Express  
* Redis  
* Cloudinary  
* Socket.IO

Domain tests execute purely in memory.

Business rules should be verifiable through unit tests alone.

---

# **06.20 Summary**

The Domain Layer is the heart of the KIZUNAFIT backend.

It defines the business model independently of technology and protects the integrity of the platform through rich domain models, aggregate boundaries, business policies, and domain events.

Every other layer depends on the Domain Layer.

The Domain Layer depends on nothing.

---

# **07\. APPLICATION LAYER**

The Application Layer implements the business use cases of the KIZUNAFIT platform.

It acts as the orchestration layer between the Presentation Layer and the Domain Layer.

The Application Layer coordinates business workflows by invoking Domain behavior, interacting with Repository Interfaces, communicating through Application Ports, and producing application responses.

It contains no framework-specific logic and no infrastructure implementations.

---

# **07.1 Purpose**

The purpose of the Application Layer is to execute business use cases.

It is responsible for coordinating the interaction between domain objects and external systems while preserving the integrity of the Domain Layer.

The Application Layer defines **how** business operations are executed.

The Domain Layer defines **what** the business rules are.

---

# **07.2 Responsibilities**

The Application Layer is responsible for:

* Executing Use Cases  
* Coordinating Aggregate Roots  
* Calling Repository Interfaces  
* Managing application transactions  
* Invoking Domain behavior  
* Publishing Domain Events  
* Calling Application Ports  
* Returning Response DTOs

The Application Layer does **not** define business rules.

---

# **07.3 Package Structure**

application  
│  
├── use-cases/  
├── dto/  
├── ports/  
├── commands/  
├── queries/  
├── mappers/  
├── exceptions/  
└── index.ts

Each package has a clearly defined responsibility.

---

# **07.4 Use Cases**

A Use Case represents a single business capability of the system.

Each Use Case:

* performs exactly one business operation  
* has a single responsibility  
* executes one application workflow  
* invokes domain behavior  
* coordinates repositories  
* returns a response

Examples:

RegisterUserUseCase

LoginUserUseCase

VerifyEmailUseCase

CreateConsultationUseCase

AcceptOfferUseCase

AssignWorkoutProgramUseCase

CreateNutritionPlanUseCase

CompleteWorkoutSessionUseCase

A Use Case should be named using a verb followed by the business concept.

---

# **07.5 Use Case Rules**

Every Use Case must:

* Have one public execution method  
* Represent one business capability  
* Be independently testable  
* Depend only on abstractions  
* Return application DTOs  
* Never expose infrastructure objects

A Use Case must never call another Use Case directly.

Shared business logic belongs in the Domain, not between Use Cases.

---

# **07.6 Command Use Cases**

Command Use Cases modify business state.

Examples:

RegisterUser

AcceptOffer

RejectOffer

CreateWorkoutProgram

AssignNutritionPlan

CompleteConsultation

CancelConsultation

Characteristics:

* Changes state  
* May publish events  
* May persist aggregates  
* May invoke external ports

---

# **07.7 Query Use Cases**

Query Use Cases retrieve information without modifying business state.

Examples:

GetTrainerProfile

GetWorkoutProgram

GetNutritionPlan

GetConversationMessages

SearchMarketplace

Characteristics:

* Read-only  
* No state modification  
* No business events  
* No transactions unless required

---

# **07.8 DTOs**

The Application Layer defines application DTOs.

Types include:

* Request DTO  
* Response DTO  
* Command DTO  
* Query DTO

DTOs isolate the Application Layer from:

* HTTP  
* Express  
* Mongoose  
* Database documents

DTOs contain only application data.

---

# **07.9 Application Ports**

Application Ports define external capabilities required by Use Cases.

Examples:

PasswordHasher

TokenGenerator

StoragePort

EmailPort

NotificationPort

CachePort

EventPublisherPort

Ports define contracts.

Infrastructure supplies implementations.

---

# **07.10 Repository Coordination**

Use Cases interact only with Repository Interfaces.

Correct:

Use Case  
        ↓  
UserRepository

Incorrect:

Use Case  
        ↓  
MongoUserRepository

Infrastructure details remain hidden.

---

# **07.11 Aggregate Coordination**

Use Cases coordinate Aggregate Roots.

Example:

AcceptOfferUseCase

↓

Load CoachingOffer

↓

offer.accept()

↓

Save CoachingOffer

Business decisions remain inside the Aggregate.

---

# **07.12 Transactions**

Application transactions belong to the Application Layer.

Responsibilities include:

* Begin transaction  
* Execute business workflow  
* Commit  
* Rollback on failure

The Domain Layer never manages transactions.

---

# **07.13 Domain Events**

Use Cases publish Domain Events after successful business operations.

Example:

RegisterUser

↓

User.register()

↓

Save User

↓

Publish UserRegistered

The event represents a completed business occurrence.

---

# **07.14 Application Exceptions**

The Application Layer may define exceptions for application-level concerns.

Examples:

ApplicationValidationException

ResourceNotFoundException

UnauthorizedOperationException

Business rule violations remain Domain Exceptions.

---

# **07.15 Dependency Rules**

The Application Layer may depend on:

* Domain Layer  
* Shared Kernel

The Application Layer must never depend on:

* Controllers  
* Express  
* HTTP  
* MongoDB  
* Mongoose  
* Redis  
* Cloudinary  
* Socket.IO  
* Infrastructure implementations

Only abstractions are permitted.

---

# **07.16 Statelessness**

Use Cases are stateless.

Each execution is independent.

No Use Case should maintain application state between requests.

State belongs to Aggregates and persistent storage.

---

# **07.17 Idempotency**

Where appropriate, Use Cases should support idempotent execution.

Examples:

* Email verification  
* Payment confirmation callbacks  
* Webhook processing

Repeated execution should not corrupt business state.

---

# **07.18 Testing**

Every Use Case must be independently testable.

Tests should replace:

* Repository Interfaces  
* Application Ports  
* Event Publishers

No database or framework is required for Use Case tests.

---

# **07.19 Layer Interaction**

The standard execution flow is:

HTTP Request  
        ↓  
Controller  
        ↓  
Request DTO  
        ↓  
Use Case  
        ↓  
Aggregate Root  
        ↓  
Repository Interface  
        ↓  
Repository Implementation  
        ↓  
Database

This flow applies consistently across all business modules.

---

# **07.20 Summary**

The Application Layer orchestrates business workflows while preserving the independence of the Domain Layer.

Use Cases are the sole entry points into the business model.

They coordinate repositories, aggregates, ports, and events without containing infrastructure concerns or redefining business rules.

---

# **08\. INTERFACE ADAPTERS**

The Interface Adapters layer acts as the boundary between external interfaces and the Application Layer.

Its responsibility is to translate external requests into application requests and transform application responses into formats understood by external systems.

The Interface Adapters layer contains no business rules.

It exists solely to adapt different interfaces to the Application Layer while preserving the independence of the business core.

---

# **08.1 Purpose**

The purpose of the Interface Adapters layer is to isolate the Application Layer from external technologies.

It converts:

* HTTP Requests  
* WebSocket Messages  
* Background Job Messages  
* External Service Callbacks  
* Scheduled Tasks

into application requests.

Likewise, it converts application responses into formats suitable for external consumers.

---

# **08.2 Responsibilities**

The Interface Adapters layer is responsible for:

* Receiving external requests  
* Validating incoming data  
* Mapping requests into Application Contracts  
* Invoking Use Cases  
* Mapping responses  
* Formatting errors  
* Returning transport-specific responses

It never executes business rules.

---

# **08.3 Package Structure**

presentation  
│  
├── controllers/  
├── routes/  
├── validators/  
├── presenters/  
├── middleware/  
├── serializers/  
└── index.ts

Every component has a single responsibility.

---

# **08.4 Controllers**

Controllers receive requests from external actors.

Responsibilities:

* Receive requests  
* Extract input  
* Invoke validators  
* Create Request Contracts  
* Execute Use Cases  
* Return Presenter output

Controllers must remain thin.

A Controller should never:

* Access repositories  
* Modify entities  
* Execute business rules  
* Perform calculations

Controllers orchestrate request handling only.

---

# **08.5 Routes**

Routes map external endpoints to Controllers.

Responsibilities:

* Register endpoints  
* Apply middleware  
* Configure authorization  
* Connect controllers

Routes contain no logic.

Example:

POST /auth/register

↓

RegisterController

---

# **08.6 Validators**

Validators verify the structure of incoming data.

Validation includes:

* Required fields  
* Data types  
* Length constraints  
* Format validation  
* Enum validation

Validators verify input structure.

Business validation belongs to the Domain.

Example:

Correct:

Email format is valid

Incorrect:

Email already exists

Existence is a business concern.

---

# **08.7 Presenters**

Presenters convert Application Responses into transport-specific responses.

Responsibilities:

* Response formatting  
* Success response mapping  
* Error response mapping  
* Pagination formatting  
* Metadata generation

Presenters isolate the Application Layer from HTTP.

---

# **08.8 Serializers**

Serializers transform objects into transport representations.

Examples:

* JSON  
* Socket Payloads  
* Webhook Responses

Serialization is an infrastructure concern.

Business logic is prohibited.

---

# **08.9 Middleware**

Middleware performs request pipeline concerns.

Examples:

* Authentication  
* Authorization  
* Rate Limiting  
* Request Logging  
* Correlation IDs  
* Request Context  
* CORS

Middleware must never execute business logic.

---

# **08.10 Request Flow**

The standard request flow is:

HTTP Request  
        ↓  
Route  
        ↓  
Middleware  
        ↓  
Controller  
        ↓  
Validator  
        ↓  
Application Contract  
        ↓  
Use Case

The Presentation Layer ends when the Use Case begins.

---

# **08.11 Response Flow**

The standard response flow is:

Use Case  
        ↓  
Response Contract  
        ↓  
Presenter  
        ↓  
Serializer  
        ↓  
HTTP Response

Application responses remain independent of transport protocols.

---

# **08.12 Transport Independence**

The Application Layer must not know whether it is being called from:

* REST API  
* Socket.IO  
* Scheduled Job  
* CLI  
* Future GraphQL API  
* Future gRPC Service

Each transport uses its own Adapter.

---

# **08.13 Controller Rules**

Every Controller must:

* Handle one resource or capability  
* Be stateless  
* Delegate business execution  
* Return standardized responses

Controllers should remain small and predictable.

---

# **08.14 Validation Rules**

Validation is divided into two categories.

### **Structural Validation**

Performed by Validators.

Examples:

* Missing field  
* Invalid email format  
* Invalid UUID  
* Incorrect data type

### **Business Validation**

Performed by the Domain.

Examples:

* User already exists  
* Consultation already completed  
* Offer already accepted  
* Payment already refunded

This separation preserves domain integrity.

---

# **08.15 Adapter Independence**

Adapters may depend on:

* Application Layer  
* Shared Kernel

Adapters must never depend on:

* Infrastructure implementations  
* Database models  
* Mongoose documents

Only Use Cases are invoked.

---

# **08.16 Multiple Adapters**

The Application Layer may be accessed through multiple adapters.

Examples:

REST Controller

↓

RegisterUserUseCase

Socket.IO Handler

↓

RegisterUserUseCase

Admin Console

↓

RegisterUserUseCase

Every adapter invokes the same Use Case.

---

# **08.17 Testing**

Interface Adapters are tested independently.

Tests verify:

* Request mapping  
* Validation  
* Response formatting  
* Error mapping

Business rules are tested elsewhere.

---

# **08.18 Summary**

The Interface Adapters layer translates between external systems and the Application Layer.

It protects the business core from transport protocols, frameworks, and client-specific concerns.

Controllers, Routes, Validators, Presenters, Middleware, and Serializers work together to ensure that every request enters the system through a consistent, framework-independent interface while keeping business logic exclusively within the Domain and Application layers.

---

# **09\. INFRASTRUCTURE LAYER**

The Infrastructure Layer contains all technical implementations required to support the business capabilities of the KIZUNAFIT platform.

It provides concrete implementations for the interfaces defined by the Domain and Application layers while remaining completely isolated from business logic.

The Infrastructure Layer is the outermost layer of the backend architecture and is considered replaceable.

---

# **09.1 Purpose**

The purpose of the Infrastructure Layer is to implement technical concerns required by the system.

It provides implementations for:

* Persistence  
* External APIs  
* Authentication Providers  
* Email Providers  
* File Storage  
* Cache  
* Message Brokers  
* Realtime Communication  
* Background Processing  
* Logging  
* Monitoring

The Infrastructure Layer serves the business.

The business never serves the Infrastructure.

---

# **09.2 Responsibilities**

The Infrastructure Layer is responsible for:

* Database access  
* Repository implementations  
* External service integrations  
* Cache implementations  
* File storage  
* Email delivery  
* Queue processing  
* JWT generation  
* Password hashing  
* WebSocket infrastructure  
* WebRTC signaling infrastructure  
* Logging  
* Monitoring

The Infrastructure Layer is **not** responsible for:

* Business rules  
* State transitions  
* Business validation  
* Aggregate consistency  
* Domain policies

---

# **09.3 Package Structure**

infrastructure  
│  
├── persistence/  
├── repositories/  
├── providers/  
├── cache/  
├── messaging/  
├── storage/  
├── websocket/  
├── scheduler/  
├── logger/  
├── monitoring/  
├── security/  
└── index.ts

Each package has a single technical responsibility.

---

# **09.4 Persistence**

Persistence is responsible for storing and retrieving data.

Examples:

* MongoDB  
* Mongoose  
* Transactions  
* Database Connections  
* Indexes

Persistence must never contain business rules.

---

# **09.5 Repository Implementations**

Repository Implementations provide concrete implementations of Repository Interfaces defined by the Domain.

Example:

Domain  
│  
└── IUserRepository

↓

Infrastructure

└── MongoUserRepository

Repository implementations may use:

* Mongoose  
* MongoDB  
* Aggregation Pipelines  
* Transactions

They must not expose persistence details outside the Infrastructure Layer.

---

# **09.6 Providers**

Providers implement external application ports.

Examples:

EmailProvider

PasswordHasher

JwtProvider

CloudinaryStorageProvider

NotificationProvider

PaymentGatewayProvider

Each Provider implements a contract defined by the Application Layer.

---

# **09.7 Cache**

The Cache package provides caching implementations.

Examples:

* Redis  
* In-memory cache  
* Future distributed cache

Responsibilities include:

* OTP storage  
* Session cache  
* Rate limiting  
* Temporary tokens  
* Frequently accessed data

Business decisions must not depend on cache availability.

Cache is an optimization, not a source of truth.

---

# **09.8 Storage**

Storage manages binary assets.

Examples:

* Profile avatars  
* Trainer certificates  
* Workout attachments  
* Nutrition images

Responsibilities:

* Upload  
* Download  
* Delete  
* Folder management  
* File naming

Business logic remains outside the Storage package.

---

# **09.9 Messaging**

Messaging integrates with asynchronous communication mechanisms.

Examples:

* Email  
* Push notifications  
* SMS  
* Future message brokers

Messaging is responsible only for delivery.

Business decisions occur before messaging.

---

# **09.10 WebSocket Infrastructure**

WebSocket infrastructure manages realtime communication.

Responsibilities:

* Client connections  
* Connection lifecycle  
* Event dispatching  
* Room management  
* Presence tracking

Business events are handled by the Application Layer.

Socket.IO is only the transport mechanism.

---

# **09.11 WebRTC Signaling Infrastructure**

The Infrastructure Layer provides signaling capabilities for WebRTC.

Responsibilities:

* Offer exchange  
* Answer exchange  
* ICE candidate forwarding  
* Session negotiation  
* Connection management

Media transmission occurs directly between peers.

The backend participates only in signaling.

---

# **09.12 Scheduler**

The Scheduler executes asynchronous background tasks.

Examples:

* Expired consultation cleanup  
* Offer expiration  
* Notification dispatch  
* Reminder generation  
* Token cleanup

The Scheduler invokes Use Cases.

It does not execute business logic directly.

---

# **09.13 Logging**

Logging captures technical information.

Examples:

* Request logs  
* Error logs  
* Security logs  
* Audit logs  
* Performance logs

Logging must not alter application behavior.

---

# **09.14 Monitoring**

Monitoring provides operational visibility.

Examples:

* Health checks  
* Application metrics  
* Memory usage  
* CPU utilization  
* Database latency  
* Queue health

Monitoring supports system operations.

---

# **09.15 Security**

Security implementations provide technical security capabilities.

Examples:

* Password hashing  
* JWT generation  
* Encryption  
* Secure random generation  
* Secret management

Security policies remain in the business layers.

Infrastructure implements them.

---

# **09.16 Infrastructure Dependency Rules**

The Infrastructure Layer may depend on:

* Domain  
* Application  
* Shared Kernel  
* External Frameworks  
* Third-party Libraries

Examples:

* Express  
* MongoDB  
* Mongoose  
* Redis  
* Cloudinary  
* Socket.IO  
* Nodemailer  
* JWT Libraries

No inner layer may depend on Infrastructure.

---

# **09.17 Replaceability**

Infrastructure components must be replaceable.

Examples:

MongoRepository  
        ↓  
PostgreSQLRepository

Cloudinary  
        ↓  
Amazon S3

Redis  
        ↓  
Valkey

Socket.IO  
        ↓  
Native WebSocket

Replacing infrastructure should not require modifications to the Domain or Application layers.

---

# **09.18 Infrastructure Testing**

Infrastructure is tested independently.

Tests verify:

* Database operations  
* Repository implementations  
* External API integrations  
* Cache operations  
* Storage operations  
* Messaging  
* Security providers

Business behavior is tested elsewhere.

---

# **09.19 Failure Handling**

Infrastructure failures include:

* Database unavailable  
* Cache unavailable  
* Email delivery failure  
* Cloudinary failure  
* External API timeout  
* Network failure

Infrastructure converts technical failures into meaningful exceptions that the Application Layer can handle.

Technical implementation details must not leak into the business layers.

---

# **09.20 Summary**

The Infrastructure Layer contains all replaceable technical implementations required by the KIZUNAFIT backend.

It fulfills contracts defined by the Domain and Application layers while remaining isolated from business logic.

Its primary responsibility is to support the business, not define it.

---

# **10\. DEPENDENCY INJECTION**

The KIZUNAFIT backend adopts **Dependency Injection (DI)** as the official mechanism for constructing and managing application dependencies.

Dependency Injection enforces the Dependency Rule by ensuring that high-level business components depend only on abstractions rather than concrete implementations.

Object creation is centralized within the **Composition Root**, while business components receive their dependencies through constructor injection.

---

# **10.1 Purpose**

The purpose of Dependency Injection is to:

* Enforce Dependency Inversion  
* Eliminate tight coupling  
* Improve testability  
* Centralize object creation  
* Support implementation replacement  
* Simplify dependency management  
* Preserve Clean Architecture boundaries

Business components should never create their own dependencies.

---

# **10.2 Dependency Inversion Principle**

High-level policies depend upon abstractions.

Low-level implementations fulfill those abstractions.

Correct:

RegisterUserUseCase  
        │  
        ▼  
IUserRepository  
        ▲  
        │  
MongoUserRepository

Incorrect:

RegisterUserUseCase  
        │  
        ▼  
MongoUserRepository

The Use Case should never know which persistence technology is being used.

---

# **10.3 Constructor Injection**

Constructor Injection is the only approved injection mechanism.

Example:

RegisterUserUseCase  
│  
├── IUserRepository  
├── PasswordHasher  
├── TokenGenerator  
├── EventPublisher  
└── Clock

Dependencies are supplied during object construction.

Setter Injection and Property Injection are prohibited.

---

# **10.4 Composition Root**

The Composition Root is the single location responsible for creating and wiring the application.

Location:

bootstrap/  
└── dependency-injection/

Responsibilities:

* Register implementations  
* Resolve dependencies  
* Configure containers  
* Build object graphs  
* Start the application

Object creation outside the Composition Root is prohibited.

---

# **10.5 Dependency Registration**

Every abstraction must be mapped to one concrete implementation.

Example:

IUserRepository  
        │  
        ▼  
MongoUserRepository

PasswordHasher  
        │  
        ▼  
BcryptPasswordHasher

EmailSender  
        │  
        ▼  
NodemailerEmailSender

Registration occurs only during application startup.

---

# **10.6 Lifetime Management**

Dependencies are categorized by lifetime.

### **Singleton**

Created once per application.

Examples:

* Database Connection  
* Redis Client  
* Logger  
* Configuration  
* Event Bus

---

### **Scoped**

Created once per request.

Examples:

* Request Context  
* Unit of Work  
* Transaction Manager

---

### **Transient**

Created every time they are requested.

Examples:

* Use Cases  
* Validators  
* Presenters  
* Mappers

Each dependency must have a clearly defined lifecycle.

---

# **10.7 Injecting Repository Interfaces**

Use Cases receive Repository Interfaces through constructor injection.

Flow:

Controller  
        │  
        ▼  
RegisterUserUseCase  
        │  
        ▼  
IUserRepository  
        ▲  
        │  
MongoUserRepository

The Application Layer remains independent of persistence.

---

# **10.8 Injecting Application Ports**

Application Ports are injected exactly like repositories.

Examples:

PasswordHasher

TokenGenerator

EmailSender

StorageGateway

NotificationGateway

CacheGateway

The Application Layer depends only on the Port.

Infrastructure provides the implementation.

---

# **10.9 Dependency Graph**

A typical dependency graph:

Controller  
        │  
        ▼  
Use Case  
        │  
        ├──────────► Repository Interface  
        │                     ▲  
        │                     │  
        │             Repository Implementation  
        │  
        ├──────────► Email Port  
        │                     ▲  
        │                     │  
        │              SMTP Email Sender  
        │  
        ├──────────► Password Hasher  
        │                     ▲  
        │                     │  
        │             Bcrypt Hasher  
        │  
        └──────────► Event Publisher

Dependencies always point toward abstractions.

---

# **10.10 Circular Dependencies**

Circular dependencies are strictly prohibited.

Example:

UserUseCase  
        ▼  
ProfileUseCase  
        ▼  
UserUseCase

This creates architectural coupling.

Shared behavior should be extracted into:

* Domain Services  
* Shared Policies  
* Shared Application Ports

---

# **10.11 Module Isolation**

Each business module registers only its own dependencies.

Example:

Identity Module

↓

Identity Repositories

↓

Identity Ports

↓

Identity Use Cases

Modules do not register dependencies belonging to other domains.

---

# **10.12 Infrastructure Injection**

Infrastructure implementations are injected through interfaces.

Example:

Application

↓

StorageGateway

↓

CloudinaryStorageGateway

Future replacement:

StorageGateway

↓

AmazonS3StorageGateway

The Application Layer remains unchanged.

---

# **10.13 Testing with Dependency Injection**

Dependency Injection enables isolated testing.

Production:

IUserRepository

↓

MongoUserRepository

Unit Test:

IUserRepository

↓

InMemoryUserRepository

No changes to the Use Case are required.

---

# **10.14 Dependency Rules**

Business components may request only abstractions.

Forbidden:

* `new MongoUserRepository()`  
* `new RedisClient()`  
* `new CloudinaryStorageGateway()`

Allowed:

* Constructor injection  
* Dependency resolution by the Composition Root

---

# **10.15 Framework Independence**

The Dependency Injection container is an implementation detail.

The backend may use:

* tsyringe  
* InversifyJS  
* NestJS Container  
* Manual Composition

The business layers must never depend directly on the DI framework.

The container should remain confined to the Composition Root.

---

# **10.16 Configuration Injection**

Configuration values should be injected through configuration abstractions.

Example:

JwtConfiguration

DatabaseConfiguration

StorageConfiguration

EmailConfiguration

Environment variables must never be accessed directly inside Use Cases or Domain objects.

---

# **10.17 Dependency Validation**

Application startup should verify:

* Missing registrations  
* Duplicate registrations  
* Circular dependencies  
* Invalid configurations

The application should fail fast if dependency resolution is invalid.

---

# **10.18 Architectural Rules**

The following rules are mandatory:

* Constructor Injection only  
* One Composition Root  
* No Service Locator pattern  
* No static dependency access  
* No manual instantiation in business layers  
* Interfaces owned by inner layers  
* Implementations owned by Infrastructure

These rules preserve Clean Architecture.

---

# **10.19 Summary**

Dependency Injection ensures that the KIZUNAFIT backend remains loosely coupled, highly testable, and compliant with the Dependency Rule.

Business components depend only on abstractions, while concrete implementations are created and wired exclusively by the Composition Root.

This approach allows infrastructure technologies to evolve independently without affecting the business core.

---

# **11\. REQUEST LIFECYCLE**

The Request Lifecycle defines the complete execution flow of a request through the KIZUNAFIT backend.

It describes how a request enters the system, traverses the architectural layers, executes business behavior, persists changes, and returns a response while preserving the principles of Pure Clean Architecture.

Every inbound request, regardless of transport mechanism, follows a standardized lifecycle.

---

# **11.1 Purpose**

The purpose of the Request Lifecycle is to:

* Standardize request processing  
* Preserve architectural boundaries  
* Ensure consistent execution  
* Enforce security  
* Maintain transactional consistency  
* Simplify debugging  
* Improve observability

Every request follows the same architectural pipeline.

---

# **11.2 Supported Entry Points**

The backend supports multiple inbound interfaces.

Examples:

* REST API  
* Socket.IO Events  
* Scheduled Jobs  
* Background Workers  
* Webhook Callbacks

Each interface uses its own Adapter.

After entering the Application Layer, every request follows the same execution flow.

---

# **11.3 High-Level Request Flow**

               Client  
                   │  
                   ▼  
          HTTP / Socket.IO / Scheduler  
                   │  
                   ▼  
             Route / Event Handler  
                   │  
                   ▼  
              Middleware Pipeline  
                   │  
                   ▼  
               Controller  
                   │  
                   ▼  
          Request Validation  
                   │  
                   ▼  
          Request Contract (DTO)  
                   │  
                   ▼  
               Use Case  
                   │  
         ┌─────────┴─────────┐  
         ▼                   ▼  
 Repository Interfaces   Application Ports  
         │                   │  
         ▼                   ▼  
 Infrastructure       External Services  
         │  
         ▼  
      Database  
         │  
         ▼  
 Aggregate Persistence  
         │  
         ▼  
 Response Contract  
         │  
         ▼  
     Presenter  
         │  
         ▼  
 HTTP / Socket Response

Every request passes through the same architectural boundaries.

---

# **11.4 Request Reception**

The request enters through an inbound adapter.

Examples:

REST API

↓

POST /api/v1/auth/register

Socket.IO

↓

consultation:join

Scheduler

↓

ExpireOffersJob

The transport protocol is irrelevant beyond the Presentation Layer.

---

# **11.5 Route Resolution**

The routing layer identifies the appropriate Controller.

Responsibilities:

* Endpoint matching  
* API versioning  
* Route grouping  
* Middleware registration

Routes contain no business logic.

---

# **11.6 Middleware Pipeline**

Before reaching the Controller, the request passes through middleware.

Typical middleware sequence:

Request  
    │  
    ▼  
Request ID  
    │  
    ▼  
Request Logger  
    │  
    ▼  
CORS  
    │  
    ▼  
Rate Limiter  
    │  
    ▼  
Authentication  
    │  
    ▼  
Authorization  
    │  
    ▼  
Controller

Each middleware performs a single cross-cutting concern.

---

# **11.7 Controller Execution**

The Controller acts as the entry point into the Application Layer.

Responsibilities:

* Receive validated request  
* Extract input  
* Build Request Contract  
* Invoke Use Case  
* Return Presenter response

Controllers remain thin.

No business rules are executed here.

---

# **11.8 Request Validation**

Structural validation occurs before entering the Application Layer.

Examples:

* Required fields  
* Data types  
* Email format  
* Enum values  
* Length constraints

Business validation occurs later inside the Domain.

---

# **11.9 Request Contract Creation**

Validated input is transformed into an Application Request Contract.

Example:

HTTP Request

↓

RegisterUserRequest

The Application Layer never receives HTTP-specific objects.

---

# **11.10 Use Case Execution**

The Use Case orchestrates the business workflow.

Responsibilities:

* Load Aggregates  
* Invoke Domain behavior  
* Coordinate repositories  
* Publish events  
* Invoke application ports

Business decisions remain inside the Domain.

---

# **11.11 Aggregate Interaction**

The Use Case loads Aggregate Roots through Repository Interfaces.

Example:

RegisterUserUseCase

↓

UserRepository

↓

User Aggregate

↓

user.verifyEmail()

State changes occur through business methods only.

---

# **11.12 Infrastructure Interaction**

Repository Interfaces are resolved by Infrastructure implementations.

Examples:

UserRepository

↓

MongoUserRepository

↓

MongoDB

The Application Layer remains unaware of persistence technology.

---

# **11.13 Transaction Boundary**

State-changing Use Cases execute within a transaction when required.

Flow:

Begin Transaction

↓

Execute Use Case

↓

Persist Aggregates

↓

Commit

↓

Publish Events

On failure:

Rollback

↓

Return Failure

Transaction management belongs to the Application Layer through the Unit of Work abstraction.

---

# **11.14 Domain Events**

After successful persistence, Domain Events are published.

Example:

User Registered

↓

Publish UserRegisteredEvent

↓

Notification Handler

↓

Welcome Email

Events are published only after business consistency is achieved.

---

# **11.15 Response Contract**

The Use Case returns an Application Response Contract.

The response contains only business data.

It contains no:

* HTTP Status Codes  
* Express Objects  
* Database Documents  
* Mongoose Models

---

# **11.16 Presenter**

The Presenter transforms the Application Response into the transport format.

Responsibilities:

* Success formatting  
* Error formatting  
* Pagination metadata  
* Response envelope

Presentation concerns end here.

---

# **11.17 Response Delivery**

The adapted response is returned through the originating transport.

Examples:

* HTTP JSON Response  
* Socket.IO Event  
* Webhook Callback  
* Background Job Result

The Application Layer remains transport-independent.

---

# **11.18 Error Flow**

Errors propagate through the architectural layers.

Domain Exception

↓

Application Exception

↓

Global Exception Handler

↓

Standard Error Response

Infrastructure exceptions are translated into application-level failures before reaching the client.

---

# **11.19 Logging & Observability**

The request lifecycle emits operational information at key stages.

Examples:

* Request received  
* Authentication completed  
* Use Case started  
* Transaction committed  
* Event published  
* Response sent  
* Error occurred

Logging is observational only.

It must not affect business execution.

---

# **11.20 Summary**

Every request entering the KIZUNAFIT backend follows a consistent architectural lifecycle.

Regardless of whether the request originates from REST, Socket.IO, a scheduler, or another transport, it passes through standardized stages of validation, application orchestration, domain execution, persistence, response mapping, and delivery.

This consistent lifecycle preserves Clean Architecture boundaries, ensures predictable execution, and makes the backend easier to understand, test, monitor, and maintain.

---

# **12\. AUTHENTICATION ARCHITECTURE**

The Authentication Architecture defines how users establish their identity within the KIZUNAFIT platform.

It provides a secure, stateless, and framework-independent authentication mechanism while preserving the principles of Clean Architecture.

Authentication is responsible only for verifying identity.

It does **not** determine what an authenticated user is permitted to do.

Authorization is handled separately.

---

# **12.1 Purpose**

The Authentication Architecture exists to:

* Verify user identity  
* Establish authenticated sessions  
* Protect private resources  
* Support secure login mechanisms  
* Enable stateless authentication  
* Support multiple authentication providers  
* Maintain secure token management

Authentication does not contain business rules.

---

# **12.2 Authentication Principles**

The authentication system follows these principles:

* Stateless authentication  
* Short-lived Access Tokens  
* Rotating Refresh Tokens  
* Secure password hashing  
* Email verification  
* Account status validation  
* Multi-device session support  
* Framework independence

Every authentication request follows the same workflow.

---

# **12.3 Authentication Components**

The authentication subsystem consists of:

Presentation  
│  
├── Login Controller  
├── Logout Controller  
├── Refresh Controller  
└── OAuth Controller

↓

Application

├── LoginUserUseCase  
├── RefreshAccessTokenUseCase  
├── LogoutUseCase  
├── LogoutAllDevicesUseCase  
├── GoogleLoginUseCase

↓

Domain

├── User Aggregate  
├── RefreshTokenSession Aggregate  
├── Password Policy  
└── Repository Interfaces

↓

Infrastructure

├── JWT Provider  
├── Password Hasher  
├── Refresh Token Repository  
└── OAuth Provider

---

# **12.4 Authentication Methods**

The platform supports:

* Email & Password Authentication  
* Google OAuth Authentication  
* Refresh Token Authentication

Future authentication methods may be added without modifying the Domain Layer.

---

# **12.5 Authentication Flow**

User  
    │  
    ▼  
Login Request  
    │  
    ▼  
Login Controller  
    │  
    ▼  
LoginUseCase  
    │  
    ├── Find User  
    ├── Verify Password  
    ├── Validate Account Status  
    ├── Create Refresh Session  
    ├── Generate Tokens  
    ▼  
Response Contract  
    │  
    ▼  
HTTP Response

Business decisions remain inside the Use Case and Domain.

---

# **12.6 Access Token**

The Access Token is used to authenticate API requests.

Characteristics:

* Short-lived  
* Stateless  
* Signed  
* Contains minimal claims  
* Never stored in the database

Typical claims include:

* User ID  
* Role  
* Token Version  
* Issued At  
* Expiration

Sensitive business data must never be embedded.

---

# **12.7 Refresh Token**

Refresh Tokens are used to obtain new Access Tokens.

Characteristics:

* Long-lived  
* Rotated after each use  
* Stored securely  
* Bound to a session  
* Revocable

Refresh Tokens are persisted through the `RefreshTokenSession` aggregate.

---

# **12.8 Session Management**

Each login creates an independent session.

A session records information such as:

* User  
* Device Identifier  
* IP Address  
* User Agent  
* Refresh Token Hash  
* Last Activity  
* Expiration

Multiple concurrent sessions are supported.

---

# **12.9 Token Rotation**

Every successful refresh operation rotates the Refresh Token.

Flow:

Refresh Request  
        │  
        ▼  
Validate Refresh Token  
        │  
        ▼  
Invalidate Previous Token  
        │  
        ▼  
Generate New Refresh Token  
        │  
        ▼  
Generate New Access Token  
        │  
        ▼  
Persist Updated Session

Old Refresh Tokens become invalid immediately after rotation.

---

# **12.10 Password Verification**

Passwords are never stored in plaintext.

Authentication uses a Password Hasher abstraction.

Example flow:

Plain Password  
        │  
        ▼  
PasswordHasher  
        │  
        ▼  
Stored Password Hash

The Application Layer depends only on the `PasswordHasher` port.

---

# **12.11 Email Verification**

Unverified accounts cannot access protected features.

During authentication:

Find User  
        │  
        ▼  
Email Verified?  
        │  
        ├── No → Reject Login  
        ▼  
Continue Authentication

The verification rule is a business rule enforced before authentication succeeds.

---

# **12.12 Account Status Validation**

Authentication validates account state.

Examples:

* Active  
* Suspended  
* Deactivated  
* Deleted (if retained temporarily)

Users in invalid states are denied authentication.

---

# **12.13 Logout**

Logout invalidates the active Refresh Token session.

Flow:

Logout Request  
        │  
        ▼  
Find Session  
        │  
        ▼  
Revoke Session  
        │  
        ▼  
Return Success

The Access Token expires naturally.

---

# **12.14 Logout All Devices**

This operation revokes every active session belonging to the authenticated user.

Flow:

User  
        │  
        ▼  
Find All Sessions  
        │  
        ▼  
Revoke All  
        │  
        ▼  
Return Success

Future refresh attempts from revoked sessions fail.

---

# **12.15 Google Authentication**

Google OAuth authentication follows the same business workflow after identity verification.

Google OAuth  
        │  
        ▼  
Verify Google Identity  
        │  
        ▼  
GoogleLoginUseCase  
        │  
        ▼  
Create or Find User  
        │  
        ▼  
Generate Tokens

Business rules remain identical regardless of authentication provider.

---

# **12.16 Authentication Middleware**

Protected endpoints use authentication middleware.

Responsibilities:

* Extract Access Token  
* Verify signature  
* Validate expiration  
* Build authenticated context  
* Forward request

The middleware does not perform authorization.

---

# **12.17 Authentication Context**

After successful authentication, an authenticated context is created.

Typical contents:

* User ID  
* Role  
* Session ID  
* Token Identifier

This context is passed to the Application Layer.

---

# **12.18 Failure Handling**

Authentication failures include:

* Invalid credentials  
* Expired Access Token  
* Invalid Refresh Token  
* Revoked session  
* Suspended account  
* Unverified email

Failures return standardized application errors.

---

# **12.19 Security Rules**

Authentication must enforce:

* Secure password hashing  
* HTTPS-only transmission  
* Refresh Token rotation  
* Session revocation  
* Minimal JWT claims  
* Replay protection where applicable

Authentication credentials must never be logged.

---

# **12.20 Summary**

The Authentication Architecture provides a secure, stateless identity verification mechanism for the KIZUNAFIT platform.

It supports multiple authentication providers, rotating Refresh Tokens, multi-device sessions, and framework-independent authentication while remaining fully compliant with the principles of Clean Architecture.

---

# **13\. AUTHORIZATION ARCHITECTURE**

The Authorization Architecture defines how the KIZUNAFIT platform determines whether an authenticated actor is permitted to perform a requested operation.

Authorization is responsible for evaluating permissions based on business roles, ownership, resource relationships, and business policies.

Authorization begins only after successful authentication.

---

# **13.1 Purpose**

The Authorization Architecture exists to:

* Protect business resources  
* Enforce business permissions  
* Enforce ownership  
* Enforce coaching relationships  
* Protect administrative operations  
* Prevent privilege escalation  
* Centralize authorization rules

Authorization never authenticates users.

---

# **13.2 Authorization Principles**

Authorization follows these principles:

* Authentication precedes Authorization  
* Deny by default  
* Least privilege  
* Explicit permission evaluation  
* Resource ownership validation  
* Business policy enforcement  
* Framework independence

Every protected request must be explicitly authorized.

---

# **13.3 Authorization Components**

Presentation  
│  
├── Authentication Middleware  
├── Authorization Middleware  
└── Controller

↓

Application

├── Authorization Policies  
├── Authorization Service  
└── Use Cases

↓

Domain

├── Business Policies  
├── Aggregate Rules  
└── Ownership Rules

Authorization decisions originate from business rules.

---

# **13.4 Authorization Levels**

Authorization is evaluated at multiple levels.

## **Level 1**

Authentication

Is the user authenticated?

---

## **Level 2**

Role Validation

Is the user a Client?

Trainer?

Administrator?

---

## **Level 3**

Ownership Validation

Does this Consultation belong to this Client?

Does this Workout belong to this Coaching Relationship?

---

## **Level 4**

Business Policy Validation

Can this Offer still be accepted?

Can this Payment be refunded?

Can this Consultation be cancelled?

Only when every level succeeds is access granted.

---

# **13.5 Role-Based Authorization (RBAC)**

The platform supports the following business roles:

Client

Trainer

Administrator

Each role has a predefined set of capabilities.

Example:

Client

* Browse Trainers  
* Purchase Coaching  
* Join Consultation  
* View Own Plans

Trainer

* Manage Availability  
* Create Workout Programs  
* Create Nutrition Plans  
* Conduct Consultations

Administrator

* Moderate Platform  
* Manage Users  
* Handle Refunds  
* Platform Configuration

---

# **13.6 Resource Ownership**

Many operations require ownership validation.

Examples:

Client

↓

Own Consultation

Allowed.

Client

↓

Another Client Consultation

Denied.

Ownership validation is mandatory for private resources.

---

# **13.7 Relationship Authorization**

Certain resources require an active business relationship.

Example:

Client

↓

Active Coaching Relationship

↓

Workout Program

Allowed.

Without an active relationship:

Denied.

Business relationships determine access.

---

# **13.8 Administrative Authorization**

Administrative privileges apply only to administrative endpoints.

Examples:

/users

/refunds

/platform-configurations

/reports

Administrative privileges do not bypass business rules.

---

# **13.9 Authorization Policies**

Authorization logic is encapsulated within policies.

Examples:

ConsultationAccessPolicy

WorkoutAccessPolicy

NutritionPlanAccessPolicy

RefundPolicy

ReportModerationPolicy

Policies evaluate business permissions.

Controllers must never contain authorization logic.

---

# **13.10 Aggregate Authorization**

Aggregate Roots enforce their own business invariants.

Example:

Offer.accept()

The Aggregate validates whether acceptance is allowed.

Authorization ensures the actor is permitted to invoke the operation.

Business validation remains inside the Aggregate.

---

# **13.11 Authorization Flow**

Request  
        │  
        ▼  
Authentication  
        │  
        ▼  
Role Validation  
        │  
        ▼  
Ownership Validation  
        │  
        ▼  
Business Policy Validation  
        │  
        ▼  
Use Case

Every protected operation follows this sequence.

---

# **13.12 Authorization Context**

The Authorization Context contains:

* User Identifier  
* Business Role  
* Session Identifier  
* Resource Ownership  
* Business Relationship

This context is passed to the Application Layer.

---

# **13.13 Permission Evaluation**

Authorization evaluates permissions using business information.

Example:

Trainer

↓

Own Workout Program

↓

Published

↓

Allowed

Example:

Trainer

↓

Another Trainer Workout

↓

Denied

---

# **13.14 Cross-Domain Authorization**

Authorization may require information from multiple domains.

Example:

Identity

↓

Coaching Relationship

↓

Workout

↓

Permission Decision

Cross-domain queries occur through Repository Interfaces.

---

# **13.15 Infrastructure Independence**

Authorization must remain independent of:

* Express  
* JWT Library  
* MongoDB  
* Mongoose  
* Redis

Infrastructure provides identity.

Business determines permissions.

---

# **13.16 Authorization Failures**

Authorization failures include:

* Missing role  
* Insufficient permissions  
* Resource not owned  
* Inactive coaching relationship  
* Suspended account  
* Business policy violation

All failures return standardized authorization errors.

---

# **13.17 Auditing**

Authorization decisions affecting sensitive operations should be auditable.

Examples:

* Administrative actions  
* Refund approvals  
* User suspensions  
* Platform configuration changes

Audit logging records:

* Actor  
* Action  
* Resource  
* Timestamp  
* Result

Audit logs are immutable.

---

# **13.18 Testing**

Authorization policies must be independently testable.

Tests verify:

* Role permissions  
* Ownership validation  
* Business relationships  
* Administrative privileges  
* Failure scenarios

No infrastructure dependencies are required.

---

# **13.19 Security Principles**

Authorization enforces:

* Least privilege  
* Explicit permission checks  
* Resource ownership  
* Defense in depth  
* Separation of duties

Access is denied unless explicitly permitted.

---

# **13.20 Summary**

The Authorization Architecture protects the business resources of the KIZUNAFIT platform by enforcing role-based permissions, ownership validation, business relationships, and domain policies.

Authorization remains independent of authentication mechanisms and infrastructure technologies while ensuring that every protected business operation is executed only by authorized actors.

---

# **14\. REPOSITORY ARCHITECTURE**

The Repository Architecture defines how Aggregate Roots are persisted and retrieved while preserving the independence of the Domain and Application layers.

Repositories provide the only approved mechanism for accessing persistent business data.

The Repository pattern separates business logic from persistence concerns by exposing repository interfaces within the Domain Layer and implementing them within the Infrastructure Layer.

---

# **14.1 Purpose**

The Repository Architecture exists to:

* Abstract persistence  
* Preserve Domain independence  
* Hide database implementation details  
* Maintain Aggregate consistency  
* Support replaceable persistence technologies  
* Improve testability  
* Enforce Clean Architecture

Repositories exist to serve the Domain.

They do not expose database behavior.

---

# **14.2 Repository Principles**

Repositories follow these principles:

* One Repository per Aggregate Root  
* Repository Interfaces belong to the Domain  
* Repository Implementations belong to Infrastructure  
* Repositories persist Aggregates  
* Repositories hide persistence technology  
* Repositories contain no business logic  
* Use Cases access persistence only through Repositories

---

# **14.3 Repository Architecture**

               Application  
                     │  
                     ▼  
          Repository Interface  
             (Domain Layer)  
                     ▲  
                     │  
     Repository Implementation  
      (Infrastructure Layer)  
                     │  
                     ▼  
               MongoDB/Mongoose

The Domain owns the contract.

Infrastructure fulfills the contract.

---

# **14.4 Repository Responsibilities**

Repositories are responsible for:

* Loading Aggregate Roots  
* Persisting Aggregate Roots  
* Removing Aggregate Roots  
* Querying business aggregates  
* Managing persistence mapping

Repositories are **not** responsible for:

* Business validation  
* Business calculations  
* Authorization  
* Transactions  
* Logging  
* Notifications

---

# **14.5 Repository Scope**

Each Aggregate Root has exactly one Repository.

Examples:

UserAggregate  
        │  
        ▼  
UserRepository

ConsultationAggregate  
        │  
        ▼  
ConsultationRepository

WorkoutProgramAggregate  
        │  
        ▼  
WorkoutProgramRepository

Child Entities never have independent repositories.

---

# **14.6 Repository Interfaces**

Repository Interfaces belong to the Domain Layer.

Example responsibilities:

UserRepository

findById()

findByEmail()

save()

delete()

The interface expresses business intent.

It must never expose MongoDB concepts.

---

# **14.7 Repository Implementations**

Repository Implementations belong to the Infrastructure Layer.

Example:

Domain

UserRepository

↓

Infrastructure

MongoUserRepository

Implementation details remain hidden.

---

# **14.8 Aggregate Persistence**

Repositories persist entire Aggregate Roots.

Example:

CoachingRelationship

├── Sessions  
├── WorkoutAssignments  
└── NutritionAssignments

The Aggregate is persisted as one consistency boundary.

Child entities are never saved independently.

---

# **14.9 Query Responsibility**

Repositories expose business-oriented queries.

Correct:

findActiveTrainerById()

findAvailableConsultation()

findPendingOffer()

Incorrect:

findByStatusAndCreatedAtBetween()

Repository methods should express business language, not database filters.

Complex reporting belongs elsewhere.

---

# **14.10 Read Models**

Queries intended for dashboards, analytics, or reporting may use dedicated Read Models.

Examples:

* Trainer Marketplace Listing  
* Admin Dashboard  
* Revenue Report  
* Platform Analytics

Read Models are optimized for retrieval.

They do not modify business state.

---

# **14.11 Transactions**

Repositories participate in transactions coordinated by the Application Layer.

Repositories do not begin or commit transactions.

Example:

Use Case  
        │  
        ▼  
UnitOfWork  
        │  
        ├── UserRepository  
        ├── PaymentRepository  
        └── CoachingRepository

Transaction boundaries belong to the Application Layer.

---

# **14.12 Mapping**

Repositories are responsible for mapping between:

Persistence Model  
        │  
        ▼  
Domain Aggregate

and

Domain Aggregate  
        │  
        ▼  
Persistence Model

The Application Layer never interacts with Mongoose documents.

---

# **14.13 Repository Independence**

Repositories hide persistence completely.

The Application Layer must not know:

* MongoDB Collections  
* ObjectIds  
* Mongoose Documents  
* Aggregation Pipelines  
* Database Transactions

Repositories expose only business abstractions.

---

# **14.14 Repository Lifetime**

Repositories are stateless.

Each request receives a repository instance through Dependency Injection.

Repositories maintain no application state.

---

# **14.15 Performance**

Repositories may optimize persistence through:

* Database indexes  
* Aggregation pipelines  
* Projections  
* Pagination  
* Bulk operations

Performance optimizations must remain invisible to the Domain.

---

# **14.16 Repository Testing**

Repository Implementations are tested independently.

Tests verify:

* Persistence mapping  
* CRUD operations  
* Transaction participation  
* Query correctness  
* Error handling

Use Cases should use mock or in-memory implementations.

---

# **14.17 Repository Rules**

The following rules are mandatory:

* One Repository per Aggregate Root  
* No business logic  
* No controller access  
* No HTTP objects  
* No DTOs  
* No authorization logic  
* No validation beyond persistence integrity

Repositories exist solely to bridge the Domain and persistence.

---

# **14.18 Repository Replacement**

Persistence technologies must be replaceable.

Example:

MongoUserRepository

↓

PostgresUserRepository

↓

FutureUserRepository

The Application and Domain remain unchanged.

---

# **14.19 Architectural Compliance**

A Repository violates the architecture if it:

* Executes business rules  
* Calls another Use Case  
* Sends emails  
* Generates JWTs  
* Calls external APIs  
* Contains authorization logic

Such behavior belongs to other architectural layers.

---

# **14.20 Summary**

The Repository Architecture provides a clean abstraction over persistence while preserving the independence of the Domain and Application layers.

Repositories operate on Aggregate Roots, encapsulate persistence details, and ensure that business logic remains isolated from database technologies.

---

# **15\. APPLICATION CONTRACTS ARCHITECTURE**

The Application Contracts Architecture defines the data exchanged between the Interface Adapters layer and the Application Layer.

Application Contracts establish a stable, technology-independent boundary that prevents transport protocols, persistence models, and framework-specific objects from leaking into business workflows.

Application Contracts are immutable data structures that represent application intent rather than transport or persistence details.

---

# **15.1 Purpose**

The purpose of Application Contracts is to:

* Define application boundaries  
* Isolate the Application Layer  
* Decouple transport protocols  
* Prevent infrastructure leakage  
* Improve versioning  
* Improve testability  
* Standardize communication

Application Contracts describe business operations.

They do not describe HTTP or database structures.

---

# **15.2 Principles**

Application Contracts follow these principles:

* Immutable  
* Framework-independent  
* Transport-independent  
* Persistence-independent  
* Self-contained  
* Serializable  
* Explicit

Contracts never contain business behavior.

---

# **15.3 Package Structure**

application  
│  
└── contracts/  
    │  
    ├── requests/  
    ├── responses/  
    ├── commands/  
    ├── queries/  
    └── index.ts

Every contract belongs to exactly one business operation.

---

# **15.4 Request Contracts**

Request Contracts represent data required to execute a Use Case.

Examples:

RegisterUserRequest

LoginRequest

CreateConsultationRequest

AcceptOfferRequest

AssignWorkoutRequest

A Request Contract expresses **what the Application needs**, not what HTTP sends.

---

# **15.5 Response Contracts**

Response Contracts represent the outcome of a completed Use Case.

Examples:

UserResponse

ConsultationResponse

WorkoutProgramResponse

NutritionPlanResponse

PaymentResponse

Responses contain only business data.

They never include transport-specific information.

---

# **15.6 Command Contracts**

Commands represent operations that modify business state.

Examples:

RegisterUserCommand

AcceptOfferCommand

CompleteConsultationCommand

PublishWorkoutCommand

Characteristics:

* Intent to change state  
* Immutable  
* Executed by one Use Case  
* Produces side effects

---

# **15.7 Query Contracts**

Queries represent read-only business requests.

Examples:

GetTrainerProfileQuery

SearchMarketplaceQuery

GetWorkoutProgramQuery

GetConversationQuery

Queries never modify business state.

---

# **15.8 Contract Ownership**

Each Use Case owns its own contracts.

Example:

RegisterUser

├── RegisterUserRequest  
├── RegisterUserResponse  
└── RegisterUserUseCase

Contracts should not be shared across unrelated Use Cases.

---

# **15.9 Immutability**

Application Contracts are immutable.

Once created:

* No fields are modified  
* No setters exist  
* No business behavior is added

A contract represents a single application interaction.

---

# **15.10 Layer Boundaries**

Contracts separate architectural layers.

Flow:

HTTP Request  
        │  
        ▼  
Controller  
        │  
        ▼  
Request Contract  
        │  
        ▼  
Use Case  
        │  
        ▼  
Response Contract  
        │  
        ▼  
Presenter  
        │  
        ▼  
HTTP Response

The Application Layer never receives HTTP Request or Response objects.

---

# **15.11 Transport Independence**

Application Contracts must not contain:

* Express Request  
* Express Response  
* Socket.IO Socket  
* HTTP Headers  
* Cookies  
* Query Parameters  
* Route Parameters

Transport-specific concerns are handled by Interface Adapters.

---

# **15.12 Persistence Independence**

Application Contracts must never expose:

* Mongoose Documents  
* MongoDB ObjectIds  
* Collection Names  
* Database Models  
* Persistence Metadata

Persistence models remain inside the Infrastructure Layer.

---

# **15.13 Validation Responsibility**

Application Contracts assume that structural validation has already been completed.

Example:

HTTP Request  
        │  
        ▼  
Validator  
        │  
        ▼  
Validated Contract  
        │  
        ▼  
Use Case

Business validation occurs later inside the Domain.

---

# **15.14 Mapping**

Contracts are created by Interface Adapters.

Flow:

HTTP Request  
        │  
        ▼  
Controller  
        │  
        ▼  
Mapper  
        │  
        ▼  
Request Contract

Response mapping follows the reverse flow.

The Application Layer never performs transport mapping.

---

# **15.15 Versioning**

Contracts evolve independently of transport protocols.

Changes should preserve backward compatibility whenever possible.

Breaking changes require explicit versioning.

---

# **15.16 Error Contracts**

Application failures are represented using standardized error contracts.

Example:

ErrorResponse

├── code  
├── message  
├── details  
└── timestamp

Error Contracts standardize communication across all adapters.

---

# **15.17 Testing**

Application Contracts are tested for:

* Correct mapping  
* Serialization  
* Immutability  
* Version compatibility

Business logic is not tested within contracts.

---

# **15.18 Architectural Rules**

The following rules are mandatory:

* One Request Contract per Use Case  
* One Response Contract per Use Case  
* Immutable Contracts  
* No business logic  
* No framework dependencies  
* No persistence dependencies  
* No transport dependencies

Contracts exist solely to define communication boundaries.

---

# **15.19 Naming Standards**

Contracts should be named using the associated business operation.

Examples:

RegisterUserRequest  
RegisterUserResponse

LoginRequest  
LoginResponse

AssignWorkoutRequest  
AssignWorkoutResponse

Avoid generic names such as:

RequestDto  
ResponseDto  
UserDto  
CommonDto

Names should communicate business intent.

---

# **15.20 Summary**

Application Contracts define the communication boundary between the Interface Adapters and the Application Layer.

They isolate business workflows from transport protocols and persistence technologies while providing immutable, explicit, and technology-independent representations of application interactions.

---

# **16\. VALIDATION ARCHITECTURE**

The Validation Architecture defines how data integrity is enforced throughout the KIZUNAFIT backend.

Validation is performed at multiple architectural layers, with each layer responsible for validating only the concerns that belong to it.

Validation is not a single step in the request lifecycle. Instead, it is a layered responsibility that preserves Clean Architecture boundaries and protects business integrity.

---

# **16.1 Purpose**

The Validation Architecture exists to:

* Ensure data integrity  
* Prevent invalid application input  
* Protect business rules  
* Enforce domain invariants  
* Standardize validation behavior  
* Separate structural validation from business validation  
* Improve error reporting

Validation is performed as close as possible to the layer responsible for the rule.

---

# **16.2 Validation Principles**

Validation follows these principles:

* Validate early  
* Validate at the correct layer  
* Never duplicate business rules  
* Fail fast  
* Return meaningful errors  
* Keep validation deterministic  
* Preserve Domain purity

Every validation rule has exactly one owner.

---

# **16.3 Validation Layers**

Validation is performed across multiple layers.

Client  
    │  
    ▼  
Presentation Validation  
    │  
    ▼  
Application Validation  
    │  
    ▼  
Domain Validation  
    │  
    ▼  
Persistence Validation

Each layer validates different concerns.

---

# **16.4 Presentation Validation**

Presentation Validation verifies request structure.

Responsibilities include:

* Required fields  
* Data types  
* Email format  
* String length  
* Enum values  
* Numeric ranges  
* JSON structure

Examples:

Email format

Password minimum length

Required fields

UUID format

Presentation Validation is implemented using Zod.

Business rules are prohibited.

---

# **16.5 Application Validation**

The Application Layer validates application-level concerns.

Examples:

* Required command fields  
* Missing identifiers  
* Unsupported operations  
* Invalid workflow requests

Application Validation prepares requests for business execution.

It does not evaluate business policies.

---

# **16.6 Domain Validation**

The Domain Layer validates business rules.

Examples:

Offer already accepted

Consultation already completed

Workout already published

Inactive trainer

Expired subscription

These validations belong exclusively to the Domain.

---

# **16.7 Aggregate Validation**

Aggregate Roots protect their own invariants.

Example:

Offer.accept()

The Aggregate validates:

* Current state  
* Allowed transition  
* Business constraints

State changes occur only if validation succeeds.

---

# **16.8 Value Object Validation**

Value Objects validate themselves during construction.

Examples:

Email

PhoneNumber

Money

Duration

DateRange

Invalid Value Objects cannot exist.

Example:

Email("invalid-email")

Construction fails immediately.

---

# **16.9 Repository Validation**

Repositories perform persistence integrity validation only.

Examples:

* Optimistic locking  
* Duplicate key conflicts  
* Database constraints

Repositories never perform business validation.

---

# **16.10 Infrastructure Validation**

Infrastructure validates technical concerns.

Examples:

* JWT signature  
* Cloudinary upload result  
* Redis connection  
* SMTP response  
* File checksum

Infrastructure validation protects technical integrations.

---

# **16.11 Validation Flow**

HTTP Request  
        │  
        ▼  
Zod Validation  
        │  
        ▼  
Application Contract  
        │  
        ▼  
Use Case  
        │  
        ▼  
Domain Validation  
        │  
        ▼  
Repository  
        │  
        ▼  
Database Constraints

Each layer validates only its own responsibility.

---

# **16.12 Validation Errors**

Validation failures are categorized.

Examples:

### **Structural Validation**

Missing required field

Invalid email format

Invalid enum value

---

### **Business Validation**

Trainer unavailable

Offer expired

Consultation cancelled

Payment already refunded

---

### **Infrastructure Validation**

JWT invalid

Storage unavailable

Database timeout

Each category maps to standardized error responses.

---

# **16.13 Validation Ownership**

Validation ownership is explicit.

| Validation | Owner |
| ----- | ----- |
| Email format | Presentation |
| Required fields | Presentation |
| Password length | Presentation |
| User already exists | Domain |
| Offer accepted | Domain |
| Consultation completed | Domain |
| JWT signature | Infrastructure |
| Database constraint | Infrastructure |

Every rule has one owner.

---

# **16.14 Fail Fast**

Validation should fail as early as possible.

Flow:

Invalid Request  
        │  
        ▼  
Reject Immediately

The Application Layer should never execute if structural validation fails.

---

# **16.15 Validation Reuse**

Reusable validation belongs in:

* Value Objects  
* Specifications  
* Domain Policies

Validation logic should not be duplicated across Use Cases.

---

# **16.16 Validation Libraries**

Validation libraries are implementation details.

Examples:

* Zod  
* class-validator  
* Joi

The Domain Layer must never depend on them.

Only the Presentation Layer may use framework-specific validation libraries.

---

# **16.17 Testing**

Validation should be tested independently.

Tests verify:

* Valid input  
* Invalid input  
* Boundary conditions  
* Business rule enforcement  
* Error messages

Domain validation tests must not require infrastructure.

---

# **16.18 Architectural Rules**

The following rules are mandatory:

* Structural validation belongs to Presentation.  
* Business validation belongs to Domain.  
* Persistence validation belongs to Infrastructure.  
* Validation libraries never enter the Domain Layer.  
* Business rules are never implemented in Zod schemas.  
* Controllers never duplicate validation logic.

---

# **16.19 Common Anti-Patterns**

The following practices are prohibited:

❌ Checking if an email already exists inside a Zod validator.

❌ Verifying subscription status inside a Controller.

❌ Performing business validation inside a Repository.

❌ Embedding business rules in middleware.

❌ Duplicating business rules across multiple Use Cases.

Each validation concern belongs to its designated layer.

---

# **16.20 Summary**

The Validation Architecture ensures that every rule is enforced at the appropriate architectural boundary.

Structural validation protects the application from malformed input, business validation protects the integrity of the domain model, and infrastructure validation safeguards technical integrations.

This layered approach preserves Clean Architecture principles while providing a consistent and maintainable validation strategy throughout the KIZUNAFIT backend.

---

# **17\. MAPPER ARCHITECTURE**

The Mapper Architecture defines how objects are transformed between architectural layers while preserving the isolation of the Domain, Application, Interface Adapters, and Infrastructure layers.

Each layer owns its own data representation.

Mappers are the only approved mechanism for translating data between different representations.

---

# **17.1 Purpose**

The Mapper Architecture exists to:

* Preserve layer isolation  
* Prevent representation leakage  
* Simplify object transformation  
* Improve maintainability  
* Centralize mapping logic  
* Support independent evolution of layers  
* Enforce Clean Architecture boundaries

Every transformation between layers must occur through a Mapper.

---

# **17.2 Mapping Principles**

The Mapper Architecture follows these principles:

* One responsibility  
* Stateless  
* Deterministic  
* Reusable  
* Layer-specific  
* Framework-independent where possible  
* No business logic

Mappers transform data.

They never execute business behavior.

---

# **17.3 Mapping Boundaries**

Mappings occur only across architectural boundaries.

HTTP Request  
        │  
        ▼  
Application Contract  
        │  
        ▼  
Domain Objects  
        │  
        ▼  
Persistence Model

Every boundary has its own Mapper.

---

# **17.4 Mapping Responsibilities**

Mappers are responsible for:

* Object transformation  
* Property mapping  
* Type conversion  
* Value Object creation  
* Enum translation  
* Response transformation

Mappers are not responsible for:

* Validation  
* Authorization  
* Business calculations  
* Persistence  
* Logging

---

# **17.5 Mapper Types**

The backend defines several mapper categories.

### **Request Mapper**

Converts external requests into Application Contracts.

HTTP Request

↓

RegisterUserRequest

---

### **Domain Mapper**

Converts Application Contracts into Domain objects.

RegisterUserRequest

↓

User Aggregate

↓

Email Value Object

↓

Password Value Object

---

### **Persistence Mapper**

Converts Domain Aggregates into Persistence Models.

User Aggregate

↓

User Document

Reverse mapping:

User Document

↓

User Aggregate

---

### **Response Mapper**

Converts Domain or Application objects into Response Contracts.

User Aggregate

↓

UserResponse

---

### **Presenter Mapper**

Converts Response Contracts into transport responses.

UserResponse

↓

HTTP JSON Response

---

# **17.6 Mapping Flow**

The standard mapping flow is:

HTTP Request  
        │  
        ▼  
Request Mapper  
        │  
        ▼  
Request Contract  
        │  
        ▼  
Use Case  
        │  
        ▼  
Domain Aggregate  
        │  
        ▼  
Persistence Mapper  
        │  
        ▼  
Database

Reverse flow:

Database  
        │  
        ▼  
Persistence Mapper  
        │  
        ▼  
Domain Aggregate  
        │  
        ▼  
Response Mapper  
        │  
        ▼  
Response Contract  
        │  
        ▼  
Presenter  
        │  
        ▼  
HTTP Response

---

# **17.7 Value Object Mapping**

Primitive values should be converted into Value Objects before entering the Domain.

Example:

"john@example.com"

↓

Email Value Object

Not:

String

↓

Entity

The Domain should operate on business concepts, not primitives.

---

# **17.8 Aggregate Mapping**

Persistence Models are converted into Aggregate Roots.

Example:

Mongo Document

↓

TrainerProfile Aggregate

The Domain never works directly with database documents.

---

# **17.9 Collection Mapping**

Collections should be mapped using dedicated collection mappers.

Example:

Workout Documents

↓

Workout Aggregates

↓

Workout Responses

Mapping logic should not be duplicated inside loops.

---

# **17.10 Bidirectional Mapping**

Persistence Mappers support two directions.

Persistence

↓

Domain

and

Domain

↓

Persistence

Request and Response Mappers remain unidirectional.

---

# **17.11 Nested Mapping**

Complex objects may require nested mappers.

Example:

Consultation Aggregate

↓

Trainer Mapper

↓

Client Mapper

↓

Schedule Mapper

↓

Consultation Response

Each mapper remains responsible only for its own object.

---

# **17.12 Mapper Composition**

Complex mappings may compose smaller mappers.

Example:

WorkoutProgramMapper

├── ExerciseMapper  
├── ScheduleMapper  
└── TrainerMapper

Composition improves maintainability and reuse.

---

# **17.13 Mapper Independence**

Mappers must not depend on:

* Controllers  
* Repositories  
* Use Cases  
* Database Connections  
* HTTP Objects

They depend only on the source and target models.

---

# **17.14 Performance**

Mappers should:

* Avoid unnecessary allocations  
* Avoid repeated conversions  
* Map only required fields  
* Support projection-based mapping where appropriate

Performance optimizations must not compromise clarity.

---

# **17.15 Error Handling**

Mapping failures should produce meaningful exceptions.

Examples:

* Missing required field  
* Invalid enum conversion  
* Unsupported mapping  
* Invalid persistence model

Mapping errors are technical failures.

They are not business rule violations.

---

# **17.16 Testing**

Mappers are tested independently.

Tests verify:

* Correct field mapping  
* Value Object creation  
* Enum conversion  
* Nested mapping  
* Collection mapping

Business behavior is tested separately.

---

# **17.17 Architectural Rules**

The following rules are mandatory:

* Only mappers translate between layers.  
* Controllers never manually map objects.  
* Use Cases never manually build HTTP responses.  
* Repositories never expose persistence models.  
* Persistence models never enter the Domain Layer.  
* HTTP requests never enter the Application Layer.

---

# **17.18 Naming Standards**

Mapper names should clearly express the transformation.

Examples:

RegisterUserRequestMapper

UserPersistenceMapper

WorkoutProgramResponseMapper

ConsultationPresenterMapper

Avoid generic names:

Mapper

CommonMapper

UtilsMapper

DataMapper

Names should communicate both the source and target responsibility.

---

# **17.19 Common Anti-Patterns**

The following practices are prohibited:

❌ Mapping inside Controllers.

❌ Mapping inside Use Cases.

❌ Returning Mongoose Documents from Repositories.

❌ Building JSON responses inside Use Cases.

❌ Creating Value Objects directly inside Controllers.

Mapping belongs exclusively to dedicated Mapper components.

---

# **17.20 Summary**

The Mapper Architecture establishes a clear and consistent strategy for translating data across architectural boundaries.

By centralizing transformations within dedicated Mapper components, the KIZUNAFIT backend preserves layer isolation, prevents representation leakage, and enables each architectural layer to evolve independently while maintaining strict compliance with Clean Architecture.

---

# **18\. MIDDLEWARE ARCHITECTURE**

The Middleware Architecture defines the request processing pipeline for the KIZUNAFIT backend.

Middleware components execute before requests reach the Interface Adapters and are responsible for handling cross-cutting concerns that apply consistently across multiple endpoints.

Middleware never contains business logic.

Its responsibility is to prepare, protect, and enrich requests before they enter the Application Layer.

---

# **18.1 Purpose**

The Middleware Architecture exists to:

* Build a standardized request pipeline  
* Enforce security  
* Authenticate requests  
* Authorize access  
* Protect against abuse  
* Improve observability  
* Establish request context

Middleware operates at the transport level.

It never executes business operations.

---

# **18.2 Middleware Principles**

Middleware follows these principles:

* Single Responsibility  
* Stateless  
* Reusable  
* Ordered execution  
* Framework-specific implementation  
* Business-independent  
* Fail Fast

Each middleware performs exactly one concern.

---

# **18.3 Middleware Pipeline**

Every HTTP request follows the same pipeline.

Incoming Request  
        │  
        ▼  
Request ID  
        │  
        ▼  
Request Logger  
        │  
        ▼  
CORS  
        │  
        ▼  
Security Headers  
        │  
        ▼  
Compression  
        │  
        ▼  
Rate Limiter  
        │  
        ▼  
Authentication  
        │  
        ▼  
Authorization  
        │  
        ▼  
Request Validation  
        │  
        ▼  
Controller

Each middleware either forwards the request or terminates the pipeline.

---

# **18.4 Middleware Categories**

The backend defines the following middleware categories:

### **Infrastructure Middleware**

Responsible for transport-level concerns.

Examples:

* CORS  
* Compression  
* Security Headers  
* Body Parser

---

### **Observability Middleware**

Responsible for monitoring requests.

Examples:

* Request Logging  
* Correlation ID  
* Response Time  
* Metrics Collection

---

### **Security Middleware**

Responsible for securing incoming requests.

Examples:

* Authentication  
* Authorization  
* Rate Limiting  
* IP Filtering

---

### **Validation Middleware**

Responsible for validating request structure.

Examples:

* Zod Validation  
* Request Parsing  
* File Validation

---

### **Error Middleware**

Responsible for handling unhandled exceptions.

Examples:

* Global Exception Handler  
* Error Formatter  
* Stack Trace Logging

---

# **18.5 Request Context**

Middleware creates a Request Context that is available throughout request processing.

Typical contents include:

* Correlation ID  
* User ID  
* User Role  
* Session ID  
* Request Timestamp  
* Client IP  
* User Agent

The Request Context provides operational information.

It is not a business object.

---

# **18.6 Authentication Middleware**

Authentication Middleware verifies the identity of the requester.

Responsibilities:

* Extract Access Token  
* Verify JWT Signature  
* Validate Expiration  
* Load Authentication Context  
* Attach Identity to Request

It does not evaluate permissions.

---

# **18.7 Authorization Middleware**

Authorization Middleware performs transport-level permission checks.

Responsibilities:

* Verify authentication exists  
* Verify required roles  
* Forward Authorization Context

Complex business authorization remains inside Application Policies.

---

# **18.8 Rate Limiting Middleware**

Rate Limiting protects the platform from abuse.

Examples:

* Login attempts  
* OTP requests  
* Password reset requests  
* Public API endpoints

Rate limiting is implemented using Redis.

Business logic remains unaffected.

---

# **18.9 Validation Middleware**

Validation Middleware performs structural validation.

Responsibilities:

* Validate request body  
* Validate route parameters  
* Validate query parameters  
* Validate uploaded files

Business validation is performed later inside the Domain Layer.

---

# **18.10 File Upload Middleware**

File Upload Middleware processes incoming files.

Responsibilities:

* Parse multipart requests  
* Validate file type  
* Validate file size  
* Store temporary files

Permanent storage is handled by the Storage Gateway in the Infrastructure Layer.

---

# **18.11 Logging Middleware**

Logging Middleware records request information.

Examples:

* HTTP Method  
* URL  
* Response Status  
* Response Time  
* User Identifier  
* Correlation ID

Logging must never modify application behavior.

---

# **18.12 Error Handling Middleware**

The final middleware in the pipeline is the Global Exception Handler.

Responsibilities:

* Catch unhandled exceptions  
* Convert exceptions into standardized responses  
* Log unexpected failures  
* Prevent framework-specific error leakage

Every exception exits the system through this middleware.

---

# **18.13 Middleware Ordering**

Middleware execution order is fixed.

Request ID  
        ↓  
Logging  
        ↓  
Security Headers  
        ↓  
CORS  
        ↓  
Compression  
        ↓  
Rate Limiting  
        ↓  
Authentication  
        ↓  
Authorization  
        ↓  
Validation  
        ↓  
Controller

Changing the order requires architectural approval.

---

# **18.14 Dependency Rules**

Middleware may depend on:

* Configuration  
* Shared Kernel  
* Infrastructure Services  
* Authentication Providers

Middleware must never depend on:

* Repository Implementations  
* Domain Entities  
* Aggregate Roots  
* Business Policies

Business operations begin only after the Controller invokes a Use Case.

---

# **18.15 Exception Flow**

When an exception occurs:

Middleware  
        │  
        ▼  
Global Exception Handler  
        │  
        ▼  
Error Mapper  
        │  
        ▼  
Standard Error Response

All clients receive consistent error responses.

---

# **18.16 Middleware Registration**

Middleware registration occurs during application bootstrap.

Example location:

bootstrap/  
└── middleware/

Business modules do not register global middleware.

The Composition Root manages the request pipeline.

---

# **18.17 Testing**

Middleware is tested independently.

Tests verify:

* Request forwarding  
* Authentication  
* Authorization  
* Validation  
* Error propagation  
* Pipeline ordering

Business behavior is tested separately.

---

# **18.18 Architectural Rules**

The following rules are mandatory:

* Middleware performs one responsibility.  
* Middleware contains no business logic.  
* Middleware never accesses repositories directly.  
* Middleware never modifies Domain objects.  
* Middleware never executes Use Cases.  
* Middleware remains stateless.

Middleware prepares requests.

Business execution begins in the Controller.

---

# **18.19 Common Anti-Patterns**

The following practices are prohibited:

❌ Loading Aggregates inside Middleware.

❌ Performing business validation inside Middleware.

❌ Sending emails from Middleware.

❌ Calling Repository Implementations directly.

❌ Executing Use Cases from Middleware.

❌ Returning transport-specific objects to the Application Layer.

Middleware exists only to support request processing.

---

# **18.20 Summary**

The Middleware Architecture establishes a standardized request processing pipeline for the KIZUNAFIT backend.

It handles cross-cutting concerns such as authentication, authorization, validation, logging, security, and error handling while remaining completely independent of business logic.

By keeping middleware focused on transport-level responsibilities, the backend preserves Clean Architecture boundaries and ensures that every business operation begins only after a request has been securely prepared and validated.

---

# **19\. ERROR HANDLING ARCHITECTURE**

The Error Handling Architecture defines how exceptions are created, propagated, translated, and presented throughout the KIZUNAFIT backend.

The architecture ensures that business failures, application failures, infrastructure failures, and presentation failures are handled consistently while preserving architectural boundaries and preventing implementation details from leaking across layers.

Every exception has a clearly defined owner and responsibility.

---

# **19.1 Purpose**

The Error Handling Architecture exists to:

* Standardize exception handling  
* Protect architectural boundaries  
* Preserve business integrity  
* Hide implementation details  
* Improve debugging  
* Improve observability  
* Provide consistent client responses

Errors are first-class architectural components.

---

# **19.2 Exception Principles**

The exception system follows these principles:

* Fail Fast  
* Fail Explicitly  
* Layer Ownership  
* No Silent Failures  
* Standardized Responses  
* Technology Independence  
* Immutable Exceptions

Exceptions represent failures.

They never represent successful business outcomes.

---

# **19.3 Exception Hierarchy**

Every exception belongs to exactly one architectural layer.

ApplicationException  
│  
├── DomainException  
│   ├── BusinessRuleViolationException  
│   ├── InvalidStateTransitionException  
│   ├── EntityNotFoundException  
│   └── DomainValidationException  
│  
├── UseCaseException  
│   ├── ResourceConflictException  
│   ├── AuthorizationException  
│   ├── AuthenticationException  
│   └── ApplicationValidationException  
│  
├── InfrastructureException  
│   ├── DatabaseException  
│   ├── CacheException  
│   ├── StorageException  
│   ├── MessagingException  
│   └── ExternalServiceException  
│  
└── PresentationException  
    ├── BadRequestException  
    ├── UnsupportedMediaTypeException  
    └── RouteNotFoundException

Each exception communicates where the failure originated.

---

# **19.4 Domain Exceptions**

Domain Exceptions represent violations of business rules.

Examples:

OfferAlreadyAcceptedException

ConsultationAlreadyCompletedException

InactiveTrainerException

WorkoutAlreadyPublishedException

RefundNotAllowedException

Characteristics:

* Business failure  
* Framework independent  
* Persistence independent  
* Transport independent

Domain Exceptions belong exclusively to the Domain Layer.

---

# **19.5 Application Exceptions**

Application Exceptions represent failures while executing Use Cases.

Examples:

UnauthorizedOperationException

DuplicateRequestException

InvalidWorkflowException

ResourceConflictException

These exceptions coordinate application behavior.

They never replace Domain Exceptions.

---

# **19.6 Infrastructure Exceptions**

Infrastructure Exceptions represent failures in technical components.

Examples:

DatabaseUnavailableException

RedisConnectionException

CloudinaryUploadException

EmailDeliveryException

PaymentGatewayTimeoutException

Infrastructure Exceptions must never propagate directly to clients.

---

# **19.7 Presentation Exceptions**

Presentation Exceptions represent transport-level failures.

Examples:

InvalidRequestException

RouteNotFoundException

UnsupportedContentTypeException

These exceptions are adapter-specific.

They never enter the Domain Layer.

---

# **19.8 Exception Propagation**

Exceptions propagate upward through architectural layers.

Domain

↓

Application

↓

Presentation

↓

Global Exception Handler

↓

Client

Propagation is unidirectional.

Exceptions are never swallowed.

---

# **19.9 Exception Translation**

Each layer may translate exceptions into higher-level exceptions.

Example:

MongoError

↓

DatabaseException

↓

ApplicationException

↓

HTTP 500 Response

Business exceptions should never be translated into technical exceptions.

---

# **19.10 Global Exception Handler**

The Global Exception Handler is the single exit point for all unhandled exceptions.

Responsibilities:

* Catch exceptions  
* Map exception types  
* Log failures  
* Build standardized responses  
* Hide implementation details

The Global Exception Handler belongs to the Presentation Layer.

---

# **19.11 Standard Error Response**

Every transport returns a consistent error format.

Example structure:

{  
    success: false,

    error: {

        code,

        message,

        details,

        correlationId,

        timestamp

    }  
}

The response format remains consistent across all APIs.

---

# **19.12 Business Error Responses**

Business failures should return meaningful messages.

Example:

Offer has already been accepted.

Not:

Cannot execute line 72\.

Internal implementation details remain hidden.

---

# **19.13 Infrastructure Failures**

Infrastructure failures should be logged with complete technical details.

Clients receive generic messages.

Example:

Client:

Unable to process your request.

Logs:

MongoNetworkTimeout  
Collection: users  
Duration: 18s  
Node: db-01

Sensitive information never reaches clients.

---

# **19.14 Logging**

Every unhandled exception should produce:

* Exception Type  
* Layer  
* Request ID  
* Correlation ID  
* User ID (if available)  
* Stack Trace  
* Timestamp

Logs support debugging and auditing.

---

# **19.15 Retry Strategy**

Retry behavior applies only to transient infrastructure failures.

Examples:

* Database timeout  
* Redis timeout  
* External API timeout  
* Email delivery retry

Business exceptions are never retried.

---

# **19.16 Exception Ownership**

Each layer owns its exceptions.

| Layer | Exception Type |
| ----- | ----- |
| Domain | Business failures |
| Application | Workflow failures |
| Infrastructure | Technical failures |
| Presentation | Transport failures |

Exception ownership must remain clear.

---

# **19.17 Testing**

Exception handling must be tested independently.

Tests verify:

* Exception propagation  
* Exception translation  
* Response mapping  
* Logging  
* Retry behavior

Business rule failures should be tested at the Domain level.

---

# **19.18 Architectural Rules**

The following rules are mandatory:

* Every exception belongs to one layer.  
* Business exceptions remain framework-independent.  
* Infrastructure exceptions never leak.  
* Controllers never catch business exceptions unnecessarily.  
* Global Exception Handler is the single response formatter.  
* Exceptions are immutable.

---

# **19.19 Common Anti-Patterns**

The following practices are prohibited:

❌ Returning database error messages directly to clients.

❌ Throwing generic `Error`.

❌ Catching exceptions and ignoring them.

❌ Using HTTP status codes inside Domain Exceptions.

❌ Logging sensitive information such as passwords or JWTs.

❌ Embedding business rules inside exception handlers.

Exceptions should communicate failures, not implement business behavior.

---

# **19.20 Summary**

The Error Handling Architecture provides a consistent and layered strategy for managing failures across the KIZUNAFIT backend.

By separating business exceptions from application, infrastructure, and presentation exceptions, the architecture preserves Clean Architecture boundaries, protects implementation details, and delivers predictable error responses regardless of the transport mechanism.

---

# **20\. DOMAIN EVENTS**

The Domain Events Architecture defines how significant business occurrences are represented and propagated throughout the KIZUNAFIT platform.

A Domain Event represents a fact that has already occurred within the business domain.

It enables independent components of the system to react to completed business operations while preserving loose coupling between business domains.

Domain Events describe **what happened**, never **what should happen**.

---

# **20.1 Purpose**

The Domain Events Architecture exists to:

* Represent completed business facts  
* Decouple business workflows  
* Improve modularity  
* Support extensibility  
* Preserve Aggregate independence  
* Enable event-driven business behavior  
* Prepare for future scalability

Domain Events communicate completed business outcomes.

---

# **20.2 Domain Event Principles**

Domain Events follow these principles:

* Immutable  
* Business-oriented  
* Past tense naming  
* Framework independent  
* Technology independent  
* Side-effect free  
* Publish after successful business execution

Events describe facts.

They never contain business logic.

---

# **20.3 Event Lifecycle**

The lifecycle of a Domain Event is:

Business Operation  
        │  
        ▼  
Aggregate State Change  
        │  
        ▼  
Domain Event Created  
        │  
        ▼  
Aggregate Persisted  
        │  
        ▼  
Transaction Committed  
        │  
        ▼  
Event Published  
        │  
        ▼  
Event Handlers Execute

Events are published only after successful persistence.

---

# **20.4 Event Ownership**

Every Domain Event belongs to one Aggregate Root.

Examples:

| Aggregate | Domain Event |
| ----- | ----- |
| User | UserRegistered |
| User | EmailVerified |
| CoachingOffer | OfferAccepted |
| Consultation | ConsultationCompleted |
| WorkoutProgram | WorkoutProgramPublished |
| NutritionPlan | NutritionPlanAssigned |
| Payment | PaymentVerified |

The Aggregate that creates the event owns it.

---

# **20.5 Event Structure**

Every Domain Event contains:

Event  
│  
├── Event ID  
├── Event Name  
├── Aggregate ID  
├── Occurred At  
├── Version  
└── Business Payload

Events should contain only information necessary for downstream processing.

---

# **20.6 Event Naming**

Domain Events use past-tense business names.

Examples:

UserRegistered

EmailVerified

OfferAccepted

ConsultationScheduled

ConsultationCompleted

WorkoutAssigned

NutritionPlanPublished

PaymentCompleted

ReviewSubmitted

Avoid imperative names such as:

RegisterUser

VerifyEmail

CreateWorkout

These represent commands, not events.

---

# **20.7 Event Creation**

Only Aggregate Roots create Domain Events.

Example:

Offer.accept()

↓

OfferAccepted

Not:

OfferController

↓

OfferAccepted

Business events originate inside the Domain.

---

# **20.8 Event Collection**

Aggregate Roots temporarily collect Domain Events during execution.

Example:

Offer Aggregate

↓

accept()

↓

events.add(OfferAccepted)

Events remain inside the Aggregate until persistence succeeds.

---

# **20.9 Event Publishing**

The Application Layer publishes collected events after the transaction commits.

Flow:

Use Case  
        │  
        ▼  
Aggregate.execute()  
        │  
        ▼  
Repository.save()  
        │  
        ▼  
Commit Transaction  
        │  
        ▼  
Publish Domain Events

Failed transactions must not publish events.

---

# **20.10 Event Handlers**

Event Handlers react to Domain Events.

Examples:

UserRegistered  
        │  
        ├── SendWelcomeEmailHandler  
        ├── CreateDefaultProfileHandler  
        └── AuditRegistrationHandler

Handlers execute independently.

They do not modify the originating Aggregate.

---

# **20.11 Event Handler Responsibilities**

Event Handlers may:

* Send notifications  
* Generate audit logs  
* Initialize related resources  
* Trigger background jobs  
* Update read models

Event Handlers must not:

* Re-execute the originating Use Case  
* Modify the originating Aggregate  
* Contain unrelated business logic

---

# **20.12 Event Ordering**

Within a single transaction:

Events are published in the order they occurred.

Across independent transactions:

Ordering is not guaranteed.

Business logic must not rely on global event ordering.

---

# **20.13 Event Delivery**

For Version 1 (Modular Monolith):

In-Process Event Bus

All Domain Events are delivered synchronously within the application process after successful transaction commit.

Future versions may replace the Event Bus with distributed messaging without affecting the Domain Layer.

---

# **20.14 Event Bus**

The Event Bus belongs to the Application Layer.

Responsibilities:

* Publish events  
* Register handlers  
* Dispatch events  
* Manage execution order

The Domain Layer never knows how events are delivered.

---

# **20.15 Event Idempotency**

Every Event Handler should be idempotent.

Repeated execution should not corrupt business state.

Examples:

* Sending welcome email  
* Creating audit record  
* Initializing preferences

Repeated handling should either:

* Produce the same result, or  
* Detect prior execution.

---

# **20.16 Event Versioning**

Domain Events should support versioning.

Example:

UserRegistered v1

↓

UserRegistered v2

Versioning preserves backward compatibility as the business evolves.

---

# **20.17 Event Failures**

Failure in one Event Handler must not corrupt the originating business transaction.

Policy:

* Business transaction commits first.  
* Event processing failures are logged.  
* Failed handlers may be retried if appropriate.

The business operation remains successful.

---

# **20.18 Testing**

Domain Events are tested independently.

Tests verify:

* Event creation  
* Event payload  
* Publication timing  
* Handler execution  
* Idempotency

Business rules remain tested at the Aggregate level.

---

# **20.19 Architectural Rules**

The following rules are mandatory:

* Only Aggregates create Domain Events.  
* Events represent completed business facts.  
* Events are immutable.  
* Events are published only after successful commit.  
* Event Handlers contain no Aggregate business logic.  
* Event publishing mechanism is hidden from the Domain.

---

# **20.20 Common Anti-Patterns**

The following practices are prohibited:

❌ Publishing events before persistence succeeds.

❌ Creating events inside Controllers.

❌ Using events as commands.

❌ Performing business validation inside Event Handlers.

❌ Depending on global event ordering.

❌ Exposing infrastructure details inside Domain Events.

---

# **20.21 Summary**

The Domain Events Architecture enables the KIZUNAFIT platform to react to completed business operations while preserving the independence of Aggregates and business modules.

By representing business facts as immutable events and publishing them only after successful transactions, the backend achieves loose coupling, improved extensibility, and readiness for future event-driven evolution without compromising Clean Architecture principles.

---

# **21\. SOCKET.IO ARCHITECTURE**

The Socket.IO Architecture defines how the KIZUNAFIT platform provides real-time, bidirectional communication while preserving the principles of Clean Architecture.

Socket.IO serves as an inbound and outbound transport mechanism.

It enables real-time communication without introducing business logic into the transport layer.

Business operations continue to be executed through Application Use Cases.

---

# **21.1 Purpose**

The Socket.IO Architecture exists to:

* Enable real-time communication  
* Synchronize client state  
* Deliver instant notifications  
* Support messaging  
* Support consultation sessions  
* Support WebRTC signaling  
* Support presence awareness

Socket.IO is a communication mechanism.

It is not a business layer.

---

# **21.2 Architectural Position**

Socket.IO belongs to the Infrastructure Layer.

It communicates with the Application Layer through Interface Adapters.

               Client  
                   │  
                   ▼  
             Socket.IO  
                   │  
                   ▼  
        Socket Event Handler  
                   │  
                   ▼  
              Application  
                   │  
                   ▼  
               Domain

The Domain Layer never knows Socket.IO exists.

---

# **21.3 Socket Components**

The Socket.IO subsystem consists of:

Infrastructure

├── Socket Server  
├── Connection Manager  
├── Room Manager  
├── Event Dispatcher  
├── Presence Manager  
├── Acknowledgement Manager

↓

Interface Adapters

├── Socket Event Handlers  
├── Request Mappers  
├── Response Mappers

↓

Application

├── Use Cases  
├── Event Bus

↓

Domain

Each component has a single responsibility.

---

# **21.4 Connection Lifecycle**

Every client connection follows the same lifecycle.

Client Connects  
        │  
        ▼  
Handshake  
        │  
        ▼  
Authentication  
        │  
        ▼  
Authorization  
        │  
        ▼  
Socket Context Created  
        │  
        ▼  
Event Registration  
        │  
        ▼  
Ready

Only authenticated users may establish protected Socket.IO sessions.

---

# **21.5 Authentication**

Socket.IO authentication uses the same identity system as REST.

Responsibilities:

* Validate Access Token  
* Identify User  
* Load Session  
* Build Socket Context

Authentication is performed during connection establishment.

---

# **21.6 Authorization**

Every incoming Socket.IO event is authorized independently.

Example:

Join Consultation

↓

Validate Coaching Relationship

↓

Validate Consultation

↓

Allow Join

Authorization rules are identical to REST.

---

# **21.7 Socket Context**

Each connected socket maintains a context.

Example contents:

* User ID  
* Role  
* Session ID  
* Connection ID  
* Connected At

Business data is never stored in the Socket Context.

---

# **21.8 Event Handling**

Incoming Socket.IO events are handled by dedicated Event Handlers.

Example:

chat:send-message

↓

SendMessageHandler

↓

SendMessageUseCase

Handlers never execute business logic directly.

---

# **21.9 Event Flow**

Every Socket.IO event follows the same lifecycle.

Socket Event  
        │  
        ▼  
Authentication  
        │  
        ▼  
Authorization  
        │  
        ▼  
Request Mapper  
        │  
        ▼  
Application Contract  
        │  
        ▼  
Use Case  
        │  
        ▼  
Response Contract  
        │  
        ▼  
Response Mapper  
        │  
        ▼  
Socket Response

The execution flow mirrors REST requests.

---

# **21.10 Room Management**

Rooms group related connections.

Examples:

Consultation Room

Conversation Room

Trainer Presence Room

Client Notifications

Admin Dashboard

Rooms organize communication.

They do not represent business entities.

---

# **21.11 Presence Management**

Presence indicates whether a user is currently connected.

Examples:

Online

Offline

Away (Future)

Busy (Future)

Presence information is technical state.

Business state remains in the Domain.

---

# **21.12 Broadcasting**

Broadcasting distributes events to multiple clients.

Examples:

* New chat message  
* Consultation started  
* Consultation ended  
* Trainer availability updated  
* Notification created

Broadcasts are triggered after successful business execution.

---

# **21.13 Acknowledgements**

Critical events require acknowledgements.

Examples:

Send Message

↓

Message Saved

↓

Ack Sent

Acknowledgements confirm successful processing.

---

# **21.14 Error Handling**

Socket.IO errors follow the same exception architecture as REST.

Flow:

Exception

↓

Exception Mapper

↓

Socket Error Response

Clients receive standardized error payloads.

---

# **21.15 Reconnection**

The architecture supports automatic reconnection.

Responsibilities:

* Restore authentication  
* Restore subscriptions  
* Restore rooms  
* Restore context

Business state is never reconstructed from the socket.

It is reloaded from the Application Layer.

---

# **21.16 Disconnect Handling**

On disconnect:

* Release socket resources  
* Leave rooms  
* Update presence  
* Clear connection context

Business state remains unchanged unless a Use Case explicitly modifies it.

---

# **21.17 Domain Events Integration**

Socket.IO broadcasts are triggered by Domain Events.

Example:

MessageSent

↓

Domain Event

↓

Broadcast Handler

↓

Socket.IO Broadcast

Aggregates never emit Socket.IO messages directly.

---

# **21.18 Testing**

Socket.IO components are tested independently.

Tests verify:

* Authentication  
* Authorization  
* Event routing  
* Room management  
* Broadcast delivery  
* Reconnection

Business rules remain tested through Use Cases.

---

# **21.19 Architectural Rules**

The following rules are mandatory:

* Socket.IO belongs to Infrastructure.  
* Socket Event Handlers belong to Interface Adapters.  
* Every event invokes a Use Case.  
* Socket Context contains no business state.  
* Domain Layer never imports Socket.IO.  
* Broadcasting occurs after successful business execution.

---

# **21.20 Common Anti-Patterns**

The following practices are prohibited:

❌ Executing business logic inside Socket.IO handlers.

❌ Accessing repositories directly from Socket.IO.

❌ Broadcasting before transaction commit.

❌ Storing business entities in socket memory.

❌ Using Socket.IO as the source of truth.

❌ Allowing unauthenticated room subscriptions.

---

# **21.21 Summary**

The Socket.IO Architecture enables real-time communication while preserving the architectural integrity of the KIZUNAFIT backend.

By treating Socket.IO as a transport adapter rather than a business layer, the system maintains consistent execution paths across REST and real-time communication, ensuring that every business operation flows through the same Application and Domain layers.

---

# **22\. WEBRTC SIGNALING ARCHITECTURE**

The WebRTC Signaling Architecture defines how the KIZUNAFIT platform establishes, coordinates, and terminates peer-to-peer video consultation sessions.

The backend participates only in signaling and session orchestration.

Audio and video streams are transmitted directly between participating peers using WebRTC.

The signaling subsystem remains independent of business logic and integrates with the Application Layer through well-defined Use Cases.

---

# **22.1 Purpose**

The WebRTC Signaling Architecture exists to:

* Establish peer connections  
* Coordinate signaling  
* Exchange SDP offers and answers  
* Exchange ICE candidates  
* Authenticate participants  
* Authorize consultation access  
* Track session lifecycle

The backend never transports media.

> [!NOTE]
> **Phase 4 Reconciliation (ADR-015):** The `Consultation` aggregate is the sole business owner for Phase 4 Marketplace Consultations. WebRTC signaling handlers interface directly with `IConsultationRepository` for socket authorization and room access control. Zero SDP or ICE candidate metadata is stored in MongoDB.

---

# **22.2 Architectural Position**

WebRTC signaling belongs to the Infrastructure Layer.

Client A  
      │  
      ▼  
Socket.IO Signaling  
      │  
      ▼  
Signaling Handler  
      │  
      ▼  
Application Use Cases  
      │  
      ▼  
Domain

Media communication occurs directly between clients.

---

# **22.3 Components**

The signaling subsystem consists of:

Infrastructure

├── Socket.IO Server  
├── Signaling Gateway  
├── Connection Manager  
├── Session Manager

↓

Interface Adapters

├── Offer Handler  
├── Answer Handler  
├── ICE Candidate Handler

↓

Application

├── JoinConsultationUseCase  
├── LeaveConsultationUseCase  
├── StartConsultationUseCase  
├── EndConsultationUseCase

↓

Domain

Consultation Aggregate

Each component has one responsibility.

---

# **22.4 Consultation Lifecycle**

Every consultation follows the same lifecycle.

Consultation Scheduled  
        │  
        ▼  
Participants Join  
        │  
        ▼  
Authorization  
        │  
        ▼  
Peer Negotiation  
        │  
        ▼  
Media Connection Established  
        │  
        ▼  
Consultation Active  
        │  
        ▼  
Consultation Ended

Business state is managed by the Consultation Aggregate.

Media state belongs to WebRTC.

---

# **22.5 Session Establishment**

Before signaling begins:

The backend validates:

* User identity  
* Consultation existence  
* Consultation status  
* Participant authorization  
* Coaching relationship

Only authorized participants may establish peer connections.

---

# **22.6 SDP Offer Exchange**

The caller generates an SDP Offer.

Flow:

Caller

↓

Create Offer

↓

Socket.IO

↓

Offer Handler

↓

Authorized Session

↓

Receiver

The backend forwards the offer.

It never interprets media.

---

# **22.7 SDP Answer Exchange**

The receiver responds with an SDP Answer.

Flow:

Receiver

↓

Create Answer

↓

Socket.IO

↓

Answer Handler

↓

Caller

Again, the backend forwards signaling data only.

---

# **22.8 ICE Candidate Exchange**

During negotiation:

Clients exchange ICE Candidates.

Flow:

Peer

↓

ICE Candidate

↓

Socket.IO

↓

ICE Handler

↓

Remote Peer

The backend does not process ICE information.

It simply routes it.

---

# **22.9 Signaling Flow**

Caller  
      │  
      ▼  
Join Consultation  
      │  
      ▼  
Authorization  
      │  
      ▼  
Offer  
      │  
      ▼  
Answer  
      │  
      ▼  
ICE Exchange  
      │  
      ▼  
Peer Connection Established

The signaling phase ends when the peer connection becomes active.

---

# **22.10 Session Management**

The backend maintains consultation session state.

Examples:

* Waiting  
* Connecting  
* Active  
* Ended  
* Failed

Media connection state remains on the clients.

---

# **22.11 Reconnection**

If signaling disconnects:

Responsibilities:

* Restore authentication  
* Restore signaling session  
* Resume negotiation if possible

Media recovery is handled by WebRTC.

Business state remains unchanged.

---

# **22.12 Consultation Authorization**

Before processing signaling:

The backend verifies:

* Consultation exists  
* User is participant  
* Consultation is active  
* Session has not expired

Unauthorized users cannot join consultations.

---

# **22.13 Consultation Termination**

Ending a consultation follows the Application Layer.

Participant

↓

EndConsultationUseCase

↓

Consultation Aggregate

↓

ConsultationCompleted Event

↓

Close Signaling Session

The business operation completes before technical cleanup.

---

# **22.14 Signaling Errors**

Examples:

* Invalid consultation  
* Unauthorized participant  
* Consultation already ended  
* Peer unavailable  
* Signaling timeout

Errors are mapped using the standard exception architecture.

---

# **22.15 STUN & TURN Servers**

The backend provides STUN/TURN configuration to authenticated participants.

Responsibilities:

* Supply ICE server configuration  
* Validate consultation access  
* Protect TURN credentials

The backend does not implement STUN or TURN itself.

---

# **22.16 Domain Events Integration**

Business events may trigger signaling actions.

Example:

ConsultationStarted

↓

Domain Event

↓

Signaling Gateway

↓

Notify Participants

The Domain never communicates directly with WebRTC.

---

# **22.17 Infrastructure Independence**

The Application Layer remains unaware of:

* SDP  
* ICE Candidates  
* RTCPeerConnection  
* STUN  
* TURN

These concepts belong exclusively to Infrastructure.

---

# **22.18 Testing**

The signaling subsystem is tested independently.

Tests verify:

* Authorization  
* Offer routing  
* Answer routing  
* ICE routing  
* Session lifecycle  
* Error handling

Business rules are tested separately.

---

# **22.19 Architectural Rules**

The following rules are mandatory:

* Backend never transports media.  
* Backend performs signaling only.  
* Every signaling request is authenticated.  
* Every signaling request is authorized.  
* Consultation state belongs to the Domain.  
* Media state belongs to WebRTC clients.  
* Signaling uses Socket.IO as the transport.

---

# **22.20 Common Anti-Patterns**

The following practices are prohibited:

❌ Streaming audio through the backend.

❌ Streaming video through the backend.

❌ Storing media streams on the server.

❌ Performing business validation inside signaling handlers.

❌ Accessing repositories directly from signaling handlers.

❌ Allowing signaling before consultation authorization.

---

# **22.21 Summary**

The WebRTC Signaling Architecture enables secure peer-to-peer consultation sessions while preserving the separation between business logic and media transport.

The backend authenticates participants, authorizes consultation access, coordinates signaling through Socket.IO, and manages consultation lifecycle events. Audio and video streams remain exclusively between peers, ensuring scalability, reduced server load, and full compliance with Clean Architecture principles.

---

# **23\. BACKGROUND JOB ARCHITECTURE**

The Background Job Architecture defines how asynchronous and scheduled operations are executed within the KIZUNAFIT backend.

Background Jobs execute business operations outside the lifecycle of client requests while preserving the principles of Clean Architecture.

Background Jobs never contain business logic.

They invoke Application Use Cases to perform business operations.

---

# **23.1 Purpose**

The Background Job Architecture exists to:

* Execute scheduled tasks  
* Execute asynchronous operations  
* Improve user responsiveness  
* Handle delayed processing  
* Automate recurring operations  
* Improve scalability  
* Support retry mechanisms

Background Jobs extend the Application.

They do not replace business workflows.

---

# **23.2 Architectural Position**

Background Jobs act as inbound adapters.

Scheduler  
      │  
      ▼  
Job Handler  
      │  
      ▼  
Application Use Case  
      │  
      ▼  
Domain  
      │  
      ▼  
Infrastructure

The execution path is identical to REST and Socket.IO.

---

# **23.3 Components**

Infrastructure

├── Scheduler  
├── Queue  
├── Worker  
├── Retry Manager

↓

Interface Adapters

├── Job Handlers

↓

Application

├── Use Cases

↓

Domain

Each component has a single responsibility.

---

# **23.4 Job Categories**

The platform supports several job categories.

### **Scheduled Jobs**

Executed at predefined times.

Examples:

* Expire consultations  
* Clean expired refresh tokens  
* Remove expired OTPs  
* Generate reports

---

### **Delayed Jobs**

Executed after a delay.

Examples:

* Consultation reminder  
* Payment reminder  
* Subscription renewal reminder

---

### **Event-Driven Jobs**

Triggered by Domain Events.

Examples:

* Welcome email  
* Push notification  
* Analytics update  
* Audit log generation

---

### **Maintenance Jobs**

Responsible for operational maintenance.

Examples:

* Database cleanup  
* Cache cleanup  
* Log rotation  
* Temporary file cleanup

---

# **23.5 Job Lifecycle**

Every Background Job follows the same lifecycle.

Job Triggered  
        │  
        ▼  
Job Handler  
        │  
        ▼  
Request Contract  
        │  
        ▼  
Use Case  
        │  
        ▼  
Domain  
        │  
        ▼  
Repository  
        │  
        ▼  
Job Completed

Jobs never bypass the Application Layer.

---

# **23.6 Scheduler**

The Scheduler determines when jobs should execute.

Responsibilities:

* Register schedules  
* Trigger execution  
* Prevent duplicate execution  
* Monitor execution

Scheduling itself contains no business logic.

---

# **23.7 Queue**

The Queue manages asynchronous work.

Responsibilities:

* Store pending jobs  
* Prioritize execution  
* Support retries  
* Track job status

The queue is a transport mechanism.

Business decisions remain in the Application Layer.

---

# **23.8 Workers**

Workers execute queued jobs.

Responsibilities:

* Receive jobs  
* Invoke Job Handlers  
* Report completion  
* Handle failures

Workers never access repositories directly.

---

# **23.9 Job Handlers**

Job Handlers translate scheduled work into Application execution.

Example:

ExpireConsultationJob

↓

ExpireConsultationUseCase

Handlers remain thin.

Business behavior belongs to the Use Case.

---

# **23.10 Retry Strategy**

Retries apply only to transient technical failures.

Examples:

Retry:

* Database timeout  
* Redis timeout  
* SMTP timeout  
* Cloudinary timeout

Do not retry:

* Invalid business state  
* Authorization failure  
* Entity not found  
* Business rule violations

Retries must never alter valid business outcomes.

---

# **23.11 Idempotency**

Background Jobs must be idempotent.

Repeated execution must not corrupt business state.

Examples:

Expire Consultation

↓

Already Expired

↓

No Change

Repeated execution produces the same result.

---

# **23.12 Job Context**

Every executing job maintains a context.

Typical contents:

* Job ID  
* Correlation ID  
* Execution Time  
* Retry Count  
* Trigger Source

The Job Context contains operational metadata only.

---

# **23.13 Domain Events Integration**

Background Jobs may be triggered by Domain Events.

Example:

PaymentCompleted

↓

Domain Event

↓

SendReceiptJob

↓

EmailReceiptUseCase

Business events remain independent of job execution.

---

# **23.14 Error Handling**

Job failures follow the standard exception architecture.

Flow:

Exception

↓

Retry Policy

↓

Failure Log

↓

Dead Letter Queue (Future)

Persistent failures should never block the application.

---

# **23.15 Monitoring**

The Scheduler tracks:

* Execution time  
* Success rate  
* Failure rate  
* Retry count  
* Queue depth

Operational metrics support production monitoring.

---

# **23.16 Dependency Rules**

Background Jobs may depend on:

* Application Use Cases  
* Shared Kernel  
* Infrastructure Scheduling

Background Jobs must never depend on:

* Aggregate implementations  
* Repository implementations  
* Controllers  
* HTTP objects

Business execution always begins in the Application Layer.

---

# **23.17 Future Scalability**

The architecture supports future migration to distributed job processing.

Examples:

Current:

In-Process Scheduler

Future:

BullMQ

RabbitMQ

Kafka

AWS SQS

Migration should require changes only within the Infrastructure Layer.

---

# **23.18 Testing**

Background Jobs are tested independently.

Tests verify:

* Scheduling  
* Queue execution  
* Retry behavior  
* Failure handling  
* Use Case invocation

Business rules remain tested within the Domain.

---

# **23.19 Architectural Rules**

The following rules are mandatory:

* Jobs invoke Use Cases.  
* Jobs contain no business logic.  
* Workers never access repositories directly.  
* Scheduler contains no business rules.  
* Retries apply only to transient failures.  
* Jobs must be idempotent.

---

# **23.20 Common Anti-Patterns**

The following practices are prohibited:

❌ Updating MongoDB directly from a Cron Job.

❌ Executing Aggregate methods from a Worker.

❌ Sending emails directly from the Scheduler.

❌ Performing business validation inside Workers.

❌ Using the queue as the system of record.

❌ Allowing retries for business rule violations.

---

# **23.21 Summary**

The Background Job Architecture enables asynchronous and scheduled processing while preserving the integrity of the KIZUNAFIT backend.

By treating schedulers, queues, and workers as inbound adapters that invoke Application Use Cases, the architecture ensures consistent business execution regardless of whether an operation originates from a client request, a real-time event, or a scheduled task.

---

**24\. FILE STORAGE ARCHITECTURE**

The File Storage Architecture defines how binary assets are stored, retrieved, managed, and secured within the KIZUNAFIT platform.

The architecture abstracts storage technologies behind Application Ports, allowing the business layers to remain completely independent of storage providers.

Binary assets are treated as infrastructure resources rather than business entities.

---

# **24.1 Purpose**

The File Storage Architecture exists to:

* Store binary assets  
* Retrieve assets  
* Replace assets  
* Delete assets  
* Organize storage  
* Secure file access  
* Support provider replacement

The business never interacts directly with Cloudinary or any storage provider.

---

# **24.2 Architectural Position**

File Storage belongs entirely to the Infrastructure Layer.

Application  
      │  
      ▼  
StorageGateway (Port)  
      │  
      ▼  
CloudinaryStorageGateway  
      │  
      ▼  
Cloudinary

The Application Layer depends only on the Storage Gateway interface.

---

# **24.3 Storage Components**

Application

├── StorageGateway

↓

Infrastructure

├── CloudinaryStorageGateway  
├── FileProcessor  
├── ImageOptimizer  
├── AssetManager

↓

Cloudinary

Each component has a clearly defined responsibility.

---

# **24.4 Supported Assets**

The platform supports multiple asset categories.

Examples:

User Avatar

Trainer Avatar

Trainer Certificate

Workout Image

Nutrition Image

Exercise Image

Chat Attachment (Future)

Consultation Recording (Future)

Each asset category follows its own storage policy.

---

# **24.5 Upload Flow**

Every upload follows the same lifecycle.

Client  
      │  
      ▼  
Upload Middleware  
      │  
      ▼  
Validation  
      │  
      ▼  
Application Use Case  
      │  
      ▼  
Storage Gateway  
      │  
      ▼  
Cloudinary  
      │  
      ▼  
Asset Metadata Saved

The business operation completes only after the storage operation succeeds.

---

# **24.6 File Validation**

Before storage, every file is validated.

Validation includes:

* MIME type  
* File size  
* Allowed extensions  
* Image dimensions (where applicable)  
* Virus scanning (future)

Business validation remains separate.

---

# **24.7 Storage Gateway**

The Application Layer communicates through the Storage Gateway.

Responsibilities:

* Upload asset  
* Delete asset  
* Replace asset  
* Generate asset URL  
* Retrieve metadata

The Storage Gateway defines the contract.

Infrastructure provides the implementation.

---

# **24.8 Folder Organization**

Assets are organized by business domain.

Example:

users/  
    avatars/

trainers/  
    avatars/

trainers/  
    certificates/

workouts/  
    images/

nutrition/  
    images/

Folder names reflect business concepts rather than technical implementation.

---

# **24.9 Asset Naming**

Asset identifiers must be unique.

Recommended strategy:

{aggregateId}/{assetType}/{uuid}

Example:

trainer-123/avatar/9f8c3e2d

File names supplied by users should never be trusted as unique identifiers.

---

# **24.10 Asset Metadata**

The database stores metadata only.

Examples:

* Asset ID  
* Public Identifier  
* URL  
* MIME Type  
* Size  
* Width  
* Height  
* Uploaded At

Binary data is never stored inside MongoDB.

---

# **24.11 Asset Replacement**

Replacing an asset follows this flow:

Upload New Asset  
        │  
        ▼  
Persist Metadata  
        │  
        ▼  
Update Aggregate  
        │  
        ▼  
Delete Old Asset

Old assets should be removed after successful replacement to avoid orphaned files.

---

# **24.12 Asset Deletion**

Deletion is coordinated through a Use Case.

Flow:

DeleteAvatarUseCase  
        │  
        ▼  
Storage Gateway  
        │  
        ▼  
Cloudinary  
        │  
        ▼  
Metadata Updated

Direct deletion from Infrastructure is prohibited.

---

# **24.13 Access Control**

Protected assets require authorization before access.

Examples:

* Trainer certificates  
* Private consultation files  
* Administrative documents

Public assets, such as avatars, may be accessed without authentication.

Access policies are determined by the Domain.

---

# **24.14 Image Processing**

Image processing occurs within the Infrastructure Layer.

Examples:

* Resize  
* Crop  
* Compress  
* Format conversion  
* Thumbnail generation

The Domain remains unaware of image transformations.

---

# **24.15 Cleanup Strategy**

Unused assets should be cleaned periodically.

Examples:

* Failed uploads  
* Replaced avatars  
* Expired temporary files  
* Abandoned uploads

Cleanup is executed through Background Jobs.

---

# **24.16 Provider Independence**

The storage provider must be replaceable.

Current implementation:

StorageGateway

↓

CloudinaryStorageGateway

Future replacement:

StorageGateway

↓

S3StorageGateway

↓

AzureBlobStorageGateway

↓

GoogleCloudStorageGateway

The Application Layer remains unchanged.

---

# **24.17 Failure Handling**

Storage failures include:

* Upload failure  
* Network timeout  
* Invalid file  
* Provider unavailable  
* Permission denied

Failures are translated into Infrastructure Exceptions before reaching the Application Layer.

---

# **24.18 Testing**

Storage components are tested independently.

Tests verify:

* Upload  
* Delete  
* Replace  
* Metadata generation  
* Error handling

Business behavior remains outside storage tests.

---

# **24.19 Architectural Rules**

The following rules are mandatory:

* Business layers never call Cloudinary directly.  
* Binary files are never stored in MongoDB.  
* Storage is accessed only through the Storage Gateway.  
* Upload validation occurs before persistence.  
* Asset metadata belongs to the database.  
* Storage providers are replaceable.

---

# **24.20 Common Anti-Patterns**

The following practices are prohibited:

❌ Uploading directly from Controllers to Cloudinary.

❌ Storing image binaries inside MongoDB.

❌ Embedding Cloudinary URLs inside Domain Entities.

❌ Hardcoding storage provider APIs inside Use Cases.

❌ Allowing Infrastructure to modify business state.

❌ Leaving orphaned assets after replacement.

---

# **24.21 Summary**

The File Storage Architecture provides a scalable and provider-independent approach for managing binary assets within the KIZUNAFIT platform.

By isolating storage behind the `StorageGateway` Application Port and treating binary assets as infrastructure resources, the backend maintains Clean Architecture boundaries while supporting secure uploads, efficient asset management, and future storage provider replacement.

---

# **25\. LOGGING ARCHITECTURE**

The Logging Architecture defines how operational, security, and audit information is captured, structured, stored, and analyzed throughout the KIZUNAFIT backend.

Logging provides observability into application behavior without influencing business execution.

Logging is a cross-cutting infrastructure concern.

It never participates in business decision making.

---

# **25.1 Purpose**

The Logging Architecture exists to:

* Record application activity  
* Support debugging  
* Support production monitoring  
* Support security investigations  
* Support auditing  
* Improve incident response  
* Enable operational analytics

Logs describe system behavior.

They never define system behavior.

---

# **25.2 Logging Principles**

Logging follows these principles:

* Structured logging  
* Immutable log records  
* Consistent formatting  
* Correlation-aware  
* Security-conscious  
* Asynchronous where possible  
* No business logic

Logging observes execution.

It never changes execution.

---

# **25.3 Architectural Position**

Logging belongs to the Infrastructure Layer.

Application  
      │  
      ▼  
Logger Port  
      │  
      ▼  
Logger Implementation  
      │  
      ▼  
Console / File / Cloud Logging

The Application Layer depends only on the Logger abstraction when logging is required.

---

# **25.4 Log Categories**

The platform defines several categories of logs.

### **Application Logs**

General application execution.

Examples:

* Startup  
* Shutdown  
* Configuration  
* Module initialization

---

### **Request Logs**

Track incoming requests.

Examples:

* HTTP requests  
* Socket.IO events  
* Background jobs  
* WebRTC signaling

---

### **Security Logs**

Security-related activity.

Examples:

* Login  
* Logout  
* Failed authentication  
* Permission denial  
* Token revocation

---

### **Audit Logs**

Business-sensitive operations.

Examples:

* Refund approval  
* User suspension  
* Trainer verification  
* Platform configuration updates

Audit logs must be immutable.

---

### **Error Logs**

Unexpected failures.

Examples:

* Exceptions  
* Database failures  
* Queue failures  
* External API failures

---

### **Performance Logs**

Performance measurements.

Examples:

* Response time  
* Database latency  
* Slow queries  
* Queue execution time

---

# **25.5 Log Levels**

The backend standardizes log levels.

TRACE

DEBUG

INFO

WARN

ERROR

FATAL

Each level has a clearly defined purpose.

Production environments typically disable TRACE and DEBUG.

---

# **25.6 Structured Logging**

Every log entry follows a standard structure.

Example:

{  
  timestamp,  
  level,  
  correlationId,  
  requestId,  
  userId,  
  module,  
  operation,  
  message,  
  metadata  
}

Structured logs improve searchability and automated analysis.

---

# **25.7 Correlation IDs**

Every request receives a unique Correlation ID.

Flow:

Incoming Request  
        │  
        ▼  
Correlation ID Generated  
        │  
        ▼  
Attached to Request Context  
        │  
        ▼  
Included in Every Log

This enables tracing an entire request across components.

---

# **25.8 Request Logging**

Every inbound request should log:

* Request ID  
* Correlation ID  
* HTTP Method or Socket Event  
* Route  
* Response Status  
* Execution Time  
* Authenticated User (if available)

Sensitive request data must not be logged.

---

# **25.9 Exception Logging**

Unhandled exceptions must include:

* Exception type  
* Message  
* Stack trace  
* Correlation ID  
* User ID  
* Module  
* Timestamp

Technical details remain in logs only.

Clients receive sanitized error responses.

---

# **25.10 Security Logging**

Security logs capture authentication and authorization events.

Examples:

Successful Login

Failed Login

Password Reset

Account Locked

Permission Denied

Refresh Token Revoked

Passwords, tokens, and secrets must never be logged.

---

# **25.11 Audit Logging**

Audit logs capture business-sensitive actions.

Each audit record includes:

* Actor  
* Action  
* Resource  
* Resource ID  
* Timestamp  
* Outcome

Audit logs should be immutable and retained according to business policy.

---

# **25.12 Background Job Logging**

Every Background Job should log:

* Job ID  
* Job Name  
* Start Time  
* Completion Time  
* Retry Count  
* Result

This supports operational troubleshooting.

---

# **25.13 WebSocket Logging**

Socket.IO interactions should log:

* Connection established  
* Connection closed  
* Authentication result  
* Room joins/leaves  
* Critical realtime events

Routine message payloads should not be logged unless required for diagnostics.

---

# **25.14 Performance Logging**

Performance metrics include:

* API latency  
* Database query duration  
* Cache hit/miss ratio  
* Queue execution time  
* File upload duration

Performance logs support optimization efforts.

---

# **25.15 Sensitive Data**

The following information must never appear in logs:

* Passwords  
* Access Tokens  
* Refresh Tokens  
* OTP codes  
* Credit card information  
* Secret keys  
* Session secrets

Sensitive values should be masked or omitted.

---

# **25.16 Log Retention**

Different log categories may have different retention periods.

Example policy:

| Log Type | Retention |
| ----- | ----- |
| Application | 30 days |
| Request | 30 days |
| Error | 90 days |
| Security | 180 days |
| Audit | According to business/compliance requirements |

Retention policies should be configurable.

---

# **25.17 Logger Implementation**

The Logger implementation should support multiple destinations.

Examples:

Console Logger

↓

File Logger

↓

Cloud Logger

↓

Centralized Logging Platform

Changing the destination should not affect the Application Layer.

---

# **25.18 Testing**

Logging components are tested independently.

Tests verify:

* Log formatting  
* Correlation IDs  
* Log levels  
* Sensitive data masking  
* Destination routing

Logging should never affect business test outcomes.

---

# **25.19 Architectural Rules**

The following rules are mandatory:

* Logging belongs to Infrastructure.  
* Logs are structured.  
* Every request has a Correlation ID.  
* Sensitive data is never logged.  
* Logging never alters business behavior.  
* Audit logs are immutable.

---

# **25.20 Common Anti-Patterns**

The following practices are prohibited:

❌ Using `console.log()` throughout production code.

❌ Logging passwords, JWTs, or OTPs.

❌ Mixing audit logs with debug logs.

❌ Catching exceptions only to log and suppress them.

❌ Using logs as a persistence mechanism.

❌ Making business decisions based on log output.

---

# **25.21 Summary**

The Logging Architecture provides a structured, secure, and scalable observability strategy for the KIZUNAFIT backend.

By centralizing logging behind infrastructure abstractions, enforcing structured log formats, and separating application, security, audit, and performance logs, the architecture enables effective debugging, operational monitoring, and security investigations while preserving Clean Architecture boundaries.

---

# **26\. SECURITY ARCHITECTURE**

The Security Architecture defines the principles, mechanisms, and controls that protect the KIZUNAFIT platform against unauthorized access, data breaches, abuse, and other security threats.

Security is implemented as a cross-cutting architectural concern that spans every layer of the system while preserving the principles of Clean Architecture.

Security mechanisms support the business.

They never become the business.

---

# **26.1 Purpose**

The Security Architecture exists to:

* Protect user identities  
* Protect business data  
* Secure communication  
* Prevent unauthorized access  
* Protect system integrity  
* Mitigate common attacks  
* Support secure software development

Security is everyone's responsibility.

---

# **26.2 Security Principles**

The backend follows these principles:

* Defense in Depth  
* Least Privilege  
* Zero Trust  
* Secure by Default  
* Fail Secure  
* Principle of Explicit Access  
* Separation of Duties  
* Minimize Attack Surface

Every request is considered untrusted until verified.

---

# **26.3 Security Layers**

Security exists at multiple layers.

Network

↓

Transport

↓

Middleware

↓

Authentication

↓

Authorization

↓

Application

↓

Domain

↓

Infrastructure

↓

Database

Each layer contributes independent security controls.

---

# **26.4 Authentication Security**

Authentication security includes:

* Password hashing  
* Secure JWT signing  
* Refresh token rotation  
* Session revocation  
* Multi-device sessions  
* Email verification  
* Login attempt monitoring

Passwords are never stored in plaintext.

---

# **26.5 Authorization Security**

Authorization enforces:

* Role-Based Access Control  
* Ownership validation  
* Coaching relationship validation  
* Administrative permissions  
* Resource protection

Access is denied unless explicitly granted.

---

# **26.6 API Security**

Every API endpoint should enforce:

* HTTPS only  
* Authentication where required  
* Authorization where required  
* Request validation  
* Rate limiting  
* Standardized error responses

APIs never trust client-provided data.

---

# **26.7 Input Security**

Every external input is treated as untrusted.

Validation includes:

* Body  
* Query parameters  
* Route parameters  
* Headers  
* Uploaded files  
* Socket.IO payloads

Input validation occurs before business execution.

---

# **26.8 Password Security**

Passwords must satisfy the Password Policy.

Requirements include:

* Minimum length  
* Strong hashing (Argon2id preferred, bcrypt acceptable)  
* Secure comparison  
* Never reversible

Password hashes are the only stored representation.

---

# **26.9 Token Security**

JWTs should contain only minimal claims.

Examples:

* User ID  
* Role  
* Session ID  
* Token Version  
* Expiration

JWTs must never contain:

* Passwords  
* Email verification codes  
* Business data  
* Permissions lists  
* Personal information

---

# **26.10 Session Security**

Every login creates an independent session.

Sessions support:

* Device tracking  
* Revocation  
* Rotation  
* Expiration  
* Logout all devices

Compromised sessions can be revoked independently.

---

# **26.11 Transport Security**

All communication uses HTTPS.

Examples:

* REST API  
* Socket.IO  
* OAuth  
* File uploads  
* WebRTC signaling

Plain HTTP is prohibited in production.

---

# **26.12 Rate Limiting**

Sensitive operations are protected.

Examples:

* Login  
* Registration  
* OTP generation  
* Password reset  
* Refresh token endpoint

Rate limiting uses Redis.

Business logic remains unaffected.

---

# **26.13 File Upload Security**

Uploaded files are validated for:

* MIME type  
* File extension  
* Maximum size  
* Image integrity  
* Malware scanning (future)

Executable files are prohibited.

---

# **26.14 WebSocket Security**

Socket.IO security includes:

* Authentication during handshake  
* Authorization for every event  
* Room access validation  
* Connection rate limiting  
* Session validation

Sockets never bypass REST security policies.

---

# **26.15 WebRTC Security**

WebRTC security includes:

* Authenticated signaling  
* Authorized consultation access  
* Secure TURN credentials  
* Protected session establishment

Media encryption is provided by WebRTC.

The backend never decrypts media streams.

---

# **26.16 Data Protection**

Sensitive data includes:

* Password hashes  
* Refresh tokens  
* Email verification tokens  
* Password reset tokens  
* Payment references  
* Personal profile information

Sensitive data should be encrypted or securely hashed where appropriate.

---

# **26.17 Secrets Management**

Secrets include:

* JWT keys  
* Database credentials  
* Redis credentials  
* Cloudinary credentials  
* Payment gateway keys  
* Email provider credentials

Secrets must:

* Never be committed to source control.  
* Be loaded from environment configuration.  
* Rotate periodically.  
* Be accessible only to authorized services.

---

# **26.18 Security Logging**

Security events should be logged.

Examples:

* Successful login  
* Failed login  
* Password reset  
* Account suspension  
* Permission denied  
* Refresh token revocation

Sensitive credentials must never appear in logs.

---

# **26.19 Common Threat Protection**

The architecture mitigates common threats.

| Threat | Protection |
| ----- | ----- |
| SQL/NoSQL Injection | Parameterized queries & validation |
| XSS | Output encoding & input validation |
| CSRF | SameSite cookies / CSRF tokens (if cookie auth is used) |
| Brute Force | Rate limiting & account monitoring |
| Replay Attack | Refresh token rotation & session validation |
| Broken Access Control | Authorization policies |
| Sensitive Data Exposure | HTTPS & encryption |
| File Upload Abuse | File validation & storage isolation |

---

# **26.20 Dependency Security**

Third-party dependencies should be:

* Reviewed before adoption  
* Kept up to date  
* Scanned for vulnerabilities  
* Removed when unused

Dependency risk is part of application security.

---

# **26.21 Security Headers**

Production responses should include appropriate security headers.

Examples:

* Content-Security-Policy  
* X-Content-Type-Options  
* Referrer-Policy  
* Permissions-Policy  
* Strict-Transport-Security  
* X-Frame-Options

Headers should be configured centrally.

---

# **26.22 Error Security**

Error responses must not expose:

* Stack traces  
* Database names  
* SQL/Mongo queries  
* File paths  
* Internal implementation details

Detailed diagnostics belong only in logs.

---

# **26.23 Monitoring & Incident Detection**

Operational monitoring should detect:

* Excessive failed logins  
* Abnormal API usage  
* Token abuse  
* High error rates  
* Suspicious IP activity  
* Unexpected traffic spikes

Monitoring enables early threat detection.

---

# **26.24 Testing**

Security testing includes:

* Authentication tests  
* Authorization tests  
* Input validation tests  
* Rate limiting tests  
* Session management tests  
* File upload tests  
* Penetration testing (periodic)

Security is continuously verified.

---

# **26.25 Architectural Rules**

The following rules are mandatory:

* Every request is authenticated when required.  
* Every protected operation is authorized.  
* Secrets never appear in source code.  
* Passwords are never stored in plaintext.  
* Business layers remain security-framework independent.  
* Security failures fail closed by default.  
* Every external input is validated.

---

# **26.26 Common Anti-Patterns**

The following practices are prohibited:

❌ Hardcoding API keys or JWT secrets.

❌ Trusting client-provided role information.

❌ Logging passwords, tokens, or secrets.

❌ Returning internal stack traces to clients.

❌ Bypassing authorization for internal endpoints.

❌ Allowing direct access to Infrastructure components.

❌ Assuming Socket.IO requests are trusted after connection without per-event authorization.

---

# **26.27 Security Checklist**

Every new feature should satisfy the following checklist:

* Authentication required?  
* Authorization required?  
* Input validated?  
* Business rules enforced?  
* Sensitive data protected?  
* Audit logging required?  
* Rate limiting required?  
* Error responses sanitized?  
* Tests added?  
* Documentation updated?

This checklist is mandatory for all production features.

---

# **26.28 Summary**

The Security Architecture provides a comprehensive, layered defense strategy for the KIZUNAFIT backend.

By applying security controls at every architectural boundary, protecting identities, validating all external input, securing communication channels, and isolating infrastructure concerns from the business core, the platform remains resilient against common threats while preserving the principles of Clean Architecture.

---

# **27\. TESTING STRATEGY**

The Testing Strategy defines how the KIZUNAFIT backend verifies correctness, reliability, maintainability, and architectural integrity.

Testing follows the architectural boundaries established by Clean Architecture.

Each architectural layer is tested independently according to its responsibilities while minimizing unnecessary dependencies.

Testing validates business behavior, not implementation details.

---

# **27.1 Purpose**

The Testing Strategy exists to:

* Verify business correctness  
* Protect architectural boundaries  
* Prevent regressions  
* Improve maintainability  
* Enable safe refactoring  
* Support continuous delivery  
* Increase development confidence

Tests are part of the architecture.

---

# **27.2 Testing Principles**

The backend follows these principles:

* Test behavior, not implementation  
* Fast feedback  
* Independent tests  
* Repeatable execution  
* Deterministic results  
* Isolated layers  
* High business coverage

Tests should remain stable as implementation evolves.

---

# **27.3 Testing Pyramid**

               End-to-End  
                     ▲  
             Integration Tests  
                     ▲  
            Repository Tests  
                     ▲  
             Application Tests  
                     ▲  
               Domain Tests

The majority of tests should exist in the lower layers.

---

# **27.4 Domain Tests**

Domain Tests verify business rules.

Examples:

* Aggregate behavior  
* State transitions  
* Domain policies  
* Specifications  
* Value Objects  
* Domain Events

Domain Tests require:

* No database  
* No Express  
* No Redis  
* No Socket.IO

Only pure business objects.

---

# **27.5 Application Tests**

Application Tests verify Use Cases.

Examples:

* User Registration  
* Login  
* Offer Acceptance  
* Consultation Scheduling  
* Workout Assignment

Dependencies are replaced with:

* Mock Repositories  
* Fake Gateways  
* Stub Event Bus

Business workflows are verified independently.

---

# **27.6 Repository Tests**

Repository Tests verify persistence.

Examples:

* Aggregate mapping  
* MongoDB queries  
* Transactions  
* Optimistic locking  
* Index usage

Repository Tests use a real MongoDB instance or isolated test database.

---

# **27.7 Adapter Tests**

Interface Adapter Tests verify:

* Controllers  
* Request validation  
* Response mapping  
* Middleware  
* Socket.IO handlers  
* Job handlers

Business behavior should be mocked.

Adapters verify transport behavior only.

---

# **27.8 Infrastructure Tests**

Infrastructure Tests verify:

* Cloudinary integration  
* Redis integration  
* JWT provider  
* Email provider  
* Storage gateway  
* Queue implementation

Infrastructure is tested independently of business logic.

---

# **27.9 Integration Tests**

Integration Tests verify collaboration between architectural components.

Examples:

Controller

↓

Use Case

↓

Repository

↓

MongoDB

Integration Tests ensure components work together correctly.

---

# **27.10 End-to-End Tests**

End-to-End Tests verify complete business workflows.

Examples:

* Register User  
* Verify Email  
* Login  
* Purchase Coaching  
* Schedule Consultation  
* Join Consultation  
* Submit Review

These tests simulate real client interactions.

---

# **27.11 Testing Real-Time Features**

Socket.IO tests verify:

* Authentication  
* Connection lifecycle  
* Event routing  
* Broadcasting  
* Presence updates

Business rules remain covered by Use Cases.

---

# **27.12 Testing WebRTC**

Backend tests verify:

* Consultation authorization  
* Signaling messages  
* Offer routing  
* Answer routing  
* ICE routing

Media transmission is not tested by the backend.

---

# **27.13 Mocking Strategy**

Only external dependencies are mocked.

Examples:

Mock:

* Email Gateway  
* Storage Gateway  
* Redis  
* Payment Gateway  
* Notification Gateway

Never mock:

* Domain Entities  
* Aggregates  
* Value Objects  
* Domain Policies

Business behavior should always be tested directly.

---

# **27.14 Test Data**

Test data should be:

* Predictable  
* Minimal  
* Independent  
* Repeatable

Factories should create valid business objects.

Example:

UserFactory

TrainerFactory

ConsultationFactory

WorkoutFactory

---

# **27.15 Architectural Tests**

Architecture itself should be verified.

Examples:

* No Infrastructure imports inside Domain  
* No Express inside Application  
* No MongoDB inside Domain  
* Dependency Rule compliance

These tests prevent architectural erosion.

---

# **27.16 Performance Tests**

Performance tests verify:

* API response time  
* Database queries  
* Cache performance  
* Background jobs  
* File uploads  
* Socket.IO scalability

Performance tests support production readiness.

---

# **27.17 Security Tests**

Security testing includes:

* Authentication  
* Authorization  
* Rate limiting  
* File upload validation  
* JWT validation  
* Session management

Security tests verify defensive controls.

---

# **27.18 Test Coverage**

Coverage should prioritize business logic.

Recommended goals:

| Layer | Target Coverage |
| ----- | ----- |
| Domain | 95%+ |
| Application | 90%+ |
| Infrastructure | 80%+ |
| Adapters | 80%+ |

Coverage percentages are indicators, not goals by themselves.

Meaningful tests are more valuable than high numbers.

---

# **27.19 Continuous Integration**

Every pull request should execute:

* Static analysis  
* Linting  
* Unit tests  
* Integration tests  
* Architecture tests

Deployment should proceed only after successful validation.

---

# **27.20 Testing Rules**

The following rules are mandatory:

* Every Use Case has tests.  
* Every Aggregate has tests.  
* Every Value Object has tests.  
* External services are mocked in unit tests.  
* Domain tests never require infrastructure.  
* Business behavior is tested before implementation details.

---

# **27.21 Common Anti-Patterns**

The following practices are prohibited:

❌ Mocking Domain behavior.

❌ Testing private methods.

❌ Sharing mutable test data.

❌ Depending on test execution order.

❌ Using production databases.

❌ Writing tests that validate framework internals instead of business behavior.

---

# **27.22 Summary**

The Testing Strategy ensures that every architectural layer of the KIZUNAFIT backend is verified independently while preserving Clean Architecture boundaries.

By emphasizing Domain and Application testing, isolating infrastructure concerns, and validating complete business workflows through integration and end-to-end tests, the platform achieves high confidence, maintainability, and long-term reliability.

---

# **28\. DEPLOYMENT ARCHITECTURE**

The Deployment Architecture defines how the KIZUNAFIT backend is deployed, configured, and operated in production environments.

It describes the runtime topology, infrastructure components, deployment boundaries, scalability model, and operational principles while preserving the Clean Architecture established throughout the system.

The deployment environment supports the application.

It does not influence business behavior.

---

# **28.1 Purpose**

The Deployment Architecture exists to:

* Standardize production deployments  
* Ensure scalability  
* Ensure high availability  
* Improve operational reliability  
* Support monitoring  
* Simplify maintenance  
* Enable future horizontal scaling

Deployment concerns remain outside the business layers.

---

# **28.2 Deployment Principles**

The backend follows these principles:

* Environment-independent  
* Immutable deployments  
* Stateless application servers  
* Externalized configuration  
* Horizontal scalability  
* Graceful shutdown  
* Infrastructure replaceability

Application code remains identical across all environments.

---

# **28.3 Runtime Topology**

               Internet  
                    │  
                    ▼  
             Reverse Proxy (NGINX)  
                    │  
        ┌───────────┴───────────┐  
        ▼                       ▼  
 Application Instance 1   Application Instance 2  
        │                       │  
        └───────────┬───────────┘  
                    ▼  
               MongoDB Replica Set  
                    │  
                    ▼  
                  Redis  
                    │  
                    ▼  
             External Services  
         ├── Cloudinary  
         ├── SMTP Provider  
         ├── Razorpay  
         └── Google OAuth

Each runtime component has a clearly defined responsibility.

---

# **28.4 Application Server**

Each application instance is responsible for:

* HTTP API  
* Socket.IO  
* WebRTC signaling  
* Background Job execution (where applicable)  
* Application orchestration

Application servers remain stateless.

---

# **28.5 Reverse Proxy**

The reverse proxy provides:

* HTTPS termination  
* Load balancing  
* Request forwarding  
* Compression  
* Static response optimization  
* Security headers

NGINX is the recommended implementation.

---

# **28.6 Database Layer**

MongoDB serves as the primary data store.

Responsibilities:

* Aggregate persistence  
* Transactions  
* Replication  
* Backup support

The application accesses MongoDB only through Repository implementations.

---

# **28.7 Cache Layer**

Redis provides:

* Refresh session storage  
* OTP storage  
* Rate limiting  
* Temporary caching  
* Distributed coordination (future)

Redis is not the system of record.

---

# **28.8 External Services**

External providers include:

* Cloudinary  
* Email Provider  
* Razorpay  
* Google OAuth

All integrations occur through Application Ports and Infrastructure Gateways.

---

# **28.9 Configuration**

Configuration is externalized.

Examples:

* Database URL  
* JWT secrets  
* Redis URL  
* Cloudinary credentials  
* SMTP credentials  
* OAuth credentials

Configuration is environment-specific.

Business logic never accesses environment variables directly.

---

# **28.10 Environment Strategy**

Supported environments:

Local

Development

Testing

Staging

Production

Each environment shares the same application code.

Only configuration differs.

---

# **28.11 Scaling Strategy**

The application supports horizontal scaling.

Scalable components include:

* API instances  
* Socket.IO instances (with Redis adapter)  
* Background workers

State remains external to application processes.

---

# **28.12 High Availability**

Production deployments should provide:

* Multiple application instances  
* Database replication  
* Health monitoring  
* Automatic restart  
* Graceful shutdown  
* Load balancing

No single application instance should become a critical point of failure.

---

# **28.13 Health Checks**

Health endpoints verify:

* Application status  
* MongoDB connectivity  
* Redis connectivity  
* External provider availability (optional)  
* Queue status

Health endpoints support orchestration and monitoring.

---

# **28.14 Graceful Shutdown**

Shutdown sequence:

Stop Receiving Requests  
        │  
        ▼  
Finish Active Requests  
        │  
        ▼  
Close Socket Connections  
        │  
        ▼  
Stop Background Jobs  
        │  
        ▼  
Close Database Connections  
        │  
        ▼  
Terminate Process

Graceful shutdown prevents data corruption.

---

# **28.15 Logging & Monitoring**

Production deployment includes:

* Structured logs  
* Metrics  
* Health monitoring  
* Error monitoring  
* Performance monitoring  
* Audit logging

Operational visibility is mandatory.

---

# **28.16 Backup & Recovery**

Operational strategy includes:

* Automated MongoDB backups  
* Backup verification  
* Recovery procedures  
* Configuration backup

Recovery procedures should be documented and periodically tested.

---

# **28.17 Security**

Production deployment enforces:

* HTTPS only  
* Secure headers  
* Firewall rules  
* Secret management  
* Principle of least privilege  
* Network isolation where appropriate

Infrastructure security complements application security.

---

# **28.18 Deployment Process**

A typical deployment consists of:

Build

↓

Run Tests

↓

Create Artifact

↓

Deploy

↓

Health Verification

↓

Traffic Switch

↓

Monitoring

Failed deployments should support rollback.

---

# **28.19 Disaster Recovery**

Recovery planning includes:

* Database restoration  
* Configuration restoration  
* Infrastructure recreation  
* Backup validation  
* Recovery time objectives (RTO)  
* Recovery point objectives (RPO)

Operational resilience is part of the deployment architecture.

---

# **28.20 Containerization**

The backend should be containerized.

Each container includes:

* Node.js runtime  
* Application code  
* Runtime dependencies

Persistent data remains outside containers.

---

# **28.21 Architectural Rules**

The following rules are mandatory:

* Application servers are stateless.  
* Configuration is externalized.  
* Secrets are never embedded in code.  
* Infrastructure is replaceable.  
* Persistent state remains outside application instances.  
* Production traffic always uses HTTPS.

---

# **28.22 Common Anti-Patterns**

The following practices are prohibited:

❌ Storing uploaded files on local application disks.

❌ Using in-memory sessions in production.

❌ Hardcoding environment values.

❌ Treating Redis as the primary database.

❌ Running production without health checks.

❌ Coupling business logic to deployment configuration.

---

# **28.23 Summary**

The Deployment Architecture defines a scalable, resilient, and maintainable runtime environment for the KIZUNAFIT backend.

By deploying stateless application instances behind a reverse proxy, externalizing configuration, isolating infrastructure concerns, and relying on replaceable runtime components, the platform remains aligned with Clean Architecture while supporting future growth and operational reliability.

---

# **29\. CODING STANDARDS**

The Coding Standards define the conventions, practices, and architectural rules that govern the implementation of the KIZUNAFIT backend.

These standards ensure consistency, readability, maintainability, and long-term scalability while preserving the principles of Clean Architecture.

Every contributor must follow these standards regardless of experience level.

---

# **29.1 Purpose**

The Coding Standards exist to:

* Maintain consistency  
* Preserve Clean Architecture  
* Improve readability  
* Simplify maintenance  
* Reduce technical debt  
* Improve collaboration  
* Support long-term scalability

Code should communicate intent before implementation.

---

# **29.2 General Principles**

Every piece of code should follow these principles:

* Single Responsibility Principle  
* Separation of Concerns  
* High Cohesion  
* Low Coupling  
* Explicit Dependencies  
* Small Components  
* Predictable Behavior

Readability is preferred over cleverness.

---

# **29.3 Naming Conventions**

Names should describe business intent.

Examples:

Classes

RegisterUserUseCase

UserRepository

TrainerProfile

WorkoutProgram

Methods

register()

verifyEmail()

publish()

assignWorkout()

Variables

trainerProfile

consultation

paymentReference

Avoid abbreviations.

Incorrect:

usr

tmp

obj

svc

mgr

---

# **29.4 File Naming**

Files use **PascalCase** for classes and **kebab-case** for directories.

Example:

modules/

identity/

application/

register-user/

RegisterUserUseCase.ts

Consistency is mandatory.

---

# **29.5 Class Design**

Every class should:

* Have one responsibility  
* Be small  
* Be easily testable  
* Receive dependencies through constructors  
* Avoid hidden dependencies

Large "God Classes" are prohibited.

---

# **29.6 Method Design**

Methods should:

* Perform one operation  
* Have descriptive names  
* Avoid deep nesting  
* Return predictable results  
* Remain short where practical

A method should be understandable without reading unrelated code.

---

# **29.7 Function Size**

Recommended guidelines:

* Small helper functions: ≤ 15 lines  
* Business methods: ≤ 30 lines  
* Complex orchestration: split into private methods

These are guidelines, not strict limits.

Clarity takes priority over line count.

---

# **29.8 Dependency Management**

Dependencies must:

* Use constructor injection  
* Depend on abstractions  
* Avoid global state  
* Avoid service locators

Manual instantiation inside business layers is prohibited.

---

# **29.9 Error Handling**

Errors should:

* Throw meaningful exceptions  
* Preserve architectural boundaries  
* Never swallow exceptions  
* Never expose implementation details

Business failures should use Domain Exceptions.

---

# **29.10 Comments**

Comments explain **why**, not **what**.

Good:

Prevent duplicate consultation scheduling because  
a trainer cannot conduct overlapping sessions.

Poor:

Increment i by one.

Well-written code should be largely self-explanatory.

---

# **29.11 Constants**

Magic values are prohibited.

Correct:

MAX\_LOGIN\_ATTEMPTS

Incorrect:

if (attempts \> 5\)

Constants should have meaningful names.

---

# **29.12 Immutability**

Prefer immutable objects.

Examples:

* Value Objects  
* Application Contracts  
* Domain Events  
* Configuration

Mutability should be explicit and controlled.

---

# **29.13 Null Handling**

Avoid returning `null`.

Prefer:

* Optional values  
* Result objects  
* Meaningful exceptions

Null propagation leads to fragile code.

---

# **29.14 Logging**

Logging should:

* Use structured logging  
* Include Correlation IDs  
* Avoid sensitive data  
* Use appropriate log levels

Business decisions must never depend on log output.

---

# **29.15 Asynchronous Code**

Asynchronous operations should:

* Use `async/await`  
* Avoid callback nesting  
* Handle failures explicitly  
* Preserve transaction boundaries

Promises should not be ignored.

---

# **29.16 Imports**

Imports follow the Dependency Rule.

Allowed:

Presentation

↓

Application

↓

Domain

Forbidden:

Domain

↓

Infrastructure

Architectural boundaries must remain visible in imports.

---

# **29.17 TypeScript Standards**

Use:

* `strict` mode  
* Explicit interfaces  
* Strong typing  
* Readonly properties where appropriate  
* Discriminated unions when beneficial

Avoid:

* `any`  
* Type assertions without justification  
* Implicit types in public APIs

Type safety is part of the architecture.

---

# **29.18 Testing Standards**

Every new feature should include:

* Unit tests  
* Appropriate integration tests  
* Edge case coverage  
* Failure scenario coverage

Tests are part of the feature, not an afterthought.

---

# **29.19 Security Standards**

Never:

* Log secrets  
* Hardcode credentials  
* Trust client input  
* Disable validation  
* Bypass authorization

Security requirements apply to every contribution.

---

# **29.20 Code Review Checklist**

Every pull request should verify:

* Clean Architecture compliance  
* Dependency Rule compliance  
* Naming consistency  
* Test coverage  
* Security impact  
* Error handling  
* Logging  
* Documentation updates

Code review protects architectural integrity.

---

# **29.21 Architectural Rules**

The following rules are mandatory:

* Business logic belongs only in the Domain Layer.  
* Every business operation begins with a Use Case.  
* Controllers remain thin.  
* Repositories persist Aggregates only.  
* Infrastructure never defines business rules.  
* Every dependency points inward.  
* Constructors receive dependencies through DI.

---

# **29.22 Common Anti-Patterns**

The following practices are prohibited:

❌ Fat Controllers

❌ Fat Repositories

❌ Generic Service classes (`UserService`, `CommonService`, etc.)

❌ Business logic inside Middleware

❌ Business logic inside Mappers

❌ Infrastructure imports in the Domain Layer

❌ Copy-and-paste code across modules

❌ Circular dependencies

---

# **29.23 Code Quality Tools**

The project should enforce code quality through:

* ESLint  
* Prettier  
* TypeScript Strict Mode  
* Husky (Git hooks)  
* lint-staged  
* Commitlint (recommended)

These tools automate compliance with coding standards.

---

# **29.24 Documentation Standards**

Public APIs, architectural decisions, and complex business rules should be documented.

Documentation should explain:

* Why the decision exists  
* Constraints  
* Trade-offs  
* Expected behavior

Documentation should evolve with the code.

---

# **29.25 Summary**

The Coding Standards establish a common engineering discipline across the KIZUNAFIT backend.

By emphasizing readability, architectural consistency, strong typing, explicit dependencies, and clean business boundaries, these standards help ensure that the codebase remains maintainable, scalable, and understandable as the platform grows and new contributors join the project.

---

# **30\. IMPLEMENTATION ROADMAP**

The Implementation Roadmap defines the recommended order for implementing the KIZUNAFIT backend.

The roadmap follows the dependencies established by Clean Architecture, ensuring that foundational components are completed before higher-level business features are introduced.

Each phase produces a stable foundation for the next.

---

# **30.1 Objectives**

The implementation roadmap aims to:

* Reduce implementation risk  
* Preserve architectural integrity  
* Minimize refactoring  
* Enable continuous testing  
* Support incremental delivery  
* Ensure stable dependencies

Implementation proceeds from the inside out.

---

# **30.2 Implementation Strategy**

The backend is implemented according to Clean Architecture.

Development begins with the innermost layers.

Business Rules

↓

Application

↓

Interface Adapters

↓

Infrastructure

Infrastructure is implemented last because it depends on all inner layers.

---

# **30.3 Phase 1 — Foundation**

Goal:

Establish the project foundation.

Tasks:

* Project structure  
* TypeScript configuration  
* ESLint  
* Prettier  
* Dependency Injection  
* Configuration system  
* Shared Kernel  
* Logging  
* Error hierarchy  
* Base abstractions

Output:

A compilable backend skeleton.

---

# **30.4 Phase 2 — Infrastructure Foundation**

Goal:

Build reusable infrastructure.

Tasks:

* MongoDB connection  
* Redis connection  
* Logger implementation  
* JWT provider  
* Password hasher  
* Cloudinary gateway  
* Email gateway  
* Scheduler foundation  
* Socket.IO server  
* Environment configuration

Output:

Reusable infrastructure components.

---

# **30.5 Phase 3 — Identity Domain**

Goal:

Implement authentication.

Modules:

* User  
* RefreshTokenSession  
* EmailVerification  
* PasswordReset

Features:

* Registration  
* Email verification  
* Login  
* Google Login  
* Refresh token  
* Logout  
* Password reset

Output:

Complete Identity subsystem.

---

# **30.6 Phase 4 — Profile Domain**

Goal:

Implement user profiles.

Modules:

* ClientProfile  
* TrainerProfile

Features:

* Profile creation  
* Avatar upload  
* Trainer verification  
* Profile editing

Output:

Complete profile management.

---

# **30.7 Phase 5 — Marketplace Domain**

Goal:

Enable trainer discovery.

Modules:

* Trainer Marketplace  
* Search  
* Filters  
* Categories

Features:

* Browse trainers  
* Search  
* Trainer details

Output:

Marketplace functionality.

---

# **30.8 Phase 6 — Offer Domain**

Goal:

Implement coaching offers.

Modules:

* CoachingOffer

Features:

* Create offer  
* Accept offer  
* Reject offer  
* Cancel offer

Output:

Offer lifecycle.

---

# **30.9 Phase 7 — Payment Domain**

Goal:

Implement payments.

Modules:

* Payment

Features:

* Razorpay integration  
* Payment verification  
* Refunds  
* Payment history

Output:

Secure payment processing.

---

# **30.10 Phase 8 — Coaching Domain**

Goal:

Implement coaching relationships.

Modules:

* CoachingRelationship

Features:

* Relationship creation  
* Active coaching  
* Expiration  
* Renewal

Output:

Business relationship management.

---

# **30.11 Phase 9 — Consultation Domain**

Goal:

Implement consultation management.

Modules:

* Consultation

Features:

* Scheduling  
* Availability  
* Cancellation  
* Completion

Output:

Consultation lifecycle.

---

# **30.12 Phase 10 — Communication Domain**

Goal:

Implement realtime communication.

Modules:

* Conversation  
* Message

Features:

* Chat  
* Socket.IO  
* Presence  
* Notifications

Output:

Realtime messaging.

---

# **30.13 Phase 11 — WebRTC**

Goal:

Implement video consultations.

Features:

* Signaling  
* Offer  
* Answer  
* ICE exchange  
* Session lifecycle

Output:

Peer-to-peer consultation support.

---

# **30.14 Phase 12 — Workout Domain**

Goal:

Implement workout management.

Modules:

* WorkoutProgram  
* Exercise  
* Assignment

Features:

* Create workouts  
* Assign workouts  
* Track completion

Output:

Workout management.

---

# **30.15 Phase 13 — Nutrition Domain**

Goal:

Implement nutrition planning.

Modules:

* NutritionPlan

Features:

* Create plans  
* Assign plans  
* Nutrition tracking

Output:

Nutrition management.

---

# **30.16 Phase 14 — Progress Domain**

Goal:

Implement client progress.

Modules:

* ProgressLog

Features:

* Progress tracking  
* Measurements  
* Photos  
* Analytics

Output:

Progress monitoring.

---

# **30.17 Phase 15 — Review Domain**

Goal:

Implement review system.

Modules:

* Review

Features:

* Submit reviews  
* Ratings  
* Moderation

Output:

Review management.

---

# **30.18 Phase 16 — Administration Domain**

Goal:

Implement administrative capabilities.

Modules:

* User Management  
* Reports  
* Refunds  
* Platform Configuration

Features:

* Dashboard  
* Moderation  
* Analytics  
* Platform management

Output:

Administrative subsystem.

---

# **30.19 Phase 17 — Production Readiness**

Goal:

Prepare the platform for production.

Tasks:

* Performance optimization  
* Security review  
* Load testing  
* Monitoring  
* Health checks  
* Backup strategy  
* Deployment validation  
* Documentation review

Output:

Production-ready backend.

---

# **30.20 Cross-Phase Activities**

These activities continue throughout every phase:

* Unit testing  
* Integration testing  
* Architecture compliance  
* Security review  
* Documentation updates  
* Code review  
* Refactoring  
* Performance profiling

Quality is continuous.

---

# **30.21 Completion Criteria**

A phase is complete only when:

* All Use Cases implemented  
* Domain tests passing  
* Integration tests passing  
* API documented  
* Security reviewed  
* Logging implemented  
* Architecture rules satisfied  
* Documentation updated

Feature completion alone is insufficient.

---

# **30.22 Dependency Graph**

Implementation dependencies:

Foundation  
      ↓  
Infrastructure  
      ↓  
Identity  
      ↓  
Profile  
      ↓  
Marketplace  
      ↓  
Offer  
      ↓  
Payment  
      ↓  
Coaching  
      ↓  
Consultation  
      ↓  
Communication  
      ↓  
WebRTC  
      ↓  
Workout  
      ↓  
Nutrition  
      ↓  
Progress  
      ↓  
Review  
      ↓  
Administration  
      ↓  
Production Readiness

Each phase builds on stable foundations established by previous phases.

---

# **30.23 Architectural Rules**

The following rules are mandatory throughout implementation:

* Complete inner layers before outer layers.  
* Implement one business capability at a time.  
* Every Use Case has corresponding tests.  
* Infrastructure follows interfaces defined by inner layers.  
* New features must preserve the Dependency Rule.  
* Architecture documents are updated alongside implementation.

---

# **30.24 Success Metrics**

The implementation is considered successful when:

* All architectural layers remain independent.  
* Business rules remain framework-independent.  
* All modules are independently testable.  
* Infrastructure components are replaceable.  
* No architectural rule violations exist.  
* Production deployment is stable.

---

# **30.25 Summary**

The Implementation Roadmap provides a structured, dependency-driven path for building the KIZUNAFIT backend.

By implementing the system from the innermost business rules outward, each phase establishes a stable architectural foundation for the next. This approach minimizes coupling, reduces technical debt, supports incremental delivery, and ensures that the completed platform remains faithful to the principles of Pure Clean Architecture.

---

# **31\. APPENDIX**

The Appendix provides quick-reference material that complements the architectural chapters of the KIZUNAFIT Backend Architecture.

It consolidates frequently used architectural decisions, naming conventions, dependency rules, implementation standards, and reference tables into a single location for day-to-day development.

The Appendix does not introduce new architectural concepts.

It serves as the operational reference for implementing and maintaining the backend.

---

# **31.1 Architecture Decision Records (ADR)**

Major architectural decisions adopted by the project.

| ADR | Decision |
| ----- | ----- |
| ADR-001 | Clean Architecture |
| ADR-002 | Modular Monolith |
| ADR-003 | Domain-Driven Design |
| ADR-004 | Repository Pattern |
| ADR-005 | Dependency Injection |
| ADR-006 | MongoDB as Primary Database |
| ADR-007 | Redis for Caching & Sessions |
| ADR-008 | Socket.IO for Realtime Communication |
| ADR-009 | WebRTC for Video Consultations |
| ADR-010 | Cloudinary for File Storage |
| ADR-011 | JWT \+ Refresh Token Authentication |
| ADR-012 | Event-Driven Domain Events |
| ADR-013 | Feature-Based Package Structure |
| ADR-014 | Ports & Adapters Pattern |
| ADR-015 | Video Consultation WebRTC Architecture |

Future architectural decisions should be documented as additional ADRs.

---

# **31.2 Glossary**

| Term | Meaning |
| ----- | ----- |
| Aggregate | Consistency boundary of business objects |
| Aggregate Root | Entry point to an Aggregate |
| Entity | Object identified by identity |
| Value Object | Immutable object identified by value |
| Domain Event | Completed business fact |
| Use Case | Application business operation |
| Repository | Persistence abstraction |
| Gateway | External service abstraction |
| Port | Interface owned by inner layers |
| Adapter | Infrastructure implementation |
| DTO / Contract | Data crossing architectural boundaries |
| Mapper | Converts objects between layers |
| Policy | Authorization or business decision logic |
| Specification | Reusable business rule |
| Composition Root | Application bootstrap and DI registration |

Terminology should remain consistent across the project.

---

# **31.3 Layer Dependency Matrix**

| Layer | May Depend On |
| ----- | ----- |
| Domain | Shared Kernel |
| Application | Domain, Shared Kernel |
| Interface Adapters | Application, Domain |
| Infrastructure | Application, Domain, Shared Kernel |
| Presentation | Interface Adapters |

Forbidden examples:

Domain → Infrastructure ❌

Application → Express ❌

Domain → MongoDB ❌

Domain → Socket.IO ❌

UseCase → Cloudinary ❌

---

# **31.4 Import Rules**

Allowed:

Presentation  
        ↓  
Application  
        ↓  
Domain

Infrastructure implements interfaces defined by inner layers.

Forbidden:

Domain  
      ↓  
Infrastructure

Every dependency must point inward.

---

# **31.5 Standard Folder Structure**

src/

├── bootstrap/  
├── modules/  
│  
├── shared/  
│  
├── infrastructure/  
│  
├── config/  
│  
└── tests/

Each business module follows:

identity/

├── domain/

├── application/

├── interface-adapters/

└── infrastructure/

Every module follows the same structure.

---

# **31.6 Naming Standards**

| Component | Naming |
| ----- | ----- |
| Aggregate | User |
| Entity | RefreshTokenSession |
| Value Object | Email |
| Use Case | RegisterUserUseCase |
| Repository | UserRepository |
| Repository Implementation | MongoUserRepository |
| Gateway | StorageGateway |
| Gateway Implementation | CloudinaryStorageGateway |
| Controller | RegisterUserController |
| Mapper | UserPersistenceMapper |
| Event | UserRegistered |
| Policy | ConsultationAccessPolicy |
| Specification | ActiveSubscriptionSpecification |
| Exception | UnauthorizedOperationException |

Consistency is mandatory.

---

# **31.7 Exception Catalog**

| Layer | Exception Type |
| ----- | ----- |
| Domain | DomainException |
| Application | ApplicationException |
| Infrastructure | InfrastructureException |
| Presentation | PresentationException |

Examples:

OfferAlreadyAcceptedException

InactiveTrainerException

UnauthorizedOperationException

DatabaseException

StorageException

---

# **31.8 Domain Event Catalog**

| Aggregate | Events |
| ----- | ----- |
| User | UserRegistered, EmailVerified |
| CoachingOffer | OfferCreated, OfferAccepted, OfferRejected |
| CoachingRelationship | CoachingStarted, CoachingEnded |
| Consultation | ConsultationScheduled, ConsultationCompleted, ConsultationCancelled |
| Payment | PaymentCompleted, RefundProcessed |
| WorkoutProgram | WorkoutAssigned, WorkoutPublished |
| NutritionPlan | NutritionPlanAssigned |
| Message | MessageSent |
| Review | ReviewSubmitted |

Future events should follow the same naming conventions.

---

# **31.9 Security Checklist**

Every new feature should verify:

* Authentication required?  
* Authorization required?  
* Input validated?  
* Business rules enforced?  
* Sensitive data protected?  
* Secrets handled securely?  
* Audit logging required?  
* Rate limiting required?  
* Error responses sanitized?  
* Tests added?

Security review is mandatory before production deployment.

---

# **31.10 Feature Implementation Checklist**

Every new business feature should complete the following checklist.

## **Business**

* Business rule identified  
* Use Case documented  
* Domain model updated  
* Aggregate updated  
* Domain Events added (if required)

---

## **Application**

* Request Contract  
* Response Contract  
* Use Case  
* Repository Interface  
* Gateway Interfaces  
* Policies  
* Validators

---

## **Interface Adapters**

* Controller  
* Request Mapper  
* Response Mapper  
* Route  
* Middleware

---

## **Infrastructure**

* Repository Implementation  
* Gateway Implementation  
* Dependency Injection  
* Database Schema  
* External Integrations

---

## **Testing**

* Domain Tests  
* Use Case Tests  
* Integration Tests  
* Adapter Tests

---

## **Documentation**

* API updated  
* Architecture updated  
* ADR updated (if necessary)

---

# **31.11 HTTP Status Code Reference**

| Status | Meaning |
| ----- | ----- |
| 200 | Success |
| 201 | Resource Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Resource Not Found |
| 409 | Conflict |
| 422 | Unprocessable Entity |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

All APIs should return standardized responses.

---

# **31.12 Error Code Catalog**

Standardized application error codes.

| Code | Description |
| ----- | ----- |
| AUTH\_001 | Invalid Credentials |
| AUTH\_002 | Access Token Expired |
| AUTH\_003 | Refresh Token Invalid |
| USER\_001 | User Already Exists |
| USER\_002 | User Not Found |
| PROFILE\_001 | Profile Not Found |
| OFFER\_001 | Offer Already Accepted |
| PAYMENT\_001 | Payment Verification Failed |
| CONSULTATION\_001 | Consultation Already Completed |
| WORKOUT\_001 | Workout Already Published |
| SYSTEM\_001 | Unexpected System Error |

Application-specific error codes improve client integration.

---

# **31.13 Technology Stack Reference**

| Layer | Technology |
| ----- | ----- |
| Language | TypeScript |
| Runtime | Node.js |
| Framework | Express.js |
| Architecture | Clean Architecture |
| Design | Domain-Driven Design |
| Database | MongoDB |
| ODM | Mongoose |
| Cache | Redis |
| Authentication | JWT \+ Refresh Tokens |
| Realtime | Socket.IO |
| Video | WebRTC |
| File Storage | Cloudinary |
| Validation | Zod |
| Dependency Injection | TSyringe |
| Testing | Jest \+ Supertest |
| Logging | Pino |
| API Documentation | OpenAPI / Swagger |

This serves as the project's official technology reference.

---

# **31.14 Module Dependency Overview**

Identity  
        │  
        ▼  
Profiles  
        │  
        ▼  
Marketplace  
        │  
        ▼  
Offers  
        │  
        ▼  
Payments  
        │  
        ▼  
Coaching  
        │  
        ▼  
Consultations  
        │  
        ├───────────────┐  
        ▼               ▼  
Messaging         WebRTC  
        │               │  
        └──────┬────────┘  
               ▼  
Workout  
        ▼  
Nutrition  
        ▼  
Progress  
        ▼  
Reviews  
        ▼  
Administration

This high-level view helps developers understand module relationships without revisiting the Domain Architecture document.

---

# **31.15 Summary**

The Appendix serves as the operational handbook for the KIZUNAFIT backend architecture. It consolidates architectural decisions, dependency rules, naming conventions, event catalogs, exception hierarchies, implementation checklists, and technology references into a single, easy-to-navigate section.

Rather than introducing new concepts, it reinforces the standards established throughout the previous chapters and provides developers with a practical reference during implementation, code reviews, and future maintenance.

---

