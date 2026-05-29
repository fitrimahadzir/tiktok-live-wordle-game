import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { useEffect, useRef } from "react";
import TekataBoard from "./TekataBoard";
import Leaderboard from "./Leaderboard";

export default function Overlay({ gameState, notifications, tiktokStatus, adminAction, showLikeBar }: any) {
  const prevStatusRef = useRef<string>("");

  useEffect(() => {
    if (gameState?.gameStatus === "won" && prevStatusRef.current !== "won") {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#7C3AED", "#22D3EE", "#22C55E"],
      });
    }
    prevStatusRef.current = gameState?.gameStatus;
  }, [gameState?.gameStatus]);

  if (!gameState)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-neon-purple animate-pulse font-bold text-2xl tracking-widest">
          MEMULAKAN SISTEM...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg dark:bg-slate-900 transition-colors duration-500">
      <div className="w-[1280px] h-[768px] relative mx-auto bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-sans overflow-hidden flex flex-col p-6 border border-slate-200 dark:border-slate-700 select-none transition-colors duration-500 shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-2xl">
        {/* Main Gameplay Area */}
        <div className="flex-1 flex gap-8 items-center justify-center min-h-0">
          {/* Left Sidebar */}
          <div className="w-64 h-fit flex flex-col gap-4">
            <img
              src="/images/logo.png"
              alt="Tekata Live"
              className="w-[90%] h-auto object-contain mx-auto mt-1"
            />
            <Leaderboard data={gameState.leaderboard} />
          </div>

          {/* Center Column */}
          <div className="w-fit flex flex-col items-center justify-center relative">
            <TekataBoard
              guesses={gameState.guesses || []}
              wordLength={gameState.wordLength || 5}
              category={gameState.currentCategory}
            />

            {/* Gift / Heart CTA Banner */}
            <div className="mt-6 w-full max-w-md relative">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="group relative overflow-hidden rounded-[20px] bg-pink-50/80 dark:bg-white/[0.04] border border-pink-300/50 dark:border-pink-400/15 shadow-lg shadow-pink-200/60 dark:shadow-pink-500/5 backdrop-blur-xl px-5 py-4"
              >
                <div className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-pink-200/40 via-transparent to-transparent dark:from-pink-500/8 pointer-events-none" />
                <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-pink-300/50 to-transparent dark:via-pink-400/30" />

                <div className="relative flex items-center gap-4">
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-300/60 to-pink-400/40 dark:from-pink-400/25 dark:to-rose-400/15 flex items-center justify-center border border-pink-300/60 dark:border-pink-400/25 shadow-inner">
                      <motion.span
                        animate={{ scale: [1, 1.12, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="text-base"
                      >
                        ❤️
                      </motion.span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-pink-600/80 dark:text-pink-300/70 mb-1">
                      Support Host
                    </p>
                    <p className="text-sm font-semibold text-pink-900/80 dark:text-white/85 leading-snug">
                      Hantar <span className="text-pink-600 dark:text-pink-300 font-bold">Heart Me</span> untuk tekaan tanpa had!
                    </p>
                  </div>

                  <div className="shrink-0 w-8 h-8 rounded-full bg-pink-200/60 dark:bg-white/5 border border-pink-300/50 dark:border-pink-400/20 flex items-center justify-center group-hover:bg-pink-300/60 dark:group-hover:bg-pink-400/15 group-hover:border-pink-400/60 dark:group-hover:border-pink-400/40 group-hover:translate-x-0.5 transition-all duration-300">
                    <svg className="w-3.5 h-3.5 text-pink-500/70 dark:text-pink-300/50 group-hover:text-pink-600 dark:group-hover:text-pink-300 transition-colors duration-300" fill="none" viewBox="0 0 24 20" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              {/* Notifications (centered over support host container) */}
              <div className="absolute inset-0 flex flex-col gap-2 items-center justify-center z-40 pointer-events-none">
                <AnimatePresence>
                  {notifications.filter((n: any) => n.type === "powerup").slice(0, 1).map((n: any, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ y: 20, opacity: 0, scale: 0.9 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      exit={{ y: -20, opacity: 0, scale: 0.9 }}
                      className="bg-white dark:bg-slate-800 border-2 border-neon-yellow p-3 px-6 rounded-2xl flex items-center gap-4 shadow-xl ring-4 ring-white dark:ring-slate-900 transition-colors duration-500"
                    >
                      {n.data.profilePictureUrl && (
                        <img
                          src={n.data.profilePictureUrl}
                          alt={n.data.nickname}
                          className="w-10 h-10 rounded-full border-2 border-[#FACC15] shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div className="flex flex-col">
                        <div className="text-sm font-bold text-slate-700 dark:text-white/70 whitespace-nowrap">
                          Terima kasih heart me ❤️
                        </div>
                        <div className="text-xs font-black tracking-tight text-[#CA8A04] dark:text-[#FACC15] uppercase">
                          <span className="text-slate-900 dark:text-white">@{n.data.uniqueId}</span> dapat tekaan unlimited
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Like Bar */}
            {showLikeBar && <div className="w-full max-w-md space-y-2 mt-2">
              <div className="bg-white/5 dark:bg-slate-900/50 border border-white/10 dark:border-slate-700 rounded-2xl px-4 py-3 transition-colors duration-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">👍</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
                      Jumlah Like
                    </span>
                  </div>
                  <span className="text-xs font-black text-neon-cyan font-mono">
                    {(gameState.hypeInfo?.current || 0).toLocaleString()} /{" "}
                    {(gameState.hypeInfo?.target || 1000).toLocaleString()}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    animate={{
                      width: `${Math.min(
                        100,
                        ((gameState.hypeInfo?.current || 0) /
                          (gameState.hypeInfo?.target || 1000)) *
                          100
                      )}%`,
                    }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                    className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan shadow-[0_0_8px_#22D3EE]"
                  />
                </div>
                <div className="text-[9px] text-slate-500 dark:text-slate-600 mt-1 text-right font-bold uppercase tracking-wider">
                  🚀 Spam tap skrin sekarang!
                </div>
              </div>
            </div>}
            <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 text-center tracking-wider">
              Designed & Developed by{" "}
              <a
                href="https://fitrimahadzir.my"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon-cyan hover:underline"
              >
                Fitri Mahadzir
              </a>
            </div>
          </div>
        </div>

        {/* Winner Popup */}
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
                className="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-12 rounded-[3.5rem] flex flex-col items-center shadow-2xl text-center max-w-md w-full transition-colors duration-500"
              >
                <div className="relative mb-8">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-b from-[#4ADE80] to-[#22C55E] p-1 shadow-[0_0_40px_rgba(34,197,94,0.6)]">
                    <div className="w-full h-full rounded-full border-4 border-[#0B0F1A] overflow-hidden">
                      <img
                        src={gameState.winner.profilePictureUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-2 text-5xl drop-shadow-2xl animate-bounce duration-[2000ms]">
                    👑
                  </div>
                </div>

                <div className="space-y-1 mb-8">
                  <h3 className="text-neon-yellow font-black text-xl uppercase tracking-[0.2em]">
                    KITA ADA PEMENANG!
                  </h3>
                  <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                    @{gameState.winner.nickname}
                  </h2>
                </div>

                <div className="w-full h-px bg-slate-100 dark:bg-slate-700 mb-8" />

                <div className="space-y-2 mb-10">
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                    Berjaya teka perkataan:
                  </p>
                  <div className="text-7xl font-black text-neon-green tracking-tighter uppercase">
                    {gameState.word}
                  </div>
                </div>

                <div className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest animate-pulse">
                  Pusingan seterusnya bermula sebentar lagi...
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notifications (non-powerup) */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-40 pointer-events-none items-center">
          <AnimatePresence>
            {notifications.filter((n: any) => n.type !== "powerup").map((n: any, i: number) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -20, opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-slate-800 border-2 border-neon-purple p-3 px-6 rounded-2xl flex items-center gap-4 shadow-xl ring-4 ring-white dark:ring-slate-900 transition-colors duration-500"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#22D3EE] to-[#7C3AED] flex items-center justify-center text-sm shrink-0">
                  {n.type === "gift" ? "🎁" : n.type === "follow" ? "💖" : "👍"}
                </div>
                <div>
                  <div className="text-[10px] text-[#0891B2] dark:text-[#22D3EE] font-bold uppercase">
                    {n.type === "gift" ? "Hadiah TikTok" : n.type === "follow" ? "Pengikut Baru" : "Like"}
                  </div>
                  <div className="text-sm font-black tracking-tight uppercase text-slate-900 dark:text-white">
                    {n.data.nickname}{" "}
                    {n.type === "gift" ? `hantar ${n.data.giftName}!` : n.type === "follow" ? "mula mengikuti!" : "memberi like!"}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
