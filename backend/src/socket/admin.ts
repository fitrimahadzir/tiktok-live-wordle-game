import { Server } from "socket.io";
import { GameEngine } from "../game/engine.js";
import { AdminAction } from "../types.js";

export function handleAdminAction(
  io: Server,
  gameEngine: GameEngine,
  action: AdminAction,
  roomId?: string
) {
  switch (action.type) {
    case "skip":
      gameEngine.skipRound();
      break;

    case "reset":
      gameEngine.resetGame();
      break;

    case "category":
      if (action.category) {
        gameEngine.setCategory(action.category);
      }
      break;

    case "simulateChat":
      gameEngine.handleGuess(
        action.uniqueId || "dev_user",
        action.nickname || "Developer",
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${action.uniqueId || "dev_user"}`,
        action.comment || ""
      );
      break;

    case "simulateCorrect":
      gameEngine.simulateCorrect();
      break;

    case "simulateLike":
      gameEngine.simulateLike(action.count || 20);
      break;

    case "simulateGift":
      gameEngine.handleGift(
        action.uniqueId || "dev_user",
        action.giftName || "Heart"
      );
      io.to(roomId || "").emit("notification", {
        type: action.giftName?.toLowerCase().includes("heart") ? "powerup" : "gift",
        data: {
          uniqueId: action.uniqueId || "dev_user",
          nickname: action.nickname || "Developer",
          giftName: action.giftName || "Heart",
          profilePictureUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${action.uniqueId || "dev_user"}`,
        },
      });
      break;

    case "simulateTopPlayer":
      gameEngine.simulateTopPlayer();
      break;
  }
}
