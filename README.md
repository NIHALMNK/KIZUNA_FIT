# KIZUNAFIT V1

A modern, production-ready MERN application with Clean Architecture.

## Project Structure

The project strictly separates the backend and frontend into independent directories with no shared configuration files.

```text
KIZUNAFIT/
├── backend/
│   ├── .env               # Backend-only secrets (ignored by Git)
│   ├── .env.example       # Backend environment template
│   └── src/               # Clean Architecture modules
├── frontend/
│   ├── .env.local         # Frontend-only variables (ignored by Git)
│   ├── .env.example       # Frontend environment template
│   └── src/               # Next.js frontend code
└── README.md
```

## Environment Setup

The backend and frontend environments are completely decoupled.

1. **Backend Environment**
   - Copy `backend/.env.example` to `backend/.env`
   - Fill in all the required secrets (see below)

2. **Frontend Environment**
   - Copy `frontend/.env.example` to `frontend/.env.local`
   - Fill in the required `NEXT_PUBLIC_` variables

**Configuration Rule**: The backend configuration follows a Single Source of Truth. Only `backend/src/config/env.config.ts` may read `process.env`. Every other layer must import the validated configuration object via `import { env } from "@/config/env.config";`.

## Required Environment Variables

### Backend (`backend/.env`)

- `NODE_ENV`: e.g. `development`
- `MONGODB_URI`: Your MongoDB connection string
- `REDIS_URL`: Your Redis connection URL
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`: Secure random strings (min 16 chars)
- `GOOGLE_CLIENT_ID`: Your exact Google OAuth Client ID (REQUIRED)
- `EMAIL_PROVIDER`: e.g. `smtp`
- (Various other configuration parameters defined in `.env.example`)

### Frontend (`frontend/.env.local`)

- `NEXT_PUBLIC_API_URL`: The URL of the backend API (e.g. `http://localhost:5000/api/v1`)
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID (must match backend)

## Google OAuth Setup

1. Create a project in the Google Cloud Console.
2. Configure the OAuth consent screen.
3. Create Web application credentials.
4. Add your frontend URL (e.g., `http://localhost:3100`) to the Authorized JavaScript origins.
5. Copy the generated Client ID and paste it into both `backend/.env` (as `GOOGLE_CLIENT_ID`) and `frontend/.env.local` (as `NEXT_PUBLIC_GOOGLE_CLIENT_ID`).

## Startup

### Backend Startup

```bash
cd backend
npm install
npm run dev
```

### Frontend Startup

```bash
cd frontend
npm install
npm run dev
```

(Alternatively, from the project root you can use workspace commands like `npm run dev -w backend` and `npm run dev -w frontend`).
