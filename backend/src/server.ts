import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import { GameEngine } from "./game/engine.js";
import { TikTokManager } from "./tiktok/client.js";
import { handleAdminAction } from "./socket/admin.js";

const PORT = Number(process.env.PORT) || 8080;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
const SERVE_STATIC = process.env.SERVE_STATIC === "true";

const app = express();
const httpServer = createServer(app);

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

const io = new Server(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
  },
});

const gameEngine = new GameEngine((state) => {
  io.emit("gameState", state);
});

const tiktokManager = new TikTokManager(io, gameEngine);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    round: gameEngine.getState().roundNumber,
    players: gameEngine.getState().leaderboard.length,
  });
});

app.get("/api/game-state", (_req, res) => {
  res.json(gameEngine.getState());
});

io.on("connection", (socket) => {
  socket.emit("gameState", gameEngine.getState());

  socket.on("connectTiktok", async (username: string) => {
    try {
      await tiktokManager.connect(username);
    } catch (err: any) {
      io.emit("tiktokStatus", {
        status: "error",
        message: err.message || "Failed to connect to TikTok",
      });
    }
  });

  socket.on("adminAction", (action: any) => {
    handleAdminAction(io, gameEngine, action);
  });
});

if (SERVE_STATIC) {
  const distPath = path.join(process.cwd(), "frontend/dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/socket.io")) return;
    res.sendFile(path.join(distPath, "index.html"));
  });
}

setInterval(() => {
  gameEngine.getState();
}, 2000);

gameEngine.startNewGame();

httpServer.listen(PORT, () => {
  console.log(`Odd Hunt Backend running on http://localhost:${PORT}`);
  console.log(`CORS origin: ${CORS_ORIGIN}`);
});
