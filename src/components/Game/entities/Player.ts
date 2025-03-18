import {
  Actor,
  Vector,
  Keys,
  Color,
  Circle,
  Engine
} from 'excalibur';

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
  speed: number = 150;
  isMoving: boolean = false;
  
  constructor(options: PlayerOptions) {
    super({
      name: options.name,
      pos: options.pos,
      width: 40,
      height: 40,
      color: getClassColor(options.class),
    });
    
    this.name = options.name;
    this.characterClass = options.class;
    this.level = options.level;
  }
  
  onInitialize(_engine: Engine): void {
    // Create a simple circle for the player
    const playerGraphic = new Circle({
      radius: 20,
      color: this.color
    });
    
    this.graphics.use(playerGraphic);
  }
  
  onPreUpdate(engine: Engine, delta: number): void {
    // Handle player movement input
    let direction = Vector.Zero;
    
    if (engine.input.keyboard.isHeld(Keys.W) || 
        engine.input.keyboard.isHeld(Keys.Up)) {
      direction.y = -1;
      this.isMoving = true;
    }
    
    if (engine.input.keyboard.isHeld(Keys.S) || 
        engine.input.keyboard.isHeld(Keys.Down)) {
      direction.y = 1;
      this.isMoving = true;
    }
    
    if (engine.input.keyboard.isHeld(Keys.A) || 
        engine.input.keyboard.isHeld(Keys.Left)) {
      direction.x = -1;
      this.isMoving = true;
    }
    
    if (engine.input.keyboard.isHeld(Keys.D) || 
        engine.input.keyboard.isHeld(Keys.Right)) {
      direction.x = 1;
      this.isMoving = true;
    }
    
    // Normalize and scale the movement vector
    if (!direction.equals(Vector.Zero)) {
      direction = direction.normalize().scale(this.speed * (delta / 1000));
      this.pos = this.pos.add(direction);
    } else {
      this.isMoving = false;
    }
  }
}

// Helper function to get color based on character class
function getClassColor(characterClass: string): Color {
  switch (characterClass.toLowerCase()) {
    case 'warrior':
      return Color.Red;
    case 'mage':
      return Color.Blue;
    case 'rogue':
      return Color.Green;
    case 'ranger':
      return Color.Yellow;
    default:
      return Color.White;
  }
} 