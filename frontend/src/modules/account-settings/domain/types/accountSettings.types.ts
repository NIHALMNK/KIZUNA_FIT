export interface UserAccountDetails {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string | null;
  role: 'CLIENT' | 'TRAINER' | 'ADMIN';
  emailVerified: boolean;
  accountStatus: 'ACTIVE' | 'SUSPENDED' | 'BANNED' | 'PENDING';
  createdAt: string;
  updatedAt?: string;
}

export interface UpdateAccountDTO {
  fullName?: string;
  phoneNumber?: string;
}

export interface UserSession {
  sessionId: string;
  deviceName?: string;
  deviceType?: 'desktop' | 'mobile' | 'tablet';
  browser?: string;
  operatingSystem?: string;
  ipAddress?: string;
  location?: string;
  currentSession: boolean;
  lastActiveAt: string;
  createdAt?: string;
}

export interface DeleteAccountDTO {
  password?: string;
}

export interface AuthProviderStatus {
  provider: 'LOCAL' | 'GOOGLE' | string;
  linked: boolean;
  canUnlink: boolean;
}
