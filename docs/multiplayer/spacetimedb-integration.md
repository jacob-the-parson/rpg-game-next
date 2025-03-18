# SpacetimeDB Integration for Multiplayer

This document explains how SpacetimeDB is integrated into our RPG game to enable real-time multiplayer functionality.

## Overview

SpacetimeDB is a real-time database specifically designed for multiplayer games. It provides:

- Automatic synchronization of game state between clients
- Persistent storage for player data
- Transactions for atomic operations
- Real-time event subscriptions

## Architecture

```
src/
├── backend/                  # SpacetimeDB backend code
│   └── schema.ts             # Database schema definition
├── lib/
│   └── spacetime.ts          # Client-side integration
└── components/
    └── Game/
        └── entities/
            └── RemotePlayer.ts  # Remote player representation
```

## Database Schema

The database schema defines the data model for our game:

```typescript
// src/backend/schema.ts
import { Identity, ClientRequest, Table, Reducer } from '@clockworklabs/spacetimedb-typescript-sdk';

// Define tables for game data
@Table()
export class Player {
  @primaryKey()
  id: string;
  
  identity: Identity;
  username: string;
  x: number;
  y: number;
  direction: string;
  characterType: string;
  lastUpdated: number;
}

@Table()
export class GameSession {
  @primaryKey()
  id: string;
  
  name: string;
  maxPlayers: number;
  createdAt: number;
}

// Define reducers (server-side methods)
export class GameReducers {
  @Reducer()
  static createPlayer(ctx: ClientRequest, username: string, characterType: string): string {
    const playerId = generateId();
    SpacetimeDB.insert<Player>({
      id: playerId,
      identity: ctx.identity,
      username,
      x: 0,
      y: 0,
      direction: 'down',
      characterType,
      lastUpdated: Date.now()
    });
    return playerId;
  }
  
  @Reducer()
  static updatePlayerPosition(ctx: ClientRequest, playerId: string, x: number, y: number, direction: string): void {
    // Verify the player belongs to this client
    const player = SpacetimeDB.one<Player>(p => p.id === playerId && p.identity === ctx.identity);
    if (!player) return;
    
    // Update position
    SpacetimeDB.update<Player>(
      player => player.id === playerId,
      player => {
        player.x = x;
        player.y = y;
        player.direction = direction;
        player.lastUpdated = Date.now();
      }
    );
  }
  
  @Reducer()
  static leaveGame(ctx: ClientRequest, playerId: string): void {
    SpacetimeDB.delete<Player>(player => player.id === playerId && player.identity === ctx.identity);
  }
}
```

## Client Integration

### SpacetimeDB Client Setup

```typescript
// src/lib/spacetime.ts
import { SpacetimeDBClient, ReducerEvent } from '@clockworklabs/spacetimedb-typescript-sdk';
import { GameEngine } from '@/components/Game/engine';
import { RemotePlayer } from '@/components/Game/entities/RemotePlayer';
import { EventEmitter } from 'events';

export class SpacetimeManager extends EventEmitter {
  private client: SpacetimeDBClient;
  private engine: GameEngine;
  private playerId: string | null = null;
  private remotePlayers: Map<string, RemotePlayer> = new Map();
  
  constructor(engine: GameEngine) {
    super();
    this.engine = engine;
    this.client = new SpacetimeDBClient();
    
    // Set up subscription handlers
    this.setupSubscriptions();
  }
  
  connect(address: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.on('connected', () => {
        console.log('Connected to SpacetimeDB');
        resolve();
      });
      
      this.client.on('error', (err) => {
        console.error('SpacetimeDB connection error:', err);
        reject(err);
      });
      
      this.client.connect(address);
    });
  }
  
  private setupSubscriptions() {
    // Handle player table updates
    this.client.subscribe<Player>((event, player) => {
      switch (event) {
        case ReducerEvent.Insert:
          this.handlePlayerJoin(player);
          break;
        case ReducerEvent.Update:
          this.handlePlayerUpdate(player);
          break;
        case ReducerEvent.Delete:
          this.handlePlayerLeave(player);
          break;
      }
    });
  }
  
  private handlePlayerJoin(player: Player) {
    // Skip our own player
    if (player.id === this.playerId) return;
    
    // Create a new remote player entity
    const remotePlayer = new RemotePlayer(player);
    this.remotePlayers.set(player.id, remotePlayer);
    
    // Add to the current scene
    const currentScene = this.engine.currentScene;
    if (currentScene) {
      currentScene.add(remotePlayer);
    }
  }
  
  private handlePlayerUpdate(player: Player) {
    // Skip our own player
    if (player.id === this.playerId) return;
    
    // Update existing remote player
    const remotePlayer = this.remotePlayers.get(player.id);
    if (remotePlayer) {
      remotePlayer.updateFromServer(player);
    }
  }
  
  private handlePlayerLeave(player: Player) {
    // Remove remote player
    const remotePlayer = this.remotePlayers.get(player.id);
    if (remotePlayer) {
      const currentScene = this.engine.currentScene;
      if (currentScene) {
        currentScene.remove(remotePlayer);
      }
      this.remotePlayers.delete(player.id);
    }
  }
  
  // Method to register a new player
  async registerPlayer(username: string, characterType: string): Promise<string> {
    const playerId = await this.client.call<string>('GameReducers', 'createPlayer', [username, characterType]);
    this.playerId = playerId;
    return playerId;
  }
  
  // Method to update player position
  updatePlayerPosition(x: number, y: number, direction: string) {
    if (!this.playerId) return;
    
    this.client.call('GameReducers', 'updatePlayerPosition', [this.playerId, x, y, direction]);
  }
  
  // Method to leave the game
  leaveGame() {
    if (!this.playerId) return;
    
    this.client.call('GameReducers', 'leaveGame', [this.playerId]);
    this.playerId = null;
  }
  
  // Clean up resources
  disconnect() {
    this.client.disconnect();
    this.remotePlayers.clear();
  }
}
```

