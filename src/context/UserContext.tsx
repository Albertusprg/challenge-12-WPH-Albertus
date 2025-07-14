'use client';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type UserType = {
  id?: number;
  name?: string;
  email?: string;
  headline?: string;
  avatarUrl?: string;
};

type UserContextType = {
  user: UserType | null;
  assignUser: (userData: UserType) => void;
  changeName: (name: string) => void;
  changeHeadline: (headline: string) => void;
  changeAvatarUrl: (avatar: string) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserType | null>(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          return JSON.parse(storedUser);
        } catch (e) {
          console.error('Failed to parse user data from Local Storage', e);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          return null;
        }
      }
    }
    return null;
  });

  const assignUser = useCallback((userData: UserType) => {
    setUser(userData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
    }
  }, []);

  const changeName = useCallback((name: string) => {
    setUser((prevUser) => {
      if (prevUser === null) return null;
      return { ...prevUser, name };
    });
  }, []);

  const changeHeadline = useCallback((headline: string) => {
    setUser((prevUser) => {
      if (prevUser === null) return null;
      return { ...prevUser, headline };
    });
  }, []);

  const changeAvatarUrl = useCallback((avatar: string) => {
    setUser((prevUser) => {
      if (prevUser === null) return null;
      return { ...prevUser, avatar };
    });
  }, []);

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };
  const contextValue = useMemo(
    () => ({
      user,
      assignUser,
      changeName,
      changeHeadline,
      changeAvatarUrl,
      logout,
    }),
    [user, assignUser, changeName, changeHeadline, changeAvatarUrl]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}
