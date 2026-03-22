"use client";

import { useRoom } from "@/app/hooks/useRoom";
import axios from "axios";
import { useState } from "react";

export default function AddSong({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) {
  const { addSong } = useRoom();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAddSong() {
    if (!url.trim()) return;
    try {
      setLoading(true);
      const { data } = await axios.post("/api/songs", { url, roomId });
      addSong({
        id: data.song.id,
        title: data.song.title,
        url,
        youtubeId: data.song.extractedId,
        addedBy: userId,
        addedAt: Date.now(),
        votes: 0,
        userVote: null,
      });

      setUrl("");
    } catch (error) {
      console.error("err while adding song", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2 pt-2 pb-1 border-t border-[#E8A030]/10">
      <input
        type="text"
        placeholder="Paste a YouTube link..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAddSong()}
        className="
                    flex-1 bg-[#161310] border border-[#E8A030]/10
                    rounded-xl px-4 py-[10px]
                    font-mono text-[13px] text-[#F5EDD8] placeholder:text-[#4A4038]
                    outline-none focus:border-[#E8A030]/30
                    transition-colors
                "
      />
      <button
        onClick={handleAddSong}
        disabled={loading}
        className="
                    shrink-0 bg-[#E8A030]/[0.10] hover:bg-[#E8A030]/[0.18]
                    border border-[#E8A030]/20
                    text-[#C8892A] font-sans font-medium text-[13px]
                    px-5 py-[10px] rounded-xl
                    transition-colors disabled:opacity-40 disabled:cursor-not-allowed
                    cursor-pointer
                "
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full border border-[#C8892A]/40 border-t-[#C8892A] animate-spin" />
            Adding
          </span>
        ) : (
          "+ Add"
        )}
      </button>
    </div>
  );
}
