'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  User 
} from 'firebase/auth';
import { initializeFirebase } from '@/firebase';

// Initialize firebase app if not already initialized
initializeFirebase();

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: typeof signInWithEmailAndPassword;
  signUp: typeof createUserWithEmailAndPassword;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  const signOut = async () => {
    await firebaseSignOut(auth);
    router.push('/login');
  };

  const value = {
    user,
    loading,
    signIn: (email, password) => signInWithEmailAndPassword(auth, email, password),
    signUp: (email, password) => createUserWithEmailAndPassword(auth, email, password),
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
