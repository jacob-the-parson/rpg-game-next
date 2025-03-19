use spacetimedb::{Identity, ReducerContext, Timestamp, Table};

#[derive(Clone)]
#[spacetimedb::table(name = user, public)]
pub struct User {
    #[primary_key]
    pub identity: Identity,
    pub username: String,
    pub created_at: i64,
    pub last_login: i64,
}

#[derive(Clone)]
#[spacetimedb::table(name = character, public)]
pub struct Character {
    #[primary_key]
    #[auto_inc]
    pub id: i64,
    pub user_identity: Identity,
    pub name: String,
    pub x: f32,
    pub y: f32,
    pub created_at: i64,
}

#[derive(Clone)]
#[spacetimedb::table(name = character_appearance, public)]
pub struct CharacterAppearance {
    #[primary_key]
    pub character_id: i64,
    pub hair_style: i32,
    pub hair_color: i32,
    pub skin_color: i32,
}

#[derive(Clone)]
#[spacetimedb::table(name = session, public)]
pub struct Session {
    #[primary_key]
    pub identity: Identity,
    pub connected_at: i64,
}

#[spacetimedb::reducer]
pub fn init(_ctx: &ReducerContext) {
    log::info!("Module initialized!");
}

#[spacetimedb::reducer(client_connected)]
pub fn on_client_connect(ctx: &ReducerContext) {
    log::info!("Client connected: {:?}", ctx.sender);
    let now = ctx.timestamp.to_micros_since_unix_epoch() / 1000;
    
    ctx.db.session().insert(Session {
        identity: ctx.sender,
        connected_at: now,
    });
}

#[spacetimedb::reducer(client_disconnected)]
pub fn on_client_disconnect(ctx: &ReducerContext) {
    log::info!("Client disconnected: {:?}", ctx.sender);
    if let Some(session) = ctx.db.session().iter().find(|s| s.identity == ctx.sender) {
        ctx.db.session().delete(session);
    }
}

#[spacetimedb::reducer]
pub fn register_user(ctx: &ReducerContext, username: String) -> Result<(), String> {
    let now = ctx.timestamp.to_micros_since_unix_epoch() / 1000;
    
    // Check if user already exists
    if let Some(existing_user) = ctx.db.user().iter().find(|u| u.identity == ctx.sender) {
        // Update last login
        let mut updated_user = existing_user.clone();
        updated_user.last_login = now;
        ctx.db.user().insert(updated_user); // Re-insert to update
        return Ok(());
    }

    // Create new user
    ctx.db.user().insert(User {
        identity: ctx.sender,
        username: username.clone(),
        created_at: now,
        last_login: now,
    });
    
    // Create default characters for new users
    create_default_characters(ctx, ctx.sender, now)?;
    
    Ok(())
}

// Helper function to create default characters for new users
fn create_default_characters(ctx: &ReducerContext, user_identity: Identity, now: i64) -> Result<(), String> {
    // Create default warrior
    let warrior = ctx.db.character().insert(Character {
        id: 0, // Auto-incremented
        user_identity,
        name: "Warrior".to_string(),
        x: 100.0,
        y: 100.0,
        created_at: now,
    });
    
    // Create warrior appearance
    ctx.db.character_appearance().insert(CharacterAppearance {
        character_id: warrior.id,
        hair_style: 1,
        hair_color: 2,
        skin_color: 1,
    });
    
    // Create default mage
    let mage = ctx.db.character().insert(Character {
        id: 0, // Auto-incremented
        user_identity,
        name: "Mage".to_string(),
        x: 100.0,
        y: 100.0,
        created_at: now,
    });
    
    // Create mage appearance
    ctx.db.character_appearance().insert(CharacterAppearance {
        character_id: mage.id,
        hair_style: 3,
        hair_color: 4,
        skin_color: 2,
    });
    
    log::info!("Created default characters for user: {:?}", user_identity);
    Ok(())
}

#[spacetimedb::reducer]
pub fn create_character(
    ctx: &ReducerContext,
    name: String,
    hair_style: i32,
    hair_color: i32,
    skin_color: i32,
) -> Result<(), String> {
    let now = ctx.timestamp.to_micros_since_unix_epoch() / 1000;
    
    // Verify user exists
    if !ctx.db.user().iter().any(|u| u.identity == ctx.sender) {
        return Err("User not registered".to_string());
    }
    
    // Create character
    let character = ctx.db.character().insert(Character {
        id: 0, // Auto-incremented
        user_identity: ctx.sender,
        name,
        x: 0.0,
        y: 0.0,
        created_at: now,
    });
    
    // Create character appearance
    ctx.db.character_appearance().insert(CharacterAppearance {
        character_id: character.id,
        hair_style,
        hair_color,
        skin_color,
    });
    
    Ok(())
}

#[spacetimedb::reducer]
pub fn update_position(
    ctx: &ReducerContext,
    character_id: i64,
    x: f32,
    y: f32,
) -> Result<(), String> {
    // Find character
    if let Some(mut character) = ctx.db.character().iter().find(|c| c.id == character_id) {
        // Verify ownership
        if character.user_identity != ctx.sender {
            return Err("Not your character".to_string());
        }
        
        // Update position
        character.x = x;
        character.y = y;
        ctx.db.character().insert(character); // Re-insert to update
        Ok(())
    } else {
        Err("Character not found".to_string())
    }
}
