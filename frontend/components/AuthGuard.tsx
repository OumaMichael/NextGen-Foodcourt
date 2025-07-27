'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  allowedRoles?: string[];
}

export default function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/login',
  allowedRoles = []
}: AuthGuardProps) {
  const { isLoggedIn, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isLoggedIn) {
        // Redirect to login with current path as redirect parameter
        const currentPath = window.location.pathname;
        router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
        return;
      }

      if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
        // User doesn't have required role
        router.push('/');
        return;
      }
    }
  }, [isLoggedIn, isLoading, user, requireAuth, allowedRoles, redirectTo, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
        <div className="w-12 h-12 border-4 border-orange-500 border-solid rounded-full border-t-transparent animate-spin"></div>
        <p className="text-orange-600 text-lg">Loading...</p>
      </div>
    );
  }

  // Don't render if auth is required but user is not logged in
  if (requireAuth && !isLoggedIn) {
    return null;
  }

  // Don't render if user doesn't have required role
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}