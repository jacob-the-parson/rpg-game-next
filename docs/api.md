# API Documentation

## SpacetimeDB Integration

### Connection

The game uses SpacetimeDB for real-time database operations and WebSocket communication. The connection is managed through the `SpacetimeService` singleton class.

```typescript
// Get SpacetimeDB service instance
const spacetime = SpacetimeService.getInstance();

// Connect to SpacetimeDB
await spacetime.connect();
```

### Authentication

#### User Registration
```typescript
// Register a new user
spacetime.registerUser(username: string): void
```

#### User Login
```typescript
// Login with identity
spacetime.login(identity: string): void
```

### Character Management

#### Create Character
```typescript
interface CharacterCreationParams {
  name: string;
  class: string;
  appearance: {
    skin: string;
    hair: string;
    eyes: string;
    outfit: string;
  }
}

spacetime.createCharacter(params: CharacterCreationParams): Promise<number>
```

#### Get Characters
```typescript
// Get all characters for current user
spacetime.getCharacters(): Promise<Character[]>
```

### Game State

#### Position Updates
```typescript
interface Position {
  x: number;
  y: number;
  direction: 'up' | 'down' | 'left' | 'right';
}

spacetime.updatePosition(characterId: number, position: Position): void
```

## Database Schema

### Users Table
```sql
CREATE TABLE Users (
  identity TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  created_at BIGINT NOT NULL,
  last_login BIGINT NOT NULL
);
```

### Characters Table
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

### Sessions Table
```sql
CREATE TABLE Sessions (
  identity TEXT PRIMARY KEY,
  character_id BIGINT NOT NULL,
  connected_at BIGINT NOT NULL,
  last_activity BIGINT NOT NULL,
  FOREIGN KEY (character_id) REFERENCES Characters(id)
);
```

## Event System

The game uses a custom event system for real-time updates:

### Connection Events
- `spacetimedb-connected`: Fired when connection is established
- `spacetimedb-disconnected`: Fired when connection is lost
- `spacetimedb-error`: Fired when an error occurs

### Authentication Events
- `spacetimedb-identity-changed`: Fired when user identity changes
- `spacetimedb-user-registered`: Fired when user registration completes

### Game Events
- `character-created`: Fired when a new character is created
- `position-updated`: Fired when a character's position changes
- `character-loaded`: Fired when character data is loaded

## Error Handling

All API methods can throw the following errors:

```typescript
class SpacetimeDBError extends Error {
  code: string;
  details?: any;
}
```

Common error codes:
- `CONNECTION_ERROR`: Failed to connect to SpacetimeDB
- `AUTH_ERROR`: Authentication failed
- `VALIDATION_ERROR`: Invalid input data
- `DATABASE_ERROR`: Database operation failed

## WebSocket Protocol

The game uses WebSocket for real-time communication:

1. Initial Connection:
```typescript
ws://localhost:3000/
```

2. Message Format:
```typescript
interface WebSocketMessage {
  type: string;
  payload: any;
}
```

3. Heartbeat:
- Client sends ping every 30 seconds
- Server responds with pong
- Connection considered dead after 90 seconds of no response

## Rate Limiting

- Authentication: 5 requests per minute
- Position updates: 20 updates per second
- Character creation: 2 requests per minute

## Development Guidelines

1. Always use the singleton instance:
```typescript
const spacetime = SpacetimeService.getInstance();
```

2. Handle connection errors:
```typescript
try {
  await spacetime.connect();
} catch (error) {
  console.error('Failed to connect:', error);
}
```

3. Listen for events:
```typescript
window.addEventListener('spacetimedb-connected', () => {
  console.log('Connected to SpacetimeDB');
});
```

4. Clean up event listeners:
```typescript
useEffect(() => {
  const handler = () => {
    // Handle event
  };
  window.addEventListener('event-name', handler);
  return () => window.removeEventListener('event-name', handler);
}, []);
``` 