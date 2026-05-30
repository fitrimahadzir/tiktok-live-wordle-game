import { Server } from "socket.io";
import { GameEngine } from "./game/engine.js";
import { TikTokManager } from "./tiktok/client.js";

interface SessionState {
  gameEngine: GameEngine;
  tiktokManager: TikTokManager;
}

export class SessionManager {
  private sessions: Map<string, SessionState> = new Map();
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  createSession(sessionId: string): SessionState {
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

    const data: SessionState = { gameEngine, tiktokManager };
    this.sessions.set(sessionId, data);

    gameEngine.startNewGame();

    return data;
  }

  getOrCreateSession(sessionId: string): SessionState {
    const existing = this.sessions.get(sessionId);
    if (existing) return existing;
    return this.createSession(sessionId);
  }

  getSession(sessionId: string): SessionState | undefined {
    return this.sessions.get(sessionId);
  }

  deleteSession(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.tiktokManager.disconnect();
      this.sessions.delete(sessionId);
    }
  }
}
