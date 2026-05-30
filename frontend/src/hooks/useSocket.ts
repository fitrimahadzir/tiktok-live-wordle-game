import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const SESSION_KEY = "odd-hunt-session-id";

function getOrCreateSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export const useSocket = () => {
  const [sessionId] = useState(getOrCreateSessionId);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<any>(null);
  const [tiktokStatus, setTiktokStatus] = useState<any>({
    status: "disconnected",
  });
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const newSocket = io(BACKEND_URL, {
      auth: { sessionId },
    });
    setSocket(newSocket);

    newSocket.on("gameState", (state) => {
      setGameState(state);
    });

    newSocket.on("hypeUpdate", (hypeInfo) => {
      setGameState((prev: any) => (prev ? { ...prev, hypeInfo } : prev));
    });

    newSocket.on("newGuess", (guess: any) => {
      setGameState((prev: any) =>
        prev ? { ...prev, guesses: [...prev.guesses, guess] } : prev
      );
    });

    newSocket.on("tiktokStatus", (status) => {
      setTiktokStatus(status);
    });

    newSocket.on("notification", (notif) => {
      setNotifications((prev) => [...prev.slice(-4), notif]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n !== notif));
      }, 5000);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [sessionId]);

  const connectTiktok = useCallback(
    (username: string) => {
      socket?.emit("connectTiktok", username);
    },
    [socket]
  );

  const adminAction = useCallback(
    (action: any) => {
      socket?.emit("adminAction", action);
    },
    [socket]
  );

  return {
    socket,
    sessionId,
    gameState,
    tiktokStatus,
    notifications,
    connectTiktok,
    adminAction,
  };
};
