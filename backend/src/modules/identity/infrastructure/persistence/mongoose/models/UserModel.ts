import mongoose, { Schema, Document } from 'mongoose';
import { UserStatus } from '../../../../domain/entities/UserStatus';

export interface EmailVerificationSubDoc {
  token: string;
  expiresAt: Date;
  verifiedAt?: Date;
}

export interface PasswordResetSubDoc {
  token: string;
  expiresAt: Date;
  usedAt?: Date;
}

export interface UserDocument extends Document {
  _id: string; // UUID
  email: string;
  status: UserStatus;
  passwordHash?: string;
  emailVerification?: EmailVerificationSubDoc;
  passwordReset?: PasswordResetSubDoc;
  failedLoginAttempts: number;
  createdAt: Date;
  updatedAt: Date;
}

const EmailVerificationSchema = new Schema<EmailVerificationSubDoc>({
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  verifiedAt: { type: Date, required: false }
}, { _id: false });

const PasswordResetSchema = new Schema<PasswordResetSubDoc>({
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  usedAt: { type: Date, required: false }
}, { _id: false });

export const UserSchema = new Schema<UserDocument>({
  _id: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  status: { type: String, required: true, enum: Object.values(UserStatus) },
  passwordHash: { type: String, required: false },
  emailVerification: { type: EmailVerificationSchema, required: false },
  passwordReset: { type: PasswordResetSchema, required: false },
  failedLoginAttempts: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true }
}, {
  _id: false, // Prevents auto-generation of ObjectId, we provide our own string UUID
  timestamps: false, // Manually mapped from Domain
  versionKey: '__v'
});

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);
