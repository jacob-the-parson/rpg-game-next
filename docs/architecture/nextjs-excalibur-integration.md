# Next.js 15 + Excalibur.js Integration Guide

## Overview
This document outlines the integration approach for combining Next.js 15 with Excalibur.js for building a modern web game with robust UI capabilities.

## Technology Stack
- Next.js 15
- Excalibur.js (latest)
- TypeScript
- React 19 (optional, can use React 18)
- TailwindCSS (optional, for UI styling)

## Project Structure
```
your-game/
├── app/
│   ├── page.tsx              # Main game page
│   ├── layout.tsx            # Root layout
│   └── providers.tsx         # Context providers
├── components/
│   ├── Game/
│   │   ├── index.tsx        # Main game component (client)
│   │   ├── engine.ts        # Excalibur engine setup
│   │   ├── types.ts         # TypeScript types
│   │   └── scenes/          # Game scenes
│   └── UI/                  # React UI components
│       ├── HUD/             # In-game HUD components
│       ├── Menu/            # Game menu components
│       └── Overlay/         # Overlay components
├── game/
│   ├── actors/             # Game actors/entities
│   ├── scenes/             # Game scenes
│   ├── systems/            # Game systems
│   └── constants.ts        # Game constants
└── public/
    └── assets/            # Game assets
```

## Key Configuration Files

### Next.js Configuration
```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Handle canvas in SSR
    config.externals = [...(config.externals || []), { canvas: 'canvas' }]
    return config
  },
  experimental: {
    // Optional: React compiler
    reactCompiler: false,
  }
}

module.exports = nextConfig
```

### TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Core Components

### Game Component
```typescript
// components/Game/index.tsx
'use client'

import { useEffect, useRef } from 'react'
import { Engine, DisplayMode } from 'excalibur'
import { initializeGame } from './engine'

export const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const game = new Engine({
      canvasElement: canvasRef.current,
      displayMode: DisplayMode.FillScreen,
    })

    // Initialize game
    initializeGame(game)

    // Start game
    game.start()

    return () => {
      game.stop()
    }
  }, [])

  return <canvas ref={canvasRef} />
}
```

### Game Engine Setup
```typescript
// components/Game/engine.ts
import { Engine, Scene } from 'excalibur'
import { MainScene } from '@/game/scenes/MainScene'

export const initializeGame = (game: Engine) => {
  // Initialize scenes
  const mainScene = new MainScene()
  game.add('main', mainScene)

  // Set initial scene
  game.goToScene('main')

  // Add global event handlers
  game.input.keyboard.on('press', (evt) => {
    // Handle keyboard input
  })
}
```

### Page Implementation
```typescript
// app/page.tsx
import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the Game component with no SSR
const Game = dynamic(
  () => import('@/components/Game').then(mod => mod.Game),
  { ssr: false }
)

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<div>Loading game...</div>}>
        <Game />
      </Suspense>
    </main>
  )
}
```

## State Management

### Game State
```typescript
// game/state/GameState.ts
import { createContext, useContext } from 'react'

export interface GameState {
  score: number
  lives: number
  level: number
}

export const GameStateContext = createContext<{
  state: GameState
  setState: (state: Partial<GameState>) => void
} | null>(null)

export const useGameState = () => {
  const context = useContext(GameStateContext)
  if (!context) {
    throw new Error('useGameState must be used within GameStateProvider')
  }
  return context
}
```

## Integration Patterns

### 1. UI Overlay Pattern
Use React components positioned absolutely over the canvas for UI elements:
```typescript
// components/UI/Overlay/HUD.tsx
'use client'

export const HUD = () => {
  const { state } = useGameState()
  
  return (
    <div className="absolute top-0 left-0 p-4">
      <div>Score: {state.score}</div>
      <div>Lives: {state.lives}</div>
    </div>
  )
}
```

### 2. Event Communication
Use custom events to communicate between Excalibur and React:
```typescript
// game/events/GameEvents.ts
export const GAME_EVENTS = {
  SCORE_UPDATED: 'score:updated',
  LIFE_LOST: 'life:lost',
  GAME_OVER: 'game:over',
}

// In your game scene:
this.events.emit(GAME_EVENTS.SCORE_UPDATED, newScore)

// In your React component:
useEffect(() => {
  const handler = (score: number) => {
    setGameState(prev => ({ ...prev, score }))
  }
  game.events.on(GAME_EVENTS.SCORE_UPDATED, handler)
  return () => {
    game.events.off(GAME_EVENTS.SCORE_UPDATED, handler)
  }
}, [])
```

## Performance Considerations

1. **Canvas Rendering**
   - Use `requestAnimationFrame` for smooth animations
   - Implement proper cleanup in useEffect
   - Consider using `offscreenCanvas` for worker thread rendering

2. **React Components**
   - Memoize expensive components
   - Use `React.lazy` for code splitting
   - Implement proper error boundaries

3. **Asset Loading**
   - Preload essential assets
   - Use dynamic imports for scenes
   - Implement proper loading states

## Development Workflow

1. Start development server:
```bash
npm run dev
```

2. Build for production:
```bash
npm run build
```

3. Run production build:
```bash
npm start
```

## Common Issues and Solutions

1. **Canvas SSR Issues**
   - Use dynamic imports with `ssr: false`
   - Handle canvas properly in webpack config

2. **State Management**
   - Use React context for global state
   - Implement proper state synchronization

3. **Performance**
   - Profile with React DevTools
   - Monitor FPS and memory usage
   - Implement proper garbage collection

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Excalibur.js Documentation](https://excaliburjs.com/docs)
- [React Game Development](https://reactjs.org/docs/concurrent-mode.html)
- [Canvas Performance](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)

## Next Steps

1. Implement basic game scene
2. Add UI components
3. Set up state management
4. Add asset loading
5. Implement game logic
6. Add sound effects
7. Optimize performance
8. Add multiplayer support 