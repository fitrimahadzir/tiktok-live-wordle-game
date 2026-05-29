import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { WebcastPushConnection } from "tiktok-live-connector";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WAIT_TIME = 5;

const GRID_MODES = {
  LOW: { cols: 12, rows: 10 },
  MEDIUM: { cols: 15, rows: 11 },
  HIGH: { cols: 18, rows: 12 },
};
type GridMode = keyof typeof GRID_MODES;

const ALL_LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function getColLabels(mode: GridMode): string {
  return ALL_LABELS.slice(0, GRID_MODES[mode].cols);
}

const DIFFICULTY_PAIRS: Record<string, { normal: string; odd: string }[]> = {
  easy: [
    { normal: "A", odd: "B" },
    { normal: "3", odd: "8" },
  ],
  medium: [
    { normal: "O", odd: "Q" },
    { normal: "P", odd: "R" },
    { normal: "5", odd: "6" },
  ],
  hard: [
    { normal: "M", odd: "N" },
    { normal: "C", odd: "G" },
    { normal: "8", odd: "9" },
  ],
  impossible: [
    { normal: "I", odd: "l" },
    { normal: "O", odd: "0" },
    { normal: "B", odd: "8" },
    { normal: "S", odd: "5" },
  ],
};

type Difficulty = keyof typeof DIFFICULTY_PAIRS;

