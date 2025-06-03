// Critical resource hints for improved LCP performance and reduced network dependency chains
export default function CriticalResourceHints() {
  return (
    <>
      {/* Enhanced resource hints for critical path optimization */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* DNS prefetch for external resources */}
      <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      <link rel="dns-prefetch" href="https://vercel.com" />
      <link rel="dns-prefetch" href="https://vitals.vercel-analytics.com" />

      {/* Preload critical routes to reduce navigation latency */}
      <link rel="prefetch" href="/store" />
      <link rel="prefetch" href="/about" />
      <link rel="prefetch" href="/api/store/items" />

      {/* Module preload for critical JavaScript chunks */}
      <link rel="modulepreload" href="/_next/static/chunks/webpack.js" />
      <link rel="modulepreload" href="/_next/static/chunks/main.js" />

      {/* Critical CSS for above-the-fold content to reduce render blocking */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          /* Enhanced Critical CSS for LCP element - Maximum Performance */
          .text-4xl {
            font-size: 2.25rem;
            line-height: 2.5rem;
            font-display: swap;
            contain: layout style paint;
            content-visibility: auto;
            font-synthesis: none;
          }
          .font-bold {
            font-weight: 700;
            font-display: swap;
            font-synthesis: none;
          }
          .mb-4 { margin-bottom: 1rem; }
          .mb-8 { margin-bottom: 2rem; }
          .text-center { text-align: center; }
          .max-w-2xl { max-width: 42rem; }
          .flex { display: flex; }
          .flex-col { flex-direction: column; }
          .items-center { align-items: center; }
          .justify-center { justify-content: center; }
          .min-h-screen { min-height: 100vh; }
          .p-4 { padding: 1rem; }
          .text-crimson-dark { color: #8B0000; }
          .text-crimson { color: #DC143C; }
          .will-change-transform {
            will-change: transform, opacity;
            transform: translateZ(0);
            backface-visibility: hidden;
            transform-style: preserve-3d;
          }
          .underline { text-decoration-line: underline; }
          .bg-crimson { background-color: #DC143C; }
          .text-white { color: rgb(255 255 255); }
          .rounded-lg { border-radius: 0.5rem; }
          .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
          .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
          .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
          .font-semibold { font-weight: 600; }
          .mt-2 { margin-top: 0.5rem; }
          .pt-24 { padding-top: 6rem; }

          /* Critical button optimizations for hover performance */
          .crimson-button {
            background-color: #DC143C;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-size: 1.125rem;
            font-weight: 600;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            transform: translateZ(0);
            will-change: transform, background-color;
            contain: layout style paint;
          }
          .crimson-button:hover {
            background-color: #8B0000;
            transform: translateY(-2px) scale(1.05);
          }

          /* Optimize font rendering for performance */
          html {
            font-display: swap;
          }

          /* Prevent layout shift and optimize rendering */
          h1 {
            font-synthesis: none;
            text-rendering: optimizeSpeed;
            contain: layout style paint;
            content-visibility: auto;
          }

          /* Global optimizations */
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: var(--font-geist-sans), system-ui, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
          }

          /* Layout containment for performance */
          main {
            contain: layout style;
          }

          /* Reduce network dependency chain CSS */
          .navbar-optimized {
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 1000;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(220, 20, 60, 0.1);
            contain: layout style paint;
          }

          /* Critical page load styles */
          .hero-section {
            min-height: 80vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            contain: layout style;
            content-visibility: auto;
          }
        `,
        }}
      />
    </>
  );
}
