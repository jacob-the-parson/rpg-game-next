import { Engine, EngineOptions, Vector } from 'excalibur';
import { Player, Direction } from './entities/Player';
import { loader, Resources, preloadResources } from './resources';

export interface GameCharacterInfo {
  characterId: number;
  characterName: string;
  characterClass: string;
  level: number;
  position: { x: number; y: number };
}

export class GameEngine extends Engine {
  player: Player | null = null;
  characterInfo: GameCharacterInfo | null = null;
  resourcesLoaded: boolean = false;

  constructor(options: EngineOptions) {
    super(options);
    
    // Setup input system
    this.input.keyboard.on('press', (evt) => this.handleKeyPress(evt));
    
    // Setup global events
    this.on('visible', () => {
      console.log('Game is visible');
    });
    
    this.on('hidden', () => {
      console.log('Game is hidden');
    });
    
    this.on('blur', () => {
      console.log('Game lost focus');
    });
  }

  async start(): Promise<void> {
    try {
      console.log('Starting game engine...');
      
      // Start the engine first (UI and input handling)
      const startPromise = super.start();
      
      console.log('Engine started, now loading resources...');
      
      // Load resources using our custom preloader
      // This avoids the Excalibur loader's UI which causes screen context errors
      await preloadResources();
      
      // After resources are loaded, emit a custom event
      this.resourcesLoaded = true;
      this.emit('resourcesloaded', { sender: this });
      console.log('Resources loaded successfully');
      
      // Return the engine start promise
      return startPromise;
    } catch (error) {
      console.error('Failed during engine startup:', error);
      throw error;
    }
  }

  initializeGame(characterInfo: GameCharacterInfo): void {
    this.characterInfo = characterInfo;
    
    // Create player
    this.player = new Player({
      name: characterInfo.characterName,
      class: characterInfo.characterClass,
      level: characterInfo.level,
      pos: new Vector(characterInfo.position.x, characterInfo.position.y)
    });
  }

  /**
   * Gets the current player direction
   */
  getPlayerDirection(): Direction {
    return this.player?.direction || 'down';
  }

  private handleKeyPress(evt: any): void {
    // Handle global key presses
    if (evt.key === 'Escape') {
      console.log('Game menu toggled');
      // Toggle game menu
    }
  }
} 