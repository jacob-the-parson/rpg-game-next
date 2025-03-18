'use client';

import { SpacetimeDBClient } from '@clockworklabs/spacetimedb-typescript-sdk';

// Determine if we're in mock mode
const isDevelopment = process.env.NODE_ENV === 'development';
const useMockService = isDevelopment;

// Types from the schema
export interface User {
  identity: string;
  username: string;
  created_at: number;
  last_login: number;
}

export interface Character {
  id: number;
  user_identity: string;
  name: string;
  class: string;
  level: number;
  position_x: number;
  position_y: number;
  created_at: number;
  last_updated: number;
}

export interface CharacterAppearance {
  character_id: number;
  skin: string;
  hair: string;
  eyes: string;
  outfit: string;
}

export interface Session {
  identity: string;
  character_id: number;
  connected_at: number;
  last_activity: number;
}

// Environment variables - ensure these are defined before client initialization
export const SPACETIME_SERVER = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SPACETIME_SERVER 
  ? process.env.NEXT_PUBLIC_SPACETIME_SERVER 
  : 'http://localhost:3000';

// Class for accessing SpacetimeDB
export class SpacetimeService {
  private static instance: SpacetimeService;
  private client: SpacetimeDBClient | null = null;
  private connected: boolean = false;
  private identity: string | null = null;
  
  private constructor() {
    if (useMockService) {
      console.log('🔶 Using mock SpacetimeDB service in development mode');
      return;
    }

    try {
      // Only initialize the client on the browser
      if (typeof window !== 'undefined') {
        console.log('Initializing SpacetimeDB client...');
        this.client = new SpacetimeDBClient();
        
        // Set up event handlers
        this.client.on('connected', this.handleConnected.bind(this));
        this.client.on('disconnected', this.handleDisconnected.bind(this));
        this.client.on('error', this.handleError.bind(this));
        
        // Set up reducers
        this.client.registerReducerCallback('register_user', this.handleRegisterUser.bind(this));
        this.client.registerReducerCallback('create_character', this.handleCreateCharacter.bind(this));
        this.client.registerReducerCallback('login', this.handleLogin.bind(this));
        this.client.registerReducerCallback('logout', this.handleLogout.bind(this));
      }
    } catch (error) {
      console.error('Failed to initialize SpacetimeDBClient:', error);
    }
  }
  
  public static getInstance(): SpacetimeService {
    if (!SpacetimeService.instance) {
      SpacetimeService.instance = new SpacetimeService();
    }
    return SpacetimeService.instance;
  }
  
  public connect(serverAddress: string): void {
    if (useMockService) {
      console.log('🔶 Mock SpacetimeDB: connect() called with', serverAddress);
      this.mockConnected();
      return;
    }

    if (!this.connected && this.client && typeof serverAddress === 'string') {
      try {
        if (!serverAddress.includes(':')) {
          console.error('Invalid SpacetimeDB server address format. Expected format: hostname:port or http://hostname:port');
          return;
        }
        console.log('Connecting to SpacetimeDB at:', serverAddress);
        this.client.connect(serverAddress);
      } catch (error) {
        console.error('Failed to connect to SpacetimeDB:', error);
      }
    }
  }
  
  public disconnect(): void {
    if (useMockService) {
      console.log('🔶 Mock SpacetimeDB: disconnect() called');
      return;
    }

    if (this.connected && this.client) {
      this.client.disconnect();
      this.connected = false;
    }
  }
  
  // User registration
  public registerUser(username: string): void {
    if (useMockService) {
      console.log(`🔶 Mock SpacetimeDB: registerUser(${username}) called`);
      setTimeout(() => {
        this.mockUserRegistered();
      }, 500);
      return;
    }

    if (this.client) {
      this.client.callReducer('register_user', [username]);
    }
  }
  
  // Character creation
  public createCharacter(
    name: string, 
    characterClass: string, 
    skin: string, 
    hair: string, 
    eyes: string, 
    outfit: string
  ): void {
    if (useMockService) {
      console.log(`🔶 Mock SpacetimeDB: createCharacter(${name}, ${characterClass}) called`);
      setTimeout(() => {
        this.mockCharacterCreated(1);
      }, 500);
      return;
    }

    if (this.client) {
      this.client.callReducer('create_character', [name, characterClass, skin, hair, eyes, outfit]);
    }
  }
  
  // Login
  public login(characterId: number): void {
    if (useMockService) {
      console.log(`🔶 Mock SpacetimeDB: login(${characterId}) called`);
      setTimeout(() => {
        this.mockLoggedIn();
      }, 500);
      return;
    }

    if (this.client) {
      this.client.callReducer('login', [characterId]);
    }
  }
  
