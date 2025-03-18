'use client';

import { ReactNode } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import Logger from '@/lib/logger';
import ErrorMonitor from './ErrorMonitor';

// Game error fallback component
function GameErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  Logger.error("Game Error:", error);
  
  return (
    <div 
      className="min-h-screen bg-slate-900 text-white p-6 flex items-center justify-center"
    >
      <div className="bg-slate-800 p-6 rounded-lg shadow-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-red-400 mb-4">Game Error</h2>
        <div className="bg-slate-700 p-4 rounded mb-4">
          <pre className="whitespace-pre-wrap break-words text-sm">{error.message}</pre>
        </div>
        <div className="bg-slate-700 p-4 rounded mb-4 max-h-40 overflow-auto">
          <pre className="whitespace-pre-wrap break-words text-xs">{error.stack}</pre>
        </div>
        <button 
          onClick={resetErrorBoundary}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

export default function GameErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={GameErrorFallback}>
      {children}
      <ErrorMonitor />
    </ErrorBoundary>
  );
} 