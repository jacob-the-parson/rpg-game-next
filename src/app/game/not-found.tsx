import Link from 'next/link';

export default function GameNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Game Page Not Found</h2>
        <p className="mb-8">Sorry, we couldn't find the game page you're looking for.</p>
        <div className="flex gap-4 justify-center">
          <Link 
            href="/game"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded inline-block"
          >
            Return to Game
          </Link>
          <Link 
            href="/"
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded inline-block"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 