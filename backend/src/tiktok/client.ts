import { Server } from "socket.io";
import { WebcastPushConnection } from "tiktok-live-connector";
import { GameEngine } from "../game/engine.js";

export class TikTokManager {
  private io: Server;
  private gameEngine: GameEngine;
  private connection: WebcastPushConnection | null = null;

  constructor(io: Server, gameEngine: GameEngine) {
    this.io = io;
    this.gameEngine = gameEngine;
  }

  async connect(username: string) {
    this.disconnect();
    this.gameEngine.setTiktokUsername(username);
    this.gameEngine.setLastLikeCount(0);
    this.io.emit("tiktokStatus", { status: "connecting" });

    this.connection = new WebcastPushConnection(username);
    await this.connection.connect();

    this.io.emit("tiktokStatus", {
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
        this.io.emit("notification", { type: "powerup", data });
      } else {
        this.io.emit("notification", { type: "gift", data });
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

      this.io.emit("notification", { type: "like", data });
    });

    this.connection.on("follow", (data) => {
      this.io.emit("notification", { type: "follow", data });
    });
  }

  disconnect() {
    if (this.connection) {
      this.connection.disconnect();
      this.connection = null;
    }
  }
}
