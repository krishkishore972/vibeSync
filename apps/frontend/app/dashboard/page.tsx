"use client";

import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status]);

  const [roomId, setRoomId] = useState("");

  async function createRoomHandler() {
    try {
      const { data } = await axios.post("/api/rooms");
      router.push(`/dashboard/${data.roomId}`);
    } catch (error) {
      console.error("err in dashBoard while creating room", error);
    }
  }

  function joinRoomHandler(input: string) {
    if (!input.trim()) return;
    let id = input.trim();
    try {
      const url = new URL(input.trim());

      const segments = url.pathname.split("/").filter(Boolean);
      id = segments[segments.length - 1];
    } catch (error: any) {
      throw new Error("err while fetching id", error);
    }
    router.push(`/dashboard/${id}`);
    setRoomId("");
  }

  if (status === "loading")
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0C0A08]">
        <span className="font-mono text-[11px] tracking-[0.2em] text-[#4A4038] uppercase animate-pulse">
          Loading...
        </span>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0C0A08] text-[#F5EDD8] font-sans flex items-center justify-center p-6">
      <div className="w-full max-w-sm flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] tracking-[0.25em] text-[#4A4038] uppercase">
            Welcome back
          </span>
          <h1 className="font-serif text-3xl font-medium text-[#C8B89A] leading-tight">
            Your stage awaits.
          </h1>
          <p className="font-mono text-[11px] text-[#4A4038] leading-relaxed">
            Create a room or join one with an ID.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#E8A030]/10" />

        {/* Create room */}
        <div className="flex flex-col gap-3">
          <span className="font-mono text-[9px] tracking-[0.2em] text-[#4A4038] uppercase">
            Start fresh
          </span>
          <button
            onClick={createRoomHandler}
            className="w-full py-3 rounded-xl bg-[#E8A030]/[0.08] hover:bg-[#E8A030]/[0.16] border border-[#E8A030]/20 hover:border-[#E8A030]/40 text-[#C8892A] font-mono text-[12px] tracking-[0.1em] uppercase transition-all duration-150 cursor-pointer"
          >
            + Create Room
          </button>
        </div>

        {/* OR separator */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#E8A030]/8" />
          <span className="font-mono text-[9px] tracking-[0.2em] text-[#4A4038] uppercase">
            or
          </span>
          <div className="flex-1 h-px bg-[#E8A030]/8" />
        </div>

        {/* Join room */}
        <div className="flex flex-col gap-3">
          <span className="font-mono text-[9px] tracking-[0.2em] text-[#4A4038] uppercase">
            Join existing
          </span>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Paste a room ID..."
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && joinRoomHandler(roomId)}
              className="w-full px-4 py-3 rounded-xl bg-[#161310] border border-[#E8A030]/[0.07] hover:border-[#E8A030]/20 focus:border-[#E8A030]/40 focus:outline-none text-[#C8B89A] font-mono text-[12px] placeholder:text-[#4A4038] transition-colors duration-150"
            />
            <button
              onClick={() => joinRoomHandler(roomId)}
              disabled={!roomId.trim()}
              className="w-full py-3 rounded-xl bg-[#C8892A] hover:bg-[#D4972E] disabled:bg-[#E8A030]/10 disabled:text-[#4A4038] disabled:cursor-not-allowed text-[#0C0A08] font-mono text-[12px] tracking-[0.1em] uppercase font-medium transition-all duration-150 cursor-pointer"
            >
              Join Room →
            </button>
          </div>
        </div>

        {session?.user && (
          <button
            onClick={() => signOut()}
            className="px-5 py-[8px] rounded-xl border border-[#E8A030]/20 bg-[#E8A030]/[0.07] hover:bg-[#E8A030]/[0.15] text-[#C8892A] font-mono text-[12px] tracking-[0.06em] transition-colors cursor-pointer"
          >
            Sign out
          </button>
        )}
        {/* Footer */}
        <div className="h-px bg-[#E8A030]/10" />
        <p className="font-mono text-[9px] tracking-[0.1em] text-[#4A4038] text-center">
          Logged in as{" "}
          <span className="text-[#6B5F50]">@{session?.user?.name}</span>
        </p>
      </div>
    </div>
  );
}
