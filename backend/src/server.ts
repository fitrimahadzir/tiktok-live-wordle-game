import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import { SessionManager } from "./session.js";
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

const sessionManager = new SessionManager(io);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
  });
});

app.get("/api/game-state", (_req, res) => {
  res.json({ message: "Use WebSocket connection with sessionId" });
});

io.on("connection", (socket) => {
  const sessionId = socket.handshake.auth.sessionId as string;
  if (!sessionId) {
    socket.disconnect();
    return;
  }

  const { gameEngine, tiktokManager } = sessionManager.getOrCreateSession(sessionId);
  socket.join(sessionId);

  socket.emit("gameState", gameEngine.getState());

  socket.on("connectTiktok", async (username: string) => {
    try {
      await tiktokManager.connect(username);
    } catch (err: any) {
      io.to(sessionId).emit("tiktokStatus", {
        status: "error",
        message: err.message || "Failed to connect to TikTok",
      });
    }
  });

  socket.on("adminAction", (action: any) => {
    handleAdminAction(io, gameEngine, action, sessionId);
  });

  socket.on("disconnect", () => {
    socket.leave(sessionId);
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

httpServer.listen(PORT, () => {
  console.log(`Tekata Backend running on http://localhost:${PORT}`);
  console.log(`CORS origin: ${CORS_ORIGIN}`);
});
