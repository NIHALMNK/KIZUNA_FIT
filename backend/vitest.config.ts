import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/integration/setup.ts'],
    include: ['tests/**/*.{test,spec}.ts'],
    env: {
      NODE_ENV: 'test',
      JWT_ACCESS_SECRET: 'this_is_a_very_secure_test_secret_32_chars',
      JWT_REFRESH_SECRET: 'this_is_a_very_secure_test_secret_32_chars',
      JWT_SECRET: 'this_is_a_very_secure_test_secret_32_chars',
      PORT: '3000',
      MONGODB_URI: 'mongodb://localhost:27017/test', // Overridden in setup.ts
      REDIS_URL: 'redis://localhost:6379',
      FRONTEND_URL: 'http://localhost:3000',
      BACKEND_URL: 'http://localhost:3000',
      CORS_ORIGIN: 'http://localhost:3000'
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        'tests/**',
        '**/*.d.ts',
        '**/*.config.ts'
      ]
    }
  }
});
