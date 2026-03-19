"use client"

import { useRoom } from "@/app/hooks/useRoom";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function Queue({ roomId }: { roomId: string }) {
    const { queue, voteSong } = useRoom()

    return (
        <div className="p-4">
            {/* header */}
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs tracking-widest text-white/40">UP NEXT</span>
                <span className="text-xs text-pink-400">{queue.length} tracks</span>
            </div>

            <ScrollArea className="h-[280px]">
                {queue.length === 0 && (
                    <p className="text-center text-white/30 text-sm py-8">
                        No songs in queue yet
                    </p>
                )}
                {queue.map((song, index) => (
                    <div key={song.id}>
                        <div className="flex items-center gap-3 p-3">
                            {/* rank */}
                            <div className="flex flex-col items-center w-8">
                                {index === 0
                                    ? <Badge className="bg-cyan-400/10 text-cyan-400 border-cyan-400/20 text-xs">TOP</Badge>
                                    : <span className="text-white/20 text-lg font-bold">{index + 1}</span>
                                }
                            </div>

                            {/* song info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{song.title}</p>
                                <p className="text-xs text-white/40">@{song.addedBy}</p>
                            </div>

                            {/* vote buttons */}
                            <div className="flex flex-col items-center gap-1">
                                <button
                                    className={`border rounded px-1 text-xs transition-colors ${song.userVote === "up" ? "text-cyan-400 border-cyan-400 bg-cyan-400/10" : "text-white/30 border-white/10 hover:border-cyan-400 hover:text-cyan-400"}`}
                                    onClick={() => voteSong(song.id, "up")}
                                >
                                    ▲
                                </button>
                                <span className="text-xs font-medium">{song.votes}</span>
                                <button
                                    className={`border rounded px-1 text-xs transition-colors ${song.userVote === "down" ? "text-pink-400 border-pink-400 bg-pink-400/10" : "text-white/30 border-white/10 hover:border-pink-400 hover:text-pink-400"}`}
                                    onClick={() => voteSong(song.id, "down")}
                                >
                                    ▼
                                </button>
                            </div>
                        </div>
                        <Separator className="bg-white/5" />
                    </div>
                ))}
            </ScrollArea>
        </div>
    );
}