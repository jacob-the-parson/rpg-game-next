# RPG Game Next - Project Overview

## File Structure

```
rpg-game-next/
├── app/                         # Next.js App Router pages (DEPRECATED - USE SRC/APP)
│   └── game/                    # Game specific pages
├── docs/                        # Documentation
│   ├── apis/                    # API integration docs
│   ├── architecture/            # System architecture docs
│   ├── assets/                  # Asset documentation
│   ├── engines/                 # Game engine docs
│   ├── inspiration/             # Game design inspiration
│   │   ├── concepts/            # Core game concepts
│   │   ├── mechanics/           # Gameplay mechanics 
│   │   ├── narrative/           # Story elements
│   │   ├── references/          # External inspiration
│   │   └── visuals/             # Visual design docs
│   ├── multiplayer/             # Multiplayer implementation
│   └── troubleshooting/         # Common issues and solutions
├── public/                      # Static assets
│   └── assets/                  # Game assets
│       ├── characters/          # Character sprites
│       │   ├── combat/          # Combat specific sprites
│       │   ├── effects/         # Visual effects
│       │   ├── npcs/            # NPC sprites
│       │   └── player/          # Player character sprites
│       ├── tilesets/            # Environment tiles
│       │   ├── exterior/        # Outdoor environments
│       │   └── interior/        # Indoor environments
│       └── tools/               # Asset creation tools
├── scripts/                     # Development scripts
│   ├── deploy_backend.sh        # SpacetimeDB deployment
│   ├── dev_setup.sh             # Development environment setup
│   ├── run_spacetimedb.sh       # Local SpacetimeDB server
│   └── start_dev.sh             # Development starter
├── src/                         # Source code
│   ├── app/                     # Next.js app router files
│   ├── backend/                 # SpacetimeDB backend schema
│   ├── components/              # React components
│   │   └── Game/                # Game related components
│   │       ├── entities/        # Game entities
│   │       └── scenes/          # Game scenes
│   ├── contexts/                # React contexts
│   ├── game/                    # Game implementation
│   │   ├── components/          # Game UI components
│   │   ├── engine/              # Game engine integration
│   │   ├── entities/            # Game entity definitions
│   │   ├── scenes/              # Game scene definitions
│   │   ├── systems/             # Game systems
│   │   └── utils/               # Utility functions
│   ├── lib/                     # Utility libraries
│   └── types/                   # TypeScript type definitions
└── [config files]               # Various configuration files
```

## Technology Stack

- **Frontend Framework**: Next.js 15.2.3 with React 19
- **Game Engine**: Excalibur.js 0.30.3
- **Backend**: SpacetimeDB (TypeScript SDK v0.1.3)
- **Styling**: TailwindCSS 4
- **Language**: TypeScript 5

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- SpacetimeDB CLI tool (for backend services)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd rpg-game-next
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the setup script:
   ```bash
   npm run setup
   ```
   This will:
   - Install dependencies
   - Check for SpacetimeDB CLI
   - Create a default .env.local file if needed

### Development

To start the development environment:

```bash
# Basic development server
npm run dev

# Or the full development environment script
./scripts/start_dev.sh
```

This will start the Next.js development server at http://localhost:3000 with Turbopack enabled.

### Multiplayer Development

For development with multiplayer functionality:

1. Start the SpacetimeDB local server (in a separate terminal)
   ```bash
   npm run spacetime:start
   ```

2. Deploy backend to local SpacetimeDB (in a separate terminal)
   ```bash
   npm run spacetime:deploy
   ```

3. Run the frontend development server
   ```bash
   npm run dev
   ```

## Game Architecture

The game is built using a combination of Next.js and Excalibur.js:

- **Client-Side Game Component**: Located in `src/components/Game/index.tsx`, this is the main entry point for the game that runs in the browser.
- **Game Engine**: A custom extension of Excalibur's Engine class in `src/components/Game/engine.ts` that handles the core game loop.
- **Player Entity**: Defined in `src/components/Game/entities/Player.ts`, this handles player-specific logic.
- **Main Scene**: Set up in `src/components/Game/scenes/MainScene.ts`, this is the primary game world.
- **Multiplayer Integration**: Using SpacetimeDB for real-time state synchronization between players.

## Game Design Concepts

The game is being designed with these core elements:

1. **Game Style**: Top-down 2D RPG inspired by Stardew Valley's visual aesthetic with pixel art, modern lighting, and effects.

2. **Multiplayer Instances**:
   - Private Instances (Homes): Personal customizable spaces
   - Shared Instances (Town): Central hub for player interaction
   - Adventure Zones: Dynamic sharding system for exploration and combat

3. **Visual Style**:
   - Pixel art with modern lighting effects
   - Clear UI with intuitive navigation
   - Distinctive area themes
   - Weather and day/night cycle

4. **Asset Organization**:
   - Characters: Player and NPC sprites in various sizes (16x16, 32x32, 48x48)
   - Tilesets: Environment tiles for both interior and exterior settings
   - Props: Decorative objects and interactive items
   - Effects: Visual effects for spells, combat, and environment

## Asset Sources

The game uses various asset packs:

1. **Mystic Woods (Exterior Environment)**
   - Environmental tiles, props, and nature elements

2. **Modern Interiors (Interior Environment)**
   - Interior tileset, furniture, and indoor props

3. **Mana Seed Character Base (Player Characters)**
   - Base character sprites and animations

4. **Tiny RPG Character Pack (NPCs)**
   - NPC character sprites with animation sets

5. **Character Generator Tool**
   - Located in `public/assets/tools/`
   - Used to generate custom character sprites

## Development Status

- ✅ Next.js 15 with Turbopack setup
- ✅ Excalibur.js game engine integration
- ✅ SpacetimeDB SDK integration
- ✅ TypeScript declarations for development
- ✅ Basic player movement and controls
- ✅ Development environment scripts
- ❌ Complete world and map design
- ❌ Multiplayer interactions
- ❌ AI-powered NPCs
- ❌ Combat system
- ❌ Inventory and items
- ❌ Quest system

## Running the Game

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000/game in your browser

3. Game Controls:
   - WASD or Arrow Keys: Move character
   - Escape: Toggle game menu (coming soon)

## Troubleshooting

If you encounter issues:

1. Check the [Troubleshooting Guide](./troubleshooting/README.md) for common issues and solutions
2. Make sure all dependencies are installed: `npm install`
3. Check console for errors in the browser's developer tools
4. Ensure SpacetimeDB is running for multiplayer features
5. Verify your `.env.local` file has the correct configuration:
   ```
   NEXT_PUBLIC_SPACETIME_SERVER=localhost:3000
   ```

For SpacetimeDB connection issues:
1. Ensure the SpacetimeDB server is running
2. Verify the `NEXT_PUBLIC_SPACETIME_SERVER` environment variable is correct
3. Confirm you have published the backend schema

## Future Development Roadmap

1. Complete core gameplay features:
   - World design and map implementation
   - Character progression system
   - Inventory and item system
   
2. Implement multiplayer features:
   - Real-time player interactions
   - Shared world state
   - Chat system

3. Add AI-enhanced gameplay:
   - NPCs with dynamic behaviors
   - Procedural quests and narratives
   - Adaptive difficulty

4. Game systems:
   - Complete combat mechanics
   - Economy and trading
   - Crafting system
