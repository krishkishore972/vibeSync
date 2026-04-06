import { useCallback, useEffect, useRef } from "react";
import type { ServerMessage } from "@repo/types";

export function useSocket(
  url: string | null,
  onMessage: (msg: ServerMessage) => void,
  onOpen?: () => void,
) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!url) return;

    let reconnectTimer: NodeJS.Timeout;
    let isMounted = true;

    // Connect to WebSocket server
    const connect = () => {
      if (!isMounted) return;

      // Create WebSocket connection
      const ws = new WebSocket(url);
      wsRef.current = ws;

      // Log successful connection and call onOpen callback
      ws.onopen = () => {
        console.log("WebSocket connected");
        onOpen?.();
      };
      ws.onclose = () => {
        console.log("WebSocket disconnected, reconnecting in 3s...");
        reconnectTimer = setTimeout(connect, 3000);
      };

      // Handle incoming messages
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          onMessage(msg);
        } catch (error) {
          console.log("Invalid msg", error);
        }
      };

      // Log WebSocket errors
      ws.onerror = (err) => console.log("webSocket err", err);
      return () => {
        ws.close();
      };
    };
    connect();

    // Cleanup on unmount
    return () => {
      isMounted = false;
      clearTimeout(reconnectTimer);
      wsRef.current?.close();
    };
  }, [url]);

  // Function to send messages to the WebSocket server
  const send = useCallback((payload: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
  }, []);
  return {
    send,
  };
}
