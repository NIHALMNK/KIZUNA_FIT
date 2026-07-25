export interface ITokenStorage {
  getAccessToken(): string | null;
  setAccessToken(token: string): void;
  removeAccessToken(): void;
}

// In this architecture, the access token is strictly kept in memory.
// It is restored by calling `/auth/refresh` on app startup if the 
// backend's HttpOnly refresh cookie exists.
export class InMemoryTokenStorage implements ITokenStorage {
  private accessToken: string | null = null;

  getAccessToken(): string | null {
    return this.accessToken;
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  removeAccessToken(): void {
    this.accessToken = null;
  }
}

export const tokenStorage = new InMemoryTokenStorage();
