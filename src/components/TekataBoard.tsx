import { motion } from "motion/react";
import { clsx } from "clsx";

export default function TekataBoard({ guesses, wordLength = 5 }: { guesses: any[], wordLength?: number }) {
  const visibleGuesses = guesses.slice(-5);
  // Pad with empty rows if less than 5
  const rows = [...visibleGuesses];
  while (rows.length < 5) {
    rows.push({ word: " ".repeat(wordLength), result: Array(wordLength).fill("empty") });
  }

  // Calculate discovered hints from all guesses
  const discoveredHints = Array(wordLength).fill(" ");
  guesses.forEach((guess) => {
    if (!guess.result || !guess.word) return;
    guess.result.forEach((res: string, index: number) => {
      if (res === "green" && guess.word[index]) {
        discoveredHints[index] = guess.word[index];
      }
    });
  });

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Hints Discovered Section */}
      <div className="bg-[#374151]/20 border border-[#374151] rounded-2xl px-4 pb-4 pt-6 flex flex-col items-center relative w-full">
        <div className="text-[10px] font-black tracking-[0.2em] text-[#FACC15] uppercase absolute -top-2 bg-[#1F2937] px-2 shadow-sm rounded-sm">
          Huruf Telah Ditemui
        </div>
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${wordLength}, minmax(0, 1fr))` }}>
          {discoveredHints.map((char, i) => {
              const isFound = char !== " ";
              return (
                <div
                  key={`hint-${i}`}
                  className={clsx(
                    "w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-black uppercase transition-all duration-500",
                    isFound
                      ? "bg-[#22C55E] text-white shadow-[0_4px_0_rgba(22,163,74,1)] border-b border-[#16a34a]"
                      : "border-2 border-dashed border-[#4B5563] bg-[#111827]/50"
                )}
              >
                {char !== " " && char}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {rows.map((row, i) => (
          <div key={i} className="flex gap-2 items-center">
            {/* Profile Picture Placeholder or Actual */}
            <div className="w-14 h-14 shrink-0">
              {row.profilePictureUrl && row.word.trim() !== "" ? (
                <img src={row.profilePictureUrl} alt="" className="w-14 h-14 rounded-xl border-2 border-[#374151] object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-[#111827]/40 border-2 border-dashed border-[#374151]"></div>
              )}
            </div>
            
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${wordLength}, minmax(0, 1fr))` }}>
              {row.word.padEnd(wordLength, " ").split("").map((char: string, j: number) => {
                const isEmpty = char === " ";
                const isGreen = row.result[j] === "green";
                const isYellow = row.result[j] === "yellow";
                const isGrey = row.result[j] === "grey";

                return (
                  <motion.div
                    key={`${i}-${j}`}
                    initial={{ rotateX: 0 }}
                    animate={{ 
                      rotateX: row.result[j] !== "empty" && row.result[j] !== undefined ? 360 : 0
                    }}
                    transition={{ duration: 0.5, delay: j * 0.1 }}
                    className={clsx(
                      "w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-black uppercase transition-all duration-500",
                    isEmpty && "border-2 border-[#374151] bg-[#374151]/20",
                    (!isEmpty && !isGreen && !isYellow && !isGrey) && "border-2 border-[#374151] bg-[#374151]/40 text-white",
                    isGreen && "border-2 border-[#22C55E] bg-[#22C55E]/20 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]",
                    isYellow && "border-2 border-[#FACC15] bg-[#FACC15]/20 text-white shadow-[0_0_15px_rgba(250,204,21,0.4)]",
                    isGrey && "border-2 border-[#374151] bg-[#374151]/40 text-gray-400"
                  )}
                >
                  {char !== " " && char}
                </motion.div>
              );
            })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
