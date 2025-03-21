// THIS FILE IS AUTOMATICALLY GENERATED BY SPACETIMEDB. EDITS TO THIS FILE
// WILL NOT BE SAVED. MODIFY TABLES IN YOUR MODULE SOURCE CODE INSTEAD.

/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import {
  AlgebraicType,
  AlgebraicValue,
  BinaryReader,
  BinaryWriter,
  CallReducerFlags,
  ConnectionId,
  DbConnectionBuilder,
  DbConnectionImpl,
  DbContext,
  ErrorContextInterface,
  Event,
  EventContextInterface,
  Identity,
  ProductType,
  ProductTypeElement,
  ReducerEventContextInterface,
  SubscriptionBuilderImpl,
  SubscriptionEventContextInterface,
  SumType,
  SumTypeVariant,
  TableCache,
  TimeDuration,
  Timestamp,
  deepEqual,
} from "@clockworklabs/spacetimedb-sdk";

// Import and reexport all reducer arg types
import { CreateCharacter } from "./create_character_reducer.ts";
export { CreateCharacter };
import { Init } from "./init_reducer.ts";
export { Init };
import { OnClientConnect } from "./on_client_connect_reducer.ts";
export { OnClientConnect };
import { OnClientDisconnect } from "./on_client_disconnect_reducer.ts";
export { OnClientDisconnect };
import { RegisterUser } from "./register_user_reducer.ts";
export { RegisterUser };
import { UpdatePosition } from "./update_position_reducer.ts";
export { UpdatePosition };

// Import and reexport all table handle types
import { CharacterTableHandle } from "./character_table.ts";
export { CharacterTableHandle };
import { CharacterAppearanceTableHandle } from "./character_appearance_table.ts";
export { CharacterAppearanceTableHandle };
import { SessionTableHandle } from "./session_table.ts";
export { SessionTableHandle };
import { UserTableHandle } from "./user_table.ts";
export { UserTableHandle };

// Import and reexport all types
import { Character } from "./character_type.ts";
export { Character };
import { CharacterAppearance } from "./character_appearance_type.ts";
export { CharacterAppearance };
import { Session } from "./session_type.ts";
export { Session };
import { User } from "./user_type.ts";
export { User };

const REMOTE_MODULE = {
  tables: {
    character: {
      tableName: "character",
      rowType: Character.getTypeScriptAlgebraicType(),
      primaryKey: "id",
    },
    character_appearance: {
      tableName: "character_appearance",
      rowType: CharacterAppearance.getTypeScriptAlgebraicType(),
      primaryKey: "character_id",
    },
    session: {
      tableName: "session",
      rowType: Session.getTypeScriptAlgebraicType(),
      primaryKey: "identity",
    },
    user: {
      tableName: "user",
      rowType: User.getTypeScriptAlgebraicType(),
      primaryKey: "identity",
    },
  },
  reducers: {
    create_character: {
      reducerName: "create_character",
      argsType: CreateCharacter.getTypeScriptAlgebraicType(),
    },
    init: {
      reducerName: "init",
      argsType: Init.getTypeScriptAlgebraicType(),
    },
    on_client_connect: {
      reducerName: "on_client_connect",
      argsType: OnClientConnect.getTypeScriptAlgebraicType(),
    },
    on_client_disconnect: {
      reducerName: "on_client_disconnect",
      argsType: OnClientDisconnect.getTypeScriptAlgebraicType(),
    },
    register_user: {
      reducerName: "register_user",
      argsType: RegisterUser.getTypeScriptAlgebraicType(),
    },
    update_position: {
      reducerName: "update_position",
      argsType: UpdatePosition.getTypeScriptAlgebraicType(),
    },
  },
  // Constructors which are used by the DbConnectionImpl to
  // extract type information from the generated RemoteModule.
  //
  // NOTE: This is not strictly necessary for `eventContextConstructor` because
  // all we do is build a TypeScript object which we could have done inside the
  // SDK, but if in the future we wanted to create a class this would be
  // necessary because classes have methods, so we'll keep it.
  eventContextConstructor: (imp: DbConnectionImpl, event: Event<Reducer>) => {
    return {
      ...(imp as DbConnection),
      event
    }
  },
  dbViewConstructor: (imp: DbConnectionImpl) => {
    return new RemoteTables(imp);
  },
  reducersConstructor: (imp: DbConnectionImpl, setReducerFlags: SetReducerFlags) => {
    return new RemoteReducers(imp, setReducerFlags);
  },
  setReducerFlagsConstructor: () => {
    return new SetReducerFlags();
  }
}

// A type representing all the possible variants of a reducer.
export type Reducer = never
| { name: "CreateCharacter", args: CreateCharacter }
| { name: "Init", args: Init }
| { name: "OnClientConnect", args: OnClientConnect }
| { name: "OnClientDisconnect", args: OnClientDisconnect }
| { name: "RegisterUser", args: RegisterUser }
| { name: "UpdatePosition", args: UpdatePosition }
;

export class RemoteReducers {
  constructor(private connection: DbConnectionImpl, private setCallReducerFlags: SetReducerFlags) {}

  createCharacter(name: string, hairStyle: number, hairColor: number, skinColor: number) {
    const __args = { name, hairStyle, hairColor, skinColor };
    let __writer = new BinaryWriter(1024);
    CreateCharacter.getTypeScriptAlgebraicType().serialize(__writer, __args);
    let __argsBuffer = __writer.getBuffer();
    this.connection.callReducer("create_character", __argsBuffer, this.setCallReducerFlags.createCharacterFlags);
  }

