'use client';

// Only import the setup function, not the whole module
import { spacetimeDBSetup } from '@/backend/schema';

// Define a union type for both connection types
type SpacetimeConnection = any; // Use 'any' for now to avoid TypeScript errors

// Check for browser environment to avoid SSR issues
const isBrowser = typeof window !== 'undefined';

// Determine if we're using mock or real SpacetimeDB - move this to client-side only
const isDevelopment = isBrowser && process.env.NODE_ENV === 'development';
const useMockService = isDevelopment && (
  process.env.NEXT_PUBLIC_USE_REAL_SPACETIMEDB === 'false' || 
  !process.env.NEXT_PUBLIC_USE_REAL_SPACETIMEDB
);

// Re-export types for compatibility
export interface User {
  identity: string;
  username: string;
  created_at: number | bigint;
  last_login: number | bigint;
}

export interface Character {
  id: number | bigint;
  userIdentity: string;
  name: string;
  class: string;
  level: number;
  positionX: number;
  positionY: number;
  direction: string;
  created_at: number | bigint;
  last_updated: number | bigint;
}

export interface CharacterAppearance {
  character_id: number | bigint;
  skin: string;
  hair: string;
  eyes: string;
  outfit: string;
}

export interface Session {
  identity: string;
  character_id: number | bigint;
  connected_at: number | bigint;
  last_activity: number | bigint;
}

// Environment variables - ensure these are defined before client initialization
export const SPACETIME_SERVER = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SPACETIME_SERVER 
  ? process.env.NEXT_PUBLIC_SPACETIME_SERVER 
  : 'http://127.0.0.1:3000';

// For WebSocket connections, we'll use the ws:// protocol
export const SPACETIME_WS_SERVER = SPACETIME_SERVER.replace('http://', 'ws://');

export const SPACETIME_MODULE = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SPACETIME_MODULE
  ? process.env.NEXT_PUBLIC_SPACETIME_MODULE
  : 'rpg-game';

// Class for accessing SpacetimeDB
export class SpacetimeService {
  private static instance: SpacetimeService;
  private client: SpacetimeConnection | null = null;
  private connected: boolean = false;
  private identity: string | null = null;
  private connecting: boolean = false;
  private mockCharacters: Character[] = []; // Store mock characters
  
  private constructor() {
    if (!isBrowser) {
      // Skip initialization on server
      return;
    }
    
    // Only log on the client side
    if (useMockService) {
      console.log('🔶 Using mock SpacetimeDB service in development mode');
      console.log('🔶 NEXT_PUBLIC_USE_REAL_SPACETIMEDB =', process.env.NEXT_PUBLIC_USE_REAL_SPACETIMEDB);
      console.log('🔶 useMockService =', useMockService);
      
      // Initialize mock identity immediately in mock mode
      this.identity = 'mock-identity-123';
      console.log('🔶 Mock identity initialized:', this.identity);
      
      // Initialize mock characters
      this.initializeMockCharacters();
    } else {
      console.log('🟢 Using real SpacetimeDB connection');
      console.log('🟢 NEXT_PUBLIC_USE_REAL_SPACETIMEDB =', process.env.NEXT_PUBLIC_USE_REAL_SPACETIMEDB);
      console.log('🟢 useMockService =', useMockService);
    }
  }
  
  // Initialize mock characters if we're in mock mode
  private initializeMockCharacters(): void {
    // Create initial mock characters
    this.mockCharacters = [
      {
        id: 1, // Ensure ID is a number, not a BigInt
        userIdentity: 'mock-identity-123',
        name: 'Mock Warrior',
        class: 'warrior',
        level: 1,
        positionX: 100,
        positionY: 100,
        direction: 'down',
        created_at: Date.now(),
        last_updated: Date.now()
      },
      {
        id: 2, // Ensure ID is a number, not a BigInt
        userIdentity: 'mock-identity-123',
        name: 'Mock Mage',
        class: 'mage',
        level: 1,
        positionX: 200,
        positionY: 200,
        direction: 'up',
        created_at: Date.now(),
        last_updated: Date.now()
      }
    ];
    
    console.log('🔶 Mock characters initialized:', this.mockCharacters);
  }
  
  public static getInstance(): SpacetimeService {
    if (!SpacetimeService.instance) {
      SpacetimeService.instance = new SpacetimeService();
    }
    return SpacetimeService.instance;
  }
  
