import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { storage } from '@/lib/storage';
import { api } from '@/lib/api';
import type { User } from '@/lib/types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (
    name: string,
    email: string,
    password: string,
    accountType?: 'myself' | 'loved-one',
    relationship?: string,
    lovedOneName?: string,
    lovedOneAge?: number,
    dateOfBirth?: string,
    height?: number,
    weight?: number,
    cycleLength?: number,
    periodLength?: number,
  ) => Promise<User>;
  logout: () => void;
  updateUser: (patch: Partial<User>) => Promise<User>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => storage.getUser());

  useEffect(() => {
    const token = storage.getToken();
    if (!user && token) {
      api
        .get('/auth/me')
        .then(({ data }) => {
          storage.setUser(data.user);
          setUser(data.user);
        })
        .catch(() => {
          storage.clearToken();
          storage.clearUser();
          setUser(null);
        });
    }
  }, [user]);

  const persistUser = useCallback((user: User, token: string) => {
    storage.setToken(token);
    storage.setUser(user);
    setUser(user);
  }, []);

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      accountType: 'myself' | 'loved-one' = 'myself',
      relationship?: string,
      lovedOneName?: string,
      lovedOneAge?: number,
      dateOfBirth?: string,
      height?: number,
      weight?: number,
      cycleLength?: number,
      periodLength?: number,
    ) => {
      try {
        const { data } = await api.post('/auth/register', {
          accountType,
          name,
          relationship,
          lovedOneName,
          lovedOneAge,
          dateOfBirth,
          height,
          weight,
          cycleLength,
          periodLength,
          email,
          password,
        });
        persistUser(data.user, data.token);
        return data.user;
      } catch (error: unknown) {
        const message =
          error && typeof error === 'object' && 'response' in error && error.response && typeof (error as any).response.data === 'object'
            ? (error as any).response.data.message
            : 'Could not create account. Try again.';
        throw new Error(message || 'Could not create account. Try again.');
      }
    },
    [persistUser],
  );

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    persistUser(data.user, data.token);
    return data.user;
  }, [persistUser]);

  const logout = useCallback(() => {
    storage.clearUser();
    storage.clearToken();
    setUser(null);
  }, []);

  const updateUser = useCallback(async (patch: Partial<User>) => {
    const { data } = await api.put('/auth/me', patch);
    storage.setUser(data.user);
    setUser(data.user);
    return data.user;
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, register, logout, updateUser }),
    [user, login, register, logout, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
