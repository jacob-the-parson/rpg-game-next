import { Engine, EngineOptions, Vector } from 'excalibur';
import { Player } from './entities/Player';

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

  private handleKeyPress(evt: any): void {
    // Handle global key presses
    if (evt.key === 'Escape') {
      console.log('Game menu toggled');
      // Toggle game menu
    }
  }
} 