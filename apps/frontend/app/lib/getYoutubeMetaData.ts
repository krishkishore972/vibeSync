//@ts-ignore
import youtubesearchapi from "youtube-search-api"
export async function getYoutubeMetadata(videoId: string) {
    const res = await youtubesearchapi.GetVideoDetails(videoId)     
    return {
        title: res.title ?? "Unknown title",
        youtubeId: videoId,
    }
}