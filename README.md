# RPG Game Next

A multiplayer RPG game built with Next.js 15, Excalibur.js, and SpacetimeDB with AI-powered NPCs.

## Overview

- Modern web-based RPG with top-down 2D perspective
- Built on Next.js 15 with App Router and React 19
- Excalibur.js for game engine capabilities
- SpacetimeDB for real-time multiplayer backend
- AI-powered NPCs and dynamic narrative

## Project Structure Note

This project uses the `/src/app` directory structure for the Next.js App Router. The `/app` directory has been deprecated and should not be used.

## Quick Start

```bash
# Clone and enter the repository
git clone <repository-url>
cd rpg-game-next

# Run the setup script
npm run setup

# Start the development server
npm run dev
```

Open [http://localhost:3000/game](http://localhost:3000/game) in your browser.

## Documentation

Comprehensive documentation is available in the [docs folder](./docs).

- [Project Overview](./docs/README.md)
- [Project Roadmap](./docs/project-roadmap.md)
- [Troubleshooting Guide](./docs/troubleshooting/README.md)

## Development Scripts

- `npm run dev` - Start the Next.js development server
- `npm run build` - Build the production application
- `npm run start` - Start the production server
- `npm run setup` - Set up the development environment
- `npm run spacetime:start` - Start the local SpacetimeDB server
- `npm run spacetime:deploy` - Deploy backend to local SpacetimeDB

## Troubleshooting

If you encounter any issues:

1. Check the [Troubleshooting Guide](./docs/troubleshooting/README.md)
2. Make sure you're running the latest version of Node.js and npm
3. Verify that all dependencies are installed correctly

## License

MIT 