  onCreateCharacter(callback: (ctx: ReducerEventContext, name: string, hairStyle: number, hairColor: number, skinColor: number) => void) {
    this.connection.onReducer("create_character", callback);
  }

  removeOnCreateCharacter(callback: (ctx: ReducerEventContext, name: string, hairStyle: number, hairColor: number, skinColor: number) => void) {
    this.connection.offReducer("create_character", callback);
  }

  init() {
    this.connection.callReducer("init", new Uint8Array(0), this.setCallReducerFlags.initFlags);
  }

  onInit(callback: (ctx: ReducerEventContext) => void) {
    this.connection.onReducer("init", callback);
  }

  removeOnInit(callback: (ctx: ReducerEventContext) => void) {
    this.connection.offReducer("init", callback);
  }

  onOnClientConnect(callback: (ctx: ReducerEventContext) => void) {
    this.connection.onReducer("on_client_connect", callback);
  }

  removeOnOnClientConnect(callback: (ctx: ReducerEventContext) => void) {
    this.connection.offReducer("on_client_connect", callback);
  }

  onOnClientDisconnect(callback: (ctx: ReducerEventContext) => void) {
    this.connection.onReducer("on_client_disconnect", callback);
  }

  removeOnOnClientDisconnect(callback: (ctx: ReducerEventContext) => void) {
    this.connection.offReducer("on_client_disconnect", callback);
  }

  registerUser(username: string) {
    const __args = { username };
    let __writer = new BinaryWriter(1024);
    RegisterUser.getTypeScriptAlgebraicType().serialize(__writer, __args);
    let __argsBuffer = __writer.getBuffer();
    this.connection.callReducer("register_user", __argsBuffer, this.setCallReducerFlags.registerUserFlags);
  }

  onRegisterUser(callback: (ctx: ReducerEventContext, username: string) => void) {
    this.connection.onReducer("register_user", callback);
  }

  removeOnRegisterUser(callback: (ctx: ReducerEventContext, username: string) => void) {
    this.connection.offReducer("register_user", callback);
  }

  updatePosition(characterId: bigint, x: number, y: number) {
    const __args = { characterId, x, y };
    let __writer = new BinaryWriter(1024);
    UpdatePosition.getTypeScriptAlgebraicType().serialize(__writer, __args);
    let __argsBuffer = __writer.getBuffer();
    this.connection.callReducer("update_position", __argsBuffer, this.setCallReducerFlags.updatePositionFlags);
  }

  onUpdatePosition(callback: (ctx: ReducerEventContext, characterId: bigint, x: number, y: number) => void) {
    this.connection.onReducer("update_position", callback);
  }

  removeOnUpdatePosition(callback: (ctx: ReducerEventContext, characterId: bigint, x: number, y: number) => void) {
    this.connection.offReducer("update_position", callback);
  }

}

export class SetReducerFlags {
  createCharacterFlags: CallReducerFlags = 'FullUpdate';
  createCharacter(flags: CallReducerFlags) {
    this.createCharacterFlags = flags;
  }

  initFlags: CallReducerFlags = 'FullUpdate';
  init(flags: CallReducerFlags) {
    this.initFlags = flags;
  }

  registerUserFlags: CallReducerFlags = 'FullUpdate';
  registerUser(flags: CallReducerFlags) {
    this.registerUserFlags = flags;
  }

  updatePositionFlags: CallReducerFlags = 'FullUpdate';
  updatePosition(flags: CallReducerFlags) {
    this.updatePositionFlags = flags;
  }

}

export class RemoteTables {
  constructor(private connection: DbConnectionImpl) {}

  get character(): CharacterTableHandle {
    return new CharacterTableHandle(this.connection.clientCache.getOrCreateTable<Character>(REMOTE_MODULE.tables.character));
  }

  get characterAppearance(): CharacterAppearanceTableHandle {
    return new CharacterAppearanceTableHandle(this.connection.clientCache.getOrCreateTable<CharacterAppearance>(REMOTE_MODULE.tables.character_appearance));
  }

  get session(): SessionTableHandle {
    return new SessionTableHandle(this.connection.clientCache.getOrCreateTable<Session>(REMOTE_MODULE.tables.session));
  }

  get user(): UserTableHandle {
    return new UserTableHandle(this.connection.clientCache.getOrCreateTable<User>(REMOTE_MODULE.tables.user));
  }
}

export class SubscriptionBuilder extends SubscriptionBuilderImpl<RemoteTables, RemoteReducers, SetReducerFlags> { }

export class DbConnection extends DbConnectionImpl<RemoteTables, RemoteReducers, SetReducerFlags> {
  static builder = (): DbConnectionBuilder<DbConnection, ErrorContext, SubscriptionEventContext> => {
    return new DbConnectionBuilder<DbConnection, ErrorContext, SubscriptionEventContext>(REMOTE_MODULE, (imp: DbConnectionImpl) => imp as DbConnection);
  }
  subscriptionBuilder = (): SubscriptionBuilder => {
    return new SubscriptionBuilder(this);
  }
}

export type EventContext = EventContextInterface<RemoteTables, RemoteReducers, SetReducerFlags, Reducer>;
export type ReducerEventContext = ReducerEventContextInterface<RemoteTables, RemoteReducers, SetReducerFlags, Reducer>;
export type SubscriptionEventContext = SubscriptionEventContextInterface<RemoteTables, RemoteReducers, SetReducerFlags>;
export type ErrorContext = ErrorContextInterface<RemoteTables, RemoteReducers, SetReducerFlags>;
