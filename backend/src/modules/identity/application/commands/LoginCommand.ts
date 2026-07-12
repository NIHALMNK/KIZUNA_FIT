export interface LoginCommand {
  email: string;
  plaintextPassword?: string;
  deviceInfo: {
    browser?: string;
    browserVersion?: string;
    operatingSystem?: string;
    platform?: string;
    deviceName?: string;
    userAgent: string;
  };
  ipAddress?: string;
}
