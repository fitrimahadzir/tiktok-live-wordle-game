import { useState, useEffect } from "react";
import { Bot, Bug, ThumbsUp, Trophy, Send, X, Heart } from "lucide-react";
import { clsx } from "clsx";

const DUMMY_USERS = [
  { id: "user_a", name: "Ali" },
  { id: "user_b", name: "Abu" },
  { id: "user_c", name: "Ahmad" },
  { id: "user_d", name: "Aminah" },
  { id: "user_e", name: "Aisyah" },
  { id: "fitrimahadzir", name: "fitrimahadzir" },
];

const RANDOM_COORDS = [
  "A1", "B2", "C3", "D4", "E5", "F6", "G7", "H8", "I9", "J10", "K11", "L12",
  "M1", "N2", "O3", "P4", "Q5", "R6", "A7", "B8", "C9", "D10", "E11", "F12",
];

export default function DevTools({ adminAction }: { adminAction: any }) {
  const [isAutoPilot, setIsAutoPilot] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [manualGuess, setManualGuess] = useState("");

  const handleManualSend = () => {
    if (manualGuess.trim()) {
      adminAction({ type: "simulateChat", comment: manualGuess.trim() });
      setManualGuess("");
    }
  };

  useEffect(() => {
    let interval: any;
    if (isAutoPilot) {
      interval = setInterval(() => {
        if (Math.random() < 0.08) {
          adminAction({ type: "simulateCorrect" });
        } else {
          const randomUser = DUMMY_USERS[Math.floor(Math.random() * DUMMY_USERS.length)];
          const wrongCoord = RANDOM_COORDS[Math.floor(Math.random() * RANDOM_COORDS.length)];
          adminAction({
            type: "simulateChat",
            comment: wrongCoord,
            uniqueId: randomUser.id,
            nickname: randomUser.name,
          });
        }
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isAutoPilot, adminAction]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 bg-neon-purple border border-neon-purple/50 p-2 rounded-full cursor-pointer hover:bg-neon-purple/80 z-50 text-white shadow-lg"
      >
        <Bug className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed top-4 right-4 w-64 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl z-50 overflow-hidden shadow-2xl flex flex-col">
      <div className="bg-slate-100 p-3 flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Bug className="w-4 h-4 text-neon-purple" />
          <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase">
            Panel Pembangun
          </h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-slate-500 hover:text-slate-800 pb-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3 space-y-2 flex-1 overflow-y-auto max-h-[80vh]">
        <button
          onClick={() => adminAction({ type: "simulateLike", count: 100 })}
          className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all flex items-center gap-2"
        >
          <ThumbsUp className="w-3.5 h-3.5 text-neon-cyan" />
          +100 Like
        </button>
        <div className="grid grid-cols-3 gap-1.5">
          {[1000, 2000, 5000, 10000, 20000, 30000].map((count) => (
            <button
              key={count}
              onClick={() => adminAction({ type: "simulateLike", count })}
              className="bg-slate-50 border border-slate-200 p-1.5 rounded-lg text-[10px] font-bold text-slate-700 hover:bg-slate-100 transition-all flex items-center justify-center gap-1"
            >
              <ThumbsUp className="w-3 h-3 text-neon-cyan shrink-0" />
              +{count.toLocaleString()}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            const user = DUMMY_USERS[Math.floor(Math.random() * DUMMY_USERS.length)];
            adminAction({ type: "simulateGift", giftName: "Heart", uniqueId: user.id, nickname: user.name });
          }}
          className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all flex items-center gap-2"
        >
          <Heart className="w-3.5 h-3.5 text-red-500" />
          Hadiah Heart
        </button>

        <div className="pt-2 border-t border-slate-200 mt-2 space-y-2">
          <p className="text-[10px] text-slate-500 uppercase font-bold px-1">
            Input Koordinat
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualGuess}
              onChange={(e) => setManualGuess(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleManualSend();
              }}
              placeholder="CONTOH: A1"
              className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-neon-purple transition-all uppercase font-mono tracking-widest min-w-0"
            />
            <button
              onClick={handleManualSend}
              disabled={!manualGuess.trim()}
              className="bg-neon-purple/10 border border-neon-purple/30 hover:bg-neon-purple hover:text-white p-2 rounded-lg text-neon-purple transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          onClick={() => adminAction({ type: "simulateCorrect" })}
          className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-xs font-bold text-neon-green hover:bg-green-50 transition-all flex items-center gap-2"
        >
          <Trophy className="w-3.5 h-3.5 text-neon-green" />
          Jawapan Betul
        </button>

        <button
          onClick={() => adminAction({ type: "simulateTopPlayer" })}
          className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all flex items-center gap-2"
        >
          <Trophy className="w-3.5 h-3.5 text-neon-yellow" />
          Pemain Teratas
        </button>

        <button
          onClick={() => setIsAutoPilot(!isAutoPilot)}
          className={clsx(
            "w-full border p-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 mt-2",
            isAutoPilot
              ? "bg-neon-purple text-white border-neon-purple shadow-[0_0_15px_rgba(139,92,246,0.5)] animate-pulse"
              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
          )}
        >
          <Bot className="w-3.5 h-3.5" />
          {isAutoPilot ? "Auto Dummy (HIDUP)" : "Auto Dummy (MATI)"}
        </button>
      </div>
    </div>
  );
}