  public async connect(serverAddress: string = SPACETIME_MODULE): Promise<void> {
    // Skip if running on server
    if (!isBrowser) return;
    
    // Skip if already connected or connecting
    if (this.connected || this.connecting) return;
    
    this.connecting = true;
    
    try {
      console.log(`Connecting to SpacetimeDB: ${serverAddress}`);
      console.log(`Using server address: ${SPACETIME_SERVER}`);
      
      // In mock mode, ensure identity is set during connection
      if (useMockService && !this.identity) {
        this.identity = 'mock-identity-123';
        console.log('🔶 Setting mock identity during connection:', this.identity);
        
        // Fire identity change event
        this.dispatchEvent('spacetimedb-identity-changed', { 
          identity: this.identity 
        });
      }
      
      // Connect to SpacetimeDB using our setup
      this.client = await spacetimeDBSetup.connect(serverAddress, () => {
        this.connected = true;
        this.connecting = false;
        console.log('Connected to SpacetimeDB successfully');
        
        // Subscribe to tables
        if (this.client) {
          console.log('Setting up subscriptions to tables...');
          spacetimeDBSetup.subscribeToGameState(this.client);
          console.log('Subscriptions setup complete');
          
          // Setup listeners AFTER connection is established
          this.setupListeners();
          console.log('Listeners setup complete');
        }
        
        // Fire connected event
        console.log('Dispatching spacetimedb-connected event');
        window.dispatchEvent(new CustomEvent('spacetimedb-connected'));
        console.log('spacetimedb-connected event dispatched');
      });
      
      console.log('SpacetimeDB connect() method completed, waiting for connection...');

      // Debug WebSocket status
      if (this.client) {
        console.log('Client object created:', this.client.constructor.name);
        
        // Try to access the WebSocket if available
        if (this.client.ws) {
          console.log('WebSocket object:', this.client.ws);
          console.log('WebSocket readyState:', this.client.ws.readyState);
        }
      }
    } catch (error) {
      this.connecting = false;
      console.error('Failed to connect to SpacetimeDB:', error);
      
      // Also dispatch an error event
      window.dispatchEvent(new CustomEvent('spacetimedb-error', { 
        detail: { error }
      }));
    }
  }
  
  public disconnect(): void {
    // Skip if running on server
    if (!isBrowser) return;
    
    if (this.client) {
      this.client.disconnect();
      this.client = null;
      this.connected = false;
      
      window.dispatchEvent(new CustomEvent('spacetimedb-disconnected'));
    }
  }
  
  // User registration
  public registerUser(username: string): void {
    // Skip if running on server
    if (!isBrowser) return;
    
    if (!this.client) {
      console.error('Cannot register user: not connected to SpacetimeDB');
      this.dispatchEvent('spacetimedb-error', { error: new Error('Not connected to SpacetimeDB') });
      return;
    }
    
    if (useMockService) {
      console.log(`🔶 Mock SpacetimeDB: registerUser(${username}) called`);
      
      // Set mock identity
      this.identity = 'mock-identity-123';
      
      setTimeout(() => {
        this.dispatchEvent('spacetimedb-user-registered', { username });
      }, 500);
      return;
    }
    
    try {
      // We'll use 'any' type to avoid TypeScript errors until we understand the generated bindings better
      const client = this.client as any;
      if (client.reducers && typeof client.reducers.registerUser === 'function') {
        client.reducers.registerUser(username);
        console.log(`🟢 Called register_user reducer with username: ${username}`);
        
        // Dispatch event immediately - the reducer is a fire-and-forget operation
        // This ensures the UI updates even if the database callback doesn't fire
        setTimeout(() => {
          this.dispatchEvent('spacetimedb-user-registered', { username });
        }, 500); // Small delay to allow the server to process
      }
    } catch (error) {
      console.error('Failed to register user:', error);
      this.dispatchEvent('spacetimedb-error', { error });
    }
  }
  
  // Helper method to dispatch events
  private dispatchEvent(eventName: string, detail: any = {}): void {
    if (!isBrowser) return;
    
    try {
      window.dispatchEvent(new CustomEvent(eventName, { detail }));
      console.log(`Dispatched event: ${eventName}`, detail);
    } catch (error) {
      console.error(`Failed to dispatch event ${eventName}:`, error);
    }
  }
  
