import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/app/lib/db";


const UpvoteStream = z.object({
    streamId: z.string()
})

export async function POST(req: NextRequest) {
    const session = await getServerSession();
    if (!session?.user.id) {
        return NextResponse.json({
            message: "Unauthenticated"
        }, {
            status: 403
        })
    }
    try {
        const data = UpvoteStream.parse(await req.json())
        await prisma.upvotes.create({
            data: {
                streamId: data.streamId,
                userId: session.user.id
            }
        })
    } catch (error) {
        return NextResponse.json({
            message: "Error while upvoting"
        }, {
            status: 403
        })
    }
}