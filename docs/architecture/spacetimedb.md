# SpaceTimeDB for Game Development

## Overview
SpaceTimeDB is a unique database system that combines both database and server functionality into one. It's specifically designed for real-time applications like games, offering high performance and simplified architecture.

## Key Features

### Performance
- Extremely low latency (~100 μs/Tx)
- High throughput (~1,000,000 Tx/s)
- In-memory state with persistent commit log
- 5,000,000 updates per second capability

### Game-Specific Features
- Real-time player position updates
- Built for massive multiplayer games (powers BitCraft MMORPG)
- Time-travel capability (full transaction history)
- Real-time subscription queries
- Perfect for game state synchronization

### Architecture Benefits
- No separate game server needed
- Clients connect directly to database
- Built-in authorization and permissions
- Serverless deployment
- Automatic scaling
- No need for:
  - Docker
  - Kubernetes
  - VMs
  - Microservices
  - Complex ops infrastructure

### Technical Features
- ACID compliant
- Relational database structure
- SQL-style query language
- Real-time subscription queries
- Point-in-time rollbacks
- Transaction log replay
- State snapshots
- Secure atomic transactions

## Language Support

### Server-side
- Rust (Primary)
- C# (Experimental)
- TypeScript (Planned)
- Python (Planned)
- C++ (Planned)
- Lua (Planned)

### Client-side
- Rust
- C#
- TypeScript
- Python (Planned)
- C++ (Planned)
- Lua (Planned)

## Implementation Strategy for Our RPG

### Game State Management
1. Player positions and movement
2. NPC states and behavior
3. Combat system
4. Inventory management
5. Quest progress
6. World state

### Real-time Features
1. Player movement synchronization
2. Combat interactions
3. Chat system
4. Player interactions
5. World events

### Data Models
```sql
-- Example schema structure
CREATE TABLE Players (
    id TEXT PRIMARY KEY,
    position_x FLOAT,
    position_y FLOAT,
    health INT,
    state TEXT
);

CREATE TABLE NPCs (
    id TEXT PRIMARY KEY,
    type TEXT,
    position_x FLOAT,
    position_y FLOAT,
    state TEXT
);

CREATE TABLE WorldState (
    region_id TEXT PRIMARY KEY,
    state JSON,
    last_updated TIMESTAMP
);
```

## Security Considerations
- Built-in authentication (OIDC)
- Programmable permissions
- Secure atomic transactions
- Public key identities
- Delegated authority

## Monitoring and Debugging
- Full transaction history
- Point-in-time rollbacks
- State snapshots
- Transaction log replay
- PostgreSQL OLAP queries for analytics 

# SpacetimeDB Architecture

## Overview

SpacetimeDB serves as our real-time database and state management solution, providing:
- Real-time data synchronization
- Identity-based authentication
- WebSocket communication
- Table subscriptions
- Event system

## Implementation

### Service Layer

The SpacetimeDB service is implemented as a singleton pattern in `src/lib/spacetime.ts`:

```typescript
export class SpacetimeService {
  private static instance: SpacetimeService;
  private client: SpacetimeConnection | null = null;
  private connected: boolean = false;
  private identity: string | null = null;

  public static getInstance(): SpacetimeService {
    if (!SpacetimeService.instance) {
      SpacetimeService.instance = new SpacetimeService();
    }
    return SpacetimeService.instance;
  }
}
```

### Database Schema

#### Users Table
```sql
CREATE TABLE Users (
  identity TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  created_at BIGINT NOT NULL,
  last_login BIGINT NOT NULL
);
```

#### Characters Table
```sql
CREATE TABLE Characters (
  id BIGINT PRIMARY KEY,
  user_identity TEXT NOT NULL,
  name TEXT NOT NULL,
  class TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  position_x INTEGER NOT NULL DEFAULT 0,
  position_y INTEGER NOT NULL DEFAULT 0,
  direction TEXT NOT NULL DEFAULT 'down',
  created_at BIGINT NOT NULL,
  last_updated BIGINT NOT NULL,
  FOREIGN KEY (user_identity) REFERENCES Users(identity)
);
```

#### Sessions Table
```sql
CREATE TABLE Sessions (
  identity TEXT PRIMARY KEY,
  character_id BIGINT NOT NULL,
  connected_at BIGINT NOT NULL,
  last_activity BIGINT NOT NULL,
  FOREIGN KEY (character_id) REFERENCES Characters(id)
);
```

## Connection Flow

1. Initial Connection:
```typescript
// Connect to SpacetimeDB
await spacetime.connect();

// Connection URL
ws://127.0.0.1:3000
```

2. Identity Management:
```typescript
// Identity is generated on first connection
identity: string = "c200bd3339d5d5ee94294dbbf6f5647ae85e73e0372a0105b407e2940139c85c"

// Identity is persisted across sessions
localStorage.setItem('spacetime_identity', identity);
```

3. Table Subscriptions:
```typescript
// Subscribe to all game state tables
spacetimeDBSetup.subscribeToGameState(client);
```

## Event System

### Connection Events
```typescript
window.addEventListener('spacetimedb-connected', () => {
  // Handle connection established
});

window.addEventListener('spacetimedb-disconnected', () => {
  // Handle connection lost
});

window.addEventListener('spacetimedb-error', (event) => {
  // Handle connection error
  const error = event.detail.error;
});
```

### Authentication Events
```typescript
window.addEventListener('spacetimedb-identity-changed', (event) => {
  const { identity } = event.detail;
});

window.addEventListener('spacetimedb-user-registered', (event) => {
  const { username } = event.detail;
});
```

## Current Implementation Status

### Working Features
✅ WebSocket connection
✅ Identity generation
✅ Event system
✅ Basic table structure

### Known Issues
❌ Character table not initializing properly
❌ Missing proper error handling
❌ Incomplete table subscriptions
❌ Login/Registration flow needs separation

## Security Considerations

1. Identity Management
   - Identities are cryptographically secure
   - Stored securely in localStorage
   - No password system currently implemented

2. Connection Security
   - WebSocket connection over ws:// (consider wss://)
   - Rate limiting needed for operations
   - Need proper session management

3. Data Access
   - Row-level security needed
   - Proper access control implementation required
   - Input validation needed

## Best Practices

1. Always use the singleton instance:
```typescript
const spacetime = SpacetimeService.getInstance();
```

2. Handle connection errors:
```typescript
try {
  await spacetime.connect();
} catch (error) {
  console.error('Connection failed:', error);
}
```

3. Clean up event listeners:
```typescript
useEffect(() => {
  const handler = () => {
    // Handle event
  };
  window.addEventListener('event-name', handler);
  return () => window.removeEventListener('event-name', handler);
}, []);
```

## Future Improvements

1. Authentication
   - Add password-based authentication
   - Implement proper session management
   - Add 2FA support

2. Data Security
   - Implement row-level security
   - Add proper access control
   - Implement rate limiting

3. Error Handling
   - Add comprehensive error handling
   - Implement retry mechanisms
   - Add proper logging

4. Performance
   - Optimize table subscriptions
   - Implement connection pooling
   - Add caching layer

## Development Guidelines

1. Table Modifications
   - Always update schema documentation
   - Consider backwards compatibility
   - Add proper migrations

2. Event Handling
   - Document all new events
   - Clean up event listeners
   - Use TypeScript for event payloads

3. Testing
   - Add unit tests for database operations
   - Test connection edge cases
   - Validate table constraints 