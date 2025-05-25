'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { pageview } from '@/lib/gtag';

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();  useEffect(() => {
    // Only track page views if gtag is available (in production)
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      const url = new URL(window.location.href);
      pageview(url);
    }
  }, [pathname, searchParams]);

  // This component only handles client-side page view tracking
  // The actual GA scripts are loaded in GoogleAnalyticsScripts component
  return null;
}
