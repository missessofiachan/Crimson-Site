import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import type { Session } from 'next-auth';

/**
 * Custom hook to protect routes based on authentication or roles
 *
 * @param options - Options for route protection
 * @param options.requiredRole - Role required to access the route (optional)
 * @param options.redirectTo - Where to redirect if authentication fails
 * @returns Session data and loading state
 */
export function useProtectedRoute(
  options: {
    requiredRole?: string;
    redirectTo?: string;
  } = {}
) {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const router = useRouter();
  const pathname = usePathname();

  const { requiredRole = null, redirectTo = '/login' } = options;

  useEffect(() => {
    // Wait until done loading
    if (loading) return;

    // If no session exists, redirect to login
    if (!session) {
      router.push(`${redirectTo}?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    // If a specific role is required and user doesn't have it
    if (requiredRole && (!session.user || session.user.role !== requiredRole)) {
      router.push('/');
    }
  }, [session, loading, requiredRole, redirectTo, router, pathname]);

  return { session, loading };
}

/**
 * Helper to check if a user is an admin
 *
 * @param session NextAuth session
 * @returns boolean indicating if user is admin
 */
export function isAdmin(session: Session | null | undefined) {
  return session?.user?.role === 'admin';
}

/**
 * Custom hook to check if current user is an admin
 *
 * @returns boolean indicating if current user is admin
 */
export function useIsAdmin() {
  const { data: session } = useSession();
  return isAdmin(session);
}
