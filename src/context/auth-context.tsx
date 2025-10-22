'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { mockSignIn, mockSignUp, mockSignOut, authStateChanged } from '@/lib/firebase/auth';

type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: typeof mockSignIn;
  signUp: typeof mockSignUp;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = authStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    await mockSignOut();
    router.push('/login');
  };

  const value = {
    user,
    loading,
    signIn: mockSignIn,
    signUp: mockSignUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
