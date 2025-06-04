'use client';

import { useEffect } from 'react';

export default function WebVitalsMonitor() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Simple performance monitoring without web-vitals dependency
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'paint') {
            // Send to analytics if available
            if (window.gtag) {
              window.gtag('event', 'paint_timing', {
                event_category: 'Performance',
                event_label: entry.name,
                value: Math.round(entry.startTime),
                non_interaction: true,
              });
            }
          }

          if (entry.entryType === 'largest-contentful-paint') {
            if (window.gtag) {
              window.gtag('event', 'lcp', {
                event_category: 'Web Vitals',
                event_label: 'LCP',
                value: Math.round(entry.startTime),
                non_interaction: true,
              });
            }
          }
        }
      });

      // Observe different performance metrics
      try {
        observer.observe({
          entryTypes: ['navigation', 'paint', 'resource', 'largest-contentful-paint'],
        });
      } catch {
        // Fallback for browsers that don't support all entry types
        observer.observe({ entryTypes: ['navigation', 'paint', 'resource'] });
      }

      // Monitor network connection for dynamic optimization
      if ('connection' in navigator) {
        const connection = (
          navigator as unknown as {
            connection: {
              effectiveType: string;
              downlink: number;
              rtt: number;
            };
          }
        ).connection;

        // Adjust strategies based on connection speed
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          // Disable non-critical features for slow connections
          document.documentElement.classList.add('slow-connection');
        }
      }

      // Measure critical path timing
      const measureCriticalPath = () => {
        const navigation = performance.getEntriesByType(
          'navigation'
        )[0] as PerformanceNavigationTiming;
        if (navigation) {
          // Removed unused criticalPath assignment
        }
      };

      // Measure after page load
      if (document.readyState === 'complete') {
        measureCriticalPath();
      } else {
        window.addEventListener('load', measureCriticalPath);
      }

      // Cleanup
      return () => {
        observer.disconnect();
        window.removeEventListener('load', measureCriticalPath);
      };
    }
  }, []);

  return null;
}
