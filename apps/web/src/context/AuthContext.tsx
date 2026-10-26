import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { User, CmsModule } from '@avada/shared';
import { isTokenExpired } from '@/lib/jwt';
import {
  installAuthFetchInterceptor,
  AUTH_EXPIRED_EVENT,
  setSessionNotice,
  notifySessionExpired,
  SessionExpiredEventDetail,
} from '@/lib/auth-interceptor';

// Install the global 401 interceptor immediately
installAuthFetchInterceptor();

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: (reason?: string) => void;
  hasPermission: (module: CmsModule, action: 'view' | 'edit') => boolean;
  canView: (module: CmsModule) => boolean;
  canEdit: (module: CmsModule) => boolean;
  verifySession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isVerifyingRef = useRef(false);

  const clearAuthStorage = useCallback((reason?: string) => {
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem('avada_auth_token');
      localStorage.removeItem('avada_auth_user');
    } catch {
      // Ignore storage errors
    }
    if (reason) {
      setSessionNotice(reason);
    }
  }, []);

  const logout = useCallback(
    (reason?: string) => {
      clearAuthStorage(reason);
    },
    [clearAuthStorage]
  );

  const verifySession = useCallback(async (): Promise<boolean> => {
    const currentToken = localStorage.getItem('avada_auth_token');
    if (!currentToken) {
      clearAuthStorage();
      return false;
    }

    // 1. Proactive Client-Side JWT Expiration Check
    if (isTokenExpired(currentToken)) {
      console.warn('[Auth] Session token has expired locally. Purging cached session.');
      clearAuthStorage('Your session has expired. Please sign in again.');
      return false;
    }

    // 2. Server-Side Verification via GET /api/auth/me
    if (isVerifyingRef.current) return true;
    isVerifyingRef.current = true;

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${currentToken}`,
          'Cache-Control': 'no-cache',
        },
      });

      if (response.status === 401) {
        console.warn('[Auth] Server rejected token on verification (401). Purging session.');
        clearAuthStorage('Your session has expired or is invalid. Please sign in again.');
        return false;
      }

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data?.user) {
          setUser(json.data.user);
          localStorage.setItem('avada_auth_user', JSON.stringify(json.data.user));
          return true;
        }
      }

      return true;
    } catch (err) {
      // Network failure / offline: don't forcefully logout unless server explicitly returns 401
      console.warn('[Auth] Network error while verifying session, using cached credentials:', err);
      return true;
    } finally {
      isVerifyingRef.current = false;
    }
  }, [clearAuthStorage]);

  // Initial Mount: Load cached credentials, test expiration, and verify against server
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('avada_auth_token');
      const savedUser = localStorage.getItem('avada_auth_user');

      if (!savedToken || !savedUser) {
        setIsLoading(false);
        return;
      }

      // Check client-side expiration immediately before doing anything
      if (isTokenExpired(savedToken)) {
        console.warn('[Auth] Stored token is already expired. Resetting session state.');
        clearAuthStorage('Your session has expired. Please sign in again.');
        setIsLoading(false);
        return;
      }

      try {
        const parsed = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsed);
      } catch (err) {
        console.error('[Auth] Failed to parse cached user JSON:', err);
        clearAuthStorage();
        setIsLoading(false);
        return;
      }

      // Verify credentials with backend
      await verifySession();
      setIsLoading(false);
    };

    initAuth();
  }, [clearAuthStorage, verifySession]);

  // Listen for Global 401 / Session Expired Events
  useEffect(() => {
    const handleAuthExpired = (event: Event) => {
      const customEvent = event as CustomEvent<SessionExpiredEventDetail>;
      const reason = customEvent.detail?.reason || 'Your session has expired. Please sign in again.';
      console.warn('[Auth] Global session expiration triggered:', reason);
      clearAuthStorage(reason);
    };

    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);

    // Periodic Background Expiry Monitor (Checks every 30 seconds)
    const interval = window.setInterval(() => {
      const currentToken = localStorage.getItem('avada_auth_token');
      if (currentToken && isTokenExpired(currentToken)) {
        console.warn('[Auth] Token expired during active tab session. Notifying expiration.');
        notifySessionExpired('Your session has expired. Please sign in again to continue.');
      }
    }, 30000);

    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
      window.clearInterval(interval);
    };
  }, [clearAuthStorage]);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    try {
      localStorage.setItem('avada_auth_token', newToken);
      localStorage.setItem('avada_auth_user', JSON.stringify(newUser));
    } catch {
      // Ignore storage errors
    }
  };

  const hasPermission = useCallback(
    (module: CmsModule, action: 'view' | 'edit'): boolean => {
      if (!user) return false;
      const role = user.role;
      if (!role || !role.permissions) return true; // Super admin fallback
      const perm = role.permissions[module];
      if (!perm) return false;

      if (action === 'edit') return !!perm.edit;
      if (action === 'view') return !!perm.view || !!perm.edit;
      return false;
    },
    [user]
  );

  const canView = useCallback((module: CmsModule) => hasPermission(module, 'view'), [hasPermission]);
  const canEdit = useCallback((module: CmsModule) => hasPermission(module, 'edit'), [hasPermission]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        hasPermission,
        canView,
        canEdit,
        verifySession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
