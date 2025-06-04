'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './Login.module.css';
import { trackLogin } from '@/lib/gtag';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError(result.error);
      } else {
        // Track successful login
        trackLogin('credentials');

        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Login</h1>
        <h2 className={styles.subtitle}>Welcome back</h2>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input
            className={styles.input}
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="password">
            Password
          </label>
          <input
            className={styles.input}
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button
          className={loading ? `${styles.loginButton} ${styles.loading}` : styles.loginButton}
          type="submit"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className={styles.registerLink}>
        Don&apos;t have an account? <Link href="/register">Register</Link>
      </div>
    </div>
  );
}
