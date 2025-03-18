import {
  Actor,
  Vector,
  Keys,
  Color,
  Engine,
  CollisionType,
  Circle,
  SpriteSheet,
  Animation,
  Sprite,
  ImageSource
} from 'excalibur';
import { Resources, getCharacterSprite, SPRITE_WIDTH, SPRITE_HEIGHT, SPRITE_SCALE } from '../resources';
import { GameEngine } from '../engine';

export interface PlayerOptions {
  name: string;
  class: string;
  level: number;
  pos: Vector;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export class Player extends Actor {
  name: string;
  characterClass: string;
  level: number;
  speed: number = 150;
  isMoving: boolean = false;
  direction: Direction = 'down';
  private spriteResource: ImageSource;
  private spriteSheet: SpriteSheet | null = null;
  private animations: { [key: string]: Animation } = {};
  private lastDirection: Direction = 'down';
  
  constructor(options: PlayerOptions) {
    super({
      name: options.name,
      pos: options.pos,
      width: SPRITE_WIDTH,
      height: SPRITE_HEIGHT,
      color: getClassColor(options.class),
      collisionType: CollisionType.Active
    });
    
    this.name = options.name;
    this.characterClass = options.class;
    this.level = options.level;
    
    // Store the sprite resource for later use
    this.spriteResource = getCharacterSprite(this.characterClass);
  }
  
  onInitialize(engine: Engine): void {
    console.log(`Initializing player: ${this.name} (${this.characterClass})`);
    
    // First, always set up a fallback graphic (the colored circle)
    const circle = new Circle({
      radius: 20,
      color: this.color
    });
    
    this.graphics.use(circle);
    
    // Check if resources are already loaded
    if (engine instanceof GameEngine && engine.resourcesLoaded) {
      this.setupSprites();
    }
    
    // Set up a listener for when resources are loaded
    if (engine instanceof GameEngine) {
      engine.on('resourcesloaded', () => {
        console.log('Received resourcesloaded event, setting up player sprites');
        this.setupSprites();
      });
    }
  }
  
  private setupSprites(): void {
    try {
      if (!this.spriteResource.isLoaded()) {
        console.error("Sprite resource not loaded yet");
        return;
      }
      
      console.log('Setting up sprite animations for player');
      
      // Get the actual dimensions of the loaded sprite sheet
      const img = this.spriteResource.data;
      console.log(`Sprite sheet dimensions: ${img.width}x${img.height}`);
      
      // Calculate sprite dimensions (8x8 grid)
      const actualSpriteWidth = Math.floor(img.width / 8);
      const actualSpriteHeight = Math.floor(img.height / 8);
      
      console.log(`Individual sprite dimensions: ${actualSpriteWidth}x${actualSpriteHeight}`);
      
      // Create a sprite sheet from the loaded resource
      this.spriteSheet = SpriteSheet.fromImageSource({
        image: this.spriteResource,
        grid: {
          rows: 8,
          columns: 8,
          spriteWidth: actualSpriteWidth,
          spriteHeight: actualSpriteHeight
        }
      });
      
      const scaleRatio = Math.max(2, Math.floor(64 / actualSpriteWidth));
      
      // Create walking animations for all directions
      // Walking up (first row of walking section)
      this.animations.walkUp = Animation.fromSpriteSheet(
        this.spriteSheet, [40, 41, 42], 200  // Row 6, first 3 frames
      );
      this.animations.idleUp = Animation.fromSpriteSheet(
        this.spriteSheet, [40], 0  // First frame only
      );
      
      // Walking right (second row of walking section)
      this.animations.walkRight = Animation.fromSpriteSheet(
        this.spriteSheet, [48, 49, 50], 200  // Row 7, first 3 frames
      );
      this.animations.idleRight = Animation.fromSpriteSheet(
        this.spriteSheet, [48], 0  // First frame only
      );
      
      // Walking left (third row of walking section)
      this.animations.walkLeft = Animation.fromSpriteSheet(
        this.spriteSheet, [56, 57, 58], 200  // Row 8, first 3 frames
      );
      this.animations.idleLeft = Animation.fromSpriteSheet(
        this.spriteSheet, [56], 0  // First frame only
      );
      
      // Walking down (fourth row of walking section)
      this.animations.walkDown = Animation.fromSpriteSheet(
        this.spriteSheet, [32, 33, 34], 200  // Row 5, first 3 frames
      );
      this.animations.idleDown = Animation.fromSpriteSheet(
        this.spriteSheet, [32], 0  // First frame only
      );
      
      // Set scale for all animations
      Object.values(this.animations).forEach(anim => {
        anim.scale = new Vector(scaleRatio, scaleRatio);
      });
      
      // Start with down idle animation
      this.graphics.use(this.animations.idleDown);
      
      console.log('All animations set up successfully');
      
    } catch (error) {
      console.error("Failed to set up sprite animations:", error);
    }
  }
  
  private updateAnimation(): void {
    if (!this.animations) return;
    
    const isMoving = !this.vel.equals(Vector.Zero);
    
    // Update last direction based on movement
    if (isMoving) {
      if (this.vel.x > 0) {
        this.lastDirection = 'right';
      } else if (this.vel.x < 0) {
        this.lastDirection = 'left';
      } else if (this.vel.y < 0) {
        this.lastDirection = 'up';
      } else if (this.vel.y > 0) {
        this.lastDirection = 'down';
      }
    }
    
    // Use the appropriate animation based on movement state
    if (!isMoving) {
      // When not moving, use the idle animation for the last direction
      switch (this.lastDirection) {
        case 'right':
          this.graphics.use(this.animations.idleRight);
          break;
        case 'left':
          this.graphics.use(this.animations.idleLeft);
          break;
        case 'up':
          this.graphics.use(this.animations.idleUp);
          break;
        case 'down':
          this.graphics.use(this.animations.idleDown);
          break;
      }
    } else {
      // When moving, use the walking animation for the current direction
      switch (this.lastDirection) {
        case 'right':
          this.graphics.use(this.animations.walkRight);
          break;
        case 'left':
          this.graphics.use(this.animations.walkLeft);
          break;
        case 'up':
          this.graphics.use(this.animations.walkUp);
          break;
        case 'down':
          this.graphics.use(this.animations.walkDown);
          break;
      }
    }
  }
  
  onPreUpdate(engine: Engine, delta: number): void {
    // Handle player movement input
    let direction = Vector.Zero;
    
    if (engine.input.keyboard.isHeld(Keys.W) || 
        engine.input.keyboard.isHeld(Keys.Up)) {
      direction.y = -1;
    }
    
    if (engine.input.keyboard.isHeld(Keys.S) || 
        engine.input.keyboard.isHeld(Keys.Down)) {
      direction.y = 1;
    }
    
    if (engine.input.keyboard.isHeld(Keys.A) || 
        engine.input.keyboard.isHeld(Keys.Left)) {
      direction.x = -1;
    }
    
    if (engine.input.keyboard.isHeld(Keys.D) || 
        engine.input.keyboard.isHeld(Keys.Right)) {
      direction.x = 1;
    }
    
    // Normalize and scale the movement vector
    if (!direction.equals(Vector.Zero)) {
      direction = direction.normalize().scale(this.speed * (delta / 1000));
      this.vel = direction;  // Store velocity for animation
      this.pos = this.pos.add(direction);
    } else {
      this.vel = Vector.Zero;
    }
    
    // Update animation based on movement
    this.updateAnimation();
  }
}

// Helper function to get a color based on character class
function getClassColor(characterClass: string): Color {
  switch (characterClass.toLowerCase()) {
    case 'warrior':
      return Color.Red;
    case 'mage':
      return Color.Blue;
    default:
      return Color.Green;
  }
} 