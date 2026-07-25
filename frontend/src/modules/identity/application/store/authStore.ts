import { create } from 'zustand';
import { User } from '../../domain/types/User';
import { parseJwt } from '../../../../shared/utils/jwt';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  status: AuthStatus;
  user: Partial<User> | null;
  setAuthenticated: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'loading', // Initial state is loading (Session Bootstrap phase)
  user: null,
  setAuthenticated: (token) => {
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        set({ 
          status: 'authenticated', 
          user: { id: decoded.sub, email: decoded.email, role: decoded.role } 
        });
      } else {
        set({ status: 'unauthenticated', user: null });
      }
    } else {
      set({ status: 'unauthenticated', user: null });
    }
  },
  logout: () => set({ status: 'unauthenticated', user: null }),
}));
