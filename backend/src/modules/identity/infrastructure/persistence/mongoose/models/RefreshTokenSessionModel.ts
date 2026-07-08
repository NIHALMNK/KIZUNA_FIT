import mongoose, { Schema } from 'mongoose';

export interface RefreshTokenSessionDocument {
  _id: string; // UUID
  userId: string;
  tokenId: string;
  family: string;
  deviceId: string;
  ipAddress: string;
  expiresAt: Date;
  isRevoked: boolean;
  createdAt: Date;
}

export const RefreshTokenSessionSchema = new Schema<RefreshTokenSessionDocument>({
  _id: { type: String, required: true },
  userId: { type: String, required: true, index: true },
  tokenId: { type: String, required: true, index: true },
  family: { type: String, required: true, index: true },
  deviceId: { type: String, required: true },
  ipAddress: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expires: '0s' } }, // TTL index for automatic deletion
  isRevoked: { type: Boolean, required: true },
  createdAt: { type: Date, required: true }
}, {
  _id: false,
  timestamps: false,
  versionKey: '__v'
});

export const RefreshTokenSessionModel = mongoose.model<RefreshTokenSessionDocument>('RefreshTokenSession', RefreshTokenSessionSchema);
