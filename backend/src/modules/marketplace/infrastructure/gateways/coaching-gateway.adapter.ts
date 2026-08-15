import { connection, Types } from 'mongoose';
import { CoachingGateway } from '../../application/ports/coaching-gateway.port';

export class CoachingGatewayAdapter implements CoachingGateway {
  public async hasActiveRelationship(clientId: string, trainerId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(clientId) || !Types.ObjectId.isValid(trainerId)) {
      return false;
    }

    try {
      const db = connection.db;
      if (!db) {
        return false;
      }

      const activeRelationship = await db.collection('coachingRelationships').findOne({
        clientId: new Types.ObjectId(clientId),
        trainerId: new Types.ObjectId(trainerId),
        status: { $in: ['ACTIVE', 'PAUSED'] },
      });

      return activeRelationship !== null;
    } catch (_err: unknown) {
      return false;
    }
  }
}
