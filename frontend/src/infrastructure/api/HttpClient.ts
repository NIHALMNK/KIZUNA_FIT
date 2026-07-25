import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError, NetworkError, TimeoutError } from '../../shared/exceptions/ApiError';
import { tokenStorage } from '../storage/TokenStorage';
import { useAuthStore } from '../../modules/identity/application/store/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
const DEFAULT_TIMEOUT = 10000;

class HttpClient {
  private api: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: { resolve: (token: string) => void, reject: (error: any) => void }[] = [];

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: DEFAULT_TIMEOUT,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private onRefreshed(token: string) {
    this.refreshSubscribers.forEach(({ resolve }) => resolve(token));
    this.refreshSubscribers = [];
  }

  private onRefreshFailed(error: any) {
    this.refreshSubscribers.forEach(({ reject }) => reject(error));
    this.refreshSubscribers = [];
  }

  private addRefreshSubscriber(resolve: (token: string) => void, reject: (error: any) => void) {
    this.refreshSubscribers.push({ resolve, reject });
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
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          return Promise.reject(new TimeoutError());
        }

        if (!error.response) {
          return Promise.reject(new NetworkError());
        }

        const { status, data } = error.response;
        const errorData = data as { error?: { message?: string, code?: string, details?: Record<string, string[]> } };
        const backendError = errorData?.error;
        const message = backendError?.message || (errorData as Record<string, unknown>)?.message as string || 'An error occurred while communicating with the server.';
        const code = backendError?.code || (errorData as Record<string, unknown>)?.code as string || 'UNKNOWN_ERROR';
        const details = backendError?.details || (errorData as Record<string, unknown>)?.details as Record<string, unknown> || undefined;

        if (status === 401 && originalRequest && !originalRequest._retry && originalRequest.url !== '/identity/refresh' && originalRequest.url !== '/identity/login') {
          originalRequest._retry = true;

          if (!this.isRefreshing) {
            this.isRefreshing = true;
            try {
              // Call the refresh endpoint (which relies on the HttpOnly cookie)
              const res = await axios.post<{ success: boolean, data: { accessToken: string } }>(
                `${API_BASE_URL}/identity/refresh`,
                {},
                { withCredentials: true }
              );
              
              const newAccessToken = res.data.data.accessToken;
              tokenStorage.setAccessToken(newAccessToken);
              this.onRefreshed(newAccessToken);
              this.isRefreshing = false;
              
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return this.api(originalRequest);
            } catch (refreshError) {
              this.isRefreshing = false;
              tokenStorage.removeAccessToken();
              useAuthStore.getState().logout();
              const apiError = new ApiError('Session expired. Please log in again.', 401, 'SESSION_EXPIRED', {});
              this.onRefreshFailed(apiError);
              
              // Only redirect if we are in the browser
              if (typeof window !== 'undefined') {
                window.location.href = '/login';
              }
              return Promise.reject(apiError);
            }
          }

          // Wait for the refresh to complete
          return new Promise((resolve, reject) => {
            this.addRefreshSubscriber(
              (token: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                resolve(this.api(originalRequest));
              },
              (error) => {
                reject(error);
              }
            );
          });
        }
        return Promise.reject(new ApiError(message, status, code, errorData, details));
      }
    );
  }

  private unwrapResponse<T>(res: AxiosResponse): T {
    if (res.data && typeof res.data === 'object' && 'success' in res.data) {
      return res.data.data as T;
    }
    return res.data as T;
  }

  public get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.api.get(url, config).then(res => this.unwrapResponse<T>(res));
  }

  public post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    console.log('7. HttpClient called');
    console.log('8. network request sent', url);
    return this.api.post(url, data, config).then(res => this.unwrapResponse<T>(res));
  }

  public put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.api.put(url, data, config).then(res => this.unwrapResponse<T>(res));
  }

  public delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.api.delete(url, config).then(res => this.unwrapResponse<T>(res));
  }

  public createCancelToken() {
    const cancelTokenSource = axios.CancelToken.source();
    return cancelTokenSource;
  }
}

export const httpClient = new HttpClient();
