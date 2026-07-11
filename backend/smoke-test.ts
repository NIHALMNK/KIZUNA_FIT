import { createContainer } from 'awilix';
import { registerIdentityModule } from './src/modules/identity/module.ts';
import mongoose from 'mongoose';

async function run() {
  console.log('Starting Composition Root Smoke Test...');
  const container = createContainer();
  
  // Register Identity Module
  registerIdentityModule(container);

  // We need to provide a dummy mongoose connection just to not fail if any constructor checks it,
  // but Mongoose models don't need active connection just to be registered in awilix.
  
  const useCases = [
    'registerUserUseCase',
    'loginUseCase',
    'refreshTokenUseCase',
    'verifyEmailUseCase',
    'forgotPasswordUseCase',
    'resetPasswordUseCase',
    'changePasswordUseCase',
    'deleteAccountUseCase'
  ];

  for (const ucName of useCases) {
    try {
      const uc = container.resolve(ucName);
      if (uc) {
        console.log(`[OK] Successfully resolved ${ucName}`);
      } else {
        console.error(`[FAIL] Failed to resolve ${ucName}`);
        process.exit(1);
      }
    } catch (e) {
      console.error(`[FAIL] Exception resolving ${ucName}:`, e);
      process.exit(1);
    }
  }

  console.log('All Use Cases resolved successfully. DAG is clean.');
}

run().catch(console.error);
