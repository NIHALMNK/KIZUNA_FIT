import mongoose, { Schema, Document } from 'mongoose';

export interface PasswordResetDocument extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  resetTokenHash: string;
  expiresAt: Date;
  usedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const PasswordResetSchema = new Schema<PasswordResetDocument>({
  userId: { type: Schema.Types.ObjectId, required: true, index: true },
  resetTokenHash: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true, index: { expires: '0s' } }, // TTL index
  usedAt: { type: Date, required: false }
}, {
  timestamps: true,
  versionKey: '__v'
});

PasswordResetSchema.index({ userId: 1, createdAt: -1 });
PasswordResetSchema.index({ userId: 1, expiresAt: 1 });

export const PasswordResetModel = mongoose.model<PasswordResetDocument>('PasswordReset', PasswordResetSchema);
