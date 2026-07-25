import { PasswordReset } from '../../../../domain/entities/PasswordReset';
import { UserId } from '../../../../domain/value-objects/UserId';
import { PasswordResetDocument } from '../models/PasswordResetModel';
import mongoose from 'mongoose';

export class PasswordResetMapper {
  public static toDomain(raw: PasswordResetDocument): PasswordReset {
    const resetResult = PasswordReset.create(
      UserId.create(raw.userId.toString()).getValue(),
      raw.resetTokenHash,
      raw.expiresAt,
      raw._id.toString()
    );

    const reset = resetResult.getValue();
    if (raw.usedAt) {
      (reset as unknown as { props: { usedAt: Date } }).props.usedAt = raw.usedAt;
    }

    return reset;
  }

  public static toPersistence(reset: PasswordReset): Partial<PasswordResetDocument> {
    return {
      _id: new mongoose.Types.ObjectId(reset.id),
      userId: new mongoose.Types.ObjectId(reset.userId.value),
      resetTokenHash: reset.resetTokenHash,
      expiresAt: reset.expiresAt,
      usedAt: reset.usedAt
    };
  }
}
