"use client"

import { useRoom } from "@/app/hooks/useRoom";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Queue({ roomId }: { roomId: string }) {
    const { queue, voteSong } = useRoom();

    return (
        <div className="flex flex-col gap-3">

            {/* Header */}
            <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.15em] text-[#4A4038] uppercase">
                    Up Next
                </span>
                <span className="font-mono text-[10px] tracking-[0.08em] text-[#C8892A]">
                    {queue.length} {queue.length === 1 ? "track" : "tracks"}
                </span>
            </div>

            {/* Empty state */}
            {queue.length === 0 && (
                <div className="flex flex-col items-center justify-center h-28 gap-2 rounded-xl border border-[#E8A030]/8 bg-[#161310]">
                    <span className="text-2xl opacity-30">♪</span>
                    <p className="font-mono text-[11px] tracking-[0.1em] text-[#4A4038] uppercase">
                        No songs in queue yet
                    </p>
                </div>
            )}

            {/* Queue list */}
            {queue.length > 0 && (
                <ScrollArea className="h-[280px] pr-1">
                    <div className="flex flex-col gap-2">
                        {queue.map((song, index) => (
                            <div
                                key={song.id}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#E8A030]/[0.07] bg-[#161310] hover:border-[#E8A030]/20 hover:bg-[#1E1A16] transition-colors group"
                            >
                                {/* Rank */}
                                <div className="w-7 flex items-center justify-center shrink-0">
                                    {index === 0 ? (
                                        <span className="font-mono text-[9px] tracking-[0.1em] text-[#C8892A] bg-[#E8A030]/10 border border-[#E8A030]/20 px-[6px] py-[3px] rounded">
                                            TOP
                                        </span>
                                    ) : (
                                        <span className="font-mono text-[13px] text-[#4A4038] group-hover:text-[#6B5F50] transition-colors">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                    )}
                                </div>

                                {/* Song info */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-serif text-[13px] font-medium text-[#C8B89A] truncate leading-snug">
                                        {song.title}
                                    </p>
                                    <p className="font-mono text-[10px] text-[#4A4038] mt-[3px]">
                                        @{song.addedBy}
                                    </p>
                                </div>

                                {/* Vote buttons */}
                                <div className="flex flex-col items-center gap-[3px] shrink-0">
                                    <button
                                        onClick={() => voteSong(song.id, "up")}
                                        className={`w-6 h-5 flex items-center justify-center rounded text-[10px] border transition-colors cursor-pointer
                                            ${song.userVote === "up"
                                                ? "text-[#C8892A] border-[#E8A030]/40 bg-[#E8A030]/10"
                                                : "text-[#4A4038] border-[#E8A030]/[0.07] hover:text-[#C8892A] hover:border-[#E8A030]/30"
                                            }`}
                                    >
                                        ▲
                                    </button>

                                    <span className={`font-mono text-[11px] font-medium tabular-nums leading-none
                                        ${song.votes > 0 ? "text-[#C8892A]" : song.votes < 0 ? "text-[#8B4A3A]" : "text-[#6B5F50]"}`}
                                    >
                                        {song.votes}
                                    </span>

                                    <button
                                        onClick={() => voteSong(song.id, "down")}
                                        className={`w-6 h-5 flex items-center justify-center rounded text-[10px] border transition-colors cursor-pointer
                                            ${song.userVote === "down"
                                                ? "text-[#8B4A3A] border-[#8B4A3A]/40 bg-[#8B4A3A]/10"
                                                : "text-[#4A4038] border-[#E8A030]/[0.07] hover:text-[#8B4A3A] hover:border-[#8B4A3A]/30"
                                            }`}
                                    >
                                        ▼
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            )}
        </div>
    );
}
