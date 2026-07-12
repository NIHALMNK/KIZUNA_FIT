export interface SessionModel {
  id: string;
  deviceInfo: {
    browser?: string;
    operatingSystem?: string;
    platform?: string;
    deviceName?: string;
    userAgent: string;
  };
  ipAddress?: string;
  expiresAt: Date;
  lastUsedAt: Date;
}

export interface SessionListResult {
  sessions: SessionModel[];
}
