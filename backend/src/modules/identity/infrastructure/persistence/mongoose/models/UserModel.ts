import mongoose, { Schema } from 'mongoose';
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

export interface UserDocument {
  _id: string; // UUID
  email: string;
  status: UserStatus;
  passwordHash?: string;
  emailVerification?: EmailVerificationSubDoc;
  passwordReset?: PasswordResetSubDoc;
  failedLoginAttempts: number;
  externalIdentities?: {
    provider: string;
    providerUserId: string;
  }[];
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
  externalIdentities: [{
    provider: { type: String, required: true },
    providerUserId: { type: String, required: true }
  }]
}, {
  _id: false, // Prevents auto-generation of ObjectId, we provide our own string UUID
  timestamps: true,
  versionKey: '__v'
});

UserSchema.index(
  { 'externalIdentities.provider': 1, 'externalIdentities.providerUserId': 1 },
  { unique: true, sparse: true }
);

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);
