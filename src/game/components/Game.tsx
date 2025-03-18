'use client';

import { useEffect, useRef } from 'react';
import { engine } from '../engine/config';

export default function Game() {
  const gameInitialized = useRef(false);

  useEffect(() => {
    if (gameInitialized.current) return;
    gameInitialized.current = true;

    const startGame = async () => {
      try {
        // Start the game engine
        engine.start();
      } catch (error) {
        console.error('Failed to start game:', error);
      }
    };

    startGame();

    // Cleanup on unmount
    return () => {
      engine.stop();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <canvas id="game-canvas" className="w-full h-full" />
    </div>
  );
} 