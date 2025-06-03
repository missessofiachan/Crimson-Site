'use client';

import dynamic from 'next/dynamic';
import React, { ComponentType } from 'react';

// Loading component for better UX
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-crimson-dark"></div>
  </div>
);

// Lazy load heavy dashboard components
export const LazyDashboardStore = dynamic(() => import('@/app/dashboard/store/page'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

export const LazyStoreAdd = dynamic(() => import('@/app/dashboard/store/add/page'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

export const LazyStoreCategories = dynamic(() => import('@/app/dashboard/store/categories/page'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

export const LazyProfilePage = dynamic(() => import('@/app/dashboard/profile/page'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

// Lazy load cart page
export const LazyCartPage = dynamic(() => import('@/app/cart/page'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

// Lazy load store page
export const LazyStorePage = dynamic(() => import('@/app/store/page'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

// Lazy load contact form
export const LazyContactForm = dynamic(() => import('@/app/contact/page'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

// Lazy load authentication forms
export const LazyLoginForm = dynamic(() => import('@/app/login/page'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

export const LazyRegisterForm = dynamic(() => import('@/app/register/page'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

// Higher-order component for lazy loading with error boundary
export function withLazyLoading<T extends object>(
  Component: ComponentType<T>,
  fallback?: () => React.ReactElement
) {
  return dynamic(() => Promise.resolve(Component), {
    loading: fallback || LoadingSpinner,
    ssr: false,
  });
}
