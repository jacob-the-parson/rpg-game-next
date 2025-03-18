# Excalibur.js Integration

This document outlines how the Excalibur.js game engine is integrated into our Next.js application.

## Overview

The integration combines Excalibur.js, a 2D game engine for TypeScript, with Next.js, a React framework. We use React components to initialize and manage the game engine while leveraging Next.js for routing and server-side rendering capabilities.

## Architecture

```
src/
├── components/
│   └── Game/                  # Main Game component folder
│       ├── index.tsx          # Root Game component 
│       ├── engine.ts          # Custom Engine configuration
│       ├── entities/          # Game entity definitions
│       │   └── Player.ts      # Player entity
│       └── scenes/            # Game scene definitions
│           └── MainScene.ts   # Main game scene
├── game/                      # Game logic implementation
└── app/
    └── game/                  # Game page using App Router
        └── page.tsx           # Game page component
```

## Game Component Initialization

The game is initialized in a React component that handles:
1. Creating and configuring the Excalibur Engine
2. Managing the canvas lifecycle (mounting, unmounting)
3. Registering scenes and entities

```typescript
// src/components/Game/index.tsx (simplified)
'use client';

import { useEffect, useRef } from 'react';
import { GameEngine } from './engine';
import { MainScene } from './scenes/MainScene';

export function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Initialize engine
    const engine = new GameEngine({ 
      canvasElement: canvasRef.current,
      width: 800,
      height: 600
    });
    
    // Add scenes
    engine.addScene('main', new MainScene());
    
    // Start the engine
    engine.start('main').then(() => {
      console.log('Game engine started');
    });
    
    engineRef.current = engine;
    
    // Cleanup on unmount
    return () => {
      engine.stop();
    };
  }, []);

  return <canvas ref={canvasRef} />;
}
```

## Custom Engine Extension

We extend Excalibur's Engine class to add custom functionality:

```typescript
// src/components/Game/engine.ts
import { Engine, EngineOptions } from 'excalibur';

export class GameEngine extends Engine {
  constructor(options: EngineOptions) {
    super(options);
    
    // Additional initialization
    this.showDebug(false);
    this.enableCapturePointerMove(true);
    
    // Global event handlers
    this.on('visible', () => {
      this.start();
    });
    
    this.on('hidden', () => {
      this.stop();
    });
  }
  
  // Custom methods
  // ...
}
```

## Scenes and Entities

Game components are organized following Excalibur's architecture:

### Scenes

```typescript
// src/components/Game/scenes/MainScene.ts
import { Scene, Engine, Vector } from 'excalibur';
import { Player } from '../entities/Player';

export class MainScene extends Scene {
  onInitialize(engine: Engine) {
    // Create player entity
    const player = new Player();
    player.pos = new Vector(400, 300);
    
    // Add to scene
    this.add(player);
    
    // Set up camera to follow player
    engine.currentScene.camera.strategy.lockToActor(player);
  }
}
```

### Entities

```typescript
// src/components/Game/entities/Player.ts
import { Actor, Engine, Vector, Input, CollisionType } from 'excalibur';

export class Player extends Actor {
  constructor() {
    super({
      width: 32,
      height: 32,
      color: ex.Color.Red,
      collisionType: CollisionType.Active
    });
  }
  
  onInitialize(engine: Engine) {
    // Initialize animations, sprites, etc.
  }
  
  onPreUpdate(engine: Engine, delta: number) {
    // Handle player input
    const speed = 150;
    const vel = new Vector(0, 0);
    
    if (engine.input.keyboard.isHeld(Input.Keys.W)) {
      vel.y = -speed;
    }
    if (engine.input.keyboard.isHeld(Input.Keys.S)) {
      vel.y = speed;
    }
    if (engine.input.keyboard.isHeld(Input.Keys.A)) {
      vel.x = -speed;
    }
    if (engine.input.keyboard.isHeld(Input.Keys.D)) {
      vel.x = speed;
    }
    
    this.vel = vel;
  }
}
```

## Page Integration

The Game component is rendered within a Next.js page:

```typescript
// src/app/game/page.tsx
import { Game } from '@/components/Game';

export default function GamePage() {
  return (
    <div className="game-container">
      <Game />
    </div>
  );
}
```

## Asset Loading

Excalibur's resource loader is used to handle game assets:

```typescript
// src/components/Game/resources.ts
import { ImageSource, Loader } from 'excalibur';

// Define resources
const Resources = {
  PlayerSprite: new ImageSource('/assets/characters/player/character.png'),
  TilesetSprite: new ImageSource('/assets/tilesets/exterior/tileset.png'),
  // ...
};

// Create and configure loader
const loader = new Loader();
for (const [_, resource] of Object.entries(Resources)) {
  loader.addResource(resource);
}

export { Resources, loader };
```

## SpacetimeDB Integration

For multiplayer features, we integrate SpacetimeDB with Excalibur:

```typescript
// src/lib/spacetime.ts (simplified)
import { SpacetimeDBClient } from '@clockworklabs/spacetimedb-typescript-sdk';
import { GameEngine } from '@/components/Game/engine';

export class SpacetimeManager {
  private client: SpacetimeDBClient;
  private engine: GameEngine;
  
  constructor(engine: GameEngine) {
    this.engine = engine;
    this.client = new SpacetimeDBClient();
  }
  
  connect(address: string) {
    this.client.connect(address);
    
    // Set up event handlers
    this.client.on('connected', () => {
      console.log('Connected to SpacetimeDB');
    });
    
    // Register reducers for handling server events
    // ...
  }
  
  // Methods for game state synchronization
  // ...
}
```

## Troubleshooting Common Issues

1. **Canvas Not Showing**: Ensure the canvas has proper CSS styling with a defined width and height.

2. **Game Loop Performance**: Use `requestAnimationFrame` for the game loop and consider disabling the loop when the game tab is not active.

3. **Asset Loading Errors**: Verify that asset paths are correct and accessible from the public directory.

4. **Input Handling Issues**: Keyboard input can conflict with browser shortcuts; consider using `preventDefault()` on certain key events.

5. **Memory Leaks**: Always clean up event handlers and stop the engine when components unmount.

## Resources

- [Excalibur.js Documentation](https://excaliburjs.com/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [SpacetimeDB Documentation](https://spacetimedb.com/docs) 