"use client"

import { useRoom } from "@/app/hooks/useRoom";
import axios from "axios";
import { useState } from "react";
import { Button } from "./ui/button";


export default function AddSong({ roomId, userId }: {
    roomId: string,
    userId: string
}) {

    const { addSong } = useRoom();
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false)

    async function handleAddSong() {
        if (!url.trim()) return;
        try {
            setLoading(true)
            const { data } = await axios.post("/api/songs", {
                url,
                roomId
            });
            const song = {
                id: data.song.id,
                title: data.song.title,
                url: url,
                youtubeId: data.song.extractedId,  
                addedBy: userId,
                addedAt: Date.now(),
                votes: 0,
                userVote: null
            }

            addSong(song);
            setUrl("")
            
        } catch (error) {
            console.error("err while adding song", error)
        } finally{
            setLoading(false)
        }
    }


    return (
    <div className="flex gap-2 p-4 border-t border-white/10">
        <input
            type="text"
            placeholder="Paste YouTube link or search..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddSong()}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan-400/50 transition-colors"
        />
        <Button
            onClick={handleAddSong}
            disabled={loading}
            className="bg-cyan-400/15 border border-cyan-400/20 text-cyan-400 hover:bg-cyan-400/25 px-4 py-2 text-sm font-medium rounded-lg transition-all disabled:opacity-50"
        >
            {loading ? "Adding..." : "+ Add"}
        </Button>
    </div>
);
}