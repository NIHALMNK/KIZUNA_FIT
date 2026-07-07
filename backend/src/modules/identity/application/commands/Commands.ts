export interface LogoutCommand {
  userId: string;
  refreshTokenId: string;
}

export interface LogoutAllCommand {
  userId: string;
}

export interface ChangePasswordCommand {
  userId: string;
  currentPlaintextPassword?: string;
  newPlaintextPassword?: string;
}

export interface DeleteAccountCommand {
  userId: string;
  confirmationPassword?: string;
}