  // Character creation with improved mock handling
  public createCharacter(
    name: string, 
    characterClass: string, 
    skin: string, 
    hair: string, 
    eyes: string, 
    outfit: string
  ): void {
    // Skip if running on server
    if (!isBrowser) return;
    
    if (!this.client) {
      console.error('Cannot create character: not connected to SpacetimeDB');
      this.dispatchEvent('spacetimedb-error', { error: new Error('Not connected to SpacetimeDB') });
      return;
    }
    
    if (useMockService) {
      console.log(`🔶 Mock SpacetimeDB: createCharacter(${name}, ${characterClass}) called`);
      
      // Generate a unique ID - make sure it's a number, not a BigInt
      // Find the highest ID in the current mock characters
      const highestId = this.mockCharacters.reduce((max, char) => {
        const charId = typeof char.id === 'bigint' ? Number(char.id) : Number(char.id);
        return charId > max ? charId : max;
      }, 0);
      
      // New ID is highest + 1
      const mockId = highestId + 1;
      
      // Create a mock character and store it for future reference (this would happen server-side in real mode)
      const mockCharacter: Character = {
        id: mockId,
        userIdentity: this.identity || 'mock-identity-123',
        name: name,
        class: characterClass,
        level: 1,
        positionX: Math.floor(Math.random() * 500),
        positionY: Math.floor(Math.random() * 500),
        direction: 'down',
        created_at: Date.now(),
        last_updated: Date.now()
      };
      
      // Add to our mock characters array
      this.mockCharacters.push(mockCharacter);
      
      // Log the created character for debugging
      console.log('🔶 Mock character created:', mockCharacter);
      console.log('🔶 Updated mock characters list:', this.mockCharacters);
      
      setTimeout(() => {
        this.dispatchEvent('spacetimedb-character-created', {
          characterId: mockId,
          name,
          characterClass,
          skin,
          hair,
          eyes,
          outfit
        });
        
        // Force a user reload to get the new character
        setTimeout(() => {
          console.log('🔶 Mock mode: Forcing character refresh');
          this.dispatchEvent('spacetimedb-user-registered', { 
            username: 'refresh-trigger',
            forceRefresh: true
          });
        }, 100);
      }, 500);
      return;
    }
    
    try {
      // We'll use 'any' type to avoid TypeScript errors until we understand the generated bindings better
      const client = this.client as any;
      if (client.reducers && typeof client.reducers.createCharacter === 'function') {
        client.reducers.createCharacter(name, characterClass, skin, hair, eyes, outfit);
        console.log(`🟢 Called create_character reducer`);
        
        // Dispatch event immediately to update UI
        setTimeout(() => {
          this.dispatchEvent('spacetimedb-character-created', {
            name,
            characterClass
          });
        }, 500);
      }
    } catch (error) {
      console.error('Failed to create character:', error);
      this.dispatchEvent('spacetimedb-error', { error });
    }
  }
  
  // Update position
  public updatePosition(characterId: number, x: number, y: number, direction: string): void {
    // Skip if running on server
    if (!isBrowser) return;
    
    if (!this.client || !this.connected) {
      return; // Silent fail for position updates - happens frequently
    }
    
    if (useMockService) {
      // Don't log this - would be too noisy
      return;
    }
    
    try {
      // We'll use 'any' type to avoid TypeScript errors until we understand the generated bindings better
      const client = this.client as any;
      if (client.reducers && typeof client.reducers.updatePosition === 'function') {
        client.reducers.updatePosition(BigInt(characterId), x, y, direction);
      }
    } catch (error) {
      console.error('Failed to update position:', error);
    }
  }
  
