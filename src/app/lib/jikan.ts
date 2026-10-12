import fallbackAnime from "./fallback-anime.json";

export type JikanAnime = {
  mal_id: number;
  title: string;
  synopsis: string;
  url: string;
  score?: number | null;
  episodes: number | null;
  images: {
    jpg: {
      image_url: string;
    };
  };
};

const JIKAN_TOP_URL = "https://api.jikan.moe/v4/top/anime";
const REVALIDATE_SECONDS = 21600; // 6 timer
const FETCH_TIMEOUT_MS = 8000;

// Bruker Next sin data-cache (deles mellom alle Vercel-instanser),
// i stedet for en in-memory-variabel som forsvinner ved kald start.
export async function getTopAnime(): Promise<JikanAnime[]> {
  try {
    const response = await fetch(JIKAN_TOP_URL, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error(`Jikan API returned ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data?.data) || data.data.length === 0) {
      throw new Error("Unexpected Jikan response shape");
    }

    return data.data;
  } catch (error) {
    console.error("Jikan fetch failed, using fallback:", error);
    return fallbackAnime as JikanAnime[];
  }
}