### Integration with Player Entity

The player entity needs to send position updates to SpacetimeDB:

```typescript
// src/components/Game/entities/Player.ts
import { Actor, Engine, Vector, Input } from 'excalibur';
import { SpacetimeManager } from '@/lib/spacetime';

export class Player extends Actor {
  private spacetime: SpacetimeManager;
  private lastReportedPosition: Vector;
  private direction: string = 'down';
  
  constructor(spacetime: SpacetimeManager) {
    super({
      width: 32,
      height: 32,
      // ...
    });
    
    this.spacetime = spacetime;
    this.lastReportedPosition = new Vector(0, 0);
  }
  
  // ... other methods ...
  
  onPostUpdate(engine: Engine, delta: number) {
    // Determine current direction
    if (this.vel.x > 0) this.direction = 'right';
    else if (this.vel.x < 0) this.direction = 'left';
    else if (this.vel.y > 0) this.direction = 'down';
    else if (this.vel.y < 0) this.direction = 'up';
    
    // Send position updates to server if position has changed significantly
    const positionDelta = this.pos.distance(this.lastReportedPosition);
    if (positionDelta > 5) {
      this.spacetime.updatePlayerPosition(this.pos.x, this.pos.y, this.direction);
      this.lastReportedPosition = this.pos.clone();
    }
  }
}
```

### Remote Player Implementation

```typescript
// src/components/Game/entities/RemotePlayer.ts
import { Actor, Engine, Vector, Color } from 'excalibur';
import { Player } from '@/backend/schema'; // Import from schema

export class RemotePlayer extends Actor {
  private targetPos: Vector;
  private serverPlayer: Player;
  private playerLabel: Label;
  
  constructor(serverPlayer: Player) {
    super({
      width: 32,
      height: 32,
      pos: new Vector(serverPlayer.x, serverPlayer.y),
      color: Color.Blue,
      // ...
    });
    
    this.serverPlayer = serverPlayer;
    this.targetPos = new Vector(serverPlayer.x, serverPlayer.y);
    
    // Add player label (username)
    this.playerLabel = new Label({
      text: serverPlayer.username,
      pos: new Vector(0, -20),
      font: '10px Arial',
      color: Color.White
    });
    this.addChild(this.playerLabel);
  }
  
  updateFromServer(updatedPlayer: Player) {
    this.serverPlayer = updatedPlayer;
    this.targetPos = new Vector(updatedPlayer.x, updatedPlayer.y);
    
    // Update animation direction based on server update
    this.updateAnimation(updatedPlayer.direction);
  }
  
  private updateAnimation(direction: string) {
    // Switch animation based on direction
    // ...
  }
  
  onPreUpdate(engine: Engine, delta: number) {
    // Smoothly move towards target position
    const lerpFactor = 0.2;
    this.pos = this.pos.lerp(this.targetPos, lerpFactor);
  }
}
```

## Integration with Game Component

Finally, we tie everything together in the Game component:

```typescript
// src/components/Game/index.tsx (simplified with SpacetimeDB integration)
'use client';

import { useEffect, useRef } from 'react';
import { GameEngine } from './engine';
import { MainScene } from './scenes/MainScene';
import { SpacetimeManager } from '@/lib/spacetime';

export function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const spacetimeRef = useRef<SpacetimeManager | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Initialize engine
    const engine = new GameEngine({ 
      canvasElement: canvasRef.current,
      width: 800,
      height: 600
    });
    
    // Initialize SpacetimeDB connection
    const spacetime = new SpacetimeManager(engine);
    spacetime.connect(process.env.NEXT_PUBLIC_SPACETIME_SERVER || 'localhost:3000')
      .then(() => {
        // After connection, register player
        return spacetime.registerPlayer('Player' + Math.floor(Math.random() * 1000), 'default');
      })
      .then((playerId) => {
        console.log('Player registered with ID:', playerId);
        
        // Add main scene with player
        const mainScene = new MainScene(spacetime);
        engine.addScene('main', mainScene);
        
        // Start the engine
        return engine.start('main');
      })
      .catch(err => {
        console.error('Failed to initialize multiplayer:', err);
      });
    
    engineRef.current = engine;
    spacetimeRef.current = spacetime;
    
    // Cleanup on unmount
    return () => {
      if (spacetimeRef.current) {
        spacetimeRef.current.leaveGame();
        spacetimeRef.current.disconnect();
      }
      
      if (engineRef.current) {
        engineRef.current.stop();
      }
    };
  }, []);

  return <canvas ref={canvasRef} />;
}
```

## Deployment

For development and testing:

1. Run a local SpacetimeDB server:
   ```bash
   npm run spacetime:start
   ```

2. Publish the backend schema:
   ```bash
   npm run spacetime:deploy
   ```

3. For production, deploy to SpacetimeDB cloud:
   ```bash
   npm run spacetime:deploy:cloud
   ```

## Common Troubleshooting

1. **Connection Issues**: Ensure the SpacetimeDB server address is correctly set in `.env.local`.

2. **Authentication Errors**: Check that identity tokens are correctly handled.

3. **State Synchronization Lag**: Consider implementing client-side prediction and server reconciliation for smoother gameplay.

4. **Schema Mismatch**: After schema changes, republish the backend and restart clients.

5. **Performance Issues**: Optimize the frequency of position updates based on game needs. 