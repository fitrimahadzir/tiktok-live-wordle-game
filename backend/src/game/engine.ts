import { GameStatus, Winner, LeaderboardEntry, SerializedLeaderboardEntry, GameState, Guess, LetterResult, HypeInfo, ViewerGuessInfo } from "../types.js";
import { WAIT_TIME, TARGET_LEVELS, checkGuess, getWordForCategory, getRandomCategory } from "../config.js";

export type StateChangeCallback = (state: GameState) => void;
export type HypeUpdateCallback = (hype: HypeInfo) => void;
export type NewGuessCallback = (guess: Guess) => void;

export class GameEngine {
  private word = "";
  private currentCategory = "";
  private roundNumber = 0;
  private gameStatus: GameStatus = "waiting";
  private winner: Winner | null = null;
  private guesses: Guess[] = [];
  private leaderboard: Record<string, LeaderboardEntry> = {};
  private spamCooldowns: Record<string, number> = {};
  private viewerGuesses: Record<string, ViewerGuessInfo> = {};
  private skipVotes: Set<string> = new Set();
  private tiktokUsername = "";
  private hypeInfo: HypeInfo = { current: 0, target: TARGET_LEVELS[0] };
  private lastLikeCount = 0;
  private onStateChange: StateChangeCallback;
  private onHypeUpdate: HypeUpdateCallback;
  private onNewGuess: NewGuessCallback;

  constructor(onStateChange: StateChangeCallback, onHypeUpdate?: HypeUpdateCallback, onNewGuess?: NewGuessCallback) {
    this.onStateChange = onStateChange;
    this.onHypeUpdate = onHypeUpdate || (() => {});
    this.onNewGuess = onNewGuess || (() => {});
  }

  getState(): GameState {
    return {
      word: this.word,
      wordLength: this.word.length,
      roundNumber: this.roundNumber,
      gameStatus: this.gameStatus,
      winner: this.winner,
      guesses: this.guesses,
      leaderboard: Object.entries(this.leaderboard)
        .map(([userId, data]) => ({ userId, ...data }))
        .sort((a, b) => b.wins - a.wins)
        .slice(0, 7),
      tiktokUsername: this.tiktokUsername,
      currentCategory: this.currentCategory,
      hypeInfo: this.hypeInfo,
    };
  }

  private broadcast() {
    this.onStateChange(this.getState());
  }

  startNewGame() {
    this.roundNumber = 1;
    this.generateNewWord();
  }

  setTiktokUsername(username: string) {
    this.tiktokUsername = username;
    this.broadcast();
  }

  setCategory(category: string) {
    this.generateNewWord(category);
  }

  getHypeInfo(): HypeInfo {
    return { ...this.hypeInfo };
  }

  private generateNewWord(forcedCategory?: string) {
    if (forcedCategory) {
      this.currentCategory = forcedCategory;
    } else {
      this.currentCategory = getRandomCategory(this.currentCategory);
    }

    this.word = getWordForCategory(this.currentCategory);
    this.gameStatus = "playing";
    this.winner = null;
    this.guesses = [];
    this.viewerGuesses = {};
    this.skipVotes.clear();
    this.broadcast();
    console.log(
      `Pusingan #${this.roundNumber}: Teka perkataan "${this.word}" (${this.word.length} huruf) [${this.currentCategory}]`
    );
  }

  private updateHypeTarget() {
    for (const target of TARGET_LEVELS) {
      if (this.hypeInfo.current < target) {
        this.hypeInfo.target = target;
        return;
      }
    }
    this.hypeInfo.target = TARGET_LEVELS[TARGET_LEVELS.length - 1];
  }

  handleLike(delta: number) {
    if (delta <= 0) return;
    this.hypeInfo.current += delta;
    this.updateHypeTarget();
    this.onHypeUpdate(this.getHypeInfo());
  }

