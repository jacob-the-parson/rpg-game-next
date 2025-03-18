# Asset Organization

## Directory Structure

```
rpg-game/
└── assets/
    ├── characters/     # Player and NPC sprites
    ├── tilesets/       # Terrain and environment tiles
    ├── buildings/      # Houses, castles, and structures
    ├── ui/            # User interface elements
    └── props/         # Decorative objects and items
```

## Asset Sources

### Character Assets
1. **Top down RPG characters V1.01** by Arcade Island
   - Male and female characters
   - 6 animations per character
   - Multiple outfits and hairstyles
   - License: Free for commercial use, no redistribution

### Environment Assets
1. **Zelda-like tilesets and sprites** from OpenGameArt
   - 16x16 overworld tileset
   - Castle and house tiles
   - Cave tileset
   - Indoor tileset
   - License: CC0 (Public Domain)

2. **Green Woods II** by hello_tazzina
   - Environmental elements
   - Props and decorations
   - Animated elements (waterfalls, flags)
   - Trees and architectural elements
   - License: Free for commercial use with attribution

## Asset Guidelines

### Naming Conventions
- All lowercase
- Use hyphens for spaces
- Include size in filename
- Include animation frame count if applicable

Example:
```
character-male-16x16-walk-8frames.png
building-house-32x32-blue.png
tileset-grass-16x16.png
```

### Organization Rules
1. Each asset type in its appropriate directory
2. Animation frames in sprite sheets
3. Keep original assets in a separate 'source' subdirectory
4. Include attribution and license info in each directory

### Required Formats
- Sprites: PNG with transparency
- Tilesets: PNG with transparency
- UI Elements: PNG with transparency
- Sprite sheets: Horizontal layout preferred
- Recommended sizes: 16x16, 32x32, or 64x64

### Metadata
Each asset directory should include a `metadata.json` file:
```json
{
  "name": "asset-name",
  "author": "author-name",
  "license": "license-type",
  "source": "source-url",
  "date_added": "YYYY-MM-DD",
  "last_modified": "YYYY-MM-DD",
  "specifications": {
    "size": "WxH",
    "frame_count": N,
    "animation_fps": N
  }
}
``` 