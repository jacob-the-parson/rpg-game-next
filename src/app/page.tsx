'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

// Character classes with descriptions
const CHARACTER_CLASSES = [
  {
    id: 'warrior',
    name: 'Warrior',
    description: 'Strong melee fighter with high health and defense.',
    startingStats: 'Strength +3, Constitution +2',
  },
  {
    id: 'mage',
    name: 'Mage',
    description: 'Powerful spellcaster with elemental magic abilities.',
    startingStats: 'Intelligence +3, Wisdom +2',
  },
  {
    id: 'rogue',
    name: 'Rogue',
    description: 'Agile fighter specializing in stealth and critical strikes.',
    startingStats: 'Dexterity +3, Charisma +2',
  },
  {
    id: 'ranger',
    name: 'Ranger',
    description: 'Skilled archer with animal companions and nature abilities.',
    startingStats: 'Dexterity +2, Wisdom +2, Constitution +1',
  },
];

// Appearance options
const APPEARANCE_OPTIONS = {
  skin: ['light', 'medium', 'dark', 'tan', 'olive'],
  hair: ['black', 'brown', 'blonde', 'red', 'white', 'gray'],
  eyes: ['brown', 'blue', 'green', 'gray', 'amber'],
  outfit: ['casual', 'noble', 'warrior', 'mage', 'hunter', 'rogue'],
};

