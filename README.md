# RPG Game Next

A multiplayer RPG game built with Next.js and SpacetimeDB, featuring real-time interactions and persistent game state.

## 🎮 Features

- Real-time multiplayer interactions
- Character creation and customization
- Identity-based authentication system
- Persistent game state
- Modern, responsive UI

## 🛠 Tech Stack

### Frontend
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- React Server Components

### Backend
- SpacetimeDB (Real-time database)
- WebSocket communication
- Identity-based authentication

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- SpacetimeDB CLI installed
- Git

### Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_USE_REAL_SPACETIMEDB=true
NEXT_PUBLIC_SPACETIME_SERVER=http://127.0.0.1:3000
NEXT_PUBLIC_SPACETIME_MODULE=rpg-game-next
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/rpg-game-next.git
cd rpg-game-next
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗 Project Structure

```
rpg-game-next/
├── app/                    # Next.js app directory
├── components/             # React components
├── lib/                    # Utility functions and services
│   └── spacetime.ts       # SpacetimeDB service
├── public/                 # Static assets
├── styles/                # Global styles
└── docs/                  # Documentation
```

## 📚 Documentation

- [Developer Handoff](docs/dev-handoff.md) - Comprehensive development guide
- [Authentication Flow](docs/auth-flow.md) - Authentication system documentation
- [API Documentation](docs/api.md) - API endpoints and usage
- [Contributing Guide](docs/CONTRIBUTING.md) - Guidelines for contributors

## 🧪 Development

### Running Tests
```bash
npm test        # Run unit tests
npm run e2e     # Run end-to-end tests
```

### Building for Production
```bash
npm run build   # Create production build
npm start       # Start production server
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- SpacetimeDB team for the real-time database
- Next.js team for the amazing framework
- All contributors who have helped shape this project 