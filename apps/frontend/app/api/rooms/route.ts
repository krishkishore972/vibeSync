import { prisma } from "@repo/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/lib/authOptions";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      {
        message: "Unauthenticated",
      },
      {
        status: 403,
      },
    );
  }

  const hostId = session?.user.id;

  try {
    const room = await prisma.room.create({
      data: {
        hostId: hostId,
      },
    });

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        currentRoomId: room.id,
      },
    });

    return NextResponse.json({
      roomId: room.id,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating room" },
      { status: 500 },
    );
  }
}
