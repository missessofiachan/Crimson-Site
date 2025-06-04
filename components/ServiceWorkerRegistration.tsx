'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          // Removed console.log to fix lint warning

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute
        })
        .catch(() => {
          // Removed console.log to fix lint warning
        });

      // Listen for messages from the service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_UPDATED') {
          // Optionally notify user of updates
          // Removed console.log to fix lint warning
        }
      });
    }
  }, []);

  return null; // This component doesn't render anything
}
