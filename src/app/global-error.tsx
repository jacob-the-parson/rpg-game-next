'use client';

import { useEffect } from 'react';
import { Geist } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="en" suppressHydrationWarning className={geistSans.variable}>
      <head />
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#111827',
          color: 'white',
          padding: '1rem'
        }}>
          <div style={{
            maxWidth: '42rem',
            width: '100%',
            background: '#1f2937',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}>
            <h1 style={{ 
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#f87171'
            }}>
              Critical Application Error
            </h1>
            
            <div style={{
              background: '#374151',
              padding: '1rem',
              borderRadius: '0.375rem',
              marginBottom: '1rem'
            }}>
              <h2 style={{ 
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>
                Error Details:
              </h2>
              <p style={{
                fontFamily: 'monospace',
                background: '#111827',
                padding: '0.5rem',
                borderRadius: '0.375rem'
              }}>
                {error.message}
              </p>
              {error.digest && (
                <p style={{
                  marginTop: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#9ca3af'
                }}>
                  Error ID: {error.digest}
                </p>
              )}
            </div>
            
            <div style={{
              background: '#374151',
              padding: '1rem',
              borderRadius: '0.375rem',
              marginBottom: '1rem'
            }}>
              <h2 style={{
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>
                Stack Trace:
              </h2>
              <pre style={{
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                background: '#111827',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                overflow: 'auto',
                maxHeight: '10rem',
                color: '#d1d5db'
              }}>
                {error.stack}
              </pre>
            </div>
            
            <p style={{ marginBottom: '1rem', color: '#9ca3af' }}>
              This is a critical error that affects the entire application. Try refreshing the page or clicking the button below.
            </p>
            
            <button
              onClick={() => reset()}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                fontWeight: 'bold',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
} 