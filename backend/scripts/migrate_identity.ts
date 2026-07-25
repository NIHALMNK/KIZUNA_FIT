import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { UserModel } from '../src/modules/identity/infrastructure/persistence/mongoose/models/UserModel';
import { EmailVerificationModel } from '../src/modules/identity/infrastructure/persistence/mongoose/models/EmailVerificationModel';
import { PasswordResetModel } from '../src/modules/identity/infrastructure/persistence/mongoose/models/PasswordResetModel';
import { RefreshTokenSessionModel } from '../src/modules/identity/infrastructure/persistence/mongoose/models/RefreshTokenSessionModel';
import { env } from '../src/config/env.config';

// dotenv is already called or not needed if we rely on the environment which is running with tsx


async function migrate() {
  const uri = env.MONGODB_URI;
  console.log(`Connecting to MongoDB at ${uri}...`);
  await mongoose.connect(uri);
  console.log('Connected.');

  console.log('Unsetting failedLoginAttempts from users...');
  const unsetRes = await UserModel.updateMany({}, { $unset: { failedLoginAttempts: "" } });
  console.log(`Unset failedLoginAttempts for ${unsetRes.modifiedCount} users.`);

  console.log('Converting PENDING_VERIFICATION users to ACTIVE...');
  const pendingRes = await UserModel.updateMany(
    { status: 'PENDING_VERIFICATION' },
    { $set: { status: 'ACTIVE' } }
  );
  console.log(`Converted ${pendingRes.modifiedCount} PENDING_VERIFICATION users.`);

  console.log('Converting LOCKED users to SUSPENDED...');
  const lockedRes = await UserModel.updateMany(
    { status: 'LOCKED' },
    { $set: { status: 'SUSPENDED' } }
  );
  console.log(`Converted ${lockedRes.modifiedCount} LOCKED users.`);

  console.log('Syncing indexes for UserModel...');
  await UserModel.syncIndexes();

  console.log('Syncing indexes for EmailVerificationModel...');
  await EmailVerificationModel.syncIndexes();

  console.log('Syncing indexes for PasswordResetModel...');
  await PasswordResetModel.syncIndexes();

  console.log('Syncing indexes for RefreshTokenSessionModel...');
  await RefreshTokenSessionModel.syncIndexes();

  console.log('Migration complete.');
  await mongoose.disconnect();
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
