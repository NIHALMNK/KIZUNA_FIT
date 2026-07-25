export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly data: unknown;
  public readonly details: any;

  constructor(message: string, status: number, code: string = 'UNKNOWN_ERROR', data: unknown = null, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.data = data;
    this.details = details;
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network Error: Unable to connect to the server.') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor(message: string = 'Request Timeout: The server took too long to respond.') {
    super(message);
    this.name = 'TimeoutError';
  }
}
