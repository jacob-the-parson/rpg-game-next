import { Engine, DisplayMode, Color } from 'excalibur';

// Game canvas dimensions
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

// Create the game engine instance
export const engine = new Engine({
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  displayMode: DisplayMode.FitScreen,
  backgroundColor: Color.fromHex('#000000'),
  antialiasing: false, // Pixel art optimization
  pixelRatio: 1, // For pixel-perfect rendering
  suppressPlayButton: true, // Auto-start the game
  canvasElementId: 'game-canvas', // ID for the canvas element
});

// Configure engine settings
engine.toggleDebug(); // Enable debug mode during development

// Export constants
export const CONSTANTS = {
  GAME_WIDTH,
  GAME_HEIGHT,
  TILE_SIZE: 16, // Base tile size for our assets
  SCALE: 2, // Default scale for our game (32x32 effective size)
  PLAYER_SPEED: 150, // Base player movement speed
  CAMERA_SPEED: 0.1, // Camera follow speed
}; 