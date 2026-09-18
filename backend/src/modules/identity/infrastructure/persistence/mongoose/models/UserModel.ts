import mongoose, { Schema, Document } from 'mongoose';
import { UserStatus } from '../../../../domain/entities/UserStatus';
import { UserRole } from '../../../../domain/value-objects/UserRole';
import { AuthProvider } from '../../../../domain/value-objects/AuthProvider';

export interface UserDocument extends Document {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  authProviders: AuthProvider[];
  passwordHash?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  phoneNumber?: string | null;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = new Schema<UserDocument>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    authProviders: [{ type: String, enum: Object.values(AuthProvider), required: true }],
    passwordHash: { type: String, required: false },
    role: { type: String, required: true, enum: Object.values(UserRole) },
    status: { type: String, required: true, enum: Object.values(UserStatus) },
    emailVerified: { type: Boolean, required: true, default: false },
    phoneNumber: { type: String, default: null },
    lastLoginAt: { type: Date, required: false },
  },
  {
    timestamps: true,
    versionKey: '__v',
  },
);

// Compound Indexes as specified in Canonical Specification
UserSchema.index({ role: 1, status: 1 });
UserSchema.index({ status: 1, emailVerified: 1 });

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);
