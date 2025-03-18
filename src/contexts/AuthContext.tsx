'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { spacetimeService, SPACETIME_SERVER, Character, Session } from '@/lib/spacetime';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  username: string | null;
  characters: Character[];
  currentCharacter: Character | null;
  error: string | null;
  register: (username: string) => void;
  createCharacter: (
    name: string, 
    characterClass: string, 
    skin: string, 
    hair: string, 
    eyes: string, 
    outfit: string
  ) => void;
  login: (characterId: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeSessions, setActiveSessions] = useState<Session[]>([]);

  // Initialize SpacetimeDB connection
  useEffect(() => {
    // Skip on server side
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }
    
    let timeoutId: NodeJS.Timeout | null = null;
    let isConnected = false;
    
    // Setup event listeners
    const handleConnected = (event: CustomEvent) => {
      console.log("Connected event received, clearing loading state");
      isConnected = true;
      setIsLoading(false);
      
      // Clear timeout if it exists
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      
      loadUserData();
    };

    const handleDisconnected = () => {
      setIsAuthenticated(false);
      setIsLoading(false);
      setUsername(null);
      setCharacters([]);
      setCurrentCharacter(null);
    };

    const handleError = (event: CustomEvent) => {
      console.error('SpacetimeDB error:', event.detail?.error);
      setError('Failed to connect to game server: ' + (event.detail?.error?.message || 'Unknown error'));
      setIsLoading(false);
    };

    const handleRegistered = () => {
      console.log("User registration successful, loading user data");
      setIsLoading(false); // First clear the loading state
      
      // Explicitly set authenticated state after registration in mock mode
      if (process.env.NEXT_PUBLIC_USE_REAL_SPACETIMEDB === 'false') {
        console.log("Mock mode: Setting authenticated state after registration");
        setIsAuthenticated(true);
      }
      
      loadUserData();
    };

    const handleCharacterCreated = () => {
      console.log("Character created successfully");
      setIsLoading(false);
      
      // After character creation, reload the character list
      loadCharacters().then(() => {
        console.log("Character list reloaded after creation");
        
        // In mock mode, we want to show the character selection screen
        if (process.env.NEXT_PUBLIC_USE_REAL_SPACETIMEDB === 'false') {
          console.log("Mock mode: Ensuring authenticated state after character creation");
          setIsAuthenticated(true);
        }
      });
    };
    
    // Add handler for identity change event
    const handleIdentityChanged = (event: CustomEvent) => {
      console.log("Identity changed:", event.detail?.identity);
      // Update username when identity changes
      if (event.detail?.identity) {
        setUsername(event.detail.identity);
        // Reload user data with the new identity
        loadUserData();
      }
    };
    
    // Add handler for session updates
    const handleSessionUpdate = (event: any) => {
      if (event.detail && event.detail.data) {
        setActiveSessions(event.detail.data as Session[]);
        updateSessionState(event.detail.data as Session[]);
      }
    };

    // Add event listeners
    window.addEventListener('spacetimedb-connected', handleConnected as EventListener);
    window.addEventListener('spacetimedb-disconnected', handleDisconnected as EventListener);
    window.addEventListener('spacetimedb-error', handleError as EventListener);
    window.addEventListener('spacetimedb-user-registered', handleRegistered);
    window.addEventListener('spacetimedb-character-created', handleCharacterCreated);
    window.addEventListener('spacetimedb-identity-changed', handleIdentityChanged as EventListener);
    window.addEventListener('spacetimedb-subscription-session', handleSessionUpdate);

    // Connect to SpacetimeDB in a safe way
    const connectToServer = async () => {
      try {
        console.log('Connecting to SpacetimeDB module');
        await spacetimeService.connect();
      } catch (err) {
        console.error('Failed to connect to SpacetimeDB:', err);
        setError('Failed to initialize game server connection');
        setIsLoading(false);
      }
    };
    
    // Add connection timeout to prevent indefinite loading
    const startConnectionTimeout = () => {
      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        console.log("Connection timeout - clearing loading state");
        if (isLoading && !isConnected) {
          setIsLoading(false);
          setError('Connection to game server timed out. Please try again later.');
          
          // Try to disconnect and reconnect after a brief pause
          if (typeof window !== 'undefined') {
            console.log("Attempting to reconnect after timeout...");
            spacetimeService.disconnect();
            
            // Delay reconnection attempt slightly
            setTimeout(() => {
              spacetimeService.connect();
            }, 1000);
          }
        }
      }, 10000); // 10 second timeout
    };
    
    // Start connection
    connectToServer();
    startConnectionTimeout();

    // Cleanup function
    return () => {
      window.removeEventListener('spacetimedb-connected', handleConnected as EventListener);
      window.removeEventListener('spacetimedb-disconnected', handleDisconnected as EventListener);
      window.removeEventListener('spacetimedb-error', handleError as EventListener);
      window.removeEventListener('spacetimedb-user-registered', handleRegistered);
      window.removeEventListener('spacetimedb-character-created', handleCharacterCreated);
      window.removeEventListener('spacetimedb-identity-changed', handleIdentityChanged as EventListener);
      window.removeEventListener('spacetimedb-subscription-session', handleSessionUpdate);
      
      // Clear the timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Disconnect from SpacetimeDB
      spacetimeService.disconnect();
    };
  }, []);

  // Update session state based on active sessions
  const updateSessionState = (sessions: Session[]) => {
    if (sessions.length > 0) {
      setIsAuthenticated(true);
      
      // Get current character from session
      const characterId = sessions[0].character_id;
      const character = characters.find(c => c.id === characterId) || null;
      setCurrentCharacter(character);
    } else {
      // Don't reset authenticated state here - it will mess up the character selection flow
      // Just reset the current character
      setCurrentCharacter(null);
    }
  };

  // Load user data with better error handling
  const loadUserData = async () => {
    console.log("Loading user data");
    setIsLoading(true);
    
    try {
      await loadCharacters();
      
      // IMPORTANT FIX: Make sure the characters are updated in the state before checking
      // In mock mode, ensure the user is authenticated after loading characters
      if (process.env.NEXT_PUBLIC_USE_REAL_SPACETIMEDB === 'false') {
        console.log("Mock mode: Setting authenticated state after loading characters");
        setIsAuthenticated(true);
      } else {
        updateSessionState(activeSessions);
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error("Error loading user data:", err);
      setError("Failed to load user data");
      setIsLoading(false);
    }
  };

  // Load user characters with better error handling
  const loadCharacters = async () => {
    console.log("Loading user characters");
    try {
      const userCharacters = await spacetimeService.getUserCharacters();
      console.log(`Found ${userCharacters.length} characters:`, userCharacters);
      setCharacters(userCharacters);
      return userCharacters;
    } catch (err) {
      console.error("Error loading characters:", err);
      setError("Failed to load characters");
      throw err;
    }
  };

  // Register new user
  const register = (username: string) => {
    setError(null);
    setIsLoading(true);
    
    try {
      spacetimeService.registerUser(username);
      
      // For mock mode, set the username directly and immediately set authenticated
      if (process.env.NEXT_PUBLIC_USE_REAL_SPACETIMEDB === 'false') {
        console.log("Mock mode: Setting username directly:", username);
        setUsername(username);
        
        // IMPORTANT FIX: Set authenticated immediately to show character selection screen
        console.log("Mock mode: Setting authenticated state directly during registration");
        setIsAuthenticated(true);
      }
      
      // Add a safety timeout to clear the loading state if the event doesn't fire
      setTimeout(() => {
        if (isLoading) {
          console.log("Registration timeout - clearing loading state");
          setIsLoading(false);
          
          // IMPORTANT FIX: Set authenticated in timeout as well to ensure UI updates
          if (process.env.NEXT_PUBLIC_USE_REAL_SPACETIMEDB === 'false') {
            setIsAuthenticated(true);
          }
          
          loadUserData(); // Try to load user data anyway
        }
      }, 3000);
    } catch (err) {
      console.error("Error during registration:", err);
      setError("Registration failed: " + String(err));
      setIsLoading(false);
    }
  };

  // Create character with safety timeout
  const createCharacter = (
    name: string, 
    characterClass: string, 
    skin: string, 
    hair: string, 
    eyes: string, 
    outfit: string
  ) => {
    setError(null);
    setIsLoading(true);
    
    try {
      spacetimeService.createCharacter(name, characterClass, skin, hair, eyes, outfit);
      
      // Add a safety timeout to clear the loading state if the event doesn't fire
      setTimeout(() => {
        if (isLoading) {
          console.log("Character creation timeout - clearing loading state");
          setIsLoading(false);
          
          // IMPORTANT FIX: Ensure authenticated state after character creation
          if (process.env.NEXT_PUBLIC_USE_REAL_SPACETIMEDB === 'false') {
            setIsAuthenticated(true);
          }
          
          loadCharacters(); // Try to load characters anyway
        }
      }, 3000);
    } catch (err) {
      console.error("Error during character creation:", err);
      setError("Character creation failed: " + String(err));
      setIsLoading(false);
    }
  };

  // Handle character selection and login
  const login = (characterId: number) => {
    setError(null);
    setIsLoading(true);
    
    try {
      // Find the character in our list
      const character = characters.find(c => c.id === characterId);
      if (character) {
        setCurrentCharacter(character);
        // IMPORTANT FIX: Always set authenticated to true on login
        setIsAuthenticated(true);
        
        console.log(`Successfully logged in with character: ${character.name}`);
        
        // Dispatch a custom event to notify components
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('spacetimedb-character-selected', {
            detail: { character }
          }));
        }
      } else {
        setError('Character not found');
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("Login failed: " + String(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = () => {
    // Just clear the local state
    setIsAuthenticated(false);
    setCurrentCharacter(null);
    
    // Dispatch a custom event to notify components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('spacetimedb-character-deselected'));
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    username,
    characters,
    currentCharacter,
    error,
    register,
    createCharacter,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 