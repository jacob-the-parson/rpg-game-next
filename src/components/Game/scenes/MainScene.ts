import { Scene, Color, Engine } from 'excalibur';
import { GameEngine } from '../engine';

export class MainScene extends Scene {
  engine: GameEngine;

  constructor(engine: GameEngine) {
    super();
    this.engine = engine;
  }

  onInitialize(_engine: Engine): void {
    console.log('Main scene initialized');
    
    // Add player to the scene if it exists
    if (this.engine.player) {
      this.add(this.engine.player);
      
      // Set up camera to follow player
      this.camera.strategy.lockToActor(this.engine.player);
    }
  }

  onActivate(): void {
    console.log('Main scene activated');
  }

  onDeactivate(): void {
    console.log('Main scene deactivated');
  }
}