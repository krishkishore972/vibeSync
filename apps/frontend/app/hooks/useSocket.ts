import { useCallback, useEffect, useRef } from "react";
import type { ServerMessage } from "@repo/types";

export function useSocket(
  url: string | null,
  onMessage: (msg: ServerMessage) => void,
  onOpen?: () => void,
) {
  const wsRef = useRef<WebSocket | null>(null);
  const onMessageRef = useRef(onMessage);
  const onOpenRef = useRef(onOpen);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    onOpenRef.current = onOpen;
  }, [onOpen]);

  useEffect(() => {
    if (!url) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      return;
    }

    let reconnectTimer: NodeJS.Timeout | null = null;
    let isMounted = true;

    const connect = () => {
      if (!isMounted) return;

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
        onOpenRef.current?.();
      };

      ws.onclose = () => {
        if (isMounted) {
          console.log("WebSocket disconnected, reconnecting in 3s...");
          reconnectTimer = setTimeout(connect, 3000);
        }
      };

      ws.onerror = (err) => {
        console.log("WebSocket error:", err);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (
            msg.type === "queue-updated" ||
            msg.type === "song-changed" ||
            msg.type === "room-joined"
          ) {
            console.log(`[WS] ${msg.type}:`, {
              queueLength: msg.queue?.length,
              queue: msg.queue,
            });
          }
          onMessageRef.current(msg);
        } catch (error) {
          console.log("Invalid msg", error);
        }
      };
    };

    connect();

    return () => {
      isMounted = false;
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [url]);

  const send = useCallback((payload: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
  }, []);

  return { send };
}