  // Get user characters with improved error handling and identity check
  public async getUserCharacters(): Promise<Character[]> {
    // Skip if running on server
    if (!isBrowser) return [];
    
      if (!this.client || !this.connected) {
      console.error('Cannot get characters: not connected to SpacetimeDB');
      return [];
    }
    
    // In mock mode, ALWAYS ensure identity is set before getting characters
    if (useMockService) {
      if (!this.identity) {
        this.identity = 'mock-identity-123';
        console.log('🔶 Setting mock identity before getting characters:', this.identity);
        
        // Also dispatch identity change event to ensure components are updated
        this.dispatchEvent('spacetimedb-identity-changed', { 
          identity: this.identity 
        });
      } else {
        console.log('🔶 Using existing mock identity:', this.identity);
      }
    } else if (!this.identity) {
      // Only show warning in real mode
      console.warn('🟠 Getting characters but identity is null. This may indicate an authentication issue.');
    }
    
    console.log(`🟢 Getting characters for identity: ${this.identity}`);
      
      if (useMockService) {
      console.log('🔶 Mock SpacetimeDB: getUserCharacters()');
      
      // If we don't have mock characters yet, initialize with defaults
      if (this.mockCharacters.length === 0) {
        this.initializeMockCharacters();
      }
      
      // Make sure all character IDs are consistent (numbers, not BigInts)
      this.mockCharacters = this.mockCharacters.map(char => ({
        ...char,
        id: typeof char.id === 'bigint' ? Number(char.id) : Number(char.id)
      }));
      
      console.log('🔶 Returning mock characters:', this.mockCharacters);
      return this.mockCharacters;
    }
    
    try {
      const userIdentity = this.identity || '';
      console.log(`🟢 Looking for characters with userIdentity: ${userIdentity}`);
      
      // Get character table from client
      if (this.client.tables && this.client.tables.character) {
        // Iterate character table
        console.log('🟢 Iterating through character table');
          const characters: Character[] = [];
            let count = 0;
            
        for (const row of this.client.tables.character.values()) {
              count++;
          // Check if character belongs to current user
          if (row.user_identity === userIdentity) {
            const character: Character = {
              id: row.id,
              userIdentity: row.user_identity,
              name: row.name,
              class: row.class,
              level: row.level || 1,
              positionX: row.position_x || 0,
              positionY: row.position_y || 0,
              direction: row.direction || 'down',
              created_at: row.created_at,
              last_updated: row.last_updated
            };
            characters.push(character);
              }
            }
            
            console.log(`🟢 Iterated through ${count} characters, found ${characters.length} for current user`);
        return characters;
          } else {
        console.warn('Character table not available');
        return [];
      }
    } catch (error) {
      console.error('Failed to get user characters:', error);
      return [];
    }
  }
  
  // Set up subscription to events for character updates
  private setupListeners(): void {
    // Skip if running on server
    if (!isBrowser) return;
    
    if (!this.client || !this.connected) {
      return;
    }
    
    try {
      // We'll use 'any' type to avoid TypeScript errors until we understand the generated bindings better
      const client = this.client as any;
      
      if (!client.reducers) return;
      
      // For mock mode, ensure identity is set before setting up listeners
      if (useMockService && !this.identity) {
        this.identity = 'mock-identity-123';
        console.log('🔶 Setting mock identity during setupListeners:', this.identity);
        
        // Dispatch identity event
        this.dispatchEvent('spacetimedb-identity-changed', { 
          identity: this.identity 
        });
      }
      
      // Listen for character creation
      if (typeof client.reducers.onCreateCharacter === 'function') {
        client.reducers.onCreateCharacter((ctx: any, name: string, ...rest: any[]) => {
          console.log(`Character created: ${name}`);
          window.dispatchEvent(new CustomEvent('spacetimedb-character-created'));
        });
      }
      
      // Identity events - client connection
      if (typeof client.reducers.onIdentityConnected === 'function') {
        client.reducers.onIdentityConnected((ctx: any) => {
          if (ctx && ctx.sender) {
            // Try different methods to get the identity string
            if (typeof ctx.sender.toHexString === 'function') {
              this.identity = ctx.sender.toHexString();
            } else if (typeof ctx.sender.toString === 'function') {
              this.identity = ctx.sender.toString();
            } else {
              // Fallback to string coercion
              this.identity = `${ctx.sender}`;
            }
            
            console.log(`🟢 Identity connected and set: ${this.identity}`);
            
            // Dispatch an identity event to notify components
            this.dispatchEvent('spacetimedb-identity-changed', { 
              identity: this.identity 
            });
          } else {
            console.log('🟠 Identity connected but sender is null or undefined');
            
            // In mock mode, use a default identity if ctx.sender is missing
            if (useMockService && !this.identity) {
              this.identity = 'mock-identity-123';
              console.log(`🔶 Mock identity set to default: ${this.identity}`);
              
              // Dispatch identity event
              this.dispatchEvent('spacetimedb-identity-changed', { 
                identity: this.identity 
              });
            }
          }
        });
      }
      
      // Identity events - client disconnection
      if (typeof client.reducers.onIdentityDisconnected === 'function') {
        client.reducers.onIdentityDisconnected((ctx: any) => {
          if (ctx && ctx.sender && typeof ctx.sender.toString === 'function') {
            console.log(`Identity disconnected: ${ctx.sender.toString()}`);
          }
        });
      }
    } catch (error) {
      console.error('Failed to set up listeners:', error);
    }
  }

  // Set identity in the service
  public setIdentity(identity: string): void {
    console.log('Setting identity:', identity);
      this.identity = identity;
  }
  
  // Get the current identity
  public getIdentity(): string | null {
    return this.identity;
  }
}

// Create singleton instance
export const spacetimeService = SpacetimeService.getInstance(); 