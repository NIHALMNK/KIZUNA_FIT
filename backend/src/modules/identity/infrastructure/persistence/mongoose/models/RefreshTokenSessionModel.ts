import mongoose, { Schema, Document } from 'mongoose';

export interface DeviceInfoSubDoc {
  browser?: string;
  browserVersion?: string;
  operatingSystem?: string;
  platform?: string;
  deviceName?: string;
  userAgent: string;
}

export interface RefreshTokenSessionDocument extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  refreshTokenHash: string;
  deviceInfo: DeviceInfoSubDoc;
  ipAddress?: string;
  expiresAt: Date;
  lastUsedAt: Date;
  revokedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DeviceInfoSchema = new Schema<DeviceInfoSubDoc>({
  browser: { type: String, required: false },
  browserVersion: { type: String, required: false },
  operatingSystem: { type: String, required: false },
  platform: { type: String, required: false },
  deviceName: { type: String, required: false },
  userAgent: { type: String, required: true }
}, { _id: false });

export const RefreshTokenSessionSchema = new Schema<RefreshTokenSessionDocument>({
  userId: { type: Schema.Types.ObjectId, required: true, index: true },
  refreshTokenHash: { type: String, required: true, unique: true },
  deviceInfo: { type: DeviceInfoSchema, required: true },
  ipAddress: { type: String, required: false },
  expiresAt: { type: Date, required: true, index: { expires: '0s' } }, // TTL index
  lastUsedAt: { type: Date, required: true },
  revokedAt: { type: Date, required: false }
}, {
  timestamps: true,
  versionKey: '__v'
});

RefreshTokenSessionSchema.index({ userId: 1, lastUsedAt: -1 });
RefreshTokenSessionSchema.index({ userId: 1, createdAt: -1 });

export const RefreshTokenSessionModel = mongoose.model<RefreshTokenSessionDocument>('RefreshTokenSession', RefreshTokenSessionSchema);
