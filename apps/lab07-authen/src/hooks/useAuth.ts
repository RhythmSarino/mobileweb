import { useEffect, useState } from 'react';
import { firebaseAuth } from '@/auth/auth-web';
import type { AuthUser } from '@/auth/auth-interface';

function mapUser(u: any): AuthUser {
  return {
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    photoUrl: u.photoURL,
    phoneNumber: u.phoneNumber,
  };
}

/**
 * useAuth Hook
 * Use this to access user info and auth methods in any component
 */
export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Use onAuthStateChanged to properly listen for persistent sessions
    const unsubscribe = firebaseAuth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(mapUser(currentUser));
      } else {
        setUser(null);
      }
      setLoading(false);
    }, (err) => {
      console.error('Auth check error:', err);
      setError(err instanceof Error ? err.message : 'Auth error');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await firebaseAuth.signOut();
      setUser(null);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Logout failed';
      setError(message);
      return false;
    }
  };

  return {
    user,
    loading,
    error,
    logout,
    isAuthenticated: !!user,
  };
};
