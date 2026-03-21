import NowPlaying from "@/components/NowPlaying";
import AddSong from "@/components/AddSong";
import Queue from "@/components/Queue";
import { SideBar } from "@/components/SideBar";
import { RoomProvider } from "@/components/providers/RoomProvider";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/db";
import { authOptions } from "@/app/lib/authOptions";

export default async function RoomPage({ params }: { params: { roomId: string } }) {
    const { roomId } = await params;

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) redirect("/");

    const isHost = room.hostId === session.user.id;
    const hostId = room.hostId;

    return (
        <RoomProvider roomId={roomId} userId={session.user.id}>
            <div className="grid grid-cols-[1fr_300px] h-screen overflow-hidden bg-[#0C0A08] text-[#F5EDD8] font-sans">

                {/* Main content */}
                <div className="flex flex-col p-6 gap-5 overflow-y-auto">
                    <NowPlaying isHost={isHost} />
                    <Queue roomId={roomId} />
                    <AddSong roomId={roomId} userId={session.user.id} />
                </div>

                {/* Sidebar */}
                <SideBar roomId={roomId} hostId={hostId} />
            </div>
        </RoomProvider>
    );
}
