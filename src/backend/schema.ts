import { ConnectionId, DbConnectionBuilder, Identity as SpacetimeIdentity } from '@clockworklabs/spacetimedb-sdk';
import { SpacetimeService } from '@/lib/spacetime';

// Add a check for browser environment
const isBrowser = typeof window !== 'undefined';

// Import the SDK only when needed
let GeneratedDB: any = null;

// Flag to control whether to use mock or real SpacetimeDB
const USE_MOCK = process.env.NODE_ENV === 'development' && (
  process.env.NEXT_PUBLIC_USE_REAL_SPACETIMEDB === 'false' ||
  !process.env.NEXT_PUBLIC_USE_REAL_SPACETIMEDB
);

// Types for SpacetimeDB
type Identity = string;
type Address = string;

interface ClientContext {
  identity: Identity;
  address: Address;
}

// Define interfaces for our mock classes
interface SubscriptionBuilder {
  subscribe(query: string): SubscriptionBuilder;
}

// Mock SpacetimeDB client
class MockDbConnection {
  private subscriptions: string[] = [];
  
  subscriptionBuilder(): SubscriptionBuilder {
    const builder: SubscriptionBuilder = {
      subscribe: (query: string): SubscriptionBuilder => {
        console.log(`🔶 Mock subscription: ${query}`);
        this.subscriptions.push(query);
        return builder;
      }
    };
    return builder;
  }
  
  disconnect() {
    console.log('🔶 Mock disconnect');
    this.subscriptions = [];
  }
  
  callReducer(name: string, ...args: any[]) {
    console.log(`🔶 Mock reducer call: ${name}`, args);
    // Here we could map to the actual mock reducer functions
    return Promise.resolve();
  }
  
  static builder() {
    return new MockDbConnectionBuilder();
  }
}

class MockDbConnectionBuilder {
  private uri: string = '';
  private moduleName: string = '';
  private token: string = '';
  private onConnectCallback: ((connection: MockDbConnection, identity: SpacetimeIdentity, token: string) => void) | null = null;
  
  withUri(uri: string) {
    this.uri = uri;
    return this;
  }
  
  withModuleName(moduleName: string) {
    this.moduleName = moduleName;
    return this;
  }
  
  withToken(token: string) {
    this.token = token;
    return this;
  }
  
  onConnect(callback: (connection: MockDbConnection, identity: SpacetimeIdentity, token: string) => void) {
    this.onConnectCallback = callback;
    return this;
  }
  
  onDisconnect(callback: () => void) {
    // Store disconnect callback
    return this;
  }
  
  onConnectError(callback: () => void) {
    // Store connect error callback
    return this;
  }
  
  build() {
    console.log(`🔶 Building mock connection to ${this.uri}/${this.moduleName}`);
    const connection = new MockDbConnection();
    
    // Simulate connection after a short delay
    setTimeout(() => {
      if (this.onConnectCallback) {
        const mockIdentity = { toHexString: () => "mock-identity-123" } as SpacetimeIdentity;
        this.onConnectCallback(connection, mockIdentity, this.token);
      }
    }, 100);
    
    return connection;
  }
}

// User account table with multi-column index for efficient queries
class User {
  identity: Identity;
  username: string = '';
  createdAt: number = 0;  // Unix timestamp
  lastLogin: number = 0;  // Unix timestamp
  
  constructor(identity: Identity, username: string, createdAt: number, lastLogin: number) {
    this.identity = identity;
    this.username = username;
    this.createdAt = createdAt;
    this.lastLogin = lastLogin;
  }
}

// Character table with position index for spatial queries
class Character {
  id: number = 0;
  userIdentity: Identity;
  name: string = '';
  class: string = '';
  level: number = 1;
  positionX: number = 0;
  positionY: number = 0;
  direction: string = 'down';
  createdAt: number = 0;
  lastUpdated: number = 0;
  
