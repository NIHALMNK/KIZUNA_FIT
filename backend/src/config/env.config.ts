import { z } from 'zod';
import path from 'node:path';
import dotenv from 'dotenv';

// Use find-up or simple heuristic. process.cwd() might be root or backend dir depending on how it's launched.
const envPath = process.cwd().endsWith('backend') 
  ? path.resolve(process.cwd(), '../.env')
  : path.resolve(process.cwd(), '.env');

dotenv.config({ path: envPath });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  API_PREFIX: z.string().default('/api/v1'),
  MONGODB_URI: z.string().url(),
  REDIS_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  EMAIL_PROVIDER: z.string().default('smtp'),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  BULLMQ_PREFIX: z.string().default('kizunafit_queue'),
  SOCKET_PORT: z.string().transform(Number).default('3001'),
  FRONTEND_URL: z.string().url(),
  BACKEND_URL: z.string().url(),
  CORS_ORIGIN: z.string().url(),
  LOG_LEVEL: z.string().default('debug'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
