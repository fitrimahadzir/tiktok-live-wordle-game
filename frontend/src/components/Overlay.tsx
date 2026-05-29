import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { useEffect, useRef } from "react";
import OddOneGrid from "./OddOneGrid";
import Leaderboard from "./Leaderboard";

const COL_LABELS = "ABCDEFGHIJKLMNOPQR";

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

  const oddColLabel =
    gameState.oddPosition ? COL_LABELS[gameState.oddPosition.col] : "";
  const oddRowLabel = gameState.oddPosition ? gameState.oddPosition.row + 1 : "";
  const answerLabel = `${oddColLabel}${oddRowLabel}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg dark:bg-slate-900 transition-colors duration-500">
      <div className="w-[1280px] h-[768px] relative mx-auto bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-sans overflow-hidden flex flex-col p-6 border border-slate-200 dark:border-slate-700 select-none transition-colors duration-500 shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {/* Main Gameplay Area */}
        <div className="flex-1 flex gap-8 items-center justify-center min-h-0">
          {/* Left Sidebar */}
          <div className="w-64 h-fit flex flex-col gap-4">
            <img
              src="/images/logo.png"
              alt="Odd Hunt Live"
              className="w-[70%] h-auto object-contain mx-auto mt-1"
            />
            <Leaderboard data={gameState.leaderboard} />
          </div>

          {/* Center Column */}
          <div className="w-fit flex flex-col items-center justify-center">
            <div className="relative">
              <OddOneGrid
                grid={gameState.grid}
                oddPosition={gameState.oddPosition}
                difficulty={gameState.difficulty}
                roundNumber={gameState.roundNumber}
                gameStatus={gameState.gameStatus}
                gridMode={gameState.gridMode || "LOW"}
                gridConfig={gameState.gridConfig || { cols: 18, rows: 12 }}
              />

              {/* Notifications overlay centered on grid */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 z-40 pointer-events-none items-center">
                <AnimatePresence>
                  {notifications.map((n: any, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ y: 20, opacity: 0, scale: 0.9 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      exit={{ y: -20, opacity: 0, scale: 0.9 }}
                      className={`bg-white dark:bg-slate-800 border-2 ${
                        n.type === "powerup"
                          ? "border-neon-yellow"
                          : "border-neon-purple"
                      } p-3 px-6 rounded-2xl flex items-center gap-4 shadow-xl ring-4 ring-white dark:ring-slate-900 transition-colors duration-500`}
                    >
                      {n.type === "powerup" ? (
                        <>
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
                              <span className="text-slate-900 dark:text-white">
                                @{n.data.uniqueId}
                              </span>{" "}
                              dapat tekaan unlimited
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#22D3EE] to-[#7C3AED] flex items-center justify-center text-sm shrink-0">
                            {n.type === "gift" ? "🎁" : n.type === "follow" ? "💖" : "👍"}
                          </div>
                          <div>
                            <div className="text-[10px] text-[#0891B2] dark:text-[#22D3EE] font-bold uppercase">
                              {n.type === "gift"
                                ? "Hadiah TikTok"
                                : n.type === "follow"
                                ? "Pengikut Baru"
                                : "Like"}
                            </div>
                            <div className="text-sm font-black tracking-tight uppercase text-slate-900 dark:text-white">
                              {n.data.nickname}{" "}
                              {n.type === "gift"
                                ? `hantar ${n.data.giftName}!`
                                : n.type === "follow"
                                ? "mula mengikuti!"
                                : "memberi like!"}
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Gift / Heart CTA Banner */}
            <div className="mt-6 w-full max-w-md">
              <div className="flex items-center gap-3 bg-gradient-to-r from-pink-500/10 to-red-500/10 border border-pink-500/30 rounded-2xl px-4 py-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-transparent pointer-events-none" />
                <div className="flex items-center justify-center w-9 h-9 bg-pink-500/20 rounded-full border border-pink-400/40 shrink-0">
                  <span className="text-lg animate-bounce">❤️</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-400 mb-0.5">
                    💖 SUPPORT HOST
                  </div>
                  <div className="text-sm font-bold text-white leading-tight">
                    Jangan lupa send <span className="text-pink-400">Heart Me</span> untuk sokongan! 🎁
                  </div>
                </div>
                <div className="shrink-0 text-2xl animate-pulse">💝</div>
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
            <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-600 text-center tracking-wider">
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
                    Berjaya cari jawapan:
                  </p>
                  <div className="text-7xl font-black text-neon-green tracking-tighter uppercase">
                    {answerLabel}
                  </div>
                </div>

                <div className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest animate-pulse">
                  Pusingan seterusnya bermula sebentar lagi...
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>


      </div>
    </div>
  );
}
