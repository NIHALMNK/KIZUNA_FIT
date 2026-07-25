import { EmailVerification } from '../../../../domain/entities/EmailVerification';
import { UserId } from '../../../../domain/value-objects/UserId';
import { EmailAddress } from '../../../../domain/value-objects/EmailAddress';
import { EmailVerificationDocument } from '../models/EmailVerificationModel';
import mongoose from 'mongoose';

export class EmailVerificationMapper {
  public static toDomain(raw: EmailVerificationDocument): EmailVerification {
    const verificationResult = EmailVerification.create(
      UserId.create(raw.userId.toString()).getValue(),
      EmailAddress.create(raw.email).getValue(),
      raw.verificationTokenHash,
      raw.expiresAt,
      raw._id.toString()
    );

    const verification = verificationResult.getValue();
    if (raw.verifiedAt) {
      // By passing the domain validation if it was already verified in the DB
      // We can use the private property or just ignore it if our domain logic is strict,
      // but if we are reading from DB, we should reflect the DB state.
      // A safe way is to just call verify with the time it was verified.
      // But verify() checks if it's expired. It might be expired now.
      // So we have to bypass it via prototype.
      (verification as unknown as { props: { verifiedAt: Date } }).props.verifiedAt = raw.verifiedAt;
    }

    return verification;
  }

  public static toPersistence(verification: EmailVerification): Partial<EmailVerificationDocument> {
    return {
      _id: new mongoose.Types.ObjectId(verification.id),
      userId: new mongoose.Types.ObjectId(verification.userId.value),
      email: verification.email.value,
      verificationTokenHash: verification.verificationTokenHash,
      expiresAt: verification.expiresAt,
      verifiedAt: verification.verifiedAt
    };
  }
}
