export interface LoginCommand {
  email: string;
  plaintextPassword?: string;
  deviceId: string;
  ipAddress: string;
}
