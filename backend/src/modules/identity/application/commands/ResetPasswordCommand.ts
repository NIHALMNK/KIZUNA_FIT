export interface ResetPasswordCommand {
  email: string;
  token: string;
  newPlaintextPassword?: string;
}
