"use client";

interface ErrorFallbackProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function NowPlayingFallback({ onRetry }: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center h-48 gap-3 rounded-2xl border border-red-500/20 bg-red-500/5">
      <div className="text-3xl">🎵</div>
      <h3 className="font-serif text-[13px] font-medium text-red-400">
        Player Error
      </h3>
      <p className="font-mono text-[10px] text-[#6B5F50] text-center">
        Unable to load player
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-3 py-1 rounded-lg bg-[#E8A030]/10 hover:bg-[#E8A030]/20 border border-[#E8A030]/30 text-[#C8892A] font-mono text-[10px] transition-colors cursor-pointer"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export function QueueFallback({ onRetry }: ErrorFallbackProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.15em] text-[#4A4038] uppercase">
          Up Next
        </span>
      </div>
      <div className="flex flex-col items-center justify-center h-28 gap-2 rounded-xl border border-red-500/20 bg-red-500/5">
        <div className="text-2xl opacity-50">♪</div>
        <p className="font-mono text-[11px] tracking-[0.1em] text-red-400/70 uppercase">
          Error loading queue
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-1 px-3 py-1 rounded-lg bg-[#E8A030]/10 hover:bg-[#E8A030]/20 border border-[#E8A030]/30 text-[#C8892A] font-mono text-[10px] transition-colors cursor-pointer"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

export function AddSongFallback() {
  return (
    <div className="flex gap-2 pt-2 pb-1 border-t border-[#E8A030]/10">
      <div className="flex-1 bg-[#161310] border border-[#E8A030]/10 rounded-xl px-4 py-[10px] opacity-50">
        <span className="font-mono text-[13px] text-[#4A4038]">
          Unable to load song input
        </span>
      </div>
      <div className="shrink-0 bg-[#E8A030]/[0.10] border border-[#E8A030]/20 text-[#C8892A] font-sans font-medium text-[13px] px-5 py-[10px] rounded-xl opacity-50">
        + Add
      </div>
    </div>
  );
}

export function SideBarFallback({ onRetry }: ErrorFallbackProps) {
  return (
    <div className="flex flex-col h-full border-l border-[#E8A030]/10 bg-[#0E0C0A] p-4 gap-4">
      <div className="flex gap-1 p-1 bg-[#161310] rounded-xl border border-[#E8A030]/8">
        <div className="flex-1 py-[7px] rounded-lg bg-[#1E1A16] border border-[#E8A030]/20" />
        <div className="flex-1 py-[7px] rounded-lg" />
      </div>
      <div className="flex flex-col items-center justify-center h-24 gap-2 rounded-xl border border-red-500/20 bg-red-500/5">
        <p className="font-mono text-[11px] tracking-[0.1em] text-red-400/70 uppercase">
          Sidebar Error
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1 rounded-lg bg-[#E8A030]/10 hover:bg-[#E8A030]/20 border border-[#E8A030]/30 text-[#C8892A] font-mono text-[10px] transition-colors cursor-pointer"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
