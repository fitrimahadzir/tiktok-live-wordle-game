import { motion } from "motion/react";
import { clsx } from "clsx";

export default function Leaderboard({ data }: { data: any[] }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm h-full flex flex-col transition-colors duration-500">
      <h2 className="text-neon-cyan text-xs font-bold uppercase mb-2 flex items-center gap-2 shrink-0">
        <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></span>
        Papan Kedudukan
      </h2>

      <div className="space-y-3">
        {data.length === 0 ? (
          <>
            {/* Skeleton Top 1 */}
            <div className="bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 border-dashed rounded-2xl p-4 animate-pulse mb-4 transition-colors duration-500">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-600 border-4 border-white dark:border-slate-800 ring-4 ring-slate-100 dark:ring-slate-700"></div>
                <div className="h-3 w-24 bg-slate-200 dark:bg-slate-600 rounded mt-2"></div>
                <div className="h-2 w-32 bg-slate-100 dark:bg-slate-600/50 rounded"></div>
                <div className="h-7 w-28 bg-slate-200 dark:bg-slate-600 rounded-full mt-1"></div>
              </div>
            </div>

            {/* Skeleton Top 2 & 3 */}
            <div className="space-y-1">
              {[1, 2].map((i) => (
                <div key={i} className="flex justify-between items-center px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 animate-pulse transition-colors duration-500">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600"></div>
                    <div className="h-2 w-20 bg-slate-200 dark:bg-slate-600 rounded"></div>
                  </div>
                  <div className="h-2 w-8 bg-slate-200 dark:bg-slate-600 rounded"></div>
                </div>
              ))}
              <div className="text-center py-4 opacity-30 italic text-[10px] text-slate-400 dark:text-slate-500">
                Menunggu pemenang pertama...
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Top 1 Special Card */}
            {data[0] && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gradient-to-br from-yellow-50 dark:from-yellow-900/40 to-white dark:to-slate-800 border-2 border-neon-yellow/50 rounded-2xl p-4 shadow-md relative overflow-hidden mb-4 transition-colors duration-500"
              >
                <div className="absolute -right-4 -top-4 opacity-50 rotate-12">
                  <span className="text-6xl">👑</span>
                </div>
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <div className="relative">
                    {data[0].profilePictureUrl ? (
                      <img src={data[0].profilePictureUrl} alt={data[0].nickname} className="w-16 h-16 rounded-full border-4 border-white dark:border-slate-800 ring-4 ring-neon-yellow shadow-xl object-cover transition-colors duration-500" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xl font-bold border-4 border-white dark:border-slate-800 ring-4 ring-neon-yellow transition-colors duration-500">
                        {data[0].nickname?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[150px] transition-colors duration-500">@{data[0].nickname}</div>
                    <div className="text-[10px] font-bold text-neon-purple uppercase tracking-widest mt-0.5">PEMAIN TERATAS 👑</div>
                  </div>
                  <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-1 rounded-full text-sm font-black shadow-lg transition-colors duration-500">
                    {data[0].wins} Kemenangan
                  </div>
                </div>
              </motion.div>
            )}

            {/* Rest of the list */}
            <div className="space-y-1 mt-2">
              {data.slice(1, 7).map((player, i) => {
                const rank = i + 2;
                const isSilver = rank === 2;
                const isBronze = rank === 3;

                return (
                  <motion.div
                    key={player.userId}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={clsx(
                      "flex justify-between items-center px-3 py-2 rounded-xl border transition-all duration-500",
                      isSilver ? "bg-slate-50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-500 shadow-sm" : 
                      isBronze ? "bg-orange-50/30 dark:bg-orange-900/20 border-orange-200/50 dark:border-orange-500/30" : 
                      "bg-transparent border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        {player.profilePictureUrl ? (
                          <img src={player.profilePictureUrl} alt={player.nickname} className={clsx(
                            "rounded-full object-cover transition-colors duration-500",
                            isSilver || isBronze ? "w-8 h-8 border-2" : "w-6 h-6 border",
                            isSilver ? "border-slate-300 dark:border-slate-500" : isBronze ? "border-orange-300 dark:border-orange-500/50" : "border-slate-200 dark:border-slate-600"
                          )} referrerPolicy="no-referrer" />
                        ) : (
                          <div className={clsx(
                            "rounded-full flex items-center justify-center font-bold transition-colors duration-500",
                            isSilver || isBronze ? "w-8 h-8 text-xs" : "w-6 h-6 text-[8px]",
                            isSilver ? "bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300" :
                            isBronze ? "bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400" :
                            "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                          )}>
                            {player.nickname?.[0]?.toUpperCase() || "?"}
                          </div>
                        )}
                        <div className={clsx(
                          "absolute -top-1 -left-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black shadow-sm transition-colors duration-500",
                          isSilver ? "bg-slate-400 dark:bg-slate-500 text-white" : 
                          isBronze ? "bg-orange-400 text-white" : 
                          "bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300"
                        )}>
                          {rank}
                        </div>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className={clsx(
                          "font-bold truncate transition-colors duration-500",
                          isSilver ? "text-sm text-slate-800 dark:text-slate-200" : 
                          isBronze ? "text-sm text-slate-700 dark:text-slate-300" : 
                          "text-xs text-slate-500 dark:text-slate-400"
                        )}>
                          @{player.nickname}
                          {isSilver && " 🥈"}
                          {isBronze && " 🥉"}
                        </span>
                      </div>
                    </div>
                    <span className={clsx(
                      "font-black transition-colors duration-500",
                      isSilver ? "text-slate-600 dark:text-slate-400" : 
                      isBronze ? "text-orange-600 dark:text-orange-400" : 
                      "text-slate-400 dark:text-slate-500 text-xs"
                    )}>{player.wins}🔥</span>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
