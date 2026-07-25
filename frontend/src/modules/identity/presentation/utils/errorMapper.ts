import { ApiError } from '../../../../shared/exceptions/ApiError';

export const ERROR_MESSAGES: Record<string, string> = {
  EMAIL_ALREADY_EXISTS: "An account with this email already exists.",
  INVALID_CREDENTIALS: "Incorrect email or password.",
  EMAIL_NOT_VERIFIED: "Please verify your email before signing in.",
  ACCOUNT_DISABLED: "Your account has been disabled.",
  ACCOUNT_BANNED: "Your account has been banned.",
  GOOGLE_ACCOUNT_NOT_LINKED: "Please sign in with your password first, then link your Google account.",
  GOOGLE_ACCOUNT_NOT_FOUND: "No account associated with this Google login.",
  INVALID_TOKEN: "The token provided is invalid or has expired.",
  TOKEN_EXPIRED: "The token provided is invalid or has expired.",
  INVALID_RESET_TOKEN: "This password reset link is invalid or has expired.",
  RESET_TOKEN_EXPIRED: "This password reset link has expired. Please request a new one.",
  RESET_TOKEN_ALREADY_USED: "This password reset link has already been used.",
  PASSWORD_MATCHES_CURRENT: "The new password cannot be the same as your current password.",
  USER_NOT_FOUND: "No account was found associated with this request.",
  NETWORK_ERROR: "Unable to communicate with the server. Please try again later.",
  TIMEOUT: "Unable to communicate with the server. Please try again later.",
};

export const getFriendlyMessage = (error: unknown, defaultMessage = "An unexpected error occurred."): string => {
  if (error instanceof ApiError) {
    if (error.code && ERROR_MESSAGES[error.code]) {
      return ERROR_MESSAGES[error.code];
    }
    return error.message || defaultMessage;
  }
  
  if (error instanceof Error) {
    return error.message;
  }

  return defaultMessage;
};

export const handleValidationErrors = (error: unknown, setError: any) => {
  if (error instanceof ApiError && error.code === 'VALIDATION_ERROR' && Array.isArray(error.details)) {
    error.details.forEach((detail: { path: string, message: string }) => {
      // The Zod paths from backend usually match the fields, but handle nesting if any
      const field = detail.path.split('.').pop();
      if (field) {
        setError(field, {
          type: 'server',
          message: detail.message,
        });
      }
    });
    return true;
  }
  return false;
};
