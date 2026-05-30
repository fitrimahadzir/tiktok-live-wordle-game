import { Server } from "socket.io";
import { WebcastPushConnection } from "tiktok-live-connector";
import { GameEngine } from "../game/engine.js";

export class TikTokManager {
  private io: Server;
  private gameEngine: GameEngine;
  private roomId: string;
  private connection: WebcastPushConnection | null = null;

  constructor(io: Server, gameEngine: GameEngine, roomId: string) {
    this.io = io;
    this.gameEngine = gameEngine;
    this.roomId = roomId;
  }

  async connect(username: string) {
    this.disconnect();
    this.gameEngine.setTiktokUsername(username);
    this.gameEngine.setLastLikeCount(0);
    this.io.to(this.roomId).emit("tiktokStatus", { status: "connecting" });

    this.connection = new WebcastPushConnection(username);
    await this.connection.connect();

    this.io.to(this.roomId).emit("tiktokStatus", {
      status: "connected",
      roomId: (this.connection as any).roomId,
    });

    this.connection.on("chat", (data) => {
      this.gameEngine.handleGuess(
        data.uniqueId,
        data.nickname,
        data.profilePictureUrl,
        data.comment
      );
    });

    this.connection.on("gift", (data) => {
      const giftName = data.giftName || "";
      this.gameEngine.handleGift(data.uniqueId, giftName);

      if (giftName.toLowerCase().includes("heart")) {
        this.io.to(this.roomId).emit("notification", { type: "powerup", data });
      } else {
        this.io.to(this.roomId).emit("notification", { type: "gift", data });
      }
    });

    this.connection.on("like", (data) => {
      const totalNow = typeof data.totalLikeCount === "number"
        ? data.totalLikeCount
        : typeof data.likeCount === "number"
        ? data.likeCount
        : 0;
      const last = this.gameEngine.getLastLikeCount();
      const delta = totalNow > last ? totalNow - last : 0;
      this.gameEngine.setLastLikeCount(totalNow);

      if (delta > 0) {
        this.gameEngine.handleLike(delta);
      }

      this.io.to(this.roomId).emit("notification", { type: "like", data });
    });

    this.connection.on("follow", (data) => {
      this.io.to(this.roomId).emit("notification", { type: "follow", data });
    });
  }

  disconnect() {
    if (this.connection) {
      this.connection.disconnect();
      this.connection = null;
    }
  }
}
