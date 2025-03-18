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
    // Setup event listeners
    const handleConnected = (event: CustomEvent) => {
      setIsLoading(false);
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
      console.error('SpacetimeDB error:', event.detail.error);
      setError('Failed to connect to game server: ' + event.detail.error.message);
      setIsLoading(false);
    };

    const handleRegistered = () => {
      loadUserData();
    };

    const handleLoggedIn = () => {
      setIsAuthenticated(true);
      loadUserData();
    };

    const handleLoggedOut = () => {
      setIsAuthenticated(false);
      setCurrentCharacter(null);
    };

    const handleCharacterCreated = () => {
      loadCharacters();
    };

    // Add event listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('spacetime:connected', handleConnected as EventListener);
      window.addEventListener('spacetime:disconnected', handleDisconnected as EventListener);
      window.addEventListener('spacetime:error', handleError as EventListener);
      window.addEventListener('spacetime:user:registered', handleRegistered);
      window.addEventListener('spacetime:user:logged_in', handleLoggedIn);
      window.addEventListener('spacetime:user:logged_out', handleLoggedOut);
      window.addEventListener('spacetime:character:created', handleCharacterCreated);

      // Custom event listener for session updates
      window.addEventListener('spacetime:subscription:Session', (event: any) => {
        if (event.detail && event.detail.data) {
          setActiveSessions(event.detail.data as Session[]);
          updateSessionState(event.detail.data as Session[]);
        }
      });

      // Connect to SpacetimeDB
      if (typeof SPACETIME_SERVER === 'string' && SPACETIME_SERVER.includes(':')) {
        try {
          console.log('Connecting to SpacetimeDB at:', SPACETIME_SERVER);
          spacetimeService.connect(SPACETIME_SERVER);
        } catch (err) {
          console.error('Failed to connect to SpacetimeDB:', err);
          setError('Failed to initialize game server connection');
          setIsLoading(false);
        }
      } else {
        console.error('Invalid SpacetimeDB server address:', SPACETIME_SERVER);
        setError('Invalid game server configuration');
        setIsLoading(false);
      }

      // Cleanup function
      return () => {
        window.removeEventListener('spacetime:connected', handleConnected as EventListener);
        window.removeEventListener('spacetime:disconnected', handleDisconnected as EventListener);
        window.removeEventListener('spacetime:error', handleError as EventListener);
        window.removeEventListener('spacetime:user:registered', handleRegistered);
        window.removeEventListener('spacetime:user:logged_in', handleLoggedIn);
        window.removeEventListener('spacetime:user:logged_out', handleLoggedOut);
        window.removeEventListener('spacetime:character:created', handleCharacterCreated);
        window.removeEventListener('spacetime:subscription:Session', () => {});
        
        // Disconnect from SpacetimeDB
        spacetimeService.disconnect();
      };
    } else {
      // Running on server, disable loading state
      setIsLoading(false);
      return undefined;
    }
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
      setIsAuthenticated(false);
      setCurrentCharacter(null);
    }
  };

  // Load user data
  const loadUserData = async () => {
    await loadCharacters();
    updateSessionState(activeSessions);
  };

  // Load user characters
  const loadCharacters = async () => {
    const userCharacters = await spacetimeService.getUserCharacters();
    setCharacters(userCharacters);
    return userCharacters;
  };

  // Register new user
  const register = (username: string) => {
    setError(null);
    setIsLoading(true);
    spacetimeService.registerUser(username);
  };

  // Create character
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
    spacetimeService.createCharacter(name, characterClass, skin, hair, eyes, outfit);
  };

  // Login
  const login = (characterId: number) => {
    setError(null);
    setIsLoading(true);
    spacetimeService.login(characterId);
  };

  // Logout
  const logout = () => {
    spacetimeService.logout();
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