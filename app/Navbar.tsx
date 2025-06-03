'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/lib/cart';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ShoppingCartIcon } from '../components/Icons';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { data: session } = useSession();
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect for navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when a new page is navigated to
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `${styles.navLink} ${isActive ? styles.navLinkActive : styles.navLinkInactive}`;
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={styles.logoIcon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
            />
          </svg>
          Crimson E-Commerce
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={styles.mobileMenuButton}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={styles.menuIcon}
          >
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            )}
          </svg>
        </button>
        {/* Desktop Navigation */}
        <ul className={styles.desktopNav}>
          <li>
            <Link href="/" className={navLinkClass('/')}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/store" className={navLinkClass('/store')}>
              Store
            </Link>
          </li>
          <li>
            <Link href="/about" className={navLinkClass('/about')}>
              About
            </Link>
          </li>
          <li>
            <Link href="/faq" className={navLinkClass('/faq')}>
              FAQ
            </Link>
          </li>
          <li>
            <Link href="/chat" className={navLinkClass('/chat')}>
              Chat
            </Link>
          </li>
          <li>
            <Link href="/contact" className={navLinkClass('/contact')}>
              Contact
            </Link>
          </li>
          <li>
            <Link href="/cat-fact" className={navLinkClass('/cat-fact')}>
              Cat Fact
            </Link>
          </li>

          {/* Cart Link with counter */}
          <li>
            <Link href="/cart" className={`${navLinkClass('/cart')} ${styles.cartLink}`}>
              <ShoppingCartIcon className={styles.cartIcon} />
              {totalItems > 0 && <span className={styles.cartBadge}>{totalItems} </span>}
            </Link>
          </li>

          {session ? (
            <li className={styles.userMenuGroup}>
              <button className={styles.userMenuButton} aria-label="User menu">
                <span className={styles.userName}>
                  {session.user?.name || session.user?.email?.split('@')[0] || 'User'}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className={styles.userMenuIcon}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>

              {/* Dropdown menu */}
              <div className={styles.userDropdown}>
                <Link href="/dashboard" className={styles.dropdownLink}>
                  Dashboard
                </Link>
                <Link href="/dashboard/profile" className={styles.dropdownLink}>
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className={styles.dropdownSignOut}
                  disabled={isSigningOut}
                >
                  {isSigningOut ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            </li>
          ) : (
            <li>
              <Link
                href="/login"
                className={`${styles.loginButton} ${
                  pathname === '/login' ? styles.loginButtonActive : styles.loginButtonInactive
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={styles.loginIcon}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                  />
                </svg>
                Login
              </Link>
            </li>
          )}
        </ul>
        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className={styles.mobileMenu}>
            <ul className={styles.mobileNavList}>
              <li>
                <Link href="/" className={navLinkClass('/')}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/store" className={navLinkClass('/store')}>
                  Store
                </Link>
              </li>
              <li>
                <Link href="/about" className={navLinkClass('/about')}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/faq" className={navLinkClass('/faq')}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/chat" className={navLinkClass('/chat')}>
                  Chat
                </Link>
              </li>
              <li>
                <Link href="/contact" className={navLinkClass('/contact')}>
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/cat-fact" className={navLinkClass('/cat-fact')}>
                  Cat Fact
                </Link>
              </li>

              <li>
                <Link href="/cart" className={`${navLinkClass('/cart')} ${styles.mobileCartLink}`}>
                  Cart
                  {totalItems > 0 && <span className={styles.mobileCartBadge}>{totalItems}</span>}
                </Link>
              </li>

              {session ? (
                <>
                  <li>
                    <Link href="/dashboard" className={navLinkClass('/dashboard')}>
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/profile" className={navLinkClass('/dashboard/profile')}>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleSignOut}
                      className={styles.mobileSignOut}
                      disabled={isSigningOut}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className={styles.mobileSignOutIcon}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h7.5"
                        />
                      </svg>
                      {isSigningOut ? 'Signing out...' : 'Sign out'}
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    href="/login"
                    className={`${navLinkClass('/login')} ${styles.mobileLoginLink}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className={styles.mobileLoginIcon}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                      />
                    </svg>
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
