'use client';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {}, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-6xl font-bold text-red-700 mb-4">500</h1>
      <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-6">An unexpected error occurred. Please try again later.</p>
      <button
        onClick={() => reset()}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Try Again
      </button>
    </div>
  );
}
