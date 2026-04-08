import { Schema, MapSchema, ArraySchema, type } from "@colyseus/schema";

export class HallUser extends Schema {
  @type("string") sessionId: string = "";
  @type("string") name: string = "";
  @type("string") avatar: string = "";
  @type("number") level: number = 1;
}

export class ChatMessage extends Schema {
  @type("string") sessionId: string = "";
  @type("string") userName: string = "";
  @type("string") content: string = "";
  @type("number") timestamp: number = 0;
}

export class HallRoomState extends Schema {
  @type({ map: HallUser }) users = new MapSchema<HallUser>();
  @type([ChatMessage]) messages = new ArraySchema<ChatMessage>();
}
