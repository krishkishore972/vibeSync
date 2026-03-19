import { NextRequest, NextResponse } from "next/server";
import { z } from "zod"
import { prisma } from "@/app/lib/db"
import { getServerSession } from "next-auth";
import { getYoutubeMetadata } from "@/app/lib/getYoutubeMetaData";

const YT_REGEX = /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com\/(?:watch\?(?!.*\blist=)(?:.*&)?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&]\S+)?$/

const CreateStreamSchema = z.object({
    roomId:z.string(),
    url: z.string()
})


export async function POST(req: NextRequest) {
    const session = await getServerSession();
    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthenticated" }, { status: 403 })
    }
    
    try {
        const data = CreateStreamSchema.parse(await req.json());
        if (!data.url.trim()) {
            return NextResponse.json(
                {
                    message: "YouTube link cannot be empty",
                },
                {
                    status: 400,
                },
            );
        }

        const isYt = data.url.match(YT_REGEX)
        const videoId = data.url ? data.url.match(YT_REGEX)?.[1] : null;
        if (!isYt || !videoId) {
            return NextResponse.json({
                message: "Invalid YouTube URL format"
            }, {
                status: 400,
            })
        }
        const meta = await getYoutubeMetadata(videoId);
        if (!meta) {
            return NextResponse.json({ message: "Could not fetch video details" }, { status: 400 })
        }
        const song = await prisma.song.create({
            data: {
                roomId:data.roomId,
                extractedId: videoId,
                url: data.url,
                type: "YouTube",
                userId: session.user.id,
                title: meta.title,
            }
        })
        return NextResponse.json({
            message: "stream added",
            id: song.id
        })
    } catch (error) {
        return NextResponse.json({
            message: "Err while creating stream"
        }, {
            status: 411
        })
    }
}


export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session?.user.id) {
            return NextResponse.json({
                message: "Unauthenticated"
            }, {
                status: 403
            })
        }
        const songs = await prisma.song.findMany({
            where: {
                userId: session.user.id
            }
        })
        return NextResponse.json({
            songs
        })
    } catch (error) {
        return NextResponse.json({
            message: "Err while getting streams of user"
        }, {
            status: 403
        })
    }
}