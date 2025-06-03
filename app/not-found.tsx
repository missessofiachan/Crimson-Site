import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="max-w-2xl mx-auto p-8 text-center bg-gray-100 text-gray-900 rounded-xl shadow">
      <h1 className="text-4xl font-bold mb-4 text-primary">404 - Page Not Found</h1>
      <p className="mb-4 text-gray-800">Sorry, the page you are looking for does not exist.</p>
      <Link href="/" className="text-primary underline">
        Return Home
      </Link>
    </main>
  );
}