  // Logout
  public logout(): void {
    if (useMockService) {
      console.log('🔶 Mock SpacetimeDB: logout() called');
      setTimeout(() => {
        this.mockLoggedOut();
      }, 500);
      return;
    }

    if (this.client) {
      this.client.callReducer('logout', []);
    }
  }
  
  // Update position
  public updatePosition(x: number, y: number): void {
    if (useMockService) {
      // Don't log this - would be too noisy
      return;
    }

    if (this.client) {
      this.client.callReducer('update_position', [x, y]);
    }
  }
  
  // Get all characters for current user
  public getUserCharacters(): Promise<Character[]> {
    if (useMockService) {
      console.log('🔶 Mock SpacetimeDB: getUserCharacters() called');
      // Return mock characters
      return Promise.resolve([
        {
          id: 1,
          user_identity: 'mock-user-id',
          name: 'MockPlayer',
          class: 'warrior',
          level: 1,
          position_x: 400,
          position_y: 300,
          created_at: Date.now(),
          last_updated: Date.now()
        }
      ]);
    }

    return new Promise((resolve) => {
      if (!this.identity || !this.client) {
        resolve([]);
        return;
      }
      
      try {
        // Subscribe to characters table filtered by current user
        this.client.subscribe(`SELECT * FROM Character WHERE user_identity = '${this.identity}'`);
        
        // Read characters from the subscription
        const characters = this.client.getSubscriptionCache('Character')
          .filter((character: Character) => character.user_identity === this.identity);
        
        resolve(characters);
      } catch (error) {
        console.error('Failed to get user characters:', error);
        resolve([]);
      }
    });
  }
  
  // --- Mock event methods ---
  private mockConnected() {
    this.connected = true;
    this.identity = 'mock-user-id';
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('spacetime:connected', { 
        detail: { identity: this.identity } 
      }));
    }
  }
  
  private mockUserRegistered() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('spacetime:user:registered'));
    }
  }
  
  private mockCharacterCreated(characterId: number) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('spacetime:character:created', { 
        detail: { characterId } 
      }));
    }
  }
  
  private mockLoggedIn() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('spacetime:user:logged_in'));
    }
  }
  
  private mockLoggedOut() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('spacetime:user:logged_out'));
    }
  }
  
  // --- Original event handlers ---
  private handleConnected(identity: string): void {
    this.connected = true;
    this.identity = identity;
    console.log('Connected to SpacetimeDB with identity:', identity);
    
    if (this.client) {
      // Subscribe to session table
      this.client.subscribe('SELECT * FROM Session');
    }
    
    // Dispatch event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('spacetime:connected', { detail: { identity } }));
    }
  }
  
  private handleDisconnected(): void {
    this.connected = false;
    console.log('Disconnected from SpacetimeDB');
    
    // Dispatch event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('spacetime:disconnected'));
    }
  }
  
  private handleError(error: Error): void {
    console.error('SpacetimeDB error:', error);
    
    // Dispatch event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('spacetime:error', { detail: { error } }));
    }
  }
  
  // Reducer callbacks
  private handleRegisterUser(result: any): void {
    if (result.status === 'success') {
      console.log('User registered successfully');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('spacetime:user:registered'));
      }
    } else {
      console.error('Failed to register user:', result.error);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('spacetime:user:register_error', { 
          detail: { error: result.error } 
        }));
      }
    }
  }
  
  private handleCreateCharacter(result: any): void {
    if (result.status === 'success') {
      const characterId = result.value;
      console.log('Character created successfully with ID:', characterId);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('spacetime:character:created', { 
          detail: { characterId } 
        }));
      }
    } else {
      console.error('Failed to create character:', result.error);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('spacetime:character:create_error', { 
          detail: { error: result.error } 
        }));
      }
    }
  }
  
  private handleLogin(result: any): void {
    if (result.status === 'success') {
      console.log('Logged in successfully');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('spacetime:user:logged_in'));
      }
    } else {
      console.error('Failed to log in:', result.error);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('spacetime:user:login_error', { 
          detail: { error: result.error } 
        }));
      }
    }
  }
  
  private handleLogout(result: any): void {
    if (result.status === 'success') {
      console.log('Logged out successfully');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('spacetime:user:logged_out'));
      }
    } else {
      console.error('Failed to log out:', result.error);
    }
  }
}

// Export singleton instance
export const spacetimeService = SpacetimeService.getInstance(); 