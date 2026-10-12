import fallbackAnime from "./fallback-anime.json";

type JikanAnime = {
  mal_id: number;
  title: string;
  synopsis: string;
  url: string;
  episodes: number | null;
  images: {
    jpg: {
      image_url: string;
    };
  };
};

let cachedAnime: JikanAnime[] | null = null;
let expiresAt = 0;
let inFlightRequest: Promise<JikanAnime[]> | null = null;

const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const FAILURE_TTL_MS = 10 * 60 * 1000;
const FETCH_TIMEOUT_MS = 2500;

async function fetchOnce(): Promise<JikanAnime[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch("https://api.jikan.moe/v4/top/anime", {
      signal: controller.signal,
      next: { revalidate: 21600 },
    });

    if (!response.ok) {
      throw new Error(`Jikan API returned ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data?.data) || data.data.length === 0) {
      throw new Error("Unexpected Jikan response shape");
    }

    return data.data;
  } finally {
    clearTimeout(timeout);
  }
}

async function refresh(): Promise<JikanAnime[]> {
  try {
    const result = await fetchOnce();
    cachedAnime = result;
    expiresAt = Date.now() + CACHE_TTL_MS;
    return result;
  } catch (error) {
    console.error("Jikan fetch failed:", error);
    if (!cachedAnime) {
      cachedAnime = fallbackAnime as JikanAnime[];
    }
    expiresAt = Date.now() + FAILURE_TTL_MS;
    return cachedAnime;
  }
}

export async function getTopAnime(): Promise<JikanAnime[]> {
  if (cachedAnime) {
    if (Date.now() > expiresAt && !inFlightRequest) {
      inFlightRequest = refresh().finally(() => {
        inFlightRequest = null;
      });
    }
    return cachedAnime;
  }

  if (!inFlightRequest) {
    inFlightRequest = refresh().finally(() => {
      inFlightRequest = null;
    });
  }

  return inFlightRequest;
}