"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSocket } from "@/app/hooks/useSocket";

import { Song, Listner, RoomContext } from "@/components/context/RoomContext";
import axios from "axios";


export function RoomProvider({ children, roomId, userId }: {
    children: React.ReactNode;
    roomId: string;
    userId: string
}) {
    const [queue, setQueue] = useState<Song[]>([])
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [listners, setListners] = useState<Listner[]>([]);
    const [token, setToken] = useState<string | null>(null);
    const sendRef = useRef<((payload: object) => void) | null>(null)


    useEffect(() => {
        axios.get("/api/auth/token")
            .then((res) => setToken(res.data.token))
            .catch(() => console.error("Failed to fetch token"));
    }, [])



    const handleMessage = useCallback((msg: any) => {
        switch (msg.type) {
            case "room-joined":
                setQueue(msg.queue ?? [])
                setCurrentSong(msg.currentSong ?? null)
                break;
            case "queue-updated":
                setQueue(msg.queue ?? []);
                break;
            case "song-changed":
                setCurrentSong(msg.currentSong ?? null);
                setQueue(msg.queue ?? []);
                break;
            case "user-joined":
                setListners((prev) => {
                    if (prev.some((l) => l.userId === msg.userId)) {
                        return prev
                    }
                    return [...prev,{ userId: msg.userId, userName: msg.username }]
                })
                break;
            case "user-left":
                setListners((prev) => prev.filter((user) => user.userId !== msg.userId));
                break;
            case "error":
                console.error("Server error:", msg.message);
                break;
        }
    }, [])

    const wsUrl = token ? `ws://localhost:8000?token=${token}` : null

    const { send } = useSocket(wsUrl, handleMessage, () => {
        console.log(" Sending join-room", roomId);
        sendRef.current?.({ type: "join-room", roomId, hostId: userId });
    })

    sendRef.current = send;



    function addSong(song: Song) {
        send({ type: "add-song", roomId, song });
    }

    function voteSong(songId: string, direction: "up" | "down") {
        send({ type: "vote-song", songId, direction, roomId });
    }

    function playNext() {
        send({ type: "play-next", roomId });
    }

    return (
        <RoomContext.Provider value={{ queue, currentSong, listners, addSong, voteSong, playNext }}>
            {children}
        </RoomContext.Provider>
    )

}