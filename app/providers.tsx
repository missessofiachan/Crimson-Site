'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode, Suspense } from 'react';
import dynamic from 'next/dynamic';

// Lazy load cart provider to reduce initial bundle
const LazyCartProvider = dynamic(
  () => import('@/lib/cart').then((mod) => ({ default: mod.CartProvider })),
  {
    ssr: false,
    loading: () => null,
  }
);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <Suspense fallback={null}>
        <LazyCartProvider>{children}</LazyCartProvider>
      </Suspense>
    </SessionProvider>
  );
}
