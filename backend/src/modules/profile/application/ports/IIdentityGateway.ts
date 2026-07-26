export interface UserAccountInfo {
  userId: string;
  role: string;
  status: string;
  emailVerified: boolean;
}

export interface IIdentityGateway {
  getUserAccountInfo(userId: string): Promise<UserAccountInfo | null>;
  userExists(userId: string): Promise<boolean>;
}
