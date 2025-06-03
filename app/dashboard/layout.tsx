'use client';

import { signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import styles from './Dashboard.module.css';
import { useProtectedRoute, useIsAdmin } from '@/lib/auth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { session, loading } = useProtectedRoute();
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = useIsAdmin();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (loading) {
    return <div className="text-gray-800 p-4">Loading...</div>;
  }

  // Check if current path is active
  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ redirect: false });
      router.push('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Dashboard</h2>

        <nav>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link
                href="/dashboard"
                className={`${styles.navLink} ${isActive('/dashboard') ? styles.activeNavLink : ''}`}
              >
                Overview
              </Link>
            </li>

            {/* Only show store management for admins */}
            {isAdmin && (
              <>
                <li className={styles.navItem}>
                  <Link
                    href="/dashboard/store"
                    className={`${styles.navLink} ${isActive('/dashboard/store') ? styles.activeNavLink : ''}`}
                  >
                    Store Items
                  </Link>
                </li>
                <li className={styles.navItem}>
                  <Link
                    href="/dashboard/store/categories"
                    className={`${styles.navLink} ${isActive('/dashboard/store/categories') ? styles.activeNavLink : ''}`}
                  >
                    Categories
                  </Link>
                </li>
                <li className={styles.navItem}>
                  <Link
                    href="/dashboard/store/add"
                    className={`${styles.navLink} ${isActive('/dashboard/store/add') ? styles.activeNavLink : ''}`}
                  >
                    Add Item
                  </Link>
                </li>
              </>
            )}

            <li className={styles.navItem}>
              <Link
                href="/dashboard/profile"
                className={`${styles.navLink} ${isActive('/dashboard/profile') ? styles.activeNavLink : ''}`}
              >
                Profile
              </Link>
            </li>
          </ul>
        </nav>

        <div className={styles.userInfo}>
          <div className={styles.userName}>{session?.user?.name}</div>
          <div className={styles.userRole}>{isAdmin ? 'Administrator' : 'User'}</div>
          <button className={styles.logoutButton} onClick={handleLogout} disabled={isLoggingOut}>
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </aside>

      <main className={styles.content}>{children}</main>
    </div>
  );
}
