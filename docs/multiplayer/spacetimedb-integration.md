# SpacetimeDB Integration for Multiplayer

This document explains how SpacetimeDB is integrated into our RPG game to enable real-time multiplayer functionality.

## Overview

SpacetimeDB is a real-time database specifically designed for multiplayer games. It provides:

- Automatic synchronization of game state between clients
- Persistent storage for player data
- Transactions for atomic operations
- Real-time event subscriptions
- Multi-column indexes for improved query performance
- Type-safe querying support
- Intelligent disk sync optimization

## Current Status: Mock Implementation with Migration Path

Currently, our game is running with a mock SpacetimeDB implementation that simulates the database operations locally. This approach allows development to proceed while we work on full SpacetimeDB integration.

The implementation features:
- Complete simulation of SpacetimeDB operations in memory
- Same data model and API surface as real SpacetimeDB
- Clear migration path to real SpacetimeDB
- Console indicators showing mock status: 🔶 Using mock SpacetimeDB service

## Installation & Setup

### 1. Install SpacetimeDB CLI

```bash
# Download and run the installer
curl -sSf https://install.spacetimedb.com | sh

# Add SpacetimeDB CLI to your PATH
export PATH="$HOME/.local/bin:$PATH"

# Verify installation
spacetime --version
```

You should see output similar to:
```
spacetime Path: /Users/username/.local/share/spacetime/bin/current/spacetimedb-cli
Commit: 4032a44686c41828ead7f59eac871c34267d4572
spacetimedb tool version 1.0.0; spacetimedb-lib version 1.0.0;
```

To make the PATH change permanent, add it to your shell configuration file (~/.zshrc, ~/.bashrc, etc.).

### 2. Start a Local SpacetimeDB Server

```bash
# Start the local SpacetimeDB server (runs on port 3000 by default)
spacetime start
```

### 3. Configure a Server Connection

```bash
# Add a server configuration with default settings
spacetime server add --url http://localhost:3000 --default local

# If the server isn't running yet, you might need to skip the fingerprint check
spacetime server add --url http://localhost:3000 --no-fingerprint --default local

# List configured servers
spacetime server list
```

### 4. Install SDK in Your Project

```bash
npm install @clockworklabs/spacetimedb-sdk
```

## SpacetimeDB CLI Commands

Here are the key SpacetimeDB CLI commands you'll use:

### Server Management

```bash
# List all server commands
spacetime server --help

# List saved server configurations
spacetime server list

# Set the default server
spacetime server set-default <nickname>

# Add a new server configuration
spacetime server add --url <url> [--default] <nickname>

# Remove a server configuration 
spacetime server remove <nickname>

# Check if a server is online
spacetime server ping [<nickname>]
```

### Module Management

```bash
# Initialize a new module
spacetime init <module-name>

# Build a module
spacetime build

# Publish/deploy a module
spacetime publish <module-name>

# View module logs
spacetime logs <module-name>

# Call a reducer function
spacetime call <module-name> <reducer-name> [args...]

# Execute SQL query
spacetime sql <module-name> "SELECT * FROM table"

# Generate client code
spacetime generate <module-name> --lang typescript --out ./generated
```

## Project Architecture

```
src/
├── backend/                  # SpacetimeDB backend code
│   └── schema.ts            # Database schema definition with mock implementation
├── lib/
│   └── spacetime.ts         # Client-side integration
└── components/
    └── Game/
        └── entities/
            └── RemotePlayer.ts  # Remote player representation
```

## Database Schema

The database schema defines the data model for our game:

```typescript
// src/backend/schema.ts

// User account table
class User {
  identity: Identity;
  username: string;
  createdAt: number;  // Unix timestamp
  lastLogin: number;  // Unix timestamp
}

// Character table
class Character {
  id: number;
  userIdentity: Identity;
  name: string;
  class: string;
  level: number;
  positionX: number;
  positionY: number;
  direction: string;
  createdAt: number;
  lastUpdated: number;
}

// Character appearance
class CharacterAppearance {
  characterId: number;
  skin: string;
  hair: string;
  eyes: string;
  outfit: string;
}

// Active player sessions
class Session {
  identity: Identity;
  characterId: number;
  address: Address;      // For device identification
  connectedAt: number;
  lastActivity: number;
}

// Auto-incrementing counter
class Counter {
  name: string;
  value: number;
}
```

## Integration Implementation

Our implementation provides both mock and real SpacetimeDB functionality through a consistent API that matches the current SpacetimeDB SDK:

