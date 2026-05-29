export type GameStatus = "waiting" | "playing" | "won";

export interface Winner {
  uniqueId: string;
  nickname: string;
  profilePictureUrl: string;
}

export interface LeaderboardEntry {
  wins: number;
  streak: number;
  lastWin: number;
  nickname?: string;
  profilePictureUrl?: string;
}

export interface SerializedLeaderboardEntry {
  userId: string;
  wins: number;
  streak: number;
  lastWin: number;
  nickname?: string;
  profilePictureUrl?: string;
}

export interface LetterResult {
  letter: string;
  status: "correct" | "wrong-position" | "wrong";
}

export interface Guess {
  word: string;
  result: LetterResult[];
  uniqueId: string;
  nickname: string;
  profilePictureUrl: string;
  currentGuess?: number;
  maxGuesses?: number;
}

export interface HypeInfo {
  current: number;
  target: number;
}

export interface ViewerGuessInfo {
  count: number;
  maxGuesses: number;
}

export interface GameState {
  word: string;
  wordLength: number;
  roundNumber: number;
  gameStatus: GameStatus;
  winner: Winner | null;
  guesses: Guess[];
  leaderboard: SerializedLeaderboardEntry[];
  tiktokUsername: string;
  currentCategory: string;
  hypeInfo: HypeInfo;
}

export interface TikTokStatus {
  status: "disconnected" | "connecting" | "connected" | "error";
  roomId?: string;
  message?: string;
}

export interface Notification {
  type: "gift" | "like" | "follow" | "powerup";
  data: Record<string, any>;
}

export interface AdminAction {
  type: string;
  uniqueId?: string;
  nickname?: string;
  comment?: string;
  giftName?: string;
  count?: number;
  category?: string;
}