const DIFFICULTY_POINTS: Record<Difficulty, number> = {
  easy: 1,
  medium: 2,
  hard: 5,
  impossible: 15,
};

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const PORT = Number(process.env.PORT) || 8080;

  let tiktokUsername = "";
  let tiktokConnection: WebcastPushConnection | null = null;

  let grid: string[][] = [];
  let gridMode: GridMode = "LOW";
  let oddCol = 0;
  let oddRow = 0;
  let normalChar = "X";
  let oddChar = "Y";
  let difficulty: Difficulty = "easy";
  let roundNumber = 0;
  let gameStatus: "waiting" | "playing" | "won" = "waiting";
  let winner: any = null;
  let leaderboard: Record<string, { wins: number; streak: number; lastWin: number; nickname?: string; profilePictureUrl?: string }> = {};
  let spamCooldowns: Record<string, number> = {};
  let viewerAnswers: Record<string, boolean> = {};

  function generateGrid() {
    const { cols, rows } = GRID_MODES[gridMode];
    const colLabels = getColLabels(gridMode);
    const keys = Object.keys(DIFFICULTY_PAIRS) as Difficulty[];
    difficulty = keys[Math.floor(Math.random() * keys.length)];
    const pairs = DIFFICULTY_PAIRS[difficulty];
    const pair = pairs[Math.floor(Math.random() * pairs.length)];
    normalChar = pair.normal;
    oddChar = pair.odd;
    oddCol = Math.floor(Math.random() * cols);
    oddRow = Math.floor(Math.random() * rows);

    grid = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) =>
        r === oddRow && c === oddCol ? oddChar : normalChar
      )
    );

    gameStatus = "playing";
    winner = null;
    viewerAnswers = {};

    broadcastState();
    console.log(`Round #${roundNumber}: [${gridMode}] ${difficulty} normal='${normalChar}' odd='${oddChar}' at ${colLabels[oddCol]}${oddRow + 1}`);
  }

  function parseCoordinate(text: string): { col: number; row: number } | null {
    const { cols, rows } = GRID_MODES[gridMode];
    const colLabels = getColLabels(gridMode);
    const cleaned = text.trim().toUpperCase().replace(/-/g, "");
    const m1 = cleaned.match(/^([A-Z])(\d{1,2})$/);
    if (m1) {
      const col = colLabels.indexOf(m1[1]);
      const row = parseInt(m1[2]) - 1;
      if (col >= 0 && row >= 0 && row < rows) return { col, row };
    }
    const m2 = cleaned.match(/^(\d{1,2})([A-Z])$/);
    if (m2) {
      const row = parseInt(m2[1]) - 1;
      const col = colLabels.indexOf(m2[2]);
      if (col >= 0 && row >= 0 && row < rows) return { col, row };
    }
    return null;
  }

  function handleGuess(uniqueId: string, nickname: string, profilePictureUrl: string, text: string) {
    if (gameStatus !== "playing") return;

    const now = Date.now();
    if (spamCooldowns[uniqueId] && now - spamCooldowns[uniqueId] < 2000) return;
    spamCooldowns[uniqueId] = now;

    const coord = parseCoordinate(text);
    if (!coord) return;
    if (viewerAnswers[uniqueId]) return;
    viewerAnswers[uniqueId] = true;

    if (coord.col === oddCol && coord.row === oddRow) {
      gameStatus = "won";
      winner = { uniqueId, nickname, profilePictureUrl };

      if (!leaderboard[uniqueId]) {
        leaderboard[uniqueId] = { wins: 0, streak: 0, lastWin: 0, nickname, profilePictureUrl };
      }
      leaderboard[uniqueId].wins += DIFFICULTY_POINTS[difficulty];
      leaderboard[uniqueId].streak += 1;
      leaderboard[uniqueId].lastWin = now;
      leaderboard[uniqueId].nickname = nickname;
      leaderboard[uniqueId].profilePictureUrl = profilePictureUrl;

      broadcastState();

      setTimeout(() => {
        roundNumber++;
        generateGrid();
        broadcastState();
      }, WAIT_TIME * 1000);
    }
  }

  function broadcastState() {
    io.emit("gameState", {
      grid,
      gridMode,
      gridConfig: GRID_MODES[gridMode],
      oddPosition: { col: oddCol, row: oddRow },
      difficulty,
      normalChar,
      oddChar,
      roundNumber,
      gameStatus,
      winner,
      leaderboard: Object.entries(leaderboard)
        .map(([userId, data]) => ({ userId, ...data }))
        .sort((a, b) => b.wins - a.wins)
        .slice(0, 7),
      tiktokUsername,
    });
  }

  io.on("connection", (socket) => {
    console.log("Client connected");
    socket.emit("gameState", {
      grid,
      gridMode,
      gridConfig: GRID_MODES[gridMode],
      oddPosition: { col: oddCol, row: oddRow },
      difficulty,
      normalChar,
      oddChar,
      roundNumber,
      gameStatus,
      winner,
      leaderboard: Object.entries(leaderboard)
        .map(([userId, data]) => ({ userId, ...data }))
        .sort((a, b) => b.wins - a.wins)
        .slice(0, 7),
      tiktokUsername,
    });

    socket.on("connectTiktok", (username) => {
      if (tiktokConnection) tiktokConnection.disconnect();
      tiktokUsername = username;
      tiktokConnection = new WebcastPushConnection(username);
      tiktokConnection
        .connect()
        .then((state) => {
          console.log(`Connected to TikTok room ${state.roomId}`);
          io.emit("tiktokStatus", { status: "connected", roomId: state.roomId });
        })
        .catch((err) => {
          console.error("Failed to connect to TikTok", err);
          io.emit("tiktokStatus", { status: "error", message: err.message });
        });

      tiktokConnection.on("chat", (data) => {
        handleGuess(data.uniqueId, data.nickname, data.profilePictureUrl, data.comment);
      });

      tiktokConnection.on("gift", (data) => {
        io.emit("notification", { type: "gift", data });
      });

      tiktokConnection.on("like", (data) => {
        io.emit("notification", { type: "like", data });
      });

      tiktokConnection.on("follow", (data) => {
        io.emit("notification", { type: "follow", data });
      });
    });

    socket.on("adminAction", (action) => {
      if (action.type === "skip") {
        roundNumber++;
        generateGrid();
      }
      if (action.type === "reset") {
        roundNumber = 1;
        leaderboard = {};
        generateGrid();
      }
      if (action.type === "simulateChat") {
        const uid = action.uniqueId || "dev_user";
        const nickname = action.nickname || "Developer";
        handleGuess(uid, nickname, `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`, action.comment);
      }
      if (action.type === "simulateCorrect") {
        const label = `${getColLabels(gridMode)[oddCol]}${oddRow + 1}`;
        const uid = "pro_player_" + Math.floor(Math.random() * 100);
        handleGuess(uid, "Pro Player", `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`, label);
      }
      if (action.type === "simulateGift") {
        io.emit("notification", {
          type: "gift",
          data: {
            uniqueId: action.uniqueId || "dev_user",
            nickname: action.nickname || "Developer",
            giftName: action.giftName || "Heart",
            profilePictureUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${action.uniqueId || "dev_user"}`,
          },
        });
      }
      if (action.type === "setGridMode" && GRID_MODES[action.mode as GridMode]) {
        gridMode = action.mode as GridMode;
        roundNumber++;
        generateGrid();
      }
      if (action.type === "simulateTopPlayer") {
        const isFitri = Math.random() > 0.5;
        const dummyNum = Math.floor(Math.random() * 1000);
        const dummyUid = isFitri ? "fitrimahadzir" : "dummy_pro_" + dummyNum;
        leaderboard[dummyUid] = {
          wins: Math.floor(Math.random() * 50) + 10,
          streak: Math.floor(Math.random() * 5) + 1,
          lastWin: Date.now(),
          nickname: isFitri ? "fitrimahadzir" : `DummyPro${dummyNum}`,
          profilePictureUrl: isFitri
            ? "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
            : `https://api.dicebear.com/7.x/avataaars/svg?seed=${dummyUid}`,
        };
        broadcastState();
      }
    });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  roundNumber = 1;
  generateGrid();

  setInterval(() => {
    broadcastState();
  }, 2000);

  httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
