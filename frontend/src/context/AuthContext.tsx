import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { login as loginRequest } from '../api/auth';
import { clearAuth, readUser, saveAuth } from '../utils/tokenStorage';
import type { AuthUser } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readUser<AuthUser>());

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      login: async (email: string, password: string, remember: boolean) => {
        const response = await loginRequest(email, password);
        saveAuth(response.token, response.user, remember);
        setUser(response.user);
      },
      logout: () => {
        clearAuth();
        setUser(null);
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
