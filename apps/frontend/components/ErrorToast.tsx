"use client";

import { useRoom } from "@/app/hooks/useRoom";

export function ErrorToast() {
  const { roomError, clearError } = useRoom();

  if (!roomError) return null;

  const bgColor = {
    vote: "border-red-500/30 bg-red-500/10",
    song: "border-yellow-500/30 bg-yellow-500/10",
    connection: "border-orange-500/30 bg-orange-500/10",
    unknown: "border-gray-500/30 bg-gray-500/10",
  }[roomError.type];

  const textColor = {
    vote: "text-red-400",
    song: "text-yellow-400",
    connection: "text-orange-400",
    unknown: "text-gray-400",
  }[roomError.type];

  return (
    <div
      className={`fixed bottom-4 right-4 px-4 py-3 rounded-xl border ${bgColor} ${textColor} font-mono text-[12px] animate-in slide-in-from-bottom-4 fade-in duration-300 shadow-lg z-50 flex items-center gap-3 max-w-sm`}
    >
      <span className="text-lg">⚠️</span>
      <span className="flex-1">{roomError.message}</span>
      <button
        onClick={clearError}
        className="text-[#6B5F50] hover:text-[#F5EDD8] transition-colors text-lg leading-none cursor-pointer"
      >
        ×
      </button>
    </div>
  );
}
