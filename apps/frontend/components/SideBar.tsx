"use client"

import { useRoom } from "@/app/hooks/useRoom"
import { useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"




export function SideBar({ roomId, isHost }: {
    roomId: string,
    isHost: boolean
}) {
    const { listners } = useRoom();
    const [copied, setCopied] = useState(false);
    const router = useRouter();
    const shareLink = `${window.location.origin}/dashboard/${roomId}`

    async function createRoomHandler() {
        try {
            const { data } = await axios.post("/api/rooms");
            router.push(`/dashboard/${data.roomId}`)
        } catch (error) {
            console.error("Failed to create room:", error);
        }
    }

    function copyHandler() {
        navigator.clipboard.writeText(shareLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500);
    }



    return (
        <div className="border-l border-white/10 flex flex-col h-full p-3">
            {/* Tab switcher */}
            <Tabs defaultValue="room" className="w-full">
                <TabsList className="w-full">
                    <TabsTrigger value="room" className="flex-1">Room</TabsTrigger>
                    <TabsTrigger value="listners" className="flex-1">Listeners</TabsTrigger>
                </TabsList>
                {/* Room Tab */}
                <TabsContent value="room" className="flex flex-col gap-3 mt-3">
                    <Button onClick={createRoomHandler} className="w-full">
                        Create Room
                    </Button>
                    <div className="flex items-center gap-2 bg-white/5 rounded-lg p-2">
                        <span className="text-xs text-cyan-400 flex-1 truncate">
                            {shareLink}
                        </span>
                        <Button variant="outline" size="sm" onClick={copyHandler}>
                            {copied ? "Copied!" : "Copy"}
                        </Button>
                    </div>
                </TabsContent>

                {/* Listeners Tab */}
                <TabsContent value="listners" className="mt-3">
                    {listners.map((listner) => (
                        <div key={listner.userId}>
                            <div className="w-8 h-8 rounded-full bg-cyan-400/20 text-cyan-400 flex items-center justify-center text-xs font-bold">
                                {listner.userName.substring(0, 2).toUpperCase()}
                            </div>
                            {/* Username */}
                            <span className="text-sm flex-1">
                                @{listner.userName}
                            </span>
                            {/* Host badge */}
                            {listner.userId === roomId && (
                                <span className="text-xs border border-yellow-400/30 text-yellow-400 px-1 rounded">
                                    HOST
                                </span>
                            )}
                            {/* Empty state */}
                            {listners.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    No listeners yet
                                </p>
                            )}
                        </div>
                    ))}
                </TabsContent>
            </Tabs>





            {/* Tab content */}
            {/* Listeners list */}
            {/* Activity feed */}
        </div>
    )
}