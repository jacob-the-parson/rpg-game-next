# SpacetimeDB Integration TODO

## Done ✅

- [x] Install SpacetimeDB CLI
- [x] Create a Rust module with our game schema
- [x] Define tables for:
  - [x] User accounts
  - [x] Characters
  - [x] Character appearance
  - [x] Sessions
  - [x] Counters
- [x] Implement reducers for:
  - [x] User registration
  - [x] Character creation
  - [x] Position updates
  - [x] Connection/disconnection handling
- [x] Build and publish the module to a local SpacetimeDB server
- [x] Generate TypeScript bindings
- [x] Update client code to use both mock and real implementations
- [x] Update documentation with setup instructions

## In Progress 🔄

- [ ] Test the real SpacetimeDB integration with a running server
- [ ] Ensure proper error handling for all reducers
- [ ] Fix remaining TypeScript issues in `src/lib/spacetime.ts`

## To Do 📝

- [ ] Deploy to a production SpacetimeDB server
- [ ] Add authentication support using SpacetimeDB tokens
- [ ] Implement proper conflict resolution for concurrent updates
- [ ] Add server-side validation for all reducer inputs
- [ ] Create a developer guide for working with the SpacetimeDB module
- [ ] Add monitoring and logging for SpacetimeDB operations
- [ ] Performance optimization:
  - [ ] Optimize query patterns
  - [ ] Add appropriate indexes
  - [ ] Implement batching for high-frequency updates

## Known Issues 🐛

- The TypeScript bindings have some compatibility issues with our current code
- Need to fully understand the reducer callback signatures
- Need to test with multiple concurrent users
- Current implementation requires manual conversion between BigInt and number 