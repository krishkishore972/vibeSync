"use client";

import { useRoom } from "@/app/hooks/useRoom";
import ReactPlayer from "react-player";

export default function NowPlaying({ isHost }: { isHost: boolean }) {
  const { currentSong, playNext } = useRoom();

  if (!currentSong)
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-3 rounded-2xl border border-[#E8A030]/10 bg-[#161310]">
        <div className="w-12 h-12 rounded-full bg-[#E8A030]/[0.08] border border-[#E8A030]/15 flex items-center justify-center text-xl">
          🎵
        </div>
        <p className="font-mono text-[11px] tracking-[0.15em] text-[#4A4038] uppercase">
          No song playing yet
        </p>
      </div>
    );

  return (
    <div className="rounded-2xl overflow-hidden border border-[#E8A030]/10 bg-[#161310]">
      {/* YouTube embed */}
      <div className="w-full bg-[#0E0C0A]">
        <ReactPlayer
          src={`https://www.youtube.com/embed/${currentSong.youtubeId}?autoplay=1`}
          title={currentSong.title}
          playing={true}
          controls={true}
          style={{ width: "100%", height: "auto", aspectRatio: "16/9" }}
          onEnded={playNext}
        />
      </div>

      {/* Song info + Play Next */}
      <div className="flex items-center justify-between px-[18px] py-[14px]">
        <div className="min-w-0 flex-1">
          <p className="font-serif text-[15px] font-medium text-[#F5EDD8] truncate">
            {currentSong.title}
          </p>
          <p className="font-mono text-[11px] text-[#6B5F50] mt-1">
            added by{" "}
            <span className="text-[#C8892A]">@{currentSong.addedBy}</span>
          </p>
        </div>

        {isHost && (
          <button
            onClick={playNext}
            className="ml-4 shrink-0 bg-[#E8A030]/[0.08] hover:bg-[#E8A030]/[0.15] border border-[#E8A030]/20 text-[#C8892A] text-[12px] tracking-[0.04em] px-[14px] py-[7px] rounded-lg transition-colors cursor-pointer"
          >
            Play Next ⏭
          </button>
        )}
      </div>
    </div>
  );
}
