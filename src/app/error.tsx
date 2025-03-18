'use client';

import { useEffect } from 'react';
import { Geist } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console for debugging
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className={`flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white p-4 ${geistSans.variable}`}>
      <div className="max-w-2xl w-full bg-slate-800 p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Something went wrong!</h1>
        
        <div className="bg-slate-700 p-4 rounded mb-4">
          <h2 className="font-semibold mb-2">Error Details:</h2>
          <p className="font-mono bg-slate-900 p-2 rounded">{error.message}</p>
          {error.digest && (
            <p className="mt-2 text-sm">Error ID: {error.digest}</p>
          )}
        </div>
        
        <div className="bg-slate-700 p-4 rounded mb-4">
          <h2 className="font-semibold mb-2">Stack Trace:</h2>
          <pre className="font-mono text-xs bg-slate-900 p-2 rounded overflow-auto max-h-40">
            {error.stack}
          </pre>
        </div>
        
        <button
          onClick={() => reset()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Try again
        </button>
      </div>
    </div>
  );
} 