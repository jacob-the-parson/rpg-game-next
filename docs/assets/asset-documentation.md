# RPG Game Assets Documentation

This document provides information about all the art assets used in the RPG game project.

## Asset Packs Overview

### 1. Mystic Woods (Exterior Environment)
- **Location:** `tilesets/exterior/`
- **Creator:** Game Endeavor
- **License:** Free Version
  - Can be used in non-commercial projects
  - Assets can be modified
  - Cannot redistribute or resell, even if modified
- **Contents:**
  - Environmental tiles
  - Props and objects
  - Nature elements
  - Source: [Game Endeavor](https://twitter.com/GameEndeavor)

### 2. Modern Interiors (Interior Environment)
- **Location:** `tilesets/interior/`
- **Creator:** LimeZu
- **License:** Free Version
  - Can be used in non-commercial projects
  - Assets can be modified for non-commercial use
  - Cannot use in commercial projects
  - Cannot redistribute or resell
- **Contents:**
  - Interior tileset
  - Furniture and decorations
  - Indoor props

### 3. Mana Seed Character Base (Player Characters)
- **Location:** `characters/player/`
- **Creator:** Seliel the Shaper
- **Contents:**
  - Base character sprites
  - Character animations
  - Customizable elements

### 4. Tiny RPG Character Pack (NPCs)
- **Location:** `characters/npcs/`
- **Contents:**
  - NPC character sprites
  - Various character types
  - Animation sets

### 5. Character Generator Tool
- **Location:** `tools/Character Generator 2.0 Linux Build/`
- **Purpose:** Generate custom character sprites
- **Features:**
  - Customizable character parts
  - Multiple size options (16x16, 32x32, 48x48)
  - Export options for game integration

## Directory Structure
```
assets/
├── characters/
│   ├── player/    # Player character sprites and animations
│   │   ├── char_a_p1/  # Base character assets
│   │   │   ├── 1out/   # Outfit components
│   │   │   ├── 4har/   # Hair components
│   │   │   └── 5hat/   # Hat components
│   │   └── guides/     # Animation guides
│   ├── npcs/      # NPC sprites and animations
│   │   ├── 16x16/ # Small NPC sprites
│   │   └── Characters(100x100)/ # Large NPC sprites
│   └── combat/    # Combat-specific sprites and effects
├── tilesets/
│   ├── exterior/  # Outdoor environment tiles
│   │   ├── characters/ # Environment NPCs
│   │   ├── objects/    # Decorative elements
│   │   └── tilesets/   # Terrain tiles
│   └── interior/  # Indoor environment tiles
│       ├── 16x16/ # Small tiles
│       ├── 32x32/ # Medium tiles
│       └── 48x48/ # Large tiles
└── tools/        # Asset generation tools
    └── Character Generator 2.0 Linux Build/ # Character creator
```

## Usage Guidelines

1. **Non-Commercial Use Only**
   - These assets are free versions and can only be used in non-commercial projects
   - Modifications are allowed for non-commercial use only

2. **Attribution Requirements**
   - Credit Game Endeavor for Mystic Woods assets
   - Credit LimeZu for Modern Interior assets
   - Credit respective creators for other assets

3. **Restrictions**
   - No redistribution of assets
   - No reselling of assets, modified or not
   - No commercial use

## Asset Integration

### Character Sprites
- Character sprites are organized by size in their respective folders
- Animation frames are provided as sprite sheets
- Use the character generator tool for custom character variants

### Tilesets
- Tilesets are organized by environment type and size
- Use tileset templates for consistent level design
- Follow the existing pattern for new level creation

### Implementation Notes
- When implementing new sprites, match the existing pixel size conventions
- Maintain consistent animation frame timing 
- Use the provided shadow sprites for proper visual effects
- Keep to the established color palette for visual consistency 