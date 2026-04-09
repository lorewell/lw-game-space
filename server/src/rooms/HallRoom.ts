import { Room, Client } from "colyseus";
import { HallRoomState, HallUser, ChatMessage } from "./schema/HallRoomState";

const MAX_MESSAGES = 50;

export class HallRoom extends Room<HallRoomState> {
  // 大厅只保留一个房间实例
  maxClients = 100;

  onCreate(options: any) {
    this.setState(new HallRoomState());
    this.autoDispose = false;

    this.onMessage("chat", (client, payload: { content: string }) => {
      const user = this.state.users.get(client.sessionId);
      if (!user || !payload.content?.trim()) return;

      const msg = new ChatMessage();
      msg.sessionId = client.sessionId;
      msg.userName = user.name;
      msg.content = payload.content.trim().slice(0, 200);
      msg.timestamp = Date.now();

      this.state.messages.push(msg);

      // 超出上限时移除最旧的消息
      if (this.state.messages.length > MAX_MESSAGES) {
        this.state.messages.splice(0, 1);
      }
    });

    console.log("[HallRoom] 大厅创建完成");
  }

  onJoin(client: Client, options: { id?: string; name?: string; avatar?: string; level?: number }) {
    const user = new HallUser();
    user.sessionId = client.sessionId;
    user.name = options?.name || `游客_${client.sessionId.slice(0, 4)}`;
    user.avatar = options?.avatar || "";
    user.level = options?.level ?? 1;
    this.state.users.set(client.sessionId, user);

    console.log(`[HallRoom] 用户ID: ${options?.id || '未知'} | 昵称: ${user.name} 进入大厅`);
  }

  onLeave(client: Client, consented: boolean) {
    const user = this.state.users.get(client.sessionId);
    console.log(`[HallRoom] ${user?.name ?? client.sessionId} 离开大厅`);
    this.state.users.delete(client.sessionId);
  }

  onDispose() {
    console.log("[HallRoom] 大厅销毁");
  }
}
