export default function NotFound() {
  return (
    <main className="max-w-2xl mx-auto p-8 text-center bg-crimson-light text-crimson-dark rounded-xl shadow">
      <h1 className="text-4xl font-bold mb-4 text-crimson">404 - Page Not Found</h1>
      <p className="mb-4">Sorry, the page you are looking for does not exist.</p>
      <a href="/" className="text-crimson underline">
        Return Home
      </a>
    </main>
  );
}
