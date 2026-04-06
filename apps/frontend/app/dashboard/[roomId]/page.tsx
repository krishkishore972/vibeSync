import NowPlaying from "@/components/NowPlaying";
import AddSong from "@/components/AddSong";
import Queue from "@/components/Queue";
import { SideBar } from "@/components/SideBar";
import { RoomProvider } from "@/components/providers/RoomProvider";
import { RoomPageErrorBoundary } from "@/components/ErrorBoundary";
import { ComponentErrorBoundary } from "@/components/ComponentErrorBoundary";
import {
  NowPlayingFallback,
  QueueFallback,
  AddSongFallback,
  SideBarFallback,
} from "@/components/ErrorFallback";
import { ErrorToast } from "@/components/ErrorToast";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/db";
import { authOptions } from "@/app/lib/authOptions";

export default async function RoomPage({
  params,
}: {
  params: { roomId: string };
}) {
  const { roomId } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) redirect("/");

  const isHost = room.hostId === session.user.id;
  const hostId = room.hostId;

  return (
    <RoomPageErrorBoundary>
      <RoomProvider roomId={roomId} userId={session.user.id}>
        <ErrorToast />
        <div className="grid grid-cols-[60%_40%] h-screen overflow-hidden bg-[#0C0A08] text-[#F5EDD8] font-sans">
          {/* Main content */}
          <div className="flex flex-col p-6 gap-5 overflow-y-auto">
            <ComponentErrorBoundary fallback={<NowPlayingFallback />}>
              <NowPlaying isHost={isHost} />
            </ComponentErrorBoundary>
            <ComponentErrorBoundary fallback={<AddSongFallback />}>
              <AddSong roomId={roomId} userId={session.user.id} />
            </ComponentErrorBoundary>
          </div>

          {/* Sidebar column */}
          <div className="flex flex-col h-screen overflow-hidden border-l border-[#E8A030]/10">
            <div className="shrink-0">
              <ComponentErrorBoundary fallback={<SideBarFallback />}>
                <SideBar roomId={roomId} hostId={hostId} />
              </ComponentErrorBoundary>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto p-4 bg-[#0E0C0A]">
              <ComponentErrorBoundary fallback={<QueueFallback />}>
                <Queue roomId={roomId} />
              </ComponentErrorBoundary>
            </div>
          </div>
        </div>
      </RoomProvider>
    </RoomPageErrorBoundary>
  );
}
