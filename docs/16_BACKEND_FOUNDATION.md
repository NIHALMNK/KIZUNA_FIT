# 16. BACKEND FOUNDATION

## 1. Folder Structure

```text
backend/
├── src/
│   ├── bootstrap/
│   │   ├── dependency-injection/
│   │   ├── middleware/
│   │   └── startup/
│   ├── config/
│   ├── infrastructure/
│   │   ├── cache/
│   │   ├── database/
│   │   ├── logger/
│   │   ├── mail/
│   │   ├── queue/
│   │   ├── storage/
│   │   └── websocket/
│   ├── modules/ (Business Logic)
│   ├── shared/
│   │   ├── contracts/
│   │   ├── core/
│   │   ├── exceptions/
│   │   ├── result/
│   │   └── value-objects/
│   ├── app.ts (Express App)
│   └── server.ts (Entry Point)
```

## 2. Backend Bootstrap Lifecycle

```mermaid
sequenceDiagram
    participant server.ts
    participant DI as Dependency Injection
    participant Config as Environment Config
    participant DB as MongoDB / Redis
    participant App as Express App

    server.ts->>Config: Validate Environment (Zod)
    server.ts->>DI: configureContainer()
    DI-->>server.ts: container instance
    server.ts->>DI: resolve('logger', 'dbManager')
    server.ts->>DB: dbManager.connect()
    server.ts->>App: createApp()
    App-->>server.ts: Express instance
    server.ts->>App: use(globalErrorHandler)
    server.ts->>server.ts: server.listen(PORT)
```

## 3. HTTP Request Lifecycle

```mermaid
sequenceDiagram
    participant Client
    participant Express as Global Middleware
    participant Router as Presentation (Controller)
    participant UC as Application (UseCase)
    participant Domain as Domain (Entities)
    participant Infra as Infrastructure (DB)

    Client->>Express: HTTP Request
    Express->>Router: Route Request
    Router->>UC: Execute DTO
    UC->>Domain: Apply Business Rules
    Domain-->>UC: Domain Events / State
    UC->>Infra: Save State
    Infra-->>UC: Success
    UC-->>Router: Result/DTO
    Router-->>Client: HTTP Response
```

## 4. Dependency Injection Graph

```mermaid
graph TD
    Container[Awilix Container]
    
    Container --> ILogger
    Container --> IStorageProvider
    Container --> DatabaseManager
    Container --> RedisManager
    Container --> BackgroundJobManager
    Container --> SocketIOManager
    
    ILogger --> WinstonLogger[WinstonLogger]
    IStorageProvider --> Cloudinary[CloudinaryProvider]
```

## 5. Clean Architecture Dependency Flow

```mermaid
graph TD
    Presentation --> Application
    Application --> Domain
    Infrastructure --> Application
    Infrastructure --> Domain
    
    style Domain fill:#4caf50,stroke:#388e3c,stroke-width:2px,color:white
    style Application fill:#2196f3,stroke:#1976d2,stroke-width:2px,color:white
    style Presentation fill:#ff9800,stroke:#f57c00,stroke-width:2px,color:white
    style Infrastructure fill:#9c27b0,stroke:#7b1fa2,stroke-width:2px,color:white
```

## 6. Infrastructure Component Diagram

```mermaid
graph TD
    App[KizunaFit API]
    
    App --> Mongo[(MongoDB)]
    App --> Redis[(Redis)]
    
    Redis --> BullMQ[Background Jobs]
    Redis --> Socket[Socket.IO Pub/Sub]
    
    App --> Cloudinary[Cloudinary CDN]
    App --> Email[Email Provider]
```

## 7. Shared Kernel Diagram

```mermaid
classDiagram
    class Entity {
        +String id
        +props T
        +equals(Entity) boolean
    }
    class AggregateRoot {
        -domainEvents[]
        +addDomainEvent()
        +clearEvents()
    }
    class ValueObject {
        +props T
        +equals(ValueObject) boolean
    }
    class Result {
        +isSuccess boolean
        +error string
        +getValue() T
        +ok() Result
        +fail() Result
    }
    
    Entity <|-- AggregateRoot
```

## 8. Startup Sequence & Graceful Shutdown

* **Startup:** Validates config -> Wires dependencies -> Connects to databases -> Attaches Express middleware -> Listens on port.
* **Shutdown (SIGINT/SIGTERM):** Stops accepting requests -> Completes active requests -> Disconnects MongoDB -> Disconnects Redis -> Closes BullMQ connections -> Exits process (0).

## Environment Variables

* `NODE_ENV`: development | production | test
* `PORT`: Server port
* `MONGODB_URI`: MongoDB connection string
* `REDIS_URL`: Redis connection string
* `JWT_SECRET`: Secret for signing tokens
* `CLOUDINARY_URL`: Cloudinary API keys
