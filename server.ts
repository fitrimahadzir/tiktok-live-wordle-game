import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { WebcastPushConnection } from "tiktok-live-connector";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import { isValidWord } from "./validator.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  // Game State
  let tiktokUsername = "";
  let tiktokConnection: WebcastPushConnection | null = null;

  const WORD_CATEGORIES: Record<string, string[]> = {
    haiwan: [
      "KERA", "KUDA", "GAJAH", "SINGA", "LEBAH", "SEMUT", "KATAK", "BUAYA",
      "GAGAK", "LEMBU", "TIKUS", "SIPUT", "BERUK", "ANGSA", "KUCING", "KELDAI",
      "HARIMAU", "BERUANG"
    ],

    makanan: [
      "NASI", "SATE", "ROTI", "SAYUR", "TELUR", "PULUT", "ROJAK",
      "PIZA", "SOSEJ", "NANAS", "BETIK", "LAKSA", "BIHUN",
      "DODOL", "WAJIK", "KICAP", "DAGING", "KACANG", "KEROPOK", "KETUPAT"
    ],

    pekerjaan: [
      "GURU", "DOKTOR", "POLIS", "BOMBA", "HAKIM", "ASKAR",
      "PAKAR", "BADUT", "ATLET", "PEGUAM", "NELAYAN", "TENTERA"
    ],

    buah: [
      "EPAL", "OREN", "MANGGA", "PISANG", "DURIAN",
      "LANGSAT", "MANGGIS", "NANGKA", "CERI", "JAMBU"
    ],

    warna: [
      "MERAH", "BIRU", "HIJAU", "KUNING", "UNGU",
      "HITAM", "PUTIH", "COKLAT", "JINGGA", "KELABU", "EMAS", "PERAK"
    ],

    negeri: [
      "KEDAH", "PERAK", "PERLIS", "PAHANG", "MELAKA",
      "SABAH", "JOHOR"
    ],

    ikan: [
      "IKAN", "TONGKOL", "KELI", "KEMBUNG", "PARI",
      "PATIN", "SELAR", "KERAPU"
    ],

    negara: ["MESIR", "YAMAN", "JEPUN", "CHINA", "INDIA", "KOREA", "BRUNEI", "KANADA", "BRAZIL", "ITALI", "SWEDEN", "NORWAY"],

    planet: [
      "BUMI", "MARIKH", "ZUHRAH", "UTARID", "ZUHAL", "NEPTUN"
    ],

    bunga: [
      "ROSA", "MAWAR", "ORKID", "TERATAI",
      "LILI", "JASMEN", "KEMBOJA", "MELATI", "DAISI"
    ]
  };

  let currentCategory = "";
  let currentWord = "";
  let guesses: any[] = [];
  let leaderboard: Record<string, { wins: number; streak: number; lastWin: number; nickname?: string, profilePictureUrl?: string }> = {};
  let hypeInfo = { current: 0, target: 1000 };
  const TARGET_LEVELS = [1000, 2000, 5000, 10000, 20000];
  let gameStatus = "waiting"; // waiting, playing, won
  let roundNumber = 1;
  let winner: any = null;
  let spamCooldowns: Record<string, number> = {};
  let viewerGuesses: Record<string, { count: number, maxGuesses: number }> = {};
  let skipVotes = new Set<string>();

  function generateNewWord(forcedCategory?: string) {
    if (forcedCategory) {
      currentCategory = forcedCategory;
    } else {
      const categoryKeys = Object.keys(WORD_CATEGORIES);
      const otherCategories = categoryKeys.filter(c => c !== currentCategory);
      currentCategory = otherCategories.length > 0
        ? otherCategories[Math.floor(Math.random() * otherCategories.length)]
        : categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
    }

    const words = (WORD_CATEGORIES[currentCategory] || WORD_CATEGORIES.haiwan).filter(isValidWord);
    currentWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
    guesses = [];
    viewerGuesses = {};
    skipVotes.clear();
    gameStatus = "playing";
    winner = null;
    broadcastState();
    console.log(`New Word: ${currentWord} (${currentCategory})`);
  }

  function broadcastState() {
    io.emit("gameState", {
      currentWord: gameStatus === "won" ? currentWord : null,
      wordLength: currentWord.length || 5,
      guesses,
      leaderboard: Object.entries(leaderboard)
        .map(([userId, data]) => ({ userId, ...data }))
        .sort((a, b) => b.wins - a.wins)
        .slice(0, 10),
      hypeInfo,
      gameStatus,
      roundNumber,
      winner,
      currentCategory,
      tiktokUsername
    });
  }

  function handleGuess(uniqueId: string, nickname: string, profilePictureUrl: string, text: string) {
    if (gameStatus !== "playing") return;

    // Anti-spam
    const now = Date.now();
    if (spamCooldowns[uniqueId] && now - spamCooldowns[uniqueId] < 2000) return;
    spamCooldowns[uniqueId] = now;

    const guess = text.trim().toUpperCase();

    // Skip word mechanism
    if (guess === "NEXT" || guess === "SKIP") {
      skipVotes.add(uniqueId);
      if (skipVotes.size >= 5) {
        generateNewWord();
      }
      return;
    }

    if (guess.length !== currentWord.length) return;

    if (!viewerGuesses[uniqueId]) {
      viewerGuesses[uniqueId] = { count: 0, maxGuesses: 3 };
    }

    if (viewerGuesses[uniqueId].count >= viewerGuesses[uniqueId].maxGuesses) {
      return; // Limit reached
    }

    // Check if duplicate in current round
    if (guesses.some(g => g.word === guess && g.uniqueId === uniqueId)) return;

    viewerGuesses[uniqueId].count++;

    const result = checkWord(guess);
    const newGuess = {
      uniqueId,
      nickname,
      profilePictureUrl,
      word: guess,
      result,
      timestamp: now,
      currentGuess: viewerGuesses[uniqueId].count,
      maxGuesses: viewerGuesses[uniqueId].maxGuesses
    };

    guesses.push(newGuess);
    io.emit("newGuess", newGuess);

    if (guess === currentWord) {
      gameStatus = "won";
      winner = { uniqueId, nickname, profilePictureUrl };

      // Update leaderboard
      if (!leaderboard[uniqueId]) {
        leaderboard[uniqueId] = { wins: 0, streak: 0, lastWin: 0, nickname, profilePictureUrl };
      }
      leaderboard[uniqueId].wins += 1;
      leaderboard[uniqueId].streak += 1;
      leaderboard[uniqueId].lastWin = now;
      leaderboard[uniqueId].nickname = nickname; // Keep it updated
      leaderboard[uniqueId].profilePictureUrl = profilePictureUrl;

      broadcastState();

      // Start new round after 3 seconds
      setTimeout(() => {
        roundNumber++;
        generateNewWord();
      }, 3000);
    } else {
      broadcastState();
    }
  }

  function checkWord(guess: string) {
    const len = currentWord.length;
    const result = new Array(len).fill("grey");
    const targetArr = currentWord.split("");
    const guessArr = guess.split("");

    // First pass: Green
    for (let i = 0; i < len; i++) {
      if (guessArr[i] === targetArr[i]) {
        result[i] = "green";
        targetArr[i] = null as any;
        guessArr[i] = null as any;
      }
    }

    // Second pass: Yellow
    for (let i = 0; i < len; i++) {
      if (guessArr[i] !== null) {
        const index = targetArr.indexOf(guessArr[i]);
        if (index !== -1) {
          result[i] = "yellow";
          targetArr[index] = null as any;
        }
      }
    }

    return result;
  }

  // Initialize the first game round so developer guesses work immediately 
  if (gameStatus === "waiting") {
    generateNewWord();
  }

  // Socket Events
  io.on("connection", (socket) => {
    console.log("Client connected");
    socket.emit("gameState", {
      currentWord: gameStatus === "won" ? currentWord : null,
      wordLength: currentWord.length || 5,
      guesses,
      leaderboard: Object.entries(leaderboard)
        .map(([userId, data]) => ({ userId, ...data }))
        .sort((a, b) => b.wins - a.wins)
        .slice(0, 10),
      hypeInfo,
      gameStatus,
      roundNumber,
      winner,
      currentCategory,
      tiktokUsername
    });

    socket.on("connectTiktok", (username) => {
      if (tiktokConnection) {
        tiktokConnection.disconnect();
      }

      tiktokUsername = username;
      tiktokConnection = new WebcastPushConnection(username);

      tiktokConnection.connect().then(state => {
        console.log(`Connected to TikTok room ${state.roomId}`);
        io.emit("tiktokStatus", { status: "connected", roomId: state.roomId });
        if (gameStatus === "waiting") generateNewWord();
      }).catch(err => {
        console.error("Failed to connect to TikTok", err);
        io.emit("tiktokStatus", { status: "error", message: err.message });
      });

      tiktokConnection.on("chat", data => {
        handleGuess(data.uniqueId, data.nickname, data.profilePictureUrl, data.comment);
      });

      tiktokConnection.on("gift", data => {
        console.log(`${data.uniqueId} sent ${data.giftName}`);

        if (!viewerGuesses[data.uniqueId]) {
          viewerGuesses[data.uniqueId] = { count: 0, maxGuesses: 3 };
        }

        if (data.giftName && data.giftName.toLowerCase().includes("heart")) {
          viewerGuesses[data.uniqueId].maxGuesses = 99999;
          io.emit("notification", { type: "powerup", data });
        } else {
          io.emit("notification", { type: "gift", data });
        }

        if (data.giftName === "Rose") {
          // Reveal one random letter not yet guessed correctly
          const unrevealed = [];
          for (let i = 0; i < currentWord.length; i++) {
            // Simple reveal: send a hint event
          }
          io.emit("powerup", { type: "reveal", gift: "Rose" });
        } else if (data.giftName === "Galaxy") {
          generateNewWord();
          io.emit("powerup", { type: "skip", gift: "Galaxy" });
        }
      });

      tiktokConnection.on("like", data => {
        const count = typeof data.likeCount === 'number' ? data.likeCount : 1;
        hypeInfo.current += count;

        for (const target of TARGET_LEVELS) {
          if (hypeInfo.current < target) {
            hypeInfo.target = target;
            break;
          }
        }
        if (hypeInfo.current >= TARGET_LEVELS[TARGET_LEVELS.length - 1]) {
          hypeInfo.target = TARGET_LEVELS[TARGET_LEVELS.length - 1]; // or you can dynamically increase
        }

        io.emit("hypeUpdate", hypeInfo);
      });

      tiktokConnection.on("follow", data => {
        io.emit("notification", { type: "follow", data });
      });
    });

    socket.on("adminAction", (action) => {
      if (action.type === "skip") generateNewWord();
      if (action.type === "reset") {
        roundNumber = 1;
        leaderboard = {};
        generateNewWord();
      }
      if (action.type === "category") {
        generateNewWord(action.category);
      }
      if (action.type === "simulateChat") {
        const uid = action.uniqueId || "dev_user";
        const nickname = action.nickname || "Developer";
        handleGuess(uid, nickname, `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`, action.comment);
      }
      if (action.type === "simulateCorrect") {
        const uid = "pro_player_" + Math.floor(Math.random() * 100);
        handleGuess(uid, "Pro Player", `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`, currentWord);
      }
      if (action.type === "simulateLike") {
        const count = action.count || 20;
        hypeInfo.current += count;
        for (const target of TARGET_LEVELS) {
          if (hypeInfo.current < target) {
            hypeInfo.target = target;
            break;
          }
        }
        if (hypeInfo.current >= TARGET_LEVELS[TARGET_LEVELS.length - 1]) {
          hypeInfo.target = TARGET_LEVELS[TARGET_LEVELS.length - 1];
        }
        io.emit("hypeUpdate", hypeInfo);
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
            : `https://api.dicebear.com/7.x/avataaars/svg?seed=${dummyUid}`
        };
        broadcastState();
      }
      if (action.type === "simulateGift") {
        const data = {
          uniqueId: "dev_user",
          nickname: "Developer",
          giftName: action.giftName,
          profilePictureUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=dev"
        };

        if (!viewerGuesses[data.uniqueId]) {
          viewerGuesses[data.uniqueId] = { count: 0, maxGuesses: 2 };
        }

        if (data.giftName && data.giftName.toLowerCase().includes("heart")) {
          viewerGuesses[data.uniqueId].maxGuesses = 10;
          io.emit("notification", { type: "powerup", data });
        } else {
          io.emit("notification", { type: "gift", data });
        }
      }
    });
  });

  // Vite middleware for development
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

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
