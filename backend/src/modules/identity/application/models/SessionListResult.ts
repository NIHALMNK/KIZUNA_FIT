export interface SessionModel {
  id: string;
  deviceId: string;
  ipAddress: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface SessionListResult {
  sessions: SessionModel[];
}
