# RPG Game Next - Project Structure

## Current Project Structure

```
rpg-game-next/
├── app/                         # Next.js App Router pages
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
│   └── multiplayer/             # Multiplayer implementation
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

## Asset Structure

```
public/assets/
├── characters/
│   ├── npcs/                    # NPC character sprites
│   │   ├── 16x16/               # Small NPC sprites
│   │   ├── 32x32/               # Medium NPC sprites
│   │   └── 48x48/               # Large NPC sprites
│   ├── player/                  # Player character sprites
│   │   ├── char_a_p1/           # Base character set
│   │   │   ├── 1out/            # Outfit components
│   │   │   ├── 4har/            # Hair components
│   │   │   └── 5hat/            # Hat components
│   │   └── guides/              # Animation timing guides
│   └── combat/                  # Combat sprites
│       ├── 100x100/             # Large combat sprites
│       │   ├── base/            # Base combat animations
│       │   └── shadows/         # Shadow effects
│       └── base/                # Basic combat animations
├── tilesets/
│   ├── exterior/                # Outdoor environments
│   │   ├── characters/          # Environment-specific characters
│   │   ├── objects/             # Decorative objects
│   │   ├── particles/           # Environmental effects
│   │   └── tilesets/            # Terrain tiles
│   │       ├── floors/          # Ground tiles
│   │       └── walls/           # Wall tiles
│   └── interior/                # Indoor environments
│       ├── 16x16/               # Small interior tiles
│       ├── 32x32/               # Medium interior tiles
│       └── 48x48/               # Large interior tiles
└── tools/                       # Asset creation tools
    └── Character Generator/     # Character creation utility
```

## Source Code Structure

The source code is organized by feature and functionality:

```
src/
├── app/                        # Next.js app router files
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout component
│   └── page.tsx                # Main page component
├── backend/                    # SpacetimeDB backend schema
├── components/                 # React components
│   └── Game/                   # Game-specific components
│       ├── index.tsx           # Main game component
│       ├── engine.ts           # Excalibur engine setup
│       ├── entities/           # Game entity components
│       │   └── Player.ts       # Player entity
│       └── scenes/             # Game scene components
│           └── MainScene.ts    # Main game scene
├── contexts/                   # React contexts for state management
├── game/                       # Game implementation
│   ├── components/             # Game UI components
│   ├── engine/                 # Engine configuration
│   ├── entities/               # Entity definitions
│   ├── scenes/                 # Scene definitions
│   ├── systems/                # Game systems (combat, inventory, etc.)
│   └── utils/                  # Game utility functions
├── lib/                        # Shared utility libraries
│   └── spacetime.ts            # SpacetimeDB client setup
└── types/                      # TypeScript type definitions
```

## Documentation Structure

The documentation is organized by category:

```
docs/
├── README.md                   # Main documentation hub
├── project-roadmap.md          # Development roadmap
├── apis/                       # API integration documentation
├── architecture/               # System architecture documentation
│   └── project-structure.md    # This file
├── assets/                     # Asset documentation
├── engines/                    # Game engine documentation
├── inspiration/                # Game design inspiration
│   ├── concepts/               # Core game concepts
│   ├── mechanics/              # Gameplay mechanics
│   ├── narrative/              # Story elements
│   ├── references/             # External inspiration
│   └── visuals/                # Visual design docs
└── multiplayer/                # Multiplayer implementation
``` 