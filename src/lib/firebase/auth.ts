'use client'

// --- MOCK FIREBASE AUTH ---
// This file simulates Firebase Auth for demonstration purposes.
// It uses localStorage to persist a mock user session.

const MOCK_USER_STORAGE_KEY = 'poultyguard-mock-user';

// Simulates a user object from Firebase Auth
type MockUser = {
  uid: string;
  email: string;
  displayName: string;
};

// --- Mock Auth Functions ---

const createMockUser = (email: string): MockUser => ({
  uid: `mock-uid-${Date.now()}`,
  email,
  displayName: email.split('@')[0],
});

export const mockSignUp = async (email: string): Promise<MockUser> => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  if (email.includes('fail')) {
    throw new Error('This email is already in use.');
  }
  const user = createMockUser(email);
  if (typeof window !== 'undefined') {
    localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event('storage'));
  }
  return user;
};

export const mockSignIn = async (email: string): Promise<MockUser> => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  if (email.includes('fail')) {
    throw new Error('Invalid credentials.');
  }
  const user = createMockUser(email);
  if (typeof window !== 'undefined') {
    localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event('storage'));
  }
  return user;
};

export const mockSignOut = async (): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  if (typeof window !== 'undefined') {
    localStorage.removeItem(MOCK_USER_STORAGE_KEY);
    window.dispatchEvent(new Event('storage'));
  }
};

// --- Mock onAuthStateChanged ---

// This function mimics Firebase's onAuthStateChanged by listening to localStorage changes.
export const authStateChanged = (callback: (user: MockUser | null) => void): (() => void) => {
  const handleStorageChange = () => {
    try {
      const userStr = localStorage.getItem(MOCK_USER_STORAGE_KEY);
      const user = userStr ? JSON.parse(userStr) as MockUser : null;
      callback(user);
    } catch (error) {
      callback(null);
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorageChange);
    // Initial check
    handleStorageChange();
  }

  // Return an unsubscribe function
  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorageChange);
    }
  };
};
