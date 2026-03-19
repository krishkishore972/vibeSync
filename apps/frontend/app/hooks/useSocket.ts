import { useCallback, useEffect, useRef } from "react";

export function useSocket(url: string|null, onMessage: (msg: any) => void) {
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if(!url) return;
        const ws = new WebSocket(url);
        wsRef.current = ws;
        ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                onMessage(msg)
            } catch (error) {
                console.log("Invalid msg",error);
            }
        }
        ws.onerror = (err) => console.log("webSocket err",err);
        return () => {
            ws.close()
        }
    },[url])

    const send = useCallback((payload:object) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(payload));
        }
    },[])

        return {
            send
        }
}
