//@ts-ignore
import youtubesearchapi from "youtube-search-api";
export async function getYoutubeMetadata(videoId: string) {
  const res = await youtubesearchapi.GetVideoDetails(videoId);
  return {
    title: res.title ?? "Unknown title",
    youtubeId: videoId,
  };
}

export function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com"))
      return parsed.searchParams.get("v");
    if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1);
    return null;
  } catch {
    return null;
  }
}
