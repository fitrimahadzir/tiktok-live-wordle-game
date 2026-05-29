import { useState, useEffect } from "react";
import { useSocket } from "./hooks/useSocket";
import Overlay from "./components/Overlay";
import Admin from "./components/Admin";
import DevTools from "./components/DevTools";
import { Settings, SkipForward } from "lucide-react";
import { clsx } from "clsx";

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isDevMode, setIsDevMode] = useState(false);
  const [showLikeBar, setShowLikeBar] = useState(false);
  const socketData = useSocket();

  // Simple route check from URL
  useEffect(() => {
    if (window.location.hash === "#admin") {
      setIsAdminOpen(true);
    }
  }, []);

  return (
    <div className={clsx(
      "relative selection:bg-neon-purple selection:text-white w-screen h-screen overflow-hidden flex transition-colors duration-500",
      isDarkMode ? "dark bg-slate-900 text-white" : "bg-dark-bg text-slate-900"
    )}>
      {/* The main overlay is always visible */}
      <div className="flex-1 relative">
        <Overlay {...socketData} showLikeBar={showLikeBar} />
      </div>

      {/* Container for bottom right widgets */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50">
        
        {/* Jawapan (Answer) Bubble */}
        {showAnswer && (() => {
          const gs = socketData.gameState;
          const oddPos = gs?.oddPosition;
          const colLabel = oddPos ? "ABCDEFGHIJKLMNOPQR"[oddPos.col] : "";
          const rowLabel = oddPos ? oddPos.row + 1 : "";
          return (
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl px-4 py-2.5 opacity-60 hover:opacity-100 transition-all shadow-2xl text-center mb-1 group">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1 group-hover:text-neon-cyan transition-colors">Jawapan</div>
              <div className="text-xl font-black text-white tracking-widest uppercase leading-none drop-shadow-md">
                {oddPos ? `[ ${colLabel} - ${rowLabel} ]` : "..."}
              </div>
            </div>
          );
        })()}

        {/* One-line Admin Setting (Float Widget) */}
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-full p-1.5 pr-3 shadow-2xl transition-all duration-300 hover:bg-slate-900">
          <div className="flex items-center justify-center w-8 h-8 bg-slate-800 rounded-full border border-slate-700">
            <div className={clsx(
              "w-2 h-2 rounded-full animate-pulse",
              socketData.tiktokStatus?.status === "connected" ? "bg-neon-green shadow-neon-green" : "bg-red-500 shadow-[0_0_8px_#EF4444]"
            )} />
          </div>
          
          <div className="flex flex-col mr-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status</span>
            <span className="text-xs text-white font-mono leading-none">
              {socketData.tiktokStatus?.status === "connected" ? "Aktif" : "Terputus"}
            </span>
          </div>

          <div className="h-6 w-px bg-slate-700 mx-1"></div>

          {socketData.adminAction && (
            <button
              title="Skip Perkataan"
              onClick={() => socketData.adminAction({ type: "skip" })}
              className="p-2 bg-slate-800 border border-slate-700 rounded-full hover:bg-neon-cyan/20 hover:text-neon-cyan hover:border-neon-cyan transition-all group"
            >
              <SkipForward className="w-4 h-4 text-slate-300 group-hover:text-neon-cyan" />
            </button>
          )}
          
          <button
            onClick={() => setIsAdminOpen(true)}
            className="p-2 bg-neon-purple border border-neon-purple rounded-full hover:bg-purple-600 hover:shadow-neon-purple transition-all text-white flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sidebar Admin Popup */}
      <Admin 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
        showAnswer={showAnswer}
        setShowAnswer={setShowAnswer}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        isDevMode={isDevMode}
        setIsDevMode={setIsDevMode}
        showLikeBar={showLikeBar}
        setShowLikeBar={setShowLikeBar}
        {...socketData} 
      />

      {isDevMode && <DevTools adminAction={socketData.adminAction} />}
    </div>
  );
}
