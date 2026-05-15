import { useState, useEffect } from "react";
import { Bot, Bug, Heart, ThumbsUp, MessageSquare, Trophy, Send } from "lucide-react";
import { clsx } from "clsx";

const generateDummyWord = (length: number) => {
  const consonants = "BCDFGHJKLMNPQRSTVWXYZ";
  const vowels = "AEIOU";
  let word = "";
  for (let i = 0; i < length; i++) {
    if (i % 2 === 0) word += consonants[Math.floor(Math.random() * consonants.length)];
    else word += vowels[Math.floor(Math.random() * vowels.length)];
  }
  return word;
};
const DUMMY_USERS = [
  { id: "user_a", name: "Ali" },
  { id: "user_b", name: "Abu" },
  { id: "user_c", name: "Ahmad" },
  { id: "user_d", name: "Aminah" },
  { id: "user_e", name: "Aisyah" },
  { id: "fitrimahadzir", name: "fitrimahadzir" }
];

export default function DevTools({ adminAction, wordLength = 5 }: { adminAction: any, wordLength?: number }) {
  const [isAutoPilot, setIsAutoPilot] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [manualGuess, setManualGuess] = useState("");

  const handleManualSend = () => {
    if (manualGuess.length === wordLength) {
      adminAction({ type: "simulateChat", comment: manualGuess });
      setManualGuess("");
    }
  };

  useEffect(() => {
    let interval: any;
    if (import.meta.env.VITE_DEV_MODE === "true" && isAutoPilot) {
      interval = setInterval(() => {
        if (Math.random() < 0.1) {
          adminAction({ type: "simulateCorrect" });
        } else {
          const randomWord = generateDummyWord(wordLength);
          const randomUser = DUMMY_USERS[Math.floor(Math.random() * DUMMY_USERS.length)];
          adminAction({ 
            type: "simulateChat", 
            comment: randomWord,
            uniqueId: randomUser.id,
            nickname: randomUser.name 
          });
        }
      }, 2000); // Send a dummy guess every 2 seconds
    }
    return () => clearInterval(interval);
  }, [isAutoPilot, adminAction]);

  if (import.meta.env.VITE_DEV_MODE !== "true") return null;

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 bg-pink-600 border border-pink-500/50 p-2 rounded-full cursor-pointer hover:bg-pink-500 z-50 text-white shadow-lg"
      >
        <Bug className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed top-4 right-4 w-64 bg-black/90 backdrop-blur-md border border-pink-500/30 rounded-2xl z-50 overflow-hidden shadow-2xl flex flex-col">
      <div className="bg-pink-500/20 p-3 flex items-center justify-between border-b border-pink-500/30">
        <div className="flex items-center gap-2">
            <Bug className="w-4 h-4 text-pink-400" />
            <h3 className="text-xs font-bold text-pink-400 tracking-wider uppercase">Dev Tools</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-pink-400 hover:text-white pb-1">×</button>
      </div>
      
      <div className="p-3 space-y-2 flex-1 overflow-y-auto max-h-[80vh]">
        <button
          onClick={() => adminAction({ type: "simulateLike", count: 100 })}
          className="w-full bg-white/5 border border-pink-500/30 p-2 rounded-lg text-xs font-bold text-pink-300 hover:bg-pink-500/20 transition-all flex items-center gap-2"
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          Simulate 100 Likes
        </button>
        <button
          onClick={() => adminAction({ type: "simulateGift", giftName: "Heart" })}
          className="w-full bg-white/5 border border-pink-500/30 p-2 rounded-lg text-xs font-bold text-pink-300 hover:bg-pink-500/20 transition-all flex items-center gap-2"
        >
          <Heart className="w-3.5 h-3.5" />
          Simulate Heart
        </button>
        <div className="pt-2 border-t border-pink-500/10 mt-2 space-y-2">
          <p className="text-[10px] text-pink-400/50 uppercase font-bold px-1">Manual Input</p>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={manualGuess}
              onChange={(e) => setManualGuess(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleManualSend();
              }}
              placeholder={`GUESS (${wordLength})`}
              maxLength={wordLength}
              className="flex-1 bg-white/5 border border-pink-500/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500 transition-all uppercase font-mono tracking-widest"
            />
            <button
              onClick={handleManualSend}
              disabled={manualGuess.length !== wordLength}
              className="bg-pink-500/20 border border-pink-500/30 hover:bg-pink-500 hover:text-white p-2 rounded-lg text-pink-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
        <button
          onClick={() => adminAction({ type: "simulateCorrect" })}
          className="w-full bg-white/5 border border-pink-500/30 p-2 rounded-lg text-xs font-bold text-[#22C55E] hover:bg-[#22C55E]/20 transition-all flex items-center gap-2"
        >
          <Trophy className="w-3.5 h-3.5" />
          Simulate Correct Guess
        </button>
        <button
          onClick={() => adminAction({ type: "simulateTopPlayer" })}
          className="w-full bg-white/5 border border-pink-500/30 p-2 rounded-lg text-xs font-bold text-pink-300 hover:bg-pink-500/20 transition-all flex items-center gap-2"
        >
          <Trophy className="w-3.5 h-3.5" />
          Simulate Top Player
        </button>
        <button
          onClick={() => setIsAutoPilot(!isAutoPilot)}
          className={clsx(
            "w-full border p-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2",
            isAutoPilot 
              ? "bg-pink-500 text-white border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)] animate-pulse" 
              : "bg-white/5 border-pink-500/30 text-pink-300 hover:bg-pink-500/20"
          )}
        >
          <Bot className="w-3.5 h-3.5" />
          {isAutoPilot ? "Auto Dummy (ON)" : "Auto Dummy (OFF)"}
        </button>
      </div>
    </div>
  );
}
