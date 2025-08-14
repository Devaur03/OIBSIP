
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { getUserData } from '@/app/user/actions';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        try {
          const userData = await getUserData(user.uid);
          setIsAdmin(userData?.role === 'admin');
        } catch (error) {
          console.error("Failed to fetch user role", error);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(pathname);
    const isAdminPage = pathname.startsWith('/admin');

    // If not logged in, and trying to access a protected page, redirect to login
    if (!user && (isAdminPage || pathname === '/user' || pathname === '/orders')) {
      router.push('/login');
      return;
    }

    // If logged in and on an auth page, redirect to the appropriate dashboard
    if (user && isAuthPage) {
      router.push(isAdmin ? '/admin' : '/user');
      return;
    }

    // If a non-admin tries to access an admin page, redirect them
    if (user && isAdminPage && !isAdmin) {
      router.push('/user');
      return;
    }

  }, [user, loading, isAdmin, pathname, router]);

  const signOut = async () => {
    await firebaseSignOut(auth);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
