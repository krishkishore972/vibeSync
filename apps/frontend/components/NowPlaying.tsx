"use client"

import { useRoom } from "@/app/hooks/useRoom";

export default function NowPlaying({ isHost }: { isHost: boolean }) {
    const { currentSong, playNext } = useRoom();

    if (!currentSong) return (
        // empty state — no song playing
    )

    return (
        <div>
            {/* YouTube embed */}
            {/* Song title + addedBy */}
            {/* Play next button — only for host */}
        </div>
    )
}