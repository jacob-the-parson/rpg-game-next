use spacetimedb::{spacetimedb, Identity, ReducerContext, Timestamp};
use serde::{Deserialize, Serialize};

// User account table
#[spacetimedb(table)]
pub struct User {
    #[primarykey]
    pub identity: Identity,
    pub username: String,
    pub created_at: Timestamp,
    pub last_login: Timestamp,
}

// Character table
#[spacetimedb(table)]
pub struct Character {
    #[primarykey]
    pub id: u64,
    pub user_identity: Identity,
    pub name: String,
    pub class: String,
    pub level: u32,
    pub position_x: f32,
    pub position_y: f32,
    pub created_at: Timestamp,
    pub last_updated: Timestamp,
}

// Character appearances
#[spacetimedb(table)]
pub struct CharacterAppearance {
    #[primarykey]
    pub character_id: u64,
    pub skin: String,
    pub hair: String,
    pub eyes: String,
    pub outfit: String,
}

// Session table for active players
#[spacetimedb(table)]
pub struct Session {
    #[primarykey]
    pub identity: Identity,
    pub character_id: u64,
    pub connected_at: Timestamp,
    pub last_activity: Timestamp,
}

// Counter for unique IDs
#[spacetimedb(table)]
pub struct Counter {
    #[primarykey]
    pub name: String,
    pub value: u64,
}

// Define reducer functions
#[spacetimedb(reducer)]
pub fn register_user(ctx: ReducerContext, username: String) -> Result<(), String> {
    let identity = ctx.sender;
    let timestamp = ctx.timestamp;
    
    // Check if user already exists
    if User::filter_by_identity(&identity).count() > 0 {
        return Err("User already registered".to_string());
    }
    
    // Create new user
    User::insert(User {
        identity,
        username,
        created_at: timestamp,
        last_login: timestamp,
    });
    
    Ok(())
}

#[spacetimedb(reducer)]
pub fn create_character(
    ctx: ReducerContext,
    name: String,
    class: String,
    skin: String,
    hair: String,
    eyes: String,
    outfit: String,
) -> Result<u64, String> {
    let identity = ctx.sender;
    let timestamp = ctx.timestamp;
    
    // Check if user exists
    if User::filter_by_identity(&identity).count() == 0 {
        return Err("User not registered".to_string());
    }
    
    // Check if character name is taken
    if Character::filter_by_name(&name).count() > 0 {
        return Err("Character name already taken".to_string());
    }
    
    // Get next character ID
    let counter = Counter::filter_by_name(&"character_id".to_string())
        .first()
        .cloned()
        .unwrap_or(Counter {
            name: "character_id".to_string(),
            value: 0,
        });
    
    let character_id = counter.value + 1;
    
    // Update counter
    Counter::insert(Counter {
        name: "character_id".to_string(),
        value: character_id,
    });
    
    // Create character with starting position
    Character::insert(Character {
        id: character_id,
        user_identity: identity,
        name,
        class,
        level: 1,
        position_x: 0.0, // Starting position
        position_y: 0.0, // Starting position
        created_at: timestamp,
        last_updated: timestamp,
    });
    
    // Create character appearance
    CharacterAppearance::insert(CharacterAppearance {
        character_id,
        skin,
        hair,
        eyes,
        outfit,
    });
    
    Ok(character_id)
}

#[spacetimedb(reducer)]
pub fn login(ctx: ReducerContext, character_id: u64) -> Result<(), String> {
    let identity = ctx.sender;
    let timestamp = ctx.timestamp;
    
    // Check if user exists
    if User::filter_by_identity(&identity).count() == 0 {
        return Err("User not registered".to_string());
    }
    
    // Check if character exists and belongs to user
    let character = Character::filter_by_id(&character_id)
        .filter(|c| c.user_identity == identity)
        .first();
    
    if character.is_none() {
        return Err("Character not found or does not belong to user".to_string());
    }
    
    // Update last login time
    let user = User::filter_by_identity(&identity).first().unwrap();
    User::update_by_identity(
        &identity,
        User {
            identity,
            username: user.username.clone(),
            created_at: user.created_at,
            last_login: timestamp,
        },
    );
    
    // Create or update session
    Session::insert(Session {
        identity,
        character_id,
        connected_at: timestamp,
        last_activity: timestamp,
    });
    
    Ok(())
}

#[spacetimedb(reducer)]
pub fn logout(ctx: ReducerContext) -> Result<(), String> {
    let identity = ctx.sender;
    
    // Remove session
    if Session::filter_by_identity(&identity).count() > 0 {
        Session::delete_by_identity(&identity);
    }
    
    Ok(())
}

#[spacetimedb(reducer)]
pub fn update_position(ctx: ReducerContext, x: f32, y: f32) -> Result<(), String> {
    let identity = ctx.sender;
    let timestamp = ctx.timestamp;
    
    // Check if user is logged in
    let session = Session::filter_by_identity(&identity).first();
    if session.is_none() {
        return Err("Not logged in".to_string());
    }
    
    let character_id = session.unwrap().character_id;
    
    // Update character position
    let character = Character::filter_by_id(&character_id).first().unwrap();
    Character::update_by_id(
        &character_id,
        Character {
            id: character_id,
            user_identity: character.user_identity,
            name: character.name.clone(),
            class: character.class.clone(),
            level: character.level,
            position_x: x,
            position_y: y,
            created_at: character.created_at,
            last_updated: timestamp,
        },
    );
    
    // Update session activity
    Session::update_by_identity(
        &identity,
        Session {
            identity,
            character_id,
            connected_at: session.unwrap().connected_at,
            last_activity: timestamp,
        },
    );
    
    Ok(())
} 