  constructor(id: number, userIdentity: Identity, params: Partial<Character> = {}) {
    this.id = id;
    this.userIdentity = userIdentity;
    Object.assign(this, params);
  }
}

// Character appearance
class CharacterAppearance {
  characterId: number;
  skin: string = '';
  hair: string = '';
  eyes: string = '';
  outfit: string = '';
  
  constructor(characterId: number, appearance: Partial<CharacterAppearance> = {}) {
    this.characterId = characterId;
    Object.assign(this, appearance);
  }
}

// Active player sessions
class Session {
  identity: Identity;
  characterId: number = 0;
  address: Address = '';
  connectedAt: number = 0;
  lastActivity: number = 0;
  
  constructor(identity: Identity, characterId: number, address: Address, connectedAt: number, lastActivity: number) {
    this.identity = identity;
    this.characterId = characterId;
    this.address = address;
    this.connectedAt = connectedAt;
    this.lastActivity = lastActivity;
  }
}

// Auto-incrementing counter
class Counter {
  name: string;
  value: number = 0;
  
  constructor(name: string, value: number) {
    this.name = name;
    this.value = value;
  }
}

// Mock implementation of reducer functions - to be replaced with SpacetimeDB calls
export class GameReducers {
  // Mock data storage
  private static users: User[] = [];
  private static characters: Character[] = [];
  private static appearances: CharacterAppearance[] = [];
  private static sessions: Session[] = [];
  private static counters: Counter[] = [];
  
  // Utility functions to simulate database operations
  private static filterUsers(predicate: (u: User) => boolean): User[] {
    return this.users.filter(predicate);
  }
  
  private static findUser(predicate: (u: User) => boolean): User | undefined {
    return this.users.find(predicate);
  }
  
  private static filterCharacters(predicate: (c: Character) => boolean): Character[] {
    return this.characters.filter(predicate);
  }
  
  private static findCharacter(predicate: (c: Character) => boolean): Character | undefined {
    return this.characters.find(predicate);
  }
  
  private static findCounter(name: string): Counter | undefined {
    return this.counters.find(c => c.name === name);
  }
  
  private static findSession(identity: Identity): Session | undefined {
    return this.sessions.find(s => s.identity === identity);
  }
  
  // Reducer functions
  static registerUser(ctx: ClientContext, username: string): void {
    const identity = ctx.identity;
    const timestamp = Date.now();
    
    // Check if user exists
    if (this.filterUsers(u => u.identity === identity).length > 0) {
      throw new Error('User already registered');
    }
    
    // Create new user
    const user = new User(identity, username, timestamp, timestamp);
    this.users.push(user);
  }
  
  static createCharacter(
    ctx: ClientContext,
    name: string,
    characterClass: string,
    appearance: {
      skin: string;
      hair: string;
      eyes: string;
      outfit: string;
    }
  ): number {
    const identity = ctx.identity;
    const timestamp = Date.now();
    
    // Verify user exists
    if (this.filterUsers(u => u.identity === identity).length === 0) {
      throw new Error('User not registered');
    }
    
    // Check name availability
    if (this.filterCharacters(c => c.name === name).length > 0) {
      throw new Error('Character name already taken');
    }
    
    // Get next ID
    let nextId = 1;
    const characterCounter = this.findCounter('character_id');
    if (characterCounter) {
      nextId = characterCounter.value;
      characterCounter.value += 1;
    } else {
      this.counters.push(new Counter('character_id', 2));
    }
    
    // Create character
    const character = new Character(nextId, identity, {
      name,
      class: characterClass,
      level: 1,
      positionX: 0,
      positionY: 0,
      direction: 'down',
      createdAt: timestamp,
      lastUpdated: timestamp
    });
    
    // Create appearance
    const characterAppearance = new CharacterAppearance(nextId, {
      skin: appearance.skin,
      hair: appearance.hair,
      eyes: appearance.eyes,
      outfit: appearance.outfit
    });
    
    this.characters.push(character);
    this.appearances.push(characterAppearance);
    
    return nextId;
  }
  
