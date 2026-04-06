export function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const videoId = parsed.searchParams.get("v");
    if (videoId) return videoId;

    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.slice(1) || null;
    }

    if (parsed.pathname.startsWith("/embed/")) {
      return parsed.pathname.slice(7) || null;
    }

    if (parsed.pathname.startsWith("/v/")) {
      return parsed.pathname.slice(3) || null;
    }

    return null;
  } catch {
    return null;
  }
}

export async function getYoutubeMetadata(
  videoId: string,
): Promise<{ title: string; youtubeId: string } | null> {
  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return {
      title: data.title ?? "Unknown title",
      youtubeId: videoId,
    };
  } catch {
    return null;
  }
}
