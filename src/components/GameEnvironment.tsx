'use client';

import dynamic from 'next/dynamic';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorMonitor from './ErrorMonitor';
import Logger from '@/lib/logger';

// Import game component with no SSR (client-side only)
const GameComponent = dynamic(() => import('@/components/Game'), { ssr: false });

interface GameErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function GameErrorFallback({ error, resetErrorBoundary }: GameErrorFallbackProps) {
  Logger.error("Game Error:", error);
  
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 flex items-center justify-center">
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

interface GameEnvironmentProps {
  characterId?: number;
  characterName?: string;
  characterClass?: string;
  level?: number;
  initialX?: number;
  initialY?: number;
}

export default function GameEnvironment({
  characterId = 1,
  characterName = "TestPlayer",
  characterClass = "warrior",
  level = 1,
  initialX = 400,
  initialY = 300
}: GameEnvironmentProps) {
  return (
    <ErrorBoundary FallbackComponent={GameErrorFallback}>
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900">
        <GameComponent 
          characterId={characterId}
          characterName={characterName}
          characterClass={characterClass}
          level={level}
          initialX={initialX}
          initialY={initialY}
        />
        <ErrorMonitor />
      </main>
    </ErrorBoundary>
  );
} 