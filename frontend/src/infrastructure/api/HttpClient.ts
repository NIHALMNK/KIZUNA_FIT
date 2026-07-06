import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError, NetworkError, TimeoutError } from '../../shared/exceptions/ApiError';
import { tokenStorage } from '../storage/TokenStorage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const DEFAULT_TIMEOUT = 10000;

class HttpClient {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: DEFAULT_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = tokenStorage.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      this.handleError
    );
  }

  private handleError(error: AxiosError): Promise<never> {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return Promise.reject(new TimeoutError());
    }

    if (!error.response) {
      return Promise.reject(new NetworkError());
    }

    const { status, data } = error.response;
    const errorData = data as Record<string, unknown>;
    const message = (errorData?.message as string) || 'An error occurred while communicating with the server.';
    const code = (errorData?.code as string) || 'UNKNOWN_ERROR';

    if (status === 401) {
      // Implement generic auth failure response here (e.g. event bus trigger for logout)
      tokenStorage.removeAccessToken();
    }

    return Promise.reject(new ApiError(message, status, code, errorData));
  }

  public get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.api.get<T>(url, config).then((res) => res.data);
  }

  public post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.api.post<T>(url, data, config).then((res) => res.data);
  }

  public put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.api.put<T>(url, data, config).then((res) => res.data);
  }

  public delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.api.delete<T>(url, config).then((res) => res.data);
  }

  public createCancelToken() {
    const cancelTokenSource = axios.CancelToken.source();
    return cancelTokenSource;
  }
}

export const httpClient = new HttpClient();
