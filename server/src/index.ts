import { Server } from "colyseus";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { monitor } from "@colyseus/monitor";
import express from "express";
import cors from "cors";
import http from "http";
import { GameRoom } from "./rooms/GameRoom";
import { HallRoom } from "./rooms/HallRoom";

const PORT = Number(process.env.PORT) || 3000;

const app = express();

app.use(cors());
app.use(express.json());

// Colyseus 监控面板（开发用）
app.use("/colyseus", monitor());

const server = http.createServer(app);

const gameServer = new Server({
  transport: new WebSocketTransport({ server }),
});

gameServer.define("game_room", GameRoom);
gameServer.define("hall_room", HallRoom);

gameServer.listen(PORT).then(() => {
  console.log(`✅ 游戏服务器已启动，端口: ${PORT}`);
  console.log(`📊 监控面板: http://localhost:${PORT}/colyseus`);
});
