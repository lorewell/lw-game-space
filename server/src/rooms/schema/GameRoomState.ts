import { Schema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("string") sessionId: string = "";
  @type("string") name: string = "";
  @type("boolean") ready: boolean = false;
}

export class GameRoomState extends Schema {
  @type("string") status: string = "waiting"; // waiting | playing | finished
  @type({ map: Player }) players = new Map<string, Player>();
}
