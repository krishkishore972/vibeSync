"use client"

import { useRoom } from "@/app/hooks/useRoom"
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export function SideBar({ roomId, hostId }: {
    roomId: string;
    hostId: string;
}) {
    const { listners } = useRoom();
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<"room" | "listeners">("room");
    const router = useRouter();
    const shareLink = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/${roomId}`;

    async function createRoomHandler() {
        try {
            const { data } = await axios.post("/api/rooms");
            router.push(`/dashboard/${data.roomId}`);
        } catch (error) {
            console.error("Failed to create room:", error);
        }
    }

    function copyHandler() {
        navigator.clipboard.writeText(shareLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }

    return (
        <div className="flex flex-col h-full border-l border-[#E8A030]/10 bg-[#0E0C0A] p-4 gap-4">

            {/* Tab switcher */}
            <div className="flex gap-1 p-1 bg-[#161310] rounded-xl border border-[#E8A030]/8">
                {(["room", "listeners"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-[7px] rounded-lg font-mono text-[11px] tracking-[0.08em] uppercase transition-colors cursor-pointer
                            ${activeTab === tab
                                ? "bg-[#1E1A16] text-[#C8892A] border border-[#E8A030]/20"
                                : "text-[#4A4038] hover:text-[#6B5F50]"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* ── Room Tab ── */}
            {activeTab === "room" && (
                <div className="flex flex-col gap-3">

                    {/* Create room button */}
                    <button
                        onClick={createRoomHandler}
                        className="w-full py-[10px] rounded-xl bg-[#E8A030]/[0.08] hover:bg-[#E8A030]/[0.15] border border-[#E8A030]/20 text-[#C8892A] font-sans font-medium text-[13px] tracking-wide transition-colors cursor-pointer"
                    >
                        + Create Room
                    </button>

                    {/* Invite link */}
                    <div className="flex flex-col gap-2 bg-[#161310] border border-[#E8A030]/8 rounded-xl p-3">
                        <span className="font-mono text-[9px] tracking-[0.15em] text-[#4A4038] uppercase">
                            Invite link
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] text-[#C8892A] flex-1 truncate">
                                {shareLink}
                            </span>
                            <button
                                onClick={copyHandler}
                                className={`shrink-0 font-mono text-[11px] px-3 py-[5px] rounded-lg border transition-colors cursor-pointer
                                    ${copied
                                        ? "text-[#6B9A4A] border-[#6B9A4A]/30 bg-[#6B9A4A]/10"
                                        : "text-[#C8892A] border-[#E8A030]/20 bg-[#E8A030]/[0.06] hover:bg-[#E8A030]/[0.14]"
                                    }`}
                            >
                                {copied ? "Copied ✓" : "Copy"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Listeners Tab ── */}
            {activeTab === "listeners" && (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[9px] tracking-[0.15em] text-[#4A4038] uppercase">
                            In the room
                        </span>
                        <span className="font-mono text-[9px] tracking-[0.08em] text-[#C8892A]">
                            {listners.length}
                        </span>
                    </div>

                    {listners.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-24 gap-2 rounded-xl border border-[#E8A030]/8 bg-[#161310]">
                            <p className="font-mono text-[11px] tracking-[0.1em] text-[#4A4038] uppercase">
                                No listeners yet
                            </p>
                        </div>
                    ) : (
                        listners.map((listener) => (
                            <div
                                key={listener.userId}
                                className="flex items-center gap-3 px-3 py-[10px] rounded-xl border border-[#E8A030]/[0.06] bg-[#161310] hover:border-[#E8A030]/15 hover:bg-[#1E1A16] transition-colors"
                            >
                                {/* Avatar */}
                                <div className="w-8 h-8 rounded-full bg-[#E8A030]/[0.08] border border-[#E8A030]/15 flex items-center justify-center font-mono text-[11px] font-medium text-[#C8892A] shrink-0">
                                    {listener.userName?.substring(0, 2).toUpperCase() ?? "??"}
                                </div>

                                {/* Username */}
                                <span className="font-sans text-[13px] text-[#A89070] flex-1 truncate">
                                    @{listener.userName}
                                </span>

                                {/* Host badge */}
                                {listener.userId === hostId && (
                                    <span className="font-mono text-[9px] tracking-[0.08em] uppercase text-[#6B5F50] bg-[#E8A030]/[0.06] border border-[#E8A030]/10 px-[6px] py-[3px] rounded shrink-0">
                                        Host
                                    </span>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
