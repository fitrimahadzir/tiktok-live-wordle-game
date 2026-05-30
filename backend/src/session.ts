import { Server } from "socket.io";
import { GameEngine } from "./game/engine.js";
import { TikTokManager } from "./tiktok/client.js";

interface SessionData {
  gameEngine: GameEngine;
  tiktokManager: TikTokManager;
}

export class SessionManager {
  private sessions: Map<string, SessionData> = new Map();
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  createSession(sessionId: string): SessionData {
    const gameEngine = new GameEngine(
      (state) => {
        this.io.to(sessionId).emit("gameState", state);
      },
      (hype) => {
        this.io.to(sessionId).emit("hypeUpdate", hype);
      },
      (guess) => {
        this.io.to(sessionId).emit("newGuess", guess);
      }
    );

    const tiktokManager = new TikTokManager(this.io, gameEngine, sessionId);

    const data: SessionData = { gameEngine, tiktokManager };
    this.sessions.set(sessionId, data);

    gameEngine.startNewGame();

    return data;
  }

  getOrCreateSession(sessionId: string): SessionData {
    const existing = this.sessions.get(sessionId);
    if (existing) return existing;
    return this.createSession(sessionId);
  }

  getSession(sessionId: string): SessionData | undefined {
    return this.sessions.get(sessionId);
  }

  removeSession(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.tiktokManager.disconnect();
      this.sessions.delete(sessionId);
    }
  }
}