  static login(ctx: ClientContext, characterId: number): void {
    const identity = ctx.identity;
    const timestamp = Date.now();
    
    // Verify user exists
    if (this.filterUsers(u => u.identity === identity).length === 0) {
      throw new Error('User not registered');
    }
    
    // Verify character exists and belongs to user
    const character = this.findCharacter(c => c.id === characterId);
    if (!character) {
      throw new Error('Character not found');
    }
    
    if (character.userIdentity !== identity) {
      throw new Error('Character does not belong to this user');
    }
    
    // Check if already logged in
    const existingSession = this.findSession(identity);
    if (existingSession) {
      // Update existing session
      existingSession.characterId = characterId;
      existingSession.lastActivity = timestamp;
      existingSession.address = ctx.address;
    } else {
      // Create new session
      this.sessions.push(new Session(
        identity,
        characterId,
        ctx.address,
        timestamp,
        timestamp
      ));
    }
    
    // Update user last login
    const user = this.findUser(u => u.identity === identity);
    if (user) {
      user.lastLogin = timestamp;
    }
  }
  
  static updatePosition(ctx: ClientContext, x: number, y: number, direction: string): void {
    const identity = ctx.identity;
    const timestamp = Date.now();
    
    // Get session for current user
    const session = this.findSession(identity);
    if (!session) {
      throw new Error('Not logged in');
    }
    
    // Update character position
    const character = this.findCharacter(c => c.id === session.characterId);
    if (!character) {
      throw new Error('Character not found');
    }
    
    character.positionX = x;
    character.positionY = y;
    character.direction = direction;
    character.lastUpdated = timestamp;
    
    // Update last activity
    session.lastActivity = timestamp;
  }
  
  static logout(ctx: ClientContext): void {
    const identity = ctx.identity;
    
    // Remove session
    const sessionIndex = this.sessions.findIndex(s => s.identity === identity);
    if (sessionIndex >= 0) {
      this.sessions.splice(sessionIndex, 1);
    }
  }
}

// Function to dynamically import the generated module
async function loadGeneratedModule() {
  if (!GeneratedDB && isBrowser) {
    try {
      GeneratedDB = await import('../generated/index');
      console.log('🟢 Successfully imported SpacetimeDB generated module');
    } catch (error) {
      console.error('🔴 Failed to import SpacetimeDB generated module:', error);
    }
  }
  return GeneratedDB;
}

/**
 * Setup functions for SpacetimeDB
 * This includes both real and mock implementations
 */
