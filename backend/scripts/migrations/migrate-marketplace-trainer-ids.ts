import mongoose, { Types } from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { AcquisitionPipelineModel } from '../../src/modules/marketplace/infrastructure/persistence/mongoose/schemas/acquisition-pipeline.schema';
import { TrainerProfileModel } from '../../src/modules/profile/infrastructure/persistence/mongoose/models/TrainerProfileModel';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kizunafit';

async function migrateMarketplaceTrainerIds() {
  console.log('=== MARKETPLACE TRAINER ID MIGRATION SCRIPT ===');
  console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);

  await mongoose.connect(MONGODB_URI);

  const pipelines = await AcquisitionPipelineModel.find({}).exec();

  let totalInspected = 0;
  let totalCorrected = 0;
  let totalAlreadyCorrect = 0;
  let totalUnresolved = 0;

  console.log(`Found ${pipelines.length} acquisition pipeline records to inspect.\n`);

  for (const pipeline of pipelines) {
    totalInspected++;
    const pipelineId = pipeline._id.toString();
    const currentTrainerId = pipeline.trainerId.toString();

    console.log(`[Record ${totalInspected}] Pipeline ID: ${pipelineId}`);
    console.log(`  Current trainerId: ${currentTrainerId}`);

    // 1. Check if currentTrainerId matches a TrainerProfile by _id
    let profileById = null;
    if (Types.ObjectId.isValid(currentTrainerId)) {
      profileById = await TrainerProfileModel.findById(currentTrainerId).exec();
    }

    if (profileById && profileById.userId) {
      const canonicalUserId = profileById.userId.toString();
      console.log(`  -> MATCH FOUND! trainerId matches TrainerProfile._id (${currentTrainerId}).`);
      console.log(`  -> Canonical User._id: ${canonicalUserId}`);

      if (currentTrainerId !== canonicalUserId) {
        await AcquisitionPipelineModel.updateOne(
          { _id: pipeline._id },
          { $set: { trainerId: new Types.ObjectId(canonicalUserId) } },
        );
        console.log(`  -> SUCCESS: Updated pipeline.trainerId to ${canonicalUserId}`);
        totalCorrected++;
      } else {
        console.log(`  -> ALREADY CORRECT: trainerId is already the canonical User._id.`);
        totalAlreadyCorrect++;
      }
      continue;
    }

    // 2. Check if currentTrainerId matches a TrainerProfile by userId
    let profileByUserId = null;
    if (Types.ObjectId.isValid(currentTrainerId)) {
      profileByUserId = await TrainerProfileModel.findOne({
        userId: new Types.ObjectId(currentTrainerId),
      }).exec();
    } else {
      profileByUserId = await TrainerProfileModel.findOne({
        userId: currentTrainerId,
      }).exec();
    }

    if (profileByUserId) {
      console.log(
        `  -> ALREADY CORRECT: trainerId (${currentTrainerId}) matches TrainerProfile.userId.`,
      );
      totalAlreadyCorrect++;
    } else {
      console.log(
        `  -> UNRESOLVED: trainerId (${currentTrainerId}) does not match any TrainerProfile._id or userId.`,
      );
      totalUnresolved++;
    }
  }

  console.log('\n=============================================');
  console.log('MIGRATION SUMMARY');
  console.log('=============================================');
  console.log(`Total Records Inspected:  ${totalInspected}`);
  console.log(`Total Records Corrected:  ${totalCorrected}`);
  console.log(`Total Already Correct:   ${totalAlreadyCorrect}`);
  console.log(`Total Unresolved:        ${totalUnresolved}`);
  console.log('=============================================\n');

  await mongoose.disconnect();
  console.log('Database disconnected. Migration complete.');
}

migrateMarketplaceTrainerIds().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
