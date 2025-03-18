# RPG Game Next

A multiplayer RPG game built with Next.js 15, Excalibur.js, and SpacetimeDB with AI-powered NPCs.

## Overview

- Modern web-based RPG with top-down 2D perspective
- Built on Next.js 15 with App Router and React 19
- Excalibur.js for game engine capabilities
- SpacetimeDB for real-time multiplayer backend
- AI-powered NPCs and dynamic narrative

## Current Status

- ✅ Basic project setup with Next.js 15 and Excalibur.js
- ✅ Initial game scene and rendering pipeline
- ✅ Development environment configuration
- 🚧 SpacetimeDB integration (currently using mock data)
- 🚧 Player character sprite system
- 📝 Planned: AI NPC system integration

## Quick Start

```bash
# Clone and enter the repository
git clone git@github.com:jacob-the-parson/rpg-game-next.git
cd rpg-game-next

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000/game](http://localhost:3000/game) in your browser.

## Setting Up SpacetimeDB

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

## Asset Setup

The game uses custom sprite assets located in `/public/assets/`. To set up your character:

1. Navigate to `/public/assets/characters/`
2. Use the provided Character Generator tool in `/public/assets/tools/` to create custom sprites
3. Export sprites to the appropriate directory
4. Update character configuration in `/src/game/config/character.ts`

## Documentation

Comprehensive documentation is available in the [docs folder](./docs).

- [Project Overview](./docs/README.md)
- [Project Roadmap](./docs/project-roadmap.md)
- [Troubleshooting Guide](./docs/troubleshooting/README.md)

## Development Scripts

- `npm run dev` - Start the Next.js development server
- `npm run build` - Build the production application
- `npm run start` - Start the production server
- `npm run spacetime:start` - Start the local SpacetimeDB server
- `npm run spacetime:deploy` - Deploy backend to local SpacetimeDB

## Troubleshooting

If you encounter any issues:

1. Check the [Troubleshooting Guide](./docs/troubleshooting/README.md)
2. Make sure you're running the latest version of Node.js and npm
3. Verify that all dependencies are installed correctly

## License

MIT 