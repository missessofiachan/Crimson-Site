// Critical resource hints for improved LCP performance
export default function CriticalResourceHints() {
  return (
    <>
      {/* Font preconnections for faster loading */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* DNS prefetch for external resources */}
      <link rel="dns-prefetch" href="https://res.cloudinary.com" />

      {/* Critical CSS for above-the-fold content to reduce render blocking */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          /* Inline critical CSS for LCP element */
          .text-4xl { 
            font-size: 2.25rem; 
            line-height: 2.5rem; 
            font-display: swap;
          }
          .font-bold { 
            font-weight: 700; 
            font-display: swap;
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
          .text-crimson-dark { color: var(--crimson-dark); }
          .will-change-transform { 
            will-change: transform;
            transform: translateZ(0);
          }
          .underline { text-decoration-line: underline; }
          .bg-crimson { background-color: var(--crimson); }
          .text-white { color: rgb(255 255 255); }
          .rounded-lg { border-radius: 0.5rem; }
          .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
          .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
          .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
          .font-semibold { font-weight: 600; }
          .mt-2 { margin-top: 0.5rem; }
          .pt-24 { padding-top: 6rem; }
          
          /* Optimize font rendering for performance */
          html {
            font-display: swap;
          }
          
          /* Prevent layout shift */
          h1 {
            font-synthesis: none;
            text-rendering: optimizeSpeed;
          }
        `,
        }}
      />
    </>
  );
}
