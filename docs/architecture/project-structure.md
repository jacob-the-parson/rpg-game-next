# Project Structure

## Overview

The RPG Game Next project follows a modern Next.js App Router architecture integrated with SpacetimeDB for real-time multiplayer functionality. This document outlines the project structure and organization.

## Directory Structure

```
rpg-game-next/
├── app/                    # Next.js App Router directory
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Landing/Login page
│   ├── game/              # Game routes
│   │   ├── page.tsx      # Main game view
│   │   └── layout.tsx    # Game layout with game providers
│   └── character/         # Character management routes
│       ├── create/       # Character creation
│       └── select/       # Character selection
├── src/
│   ├── components/        # React components
│   │   ├── auth/         # Authentication components
│   │   ├── game/         # Game-specific components
│   │   │   ├── entities/ # Game entities (Player, NPC, etc.)
│   │   │   ├── ui/      # Game UI components
│   │   │   └── world/   # World and map components
│   │   └── shared/       # Shared/common components
│   ├── lib/              # Core libraries and utilities
│   │   ├── spacetime.ts  # SpacetimeDB service
│   │   └── utils/        # Utility functions
│   ├── hooks/            # Custom React hooks
│   │   ├── useAuth.ts    # Authentication hooks
│   │   ├── useGame.ts    # Game state hooks
│   │   └── useCharacter.ts # Character management hooks
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
│   ├── assets/          # Game assets
│   │   ├── characters/  # Character sprites
│   │   ├── tiles/      # Map tiles
│   │   └── ui/         # UI assets
│   └── fonts/          # Custom fonts
├── docs/                # Documentation
│   ├── architecture/   # Architecture documentation
│   ├── apis/          # API documentation
│   └── troubleshooting/ # Troubleshooting guides
├── scripts/            # Build and utility scripts
└── rpg-game-module/    # SpacetimeDB module (Rust)
    ├── src/           # Module source code
    └── schema/        # Database schema
```

## Key Components

### 1. SpacetimeDB Integration

#### Service Layer (`src/lib/spacetime.ts`)
```typescript
// Singleton service for SpacetimeDB operations
export class SpacetimeService {
  // Connection management
  connect(): Promise<void>
  disconnect(): void
  
  // Authentication
  registerUser(username: string): void
  login(identity: string): void
  
  // Character management
  createCharacter(params: CharacterCreationParams): Promise<number>
  getCharacters(): Promise<Character[]>
}
```

#### Database Schema
```sql
-- Core game tables
CREATE TABLE Users ( ... );
CREATE TABLE Characters ( ... );
CREATE TABLE Sessions ( ... );
```

### 2. Authentication System

#### Components
- `src/components/auth/LoginForm.tsx`
- `src/components/auth/RegisterForm.tsx`
- `src/components/auth/AuthProvider.tsx`

#### Hooks
```typescript
// src/hooks/useAuth.ts
export const useAuth = () => {
  const login = (username: string) => { ... }
  const register = (username: string) => { ... }
  const logout = () => { ... }
  return { user, login, register, logout }
}
```

### 3. Game Components

#### Core Game Components
- `src/components/game/GameCanvas.tsx`
- `src/components/game/GameProvider.tsx`
- `src/components/game/entities/Player.tsx`

#### World Components
- `src/components/game/world/Map.tsx`
- `src/components/game/world/Tile.tsx`
- `src/components/game/world/Collision.tsx`

#### UI Components
- `src/components/game/ui/HUD.tsx`
- `src/components/game/ui/Inventory.tsx`
- `src/components/game/ui/Chat.tsx`

## State Management

### 1. Authentication State
```typescript
interface AuthState {
  user: User | null;
  identity: string | null;
  isLoading: boolean;
  error: Error | null;
}
```

### 2. Game State
```typescript
interface GameState {
  player: Player;
  characters: Character[];
  worldState: WorldState;
  inventory: InventoryItem[];
}
```

### 3. Character State
```typescript
interface CharacterState {
  selectedCharacter: Character | null;
  characters: Character[];
  isLoading: boolean;
}
```

## Build Configuration

### Next.js Configuration (`next.config.ts`)
```typescript
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  // ... other config
};
```

### Environment Variables
```env
NEXT_PUBLIC_USE_REAL_SPACETIMEDB=true
NEXT_PUBLIC_SPACETIME_SERVER=http://127.0.0.1:3000
NEXT_PUBLIC_SPACETIME_MODULE=rpg-game-next
```

## Development Workflow

### 1. Local Development
```bash
# Start development server
npm run dev

# Start SpacetimeDB module
cd rpg-game-module
cargo run
```

### 2. Building for Production
```bash
# Build Next.js app
npm run build

# Build SpacetimeDB module
cd rpg-game-module
cargo build --release
```

### 3. Testing
```bash
# Run tests
npm test

# Run e2e tests
npm run e2e
```

## Best Practices

### 1. Component Organization
- Keep components small and focused
- Use TypeScript for all components
- Follow React best practices
- Implement proper error boundaries

### 2. State Management
- Use SpacetimeDB for shared state
- Use React hooks for local state
- Implement proper loading states
- Handle errors gracefully

### 3. Code Style
- Follow TypeScript best practices
- Use ESLint and Prettier
- Write meaningful comments
- Keep code DRY

### 4. Performance
- Optimize component renders
- Implement proper memoization
- Use proper loading strategies
- Optimize asset loading

## Future Considerations

### 1. Scalability
- Implement proper caching
- Optimize database queries
- Add connection pooling
- Implement proper sharding

### 2. Security
- Add proper authentication
- Implement rate limiting
- Add input validation
- Implement proper access control

### 3. Monitoring
- Add proper logging
- Implement error tracking
- Add performance monitoring
- Set up alerting 