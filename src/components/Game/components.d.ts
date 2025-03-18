declare module './engine' {
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
    player: Player | null;
    characterInfo: GameCharacterInfo | null;
    constructor(options: EngineOptions);
    initializeGame(characterInfo: GameCharacterInfo): void;
  }
}

declare module './entities/Player' {
  import { Actor, Vector } from 'excalibur';

  export interface PlayerOptions {
    name: string;
    class: string;
    level: number;
    pos: Vector;
  }

  export class Player extends Actor {
    name: string;
    characterClass: string;
    level: number;
    speed: number;
    isMoving: boolean;
  }
}

declare module './scenes/MainScene' {
  import { Scene, Engine } from 'excalibur';
  import { GameEngine } from '../engine';

  export class MainScene extends Scene {
    engine: GameEngine;
    constructor(engine: GameEngine);
  }
} 