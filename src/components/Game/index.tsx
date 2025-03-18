'use client';

import React, { useEffect, useRef, useState } from 'react';
import { 
  Engine, 
  DisplayMode, 
  Color, 
  PointerScope
} from 'excalibur';
import { GameEngine } from './engine';
import { MainScene } from './scenes/MainScene';
import styles from './Game.module.css';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

export interface GameProps {
  characterId?: number;
  characterName?: string;
  characterClass?: string;
  level?: number;
  initialX?: number;
  initialY?: number;
}

// Game error fallback component
function GameErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  console.error("Game Component Error:", error);
  
  return (
    <div role="alert" style={{ 
      padding: '20px', 
      backgroundColor: '#f8d7da', 
      color: '#721c24',
      margin: '20px',
      borderRadius: '5px'
    }}>
      <h2>Game Error:</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{error.message}</pre>
      <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>{error.stack}</pre>
      <button 
        onClick={resetErrorBoundary}
        style={{
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          padding: '10px 15px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        Try again
      </button>
    </div>
  );
}

const Game: React.FC<GameProps> = ({
  characterId = 1,
  characterName = 'Player',
  characterClass = 'warrior',
  level = 1,
  initialX = 400,
  initialY = 300
}) => {
  const gameCanvasRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log("🎮 Game Component Mounting", { 
      characterId, characterName, characterClass, level, initialX, initialY 
    });

    if (!gameCanvasRef.current) {
      console.error("Canvas ref is null, cannot initialize game");
      return;
    }

    try {
      // Initialize Excalibur engine
      console.log("🎮 Creating game engine");
      const engine = new GameEngine({
        width: 800,
        height: 600,
        displayMode: DisplayMode.FillScreen,
        canvasElementId: 'game-canvas',
        pointerScope: PointerScope.Canvas,
        backgroundColor: Color.fromHex('#24292e'),
      });

      console.log("🎮 Initializing game with character info");
      // Initialize game with character info
      engine.initializeGame({
        characterId,
        characterName,
        characterClass,
        level,
        position: { x: initialX, y: initialY }
      });

      console.log("🎮 Creating main scene");
      // Create and add main scene
      const mainScene = new MainScene(engine);
      engine.addScene('main', mainScene);

      // Store engine reference right away so cleanup works properly
      engineRef.current = engine;
      
      console.log("🎮 Starting game engine");
      // Start the engine - this initializes the screen
      engine.start().then(() => {
        console.log("🎮 Engine started, going to main scene");
        // Go to the main scene immediately after the engine starts
        // Resources will load asynchronously
        engine.goToScene('main');
      }).catch(err => {
        console.error("🚨 Engine start error:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      });

      // Cleanup
      return () => {
        console.log("🎮 Game Component Unmounting");
        if (engineRef.current) {
          console.log("🎮 Stopping game engine");
          engineRef.current.stop();
          engineRef.current = null;
        }
      };
    } catch (err) {
      console.error("🚨 Game initialization error:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return () => {}; // Empty cleanup function in case of error
    }
  }, [characterId, characterName, characterClass, level, initialX, initialY]);

  if (error) {
    return (
      <div className={styles.gameError}>
        <h2>Failed to initialize game</h2>
        <p>{error.message}</p>
        <button onClick={() => setError(null)}>Retry</button>
      </div>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={GameErrorFallback}>
      <div className={styles.gameContainer} ref={gameCanvasRef}>
        <canvas id="game-canvas" className={styles.gameCanvas}></canvas>
        <div className={styles.gameDebug}>
          <p>Character: {characterName} (Lvl {level} {characterClass})</p>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Game; 