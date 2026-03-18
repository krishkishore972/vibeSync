import { NextRequest, NextResponse } from "next/server"
//@ts-ignore
import youtubesearchapi from "youtube-search-api"

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url")
  if (!url) return NextResponse.json({ error: "No URL" }, { status: 400 })

  try {
    const videoId = extractYouTubeId(url)
    if (!videoId) return NextResponse.json({ error: "Invalid URL" }, { status: 400 })

    const res = await youtubesearchapi.GetVideoDetails(videoId)
    if (!res?.thumbnail?.thumbnails) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    const thumbnails = [...res.thumbnail.thumbnails].sort(
      (a: { width: number }, b: { width: number }) => a.width - b.width
    )

    const fallback = "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg"

    return NextResponse.json({
      title: res.title ?? "Unknown title",
      youtubeId: videoId,
      smallImg: thumbnails.length > 1
        ? thumbnails[thumbnails.length - 2].url ?? fallback
        : thumbnails[0].url ?? fallback,
      bigImg: thumbnails[thumbnails.length - 1].url ?? fallback,
    })
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}

function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes("youtube.com")) return parsed.searchParams.get("v")
    if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1)
    return null
  } catch {
    return null
  }
}