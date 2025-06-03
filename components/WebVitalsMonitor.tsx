'use client';

import { useEffect } from 'react';

export default function WebVitalsMonitor() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Simple performance monitoring without web-vitals dependency
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            console.log('Navigation Timing:', {
              domContentLoaded:
                navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
              loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
              networkLatency: navEntry.responseEnd - navEntry.requestStart,
              ttfb: navEntry.responseStart - navEntry.requestStart,
            });
          }

          if (entry.entryType === 'paint') {
            console.log(`${entry.name}: ${entry.startTime}ms`);

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

          if (entry.entryType === 'resource') {
            // Log slow loading resources
            if (entry.duration > 500) {
              console.warn('Slow resource:', {
                name: entry.name,
                duration: entry.duration,
                size: (entry as PerformanceResourceTiming).transferSize,
              });
            }
          }

          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime);
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
        const connection = (navigator as any).connection;
        console.log('Network Info:', {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
        });

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
          const criticalPath = {
            dns: navigation.domainLookupEnd - navigation.domainLookupStart,
            tcp: navigation.connectEnd - navigation.connectStart,
            request: navigation.responseStart - navigation.requestStart,
            response: navigation.responseEnd - navigation.responseStart,
            processing: navigation.domComplete - navigation.responseEnd,
            total: navigation.loadEventEnd - navigation.fetchStart,
          };

          console.log('Critical Path Analysis:', criticalPath);

          // Alert if critical path is too long
          if (criticalPath.total > 3000) {
            console.warn('Critical path latency exceeds 3 seconds:', criticalPath);
          }
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