  handleGuess(
    uniqueId: string,
    nickname: string,
    profilePictureUrl: string,
    text: string
  ) {
    if (this.gameStatus !== "playing") return;

    const now = Date.now();
    if (this.spamCooldowns[uniqueId] && now - this.spamCooldowns[uniqueId] < 2000) return;
    this.spamCooldowns[uniqueId] = now;

    const guess = text.trim().toUpperCase();

    if (guess === "NEXT" || guess === "SKIP") {
      this.skipVotes.add(uniqueId);
      if (this.skipVotes.size >= 5) {
        this.skipRound();
      }
      return;
    }

    if (guess.length !== this.word.length || !/^[A-Z]+$/.test(guess)) return;

    if (!this.viewerGuesses[uniqueId]) {
      this.viewerGuesses[uniqueId] = { count: 0, maxGuesses: 99999 };
    }

    if (this.viewerGuesses[uniqueId].count >= this.viewerGuesses[uniqueId].maxGuesses) return;

    if (this.guesses.some((g) => g.word === guess && g.uniqueId === uniqueId)) return;

    this.viewerGuesses[uniqueId].count++;

    const result = checkGuess(guess, this.word);

    const guessEntry: Guess = {
      word: guess,
      result,
      uniqueId,
      nickname,
      profilePictureUrl,
      currentGuess: this.viewerGuesses[uniqueId].count,
      maxGuesses: this.viewerGuesses[uniqueId].maxGuesses,
    };
    this.guesses.push(guessEntry);
    this.onNewGuess(guessEntry);

    if (guess === this.word) {
      this.gameStatus = "won";
      this.winner = { uniqueId, nickname, profilePictureUrl };

      if (!this.leaderboard[uniqueId]) {
        this.leaderboard[uniqueId] = {
          wins: 0,
          streak: 0,
          lastWin: 0,
          nickname,
          profilePictureUrl,
        };
      }
      this.leaderboard[uniqueId].wins += 1;
      this.leaderboard[uniqueId].streak += 1;
      this.leaderboard[uniqueId].lastWin = now;
      this.leaderboard[uniqueId].nickname = nickname;
      this.leaderboard[uniqueId].profilePictureUrl = profilePictureUrl;

      this.broadcast();

      setTimeout(() => {
        this.roundNumber++;
        this.generateNewWord();
      }, WAIT_TIME * 1000);
    } else {
      this.broadcast();
    }
  }

  handleGift(uniqueId: string, giftName: string) {
    if (!this.viewerGuesses[uniqueId]) {
      this.viewerGuesses[uniqueId] = { count: 0, maxGuesses: 99999 };
    }

    if (giftName && giftName.toLowerCase().includes("heart")) {
      this.viewerGuesses[uniqueId].maxGuesses = 99999;
    }
  }

  skipRound() {
    this.roundNumber++;
    this.generateNewWord();
  }

  resetGame() {
    this.roundNumber = 1;
    this.leaderboard = {};
    this.hypeInfo = { current: 0, target: TARGET_LEVELS[0] };
    this.lastLikeCount = 0;
    this.generateNewWord();
  }

  simulateCorrect() {
    const uid = "pro_player_" + Math.floor(Math.random() * 100);
    this.handleGuess(
      uid,
      "Pro Player",
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`,
      this.word
    );
  }

  simulateLike(count: number) {
    this.handleLike(count);
  }

  setLastLikeCount(count: number) {
    this.lastLikeCount = count;
  }

  getLastLikeCount(): number {
    return this.lastLikeCount;
  }

  simulateTopPlayer() {
    const isFitri = Math.random() > 0.5;
    const dummyNum = Math.floor(Math.random() * 1000);
    const dummyUid = isFitri ? "fitrimahadzir" : "dummy_pro_" + dummyNum;
    this.leaderboard[dummyUid] = {
      wins: Math.floor(Math.random() * 50) + 10,
      streak: Math.floor(Math.random() * 5) + 1,
      lastWin: Date.now(),
      nickname: isFitri ? "fitrimahadzir" : `DummyPro${dummyNum}`,
      profilePictureUrl: isFitri
        ? "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${dummyUid}`,
    };
    this.broadcast();
  }
}
