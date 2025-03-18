# RPG Game Technical Documentation

## Project Overview
A Next.js-based RPG game using Excalibur.js for game engine functionality. The game features character movement, sprite animations, and a flexible backend system using SpacetimeDB.

## Current Implementation

### Authentication System
- Basic authentication flow implemented
- Username-based registration
- Mock mode for testing without backend
- SpacetimeDB integration in progress

### Character System
- **Character Classes**: 
  - Warrior (implemented with walking animation)
  - Mage (placeholder implementation)
- **Movement System**:
  - WASD and Arrow key controls
  - Normalized diagonal movement
  - Delta time-based movement for smooth motion
  - Velocity-based animation state management

### Animation System
- **Sprite Implementation**:
  - Dynamic sprite sheet loading
  - 8x8 grid configuration
  - Proper frame selection for each direction
  - Scale factor based on sprite dimensions
- **Animation States**:
  - Walking animations in 4 directions
  - Idle states for each direction
  - 200ms frame timing for walking
  - Direction persistence when stopping

### Technical Architecture

#### File Structure
```
src/
├── components/
│   └── Game/
│       ├── entities/
│       │   └── Player.ts     # Player entity implementation
│       ├── scenes/
│       │   └── MainScene.ts  # Main game scene
│       ├── engine.ts         # Game engine setup
│       ├── resources.ts      # Resource management
│       └── index.tsx         # Main game component
├── contexts/
│   └── AuthContext.tsx       # Authentication state
└── lib/
    └── spacetime.ts         # SpacetimeDB integration
```

#### Key Components

1. **Player Entity**
   - Handles movement and animations
   - Maintains direction state
   - Manages sprite animations
   - Implements collision bounds

2. **Main Scene**
   - Sets up game world
   - Manages player instance
   - Handles background color
   - Future: Will handle tilemaps and objects

3. **Resource Management**
   - Dynamic sprite loading
   - Asset preloading system
   - Error handling for missing assets
   - Scale management for sprites

### Development Guidelines

#### Running the Game
1. Start in development mode:
   ```bash
   npm run dev
   ```
2. Access at http://localhost:3000

#### Testing
- Use mock mode for rapid development
- Test all movement directions
- Verify animation states
- Check character creation flow

#### Adding Features
1. Implement in appropriate component
2. Update documentation
3. Test in both mock and SpacetimeDB modes
4. Add error handling

### Current Limitations
1. No tilemap implementation yet
2. Limited collision detection
3. Basic mock character system
4. Placeholder mage class

## Planned Features

### Immediate Priority
1. Complete SpacetimeDB integration
2. Add tilemap support
3. Implement collision detection
4. Enhance character creation UI

### Future Enhancements
1. Combat system
2. NPC interactions
3. Inventory system
4. Quest system

## Troubleshooting

### Common Issues
1. Sprite loading failures
   - Check asset paths
   - Verify file permissions
2. Animation glitches
   - Check frame indices
   - Verify sprite sheet dimensions
3. Movement issues
   - Check keyboard input handling
   - Verify velocity calculations

### Development Tips
1. Use console.logs for animation debugging
2. Check browser console for asset loading
3. Verify sprite sheet dimensions match code
4. Test on multiple browsers 