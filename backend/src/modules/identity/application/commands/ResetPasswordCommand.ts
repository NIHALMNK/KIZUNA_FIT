export interface ResetPasswordCommand {
  token: string;
  newPlaintextPassword?: string;
}
