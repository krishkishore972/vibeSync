import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/app/lib/db";


const DownvoteStream = z.object({
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
        const data = DownvoteStream.parse(await req.json())
        await prisma.upvotes.delete({
            where: {
               userId_streamId:{
                streamId:data.streamId,
                userId:session.user.id
               } 
            }
        })
    } catch (error) {
        return NextResponse.json({
            message: "Error while downvoting"
        }, {
            status: 403
        })
    }

}

