import mongoose, { Schema, Document } from 'mongoose';

export interface EmailVerificationDocument extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  email: string;
  verificationTokenHash: string;
  expiresAt: Date;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const EmailVerificationSchema = new Schema<EmailVerificationDocument>({
  userId: { type: Schema.Types.ObjectId, required: true, index: true },
  email: { type: String, required: true },
  verificationTokenHash: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true, index: { expires: '0s' } }, // TTL index
  verifiedAt: { type: Date, required: false }
}, {
  timestamps: true,
  versionKey: '__v'
});

EmailVerificationSchema.index({ userId: 1, email: 1 });
EmailVerificationSchema.index({ userId: 1, createdAt: -1 });

export const EmailVerificationModel = mongoose.model<EmailVerificationDocument>('EmailVerification', EmailVerificationSchema);
