# RPG Game Next Documentation

## Quick Start
1. [Project Overview](../README.md)
2. [Developer Handoff](./dev-handoff.md)
3. [Authentication Flow](./auth-flow.md)
4. [API Documentation](./api.md)

## Core Documentation

### Architecture
- [Project Structure](./architecture/project-structure.md)
  - Directory structure
  - Component organization
  - State management
  - Build configuration

- [SpacetimeDB Integration](./architecture/spacetimedb.md)
  - Database schema
  - Connection management
  - Event system
  - Security considerations

### Implementation
- [Authentication Flow](./auth-flow.md)
  - Current status
  - Known issues
  - Required changes
  - Implementation TODOs

- [API Documentation](./api.md)
  - SpacetimeDB service API
  - WebSocket protocol
  - Event system
  - Error handling

### Development
- [Troubleshooting Guide](./troubleshooting/README.md)
  - Common issues
  - Debugging steps
  - Error messages
  - Quick fixes

## Directory Structure

```
docs/
├── README.md                   # This file - Documentation index
├── dev-handoff.md             # Developer handoff guide
├── auth-flow.md               # Authentication implementation
├── api.md                     # API documentation
├── project-roadmap.md         # Project timeline and goals
├── module-comparison.md       # Technology comparisons
├── architecture/             # System architecture
│   ├── project-structure.md  # Project organization
│   ├── spacetimedb.md       # Database architecture
│   └── ...                  # Other architecture docs
├── apis/                    # API integrations
│   ├── ai-integration.md    # AI features
│   └── ...                 # Other API docs
├── troubleshooting/        # Issue resolution
│   ├── README.md           # Common issues
│   └── ...                # Specific issues
└── ...                    # Additional documentation
```

## Current Implementation Status

### Working Features
✅ SpacetimeDB Connection
- WebSocket connection established
- Identity generation
- Event system implementation

### In Progress
🚧 Authentication System
- Login/Registration separation
- Form validation
- Error handling

🚧 Database Setup
- Character table initialization
- Table subscriptions
- Data relationships

## Development Guidelines

### 1. Documentation Updates
- Keep documentation in sync with code changes
- Update relevant docs when adding features
- Add troubleshooting entries for new issues

### 2. Implementation Process
1. Review relevant documentation
2. Follow established patterns
3. Update documentation
4. Add troubleshooting if needed

### 3. Best Practices
- Follow TypeScript best practices
- Implement proper error handling
- Add appropriate loading states
- Write meaningful comments

## Getting Help

### 1. Documentation First
1. Check this index for relevant docs
2. Review troubleshooting guide
3. Check implementation guides

### 2. Common Resources
- [SpacetimeDB Documentation](https://spacetimedb.com/docs)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

### 3. Issue Resolution
1. Check `troubleshooting/README.md`
2. Review relevant implementation docs
3. Contact development team

## Contributing

1. Read the developer handoff document
2. Follow the implementation guides
3. Update documentation
4. Add troubleshooting entries

Remember to:
- Keep documentation up to date
- Follow established patterns
- Add troubleshooting for new issues
- Update this index when adding docs
