# Troubleshooting Guide

This directory contains documentation for common issues and their solutions in the RPG Game project.

## Common Issues

### 1. Next.js App Router Issues

- [Root Layout Missing Tags Error](./root-layout-error-research.md) - How we resolved the issue with missing HTML tags in the root layout

### 2. Game Engine Issues

- Excalibur.js initialization problems
- Canvas rendering issues
- Asset loading failures

### 3. Authentication Issues

#### Empty Username Registration
**Symptom**: Login attempts trigger registration with empty username
```typescript
// Problematic code
register("");
```

**Solution**:
1. Implement proper login form
2. Separate login and registration flows
3. Add username validation

#### Character Table Not Available
**Symptom**: Warning in console: "Character table not available"
```
[Warning] Character table not available
[Log] Found 0 characters: []
```

**Solution**:
1. Ensure character table is properly initialized
2. Verify table subscriptions
3. Check database connection status

### 4. Connection Issues

#### WebSocket Connection
**Symptom**: Unable to connect to SpacetimeDB

**Checks**:
1. Verify SpacetimeDB server is running
2. Check WebSocket URL is correct
3. Verify environment variables:
```env
NEXT_PUBLIC_USE_REAL_SPACETIMEDB=true
NEXT_PUBLIC_SPACETIME_SERVER=http://127.0.0.1:3000
NEXT_PUBLIC_SPACETIME_MODULE=rpg-game-next
```

#### Identity Management
**Symptom**: Identity not persisting or changing unexpectedly

**Solution**:
1. Check localStorage for identity token
2. Verify identity event listeners
3. Check connection status

### 5. Database Issues

#### Table Initialization
**Symptom**: Tables not available or not properly initialized

**Solution**:
1. Check database schema
2. Verify table creation scripts
3. Check table subscriptions

#### Data Synchronization
**Symptom**: Real-time updates not working

**Solution**:
1. Verify WebSocket connection
2. Check event listeners
3. Verify table subscriptions

## Debugging Steps

### 1. Connection Debugging
```typescript
// Add these logs to spacetime.ts
console.log('Connecting to SpacetimeDB:', serverAddress);
console.log('Using server address:', SPACETIME_SERVER);
console.log('WebSocket readyState:', client?.ws?.readyState);
```

### 2. Authentication Debugging
```typescript
// Add these logs to auth flow
console.log('Current identity:', spacetime.getIdentity());
console.log('Registration status:', username);
console.log('User data:', userData);
```

### 3. Database Debugging
```typescript
// Add these logs to database operations
console.log('Table subscriptions:', client.subscriptions);
console.log('Character data:', characters);
console.log('Session data:', sessions);
```

## Error Messages

### Connection Errors
- "Failed to connect to SpacetimeDB"
- "WebSocket connection failed"
- "Unable to establish connection"

### Authentication Errors
- "User registration failed"
- "Invalid username"
- "Character table not available"

### Database Errors
- "Table not found"
- "Subscription failed"
- "Data synchronization error"

## Quick Fixes

### 1. Reset Connection
```typescript
// Reset SpacetimeDB connection
await spacetime.disconnect();
await spacetime.connect();
```

### 2. Clear Local Storage
```typescript
// Clear stored identity
localStorage.removeItem('spacetime_identity');
```

### 3. Reinitialize Tables
```typescript
// Reinitialize table subscriptions
spacetimeDBSetup.subscribeToGameState(client);
```

## Development Tools

### Console Commands
```typescript
// Check connection status
spacetime.isConnected()

// Check current identity
spacetime.getIdentity()

// Check table subscriptions
spacetime.getSubscriptions()
```

### Browser Tools
1. Check Network tab for WebSocket connection
2. Monitor Console for error messages
3. Check Application tab for localStorage

## Getting Help

1. Check documentation:
   - [SpacetimeDB Docs](docs/architecture/spacetimedb.md)
   - [Authentication Flow](docs/auth-flow.md)
   - [API Documentation](docs/api.md)

2. Common resources:
   - [SpacetimeDB GitHub](https://github.com/clockworklabs/SpacetimeDB)
   - [Next.js Documentation](https://nextjs.org/docs)

3. Contact:
   - Open an issue on GitHub
   - Contact the development team
   - Check the troubleshooting channel

## Troubleshooting Process

When encountering an issue, follow these steps:

1. **Identify the exact error message**: Copy the full error trace from the console
2. **Check existing documentation**: See if the issue has been documented in this folder
3. **Check component structure**: Verify that components are correctly organized
4. **Check API endpoints**: Ensure any API calls are properly structured
5. **Check browser console**: Look for any JavaScript errors or warnings
6. **Check network tab**: Verify that API calls are returning expected responses
7. **Isolate the issue**: Try to create a minimal reproduction of the problem

## Adding New Troubleshooting Documentation

When adding new troubleshooting documentation:

1. Create a descriptive markdown file named after the issue
2. Include:
   - Error details/symptoms
   - Root cause analysis
   - Implemented solution
   - Best practices to avoid similar issues
3. Update this README.md with a link to your new document

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Excalibur.js Documentation](https://excaliburjs.com/docs/)
- [React Documentation](https://react.dev/) 