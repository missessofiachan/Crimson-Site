'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {}, [error]);

  return (
    <main className="max-w-2xl mx-auto p-8 text-center bg-gray-100 text-gray-900 rounded-xl shadow">
      <h1 className="text-4xl font-bold mb-4 text-red-700">500 - Something Went Wrong</h1>
      <p className="mb-4 text-gray-800">An unexpected error occurred. Please try again later.</p>
      <button
        onClick={() => reset()}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mr-4"
      >
        Try Again
      </button>
      <Link href="/" className="text-primary underline">
        Return Home
      </Link>
    </main>
  );
}
