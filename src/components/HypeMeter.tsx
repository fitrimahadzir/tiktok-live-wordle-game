import { motion } from "motion/react";
import { Heart } from "lucide-react";

export default function HypeMeter({ hypeInfo }: { hypeInfo: { current: number, target: number } }) {
  const percentage = Math.min(100, Math.round((hypeInfo.current / hypeInfo.target) * 100)) || 0;

  return (
    <div className="bg-neutral-dark/20 border border-neutral-dark rounded-xl p-4">
      <div className="flex justify-between text-[10px] uppercase mb-2 tracking-widest font-bold">
        <span>Target Like</span>
        <span className="text-neon-cyan">{hypeInfo.current.toLocaleString()} / {hypeInfo.target.toLocaleString()}</span>
      </div>
      <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          id="hype-progress"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className="h-full bg-gradient-to-r from-neon-purple to-neon-cyan shadow-[0_0_10px_#22D3EE]"
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
        />
      </div>
      <p className="text-[10px] text-gray-400 mt-2 text-center uppercase tracking-tighter italic font-bold">🚀 SPAM TAP SKRIN SEKARANG!</p>
    </div>
  );
}
