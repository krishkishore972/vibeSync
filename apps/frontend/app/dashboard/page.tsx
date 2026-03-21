"use client"

import { Button } from "@/components/ui/button"
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export default function DashBoard() {
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        }
    }, [status])


    const [roomId, setRoomId] = useState("");

    async function createRoomHandler() {
        try {
            const { data } = await axios.post("/api/rooms");
            router.push(`/dashboard/${data.roomId}`)
        } catch (error) {
            console.error("err in dashBoard while creating room", error)
        }
    }

    function joinRoomHandler(roomId: string) {
        if (!roomId) {
            return
        }
        router.push(`/dashboard/${roomId}`)
        setRoomId("")
    }

    if (status === "loading") return (
        <div className="flex items-center justify-center min-h-screen bg-[#0A0A0F] text-white/30">
            Loading...
        </div>
    );
    return (
        <div>
            <Button onClick={createRoomHandler}>
                createRoom
            </Button>
            <span>
                or
            </span>
            <input type="text"
                placeholder="RoomId"
                value={roomId}
                onChange={(e) => { setRoomId(e.target.value) }}
            />
            <Button onClick={() => { joinRoomHandler(roomId) }}>
                join Room
            </Button>
        </div>
    )
}