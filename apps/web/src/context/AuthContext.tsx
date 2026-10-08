import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, CmsModule } from '@avada/shared';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  hasPermission: (module: CmsModule, action: 'view' | 'edit') => boolean;
  canView: (module: CmsModule) => boolean;
  canEdit: (module: CmsModule) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('avada_auth_token');
    const savedUser = localStorage.getItem('avada_auth_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Failed to parse cached user:', err);
        localStorage.removeItem('avada_auth_token');
        localStorage.removeItem('avada_auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('avada_auth_token', newToken);
    localStorage.setItem('avada_auth_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('avada_auth_token');
    localStorage.removeItem('avada_auth_user');
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
