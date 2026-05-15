/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { useSocket } from "./hooks/useSocket";
import Overlay from "./components/Overlay";
import Admin from "./components/Admin";
import DevTools from "./components/DevTools";
import { Settings } from "lucide-react";

export default function App() {
  const [view, setView] = useState<"overlay" | "admin">("overlay");
  const socketData = useSocket();

  // Simple route check from URL
  useEffect(() => {
    if (window.location.hash === "#admin") {
      setView("admin");
    }
  }, []);

  return (
    <div className="relative h-screen overflow-y-auto overflow-x-hidden bg-dark-bg selection:bg-neon-purple selection:text-white">
      {view === "overlay" ? (
        <Overlay {...socketData} />
      ) : (
        <Admin {...socketData} />
      )}

      {/* View Switcher Button (Only visible in dev or if not strictly overlay) */}
      <button
        id="view-switcher"
        onClick={() => setView(view === "overlay" ? "admin" : "overlay")}
        className="fixed bottom-4 right-4 p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors z-50 opacity-20 hover:opacity-100"
      >
        <Settings className="w-5 h-5 text-gray-400" />
      </button>

      <DevTools adminAction={socketData.adminAction} wordLength={socketData.gameState?.wordLength || 5} />
    </div>
  );
}