export default function Home() {
  const { 
    isAuthenticated, 
    isLoading, 
    characters, 
    currentCharacter,
    error,
    register,
    createCharacter,
    login,
    logout 
  } = useAuth();

  // Registration form state
  const [username, setUsername] = useState('');
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  // Character creation form state
  const [showCharacterCreation, setShowCharacterCreation] = useState(false);
  const [characterName, setCharacterName] = useState('');
  const [characterClass, setCharacterClass] = useState(CHARACTER_CLASSES[0].id);
  const [appearance, setAppearance] = useState({
    skin: APPEARANCE_OPTIONS.skin[0],
    hair: APPEARANCE_OPTIONS.hair[0],
    eyes: APPEARANCE_OPTIONS.eyes[0],
    outfit: APPEARANCE_OPTIONS.outfit[0],
  });

  // Handle registration form submission
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    register(username);
  };

  // Handle character creation form submission
  const handleCreateCharacter = (e: React.FormEvent) => {
    e.preventDefault();
    createCharacter(
      characterName, 
      characterClass, 
      appearance.skin, 
      appearance.hair, 
      appearance.eyes, 
      appearance.outfit
    );
    setShowCharacterCreation(false);
  };

  // Handle character selection and login
  const handleSelectCharacter = (characterId: number | bigint) => {
    // Convert to number if it's a bigint
    const id = typeof characterId === 'bigint' ? Number(characterId) : characterId;
    login(id);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-900 text-white">
        <div className="w-full max-w-md p-6 bg-slate-800 rounded-lg shadow-xl">
          <h1 className="text-2xl font-bold mb-4 text-center">Loading...</h1>
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          
          {/* Display error if there is one */}
          {error && (
            <div className="mb-4 p-3 bg-red-900 rounded-md text-white">
              {error}
            </div>
          )}
          
          {/* Workaround button for development testing */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 text-center">
              <p className="mb-2 text-sm text-yellow-400">
                Connection taking too long? Try using mock mode for testing:
              </p>
              <button 
                onClick={() => {
                  // This is a workaround for development - mock the authentication
                  // We'll use the register function which will trigger its own timeout
                  register("testuser");
                  console.log("Development workaround: Initiated mock authentication");
                }}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-md text-sm transition-colors"
              >
                Use Mock Mode (Dev Only)
              </button>
            </div>
          )}
        </div>
      </main>
    );
  }

  // If user is authenticated and has a current character, redirect to game
  if (isAuthenticated && currentCharacter) {
  return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-900 text-white">
        <div className="w-full max-w-md p-6 bg-slate-800 rounded-lg shadow-xl">
          <h1 className="text-2xl font-bold mb-4 text-center">Welcome, {currentCharacter.name}!</h1>
          <p className="mb-6 text-center">You are logged in and ready to play.</p>

          <div className="flex justify-between">
            <Link 
              href="/game" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Enter Game
            </Link>
            
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Character selection screen
  if (isAuthenticated && characters.length > 0 && !showCharacterCreation) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-900 text-white">
        <div className="w-full max-w-md p-6 bg-slate-800 rounded-lg shadow-xl">
          <h1 className="text-2xl font-bold mb-4 text-center">Select Character</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900 rounded-md text-white">
              {error}
            </div>
          )}
          
          <div className="space-y-3 mb-6">
            {characters.map((char) => (
              <div 
                key={char.id}
                className="p-3 bg-slate-700 rounded-md cursor-pointer hover:bg-slate-600 transition-colors"
                onClick={() => handleSelectCharacter(char.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{char.name}</h3>
                    <p className="text-sm text-slate-300">Level {char.level} {char.class}</p>
                  </div>
                  <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-md text-sm">
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between">
            <button 
              onClick={() => setShowCharacterCreation(true)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors"
            >
              Create New Character
            </button>
            
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Character creation form
  if (isAuthenticated && showCharacterCreation) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-900 text-white">
        <div className="w-full max-w-md p-6 bg-slate-800 rounded-lg shadow-xl">
          <h1 className="text-2xl font-bold mb-4 text-center">Create Character</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900 rounded-md text-white">
              {error}
            </div>
          )}
          
          <form onSubmit={handleCreateCharacter} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Character Name</label>
              <input
                type="text"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                required
                className="w-full p-2 bg-slate-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Class</label>
              <select
                value={characterClass}
                onChange={(e) => setCharacterClass(e.target.value)}
                className="w-full p-2 bg-slate-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {CHARACTER_CLASSES.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              
              <div className="mt-2 p-3 bg-slate-700 rounded-md">
                <p className="text-sm">
                  {CHARACTER_CLASSES.find(c => c.id === characterClass)?.description}
                </p>
                <p className="text-sm text-blue-400 mt-1">
                  {CHARACTER_CLASSES.find(c => c.id === characterClass)?.startingStats}
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Appearance</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs mb-1">Skin</label>
                  <select
                    value={appearance.skin}
                    onChange={(e) => setAppearance({...appearance, skin: e.target.value})}
                    className="w-full p-2 bg-slate-700 rounded-md text-sm"
                  >
                    {APPEARANCE_OPTIONS.skin.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs mb-1">Hair</label>
                  <select
                    value={appearance.hair}
                    onChange={(e) => setAppearance({...appearance, hair: e.target.value})}
                    className="w-full p-2 bg-slate-700 rounded-md text-sm"
                  >
                    {APPEARANCE_OPTIONS.hair.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs mb-1">Eyes</label>
                  <select
                    value={appearance.eyes}
                    onChange={(e) => setAppearance({...appearance, eyes: e.target.value})}
                    className="w-full p-2 bg-slate-700 rounded-md text-sm"
                  >
                    {APPEARANCE_OPTIONS.eyes.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs mb-1">Outfit</label>
                  <select
                    value={appearance.outfit}
                    onChange={(e) => setAppearance({...appearance, outfit: e.target.value})}
                    className="w-full p-2 bg-slate-700 rounded-md text-sm"
                  >
                    {APPEARANCE_OPTIONS.outfit.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setShowCharacterCreation(false)}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-md transition-colors"
              >
                Back
              </button>
              
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors"
              >
                Create Character
              </button>
            </div>
          </form>
        </div>
      </main>
    );
  }

  // Registration form or login prompt
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-900 text-white">
      <div className="w-full max-w-md p-6 bg-slate-800 rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {showRegistrationForm ? 'Create Account' : 'Welcome to RPG Adventure'}
        </h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900 rounded-md text-white">
            {error}
          </div>
        )}
        
        {showRegistrationForm ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full p-2 bg-slate-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            
            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setShowRegistrationForm(false)}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-md transition-colors"
              >
                Back
              </button>
              
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors"
        >
                Register
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-center">
              Join the adventure in this multiplayer RPG powered by AI!
            </p>
            
            <div className="flex flex-col space-y-3 pt-2">
              <button
                onClick={() => setShowRegistrationForm(true)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                Create Account
              </button>
              
              {characters.length > 0 && (
                <button
                  onClick={() => {}}
                  className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors"
                >
                  Login with Existing Account
                </button>
              )}
            </div>
          </div>
        )}
    </div>
    </main>
  );
}
