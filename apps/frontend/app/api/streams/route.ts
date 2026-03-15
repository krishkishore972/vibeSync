import { NextRequest, NextResponse } from "next/server";
import { z } from "zod"
import { prisma } from "@/app/lib/db"
import { getServerSession } from "next-auth";
//@ts-ignore
import youtubesearchapi from "youtube-search-api";

const YT_REGEX = new RegExp("/^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com\/(?:watch\?(?!.*\blist=)(?:.*&)?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&]\S+)?$/;")

const CreateStreamSchema = z.object({
    createrid: z.string(),
    url: z.string()
})


export async function POST(req: NextRequest) {
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
        const videoId = data.url ? data.url.match(YT_REGEX)?.[1]:null;
        if (!isYt || ! videoId) {
            return NextResponse.json({
                message: "Invalid YouTube URL format"
            }, {
                status: 400,
            })
        }
        const res = await youtubesearchapi.GetVideoDetails(videoId);
        const stream = await prisma.stream.create({
            data: {
                extractedId: videoId,
                url: data.url,
                type: "YouTube",
                userId: data.createrid,
            }
        })
        return NextResponse.json({
            message: "stream added",
            id: stream.id
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
        const streams = await prisma.stream.findMany({
            where: {
                userId: session.user.id
            }
        })
        return NextResponse.json({
            streams
        })
    } catch (error) {
        return NextResponse.json({
            message: "Err while getting streams of user"
        }, {
            status: 403
        })
    }
}