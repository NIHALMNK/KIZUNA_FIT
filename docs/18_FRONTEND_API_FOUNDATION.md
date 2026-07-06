# 18. FRONTEND API FOUNDATION

## 1. HTTP Flow

The Frontend API Foundation is built on top of `axios`. It provides a centralized `HttpClient` that ensures every request made by the frontend complies with the system's security, error handling, and latency requirements.

```mermaid
sequenceDiagram
    participant Component
    participant Repository
    participant HttpClient
    participant Interceptors
    participant Server

    Component->>Repository: requestData()
    Repository->>HttpClient: get('/endpoint')
    HttpClient->>Interceptors: Request Interceptor
    Interceptors->>Interceptors: Attach Bearer Token
    Interceptors->>Server: HTTP GET
    
    alt Success
        Server-->>Interceptors: 200 OK
        Interceptors-->>HttpClient: AxiosResponse
        HttpClient-->>Repository: DTO Payload
        Repository-->>Repository: mapToEntity(DTO)
        Repository-->>Component: Domain Entity
    else Failure
        Server-->>Interceptors: 4xx / 5xx
        Interceptors->>HttpClient: Error Normalization
        HttpClient-->>Repository: throw ApiError / NetworkError
        Repository-->>Component: throw Exception
    end
```

## 2. Repository Flow & DTO Mapping

Business components must **never** make raw HTTP requests. They must consume Repositories.
The `BaseRepository` abstract class enforces the translation between Backend Data Transfer Objects (DTOs) and Frontend Domain Entities.

This ensures that if the API contract changes, only the Repository's `mapToEntity` function needs updating, not the React components.

## 3. Error Flow (Error Normalization)

Raw Axios errors are dangerous and inconsistent. The `HttpClient` intercepts all rejected promises and normalizes them into specific Domain Exceptions:
- `ApiError`: Contains `status`, `code`, and backend `message`.
- `NetworkError`: Thrown when no response is received.
- `TimeoutError`: Thrown when the 10,000ms limit is breached.

## 4. API Architecture Diagram

```mermaid
graph TD
    UI[React Component]
    Hook[Custom Hook / React Query]
    Repo[Business Repository]
    BaseRepo[BaseRepository Abstraction]
    HTTP[HttpClient Singleton]
    Storage[TokenStorage]
    API[Backend API]

    UI --> Hook
    Hook --> Repo
    Repo --> BaseRepo
    BaseRepo --> HTTP
    HTTP --> Storage
    HTTP --> API

    style UI fill:#2196f3,stroke:#1976d2,color:white
    style Repo fill:#4caf50,stroke:#388e3c,color:white
    style HTTP fill:#ff9800,stroke:#f57c00,color:white
    style Storage fill:#9c27b0,stroke:#7b1fa2,color:white
```

## 5. Token Storage Abstraction

The `TokenStorage` interface isolates the authentication token mechanisms from the HTTP client. By default, it uses `BrowserTokenStorage` (localStorage), but this abstraction allows swapping to Secure Cookies seamlessly if architectural requirements change.
