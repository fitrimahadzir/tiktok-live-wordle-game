import { motion } from "motion/react";
import { clsx } from "clsx";

export default function Leaderboard({ data }: { data: any[] }) {
  return (
    <div className="bg-[#374151]/20 border border-[#374151] rounded-xl p-4 backdrop-blur-sm h-full flex flex-col">
      <h2 className="text-[#22D3EE] text-xs font-bold uppercase mb-4 flex items-center gap-2 shrink-0">
        <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse"></span>
        Papan Kedudukan
      </h2>

      <div className="space-y-2 overflow-y-auto custom-scrollbar flex-1 pr-1">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-30 italic text-xs text-gray-400">
            Tiada pemenang setakat ini...
          </div>
        ) : (
          data.map((player, i) => (
            <motion.div
              key={player.userId}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className={clsx(
                "flex justify-between items-center p-2 rounded",
                i === 0 ? "bg-[#7C3AED]/10 border-l-2 border-[#7C3AED]" : "bg-transparent"
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                {player.profilePictureUrl ? (
                   <img src={player.profilePictureUrl} alt={player.nickname} className="w-5 h-5 rounded-full border border-gray-600 shrink-0" referrerPolicy="no-referrer" />
                ) : (
                   <div className="w-5 h-5 rounded-full bg-gray-600 shrink-0 flex items-center justify-center text-[8px] text-white">
                      {player.nickname?.[0]?.toUpperCase() || "?"}
                   </div>
                )}
                <span className={clsx(
                  "text-sm font-medium truncate",
                  i === 0 ? "italic text-white" : "text-gray-300"
                )}>@{player.nickname}</span>
              </div>
              <span className={clsx(
                "font-bold shrink-0",
                i === 0 ? "text-[#FACC15]" : "text-white"
              )}>{player.wins}{player.streak > 1 ? "🔥" : ""}</span>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
