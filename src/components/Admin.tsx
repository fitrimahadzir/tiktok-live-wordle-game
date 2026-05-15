import { useState, FormEvent } from "react";
import { Play, SkipForward, RotateCcw, Monitor, Globe, Gamepad2, Tv, Link2, AlertCircle } from "lucide-react";
import { clsx } from "clsx";

export default function Admin({ connectTiktok, tiktokStatus, adminAction, gameState }: any) {
  const [username, setUsername] = useState("");

  const handleConnect = (e: FormEvent) => {
    e.preventDefault();
    if (username) connectTiktok(username);
  };

  const categories = [
    { id: "haiwan", label: "Haiwan", icon: Globe },
    { id: "makanan", label: "Makanan", icon: Link2 },
    { id: "pekerjaan", label: "Pekerjaan", icon: Gamepad2 }
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <Monitor className="w-8 h-8 text-neon-purple shadow-neon-purple" />
        <h1 className="text-3xl font-black italic tracking-tighter uppercase">CONTROL CENTER</h1>
      </div>

      {/* Connection Card */}
      <div className="glass p-6 rounded-3xl border-white/10 space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-purple" />
          TikTok Live Connection
        </h2>
        
        <form onSubmit={handleConnect} className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">@</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="tiktok_username"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-8 pr-4 focus:ring-2 focus:ring-neon-purple focus:border-transparent outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={tiktokStatus.status === "connecting"}
            className="bg-neon-purple px-6 py-3 rounded-xl font-bold hover:shadow-neon-purple transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {tiktokStatus.status === "connecting" ? "Connecting..." : "Connect"}
          </button>
        </form>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className={clsx(
              "w-2 h-2 rounded-full",
              tiktokStatus.status === "connected" ? "bg-neon-green shadow-[0_0_8px_#22C55E]" : "bg-red-500 shadow-[0_0_8px_#EF4444]"
            )} />
            <span className="text-gray-400 capitalize">{tiktokStatus.status}</span>
          </div>
          {gameState?.tiktokUsername && (
            <span className="text-neon-cyan font-mono">@{gameState.tiktokUsername}</span>
          )}
        </div>
        
        {tiktokStatus.status === "error" && (
           <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-500 text-xs">
             <AlertCircle className="w-4 h-4" />
             {tiktokStatus.message}
           </div>
        )}
      </div>

      {/* Game Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-3xl border-white/10 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-cyan" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => adminAction({ type: "skip" })}
              className="flex flex-col items-center justify-center gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-all hover:border-neon-cyan group"
            >
              <SkipForward className="w-6 h-6 text-neon-cyan group-hover:animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-white">Skip Word</span>
            </button>
            <button
              onClick={() => adminAction({ type: "reset" })}
              className="flex flex-col items-center justify-center gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-all hover:border-red-500 group"
            >
              <RotateCcw className="w-6 h-6 text-red-500 group-hover:rotate-180 transition-transform duration-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-white">Reset Game</span>
            </button>
          </div>
        </div>

        <div className="glass p-6 rounded-3xl border-white/10 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-yellow" />
            Word Category
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => adminAction({ type: "category", category: cat.id })}
                className={clsx(
                  "flex items-center gap-2 p-3 rounded-xl border transition-all text-xs font-bold",
                  gameState?.currentCategory === cat.id 
                    ? "bg-neon-yellow text-black border-neon-yellow" 
                    : "bg-white/5 border-white/10 text-gray-400 hover:border-neon-yellow hover:text-white"
                )}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* OBS Help */}
      <div className="p-6 bg-neon-purple/10 border border-neon-purple/20 rounded-3xl space-y-4">
        <h2 className="text-xl font-bold text-neon-purple">Setup Instructions</h2>
        <ol className="list-decimal list-inside space-y-3 text-sm text-gray-300">
          <li>Enter your TikTok username above and click <span className="font-bold text-white italic">Connect</span>.</li>
          <li>Open OBS or TikTok LIVE Studio.</li>
          <li>Add a <span className="font-bold text-neon-cyan">Browser Source</span>.</li>
          <li>Set the URL to this current page (without #admin).</li>
          <li>Set Resolution: <span className="font-bold text-white italic">450x800</span> (Portrait).</li>
          <li>You are ready to stream! The chat will automatically play.</li>
        </ol>
      </div>
    </div>
  );
}
