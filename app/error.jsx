'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">😅</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong!</h2>
        <p className="text-gray-600 mb-6">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
