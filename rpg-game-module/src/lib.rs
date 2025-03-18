use spacetimedb::{ReducerContext, Table};
use serde::{Serialize, Deserialize};

// User account table
#[spacetimedb::table(name = user)]
#[derive(Serialize, Deserialize, Clone)]
pub struct User {
    #[primary_key]
    pub identity: String,
    pub username: String,
    pub created_at: u64,  // Unix timestamp
    pub last_login: u64,  // Unix timestamp
}

// Character table
#[spacetimedb::table(name = character)]
#[derive(Serialize, Deserialize, Clone)]
pub struct Character {
    #[primary_key]
    pub id: u64,
    pub user_identity: String,
    pub name: String,
    pub class: String,
    pub level: u32,
    pub position_x: f32,
    pub position_y: f32,
    pub direction: String,
    pub created_at: u64,
    pub last_updated: u64,
}

// Character appearance
#[spacetimedb::table(name = character_appearance)]
#[derive(Serialize, Deserialize, Clone)]
pub struct CharacterAppearance {
    #[primary_key]
    pub character_id: u64,
    pub skin: String,
    pub hair: String,
    pub eyes: String,
    pub outfit: String,
}

// Active player sessions
#[spacetimedb::table(name = session)]
#[derive(Serialize, Deserialize, Clone)]
pub struct Session {
    #[primary_key]
    pub identity: String,
    pub character_id: u64,
    pub connected_at: u64,
    pub last_activity: u64,
}

// Auto-incrementing counter
#[spacetimedb::table(name = counter)]
#[derive(Serialize, Deserialize, Clone)]
pub struct Counter {
    #[primary_key]
    pub name: String,
    pub value: u64,
}

// Module initialization
#[spacetimedb::reducer(init)]
pub fn init(ctx: &ReducerContext) {
    // Initialize counters
    ctx.db.counter().try_insert(Counter {
        name: "character_id".to_string(),
        value: 1,
    });
    log::info!("RPG Game module initialized");
}

// Client connection handler
#[spacetimedb::reducer(client_connected)]
pub fn identity_connected(ctx: &ReducerContext) {
    let identity = ctx.sender.to_string();
    
    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs();
    
    // Record session
    let characters = ctx.db.character()
        .iter()
        .filter(|c| c.user_identity == identity)
        .collect::<Vec<_>>();
    
    if let Some(character) = characters.first() {
        ctx.db.session().try_insert(Session {
            identity: identity.clone(),
            character_id: character.id,
            connected_at: timestamp,
            last_activity: timestamp,
        });
        
        log::info!("Player connected: {} with character {}", identity, character.name);
    } else {
        log::info!("New player connected: {}", identity);
    }
}

// Client disconnection handler
#[spacetimedb::reducer(client_disconnected)]
pub fn identity_disconnected(ctx: &ReducerContext) {
    let identity = ctx.sender.to_string();
    
    // Clean up session
    for session in ctx.db.session().iter().filter(|s| s.identity == identity) {
        ctx.db.session().delete(session.clone());
    }
    log::info!("Player disconnected: {}", identity);
}

// Create a new user account
#[spacetimedb::reducer]
pub fn register_user(ctx: &ReducerContext, username: String) {
    let identity = ctx.sender.to_string();
    
    // Check if user already exists
    let exists = ctx.db.user().iter().any(|u| u.identity == identity);
    if exists {
        log::error!("User already exists: {}", identity);
        return;
    }
    
    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs();
    
    // Create user
    ctx.db.user().try_insert(User {
        identity,
        username,
        created_at: timestamp,
        last_login: timestamp,
    });
    
    log::info!("User registered");
}

// Create a new character
#[spacetimedb::reducer]
pub fn create_character(
    ctx: &ReducerContext, 
    name: String, 
    character_class: String,
    skin: String,
    hair: String,
    eyes: String,
    outfit: String
) {
    let identity = ctx.sender.to_string();
    
    // Check if user exists
    let user_exists = ctx.db.user().iter().any(|u| u.identity == identity);
    if !user_exists {
        log::error!("User not found");
        return;
    }
    
    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs();
    
    // Get next character ID
    let counter = ctx.db.counter()
        .iter()
        .find(|c| c.name == "character_id")
        .unwrap()
        .clone();
    
    let character_id = counter.value;
    
    // Update counter
    ctx.db.counter().try_insert(Counter {
        name: "character_id".to_string(),
        value: character_id + 1,
    });
    
    // Create character
    ctx.db.character().try_insert(Character {
        id: character_id,
        user_identity: identity,
        name: name.clone(),
        class: character_class,
        level: 1,
        position_x: 0.0,
        position_y: 0.0,
        direction: "down".to_string(),
        created_at: timestamp,
        last_updated: timestamp,
    });
    
    // Create appearance
    ctx.db.character_appearance().try_insert(CharacterAppearance {
        character_id,
        skin,
        hair,
        eyes,
        outfit,
    });
    
    log::info!("Character created: {} (ID: {})", name, character_id);
}

// Update character position
#[spacetimedb::reducer]
pub fn update_position(ctx: &ReducerContext, character_id: u64, x: f32, y: f32, direction: String) {
    let identity = ctx.sender.to_string();
    
    // Find character
    if let Some(character) = ctx.db.character().iter().find(|c| c.id == character_id) {
        // Ensure the character belongs to this user
        if character.user_identity != identity {
            log::error!("Character does not belong to user");
            return;
        }
        
        let timestamp = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs();
        
        // Update position
        let updated_character = Character {
            position_x: x,
            position_y: y,
            direction: direction.clone(),
            last_updated: timestamp,
            ..character.clone()
        };
        
        ctx.db.character().try_insert(updated_character);
        
        // Update session activity
        if let Some(session) = ctx.db.session().iter().find(|s| s.identity == identity) {
            let updated_session = Session {
                last_activity: timestamp,
                ..session.clone()
            };
            ctx.db.session().try_insert(updated_session);
        }
    } else {
        log::error!("Character not found: {}", character_id);
    }
}
