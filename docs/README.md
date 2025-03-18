# RPG Game Next - Project Overview

## Current Development Focus

> 🚧 **Active Development Areas**
> - SpacetimeDB integration (moving from mock data to real-time)
> - Player character sprite system and animations
> 
> ⚠️ If you're contributing, please note:
> - The mock data layer in `src/game/mock` will be replaced soon
> - Player sprite implementation in `src/game/entities/Player.ts` is being refactored
> - Core game engine setup is stable and ready for building upon

## Quick Start vs Full Setup

### Quick Start (Mock Data)
If you just want to run the game and start developing:
```bash
git clone git@github.com:jacob-the-parson/rpg-game-next.git
cd rpg-game-next
npm install
npm run dev
```
This will run with mock data - perfect for UI work and basic feature development.

### Full Setup (With Multiplayer)
For full multiplayer functionality, you'll need SpacetimeDB:
1. Follow the [SpacetimeDB Setup](#setting-up-spacetimedb) section below
2. Read `docs/multiplayer/README.md` for architecture details
3. See `src/backend/README.md` for schema information

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

## Current Status

- ✅ Basic project setup with Next.js 15 and Excalibur.js
- ✅ Initial game scene and rendering pipeline
- ✅ Development environment configuration
- ✅ GitHub repository setup with SSH
- ✅ Character Generator tool integrated
- ✅ Asset organization structure defined
- 🚧 SpacetimeDB integration (currently using mock data)
- 🚧 Player character sprite system
- 📝 Planned: AI NPC system integration

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git with SSH access configured
- SpacetimeDB CLI tool (for backend services)

### Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:jacob-the-parson/rpg-game-next.git
   cd rpg-game-next
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the development environment:

```bash
npm run dev
```

This will start the Next.js development server at http://localhost:3000/game.

### Setting Up SpacetimeDB

Currently, the game uses mock data for development. To set up real-time multiplayer:

1. Install SpacetimeDB CLI:
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://spacetime.dev/install.sh | sh
   ```

2. Start the local SpacetimeDB server:
   ```bash
   npm run spacetime:start
   ```

3. Deploy the backend module:
   ```bash
   npm run spacetime:deploy
   ```

## Game Architecture

The game is built using a combination of Next.js and Excalibur.js:

- **Client-Side Game Component**: Located in `src/components/Game/index.tsx`
- **Game Engine**: Custom extension of Excalibur's Engine class in `src/game/engine/`
- **Player Entity**: Defined in `src/game/entities/Player.ts`
- **Main Scene**: Set up in `src/game/scenes/MainScene.ts`
- **Multiplayer Integration**: Using SpacetimeDB for real-time state synchronization

## Asset Setup

The game uses custom sprite assets located in `/public/assets/`. To set up your character:

1. Navigate to `/public/assets/characters/`
2. Use the provided Character Generator tool in `/public/assets/tools/`
3. Export sprites to the appropriate directory
4. Update character configuration in `/src/game/config/character.ts`

## Development Scripts

- `npm run dev` - Start the Next.js development server
- `npm run build` - Build the production application
- `npm run start` - Start the production server
- `npm run spacetime:start` - Start the local SpacetimeDB server
- `npm run spacetime:deploy` - Deploy backend to local SpacetimeDB

## Development Workflow

### Code Organization
- Game logic lives in `src/game/`
- React components for UI in `src/components/`
- SpacetimeDB backend code in `src/backend/`
- Assets and tools in `public/assets/`

### Making Changes
1. **Game Engine Changes**
   - Core engine modifications go in `src/game/engine/`
   - New game systems should be added to `src/game/systems/`
   - Entity changes belong in `src/game/entities/`

2. **UI Changes**
   - Game UI components go in `src/game/components/`
   - General UI components in `src/components/`
   - Use TailwindCSS for styling

3. **Asset Changes**
   - Use the Character Generator in `public/assets/tools/` for sprites
   - Follow the structure in `public/assets/` for new assets
   - Update relevant config in `src/game/config/`

### Testing Changes
1. Start with mock data enabled (default)
2. Test with SpacetimeDB if making multiplayer changes
3. Check mobile responsiveness
4. Verify performance (especially for render-heavy changes)

### Common Tasks
- **Adding a new game entity**: Create in `src/game/entities/`, register in scene
- **Modifying player behavior**: Update `src/game/entities/Player.ts`
- **Adding UI elements**: Create component in `src/game/components/`
- **Changing game config**: Modify files in `src/game/config/`

## Troubleshooting

If you encounter issues:

1. Check the [Troubleshooting Guide](./troubleshooting/README.md)
2. Make sure you're running the latest version of Node.js and npm
3. Verify that all dependencies are installed correctly
4. For SpacetimeDB issues:
   - Ensure the SpacetimeDB server is running
   - Check if the backend module is deployed
   - Verify network connectivity

## Next Steps

See the [Project Roadmap](./project-roadmap.md) for detailed information about:
- Current development priorities
- Upcoming features
- Technical considerations
- Long-term vision
