import "dotenv/config";
import { Server } from "colyseus";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { monitor } from "@colyseus/monitor";
import express from "express";
import cors from "cors";
import http from "http";
import { GameRoom } from "./rooms/GameRoom";
import { HallRoom } from "./rooms/HallRoom";
import { connectMongo } from "./db/mongo";
import { connectRedis } from "./db/redis";
import userRoutes from "./routes/user";
import roomRoutes from "./routes/room";
import chatRoutes from "./routes/chat";

const PORT = Number(process.env.PORT) || 3000;

async function bootstrap() {
  // 初始化数据库连接
  await connectMongo();
  await connectRedis();

  const app = express();

  app.use(cors());
  app.use(express.json());

  // REST API 路由
  app.use("/api/user", userRoutes);
  app.use("/api/room", roomRoutes);
  app.use("/api/chat", chatRoutes);

  // Colyseus 监控面板（开发用）
  app.use("/colyseus", monitor());

  const server = http.createServer(app);

  const gameServer = new Server({
    transport: new WebSocketTransport({ server }),
  });

  gameServer.define("game_room", GameRoom);
  gameServer.define("hall_room", HallRoom);

  await gameServer.listen(PORT);
  console.log(`✅ 游戏服务器已启动，端口: ${PORT}`);
  console.log(`📊 监控面板: http://localhost:${PORT}/colyseus`);
}

bootstrap();
