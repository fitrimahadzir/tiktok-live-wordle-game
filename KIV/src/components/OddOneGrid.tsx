import { useMemo } from "react";
import { clsx } from "clsx";

const ALL_LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "text-neon-green border-neon-green/40",
  medium: "text-neon-yellow border-yellow-500/40",
  hard: "text-orange-400 border-orange-400/40",
  impossible: "text-red-400 border-red-400/40",
};

const DIFFICULTY_POINTS: Record<string, number> = {
  easy: 1,
  medium: 2,
  hard: 5,
  impossible: 15,
};

const MODE_COLORS: Record<string, string> = {
  LOW: "text-neon-green border-neon-green/40 bg-neon-green/10",
  MEDIUM: "text-neon-yellow border-yellow-500/40 bg-yellow-500/10",
  HIGH: "text-red-400 border-red-400/40 bg-red-400/10",
};

export default function OddOneGrid({
  grid,
  oddPosition,
  difficulty,
  roundNumber,
  gameStatus,
  gridMode,
  gridConfig,
}: {
  grid: string[][];
  oddPosition: { col: number; row: number } | null;
  difficulty: string;
  roundNumber: number;
  gameStatus: string;
  gridMode: string;
  gridConfig: { cols: number; rows: number };
}) {
  const colLabels = useMemo(
    () => ALL_LABELS.slice(0, gridConfig.cols),
    [gridConfig.cols]
  );

  const cellSize = useMemo(() => {
    const w = Math.floor((700 - 32) / (gridConfig.cols + 1));
    const h = Math.floor((460 - 30) / (gridConfig.rows + 1));
    return Math.min(w, h, gridConfig.cols > 15 ? 36 : 40);
  }, [gridConfig.cols, gridConfig.rows]);

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Header: Mode + Difficulty */}
      <div className="flex items-center gap-2 w-full max-w-[740px]">
        <div
          className={clsx(
            "flex items-center gap-1.5 px-3 py-1 rounded-xl border text-[11px] font-black uppercase tracking-widest",
            MODE_COLORS[gridMode] || "text-neon-cyan border-neon-cyan/40"
          )}
        >
          <span className={clsx(
            "w-2 h-2 rounded-full",
            gridMode === "LOW" ? "bg-neon-green" :
            gridMode === "MEDIUM" ? "bg-neon-yellow" :
            "bg-red-400"
          )} />
          MODE {gridMode}
          <span className={clsx(
            "ml-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold",
            gridMode === "LOW" ? "bg-neon-green/20 text-neon-green" :
            gridMode === "MEDIUM" ? "bg-yellow-500/20 text-neon-yellow" :
            "bg-red-400/20 text-red-400"
          )}>
            {gridConfig.cols}×{gridConfig.rows}
          </span>
        </div>

        <div className="flex-1" />

        <div
          className={clsx(
            "flex items-center gap-2 px-3 py-1 rounded-xl border text-[11px] font-black uppercase tracking-widest",
            DIFFICULTY_COLORS[difficulty] || "text-neon-cyan border-neon-cyan/40"
          )}
        >
          <span className={clsx("w-2 h-2 rounded-full", difficulty === "easy" ? "bg-neon-green" : difficulty === "medium" ? "bg-neon-yellow" : difficulty === "hard" ? "bg-orange-400" : "bg-red-400")} />
          LEVEL {difficulty}
          <span className={clsx(
            "ml-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-black",
            difficulty === "easy" ? "bg-neon-green/20 text-neon-green" :
            difficulty === "medium" ? "bg-yellow-500/20 text-neon-yellow" :
            difficulty === "hard" ? "bg-orange-400/20 text-orange-400" :
            "bg-red-400/20 text-red-400"
          )}>
            +{DIFFICULTY_POINTS[difficulty]}
          </span>
        </div>
      </div>

      {/* Grid Container */}
      <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-2 shadow-md transition-colors duration-500 overflow-hidden">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `${cellSize}px repeat(${gridConfig.cols}, ${cellSize}px)`,
            gap: "1px",
          }}
        >
          {/* Corner */}
          <div
            className="flex items-center justify-center font-bold text-[8px] text-slate-400 dark:text-slate-600 uppercase tracking-tight"
            style={{ width: cellSize, height: cellSize }}
          />

          {/* Column labels */}
          {colLabels.split("").map((label) => (
            <div
              key={`col-${label}`}
              className="flex items-center justify-center font-bold font-poppins text-xs text-neon-green uppercase"
              style={{ width: cellSize, height: cellSize }}
            >
              {label}
            </div>
          ))}

          {/* Rows */}
          {Array.from({ length: gridConfig.rows }, (_, r) => (
            <>
              {/* Row label */}
              <div
                className="flex items-center justify-center font-bold font-poppins text-xs text-neon-green"
                style={{ width: cellSize, height: cellSize }}
              >
                {r + 1}
              </div>

              {/* Cells */}
              {Array.from({ length: gridConfig.cols }, (_, c) => {
                const char = grid[r]?.[c] || " ";
                const isOdd = oddPosition?.col === c && oddPosition?.row === r;
                const showHighlight = gameStatus === "won" && isOdd;

                return (
                  <div
                    key={`${r}-${c}`}
                    className={clsx(
                      "flex items-center justify-center font-bold font-serif tracking-wide rounded-sm transition-all duration-300",
                      showHighlight
                        ? "bg-neon-green text-white shadow-[0_0_6px_rgba(22,163,74,0.6)] scale-110 z-10 relative"
                        : "bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200"
                    )}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      fontSize: Math.max(10, Math.min(cellSize - 8, 18)),
                    }}
                  >
                    {char}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 text-xs font-bold text-neon-green tracking-wider">
        <span className="text-neon-green/80">Cari huruf/nombor berbeza</span>
        <span className="text-slate-400 dark:text-slate-600">|</span>
        <span className="text-neon-green">Contoh komen</span>
        <span className="bg-neon-green/20 border border-neon-green/30 px-2 py-0.5 rounded-lg text-neon-green font-black text-xs">F5</span>
        <span className="text-slate-400 dark:text-slate-600 text-[10px]">|</span>
        <span className="bg-neon-green/20 border border-neon-green/30 px-2 py-0.5 rounded-lg text-neon-green font-black text-xs">5F</span>
        <span className="text-slate-400 dark:text-slate-600 text-[10px]">|</span>
        <span className="bg-neon-green/20 border border-neon-green/30 px-2 py-0.5 rounded-lg text-neon-green font-black text-xs">F-5</span>
        <span className="text-slate-400 dark:text-slate-600 text-[10px]">|</span>
        <span className="bg-neon-green/20 border border-neon-green/30 px-2 py-0.5 rounded-lg text-neon-green font-black text-xs">5-F</span>
      </div>
    </div>
  );
}
