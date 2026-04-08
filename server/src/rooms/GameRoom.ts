import { Room, Client } from "colyseus";
import { GameRoomState, Player } from "./schema/GameRoomState";

export class GameRoom extends Room<GameRoomState> {
  maxClients = 4;

  onCreate(options: any) {
    this.setState(new GameRoomState());

    this.onMessage("ready", (client) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        player.ready = !player.ready;
      }
    });

    this.onMessage("start", (client) => {
      const allReady = [...this.state.players.values()].every((p) => p.ready);
      if (allReady && this.state.players.size >= 2) {
        this.state.status = "playing";
        this.broadcast("game_started", {});
      }
    });

    console.log(`[GameRoom] 房间创建: ${this.roomId}`);
  }

  onJoin(client: Client, options: any) {
    const player = new Player();
    player.sessionId = client.sessionId;
    player.name = options?.name || `玩家_${client.sessionId.slice(0, 4)}`;
    this.state.players.set(client.sessionId, player);
    console.log(`[GameRoom] 玩家加入: ${player.name} (${client.sessionId})`);
  }

  onLeave(client: Client, consented: boolean) {
    this.state.players.delete(client.sessionId);
    console.log(`[GameRoom] 玩家离开: ${client.sessionId}`);
  }

  onDispose() {
    console.log(`[GameRoom] 房间销毁: ${this.roomId}`);
  }
}
