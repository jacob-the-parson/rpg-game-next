# RPG Game

A modern web-based RPG game built with Next.js and Excalibur.js, featuring character customization, real-time movement, and sprite animations.

## Current State

✅ Implemented:
- Character movement system with WASD/arrow keys
- Sprite animations (walking, idle) in 4 directions
- Basic authentication flow
- Mock character system for testing
- SpacetimeDB integration foundation

🚧 In Progress:
- Full SpacetimeDB backend integration
- Tilemap implementation
- Collision detection

## Quick Start

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Run the development server:
```bash
npm run dev
```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
rpg-game-next/
├── src/
│   ├── components/
│   │   └── Game/              # Core game components
│   │       ├── entities/      # Game entities (Player, etc.)
│   │       ├── scenes/        # Game scenes
│   │       └── resources.ts   # Game resource management
│   ├── contexts/             # React contexts
│   ├── lib/                  # Utility libraries
│   ├── pages/               # Next.js pages
│   └── types/               # TypeScript definitions
├── public/
│   └── assets/              # Game assets
│       └── characters/      # Character sprites
└── docs/                    # Project documentation
```

## Tech Stack

- Next.js
- TypeScript
- Excalibur.js
- SpacetimeDB

## Development

See [DOCUMENTATION.md](./DOCUMENTATION.md) for detailed documentation, including:
- Technical details
- Development guidelines
- Planned features

## Testing

The game can be tested in two modes:
1. Mock mode (default) - Uses mock data for testing
2. SpacetimeDB mode - Requires SpacetimeDB setup

## License

MIT 