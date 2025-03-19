# SpacetimeDB Module Comparison

## Directory Structure

### rpg-game (older version)
```
rpg-game
├── Cargo.lock
├── Cargo.toml
├── src
│   └── lib.rs
└── target
    ├── CACHEDIR.TAG
    ├── release
    │   ├── build
    │   │   ├── ahash-36323880774f8dc3
    │   │   ├── anyhow-567543c800290113
    │   │   ├── blake3-e4f0bc7cd26f97e1
    │   │   ├── generic-array-e40b7c18ef585e9d
    │   │   ├── num-traits-a00e762c3779ba4f
    │   │   ├── proc-macro2-4d26e14b78bf37e4
    │   │   ├── proc-macro2-ac3b292105d5a21c
    │   │   ├── serde-c9c92687d88aab75
    │   │   ├── thiserror-02676213195506cb
    │   │   ├── typenum-13a754e7459b764c
    │   │   └── zerocopy-37597cc287b3a567
    │   ├── deps/
    │   ├── examples/
    │   └── incremental/
    └── wasm32-unknown-unknown
        ├── CACHEDIR.TAG
        └── release
            ├── build/
            ├── deps/
            ├── examples/
            ├── incremental/
            ├── spacetime_module.d
            └── spacetime_module.wasm

### rpg-game-module (newer version)
```
rpg-game-module
├── Cargo.lock
├── Cargo.toml
├── src
│   └── lib.rs
└── target
    ├── CACHEDIR.TAG
    ├── release
    │   ├── build
    │   │   ├── ahash-36323880774f8dc3
    │   │   ├── anyhow-567543c800290113
    │   │   ├── blake3-13195b260528c8f9
    │   │   ├── generic-array-e40b7c18ef585e9d
    │   │   ├── num-traits-a00e762c3779ba4f
    │   │   ├── proc-macro2-4d26e14b78bf37e4
    │   │   ├── proc-macro2-ac3b292105d5a21c
    │   │   ├── serde-c9c92687d88aab75
    │   │   ├── serde-fc115992021de3b5
    │   │   ├── thiserror-02676213195506cb
    │   │   ├── typenum-13a754e7459b764c
    │   │   └── zerocopy-37597cc287b3a567
    │   ├── deps/
    │   ├── examples/
    │   └── incremental/
    └── wasm32-unknown-unknown
        ├── CACHEDIR.TAG
        └── release
            ├── build/
            ├── deps/
            ├── examples/
            ├── incremental/
            ├── spacetime_module.d
            └── spacetime_module.wasm
```

### Key Differences in Build Artifacts

1. The newer version (`rpg-game-module`) has additional serde dependencies and build artifacts:
   - `serde-fc115992021de3b5` in build
   - `libserde_derive-e79e672e717397eb.dylib` in deps
   - `serde_derive-e79e672e717397eb.d` in deps

2. Different blake3 hash versions:
   - Old: `blake3-e4f0bc7cd26f97e1`
   - New: `blake3-13195b260528c8f9`

3. Both versions compile to WebAssembly:
   - Both have `wasm32-unknown-unknown` target
   - Both produce `spacetime_module.wasm`

4. Build System:
   - Both use the same basic Rust/Cargo structure
   - Both have similar dependency trees
   - Newer version has more complete serde integration

## Code Differences

### Table Structures

#### User Table
- Both versions have similar base structure
- Newer version uses `#[spacetimedb(primary_key)]` instead of `#[primarykey]`
- Both store: identity, username, created_at, last_login

#### Character Table
Old version includes:
- Additional fields: class, level, direction, last_updated
- Uses position_x and position_y
- Includes direction field

New version:
- Simplified to x and y coordinates
- Removed class, level, and direction tracking
- More focused on basic positioning

#### CharacterAppearance Table
Old version:
- Fields: skin, hair, eyes, outfit

New version:
- Renamed to color-specific fields: skin_color, hair_color, outfit_color
- Removed eyes field

#### Session Table
Old version:
- Includes character_id
- Uses last_activity field

New version:
- Removed character_id
- Renamed to last_seen field

### Additional Features

New version adds:
- Counter table for ID generation
- More modern SpacetimeDB patterns
- Better error handling in position updates
- Uses ctx.timestamp instead of SystemTime
- More detailed logging

### Function Differences

#### register_user
- New version uses ctx.timestamp.as_i64() instead of SystemTime
- Better error handling and logging

#### create_character
Old version:
- Takes class parameter
- Sets initial position to (100, 100)
- Includes direction field

New version:
- Simplified parameters
- Sets initial position to (0, 0)
- Uses timestamp as ID

#### update_position
Old version:
- Includes direction parameter
- Updates last_updated field

New version:
- Removed direction parameter
- Added ownership verification
- Better error logging

## Key Improvements in New Version

1. Modern SpacetimeDB patterns and attribute syntax
2. Better error handling and logging
3. Simplified data structures
4. Removed unused fields
5. Better timestamp handling
6. Added character ownership verification
7. More consistent naming conventions

## Features to Consider Re-implementing

1. Character class system
2. Character level tracking
3. Direction tracking for characters
4. Character-session linking
5. Last update tracking for characters
6. Eye color customization

## Migration Notes

When transitioning to the new version, consider:
1. Data migration for existing characters
2. Updating client code to handle simplified appearance options
3. Adding back useful features like character class and level if needed
4. Implementing direction handling at the client level instead of server

### Cargo.toml Differences

#### rpg-game (older version)
```toml
[package]
name = "spacetime-module"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
spacetimedb = "1.0.0"
log = "0.4"
```

#### rpg-game-module (newer version)
```toml
[package]
name = "spacetime-module"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
log = "0.4"
serde = { version = "1.0.219", features = ["derive"] }
spacetimedb = "1.0.0"
```

Key Differences:
1. The newer version explicitly includes serde with derive features
2. Both use the same versions of spacetimedb and log
3. Both are configured as cdylib for WebAssembly compilation
4. Package metadata (name, version, edition) remains identical 