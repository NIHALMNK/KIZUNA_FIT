import { ApiError } from '../exceptions/ApiError';

export interface UserFriendlyError {
  title: string;
  message: string;
  isNotFound: boolean;
  isForbidden: boolean;
}

export function mapApiError(error: unknown): UserFriendlyError {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      return {
        title: 'Session Expired',
        message: 'Your session has expired. Please log in again to continue.',
        isNotFound: false,
        isForbidden: false,
      };
    }

    if (error.status === 403) {
      return {
        title: 'Access Denied',
        message: 'You do not have permission to view or perform this action.',
        isNotFound: false,
        isForbidden: true,
      };
    }

    if (error.status === 404) {
      return {
        title: 'Resource Not Found',
        message: 'The requested resource could not be found.',
        isNotFound: true,
        isForbidden: false,
      };
    }

    if (error.status === 409) {
      return {
        title: 'Conflict Error',
        message: 'This resource already exists or conflicts with existing data.',
        isNotFound: false,
        isForbidden: false,
      };
    }

    if (error.status >= 500) {
      return {
        title: 'Server Error',
        message: 'Something went wrong on our server. Please try again in a few moments.',
        isNotFound: false,
        isForbidden: false,
      };
    }

    return {
      title: 'Error',
      message: error.message || 'An unexpected error occurred.',
      isNotFound: false,
      isForbidden: false,
    };
  }

  const genericMsg = (error as any)?.message || 'An unexpected error occurred. Please try again.';
  return {
    title: 'Error',
    message: genericMsg,
    isNotFound: false,
    isForbidden: false,
  };
}
