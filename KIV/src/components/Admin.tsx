import { useState, FormEvent } from "react";
import { Play, SkipForward, RotateCcw, Monitor, Link2, AlertCircle, X, Eye, Moon, ChevronDown, Code } from "lucide-react";
import { clsx } from "clsx";

interface AdminProps {
  isOpen: boolean;
  onClose: () => void;
  connectTiktok: (username: string) => void;
  tiktokStatus: any;
  adminAction: any;
  gameState: any;
  showAnswer: boolean;
  setShowAnswer: (show: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  isDevMode: boolean;
  setIsDevMode: (dev: boolean) => void;
  showLikeBar: boolean;
  setShowLikeBar: (show: boolean) => void;
}

const DIFFICULTIES = [
  { id: "easy", label: "Easy", description: "A vs B, 3 vs 8" },
  { id: "medium", label: "Medium", description: "O vs Q, P vs R, 5 vs 6" },
  { id: "hard", label: "Hard", description: "M vs N, C vs G, 8 vs 9" },
  { id: "impossible", label: "Impossible", description: "I vs l, O vs 0, B vs 8, S vs 5" },
];

export default function Admin({
  isOpen,
  onClose,
  connectTiktok,
  tiktokStatus,
  adminAction,
  gameState,
  showAnswer,
  setShowAnswer,
  isDarkMode,
  setIsDarkMode,
  isDevMode,
  setIsDevMode,
  showLikeBar,
  setShowLikeBar,
}: AdminProps) {
  const [username, setUsername] = useState("");
  const [isDifficultyOpen, setIsDifficultyOpen] = useState(false);

  const handleConnect = (e: FormEvent) => {
    e.preventDefault();
    if (username) connectTiktok(username);
  };

  const isConnected = tiktokStatus?.status === "connected";
  const isConnecting = tiktokStatus?.status === "connecting";

  return (
    <>
      <div
        className={clsx(
          "fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 z-[60]",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <div
        className={clsx(
          "fixed top-0 right-0 h-full w-[400px] max-w-[90vw] bg-slate-900 border-l border-slate-800 shadow-2xl transition-transform duration-300 ease-in-out z-[70] flex flex-col overflow-y-auto",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <Monitor className="w-5 h-5 text-neon-purple" />
            <h1 className="text-xl font-black font-poppins tracking-tighter uppercase text-white">
              Admin Panel
            </h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-5 flex flex-col gap-6">
          <div className="flex justify-center">
            <img
              src="/images/logo.png"
              alt="Odd Hunt Live Logo"
              className="h-16 w-auto object-contain"
            />
          </div>

          {/* TikTok Connection */}
          <div className="bg-slate-800/50 shadow-sm p-4 rounded-2xl border border-slate-700/50 space-y-4">
            <h2 className="text-xs font-bold flex items-center gap-2 text-neon-cyan uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
              Sambungan TikTok Live
            </h2>

            <form onSubmit={handleConnect} className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                  @
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="nama_pengguna_tiktok"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-7 pr-3 text-sm text-white focus:ring-1 focus:ring-neon-purple focus:border-neon-purple outline-none transition-all placeholder:text-slate-600"
                />
              </div>
              <button
                type="submit"
                disabled={isConnecting}
                className="bg-neon-purple px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:shadow-neon-purple transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isConnecting ? (
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 text-sm bg-slate-900/50 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <div
                  className={clsx(
                    "w-2 h-2 rounded-full",
                    isConnected
                      ? "bg-neon-green shadow-neon-green animate-pulse"
                      : "bg-red-500 shadow-[0_0_8px_#EF4444]"
                  )}
                />
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                  {isConnected
                    ? "Bersambung"
                    : tiktokStatus?.status === "connecting"
                    ? "Menyambung..."
                    : "Tidak Disambung"}
                </span>
              </div>
              {gameState?.tiktokUsername && (
                <span className="text-neon-cyan font-mono text-xs ml-auto bg-neon-cyan/10 px-2 py-0.5 rounded border border-neon-cyan/20">
                  @{gameState.tiktokUsername}
                </span>
              )}
            </div>

            {tiktokStatus?.status === "error" && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{tiktokStatus.message}</span>
              </div>
            )}
          </div>

          {/* Grid Mode Control */}
          <div className="bg-slate-800/50 shadow-sm p-4 rounded-2xl border border-slate-700/50 space-y-3">
            <h2 className="text-xs font-bold flex items-center gap-2 text-neon-cyan uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
              Mode
            </h2>
            <div className="flex gap-2">
              {["LOW", "MEDIUM", "HIGH"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => adminAction({ type: "setGridMode", mode })}
                  className={clsx(
                    "flex-1 py-2.5 rounded-xl border text-[11px] font-black uppercase tracking-wider transition-all",
                    gameState?.gridMode === mode
                      ? mode === "LOW"
                        ? "bg-neon-green/20 text-neon-green border-neon-green shadow-[0_0_10px_rgba(22,163,74,0.2)]"
                        : mode === "MEDIUM"
                        ? "bg-yellow-500/20 text-neon-yellow border-neon-yellow shadow-[0_0_10px_rgba(202,138,4,0.2)]"
                        : "bg-red-400/20 text-red-400 border-red-400 shadow-[0_0_10px_rgba(248,113,113,0.2)]"
                      : "bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300"
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
            <div className="text-[10px] text-slate-500 font-mono text-center">
              {gameState?.gridMode === "LOW"
                ? "12×10 · Warm-up"
                : gameState?.gridMode === "MEDIUM"
                ? "15×11 · Standard"
                : "18×12 · Hardcore"}
            </div>
          </div>

          {/* Display Settings */}
          <div className="bg-slate-800/50 shadow-sm p-4 rounded-2xl border border-slate-700/50 space-y-4">
            <h2 className="text-xs font-bold flex items-center gap-2 text-neon-purple uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-purple" />
              Tetapan Paparan
            </h2>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <div
                    className={clsx(
                      "p-2 rounded-lg transition-colors",
                      showAnswer
                        ? "bg-neon-green/10 text-neon-green"
                        : "bg-slate-800 text-slate-500"
                    )}
                  >
                    <Eye className="w-4 h-4" />
                  </div>
                  <span
                    className={clsx(
                      "text-xs font-bold uppercase tracking-widest transition-colors",
                      showAnswer ? "text-slate-300" : "text-slate-500"
                    )}
                  >
                    Papar Jawapan
                  </span>
                </div>
                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className={clsx(
                    "w-12 h-6 rounded-full transition-all relative",
                    showAnswer
                      ? "bg-neon-green shadow-[0_0_8px_#4ADE80]"
                      : "bg-slate-700"
                  )}
                >
                  <div
                    className={clsx(
                      "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                      showAnswer ? "left-7" : "left-1"
                    )}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <div
                    className={clsx(
                      "p-2 rounded-lg transition-colors",
                      isDarkMode
                        ? "bg-neon-purple/10 text-neon-purple"
                        : "bg-slate-800 text-slate-500"
                    )}
                  >
                    <Moon className="w-4 h-4" />
                  </div>
                  <span
                    className={clsx(
                      "text-xs font-bold uppercase tracking-widest transition-colors",
                      isDarkMode ? "text-slate-300" : "text-slate-500"
                    )}
                  >
                    Mod Gelap
                  </span>
                </div>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={clsx(
                    "w-12 h-6 rounded-full transition-all relative",
                    isDarkMode
                      ? "bg-neon-purple shadow-[0_0_8px_#8B5CF6]"
                      : "bg-slate-700"
                  )}
                >
                  <div
                    className={clsx(
                      "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                      isDarkMode ? "left-7" : "left-1"
                    )}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <div
                    className={clsx(
                      "p-2 rounded-lg transition-colors",
                      isDevMode
                        ? "bg-neon-cyan/10 text-neon-cyan"
                        : "bg-slate-800 text-slate-500"
                    )}
                  >
                    <Code className="w-4 h-4" />
                  </div>
                  <span
                    className={clsx(
                      "text-xs font-bold uppercase tracking-widest transition-colors",
                      isDevMode ? "text-slate-300" : "text-slate-500"
                    )}
                  >
                    Mod Pembangun
                  </span>
                </div>
                <button
                  onClick={() => setIsDevMode(!isDevMode)}
                  className={clsx(
                    "w-12 h-6 rounded-full transition-all relative",
                    isDevMode
                      ? "bg-neon-cyan shadow-[0_0_8px_#0891B2]"
                      : "bg-slate-700"
                  )}
                >
                  <div
                    className={clsx(
                      "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                      isDevMode ? "left-7" : "left-1"
                    )}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <div
                    className={clsx(
                      "p-2 rounded-lg transition-colors",
                      showLikeBar
                        ? "bg-pink-500/10 text-pink-400"
                        : "bg-slate-800 text-slate-500"
                    )}
                  >
                    <span className="w-4 h-4 flex items-center justify-center text-sm">👍</span>
                  </div>
                  <span
                    className={clsx(
                      "text-xs font-bold uppercase tracking-widest transition-colors",
                      showLikeBar ? "text-slate-300" : "text-slate-500"
                    )}
                  >
                    Papar Like Bar
                  </span>
                </div>
                <button
                  onClick={() => setShowLikeBar(!showLikeBar)}
                  className={clsx(
                    "w-12 h-6 rounded-full transition-all relative",
                    showLikeBar
                      ? "bg-pink-500 shadow-[0_0_8px_#EC4899]"
                      : "bg-slate-700"
                  )}
                >
                  <div
                    className={clsx(
                      "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                      showLikeBar ? "left-7" : "left-1"
                    )}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-800/50 shadow-sm p-4 rounded-2xl border border-slate-700/50 space-y-4">
            <h2 className="text-xs font-bold flex items-center gap-2 text-neon-green uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-green" />
              Tindakan Pantas
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => adminAction({ type: "skip" })}
                className="flex-1 flex flex-col items-center justify-center gap-2 bg-slate-900 border border-slate-700 p-3 rounded-xl hover:bg-neon-cyan/10 hover:border-neon-cyan transition-all group"
              >
                <SkipForward className="w-5 h-5 text-slate-400 group-hover:text-neon-cyan group-hover:animate-pulse transition-colors" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-neon-cyan">
                  Skip Pusingan
                </span>
              </button>
              <button
                onClick={() => adminAction({ type: "reset" })}
                className="flex-1 flex flex-col items-center justify-center gap-2 bg-slate-900 border border-slate-700 p-3 rounded-xl hover:bg-red-500/10 hover:border-red-500 transition-all group"
              >
                <RotateCcw className="w-5 h-5 text-slate-400 group-hover:text-red-500 group-hover:-rotate-180 transition-all duration-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-red-500">
                  Reset Permainan
                </span>
              </button>
            </div>
          </div>

          {/* Difficulty Info */}
          <div className="bg-slate-800/50 shadow-sm p-4 rounded-2xl border border-slate-700/50 space-y-2">
            <button
              onClick={() => setIsDifficultyOpen(!isDifficultyOpen)}
              className="w-full flex items-center justify-between group outline-none"
            >
              <h2 className="text-xs font-bold flex items-center gap-2 text-neon-yellow uppercase tracking-widest group-hover:text-yellow-300 transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-neon-yellow" />
                Aras Kesukaran
              </h2>
              <ChevronDown
                className={clsx(
                  "w-4 h-4 text-slate-500 transition-transform duration-300",
                  isDifficultyOpen && "rotate-180"
                )}
              />
            </button>

            {isDifficultyOpen && (
              <div className="flex flex-col gap-2 pt-3 border-t border-slate-700/50">
                {DIFFICULTIES.map((d) => (
                  <div
                    key={d.id}
                    className={clsx(
                      "flex items-center justify-between px-3 py-2 rounded-xl border transition-all text-[11px] font-bold uppercase tracking-wider",
                      gameState?.difficulty === d.id
                        ? "bg-neon-yellow text-slate-900 border-neon-yellow"
                        : "bg-slate-900 border-slate-700 text-slate-400"
                    )}
                  >
                    <span>{d.label}</span>
                    <span className="text-[9px] font-mono text-slate-500 normal-case tracking-normal">
                      {d.description}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* OBS Guide */}
          <div className="p-4 bg-neon-purple/5 border border-neon-purple/20 rounded-2xl mt-auto">
            <h2 className="text-[10px] font-bold text-neon-purple uppercase tracking-widest mb-3">
              Arahan Persediaan OBS
            </h2>
            <ol className="list-decimal list-outside ml-3 space-y-1.5 text-[11px] text-slate-400 leading-relaxed">
              <li>
                Masukkan nama pengguna TikTok dan klik{" "}
                <span className="text-white">Sambung</span>.
              </li>
              <li>
                Buka OBS atau TikTok LIVE Studio.
              </li>
              <li>
                Tambah{" "}
                <span className="text-neon-cyan">Sumber Pelayar (Browser Source)</span>.
              </li>
              <li>Tetapkan URL ke halaman ini.</li>
              <li>
                Tetapkan Resolusi: <span className="text-white">1280×768</span>.
              </li>
              <li>Anda sudah bersedia untuk mula siaran!</li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}
