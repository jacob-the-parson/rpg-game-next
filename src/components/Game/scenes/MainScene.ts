import { Scene, Color, Engine, TileMap, Tile, SpriteSheet, Actor, Circle, Vector, CollisionType, Rectangle } from 'excalibur';
import { GameEngine } from '../engine';
import { Resources } from '../resources';

// Simple tree class
class Tree extends Actor {
  constructor(x: number, y: number) {
    super({
      pos: new Vector(x, y),
      width: 40,
      height: 60,
      color: Color.fromHex('#2e7d32'), // Dark green
      collisionType: CollisionType.Fixed // Trees are solid
    });
  }
  
  onInitialize(_engine: Engine): void {
    // Create a trunk (rectangle)
    const trunk = new Rectangle({
      width: 16,
      height: 30,
      color: Color.fromHex('#795548') // Brown
    });
    
    // Create foliage (circle)
    const foliage = new Circle({
      radius: 20,
      color: Color.fromHex('#2e7d32') // Dark green
    });
    
    // Add trunk and position it at the bottom of the actor
    this.graphics.add('trunk', trunk);
    
    // Add foliage and position it at the top of the actor
    this.graphics.add('foliage', foliage);
    
    // Composite graphics don't need position setting in this version of Excalibur
    // Let's just use the graphic directly
    console.log('Tree graphic created');
  }
}

// Simple rock class
class Rock extends Actor {
  constructor(x: number, y: number) {
    super({
      pos: new Vector(x, y),
      width: 30,
      height: 25,
      color: Color.Gray,
      collisionType: CollisionType.Fixed // Rocks are solid
    });
  }
  
  onInitialize(_engine: Engine): void {
    // Create a simple rock with an oval shape
    const rockShape = new Circle({
      radius: 15,
      color: Color.Gray
    });
    
    this.graphics.use(rockShape);
    console.log('Rock graphic created');
  }
}

export class MainScene extends Scene {
  engine: GameEngine;
  private tileMap: TileMap | null = null;

  constructor(engine: GameEngine) {
    super();
    this.engine = engine;
  }

  onInitialize(_engine: Engine): void {
    console.log('Main scene initialized');
    
    // Create a simple background
    this.createBackground();
    
    // Add some scenery
    this.addScenery();
    
    // Add player to the scene if it exists
    if (this.engine.player) {
      this.add(this.engine.player);
      
      // Set up camera to follow player
      this.camera.strategy.lockToActor(this.engine.player);
    }
  }
  
  private createBackground(): void {
    try {
      // Create a simple grass tilemap
      const tileSize = 32;
      const mapWidth = 40;  // 40 tiles wide (40 * 32 = 1280px)
      const mapHeight = 30; // 30 tiles high (30 * 32 = 960px)
      
      // Create a simple tilemap with green cells
      this.tileMap = new TileMap({
        rows: mapHeight,
        columns: mapWidth,
        tileWidth: tileSize,
        tileHeight: tileSize
      });
      
      // Set the background to a green color - simpler than dealing with individual tiles
      this.backgroundColor = Color.fromHex('#4CAF50'); // Green color for grass
      
      // Add the tilemap to the scene (if we need it for later)
      if (this.tileMap) {
        this.add(this.tileMap);
      }
      
    } catch (error) {
      console.error('Error creating background:', error);
    }
  }
  
  private addScenery(): void {
    try {
      // Add some trees around the edges and randomly
      
      // Top and bottom tree rows
      for (let x = 100; x < 1200; x += 150) {
        // Top row of trees
        const topTree = new Tree(x, 100);
        this.add(topTree);
        
        // Bottom row of trees
        const bottomTree = new Tree(x, 800);
        this.add(bottomTree);
      }
      
      // Left and right tree columns
      for (let y = 100; y < 800; y += 150) {
        // Left column of trees
        const leftTree = new Tree(100, y);
        this.add(leftTree);
        
        // Right column of trees
        const rightTree = new Tree(1200, y);
        this.add(rightTree);
      }
      
      // Add some rocks randomly in the center area
      for (let i = 0; i < 15; i++) {
        const x = 200 + Math.random() * 900;
        const y = 200 + Math.random() * 500;
        
        const rock = new Rock(x, y);
        this.add(rock);
      }
      
      // Add some random trees in the center
      for (let i = 0; i < 8; i++) {
        const x = 300 + Math.random() * 700;
        const y = 300 + Math.random() * 300;
        
        const tree = new Tree(x, y);
        this.add(tree);
      }
      
      console.log('Scenery added to the map');
      
    } catch (error) {
      console.error('Error adding scenery:', error);
    }
  }

  onActivate(): void {
    console.log('Main scene activated');
  }

  onDeactivate(): void {
    console.log('Main scene deactivated');
  }
}