export const spacetimeDBSetup = {
  // Connect to SpacetimeDB
  connect: async (moduleAddress: string, onConnect?: () => void) => {
    if (USE_MOCK) {
      console.log(`🔶 Using mock SpacetimeDB service - would connect to ${moduleAddress}`);
      
      const connection = MockDbConnection.builder()
        .withUri('http://127.0.0.1:3001')
        .withModuleName(moduleAddress)
        .withToken('mock-token')
        .onConnect((conn, identity, token) => {
          console.log(`🔶 Mock connected with identity: ${identity.toHexString()}`);
          if (onConnect) onConnect();
        })
        .build();
      
      return connection;
    } else {
      if (!isBrowser) {
        console.log(`🟠 Server-side rendering detected, skipping real connection`);
        return null;
      }
      
      console.log(`🟢 Connecting to real SpacetimeDB module: ${moduleAddress}`);
      
      // Wrap the entire process in a try/catch block
      try {
        // Step 1: Load the module
        let module;
        try {
          module = await loadGeneratedModule();
          if (!module) {
            throw new Error('Failed to load generated module');
          }
        } catch (moduleError) {
          console.error('🔴 Error loading SpacetimeDB generated module:', moduleError);
          throw moduleError;
        }
        
        // Step 2: Create the builder
        let builder;
        try {
          console.log('🟢 Creating connection builder');
          builder = module.DbConnection.builder();
        } catch (builderError) {
          console.error('🔴 Error creating connection builder:', builderError);
          throw builderError;
        }
        
        // Step 3: Configure the connection
        const wsUrl = 'ws://127.0.0.1:3001';
        console.log(`🟢 Using WebSocket URL: ${wsUrl}`);
        
        // Step 4: Build the connection object
        let connectionBuilder;
        try {
          connectionBuilder = builder
            .withUri(wsUrl)
            .withModuleName(moduleAddress)
            .onConnect((conn: any, identity: any, token: string) => {
              console.log(`🟢 Connected to SpacetimeDB with identity: ${identity.toHexString()}`);
              
              // Log additional connection information
              console.log('🟢 Connection object:', conn.constructor.name);
              console.log('🟢 Identity:', identity);
              console.log('🟢 Token:', token.substring(0, 10) + '...');
              
              // Store the identity in the SpacetimeService
              const spacetimeService = SpacetimeService.getInstance();
              spacetimeService.setIdentity(identity.toHexString());
              
              if (onConnect) {
                try {
                  console.log('🟢 Calling onConnect callback...');
                  onConnect();
                  console.log('🟢 onConnect callback completed successfully');
                } catch (callbackError) {
                  console.error('🔴 Error in onConnect callback:', callbackError);
                }
              } else {
                console.log('🟠 No onConnect callback provided');
              }
            })
            .onConnectError((err: Error) => {
              console.error('🔴 SpacetimeDB connection error:', err);
            });
        } catch (configError) {
          console.error('🔴 Error configuring connection:', configError);
          throw configError;
        }
        
        // Step 5: Build and return the connection
        let connection;
        try {
          console.log('🟢 Building connection');
          connection = connectionBuilder.build();
          console.log('🟢 Connection built successfully:', connection.constructor.name);
          return connection;
        } catch (buildError) {
          console.error('🔴 Error building connection:', buildError);
          throw buildError;
        }
      } catch (error) {
        console.error("🔴 Error building SpacetimeDB connection:", error);
        console.log('🟡 Falling back to mock implementation');
        
        // Fall back to mock implementation
        return MockDbConnection.builder()
          .withUri('http://127.0.0.1:3001')
          .withModuleName(moduleAddress)
          .withToken('mock-token')
          .onConnect((conn, identity, token) => {
            console.log(`🔶 Mock connected with identity: ${identity.toHexString()}`);
            if (onConnect) onConnect();
          })
          .build();
      }
    }
  },
  
  // Subscribe to game state
  subscribeToGameState: (client: MockDbConnection | any) => {
    if (USE_MOCK) {
      console.log('🔶 Mock subscription to game state');
      
      // Subscribe to tables using the mock client's subscriptionBuilder
      if (client instanceof MockDbConnection) {
        client.subscriptionBuilder()
          .subscribe('SELECT * FROM User')
          .subscribe('SELECT * FROM Character')
          .subscribe('SELECT * FROM CharacterAppearance')
          .subscribe('SELECT * FROM Session');
      }
    } else {
      if (!isBrowser || !client) {
        console.log('🟠 Cannot subscribe: browser environment or client not available');
        return;
      }
      
      console.log('🟢 Real subscription to game state');
      
      try {
        // Keep this simple like in the minimal test
        const builder = client.subscriptionBuilder();
        console.log('🟢 Created subscription builder, subscribing to tables...');
        
        // We know these work because we're using the same queries as in the module
        builder.subscribe('SELECT * FROM user');
        builder.subscribe('SELECT * FROM character');
        builder.subscribe('SELECT * FROM character_appearance');
        builder.subscribe('SELECT * FROM session');
        builder.subscribe('SELECT * FROM counter');
        
        console.log('🟢 Subscribed to all tables');
      } catch (error) {
        console.error('🔴 Failed to subscribe to tables:', error);
      }
    }
  }
}; 