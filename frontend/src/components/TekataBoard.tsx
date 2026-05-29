import { motion } from "motion/react";
import { clsx } from "clsx";

function isGreen(status: string) {
  return status === "green" || status === "correct";
}
function isYellow(status: string) {
  return status === "yellow" || status === "wrong-position";
}
function isGrey(status: string) {
  return status === "grey" || status === "wrong";
}
function isCorrectGuess(status: string) {
  return isGreen(status) || isYellow(status) || isGrey(status);
}

export default function TekataBoard({
  guesses,
  wordLength = 5,
  category,
}: {
  guesses: any[];
  wordLength?: number;
  category?: string;
}) {
  const visibleGuesses = [...guesses].reverse().slice(0, 4);
  const rows = [...visibleGuesses];
  while (rows.length < 4) {
    rows.push({
      word: " ".repeat(wordLength),
      result: Array(wordLength).fill("empty"),
    });
  }

  const discoveredHints = Array(wordLength).fill(" ");
  guesses.forEach((guess) => {
    if (!guess.result || !guess.word) return;
    guess.result.forEach((res: any, index: number) => {
      if (isGreen(res.status || res) && guess.word[index]) {
        discoveredHints[index] = guess.word[index];
      }
    });
  });

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Hints Discovered Section */}
      <div className="bg-[#b8c5d6] dark:bg-slate-700/50 border-2 border-slate-400 dark:border-slate-600 rounded-2xl px-6 pb-6 pt-8 flex flex-col items-center relative w-full shadow-md transition-colors duration-500">
        <div className="text-sm font-black tracking-[0.2em] text-slate-800 uppercase absolute -top-4 bg-neon-yellow border-2 border-slate-900 px-4 py-1 shadow-md rounded-lg">
          Huruf Telah Ditemui
        </div>
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${wordLength}, minmax(0, 1fr))`,
          }}
        >
          {discoveredHints.map((char, i) => {
            const isFound = char !== " ";
            return (
              <div
                key={`hint-${i}`}
                className={clsx(
                  "w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-black uppercase transition-all duration-500",
                  isFound
                    ? "bg-neon-green text-white shadow-[0_6px_0_#16A34A] border-2 border-white/20"
                    : "border-2 border-dashed border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                )}
              >
                {char !== " " && char}
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Badge */}
      {category && (
        <div className="flex items-center justify-center gap-2 w-full">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border-2 border-neon-cyan/40 rounded-xl px-6 py-2 shadow-md transition-colors duration-500">
            <span className="text-[25px] font-black tracking-[0.2em] text-neon-cyan uppercase">
              HINT:
            </span>
            <span className="text-[25px] font-black uppercase tracking-wide text-slate-800 dark:text-white transition-colors duration-500">
              {category}
            </span>
          </div>
        </div>
      )}

      {/* Guess Rows */}
      <div className="flex flex-col gap-2">
        {rows.map((row, i) => (
          <div key={i} className="flex gap-2 items-center">
            {/* Profile Picture */}
            <div className="w-14 h-14 shrink-0">
              {row.profilePictureUrl && row.word.trim() !== "" ? (
                <img
                  src={row.profilePictureUrl}
                  alt=""
                  className="w-14 h-14 rounded-full border-2 border-white dark:border-slate-800 ring-2 ring-slate-200 dark:ring-slate-700 object-cover shadow-md transition-colors duration-500"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 transition-colors duration-500" />
              )}
            </div>

            {/* Letter Boxes */}
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${wordLength}, minmax(0, 1fr))`,
              }}
            >
              {row.word.padEnd(wordLength, " ").split("").map((char: string, j: number) => {
                const status = row.result[j];
                const isEmpty = char === " ";
                const green = isGreen(status);
                const yellow = isYellow(status);
                const grey = isGrey(status);
                const hasResult = isCorrectGuess(status);

                return (
                  <motion.div
                    key={`${i}-${j}`}
                    initial={{ rotateX: 0 }}
                    animate={{
                      rotateX: hasResult ? 360 : 0,
                    }}
                    transition={{ duration: 0.5, delay: j * 0.1 }}
                    className={clsx(
                      "w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-black uppercase transition-all duration-500 shadow-md",
                      isEmpty &&
                        "border-2 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white",
                      !isEmpty &&
                        !green &&
                        !yellow &&
                        !grey &&
                        "border-2 border-slate-400 dark:border-slate-600 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-300",
                      green &&
                        "bg-neon-green text-white shadow-[0_6px_0_#16A34A] border-2 border-white/20",
                      yellow &&
                        "bg-neon-yellow text-white shadow-[0_6px_0_#CA8A04] border-2 border-white/20",
                      grey &&
                        "bg-slate-500 text-white border-2 border-slate-600"
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
