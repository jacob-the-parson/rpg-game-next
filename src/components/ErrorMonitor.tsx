'use client';

import { useEffect, useState } from 'react';
import Logger from '@/lib/logger';

interface ErrorMonitorProps {
  enableConsoleOverride?: boolean;
}

export default function ErrorMonitor({ enableConsoleOverride = true }: ErrorMonitorProps) {
  const [errors, setErrors] = useState<Array<{ message: string; timestamp: Date }>>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    Logger.info('ErrorMonitor: Initializing');
    
    // Override window.onerror
    const originalOnError = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      const errorMsg = `${message} (${source}:${lineno}:${colno})`;
      Logger.error('Unhandled error', { message, source, lineno, colno, error });
      
      setErrors(prev => [
        { message: errorMsg, timestamp: new Date() },
        ...prev.slice(0, 9) // Keep only the 10 most recent errors
      ]);
      
      // Call original handler
      if (typeof originalOnError === 'function') {
        return originalOnError(message, source, lineno, colno, error);
      }
      return false;
    };
    
    // Override window.onunhandledrejection
    const origUnhandledRejection = window.onunhandledrejection;
    
    // Use addEventListener instead of direct assignment for TypeScript compatibility
    const handleRejection = (event: PromiseRejectionEvent) => {
      const errorMsg = `Unhandled Promise Rejection: ${event.reason}`;
      Logger.error('Unhandled rejection', event.reason);
      
      setErrors(prev => [
        { message: errorMsg, timestamp: new Date() },
        ...prev.slice(0, 9)
      ]);
    };
    
    window.addEventListener('unhandledrejection', handleRejection);
    
    // Override console methods in development
    if (enableConsoleOverride && process.env.NODE_ENV === 'development') {
      const originalConsole = {
        error: console.error,
        warn: console.warn
      };
      
      console.error = (...args: any[]) => {
        const errorMsg = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');
        
        setErrors(prev => [
          { message: `Console Error: ${errorMsg}`, timestamp: new Date() },
          ...prev.slice(0, 9)
        ]);
        
        originalConsole.error(...args);
      };
      
      console.warn = (...args: any[]) => {
        const warnMsg = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');
        
        setErrors(prev => [
          { message: `Console Warning: ${warnMsg}`, timestamp: new Date() },
          ...prev.slice(0, 9)
        ]);
        
        originalConsole.warn(...args);
      };
      
      return () => {
        window.onerror = originalOnError;
        window.removeEventListener('unhandledrejection', handleRejection);
        console.error = originalConsole.error;
        console.warn = originalConsole.warn;
        
        Logger.info('ErrorMonitor: Cleanup complete');
      };
    }
    
    return () => {
      window.onerror = originalOnError;
      window.removeEventListener('unhandledrejection', handleRejection);
      
      Logger.info('ErrorMonitor: Cleanup complete');
    };
  }, [enableConsoleOverride]);
  
  // Toggle error monitor visibility
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  
  // Only render UI in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <>
      {/* Error monitor toggle button */}
      <button
        onClick={toggleVisibility}
        className={`fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 flex items-center justify-center shadow-lg ${
          errors.length > 0 ? 'bg-red-600' : 'bg-gray-700'
        } text-white`}
        title="Toggle Error Monitor"
      >
        {errors.length > 0 ? errors.length : '🔍'}
      </button>
      
      {/* Error monitor panel */}
      {isVisible && (
        <div className="fixed bottom-20 right-4 z-50 w-96 max-h-96 overflow-auto bg-gray-900 bg-opacity-90 text-white rounded-lg shadow-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Error Monitor</h3>
            <button 
              onClick={() => setErrors([])}
              className="text-xs bg-gray-700 px-2 py-1 rounded"
            >
              Clear
            </button>
          </div>
          
          {errors.length === 0 ? (
            <p className="text-gray-400 text-sm">No errors detected</p>
          ) : (
            <ul className="space-y-2">
              {errors.map((error, index) => (
                <li key={index} className="text-xs border-l-2 border-red-500 pl-2 py-1">
                  <div className="font-mono text-red-300 mb-1">
                    {error.timestamp.toLocaleTimeString()}
                  </div>
                  <div className="overflow-x-auto">{error.message}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
} 