# RPG Game Developer Handoff Document

## Documentation Structure

All project documentation can be found in the `docs/` directory at the root of the project. Here's a guide to the key documentation:

### Core Documentation
1. Project Structure: `docs/architecture/project-structure.md`
   - Complete directory structure
   - Key components overview
   - State management patterns
   - Build configuration

2. SpacetimeDB Integration: `docs/architecture/spacetimedb.md`
   - Database schema
   - Connection management
   - Event system
   - Security considerations

3. Authentication Flow: `docs/auth-flow.md`
   - Current implementation status
   - Known issues
   - Required changes
   - Implementation TODOs

4. API Documentation: `docs/api.md`
   - SpacetimeDB service API
   - WebSocket protocol
   - Event system
   - Error handling

5. Troubleshooting: `docs/troubleshooting/README.md`
   - Common issues and solutions
   - Debugging steps
   - Error messages
   - Quick fixes

### Additional Resources
- AI Integration: `docs/apis/ai-integration.md`
- Project Roadmap: `docs/project-roadmap.md`
- Module Comparison: `docs/module-comparison.md`

## Tech Stack Overview

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS for styling

### Backend
- SpacetimeDB for real-time database and WebSocket connections
- Identity-based authentication system
- WebSocket-based real-time communication

## Current Implementation State

### SpacetimeDB Integration
- Successfully connecting to SpacetimeDB at `ws://127.0.0.1:3000`
- Identity generation working correctly
- WebSocket connection established and maintained
- Module name: `rpg-game-next`

### Authentication System
- Currently using SpacetimeDB's identity-based system
- No password authentication implemented yet
- Identity tokens are being generated and stored
- Registration flow exists but needs proper implementation
- Login flow currently piggybacks on registration (needs fixing)

### Database Tables
1. Users Table
   - Stores user information
   - Fields: identity, username, created_at, last_login

2. Characters Table
   - Currently not initializing properly
   - Should store: id, userIdentity, name, class, level, position, etc.
   - Needs proper initialization and subscription setup

3. Sessions Table
   - Tracks active user sessions
   - Fields: identity, character_id, connected_at, last_activity

## Environment Setup

```env
NEXT_PUBLIC_USE_REAL_SPACETIMEDB=true
NEXT_PUBLIC_SPACETIME_SERVER=http://127.0.0.1:3000
NEXT_PUBLIC_SPACETIME_MODULE=rpg-game-next
```

## Priority Action Items

### 1. Authentication Flow (High Priority)
See `docs/auth-flow.md` for detailed implementation requirements.

### 2. Database Setup (High Priority)
See `docs/architecture/spacetimedb.md` for schema and setup details.

### 3. User Experience (Medium Priority)
See `docs/architecture/project-structure.md` for component organization.

## Implementation Notes

### SpacetimeDB Service
- Located in `src/lib/spacetime.ts`
- Singleton pattern implementation
- Handles both mock and real database connections
- Event-based communication system

### Current Authentication Flow
```typescript
// Current connection flow
1. Frontend loads
2. SpacetimeDB connection established
3. Identity generated
4. User data attempted to be loaded
5. Character table fails to initialize
```

### Known Issues
1. Empty username registration
2. Missing character table
3. Improper login/registration separation
4. Missing form validation
5. No error handling
6. No loading states

## Getting Started

1. Review the documentation in order:
   - Project Structure (`docs/architecture/project-structure.md`)
   - SpacetimeDB Integration (`docs/architecture/spacetimedb.md`)
   - Authentication Flow (`docs/auth-flow.md`)
   - API Documentation (`docs/api.md`)

2. Set up your development environment:
   ```bash
   npm install
   cp .env.example .env.local
   # Configure your .env.local
   npm run dev
   ```

3. Start with the authentication flow fixes:
   - See `docs/auth-flow.md` for detailed requirements
   - Check `docs/troubleshooting/README.md` for common issues

4. For any issues:
   - Check `docs/troubleshooting/README.md`
   - Review relevant documentation in `docs/`
   - Contact the team for support

## Additional Notes

- All documentation is maintained in the `docs/` directory
- Each subsystem has its own dedicated documentation file
- The project structure document serves as the main reference
- Troubleshooting guide is regularly updated with new solutions

Remember to update documentation as you make changes to the system.

## Development Guidelines

### 1. State Management
- Use SpacetimeDB for real-time state
- Implement proper local state management for UI
- Consider adding state persistence for session management

### 2. Error Handling
- Add proper error boundaries
- Implement meaningful error messages
- Add retry mechanisms for failed operations

### 3. Testing
- Add unit tests for authentication flow
- Implement integration tests for database operations
- Add E2E tests for critical paths

## Next Steps

### Immediate Tasks
1. Create proper login form component
2. Fix character table initialization
3. Implement proper error handling
4. Add loading states

### Short-term Goals
1. Complete authentication system
2. Fix database table subscriptions
3. Implement proper form validation
4. Add user feedback system

### Long-term Considerations
1. Add password authentication
2. Implement session management
3. Add rate limiting
4. Consider adding 2FA

## Useful Commands

```bash
# Start development server
npm run dev

# Build production
npm run build

# Run tests (when implemented)
npm test
```

## Additional Resources
- [SpacetimeDB Documentation](https://spacetimedb.com/docs)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## Contact Points
- Document any team contacts or resources here
- Add links to relevant documentation
- Include any specific team guidelines

Remember to update this document as the implementation progresses. 