import { motion, AnimatePresence } from "motion/react";
import { Trophy, Flame, Users, Gift, Heart, UserPlus } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect, useRef } from "react";
import TekataBoard from "./TekataBoard";
import Leaderboard from "./Leaderboard";
import HypeMeter from "./HypeMeter";

export default function Overlay({ gameState, notifications, tiktokStatus }: any) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameState?.gameStatus === "won") {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#7C3AED", "#22D3EE", "#22C55E"]
      });
    }
  }, [gameState?.gameStatus]);

  if (!gameState) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-neon-purple animate-pulse font-bold text-2xl tracking-widest">
        MEMULAKAN SISTEM...
      </div>
    </div>
  );

  return (
    <div className="w-[1280px] h-[768px] relative mx-auto bg-[#0B0F1A] text-white font-sans overflow-hidden flex flex-col p-6 border border-white/5 relative select-none">
      
      {/* Header Section from Design */}
      <div className="flex justify-between items-end mb-8 border-b border-[#7C3AED]/30 pb-4">
        <div>
          <div className="text-[#22D3EE] text-xs font-bold tracking-[0.2em] uppercase mb-1">Paparan Siaran Langsung</div>
          <h1 className="text-4xl font-black italic tracking-tighter leading-none">TEKATA <span className="text-[#7C3AED]">LIVE</span></h1>
        </div>
        <div className="flex gap-8 items-center">
          <div className="text-center">
            <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Pusingan</div>
            <div className="text-2xl font-mono font-bold text-[#FACC15] leading-none">{String(gameState.roundNumber).padStart(2, '0')}</div>
          </div>
          <div className="text-center bg-[#7C3AED]/10 border border-[#7C3AED] px-6 py-2 rounded-lg shadow-[0_0_15px_rgba(124,58,237,0.3)] min-w-[180px]">
            <div className="text-[10px] text-[#22D3EE] uppercase tracking-widest mb-1">Kategori</div>
            <div className="text-3xl font-mono font-bold uppercase truncate leading-none animate-pulse">
              {gameState.currentCategory}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Bahasa</div>
            <div className="text-xl font-bold uppercase truncate">Melayu</div>
          </div>
        </div>
      </div>

      {/* Main Gameplay Area */}
      <div className="flex-1 flex gap-6 min-h-0">
        
        {/* Left Sidebar */}
        <div className="w-64 flex flex-col gap-4">
          <div className="flex-1 min-h-0">
            <Leaderboard data={gameState.leaderboard} />
          </div>
          <div className="mt-auto shrink-0">
            <HypeMeter hypeInfo={gameState.hypeInfo} />
          </div>
        </div>

        {/* Center: Tekata Grid */}
        <div className="flex-1 flex flex-col items-center justify-start mt-2">
          <TekataBoard guesses={gameState.guesses} wordLength={gameState.wordLength || 5} />
          
          <div className="mt-8 bg-[#7C3AED]/20 border-2 border-[#7C3AED] rounded-xl p-4 w-full max-w-md text-center shadow-[0_0_20px_rgba(124,58,237,0.2)]">
            <div className="text-[#22D3EE] font-black text-lg mb-1 leading-tight">CARA BERMAIN</div>
            <div className="text-sm leading-tight text-gray-300 mb-2 font-medium">Taip tekaan anda di chat! (Had 3 kali)</div>
            <div className="mt-1 bg-[#0B0F1A] rounded p-2.5 text-xs font-bold text-white ring-1 ring-[#FACC15]/50 flex flex-row gap-2 items-center justify-center shadow-[0_0_10px_rgba(250,204,21,0.2)]">
               <span className="text-[#FACC15] animate-pulse uppercase">💖 SEND "HEART ME"</span>
               <span>UNTUK TEKAAN UNLIMITED!</span>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Feed */}
        <div className="w-64 flex flex-col gap-4">
          <div className="flex-1 bg-[#374151]/20 border border-[#374151] rounded-xl p-4 backdrop-blur-sm overflow-hidden flex flex-col">
            <h2 className="text-[#22D3EE] text-xs font-bold uppercase mb-4 shrink-0 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse"></span>Log Percubaan</h2>
            <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-2">
              <AnimatePresence initial={false}>
                {[...gameState.guesses].reverse().slice(0, 10).map((guess: any) => (
                  <motion.div
                    key={`${guess.uniqueId}-${guess.timestamp}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="flex gap-3 overflow-hidden"
                  >
                    <div className="w-8 h-8 rounded bg-[#7C3AED] shrink-0 flex items-center justify-center overflow-hidden border border-white/10">
                      {guess.profilePictureUrl ? (
                         <img src={guess.profilePictureUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                         <span className="text-[10px] font-bold">JD</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-center gap-2">
                        <div className="text-[10px] text-gray-400 truncate">@{guess.nickname}</div>
                        <div className="text-[10px] uppercase font-mono shrink-0 px-1.5 py-0.5 rounded bg-black/40 text-[#22D3EE] border border-[#22D3EE]/30">
                          tekaan: {guess.currentGuess || 1}/{guess.maxGuesses > 2 ? '∞' : (guess.maxGuesses || 2)}
                        </div>
                      </div>
                      <div className="text-sm truncate mt-0.5">Meneka: <span className="text-[#FACC15] uppercase font-bold">{guess.word}</span></div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="bg-[#0B0F1A]/80 border border-red-500/30 rounded-xl p-4 shrink-0 text-center shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-2">
              Permainan Tersekat?
            </div>
            <div className="text-xs text-gray-300">
               Komen <span className="text-red-400 font-black tracking-widest text-sm">"SKIP"</span><br/>(Perlu 5 orang berbeza)
            </div>
          </div>
        </div>
      </div>

      {/* Winner Popup Overlay */}
      <AnimatePresence>
        {gameState.gameStatus === "won" && gameState.winner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-50 p-6 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 20, opacity: 0 }}
              className="relative bg-[#0B0F1A]/90 border border-white/10 p-12 rounded-[3.5rem] flex flex-col items-center shadow-[0_0_100px_rgba(34,197,94,0.2)] text-center max-w-md w-full"
            >
              {/* Avatar with Glow and Crown */}
              <div className="relative mb-8">
                <div className="w-32 h-32 rounded-full bg-gradient-to-b from-[#4ADE80] to-[#22C55E] p-1 shadow-[0_0_40px_rgba(34,197,94,0.6)]">
                  <div className="w-full h-full rounded-full border-4 border-[#0B0F1A] overflow-hidden">
                    <img src={gameState.winner.profilePictureUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="absolute -top-4 -right-2 text-5xl drop-shadow-2xl animate-bounce duration-[2000ms]">
                  👑
                </div>
              </div>

              <div className="space-y-1 mb-8">
                <h3 className="text-[#FACC15] font-black text-xl uppercase tracking-[0.2em]">KITA ADA PEMENANG!</h3>
                <h2 className="text-4xl font-black tracking-tight text-white">@{gameState.winner.nickname}</h2>
              </div>

              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

              <div className="space-y-2 mb-10">
                <p className="text-gray-400 text-sm font-medium">Berjaya teka perkataan:</p>
                <div className="text-7xl font-black text-[#22C55E] tracking-tighter uppercase drop-shadow-[0_0_20px_rgba(34,197,94,0.5)]">
                  {gameState.currentWord}
                </div>
              </div>

              <div className="text-gray-500 text-xs font-bold uppercase tracking-widest animate-pulse">
                Pusingan seterusnya bermula sebentar lagi...
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Notifications */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-40 pointer-events-none items-center">
        <AnimatePresence>
          {notifications.map((n: any, i: number) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.9 }}
               className={`bg-[#0B0F1A] border-2 ${n.type === 'powerup' ? 'border-[#FACC15]' : 'border-[#7C3AED]'} p-3 px-6 rounded-2xl flex items-center gap-4 ${n.type === 'powerup' ? 'shadow-[0_0_30px_#FACC15]' : 'shadow-[0_0_30px_#7C3AED]'} ring-2 ring-[#0B0F1A]`}
            >
               {n.type === "powerup" ? (
                 <>
                   {n.data.profilePictureUrl && (
                     <img src={n.data.profilePictureUrl} alt={n.data.nickname} className="w-10 h-10 rounded-full border-2 border-[#FACC15] shrink-0" referrerPolicy="no-referrer" />
                   )}
                   <div className="flex flex-col">
                     <div className="text-sm font-bold text-white/70 whitespace-nowrap">
                       Terima kasih heart me ❤️
                     </div>
                     <div className="text-xs font-black tracking-tight text-[#FACC15] uppercase">
                       <span className="text-white">@{n.data.uniqueId}</span> dapat tekaan unlimited
                     </div>
                   </div>
                 </>
               ) : (
                 <>
                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#22D3EE] to-[#7C3AED] flex items-center justify-center text-sm shrink-0">
                     {n.type === "gift" ? "🎁" : "💖"}
                   </div>
                   <div>
                      <div className="text-[10px] text-[#22D3EE] font-bold uppercase">{n.type === "gift" ? "Hadiah TikTok" : "Pengikut Baru"}</div>
                      <div className="text-sm font-black tracking-tight uppercase">
                        {n.data.nickname} {n.type === "gift" ? `hantar ${n.data.giftName}!` : "mula mengikuti!"}
                      </div>
                   </div>
                 </>
               )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