```typescript
// src/backend/schema.ts
export const spacetimeDBSetup = {
  // Connect to SpacetimeDB
  connect: async (moduleAddress: string, onConnect?: () => void) => {
    // Mock implementation
    console.log(`🔶 Using mock SpacetimeDB service - would connect to ${moduleAddress}`);
    
    const connection = MockDbConnection.builder()
      .withUri('http://localhost:3000')
      .withModuleName(moduleAddress)
      .withToken('mock-token')
      .onConnect((conn, identity, token) => {
        console.log(`🔶 Mock connected with identity: ${identity.toHexString()}`);
        if (onConnect) onConnect();
      })
      .build();
    
    return connection;
  },
  
  // Query all game entities
  subscribeToGameState: (client: MockDbConnection) => {
    // Mock implementation
    console.log('🔶 Mock subscription to game state');
    
    // Subscribe to our tables
    client.subscriptionBuilder()
      .subscribe('SELECT * FROM User')
      .subscribe('SELECT * FROM Character')
      .subscribe('SELECT * FROM CharacterAppearance')
      .subscribe('SELECT * FROM Session');
  }
};
```

Our mock implementation mimics the builder pattern used by the real SpacetimeDB SDK:

```typescript
// Real SpacetimeDB client would look like this:
import { DbConnection } from './module_bindings';

const connection = DbConnection.builder()
  .withUri('ws://localhost:3000')
  .withModuleName('rpg-game-module')
  .onConnect((connection, identity, token) => {
    console.log('Connected to SpacetimeDB with identity:', identity.toHexString());
    // Subscribe to tables
    connection.subscriptionBuilder().subscribe('SELECT * FROM Character');
  })
  .withToken('auth-token')
  .build();
```

## Client-Side Usage

```typescript
// In your game component
import { spacetimeDBSetup } from '@/backend/schema';

// Inside component:
useEffect(() => {
  const setupMultiplayer = async () => {
    // Connect to SpacetimeDB (mock or real)
    const client = await spacetimeDBSetup.connect('rpg-game-module');
    
    // Subscribe to data
    spacetimeDBSetup.subscribeToGameState(client);
    
    // Ready to use client for game operations
    setSpacetimeClient(client);
  };
  
  setupMultiplayer();
  
  return () => {
    // Cleanup
    if (spacetimeClient) {
      spacetimeClient.disconnect();
    }
  };
}, []);
```

## Migration Plan to Full SpacetimeDB

1. **Phase 1: Local SpacetimeDB Server (Current Focus)**
   - Install and configure local SpacetimeDB server
   - Generate TypeScript bindings from schema
   - Update client code to use real SpacetimeDB connections

2. **Phase 2: Schema Migration**
   - Convert current schema to SpacetimeDB module format 
   - Create proper indexes and relationships
   - Deploy and test locally

3. **Phase 3: Production Deployment**
   - Deploy to SpacetimeDB Cloud
   - Configure environment variables for production vs development
   - Implement proper identity management

## Module Development

### Creating a New Module

> **Important Note**: SpacetimeDB modules can only be created in Rust or C# (not TypeScript directly). You'll define your data model and reducers in one of these languages, then generate TypeScript bindings for use in your Next.js application.

1. Initialize a module project using Rust (recommended):
   ```bash
   spacetime init --lang rust rpg-game-module
   cd rpg-game-module
   ```

   Or using C#:
   ```bash
   spacetime init --lang csharp rpg-game-module
   cd rpg-game-module
   ```

2. Edit the schema in `src/lib.rs` (for Rust) or `src/MyModule.cs` (for C#)

3. Build the module:
   ```bash
   spacetime build
   ```

4. Deploy to local SpacetimeDB:
   ```bash
   spacetime publish rpg-game-module
   ```

5. Generate client bindings:
   ```bash
   spacetime generate rpg-game-module --lang typescript --out ../src/generated
   ```

## Environment Configuration

```env
# .env.local
NEXT_PUBLIC_SPACETIME_SERVER=http://localhost:3000
NEXT_PUBLIC_SPACETIME_MODULE=rpg-game-module
```

## Common Troubleshooting

1. **Connection Issues**: 
   - Verify server status: `spacetime server ping local`
   - Check server configuration: `spacetime server list`
   - Ensure the server is running: `spacetime start`
   - Check if your module is deployed: `spacetime list`

2. **Authentication Errors**: 
   - Check your identity: `spacetime login --info` 
   - Create a new identity if needed: `spacetime login`

3. **State Synchronization**: 
   - Enable debug logging in client:
     ```typescript
     client.setDebugLevel('debug');
     ```
   - Monitor reducer logs: `spacetime logs rpg-game-module`

4. **Schema Updates**:
   - After schema changes: `spacetime publish rpg-game-module --update`
   - Monitor build issues: `spacetime build --verbose`

5. **Performance Optimization**:
   - Use multi-column indexes for frequent queries
   - Implement client-side prediction
   - Optimize update frequency
   - Monitor module performance
``` 