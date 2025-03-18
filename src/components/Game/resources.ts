import { ImageSource, Loader, Color } from 'excalibur';

// Define all game resources here
export const Resources = {
  // Use the human character sprite sheet for the warrior
  WarriorSprite: new ImageSource('/assets/characters/player/char_a_p1/char_a_p1_0bas_humn_v01.png'),
  
  // Keep the orc sprite for the mage
  MageSprite: new ImageSource('/assets/characters/combat/100x100/Orc.png'),
};

// Create a simplified loader with minimal UI to avoid screen dependency issues
export const loader = new Loader();

// Disable the loader's UI completely to avoid screen dependency
loader.suppressPlayButton = true;
loader.logo = '';
loader.logoWidth = 0;
loader.logoHeight = 0;

// Add each resource to the loader
for (const [key, resource] of Object.entries(Resources)) {
  loader.addResource(resource);
}

// Manual preload function that doesn't depend on Excalibur's loader UI
export async function preloadResources(): Promise<void> {
  try {
    // Load each resource individually using the browser's fetch API
    const loadPromises = Object.entries(Resources).map(async ([key, resource]) => {
      try {
        // If the resource is already loaded, don't reload it
        if (resource.isLoaded()) {
          console.log(`Resource ${key} already loaded`);
          return Promise.resolve();
        }
        
        // Manual load using standard fetch
        const response = await fetch(resource.path);
        if (!response.ok) {
          throw new Error(`Failed to load ${key}: ${response.statusText}`);
        }
        
        const blob = await response.blob();
        const img = new Image();
        img.src = URL.createObjectURL(blob);
        
        return new Promise<void>((resolve, reject) => {
          img.onload = () => {
            // Update the ImageSource with the loaded image
            resource.data = img;
            console.log(`Loaded resource: ${key}`);
            resolve();
          };
          img.onerror = (e) => {
            console.error(`Failed to load image ${key}:`, e);
            reject(new Error(`Failed to load image ${key}`));
          };
        });
      } catch (error) {
        console.error(`Error loading resource ${key}:`, error);
        return Promise.resolve(); // Continue with other resources even if one fails
      }
    });
    
    // Wait for all resources to load
    await Promise.all(loadPromises);
    console.log('All resources loaded successfully');
  } catch (error) {
    console.error('Error during resource preloading:', error);
    throw error;
  }
}

// Constants for the sprite sheet - these will be updated dynamically in the Player class
export const SPRITE_WIDTH = 0;    // Will be calculated based on actual image size
export const SPRITE_HEIGHT = 0;   // Will be calculated based on actual image size
export const SPRITE_SCALE = 0;    // Will be calculated based on actual sprite size

// Export a helper function to get the appropriate sprite based on character class
export function getCharacterSprite(characterClass: string): ImageSource {
  switch(characterClass.toLowerCase()) {
    case 'warrior':
      return Resources.WarriorSprite;
    case 'mage':
      return Resources.MageSprite;
    default:
      return Resources.WarriorSprite; // Default to warrior sprite
  }
} 